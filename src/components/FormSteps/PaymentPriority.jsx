import React from 'react';
import { CreditCard, TrendingUp, Calendar, Tag, Sparkles, ChevronDown, Flame, Zap, Snowflake } from 'lucide-react';
import { motion } from 'framer-motion';
import { PAYMENT_METHODS, LEAD_SOURCES, PRIORITY_LEVELS } from '../../utils/models';
import ErrorMessage from './ErrorMessage';

const PaymentPriority = ({ data, update, errors = {} }) => {
    const handleChange = (field, value) => {
        update({ ...data, [field]: value });
    };

    const togglePaymentMethod = (method) => {
        handleChange('paymentMethods', [method]);
    };

    const priorityIcons = {
        'Hot': { icon: Flame, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', activeBg: 'bg-rose-600' },
        'Warm': { icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', activeBg: 'bg-amber-600' },
        'Cold': { icon: Snowflake, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', activeBg: 'bg-blue-600' }
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
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                        <CreditCard className="text-emerald-600" size={24} />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Payment & Bio</h2>
                </div>
                <p className="text-slate-500 text-sm font-medium ml-13">Classification and lead priority</p>
            </motion.div>

            {/* Main Info Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-6"
            >
                {/* Payment Methods */}
                <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-widest">
                        <CreditCard size={14} className="text-emerald-500" />
                        Payment Responsibility
                    </label>
                    <div className="relative">
                        <select
                            value={data.paymentMethods[0] || ''}
                            onChange={(e) => togglePaymentMethod(e.target.value)}
                            className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none appearance-none cursor-pointer text-sm"
                        >
                            <option value="">Select responsible party...</option>
                            {PAYMENT_METHODS.map((method) => (
                                <option key={method} value={method}>{method}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>
                    <ErrorMessage error={errors.paymentMethods} />
                </div>

                {/* Lead Source */}
                <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-widest">
                        <Tag size={14} className="text-blue-500" />
                        Channel / Lead Source
                    </label>
                    <div className="relative">
                        <select
                            value={data.leadSource}
                            onChange={(e) => handleChange('leadSource', e.target.value)}
                            className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none appearance-none cursor-pointer text-sm"
                        >
                            <option value="">Select lead source...</option>
                            {LEAD_SOURCES.map(source => (
                                <option key={source} value={source}>{source}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>
                    <ErrorMessage error={errors.leadSource} />
                </div>

                <div className="h-px bg-slate-50 w-full" />

                {/* Project Priority */}
                <div className="space-y-4">
                    <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-widest">
                        <TrendingUp size={14} className="text-indigo-500" />
                        Lead Classification
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {PRIORITY_LEVELS.map((priority) => {
                            const config = priorityIcons[priority];
                            const Icon = config.icon;
                            const isSelected = data.projectPriority === priority;

                            return (
                                <button
                                    key={priority}
                                    onClick={() => handleChange('projectPriority', priority)}
                                    className={`
                                        flex flex-col items-center justify-center p-4 rounded-2xl border transition-all active:scale-[0.98]
                                        ${isSelected
                                            ? `${config.activeBg} text-white border-transparent shadow-lg ring-4 ring-slate-50`
                                            : `${config.bg} ${config.border} ${config.color} hover:bg-white`
                                        }
                                    `}
                                >
                                    <Icon size={24} className="mb-2" />
                                    <span className="text-[11px] font-bold uppercase tracking-widest">{priority}</span>
                                </button>
                            );
                        })}
                    </div>
                    <ErrorMessage error={errors.projectPriority} />
                </div>
            </motion.div>

            {/* Interest Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4"
            >
                <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Sparkles size={16} className="text-amber-500" />
                    <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Additional Services</h3>
                </div>

                <div className="space-y-4">
                    <p className="text-sm text-slate-600 font-medium text-center px-2">
                        Would the customer be interested in our <span className="text-slate-900 font-bold">Interior Work</span> services?
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {['Yes', 'Maybe Later'].map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => handleChange('interiorWorkInterest', option)}
                                className={`
                                    py-3.5 px-4 rounded-xl font-bold text-xs transition-all border active:scale-95
                                    ${data.interiorWorkInterest === option
                                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-white'
                                    }
                                `}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Helper Text */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 text-xs text-slate-500 bg-emerald-50/50 px-4 py-3 rounded-xl border border-emerald-100"
            >
                <Sparkles size={14} className="text-emerald-600" />
                <p className="font-medium text-[11px]">Correct classification helps us prioritize your leads</p>
            </motion.div>
        </div>
    );
};

export default PaymentPriority;
