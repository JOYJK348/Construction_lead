/**
 * Geolocation & Reverse Geocoding Service
 * Handles GPS coordinates and village name extraction with improved error handling
 * Optimized for EXACT real-time location tracking with multiple attempts
 */

// Get current GPS coordinates with maximum accuracy
export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject({
                code: 'NOT_SUPPORTED',
                message: 'Geolocation is not supported by your browser'
            });
            return;
        }

        // Check for secure context (required for geolocation on many mobile browsers)
        if (window.isSecureContext === false && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            console.warn("Geolocation API requires a secure context (HTTPS) on non-localhost origins.");
        }

        // Enhanced options for maximum accuracy
        const options = {
            enableHighAccuracy: true,  // Use GPS instead of network/wifi triangulation
            timeout: 30000,            // Increased timeout for better GPS lock
            maximumAge: 0              // Force fresh location, no cached data
        };

        const success = (position) => {
            const coords = position.coords;
            console.log('[LocationService] GPS Lock Acquired:', {
                lat: coords.latitude,
                lng: coords.longitude,
                accuracy: coords.accuracy,
                timestamp: new Date(position.timestamp).toLocaleString()
            });

            resolve({
                latitude: coords.latitude,
                longitude: coords.longitude,
                accuracy: coords.accuracy,
                altitude: coords.altitude,
                heading: coords.heading,
                speed: coords.speed,
                timestamp: position.timestamp
            });
        };

        const error = (err) => {
            console.error('[LocationService] GPS Error:', err);
            let errorMessage = 'Unable to retrieve location.';
            let errorCode = 'UNKNOWN';

            switch (err.code) {
                case err.PERMISSION_DENIED:
                    errorMessage = 'Location permission denied. Please enable location services in your browser settings.';
                    errorCode = 'PERMISSION_DENIED';
                    break;
                case err.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information is unavailable. Please check your GPS signal and ensure you are outdoors or near a window.';
                    errorCode = 'POSITION_UNAVAILABLE';
                    break;
                case err.TIMEOUT:
                    errorMessage = 'GPS signal timeout. Please move to an open area with clear sky view and try again.';
                    errorCode = 'TIMEOUT';
                    break;
                default:
                    errorMessage = 'An unknown error occurred getting location.';
            }

            // Specific check for insecure context error
            if (window.isSecureContext === false && window.location.hostname !== 'localhost') {
                errorMessage += ' (Note: Location access requires HTTPS on mobile devices)';
            }

            reject({ code: errorCode, message: errorMessage, originalError: err });
        };

        navigator.geolocation.getCurrentPosition(success, error, options);
    });
};

// Get high-precision location with multiple attempts
export const getHighPrecisionLocation = async (maxAttempts = 3) => {
    let bestLocation = null;
    let attempts = 0;

    console.log('[LocationService] Starting high-precision location tracking...');

    while (attempts < maxAttempts) {
        attempts++;
        console.log(`[LocationService] Attempt ${attempts}/${maxAttempts}`);

        try {
            const location = await getCurrentLocation();

            // First attempt or better accuracy found
            if (!bestLocation || location.accuracy < bestLocation.accuracy) {
                bestLocation = location;
                console.log(`[LocationService] New best accuracy: ±${Math.round(location.accuracy)}m`);
            }

            // If we got excellent accuracy (< 20m), stop trying
            if (location.accuracy < 20) {
                console.log('[LocationService] Excellent accuracy achieved!');
                break;
            }

            // If we got good accuracy (< 50m) and it's not the first attempt, accept it
            if (location.accuracy < 50 && attempts > 1) {
                console.log('[LocationService] Good accuracy achieved!');
                break;
            }

            // Wait a bit before next attempt (let GPS improve)
            if (attempts < maxAttempts) {
                console.log('[LocationService] Waiting for GPS to improve...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

        } catch (error) {
            console.error(`[LocationService] Attempt ${attempts} failed:`, error);

            // If we have at least one successful reading, use it
            if (bestLocation) {
                console.log('[LocationService] Using best available location from previous attempts');
                break;
            }

            // If this is the last attempt and we have nothing, throw error
            if (attempts === maxAttempts) {
                throw error;
            }
        }
    }

    if (!bestLocation) {
        throw new Error('Failed to get location after multiple attempts');
    }

    console.log('[LocationService] Final location:', {
        lat: bestLocation.latitude,
        lng: bestLocation.longitude,
        accuracy: `±${Math.round(bestLocation.accuracy)}m`,
        attempts
    });

    return bestLocation;
};

// Reverse geocode coordinates to get village/place name with enhanced details
export const getPlaceFromCoordinates = async (latitude, longitude, accuracy = null) => {
    try {
        console.log('[LocationService] Reverse Geocoding:', { latitude, longitude, accuracy });

        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'LeadPro Construction App'
                }
            }
        );

        if (!response.ok) throw new Error('Geocoding service unavailable');

        const data = await response.json();

        const address = data.address || {};

        // Helper to find the most relevant "village/area" name
        const villageName =
            address.village ||
            address.suburb ||
            address.neighbourhood ||
            address.town ||
            address.city_district ||
            address.city ||
            'Unknown Area';

        // Construct a clean, precise address string manually
        const addressParts = [
            address.house_number,
            address.road || address.street || address.pedestrian,
            address.suburb || address.neighbourhood || address.residential,
            address.village || address.town || address.city,
            address.state_district,
            address.state,
            address.postcode
        ].filter(Boolean); // Remove undefined/null/empty strings

        const preciseAddress = addressParts.length > 0 ? addressParts.join(', ') : data.display_name;

        console.log('[LocationService] Address Resolved:', {
            villageName,
            preciseAddress,
            accuracy: accuracy ? `${Math.round(accuracy)}m` : 'N/A'
        });

        return {
            success: true,
            villageName,
            fullAddress: preciseAddress,
            originalDisplayName: data.display_name,
            coordinates: {
                latitude,
                longitude,
                accuracy
            },
            details: {
                village: address.village,
                town: address.town,
                city: address.city,
                state: address.state,
                country: address.country,
                postcode: address.postcode,
                road: address.road,
                suburb: address.suburb
            }
        };
    } catch (error) {
        console.error('[LocationService] Reverse Geocoding Error:', error);
        return {
            success: false,
            error: error.message,
            villageName: 'Location unavailable',
            fullAddress: '',
            coordinates: {
                latitude,
                longitude,
                accuracy
            }
        };
    }
};

// Get location from photo metadata (simulated via current location)
export const getLocationFromPhoto = async (file) => {
    try {
        // In a real app, you might parse EXIF data here.
        // For this requirement, we strictly force current live location capture.
        const location = await getCurrentLocation();
        const place = await getPlaceFromCoordinates(location.latitude, location.longitude);

        return {
            ...location,
            ...place
        };
    } catch (error) {
        throw error;
    }
};
