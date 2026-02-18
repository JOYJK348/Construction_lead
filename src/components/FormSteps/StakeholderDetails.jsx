import React from 'react';
import { Compass, Phone, HardHat, Sparkles, Users2, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ErrorMessage from './ErrorMessage';
import { sanitizeName, sanitizeMobile } from '../../utils/validation';

const StakeholderDetails = ({ data, update, errors = {} }) => {
    const handleChange = (field, value) => {
        update({ ...data, [field]: value });
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-left py-2"
            >
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                        <Users2 className="text-indigo-600" size={24} />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Stakeholders</h2>
                </div>
                <p className="text-slate-500 text-sm font-medium ml-13">Key contacts for this project</p>
            </motion.div>

            {/* Architect Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5"
            >
                <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Compass size={18} className="text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-800">Architect / Design Professional</h3>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Design Professional</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Architect Name */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-semibold text-slate-700 flex items-center gap-1 ml-1">
                            Name <span className="text-blue-500">*</span>
                        </label>
                        <div className="relative group">
                            <Compass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input
                                type="text"
                                value={data.architectName}
                                onChange={(e) => handleChange('architectName', sanitizeName(e.target.value))}
                                placeholder="Ar. Rajesh Kumar"
                                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-sm"
                            />
                        </div>
                        <ErrorMessage error={errors.architectName} />
                    </div>

                    {/* Architect Contact */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-semibold text-slate-700 flex items-center gap-1 ml-1">
                            Contact Number <span className="text-blue-500">*</span>
                        </label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input
                                type="tel"
                                value={data.architectContact}
                                onChange={(e) => handleChange('architectContact', sanitizeMobile(e.target.value))}
                                placeholder="98765 43210"
                                maxLength={10}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-sm tracking-widest"
                            />
                        </div>
                        <ErrorMessage error={errors.architectContact} />
                    </div>
                </div>
            </motion.div>

            {/* Contractor Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5"
            >
                <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
                    <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
                        <HardHat size={18} className="text-orange-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-800">Contractor</h3>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Construction Partner</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Contractor Name */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-semibold text-slate-700 flex items-center gap-1 ml-1">
                            Name <span className="text-blue-500">*</span>
                        </label>
                        <div className="relative group">
                            <HardHat className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input
                                type="text"
                                value={data.contractorName}
                                onChange={(e) => handleChange('contractorName', sanitizeName(e.target.value))}
                                placeholder="BuildWell Constructions"
                                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-sm"
                            />
                        </div>
                        <ErrorMessage error={errors.contractorName} />
                    </div>

                    {/* Contractor Contact */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-semibold text-slate-700 flex items-center gap-1 ml-1">
                            Contact Number <span className="text-blue-500">*</span>
                        </label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input
                                type="tel"
                                value={data.contractorContact}
                                onChange={(e) => handleChange('contractorContact', sanitizeMobile(e.target.value))}
                                placeholder="98765 43210"
                                maxLength={10}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-sm tracking-widest"
                            />
                        </div>
                        <ErrorMessage error={errors.contractorContact} />
                    </div>
                </div>
            </motion.div>

            {/* Portfolio Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4"
            >
                <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Sparkles size={16} className="text-indigo-600" />
                    <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Portfolio Details</h3>
                </div>

                <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-slate-700 flex items-center gap-1 ml-1">
                        Other Ongoing Sites <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative group">
                        <Building2 className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <textarea
                            value={data.otherOngoingProjects}
                            onChange={(e) => handleChange('otherOngoingProjects', e.target.value)}
                            placeholder="e.g. Madurai (Site A), Trichy (Site B)..."
                            className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none min-h-[100px] resize-none text-sm"
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default StakeholderDetails;
