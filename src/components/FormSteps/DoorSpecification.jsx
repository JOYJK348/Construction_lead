import React, { useState } from 'react';
import { Camera, MapPin, Loader2, CheckCircle2, AlertCircle, Sparkles, DoorOpen, Hash, X, ZoomIn, Trash2, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentLocation, getPlaceFromCoordinates } from '../../services/locationService';
import { compressImage } from '../../utils/imageUtils';

const DoorSpecification = ({ data, update, errors }) => {
    const [activeTab, setActiveTab] = useState('mainDoor');
    const [locationStatus, setLocationStatus] = useState({});
    const [loadingLocation, setLoadingLocation] = useState({});
    const [viewingPhoto, setViewingPhoto] = useState(null);

    const doorTypes = {
        mainDoor: { label: 'Main', icon: '🚪', color: 'from-blue-500 to-indigo-600', lightColor: 'bg-blue-50 text-blue-600' },
        interiorDoor: { label: 'Interior', icon: '🏠', color: 'from-indigo-500 to-purple-600', lightColor: 'bg-indigo-50 text-indigo-600' },
        bathroomDoor: { label: 'Bathroom', icon: '🚿', color: 'from-emerald-500 to-teal-600', lightColor: 'bg-emerald-50 text-emerald-600' },
        furtherDetails: { label: 'General', icon: '✨', color: 'from-amber-500 to-orange-600', lightColor: 'bg-amber-50 text-amber-600' }
    };

    const materialOptions = {
        mainDoor: ['Ready Made', 'Wooden', 'WPC', 'Others'],
        interiorDoor: ['Flush Door', 'Moulded Door', 'Laminated / Veneer', 'WPC', 'Other'],
        bathroomDoor: ['PVC/FRP', 'WPC', 'Water-proof Laminate', 'Other'],
        furtherDetails: ['Pooja Door', 'Balcony Door', 'Kitchen Door', 'Glass Door', 'Fire Exit', 'Other']
    };

    const handlePhotoUpload = async (doorType, event) => {
        const file = event.target.files[0];
        if (!file) return;

        setLoadingLocation(prev => ({ ...prev, [doorType]: true }));

        try {
            const location = await getCurrentLocation();
            const place = await getPlaceFromCoordinates(location.latitude, location.longitude);

            // Compress image before storing in state
            const compressedPhoto = await compressImage(file, { maxWidth: 1024, quality: 0.6 });

            update({
                ...data,
                [doorType]: {
                    ...data[doorType],
                    photo: compressedPhoto,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    villageName: place.villageName,
                    placeDetails: place.fullAddress
                }
            });

            setLocationStatus(prev => ({
                ...prev,
                [doorType]: {
                    success: true,
                    message: `${place.villageName}`
                }
            }));

        } catch (error) {
            console.error('Location Error:', error);
            setLocationStatus(prev => ({
                ...prev,
                [doorType]: {
                    success: false,
                    message: 'Location unavailable'
                }
            }));
        } finally {
            setLoadingLocation(prev => ({ ...prev, [doorType]: false }));
        }
    };

    const updateField = (doorType, field, value) => {
        update({
            ...data,
            [doorType]: {
                ...data[doorType],
                [field]: value
            }
        });
    };

    const deletePhoto = (doorType) => {
        update({
            ...data,
            [doorType]: {
                ...data[doorType],
                photo: null,
                latitude: null,
                longitude: null,
                villageName: null,
                placeDetails: null
            }
        });
        setLocationStatus(prev => {
            const newStatus = { ...prev };
            delete newStatus[doorType];
            return newStatus;
        });
    };

    const currentDoor = data[activeTab] || {};
    const currentMaterials = materialOptions[activeTab] || [];
    const activeDoorInfo = doorTypes[activeTab];

    const totalDoorsSpecified = Object.values(data).reduce((sum, door) => sum + (parseInt(door.quantity) || 0), 0);

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-left py-2"
            >
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                            <Layout className="text-indigo-600" size={24} />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Specifications</h2>
                    </div>
                    {totalDoorsSpecified > 0 && (
                        <div className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-1.5">
                            <CheckCircle2 size={12} className="text-emerald-600" />
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-tight">{totalDoorsSpecified} Doors</span>
                        </div>
                    )}
                </div>
                <p className="text-slate-500 text-sm font-medium ml-13">Add details for each door type</p>
            </motion.div>

            {/* Door Type Tabs - Horizontal Scroll */}
            <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
                <div className="flex gap-2.5 pb-2">
                    {Object.entries(doorTypes).map(([key, { label, icon, lightColor, color }]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`
                                flex items-center gap-2 px-4 py-3 rounded-2xl font-semibold text-sm transition-all whitespace-nowrap active:scale-95
                                ${activeTab === key
                                    ? `bg-slate-900 text-white shadow-lg ring-4 ring-slate-100`
                                    : 'bg-white text-slate-500 border border-slate-200'
                                }
                            `}
                        >
                            <span className="text-lg">{icon}</span>
                            <span>{label}</span>
                            {data[key]?.quantity > 0 && (
                                <span className={`ml-1 flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${activeTab === key ? 'bg-white text-slate-900' : 'bg-blue-50 text-blue-600'}`}>
                                    {data[key].quantity}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Active Door Form */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5"
                >
                    {/* Material Selection */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-widest">
                            <DoorOpen size={14} className="text-slate-400" />
                            Material Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {currentMaterials.map((material) => (
                                <button
                                    key={material}
                                    type="button"
                                    onClick={() => updateField(activeTab, 'material', material)}
                                    className={`
                                        p-3.5 rounded-xl font-medium text-xs transition-all border text-left flex flex-col justify-between h-20
                                        ${currentDoor.material === material
                                            ? `bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-100`
                                            : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-white hover:border-slate-200'
                                        }
                                    `}
                                >
                                    <span className="leading-tight">{material}</span>
                                    {currentDoor.material === material && <CheckCircle2 size={16} className="text-emerald-400 self-end" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity Row */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-widest">
                            <Hash size={14} className="text-slate-400" />
                            Quantity
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min="0"
                                value={currentDoor.quantity || ''}
                                onChange={(e) => updateField(activeTab, 'quantity', e.target.value)}
                                placeholder="0"
                                className="w-full px-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-3xl font-bold text-center text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Photo Capture Section */}
                    <div className="space-y-3 pt-2">
                        <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-widest">
                            <Camera size={14} className="text-slate-400" />
                            Site Photo
                        </label>

                        {!currentDoor.photo ? (
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={(e) => handlePhotoUpload(activeTab, e)}
                                    className="hidden"
                                    id={`photo-${activeTab}`}
                                    disabled={loadingLocation[activeTab]}
                                />
                                <label
                                    htmlFor={`photo-${activeTab}`}
                                    className={`
                                        flex flex-col items-center justify-center gap-3 w-full p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 cursor-pointer transition-all active:scale-[0.98]
                                        ${loadingLocation[activeTab] ? 'opacity-50' : 'hover:bg-slate-50 hover:border-slate-300'}
                                    `}
                                >
                                    {loadingLocation[activeTab] ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="animate-spin text-blue-600" size={32} />
                                            <div className="text-center">
                                                <p className="font-semibold text-sm text-slate-800">Processing...</p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Getting Geotag</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                                                <Camera className="text-blue-600" size={24} />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-semibold text-sm text-slate-800">Open Camera</p>
                                                <p className="text-[10px] text-slate-400 font-medium">Capture & Auto-Geotag Photo</p>
                                            </div>
                                        </>
                                    )}
                                </label>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative rounded-2xl overflow-hidden border border-slate-200 group aspect-[4/3] sm:aspect-video"
                            >
                                <img
                                    src={currentDoor.photo}
                                    alt="Door preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100" />

                                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-white">
                                        <div className="w-8 h-8 bg-black/40 backdrop-blur-md rounded-lg flex items-center justify-center">
                                            <MapPin size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">Captured At</p>
                                            <p className="text-xs font-bold">{currentDoor.villageName || 'Site Location'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setViewingPhoto({ photo: currentDoor.photo, villageName: currentDoor.villageName })}
                                            className="w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-xl flex items-center justify-center transition-all"
                                        >
                                            <ZoomIn size={18} />
                                        </button>
                                        <button
                                            onClick={() => deletePhoto(activeTab)}
                                            className="w-10 h-10 bg-red-500/80 backdrop-blur-md hover:bg-red-500 text-white rounded-xl flex items-center justify-center transition-all shadow-lg"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Error Message */}
            {
                errors?.general && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm font-semibold text-red-600 shadow-sm"
                    >
                        <AlertCircle size={18} />
                        <span>{errors.general}</span>
                    </motion.div>
                )
            }

            {/* Helper Text */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-2 text-xs text-slate-500 bg-blue-50/50 px-4 py-3 rounded-xl border border-blue-100"
            >
                <Sparkles size={14} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="font-medium">Switch between types using the tabs. Geotagging works best with live camera.</p>
            </motion.div>

            {/* Photo Viewer Modal */}
            <AnimatePresence>
                {viewingPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-0"
                        onClick={() => setViewingPhoto(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full h-full flex flex-col items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setViewingPhoto(null)}
                                className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all z-20"
                            >
                                <X size={24} />
                            </button>

                            <img
                                src={viewingPhoto.photo}
                                alt="Door full view"
                                className="max-w-full max-h-[85vh] object-contain"
                            />

                            <div className="absolute bottom-8 left-6 right-6 bg-black/40 backdrop-blur-md text-white p-5 rounded-3xl border border-white/10">
                                <p className="text-[10px] text-white/60 font-medium uppercase tracking-widest mb-1.5">Verified Site Location</p>
                                <p className="text-lg font-bold flex items-center gap-2">
                                    <MapPin size={20} className="text-blue-400" />
                                    {viewingPhoto.villageName}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DoorSpecification;
