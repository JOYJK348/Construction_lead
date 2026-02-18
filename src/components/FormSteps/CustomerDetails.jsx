import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Users, Sparkles, Loader2, Calendar, Hash, AlertTriangle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorMessage from './ErrorMessage';
import { sanitizeName, sanitizeMobile, sanitizeEmail, sanitizeAddress } from '../../utils/validation';

const CustomerDetails = ({ data, update, errors = {} }) => {
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);

    // Auto-generate Lead Number if missing
    useEffect(() => {
        if (!data.leadNumber) {
            const now = new Date();
            const year = now.getFullYear();
            const randomId = Math.floor(10000 + Math.random() * 90000);
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const newLeadNumber = `CL-${year}-${randomId}-${seconds}`;
            update({ ...data, leadNumber: newLeadNumber });
        }
    }, []); // Run once on mount

    const handleChange = (field, value) => {
        update({ ...data, [field]: value });
    };

    const handleAvailabilityChange = (value) => {
        update({ ...data, isClientAvailable: value });
    };

    const captureCurrentLocation = async () => {
        setIsFetchingLocation(true);

        try {
            if (!navigator.geolocation) {
                throw new Error('Geolocation is not supported by your browser');
            }

            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    {
                        enableHighAccuracy: true,
                        timeout: 30000,
                        maximumAge: 0
                    }
                );
            });

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const accuracy = position.coords.accuracy;

            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'LeadPro Construction App'
                    }
                }
            );

            const geocodeData = await response.json();
            const address = geocodeData.address || {};

            const addressParts = [
                address.house_number,
                address.road || address.street || address.path,
                address.suburb || address.neighbourhood || address.hamlet,
                address.village || address.town || address.city || address.municipality,
                address.county || address.state_district,
                address.state,
                address.postcode
            ].filter(Boolean);

            let fullAddress = '';
            if (addressParts.length > 0) {
                fullAddress = addressParts.join(', ');
            } else {
                fullAddress = geocodeData.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            }

            const updatedData = {
                ...data,
                address: fullAddress,
                locationMetadata: {
                    latitude: latitude,
                    longitude: longitude,
                    accuracy: accuracy,
                    timestamp: new Date().toLocaleString('en-IN'),
                    villageName: address.village || address.suburb || address.town || address.city || address.municipality || 'Unknown Area',
                    source: 'gps_direct',
                    fullGeocode: geocodeData.display_name
                }
            };

            update(updatedData);
            setIsFetchingLocation(false);

        } catch (error) {
            console.error('Location capture error:', error);
            setIsFetchingLocation(false);
            let errorMessage = error.message || 'Failed to get location';
            if (error.code === 1) errorMessage = '❌ Location Permission Denied';
            else if (error.code === 2) errorMessage = '❌ GPS Signal Not Available';
            else if (error.code === 3) errorMessage = '⏱️ Location Request Timed Out';
            alert(errorMessage);
        }
    };

    return (
        <div className="space-y-5">
            {/* Header with Icon and Title */}
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                    <User size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">Customer Information</h2>
                <p className="text-sm text-slate-500">Let's start with the primary contact details</p>
            </div>

            {/* Client Availability Toggle */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <p className="text-sm font-semibold text-slate-700 mb-3">Is the Client / Person Available?</p>
                <div className="flex gap-3">
                    <label className="flex-1 cursor-pointer">
                        <input
                            type="radio"
                            name="isClientAvailable"
                            value="yes"
                            checked={data.isClientAvailable === 'yes'}
                            onChange={() => handleAvailabilityChange('yes')}
                            className="peer sr-only"
                        />
                        <div className="p-4 rounded-xl border-2 border-slate-200 bg-white text-slate-600 font-medium text-center transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700">
                            <User size={20} className="inline mr-2" />
                            Yes, Available
                        </div>
                    </label>
                    <label className="flex-1 cursor-pointer">
                        <input
                            type="radio"
                            name="isClientAvailable"
                            value="no"
                            checked={data.isClientAvailable === 'no'}
                            onChange={() => handleAvailabilityChange('no')}
                            className="peer sr-only"
                        />
                        <div className="p-4 rounded-xl border-2 border-slate-200 bg-white text-slate-600 font-medium text-center transition-all peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-700">
                            <AlertTriangle size={20} className="inline mr-2" />
                            Not Available
                        </div>
                    </label>
                </div>
            </div>

            {/* Conditional Forms */}
            <AnimatePresence mode="wait">
                {data.isClientAvailable === 'yes' ? (
                    <motion.div
                        key="available"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-5"
                    >
                        {/* Primary Contact Section */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                                <Sparkles size={20} className="text-blue-500" />
                                <h3 className="font-semibold text-slate-900">Primary Contact</h3>
                            </div>

                            {/* Customer Name */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Customer Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => handleChange('name', sanitizeName(e.target.value))}
                                        placeholder="e.g. Rajesh Kumar"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    />
                                </div>
                                <ErrorMessage error={errors.name} />
                            </div>

                            {/* Mobile Number */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Mobile Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="tel"
                                        value={data.mobile}
                                        onChange={(e) => handleChange('mobile', sanitizeMobile(e.target.value))}
                                        placeholder="98765 43210"
                                        required
                                        maxLength={10}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    />
                                </div>
                                <ErrorMessage error={errors.mobile} />
                            </div>

                            {/* Email (Optional) */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email <span className="text-slate-400 text-xs">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => handleChange('email', sanitizeEmail(e.target.value))}
                                        placeholder="rajesh@mail.com"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Site Location */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Site Location / Address <span className="text-red-500">*</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={captureCurrentLocation}
                                        disabled={isFetchingLocation}
                                        className={`text-xs font-medium px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${isFetchingLocation
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                : 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'
                                            }`}
                                    >
                                        {isFetchingLocation ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin" />
                                                Getting...
                                            </>
                                        ) : (
                                            <>
                                                <MapPin size={14} />
                                                Your Location
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <textarea
                                        value={data.address}
                                        onChange={(e) => handleChange('address', sanitizeAddress(e.target.value))}
                                        placeholder="Click 'Your Location' or type manually..."
                                        rows="3"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                                    />
                                </div>
                                {data.locationMetadata && (
                                    <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-green-700 font-medium">
                                            Location captured: {data.locationMetadata.villageName}
                                        </span>
                                    </div>
                                )}
                                <ErrorMessage error={errors.address} />
                            </div>
                        </div>

                        {/* Secondary Contact Section */}
                        <div className="bg-slate-50 rounded-2xl p-6 border-2 border-dashed border-slate-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                                    <Users size={20} className="text-slate-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Secondary Contact</h3>
                                    <p className="text-xs text-slate-500">Optional backup information</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={data.alternateContact}
                                    onChange={(e) => handleChange('alternateContact', sanitizeName(e.target.value))}
                                    placeholder="Alternate Contact Name"
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                />
                                <input
                                    type="tel"
                                    value={data.alternateNumber}
                                    onChange={(e) => handleChange('alternateNumber', sanitizeMobile(e.target.value))}
                                    placeholder="Alternate Mobile Number"
                                    maxLength={10}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                />
                                <textarea
                                    value={data.remarks}
                                    onChange={(e) => handleChange('remarks', sanitizeAddress(e.target.value))}
                                    placeholder="Special remarks or notes..."
                                    rows="2"
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    // Client Not Available Flow
                    <motion.div
                        key="unavailable"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-5"
                    >
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
                            <AlertTriangle className="text-orange-600 shrink-0 mt-0.5" size={20} />
                            <div>
                                <h3 className="font-semibold text-orange-900 mb-1">Client Unavailable Mode</h3>
                                <p className="text-sm text-orange-800">Capture the site location and basic info for future follow-up.</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                            {/* Site Location */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Site Location / Address <span className="text-red-500">*</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={captureCurrentLocation}
                                        disabled={isFetchingLocation}
                                        className={`text-xs font-medium px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${isFetchingLocation
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                : 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'
                                            }`}
                                    >
                                        {isFetchingLocation ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin" />
                                                Getting...
                                            </>
                                        ) : (
                                            <>
                                                <MapPin size={14} />
                                                Your Location
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <textarea
                                        value={data.address}
                                        onChange={(e) => handleChange('address', sanitizeAddress(e.target.value))}
                                        placeholder="Click 'Your Location' or type manually..."
                                        rows="3"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                                    />
                                </div>
                                {data.locationMetadata && (
                                    <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-green-700 font-medium">
                                            Location captured: {data.locationMetadata.villageName}
                                        </span>
                                    </div>
                                )}
                                <ErrorMessage error={errors.address} />
                            </div>

                            {/* Follow-up Date */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Follow-up Date <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="date"
                                        value={data.followUpDate}
                                        onChange={(e) => handleChange('followUpDate', e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    />
                                </div>
                                <ErrorMessage error={errors.followUpDate} />
                            </div>

                            {/* Estimated Doors */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Estimated Doors <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="number"
                                        value={data.estimatedDoorCount}
                                        onChange={(e) => handleChange('estimatedDoorCount', e.target.value)}
                                        placeholder="e.g. 10"
                                        required
                                        min="0"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    />
                                </div>
                                <ErrorMessage error={errors.estimatedDoorCount} />
                            </div>

                            {/* Remarks */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Site Observations / Remarks
                                </label>
                                <textarea
                                    value={data.remarks}
                                    onChange={(e) => handleChange('remarks', sanitizeAddress(e.target.value))}
                                    placeholder="Note down why client is unavailable or other site observations..."
                                    rows="3"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomerDetails;
