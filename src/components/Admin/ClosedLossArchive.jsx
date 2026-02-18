import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    XCircle, Eye, Calendar, User, MapPin, ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClosedLossArchive = ({ leads, onView }) => {
    const navigate = useNavigate();
    const [filterVillage, setFilterVillage] = useState('all');
    const [sortBy, setSortBy] = useState('loss_date_desc');

    // Filter only lost leads (Closed Permanently status)
    const lostLeads = leads.filter(l => l.status === 'Closed Permanently');

    // Get unique villages for the filter
    const villages = ['all', ...new Set(lostLeads.map(l => l.site_visits?.[0]?.village_name).filter(Boolean))].sort();

    // Filter leads based on selection
    const filteredLeads = lostLeads.filter(lead =>
        filterVillage === 'all' || lead.site_visits?.[0]?.village_name === filterVillage
    );

    // Sort leads
    const sortedLeads = [...filteredLeads].sort((a, b) => {
        switch (sortBy) {
            case 'loss_date_desc':
                return new Date(b.updated_at) - new Date(a.updated_at);
            case 'loss_date_asc':
                return new Date(a.updated_at) - new Date(b.updated_at);
            case 'name_asc':
                return (a.customer_details?.[0]?.customer_name || '').localeCompare(b.customer_details?.[0]?.customer_name || '');
            case 'name_desc':
                return (b.customer_details?.[0]?.customer_name || '').localeCompare(a.customer_details?.[0]?.customer_name || '');
            default:
                return 0;
        }
    });

    return (
        <div className="space-y-4 sm:space-y-6 pb-6">
            {/* Header - Mobile Optimized */}
            <div className="flex items-center gap-3 sm:gap-4">
                <button
                    onClick={() => navigate('/admin')}
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-slate-200 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm shrink-0"
                >
                    <ChevronLeft size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
                </button>
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-900 truncate">Closed Loss</h2>
                    <p className="text-slate-600 font-medium text-xs sm:text-sm mt-0.5">
                        {filteredLeads.length} incomplete {filterVillage !== 'all' ? `in ${filterVillage}` : 'records'}
                    </p>
                </div>
            </div>

            {/* Filter Card - Mobile Optimized */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 rounded-lg sm:rounded-xl flex items-center justify-center text-red-600">
                            <MapPin size={16} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-base font-bold text-slate-900">Filter by Village</h3>
                            <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-wide hidden sm:block">Select location</p>
                        </div>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-slate-200">
                        <Calendar size={12} className="sm:w-[14px] sm:h-[14px] text-slate-400" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent border-none text-[10px] sm:text-xs font-semibold text-slate-600 focus:ring-0 cursor-pointer p-0 appearance-none pr-3 sm:pr-4 outline-none"
                        >
                            <option value="loss_date_desc">Latest</option>
                            <option value="loss_date_asc">Oldest</option>
                            <option value="name_asc">A-Z</option>
                            <option value="name_desc">Z-A</option>
                        </select>
                    </div>
                </div>

                {/* Horizontal Scrolling Village Selector - Mobile Optimized */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                    {villages.map(v => (
                        <button
                            key={v}
                            onClick={() => setFilterVillage(v)}
                            className={`flex-shrink-0 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold transition-all border-2 ${filterVillage === v
                                ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-100'
                                : 'bg-slate-50 border-transparent text-slate-600 hover:border-slate-200 active:scale-95'
                                }`}
                        >
                            {v === 'all' ? '📍 All Locations' : v}
                        </button>
                    ))}
                </div>
            </div>

            {/* Archive Grid - Mobile Optimized */}
            {sortedLeads.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {sortedLeads.map(lead => (
                        <LossCard key={lead.id} lead={lead} onView={onView} />
                    ))}
                </div>
            ) : (
                <div className="bg-slate-50 rounded-2xl sm:rounded-3xl p-12 sm:p-16 text-center border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-sm">
                        <XCircle size={32} className="sm:w-10 sm:h-10 text-slate-300" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">No lost leads</h3>
                    <p className="text-sm sm:text-base text-slate-500 font-medium max-w-xs mx-auto">
                        No incomplete records for {filterVillage === 'all' ? 'any location' : filterVillage}
                    </p>
                </div>
            )}
        </div>
    );
};

// Loss Card Component - Mobile Optimized
const LossCard = ({ lead, onView }) => {
    const lossDate = lead.updated_at;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-red-100 hover:border-red-200 hover:shadow-lg transition-all active:scale-[0.99]"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                    <span className="inline-block px-2.5 sm:px-3 py-1 bg-red-50 text-red-700 rounded-lg text-[10px] sm:text-xs font-bold mb-1.5 sm:mb-2 border border-red-100">
                        {lead.lead_number}
                    </span>
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-1 truncate">
                        {lead.project_information?.[0]?.project_name || 'Unnamed Project'}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-1 truncate">
                        <User size={12} className="sm:w-[14px] sm:h-[14px] shrink-0" />
                        {lead.customer_details?.[0]?.customer_name || 'No Customer'}
                    </p>
                </div>
                <span className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-red-50 text-red-700 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-bold flex items-center gap-1 shrink-0 border border-red-100">
                    <XCircle size={10} className="sm:w-3 sm:h-3" />
                    <span className="hidden sm:inline">Lost</span>
                </span>
            </div>

            {/* Reason Section */}
            <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 mb-3">
                <p className="text-[10px] font-bold text-red-800 uppercase mb-1">Reason for Loss</p>
                <p className="text-xs text-red-900 line-clamp-2 italic">
                    "{lead.status_reason || 'No reason specified'}"
                </p>
            </div>

            {/* Details Section */}
            <div className="bg-slate-50 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 space-y-2 border border-slate-100">
                <div className="flex items-center justify-between text-[10px] sm:text-xs">
                    <span className="text-slate-500 font-semibold uppercase tracking-tight">Field Survey Person</span>
                    <span className="font-bold text-slate-900 truncate">
                        {lead.assignments?.[0]?.engineer?.full_name || 'Unassigned'}
                    </span>
                </div>
                <div className="flex items-center justify-between text-[10px] sm:text-xs pt-2 border-t border-slate-200">
                    <span className="text-slate-500 font-semibold uppercase tracking-tight">Closed On</span>
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                        <Calendar size={10} className="sm:w-3 sm:h-3" />
                        {new Date(lossDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </span>
                </div>
            </div>

            {/* View Button */}
            <button
                onClick={() => onView(lead)}
                className="w-full py-2 sm:py-2.5 bg-slate-900 hover:bg-black rounded-lg sm:rounded-xl font-semibold text-white text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
                <Eye size={14} className="sm:w-4 sm:h-4" />
                View Details
            </button>
        </motion.div>
    );
};

export default ClosedLossArchive;
