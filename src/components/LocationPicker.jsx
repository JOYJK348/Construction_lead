import React, { useState, useEffect, useRef } from 'react';
import { MapPin, X, Navigation, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Google Maps-style Location Picker
 * User can visually see and confirm their exact location on a map
 */
const LocationPicker = ({ isOpen, onClose, onLocationSelect }) => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [mapError, setMapError] = useState(null);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    // Initialize map when modal opens
    useEffect(() => {
        if (isOpen && mapRef.current && !mapInstanceRef.current) {
            initializeMap();
        }
    }, [isOpen]);

    const initializeMap = async () => {
        try {
            // Load Leaflet (OpenStreetMap) - Free alternative to Google Maps
            if (!window.L) {
                // Dynamically load Leaflet CSS
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);

                // Dynamically load Leaflet JS
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                    script.onload = resolve;
                    script.onerror = reject;
                    document.body.appendChild(script);
                });
            }

            // Default location (India center) until GPS loads
            const defaultLat = 20.5937;
            const defaultLng = 78.9629;

            // Initialize map
            const map = window.L.map(mapRef.current).setView([defaultLat, defaultLng], 5);

            // Add OpenStreetMap tiles
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(map);

            mapInstanceRef.current = map;

            // Auto-get current location
            getCurrentLocationOnMap();

        } catch (error) {
            console.error('Map initialization error:', error);
            setMapError('Failed to load map. Please try again.');
        }
    };

    const getCurrentLocationOnMap = () => {
        setIsLoadingLocation(true);
        setMapError(null);

        if (!navigator.geolocation) {
            setMapError('Geolocation not supported by your browser');
            setIsLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const accuracy = position.coords.accuracy;

                const location = { lat, lng, accuracy };
                setCurrentLocation(location);
                setSelectedLocation(location);

                // Update map view
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.setView([lat, lng], 16);

                    // Remove old marker if exists
                    if (markerRef.current) {
                        markerRef.current.remove();
                    }

                    // Add marker with custom icon
                    const customIcon = window.L.divIcon({
                        className: 'custom-marker',
                        html: `<div style="
                            width: 40px; 
                            height: 40px; 
                            background: #10b981; 
                            border: 4px solid white; 
                            border-radius: 50%; 
                            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">
                            <div style="
                                width: 12px; 
                                height: 12px; 
                                background: white; 
                                border-radius: 50%;
                            "></div>
                        </div>`,
                        iconSize: [40, 40],
                        iconAnchor: [20, 20]
                    });

                    const marker = window.L.marker([lat, lng], {
                        icon: customIcon,
                        draggable: true
                    }).addTo(mapInstanceRef.current);

                    // Update location when marker is dragged
                    marker.on('dragend', async (e) => {
                        const newPos = e.target.getLatLng();
                        setSelectedLocation({
                            lat: newPos.lat,
                            lng: newPos.lng,
                            accuracy: null // Manually selected, no GPS accuracy
                        });
                    });

                    markerRef.current = marker;

                    // Add accuracy circle
                    window.L.circle([lat, lng], {
                        radius: accuracy,
                        color: '#10b981',
                        fillColor: '#10b981',
                        fillOpacity: 0.1,
                        weight: 2
                    }).addTo(mapInstanceRef.current);
                }

                setIsLoadingLocation(false);
            },
            (error) => {
                console.error('Geolocation error:', error);

                // Detailed error messages based on error code
                let errorMessage = 'Unable to get your location. ';

                if (error.code === 1) { // PERMISSION_DENIED
                    errorMessage = '📍 Location Permission Denied\n\n';
                    errorMessage += 'To enable location:\n\n';
                    errorMessage += '🔹 Chrome: Settings → Site Settings → Location → Allow\n';
                    errorMessage += '🔹 Safari: Settings → Privacy → Location Services → Safari → While Using\n\n';
                    errorMessage += 'Then refresh this page and try again.\n\n';
                    errorMessage += 'Or click on the map to manually select your location.';
                } else if (error.code === 2) { // POSITION_UNAVAILABLE
                    errorMessage = 'GPS signal not available. Please:\n\n';
                    errorMessage += '• Move outdoors or near a window\n';
                    errorMessage += '• Enable GPS in phone settings\n';
                    errorMessage += '• Or click on the map to select manually';
                } else if (error.code === 3) { // TIMEOUT
                    errorMessage = 'Location request timed out. Please:\n\n';
                    errorMessage += '• Check your GPS is enabled\n';
                    errorMessage += '• Try again or select manually on map';
                }

                setMapError(errorMessage);
                setIsLoadingLocation(false);

                // Allow manual selection by clicking on map
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.on('click', (e) => {
                        const { lat, lng } = e.latlng;

                        // Remove old marker
                        if (markerRef.current) {
                            markerRef.current.remove();
                        }

                        // Add new marker
                        const customIcon = window.L.divIcon({
                            className: 'custom-marker',
                            html: `<div style="
                                width: 40px; 
                                height: 40px; 
                                background: #3b82f6; 
                                border: 4px solid white; 
                                border-radius: 50%; 
                                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">
                                <div style="
                                    width: 12px; 
                                    height: 12px; 
                                    background: white; 
                                    border-radius: 50%;
                                "></div>
                            </div>`,
                            iconSize: [40, 40],
                            iconAnchor: [20, 20]
                        });

                        const marker = window.L.marker([lat, lng], {
                            icon: customIcon,
                            draggable: true
                        }).addTo(mapInstanceRef.current);

                        marker.on('dragend', (e) => {
                            const newPos = e.target.getLatLng();
                            setSelectedLocation({
                                lat: newPos.lat,
                                lng: newPos.lng,
                                accuracy: null
                            });
                        });

                        markerRef.current = marker;
                        setSelectedLocation({ lat, lng, accuracy: null });
                        setMapError(null); // Clear error once manually selected
                    });
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 30000,
                maximumAge: 0
            }
        );
    };

    const handleConfirmLocation = async () => {
        if (!selectedLocation) return;

        try {
            // Reverse geocode to get address
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedLocation.lat}&lon=${selectedLocation.lng}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'LeadPro Construction App'
                    }
                }
            );

            const data = await response.json();
            const address = data.address || {};

            // Format address
            const addressParts = [
                address.house_number,
                address.road || address.street,
                address.suburb || address.neighbourhood,
                address.village || address.town || address.city,
                address.state,
                address.postcode
            ].filter(Boolean);

            const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : data.display_name;

            // Return location data
            onLocationSelect({
                latitude: selectedLocation.lat,
                longitude: selectedLocation.lng,
                accuracy: selectedLocation.accuracy,
                address: fullAddress,
                villageName: address.village || address.suburb || address.town || address.city || 'Unknown Area'
            });

            onClose();
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            setMapError('Failed to get address. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <MapPin className="text-white" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white">Choose Your Location</h2>
                                <p className="text-xs text-blue-100 font-semibold">Drag the marker to adjust your exact position</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                        >
                            <X className="text-white" size={20} />
                        </button>
                    </div>

                    {/* Map Container */}
                    <div className="relative">
                        <div
                            ref={mapRef}
                            className="w-full h-[400px] bg-slate-100"
                            style={{ zIndex: 1 }}
                        />

                        {/* Loading Overlay */}
                        {isLoadingLocation && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                                <div className="text-center">
                                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-sm font-bold text-slate-700">Getting your location...</p>
                                    <p className="text-xs text-slate-500 mt-1">Please wait</p>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {mapError && (
                            <div className="absolute top-4 left-4 right-4 bg-red-50 border border-red-200 rounded-xl p-3 z-10">
                                <p className="text-sm font-bold text-red-700">{mapError}</p>
                            </div>
                        )}

                        {/* Recenter Button */}
                        {currentLocation && !isLoadingLocation && (
                            <button
                                onClick={getCurrentLocationOnMap}
                                className="absolute bottom-4 right-4 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 shadow-lg flex items-center gap-2 transition-all z-10"
                            >
                                <Navigation size={18} className="text-blue-600" />
                                <span className="text-sm font-bold text-slate-700">My Location</span>
                            </button>
                        )}
                    </div>

                    {/* Location Info */}
                    {selectedLocation && (
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Selected Coordinates</p>
                                    <p className="font-mono text-sm font-bold text-slate-700">
                                        {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                                    </p>
                                    {selectedLocation.accuracy && (
                                        <p className="text-xs text-slate-500 mt-1">
                                            Accuracy: ±{Math.round(selectedLocation.accuracy)}m
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="px-6 py-4 bg-white border-t border-slate-200 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmLocation}
                            disabled={!selectedLocation}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Check size={20} />
                            Confirm Location
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LocationPicker;
