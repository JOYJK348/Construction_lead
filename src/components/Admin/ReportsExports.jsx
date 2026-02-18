import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileSpreadsheet, FileText, Download, Calendar, Filter, Search, RefreshCw,
    BarChart3, TrendingUp, Users, MapPin, CheckCircle, Clock, Eye, X, Maximize,
    ChevronLeft
} from 'lucide-react';
import { exportToExcel, exportToPDF, getPDFBlobURL } from '../../services/exportService';

const ReportsExports = ({ leads, onView }) => {
    const navigate = useNavigate();
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [filterSurveyPerson, setFilterSurveyPerson] = useState('all');
    const [filterVillage, setFilterVillage] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);

    // Get unique survey persons and villages
    const surveyPersons = [...new Set(leads.map(l => l.assignments?.[0]?.engineer?.full_name).filter(Boolean))].sort();
    const villages = [...new Set(leads.map(l => l.site_visits?.[0]?.village_name).filter(Boolean))].sort();

    // Filter leads
    const getFilteredLeads = () => {
        return leads.filter(lead => {
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const projectName = String(lead.project_information?.[0]?.project_name || '').toLowerCase();
                const customerName = String(lead.customer_details?.[0]?.customer_name || '').toLowerCase();
                const leadNum = String(lead.lead_number || '').toLowerCase();
                const villageName = String(lead.site_visits?.[0]?.village_name || '').toLowerCase();
                if (!projectName.includes(searchLower) && !customerName.includes(searchLower) && !leadNum.includes(searchLower) && !villageName.includes(searchLower)) {
                    return false;
                }
            }

            if (dateRange.start || dateRange.end) {
                const leadDate = new Date(lead.created_at);
                leadDate.setHours(0, 0, 0, 0);

                if (dateRange.start) {
                    const startDate = new Date(dateRange.start);
                    startDate.setHours(0, 0, 0, 0);
                    if (leadDate < startDate) return false;
                }

                if (dateRange.end) {
                    const endDate = new Date(dateRange.end);
                    endDate.setHours(23, 59, 59, 999);
                    if (leadDate > endDate) return false;
                }
            }

            if (filterSurveyPerson !== 'all' && lead.assignments?.[0]?.engineer?.full_name !== filterSurveyPerson) {
                return false;
            }

            if (filterVillage !== 'all' && lead.site_visits?.[0]?.village_name !== filterVillage) {
                return false;
            }

            if (filterStatus !== 'all' && lead.status !== filterStatus) {
                return false;
            }

            return true;
        });
    };

    const resetFilters = () => {
        setDateRange({ start: '', end: '' });
        setFilterSurveyPerson('all');
        setFilterVillage('all');
        setFilterStatus('all');
        setSearchTerm('');
    };

    const filteredLeads = getFilteredLeads();

    const handleExportExcel = () => {
        exportToExcel(filteredLeads, `report_export_${new Date().toISOString().split('T')[0]}`);
    };

    const handleExportPDF = () => {
        exportToPDF(filteredLeads, `report_export_${new Date().toISOString().split('T')[0]}`);
    };

    const handlePreviewPDF = () => {
        const url = getPDFBlobURL(filteredLeads, `report_preview`);
        if (url) {
            setPdfPreviewUrl(url);
        } else {
            alert('Failed to generate preview');
        }
    };

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
                    <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-900 truncate">Reports & Exports</h2>
                    <p className="text-slate-600 font-medium text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 mt-0.5">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-600 rounded-full animate-pulse" />
                        {filteredLeads.length} records filtered
                    </p>
                </div>
            </div>

            {/* Filters Card - Mobile Optimized */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-8 border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-9 h-9 sm:w-12 sm:h-12 bg-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-md">
                            <Filter size={18} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900">Filters</h3>
                            <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-wide hidden sm:block">Refine your data</p>
                        </div>
                    </div>
                    <button
                        onClick={resetFilters}
                        className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all active:scale-95 border border-slate-200"
                    >
                        <RefreshCw size={12} className="sm:w-[14px] sm:h-[14px]" />
                        Reset
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {/* Search Field */}
                    <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
                        <label className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wide ml-1 sm:ml-2">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by project, customer, or lead ID..."
                                className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-slate-50 border-2 border-slate-200 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="space-y-1.5">
                        <label className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wide ml-1 sm:ml-2">Date Range</label>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="relative">
                                <Calendar className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    className="w-full pl-8 sm:pl-9 pr-2 py-2 sm:py-2.5 bg-slate-50 border-2 border-slate-200 rounded-lg text-[10px] sm:text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 transition-all outline-none"
                                />
                            </div>
                            <div className="relative">
                                <Calendar className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    className="w-full pl-8 sm:pl-9 pr-2 py-2 sm:py-2.5 bg-slate-50 border-2 border-slate-200 rounded-lg text-[10px] sm:text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 transition-all outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Field Survey Person & Village */}
                    <div className="space-y-1.5">
                        <label className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wide ml-1 sm:ml-2">Field Survey Person & Village</label>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="relative">
                                <Users className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                <select
                                    value={filterSurveyPerson}
                                    onChange={(e) => setFilterSurveyPerson(e.target.value)}
                                    className="w-full pl-8 sm:pl-9 pr-2 py-2 sm:py-2.5 bg-slate-50 border-2 border-slate-200 rounded-lg text-[10px] sm:text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none appearance-none cursor-pointer transition-all"
                                >
                                    <option value="all">All</option>
                                    {surveyPersons.map(eng => <option key={eng} value={eng}>{eng}</option>)}
                                </select>
                            </div>
                            <div className="relative">
                                <MapPin className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                <select
                                    value={filterVillage}
                                    onChange={(e) => setFilterVillage(e.target.value)}
                                    className="w-full pl-8 sm:pl-9 pr-2 py-2 sm:py-2.5 bg-slate-50 border-2 border-slate-200 rounded-lg text-[10px] sm:text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none appearance-none cursor-pointer transition-all"
                                >
                                    <option value="all">All</option>
                                    {villages.map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                        <label className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wide ml-1 sm:ml-2">Status</label>
                        <div className="relative">
                            <CheckCircle className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-slate-50 border-2 border-slate-200 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none appearance-none cursor-pointer transition-all"
                            >
                                <option value="all">All Statuses</option>
                                <option value="Roaming">Under Construction</option>
                                <option value="Master">Closed Won</option>
                                <option value="Temporarily Closed">Pending</option>
                                <option value="Closed Permanently">Closed Loss</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Preview - Mobile Optimized */}
            <div id="selected-records-preview" className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
                        <FileText size={18} className="sm:w-[22px] sm:h-[22px] text-indigo-600" />
                        <span className="hidden sm:inline">Records Preview</span>
                        <span className="sm:hidden">Preview</span>
                    </h3>
                    <div className="px-2 sm:px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] sm:text-xs font-bold uppercase border border-indigo-100">
                        {filteredLeads.length} Leads
                    </div>
                </div>

                {/* Desktop Table View */}
                <div id="selected-records-table" className="hidden lg:block overflow-x-auto border border-slate-100 rounded-xl">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 font-bold text-slate-700 uppercase tracking-tight text-[10px]">Date</th>
                                <th className="px-4 py-3 font-bold text-slate-700 uppercase tracking-tight text-[10px]">Lead #</th>
                                <th className="px-4 py-3 font-bold text-slate-700 uppercase tracking-tight text-[10px]">Customer / Project</th>
                                <th className="px-4 py-3 font-bold text-slate-700 uppercase tracking-tight text-[10px]">Village</th>
                                <th className="px-4 py-3 font-bold text-slate-700 uppercase tracking-tight text-[10px] text-center">Doors</th>
                                <th className="px-4 py-3 font-bold text-slate-700 uppercase tracking-tight text-[10px] text-center">Status</th>
                                <th className="px-4 py-3 font-bold text-slate-700 uppercase tracking-tight text-[10px] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredLeads.length > 0 ? (
                                filteredLeads.slice(0, 15).map(lead => {
                                    const totalDoors = lead.door_specifications?.reduce((sum, door) => sum + (parseInt(door.quantity) || 0), 0) || 0;
                                    return (
                                        <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-slate-600 whitespace-nowrap text-xs">
                                                {new Date(lead.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-blue-600 text-xs">{lead.lead_number}</td>
                                            <td className="px-4 py-3">
                                                <p className="font-semibold text-slate-900 text-sm">{lead.customer_details?.[0]?.customer_name || 'No Name'}</p>
                                                <p className="text-xs text-slate-500 font-medium">{lead.project_information?.[0]?.project_name || 'No Project'}</p>
                                            </td>
                                            <td className="px-4 py-3 font-medium text-slate-700 text-xs">{lead.site_visits?.[0]?.village_name || '-'}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-bold text-xs border border-indigo-100">
                                                    {totalDoors}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <StatusBadge status={lead.status} project={lead.project_information?.[0]} customer={lead.customer_details?.[0]} />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => onView && onView(lead)}
                                                    className="p-1.5 hover:bg-slate-200 rounded-lg text-indigo-600 transition-all border border-slate-200 bg-white"
                                                    title="View Details"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-4 py-12 text-center text-slate-400 font-medium bg-slate-50/50">
                                        <Filter size={32} className="mx-auto mb-2 opacity-20" />
                                        No records found
                                    </td>
                                </tr>
                            )}
                            {filteredLeads.length > 15 && (
                                <tr className="bg-slate-50">
                                    <td colSpan="7" className="px-4 py-2 text-center text-[10px] text-slate-500 font-semibold uppercase tracking-wide border-t border-slate-200">
                                        + {filteredLeads.length} total records available for export
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-2">
                    {filteredLeads.length > 0 ? (
                        filteredLeads.slice(0, 10).map(lead => (
                            <LeadPreviewCard key={lead.id} lead={lead} onView={onView} />
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <Filter size={32} className="mx-auto mb-2 text-slate-300" />
                            <p className="text-slate-400 font-medium text-sm">No records found</p>
                        </div>
                    )}
                    {filteredLeads.length > 10 && (
                        <div className="p-3 bg-slate-50 rounded-lg text-center">
                            <p className="text-[10px] text-slate-500 font-semibold uppercase">
                                + {filteredLeads.length - 10} more records available
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Export Actions - Mobile Optimized */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <Download size={16} className="sm:w-[18px] sm:h-[18px] text-indigo-600" />
                    Export Options
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div className="space-y-1.5 sm:space-y-2">
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleExportExcel}
                            className="w-full p-2.5 sm:p-3 bg-emerald-600 text-white rounded-lg sm:rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:bg-emerald-700 transition-all active:scale-95"
                        >
                            <FileSpreadsheet size={16} className="sm:w-[18px] sm:h-[18px]" />
                            <span>Export to Excel</span>
                        </motion.button>
                        <button
                            onClick={() => document.getElementById('selected-records-preview')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full py-1.5 text-emerald-700 font-semibold text-[10px] bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-all border border-emerald-100 uppercase"
                        >
                            Preview ↑
                        </button>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleExportPDF}
                            className="w-full p-2.5 sm:p-3 bg-rose-600 text-white rounded-lg sm:rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:bg-rose-700 transition-all active:scale-95"
                        >
                            <FileText size={16} className="sm:w-[18px] sm:h-[18px]" />
                            <span>Export to PDF</span>
                        </motion.button>
                        <button
                            onClick={handlePreviewPDF}
                            className="w-full py-1.5 text-rose-700 font-semibold text-[10px] bg-rose-50 rounded-lg hover:bg-rose-100 transition-all border border-rose-100 uppercase flex items-center justify-center gap-1"
                        >
                            <Eye size={10} />
                            Preview PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* PDF Preview Modal - Mobile Optimized */}
            <AnimatePresence>
                {pdfPreviewUrl && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900 z-[200] flex flex-col"
                    >
                        <div className="flex flex-col h-full bg-slate-800 sm:rounded-3xl sm:m-4 md:m-8 overflow-hidden shadow-2xl">
                            <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-rose-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white shadow-lg">
                                        <FileText size={16} className="sm:w-5 sm:h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm sm:text-lg md:text-2xl font-bold text-white">PDF Preview</h3>
                                        <p className="text-slate-400 text-[9px] sm:text-xs font-medium hidden sm:block">Verify before saving</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <button
                                        onClick={() => window.open(pdfPreviewUrl, '_blank')}
                                        className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-white flex items-center gap-1 font-semibold text-[10px] sm:text-xs border border-white/10"
                                    >
                                        <Maximize size={12} className="sm:w-[14px] sm:h-[14px]" />
                                        <span className="hidden sm:inline">Full</span>
                                    </button>
                                    <button
                                        onClick={() => setPdfPreviewUrl(null)}
                                        className="w-8 h-8 sm:w-10 sm:h-10 bg-rose-600 hover:bg-rose-700 rounded-lg transition-all text-white shadow-lg flex items-center justify-center active:scale-95 border border-rose-500"
                                    >
                                        <X size={16} className="sm:w-5 sm:h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 bg-white relative">
                                <iframe
                                    src={pdfPreviewUrl}
                                    className="w-full h-full border-none"
                                    title="PDF Preview"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Mobile Lead Preview Card
const LeadPreviewCard = ({ lead, onView }) => {
    const totalDoors = lead.door_specifications?.reduce((sum, door) => sum + (parseInt(door.quantity) || 0), 0) || 0;

    return (
        <div className="p-3 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 transition-all">
            <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold border border-blue-100">
                            {lead.lead_number}
                        </span>
                        <StatusBadge status={lead.status} project={lead.project_information?.[0]} customer={lead.customer_details?.[0]} />
                    </div>
                    <p className="font-semibold text-slate-900 text-sm truncate">{lead.customer_details?.[0]?.customer_name || 'No Name'}</p>
                    <p className="text-xs text-slate-500 truncate">{lead.project_information?.[0]?.project_name || 'No Project'}</p>
                </div>
                <button
                    onClick={() => onView && onView(lead)}
                    className="p-1.5 hover:bg-slate-200 rounded-lg text-indigo-600 transition-all border border-slate-200 bg-white shrink-0"
                >
                    <Eye size={14} />
                </button>
            </div>
            <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{lead.site_visits?.[0]?.village_name || '-'}</span>
                {totalDoors > 0 && (
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-bold text-[10px] border border-indigo-100">
                        {totalDoors} doors
                    </span>
                )}
            </div>
        </div>
    );
};

// Status Badge Component
const StatusBadge = ({ status, project, customer }) => {
    const projName = String(project?.project_name || '').toLowerCase();
    const custName = String(customer?.customer_name || '').toLowerCase();
    const isWaiting = projName.includes('unknown') || custName.includes('unavailable') || custName.includes('unknown');

    if (isWaiting) {
        return <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">Waiting</span>;
    }

    const statusStyles = {
        'Master': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'Roaming': 'bg-blue-50 text-blue-700 border-blue-100',
        'Temporarily Closed': 'bg-amber-50 text-amber-700 border-amber-100',
        'Closed Permanently': 'bg-slate-50 text-slate-500 border-slate-200'
    };

    const statusLabels = {
        'Master': 'Closed Won',
        'Roaming': 'Under Construction',
        'Temporarily Closed': 'Pending',
        'Closed Permanently': 'Closed Loss'
    };

    return (
        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase border ${statusStyles[status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
            {statusLabels[status] || status}
        </span>
    );
};

export default ReportsExports;
