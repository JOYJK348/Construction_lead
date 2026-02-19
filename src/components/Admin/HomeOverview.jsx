import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FileText, Clock, CheckCircle2, Bell, TrendingUp, Activity,
    Users, MapPin, Calendar, Plus, ChevronRight, BarChart3, Award, XCircle
} from 'lucide-react';

const HomeOverview = ({ stats, leads, onView, onNewLead }) => {
    const navigate = useNavigate();
    const recentLeads = leads.slice(0, 5);

    // Calculate additional stats
    const todayLeads = leads.filter(l => {
        const today = new Date().toDateString();
        return new Date(l.created_at).toDateString() === today;
    }).length;

    const thisWeekLeads = leads.filter(l => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(l.created_at) >= weekAgo;
    }).length;

    // Field Survey Person performance summary
    const surveyPersonStats = leads.reduce((acc, lead) => {
        const surveyPersonName = lead.assignments?.[0]?.engineer?.full_name || 'Unassigned';
        if (!acc[surveyPersonName]) {
            acc[surveyPersonName] = { total: 0, completed: 0, pending: 0, lost: 0 };
        }
        acc[surveyPersonName].total++;

        const status = String(lead.status || '').toLowerCase();
        if (status === 'master') acc[surveyPersonName].completed++;
        if (status === 'roaming') acc[surveyPersonName].pending++;
        if (status === 'closed permanently') acc[surveyPersonName].lost++;

        return acc;
    }, {});

    const topSurveyPersons = Object.entries(surveyPersonStats)
        .sort((a, b) => b[1].completed - a[1].completed)
        .slice(0, 3);

    return (
        <div className="space-y-4 sm:space-y-6 pb-6">
            {/* Welcome Header - Mobile Optimized */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-10 pointer-events-none">
                    <TrendingUp size={120} className="sm:w-40 sm:h-40" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Welcome Back! 👋</h1>
                    <p className="text-indigo-100 font-medium text-sm sm:text-lg">Here's your overview today</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-4 sm:mt-6">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 transition-transform active:scale-95 sm:hover:scale-105">
                            <p className="text-white/80 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Today</p>
                            <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{todayLeads}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 transition-transform active:scale-95 sm:hover:scale-105">
                            <p className="text-white/80 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">This Week</p>
                            <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{thisWeekLeads}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 transition-transform active:scale-95 sm:hover:scale-105">
                            <p className="text-white/80 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Rate</p>
                            <p className="text-2xl sm:text-3xl font-bold text-white mt-1">
                                {Number(stats?.total) > 0
                                    ? Math.round(((Number(stats?.closedWon) || 0) / Number(stats?.total)) * 100)
                                    : 0}%
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 transition-transform active:scale-95 sm:hover:scale-105">
                            <p className="text-white/80 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Field Surveyors</p>
                            <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{stats.surveyPersonsCount || 0}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards Grid - Mobile Optimized */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                <StatCard
                    icon={FileText}
                    label="Total Analysis"
                    value={stats.total}
                    color="from-blue-500 to-indigo-600"
                    onClick={() => navigate('/admin/leads')}
                />
                <StatCard
                    icon={Clock}
                    label="Active"
                    value={stats.underConstruction}
                    color="from-blue-400 to-indigo-500"
                    onClick={() => navigate('/admin/leads')}
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Closed Won"
                    value={stats.closedWon}
                    color="from-emerald-500 to-teal-600"
                    onClick={() => navigate('/admin/archive')}
                />
                <StatCard
                    icon={Bell}
                    label="Pending"
                    value={stats.pending}
                    color="from-amber-500 to-orange-600"
                    onClick={() => navigate('/admin/reminders')}
                />
            </div>

            {/* Recent Activity - Mobile Optimized */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Activity size={20} className="text-blue-600" />
                        Recent Activity
                    </h3>
                    <button
                        onClick={() => navigate('/admin/leads')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-semibold text-xs transition-all active:scale-95"
                    >
                        View All
                        <ChevronRight size={14} />
                    </button>
                </div>

                {recentLeads.length > 0 ? (
                    <div className="space-y-2">
                        {recentLeads.map(lead => {
                            const totalDoors = lead.door_specifications?.reduce((sum, door) => sum + (parseInt(door.quantity) || 0), 0) || 0;
                            const project = Array.isArray(lead.project_information) ? lead.project_information[0] : lead.project_information;
                            const customer = Array.isArray(lead.customer_details) ? lead.customer_details[0] : lead.customer_details;
                            const village = lead.site_visits?.[0]?.village_name;

                            return (
                                <motion.div
                                    key={lead.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={() => onView(lead)}
                                    className="p-3 sm:p-4 bg-slate-50/50 hover:bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all cursor-pointer group active:scale-[0.99]"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold">
                                                    {lead.lead_number}
                                                </span>
                                                <StatusBadge status={lead.status} />
                                            </div>
                                            <p className="font-semibold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors truncate">
                                                {project?.project_name || 'Unnamed Project'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                                <span className="font-medium truncate">{customer?.customer_name || 'Unknown'}</span>
                                                {village && (
                                                    <>
                                                        <span className="opacity-30">•</span>
                                                        <span className="flex items-center gap-1 truncate">
                                                            <MapPin size={10} className="shrink-0" />
                                                            {village}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        {totalDoors > 0 && (
                                            <div className="text-right shrink-0">
                                                <p className="text-lg sm:text-xl font-bold text-slate-900">{totalDoors}</p>
                                                <p className="text-[10px] text-slate-400 font-medium uppercase">Doors</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FileText size={32} className="text-slate-400" />
                        </div>
                        <p className="text-slate-500 font-medium">No recent activity</p>
                    </div>
                )}
            </div>

            {/* Top Performers - Mobile Optimized */}
            {topSurveyPersons.length > 0 && (
                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Award size={20} className="text-amber-500" />
                            Top Performers
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {topSurveyPersons.map(([name, data], index) => (
                            <div key={name} className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-all">
                                <div className={`
                                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                                    ${index === 0 ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white' :
                                        index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white' :
                                            'bg-gradient-to-br from-orange-400 to-orange-500 text-white'}
                                `}>
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-900 text-sm truncate">{name}</p>
                                    <p className="text-xs text-slate-500 font-medium">{data.completed} completed</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-slate-900">{data.total}</p>
                                    <p className="text-[10px] text-slate-400 font-medium uppercase">Total</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Stat Card Component - Mobile Optimized
const StatCard = ({ icon: Icon, label, value, color, onClick }) => (
    <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all text-left group"
    >
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
            <Icon size={20} className="text-white sm:w-6 sm:h-6" />
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{value}</p>
        <p className="text-xs sm:text-sm font-semibold text-slate-500">{label}</p>
    </motion.button>
);

// Status Badge Component
const StatusBadge = ({ status }) => {
    const getStatusStyle = () => {
        const s = String(status || '').toLowerCase();
        if (s === 'master') return { style: 'bg-emerald-50 text-emerald-700 border-emerald-100', label: 'Closed Won' };
        if (s === 'roaming') return { style: 'bg-blue-50 text-blue-700 border-blue-100', label: 'Under Construction' };
        if (s === 'temporarily closed') return { style: 'bg-amber-50 text-amber-700 border-amber-100', label: 'Pending' };
        if (s === 'closed permanently') return { style: 'bg-slate-50 text-slate-700 border-slate-200', label: 'Closed Loss' };
        return { style: 'bg-slate-50 text-slate-600 border-slate-100', label: status || 'Unknown' };
    };

    const config = getStatusStyle();

    return (
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${config.style}`}>
            {config.label}
        </span>
    );
};

export default HomeOverview;
