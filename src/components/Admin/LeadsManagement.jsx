import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, Download, Eye, CheckCircle, XCircle, Clock,
    User, MapPin, Calendar, FileText, AlertCircle, Plus, X
} from 'lucide-react';
import { supabase } from '../../supabase';
import { approveLead, rejectLead, closePermanently } from '../../services/leadService';

const LeadsManagement = ({ leads, fetchLeads, onView, onNewLead, title = "Leads Management" }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterVillage, setFilterVillage] = useState('all');
    const [filterSurveyPerson, setFilterSurveyPerson] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [showCloseModal, setShowCloseModal] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [closeReason, setCloseReason] = useState('');
    const [sortBy, setSortBy] = useState('date_desc');

    React.useEffect(() => {
        if (showReasonModal || showCloseModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showReasonModal, showCloseModal]);

    // Get unique villages and survey persons for filters
    const villages = [...new Set(leads.map(l => l.site_visits?.[0]?.village_name).filter(Boolean))];
    const surveyPersons = [...new Set(leads.map(l => l.assignments?.[0]?.engineer?.full_name).filter(Boolean))];

    // Filter and sort leads
    let filteredLeads = leads.filter(lead => {
        const matchesSearch =
            String(lead.lead_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(lead.customer_details?.[0]?.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(lead.project_information?.[0]?.project_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(lead.assignments?.[0]?.engineer?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase());

        const isMaster = lead.status === 'Master';
        const isClosed = lead.status === 'Closed Permanently';
        const matchesStatus = filterStatus === 'all' ? (!isMaster && !isClosed) : lead.status === filterStatus;
        const matchesVillage = filterVillage === 'all' || lead.site_visits?.[0]?.village_name === filterVillage;
        const matchesSurveyPerson = filterSurveyPerson === 'all' || lead.assignments?.[0]?.engineer?.full_name === filterSurveyPerson;

        return matchesSearch && matchesStatus && matchesVillage && matchesSurveyPerson;
    });

    // Sort leads
    filteredLeads = filteredLeads.sort((a, b) => {
        switch (sortBy) {
            case 'date_desc':
                return new Date(b.created_at) - new Date(a.created_at);
            case 'date_asc':
                return new Date(a.created_at) - new Date(b.created_at);
            case 'name_asc':
                return (a.customer_details?.[0]?.customer_name || '').localeCompare(b.customer_details?.[0]?.customer_name || '');
            case 'name_desc':
                return (b.customer_details?.[0]?.customer_name || '').localeCompare(a.customer_details?.[0]?.customer_name || '');
            default:
                return 0;
        }
    });

    const handleApprove = async (lead) => {
        const result = await approveLead(lead);
        if (result.success) {
            fetchLeads();
        } else {
            alert('Approve failed: ' + result.error?.message);
        }
    };

    const handleReject = (lead) => {
        setSelectedLead(lead);
        setShowReasonModal(true);
    };

    const submitRejection = async () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }

        const result = await rejectLead(selectedLead, rejectionReason);
        if (result.success) {
            setShowReasonModal(false);
            setRejectionReason('');
            setSelectedLead(null);
            fetchLeads();
        } else {
            alert('Reject failed: ' + result.error?.message);
        }
    };

    const handleClosePermanently = (lead) => {
        setSelectedLead(lead);
        setShowCloseModal(true);
    };

    const confirmClosePermanently = async () => {
        if (!selectedLead) return;
        if (!closeReason.trim()) {
            alert('Please provide a reason for closing as loss');
            return;
        }

        const result = await closePermanently(selectedLead, closeReason);
        if (result.success) {
            setShowCloseModal(false);
            setCloseReason('');
            setSelectedLead(null);
            fetchLeads();
        } else {
            alert('Close failed: ' + result.error?.message);
        }
    };



    const activeFiltersCount = [filterStatus, filterVillage, filterSurveyPerson].filter(f => f !== 'all').length;

    return (
        <div className="space-y-4 sm:space-y-6 pb-6">
            {/* Header - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">{title}</h2>
                    <p className="text-slate-600 font-medium text-sm sm:text-base mt-0.5 sm:mt-1">
                        {filteredLeads.length} of {leads.length} leads
                    </p>
                </div>
                <button
                    onClick={onNewLead}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
                >
                    <Plus size={18} className="sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Create New Lead</span>
                    <span className="sm:hidden">New Lead</span>
                </button>
            </div>

            {/* Search & Filters Card - Mobile Optimized */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 border border-slate-200 shadow-sm space-y-3 sm:space-y-4">
                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-medium text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`
                            px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-95
                            ${showFilters || activeFiltersCount > 0
                                ? 'bg-indigo-50 text-indigo-600 border-2 border-indigo-200'
                                : 'bg-slate-50 text-slate-700 border-2 border-slate-200 hover:bg-slate-100'}
                        `}
                    >
                        <Filter size={16} className="sm:w-[18px] sm:h-[18px]" />
                        <span className="hidden sm:inline">Filters</span>
                        {activeFiltersCount > 0 && (
                            <span className="min-w-[18px] h-[18px] px-1 bg-indigo-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Filter Panel - Mobile Optimized */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-200">
                                <div>
                                    <label className="text-[10px] sm:text-xs font-semibold text-slate-700 mb-1.5 block">Status</label>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border-2 border-slate-200 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm text-slate-900 focus:border-indigo-500 outline-none"
                                    >
                                        <option value="all">All Active</option>
                                        <option value="Roaming">Under Construction</option>
                                        <option value="Temporarily Closed">Pending</option>
                                        <option value="Closed Permanently">Closed Loss</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] sm:text-xs font-semibold text-slate-700 mb-1.5 block">Village</label>
                                    <select
                                        value={filterVillage}
                                        onChange={(e) => setFilterVillage(e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border-2 border-slate-200 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm text-slate-900 focus:border-indigo-500 outline-none"
                                    >
                                        <option value="all">All Villages</option>
                                        {villages.map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] sm:text-xs font-semibold text-slate-700 mb-1.5 block">Field Survey Person</label>
                                    <select
                                        value={filterSurveyPerson}
                                        onChange={(e) => setFilterSurveyPerson(e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border-2 border-slate-200 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm text-slate-900 focus:border-indigo-500 outline-none"
                                    >
                                        <option value="all">All Survey Persons</option>
                                        {surveyPersons.map(e => <option key={e} value={e}>{e}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] sm:text-xs font-semibold text-slate-700 mb-1.5 block">Sort By</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border-2 border-slate-200 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm text-slate-900 focus:border-indigo-500 outline-none"
                                    >
                                        <option value="date_desc">Newest First</option>
                                        <option value="date_asc">Oldest First</option>
                                        <option value="name_asc">Name A-Z</option>
                                        <option value="name_desc">Name Z-A</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>


            </div>

            {/* Leads Grid - Mobile Optimized */}
            {filteredLeads.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                    {filteredLeads.map(lead => (
                        <LeadCard
                            key={lead.id}
                            lead={lead}
                            onView={onView}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            onClosePermanently={handleClosePermanently}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl sm:rounded-3xl p-12 sm:p-16 text-center border border-slate-200">
                    <AlertCircle size={48} className="sm:w-16 sm:h-16 mx-auto text-slate-300 mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2">No leads found</h3>
                    <p className="text-sm sm:text-base text-slate-600 font-medium">Try adjusting your search or filters</p>
                </div>
            )}

            {/* Rejection Modal - Mobile Optimized */}
            <AnimatePresence>
                {showReasonModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
                        onClick={() => setShowReasonModal(false)}
                    >
                        <motion.div
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white p-5 sm:p-8 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Rejection Reason</h3>
                                <button
                                    onClick={() => setShowReasonModal(false)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <p className="text-slate-600 font-medium text-sm sm:text-base mb-4 sm:mb-6">
                                Explain why lead <span className="font-bold text-slate-900">{selectedLead?.lead_number}</span> needs changes
                            </p>
                            <textarea
                                className="w-full h-28 sm:h-32 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-medium text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 outline-none transition-all resize-none mb-4 sm:mb-6"
                                placeholder="Enter detailed reason for rejection..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            />
                            <div className="flex gap-2 sm:gap-3">
                                <button
                                    onClick={() => {
                                        setShowReasonModal(false);
                                        setRejectionReason('');
                                        setSelectedLead(null);
                                    }}
                                    className="flex-1 py-2.5 sm:py-3 px-4 font-semibold text-sm sm:text-base text-slate-600 hover:bg-slate-100 rounded-xl transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitRejection}
                                    className="flex-1 py-2.5 sm:py-3 px-4 bg-red-500 text-white rounded-xl font-semibold text-sm sm:text-base hover:bg-red-600 transition-all shadow-lg active:scale-95"
                                >
                                    Confirm Reject
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Close Permanently Confirmation Modal */}
            <AnimatePresence>
                {showCloseModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
                        onClick={() => setShowCloseModal(false)}
                    >
                        <motion.div
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white p-6 sm:p-8 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-4 shadow-sm border border-red-100">
                                    <XCircle size={32} />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Close as Loss</h3>
                                <p className="text-slate-600 font-medium text-sm sm:text-base mb-6 px-2">
                                    Explain why project <span className="font-bold text-slate-900">#{selectedLead?.lead_number}</span> is being marked as a loss.
                                </p>

                                <textarea
                                    className="w-full h-28 sm:h-32 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-medium text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 outline-none transition-all resize-none mb-6"
                                    placeholder="Enter reason for loss (e.g., Client cancelled, Price issue, etc.)..."
                                    value={closeReason}
                                    onChange={(e) => setCloseReason(e.target.value)}
                                />

                                <div className="flex flex-col sm:flex-row gap-3 w-full">
                                    <button
                                        onClick={() => {
                                            setShowCloseModal(false);
                                            setCloseReason('');
                                            setSelectedLead(null);
                                        }}
                                        className="flex-1 py-3.5 px-4 font-bold text-sm sm:text-base text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-95"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmClosePermanently}
                                        className="flex-1 py-3.5 px-4 bg-red-600 text-white rounded-xl font-bold text-sm sm:text-base hover:bg-red-700 transition-all shadow-lg active:scale-95"
                                    >
                                        Confirm Loss
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Lead Card Component - Mobile Optimized
const LeadCard = ({ lead, onView, onApprove, onReject, onClosePermanently }) => {
    const project = Array.isArray(lead.project_information) ? lead.project_information[0] : lead.project_information;
    const customer = Array.isArray(lead.customer_details) ? lead.customer_details[0] : lead.customer_details;

    const projName = String(project?.project_name || '').toLowerCase();
    const custName = String(customer?.customer_name || '').toLowerCase();
    const isWaiting = projName.includes('unknown') || custName.includes('unavailable') || custName.includes('unknown');

    const statusConfig = {
        'Master': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', label: 'Closed Won', icon: CheckCircle },
        'Roaming': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', label: 'Under Construction', icon: Clock },
        'Temporarily Closed': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', label: 'Pending', icon: AlertCircle },
        'Closed Permanently': { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200', label: 'Closed Loss', icon: XCircle },
        'Waiting': { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100', label: 'Waiting', icon: Clock }
    };

    const effectiveStatus = isWaiting ? 'Waiting' : lead.status;
    const status = statusConfig[effectiveStatus] || { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100', label: effectiveStatus || 'Unknown', icon: FileText };
    const StatusIcon = status.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
                bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-2 transition-all group
                ${lead.status === 'Roaming' ? 'border-blue-200 shadow-sm' : 'border-slate-200'}
                hover:border-indigo-300 hover:shadow-md active:scale-[0.99]
            `}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                        <span className="inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] sm:text-xs font-bold border border-indigo-100">
                            {lead.lead_number}
                        </span>
                        {lead.status === 'Roaming' && (
                            <span className="animate-pulse flex h-2 w-2 rounded-full bg-blue-600"></span>
                        )}
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-1 truncate">
                        {lead.project_information?.[0]?.project_name || 'Unnamed Project'}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-1 truncate">
                        <User size={12} className="sm:w-[14px] sm:h-[14px] shrink-0" />
                        {lead.customer_details?.[0]?.customer_name || 'No Customer'}
                    </p>
                </div>
                <span className={`
                    px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-bold uppercase 
                    flex items-center gap-1 shrink-0 border
                    ${status.bg} ${status.text} ${status.border}
                `}>
                    <StatusIcon size={10} className="sm:w-3 sm:h-3" />
                    <span className="hidden sm:inline">{status.label}</span>
                </span>
            </div>

            {/* Details Section */}
            <div className="bg-slate-50 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 space-y-2 border border-slate-100">
                <div className="flex items-center justify-between text-[10px] sm:text-xs">
                    <span className="text-slate-500 font-semibold uppercase tracking-tight">Field Survey Person</span>
                    <span className="font-bold text-slate-900 truncate max-w-[140px] sm:max-w-[180px]">
                        {lead.assignments?.[0]?.engineer?.full_name || 'Unassigned'}
                    </span>
                </div>
                <div className="flex items-center justify-between text-[10px] sm:text-xs">
                    <span className="text-slate-500 font-semibold uppercase tracking-tight">Location</span>
                    <span className="font-bold text-slate-900 truncate max-w-[140px] sm:max-w-[180px]">
                        {lead.site_visits?.[0]?.village_name || 'No Location'}
                    </span>
                </div>
                <div className="flex items-center justify-between text-[10px] sm:text-xs pt-2 border-t border-slate-200">
                    <span className="text-slate-500 font-semibold uppercase tracking-tight">Date</span>
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                        <Calendar size={10} className="sm:w-3 sm:h-3" />
                        {new Date(lead.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
                <div className="flex gap-2">
                    <button
                        onClick={() => onView(lead)}
                        className="flex-1 py-2 sm:py-2.5 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-lg sm:rounded-xl font-semibold text-slate-700 text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                        <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
                        View
                    </button>

                    {lead.status === 'Roaming' && (
                        <button
                            onClick={() => onApprove(lead)}
                            className="flex-1 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg sm:rounded-xl font-semibold text-white text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                            <CheckCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                            Approve
                        </button>
                    )}
                </div>

                {lead.status === 'Roaming' && (
                    <button
                        onClick={() => onReject(lead)}
                        className="w-full py-2 sm:py-2.5 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-lg sm:rounded-xl font-semibold text-red-600 text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                        <XCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                        <span className="hidden sm:inline">Reject / Needs Update</span>
                        <span className="sm:hidden">Reject</span>
                    </button>
                )}

                {(lead.status === 'Roaming' || lead.status === 'Temporarily Closed') && (
                    <button
                        onClick={() => onClosePermanently(lead)}
                        className="w-full py-2 sm:py-2.5 bg-slate-50 hover:bg-slate-900 border border-slate-200 hover:text-white rounded-lg sm:rounded-xl font-bold text-slate-400 text-[10px] sm:text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                        <X size={14} /> Close as Loss
                    </button>
                )}

                {(lead.status === 'Temporarily Closed' || lead.status === 'Closed Permanently') && (
                    <div className={`
                        flex items-center gap-2 p-2.5 sm:p-3 rounded-lg sm:rounded-xl border
                        ${lead.status === 'Closed Permanently' ? 'bg-slate-50 border-slate-200' : 'bg-amber-50 border-amber-200'}
                    `}>
                        <AlertCircle size={14} className={`sm:w-4 sm:h-4 shrink-0 ${lead.status === 'Closed Permanently' ? 'text-slate-600' : 'text-amber-600'}`} />
                        <div className="flex-1 min-w-0">
                            <p className={`text-[9px] sm:text-[10px] font-bold uppercase ${lead.status === 'Closed Permanently' ? 'text-slate-500' : 'text-amber-800'}`}>Reason</p>
                            <p className={`text-[10px] sm:text-xs truncate ${lead.status === 'Closed Permanently' ? 'text-slate-700' : 'text-amber-900'}`}>{lead.status_reason}</p>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default LeadsManagement;
