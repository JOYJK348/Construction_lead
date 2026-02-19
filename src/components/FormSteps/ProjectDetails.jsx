import React from 'react';
import { Building2, Calendar, Hash, Sparkles, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { BUILDING_TYPES, CONSTRUCTION_STAGES } from '../../utils/models';
import ErrorMessage from './ErrorMessage';
import { sanitizeNumber, sanitizeAddress } from '../../utils/validation';

const ProjectDetails = ({ data, update, errors = {} }) => {
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
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Building2 className="text-blue-600" size={24} />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Project Details</h2>
                </div>
                <p className="text-slate-500 text-sm font-medium ml-13">Details about the construction project</p>
            </motion.div>

            {/* Main Project Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5"
            >
                <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Sparkles size={16} className="text-blue-600" />
                    <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Basic Information</h3>
                </div>

                {/* Project Name */}
                <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-slate-700 flex items-center gap-1 ml-1">
                        Project Name <span className="text-blue-500">*</span>
                    </label>
                    <div className="relative group">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <input
                            type="text"
                            value={data.projectName}
                            onChange={(e) => handleChange('projectName', sanitizeAddress(e.target.value))}
                            placeholder="e.g. Green Valley Residency"
                            className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-sm"
                        />
                    </div>
                    <ErrorMessage error={errors.projectName} />
                </div>

                {/* Building Type & Construction Stage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Building Type */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-semibold text-slate-700 flex items-center gap-1 ml-1">
                            Building Type <span className="text-blue-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                value={data.buildingType}
                                onChange={(e) => handleChange('buildingType', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none appearance-none cursor-pointer text-sm"
                            >
                                <option value="">Select type...</option>
                                {BUILDING_TYPES.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>
                        <ErrorMessage error={errors.buildingType} />
                    </div>

                    {/* Construction Stage */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-semibold text-slate-700 flex items-center gap-1 ml-1">
                            Construction Stage <span className="text-blue-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                value={data.constructionStage}
                                onChange={(e) => handleChange('constructionStage', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none appearance-none cursor-pointer text-sm"
                            >
                                <option value="">Select stage...</option>
                                {CONSTRUCTION_STAGES.map((stage) => (
                                    <option key={stage} value={stage}>{stage}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>
                        <ErrorMessage error={errors.constructionStage} />
                    </div>
                </div>

                {/* Door Requirement Timeline */}
                <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-slate-700 flex items-center gap-1 ml-1">
                        Requirement Timeline <span className="text-blue-500">*</span>
                    </label>
                    <div
                        className="relative group cursor-pointer"
                        onClick={(e) => {
                            const input = e.currentTarget.querySelector('input');
                            if (input && input.showPicker) input.showPicker();
                        }}
                    >
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <input
                            type="date"
                            value={data.doorRequirementTimeline}
                            onChange={(e) => handleChange('doorRequirementTimeline', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-sm cursor-pointer"
                        />
                    </div>
                    <ErrorMessage error={errors.doorRequirementTimeline} />
                </div>

                {/* Total Door Count */}
                <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-slate-700 flex items-center gap-1 ml-1">
                        Est. Door Count <span className="text-blue-500">*</span>
                    </label>
                    <div className="relative group">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <input
                            type="number"
                            value={data.estimatedTotalDoorCount}
                            onChange={(e) => handleChange('estimatedTotalDoorCount', sanitizeNumber(e.target.value))}
                            placeholder="e.g. 15"
                            className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-sm"
                        />
                    </div>
                    <ErrorMessage error={errors.estimatedTotalDoorCount} />
                </div>
            </motion.div>

            {/* Helper Text */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 text-xs text-slate-500 bg-blue-50/50 px-4 py-3 rounded-xl border border-blue-100"
            >
                <Sparkles size={14} className="text-blue-600" />
                <p className="font-medium">Accurate details help us provide better recommendations</p>
            </motion.div>
        </div>
    );
};

export default ProjectDetails;
