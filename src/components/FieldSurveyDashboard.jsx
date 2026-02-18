import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import {
    Home, FileText, Plus, Clock, CheckCircle2, Bell, User,
    Search, Filter, MapPin, Calendar,
    Phone, Building2, Camera, AlertCircle, ChevronRight,
    LogOut, TrendingUp, Activity, Menu, X, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FormWizardView from './FormWizardView';
import NotificationCenter from './NotificationCenter';
import { checkAndCreateFollowUpNotifications } from '../services/notificationService';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

const FieldSurveyDashboard = ({
    user, onLogout, onNewLead, onEditLead, onView,
    LeadFormView, LeadSuccessView, LeadDetailView, isSubmitted
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine activeView from current path
    const getActiveView = () => {
        const path = location.pathname;
        if (path.includes('/field-survey/my-leads')) return 'my-leads';
        if (path.includes('/field-survey/new')) return 'new-entry';
        if (path.includes('/field-survey/pending')) return 'pending';
        if (path.includes('/field-survey/completed')) return 'completed';
        if (path.includes('/field-survey/notifications')) return 'notifications';
        if (path.includes('/field-survey/profile')) return 'profile';
        if (path.includes('/field-survey/view')) return 'view';
        return 'home';
    };

    const activeView = getActiveView();

    const [leads, setLeads] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, reminders: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        if (showProfileMenu) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showProfileMenu]);

    useEffect(() => {
        fetchLeads();
        if (user?.id) {
            checkAndCreateFollowUpNotifications(user.id);
        }

        const channel = supabase
            .channel(`survey_person_sync_${user.id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
                fetchLeads(false);
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'lead_assignments' }, () => {
                fetchLeads(false);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user.id]);

    const fetchLeads = async (showLoading = true) => {
        if (!user?.id) return;
        if (showLoading) setLoading(true);
        setError(null);

        try {
            const { data: assignments } = await supabase
                .from('lead_assignments')
                .select('lead_id')
                .eq('engineer_id', user.id);

            const assignedLeadIds = assignments?.map(a => a.lead_id) || [];

            let leadQuery = supabase
                .from('leads')
                .select(`
                    *,
                    customer_details (*),
                    project_information (*),
                    stakeholder_details (*),
                    site_visits (*),
                    door_specifications (*),
                    payment_details (*),
                    assignments:lead_assignments (
                        *,
                        engineer:users!engineer_id(id, full_name)
                    )
                `);

            if (assignedLeadIds.length > 0) {
                leadQuery = leadQuery.or(`created_by.eq.${user.id},id.in.(${assignedLeadIds.join(',')})`);
            } else {
                leadQuery = leadQuery.eq('created_by', user.id);
            }

            const { data, error: fetchErr } = await leadQuery.order('created_at', { ascending: false });
            if (fetchErr) throw fetchErr;

            if (data) {
                const activeLeads = data.filter(l => l.status !== 'Closed Permanently');
                setLeads(activeLeads);
                const statsObj = {
                    total: activeLeads.length,
                    pending: activeLeads.filter(l => String(l.status || '').toLowerCase() === 'roaming').length,
                    completed: activeLeads.filter(l => String(l.status || '').toLowerCase() === 'master').length,
                    reminders: activeLeads.filter(l => String(l.status || '').toLowerCase() === 'temporarily closed').length
                };
                setStats(statsObj);
            }
        } catch (err) {
            setError(`Sync Error: ${err.message}`);
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    const handleNotificationClick = async (notification) => {
        if (notification.lead_id) {
            const existingLead = leads.find(l => l.id === notification.lead_id);
            if (existingLead) {
                onView(existingLead);
            } else {
                setLoading(true);
                try {
                    const { data } = await supabase
                        .from('leads')
                        .select(`*, customer_details (*), project_information (*), stakeholder_details (*), site_visits (*), door_specifications (*), payment_details (*), assignments:lead_assignments (*, engineer:users!engineer_id(id, full_name))`)
                        .eq('id', notification.lead_id)
                        .single();
                    if (data) onView(data);
                } catch (err) {
                    console.error("Error fetching lead:", err);
                } finally {
                    setLoading(false);
                }
            }
        } else {
            if (notification.type === 'reminder') navigate('/field-survey/pending');
            else if (notification.type === 'completion') navigate('/field-survey/completed');
            else navigate('/field-survey/my-leads');
        }
    };

    const navigationItems = [
        { id: 'home', label: 'Home', icon: Home, path: '/field-survey', color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { id: 'my-leads', label: 'My Leads', icon: FileText, path: '/field-survey/my-leads', color: 'text-amber-600', bgColor: 'bg-amber-50' },
        { id: 'new-entry', label: 'New Entry', icon: Plus, path: '/field-survey/new', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
        { id: 'pending', label: 'Under Construction', icon: Clock, path: '/field-survey/pending', color: 'text-rose-600', bgColor: 'bg-rose-50' },
        { id: 'completed', label: 'Closed Won', icon: CheckCircle2, path: '/field-survey/completed', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
        { id: 'notifications', label: 'Notifications', icon: Bell, path: '/field-survey/notifications', color: 'text-violet-600', bgColor: 'bg-violet-50' },
        { id: 'profile', label: 'My Profile', icon: User, path: '/field-survey/profile', color: 'text-slate-600', bgColor: 'bg-slate-50' },
    ];

    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            String(lead.lead_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(lead.customer_details?.[0]?.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(lead.site_visits?.[0]?.village_name || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterStatus === 'all' ? true :
                filterStatus === 'pending' ? (lead.status === 'Roaming' || lead.status === 'Temporarily Closed') :
                    filterStatus === 'completed' ? lead.status === 'Master' : true;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Professional Top Navigation Bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-3.5">
                    <div className="flex items-center justify-between">
                        {/* Logo Section */}
                        <button
                            onClick={() => navigate('/field-survey')}
                            className="flex items-center gap-2 sm:gap-2.5 hover:opacity-80 transition-opacity active:scale-95"
                        >
                            <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 overflow-hidden">
                                <img src="/assests/logo.png" alt="Logo" className="w-full h-full object-cover scale-110" />
                            </div>
                            <div className="text-left">
                                <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight tracking-tight">
                                    <span className="text-slate-800">Survey</span><span className="text-blue-500">2</span><span className="text-blue-600">Lead</span>
                                </h1>
                                <p className="text-[9px] sm:text-[10px] text-slate-500 hidden sm:block leading-tight tracking-wider uppercase">Field Management</p>
                            </div>
                        </button>

                        {/* Right Side - Notifications & Profile */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <NotificationCenter
                                user={user}
                                onNotificationClick={handleNotificationClick}
                                onSeeAll={() => navigate('/field-survey/notifications')}
                            />

                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2.5 py-1.5 sm:py-2 hover:bg-slate-50 active:bg-slate-100 rounded-lg sm:rounded-xl transition-all border border-slate-200"
                            >
                                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold shadow-sm">
                                    {user.fullName?.charAt(0) || 'E'}
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium text-slate-900 leading-tight">{user.fullName}</p>
                                    <p className="text-[10px] text-slate-500 leading-tight">Field Survey Person</p>
                                </div>
                                <ChevronRight
                                    size={14}
                                    className={`hidden sm:block text-slate-400 transition-transform ${showProfileMenu ? 'rotate-90' : ''}`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Menu Panel */}
                <AnimatePresence>
                    {showProfileMenu && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowProfileMenu(false)}
                                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                            />

                            <motion.div
                                initial={{ opacity: 0, x: 300 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 300 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="fixed top-0 right-0 h-full w-[280px] sm:w-80 bg-white shadow-2xl z-50 flex flex-col"
                            >
                                {/* Header */}
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 sm:p-5 text-white">
                                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                                        <h2 className="text-base sm:text-lg font-medium">Menu</h2>
                                        <button
                                            onClick={() => setShowProfileMenu(false)}
                                            className="p-2 hover:bg-white/20 active:bg-white/30 rounded-lg transition-all"
                                        >
                                            <X size={18} className="sm:w-5 sm:h-5" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2.5 sm:gap-3">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-lg sm:text-xl font-medium border-2 border-white/30">
                                            {user.fullName?.charAt(0) || 'E'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-white text-sm sm:text-base truncate">{user.fullName}</p>
                                            <p className="text-[10px] sm:text-xs text-blue-100 truncate">{user.email}</p>
                                            <p className="text-[10px] sm:text-xs text-blue-200 mt-0.5">Field Survey Person</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation */}
                                <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                                    <p className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 sm:mb-3 px-2">Navigation</p>
                                    <nav className="space-y-0.5 sm:space-y-1">
                                        {navigationItems.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    navigate(item.path);
                                                    setShowProfileMenu(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl font-medium text-[13px] sm:text-sm transition-all group active:scale-[0.98] ${activeView === item.id
                                                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                                                    : 'text-slate-600 hover:bg-slate-50 active:bg-slate-100'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                                                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all flex items-center justify-center shrink-0 ${item.bgColor} ${activeView === item.id ? 'ring-2 ring-blue-200' : 'group-hover:scale-105'
                                                        }`}>
                                                        <item.icon size={18} className={`sm:w-5 sm:h-5 ${item.color}`} />
                                                    </div>
                                                    <span className="truncate">{item.label}</span>
                                                </div>
                                                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                                                    {item.id === 'pending' && stats.pending > 0 && (
                                                        <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-orange-500 text-white rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium min-w-[18px] sm:min-w-[20px] text-center">
                                                            {stats.pending}
                                                        </span>
                                                    )}
                                                    {item.id === 'notifications' && stats.reminders > 0 && (
                                                        <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-purple-500 text-white rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium min-w-[18px] sm:min-w-[20px] text-center">
                                                            {stats.reminders}
                                                        </span>
                                                    )}
                                                    <ChevronRight
                                                        size={14}
                                                        className={`sm:w-4 sm:h-4 ${activeView === item.id ? 'text-blue-700' : 'text-slate-300'} group-hover:translate-x-0.5 transition-transform`}
                                                    />
                                                </div>
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                {/* Footer */}
                                <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50">
                                    <button
                                        onClick={onLogout}
                                        className="w-full flex items-center justify-center gap-2 sm:gap-2.5 px-4 py-3 sm:py-3.5 rounded-xl font-medium text-[13px] sm:text-sm text-red-600 hover:bg-red-50 active:bg-red-100 transition-all active:scale-[0.98] bg-white border border-red-100 shadow-sm"
                                    >
                                        <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
                                        <span>Logout</span>
                                    </button>
                                    <p className="text-[9px] sm:text-[10px] text-center text-slate-400 mt-2 sm:mt-2.5">Survey2Lead v1.0.4</p>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6 pb-24 lg:pb-6">
                {error && (
                    <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="text-orange-600" size={24} />
                            <div><p className="text-orange-900 font-bold">Sync Alert</p><p className="text-orange-700 text-sm font-medium">{error}</p></div>
                        </div>
                        <button onClick={fetchLeads} className="px-4 py-2 bg-orange-600 text-white rounded-xl font-bold text-sm hover:bg-orange-700 transition-all shadow-md active:scale-95">Retry</button>
                    </div>
                )}

                <Routes>
                    <Route index element={
                        <HomeView
                            stats={stats}
                            leads={leads}
                            setActiveView={(v) => navigate(`/field-survey/${v === 'new-entry' ? 'new' : v}`)}
                            onNewLead={onNewLead}
                            onView={onView}
                            fetchLeads={fetchLeads}
                        />
                    } />
                    <Route path="home" element={<Navigate to="/field-survey" replace />} />
                    <Route path="my-leads" element={<MyLeadsView leads={filteredLeads} searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterStatus={filterStatus} setFilterStatus={setFilterStatus} onView={onView} onEdit={onEditLead} />} />
                    <Route path="new" element={isSubmitted ? LeadSuccessView : LeadFormView} />
                    <Route path="pending" element={<PendingTasksView leads={leads.filter(l => (l.status === 'Roaming' || l.status === 'Temporarily Closed') && l.status !== 'Closed Permanently')} onView={onView} onEdit={onEditLead} />} />
                    <Route path="completed" element={<CompletedTasksView leads={leads.filter(l => l.status === 'Master' && l.status !== 'Closed Permanently')} onView={onView} />} />
                    <Route path="notifications" element={<NotificationsView user={user} handleNotificationClick={handleNotificationClick} />} />
                    <Route path="profile" element={<ProfileView user={user} />} />
                    <Route path="view" element={LeadDetailView} />
                </Routes>
            </main>

            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-2xl z-40">
                <div className="grid grid-cols-4 gap-1 p-2">
                    {[
                        { id: 'home', icon: Home, label: 'Home', path: '/field-survey', color: 'text-blue-500' },
                        { id: 'my-leads', icon: FileText, label: 'Leads', path: '/field-survey/my-leads', color: 'text-amber-500' },
                        { id: 'new-entry', icon: Plus, label: 'New', path: '/field-survey/new', color: 'text-emerald-500' },
                        { id: 'menu', icon: Menu, label: 'Menu', onClick: () => setShowProfileMenu(true), color: 'text-slate-600' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => item.onClick ? item.onClick() : navigate(item.path)}
                            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all active:scale-95 ${activeView === item.id ? 'bg-slate-50 shadow-inner' : 'text-slate-500'}`}
                        >
                            <item.icon size={22} className={activeView === item.id || item.id === 'menu' ? item.color : 'text-slate-400'} />
                            <span className={`text-[10px] font-black uppercase tracking-tight ${activeView === item.id ? 'text-slate-900' : 'text-slate-400'}`}>{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div >
    );
};

// Home View Component
const HomeView = ({ stats, leads, setActiveView, onNewLead, onView, fetchLeads }) => {
    const navigate = useNavigate();
    const recentLeads = leads.slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                <h1 className="text-2xl font-black mb-1">Dashboard Overview</h1>
                <p className="text-blue-100 font-medium">Track your field activities and performance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <StatCard
                    icon={FileText}
                    label="My Leads"
                    value={stats.total}
                    color="from-blue-600 to-indigo-700"
                    onClick={() => navigate('/field-survey/my-leads')}
                />
                <StatCard
                    icon={Clock}
                    label="Under Construction"
                    value={stats.pending}
                    color="from-orange-500 to-red-500"
                    onClick={() => navigate('/field-survey/pending')}
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Closed Won"
                    value={stats.completed}
                    color="from-emerald-500 to-teal-600"
                    onClick={() => navigate('/field-survey/completed')}
                />
                <StatCard
                    icon={Bell}
                    label="Follow-ups"
                    value={stats.reminders}
                    color="from-purple-500 to-indigo-600"
                    onClick={() => navigate('/field-survey/notifications')}
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <TrendingUp size={16} className="text-blue-600" />
                    </div>
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <QuickActionButton icon={Plus} label="Create New Lead" onClick={onNewLead} color="emerald" />
                    <QuickActionButton icon={FileText} label="View All Leads" onClick={() => navigate('/field-survey/my-leads')} color="blue" />
                    <QuickActionButton icon={Clock} label="Pending Tasks" onClick={() => navigate('/field-survey/pending')} color="amber" />
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                            <Activity size={16} className="text-indigo-600" />
                        </div>
                        Recent Leads
                    </h2>
                    <button
                        onClick={() => navigate('/field-survey/my-leads')}
                        className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 active:scale-95 transition-all"
                    >
                        View All <ChevronRight size={14} className="sm:size-4" />
                    </button>
                </div>
                <div className="space-y-2.5">
                    {recentLeads.length > 0 ? (
                        recentLeads.map(lead => (
                            <button
                                key={lead.id}
                                onClick={() => onView(lead)}
                                className="w-full flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-white hover:shadow-md transition-all border border-slate-100/80 group text-left active:scale-[0.99]"
                            >
                                <div className="flex-1 min-w-0 pr-2">
                                    <p className="font-semibold text-slate-900 text-[13px] sm:text-sm mb-1 group-hover:text-blue-700 transition-colors truncate">
                                        {lead.project_information?.[0]?.project_name || 'Unnamed Project'}
                                    </p>
                                    <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-slate-500">
                                        <span className="font-medium shrink-0">{lead.lead_number}</span>
                                        <span className="opacity-30 shrink-0">•</span>
                                        <span className="flex items-center gap-1.5 truncate">
                                            <MapPin size={10} className="sm:size-3 text-slate-400 shrink-0" />
                                            <span className="truncate">{lead.site_visits?.[0]?.village_name || 'No Location'}</span>
                                        </span>
                                    </div>
                                </div>
                                <span className={`px-2 py-0.5 rounded-md sm:rounded-lg text-[9px] sm:text-[10px] font-semibold uppercase shrink-0 ${(() => {
                                    const project = Array.isArray(lead.project_information) ? lead.project_information[0] : lead.project_information;
                                    const customer = Array.isArray(lead.customer_details) ? lead.customer_details[0] : lead.customer_details;
                                    const projName = String(project?.project_name || '').toLowerCase();
                                    const custName = String(customer?.customer_name || '').toLowerCase();
                                    if (projName.includes('unknown') || custName.includes('unavailable') || custName.includes('unknown')) return 'bg-slate-100 text-slate-600';
                                    return lead.status === 'Master' ? 'bg-green-50 text-green-700 border border-green-100' :
                                        lead.status === 'Temporarily Closed' ? 'bg-red-50 text-red-700 border border-red-100' :
                                            'bg-blue-50 text-blue-700 border border-blue-100';
                                })()}`}>
                                    {(() => {
                                        const project = Array.isArray(lead.project_information) ? lead.project_information[0] : lead.project_information;
                                        const customer = Array.isArray(lead.customer_details) ? lead.customer_details[0] : lead.customer_details;
                                        const projName = String(project?.project_name || '').toLowerCase();
                                        const custName = String(customer?.customer_name || '').toLowerCase();
                                        if (projName.includes('unknown') || custName.includes('unavailable') || custName.includes('unknown')) return '⏳';
                                        return lead.status === 'Master' ? '✓' : lead.status === 'Temporarily Closed' ? '⚠️' : '⏳';
                                    })()}
                                </span>
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-10 sm:py-12 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 text-slate-300">
                                <FileText size={28} className="sm:size-8" />
                            </div>
                            <p className="text-slate-900 font-semibold mb-1 text-base sm:text-lg">No Recent Activities</p>
                            <p className="text-slate-500 text-xs sm:text-sm font-normal mb-6">Your recent lead entries will appear here.</p>
                            <button
                                onClick={fetchLeads}
                                className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs sm:text-sm text-blue-600 hover:bg-blue-50 transition-all active:scale-95 shadow-sm"
                            >
                                Refresh Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color, onClick }) => (
    <button
        onClick={onClick}
        className={`bg-gradient-to-br ${color} rounded-2xl p-3 sm:p-5 text-white shadow-md hover:shadow-lg transition-all text-left w-full group overflow-hidden relative active:scale-[0.97]`}
    >
        <div className="absolute -top-2 -right-2 p-2 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all">
            <Icon size={60} className="sm:w-[70px] sm:h-[70px]" />
        </div>
        <div className="relative z-10">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                <Icon size={16} className="text-white sm:w-[18px] sm:h-[18px]" />
            </div>
            <p className="text-xl sm:text-3xl font-bold mb-0.5 tracking-tight">{value}</p>
            <p className="text-[9px] sm:text-xs font-medium opacity-90 uppercase tracking-wider">{label}</p>
        </div>
    </button>
);

const QuickActionButton = ({ icon: Icon, label, onClick, color }) => {
    const colorMap = {
        emerald: 'bg-emerald-50 border-emerald-100 text-emerald-600 from-emerald-500 to-emerald-600',
        blue: 'bg-blue-50 border-blue-100 text-blue-600 from-blue-500 to-blue-600',
        amber: 'bg-amber-50 border-amber-100 text-amber-600 from-amber-500 to-amber-600'
    };

    const styles = colorMap[color] || colorMap.blue;

    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 p-3 sm:p-4 ${styles.split(' ').slice(0, 2).join(' ')} border rounded-xl hover:bg-white hover:shadow-md transition-all group active:scale-[0.98] text-left`}
        >
            <div className={`w-10 h-10 bg-gradient-to-br ${styles.split(' ').slice(3).join(' ')} rounded-lg flex items-center justify-center text-white shadow-sm shrink-0`}>
                <Icon size={20} />
            </div>
            <span className="font-semibold text-slate-900 text-[13px] sm:text-sm flex-1">{label}</span>
            <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform shrink-0" size={16} />
        </button>
    );
};

const MyLeadsView = ({ leads, searchTerm, setSearchTerm, filterStatus, setFilterStatus, onView, onEdit }) => {
    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-1">My Leads</h1>
                    <p className="text-sm sm:text-base text-slate-600">Manage and track all your assigned leads</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs sm:text-sm font-semibold">
                        {leads.length} Total
                    </span>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-lg font-medium text-[13px] sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-slate-400 shrink-0" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-lg font-medium text-[13px] sm:text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Under Construction</option>
                            <option value="completed">Closed Won</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Leads Grid */}
            {leads.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {leads.map(lead => (
                        <div key={lead.id} className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
                            <div className="flex items-start justify-between mb-3 gap-2">
                                <div className="flex-1 min-w-0">
                                    <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[10px] sm:text-xs font-semibold mb-2">
                                        {lead.lead_number}
                                    </span>
                                    <h3 className="font-semibold text-slate-900 text-sm sm:text-base leading-tight mb-1 truncate">
                                        {lead.project_information?.[0]?.project_name || 'Unnamed Project'}
                                    </h3>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-[9px] sm:text-[10px] font-semibold uppercase shrink-0 ${(() => {
                                    const project = Array.isArray(lead.project_information) ? lead.project_information[0] : lead.project_information;
                                    const customer = Array.isArray(lead.customer_details) ? lead.customer_details[0] : lead.customer_details;
                                    const projName = String(project?.project_name || '').toLowerCase();
                                    const custName = String(customer?.customer_name || '').toLowerCase();
                                    if (projName.includes('unknown') || custName.includes('unavailable') || custName.includes('unknown')) return 'bg-slate-100 text-slate-700';
                                    return lead.status === 'Master' ? 'bg-green-100 text-green-700' :
                                        lead.status === 'Temporarily Closed' ? 'bg-red-100 text-red-700' :
                                            'bg-blue-100 text-blue-700';
                                })()}`}>
                                    {(() => {
                                        const project = Array.isArray(lead.project_information) ? lead.project_information[0] : lead.project_information;
                                        const customer = Array.isArray(lead.customer_details) ? lead.customer_details[0] : lead.customer_details;
                                        const projName = String(project?.project_name || '').toLowerCase();
                                        const custName = String(customer?.customer_name || '').toLowerCase();
                                        if (projName.includes('unknown') || custName.includes('unavailable') || custName.includes('unknown')) return '⏳';
                                        return lead.status === 'Master' ? '✓' : lead.status === 'Temporarily Closed' ? '⚠️' : '⏳';
                                    })()}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                                    <User size={14} className="text-slate-400 shrink-0" />
                                    <span className="font-medium truncate">{lead.customer_details?.[0]?.customer_name || 'No Customer'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                                    <MapPin size={14} className="text-slate-400 shrink-0" />
                                    <span className="font-medium truncate">{lead.site_visits?.[0]?.village_name || 'No Location'}</span>
                                </div>
                            </div>

                            {lead.status === 'Temporarily Closed' && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                                    <p className="text-[10px] font-bold text-red-600 uppercase mb-1">Rejection Reason:</p>
                                    <p className="text-xs text-red-800 font-medium leading-relaxed">{lead.status_reason || 'Needs updates as per admin request.'}</p>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <button
                                    onClick={() => onView(lead)}
                                    className="flex-1 py-2.5 sm:py-3 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-lg font-medium text-[13px] sm:text-sm text-slate-700 transition-all active:scale-[0.98]"
                                >
                                    View Details
                                </button>
                                {lead.status === 'Temporarily Closed' && (
                                    <button
                                        onClick={() => onEdit(lead)}
                                        className="flex-1 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[13px] sm:text-sm transition-all active:scale-[0.98] shadow-md shadow-blue-100 flex items-center justify-center gap-1.5"
                                    >
                                        <Plus size={14} className="rotate-45" /> Edit & Fix
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center border border-slate-200 text-slate-400">
                    <FileText size={40} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                    <p className="text-base sm:text-lg font-semibold text-slate-900 mb-1 sm:mb-2">No leads found</p>
                    <p className="text-sm sm:text-base">Create your first lead or adjust filters</p>
                </div>
            )}
        </div>
    );
};

const NewEntryView = ({ onComplete, user }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        clientName: '', village: '', contactPhone: '', contactEmail: '',
        surveyPersonName: user.fullName || '',
        visitDate: new Date().toISOString().split('T')[0],
        visitTime: new Date().toTimeString().slice(0, 5),
        siteSize: '', sitesVisited: 1,
        didClientBuy: '', productDetails: '', mainDoorType: '', otherDoors: '', reasonNotBought: '',
        photos: [], geoLocation: null,
        isCompleted: '', reasonNotCompleted: '', estimatedDoorCount: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 5));
    const handlePrevious = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 1500));
        setIsSubmitting(false);
        onComplete();
    };

    const steps = [
        { n: 1, t: 'Lead', i: FileText },
        { n: 2, t: 'Site', i: MapPin },
        { n: 3, t: 'Pay', i: Building2 },
        { n: 4, t: 'Photos', i: Camera },
        { n: 5, t: 'Status', i: CheckCircle2 }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                    {steps.map((s, idx) => (
                        <React.Fragment key={s.n}>
                            <div className="flex flex-col items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${currentStep === s.n ? 'bg-blue-600 text-white shadow-lg scale-110' : currentStep > s.n ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    {currentStep > s.n ? '✓' : s.n}
                                </div>
                                <span className="text-xs font-bold hidden sm:block text-slate-500">{s.t}</span>
                            </div>
                            {idx < steps.length - 1 && <div className={`flex-1 h-1 mx-2 rounded-full ${currentStep > s.n ? 'bg-green-500' : 'bg-slate-200'}`} />}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm min-h-[400px]">
                {currentStep === 1 && (
                    <div className="space-y-6 animate-fadeIn">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Lead Information</h2>
                            <p className="text-slate-600 font-medium">Basic details about the client</p>
                        </div>
                        <div className="space-y-4">
                            <FormField label="Client Name" icon={User}>
                                <input value={formData.clientName} onChange={e => updateField('clientName', e.target.value)} placeholder="Full Name" className="form-input" />
                            </FormField>
                            <FormField label="Location" icon={MapPin}>
                                <input value={formData.village} onChange={e => updateField('village', e.target.value)} placeholder="Village/Area" className="form-input" />
                            </FormField>
                        </div>
                    </div>
                )}
                {currentStep > 1 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                            {React.createElement(steps[currentStep - 1].i, { size: 32 })}
                        </div>
                        <div>
                            <p className="text-xl font-black text-slate-900">Step {currentStep}: {steps[currentStep - 1].t} Detail</p>
                            <p className="text-slate-500 font-bold max-w-xs">Detailed form for {steps[currentStep - 1].t.toLowerCase()} will be implemented in the next sub-phase.</p>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-200">
                    <button onClick={handlePrevious} disabled={currentStep === 1} className="px-6 py-3 font-bold text-slate-500 disabled:opacity-30 hover:text-slate-800 transition-colors">← Back</button>
                    {currentStep < 5 ? (
                        <button onClick={handleNext} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 transition-all">Next Step →</button>
                    ) : (
                        <button onClick={handleSubmit} className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2">
                            {isSubmitting ? 'Submitting...' : 'Submit Lead ✓'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const FormField = ({ label, icon: Icon, children }) => (
    <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            {Icon && <Icon size={16} className="text-slate-400" />} {label}
        </label>
        {children}
    </div>
);

const LeadListView = ({ title, icon: Icon, leads, onView, onEdit, emptyMessage }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = leads.filter(lead =>
        String(lead.lead_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(lead.customer_details?.[0]?.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(lead.project_information?.[0]?.project_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 flex items-center gap-2 sm:gap-3">
                        <Icon size={24} className="sm:w-7 sm:h-7 text-blue-600" />
                        {title}
                    </h2>
                    <p className="text-sm sm:text-base text-slate-500 mt-1">Total: {filtered.length} entries</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-sm font-medium text-[13px] sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
            </div>

            {/* Tasks Grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {filtered.map(lead => (
                        <div key={lead.id} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[10px] sm:text-xs font-semibold uppercase">
                                    {lead.lead_number}
                                </span>
                                <span className={`px-2 py-1 rounded-lg text-[9px] sm:text-[10px] font-semibold uppercase shrink-0 ${(() => {
                                    const project = Array.isArray(lead.project_information) ? lead.project_information[0] : lead.project_information;
                                    const customer = Array.isArray(lead.customer_details) ? lead.customer_details[0] : lead.customer_details;
                                    const projName = String(project?.project_name || '').toLowerCase();
                                    const custName = String(customer?.customer_name || '').toLowerCase();
                                    if (projName.includes('unknown') || custName.includes('unavailable') || custName.includes('unknown')) return 'bg-slate-100 text-slate-700';
                                    return lead.status === 'Master' ? 'bg-green-100 text-green-700' :
                                        lead.status === 'Temporarily Closed' ? 'bg-red-100 text-red-700' :
                                            'bg-blue-100 text-blue-700';
                                })()}`}>
                                    {(() => {
                                        const project = Array.isArray(lead.project_information) ? lead.project_information[0] : lead.project_information;
                                        const customer = Array.isArray(lead.customer_details) ? lead.customer_details[0] : lead.customer_details;
                                        const projName = String(project?.project_name || '').toLowerCase();
                                        const custName = String(customer?.customer_name || '').toLowerCase();
                                        if (projName.includes('unknown') || custName.includes('unavailable') || custName.includes('unknown')) return '⏳';
                                        return lead.status === 'Master' ? '✓' : lead.status === 'Temporarily Closed' ? '⚠️' : lead.status;
                                    })()}
                                </span>
                            </div>
                            <h3 className="font-semibold text-sm sm:text-base text-slate-900 mb-3 sm:mb-4 truncate">
                                {lead.project_information?.[0]?.project_name || 'Project Name'}
                            </h3>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                                    <User size={14} className="shrink-0 text-slate-400" />
                                    <span className="font-medium truncate">{lead.customer_details?.[0]?.customer_name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                                    <MapPin size={14} className="shrink-0 text-slate-400" />
                                    <span className="font-medium truncate">{lead.site_visits?.[0]?.village_name || 'No Location'}</span>
                                </div>
                            </div>
                            {lead.status === 'Temporarily Closed' && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                                    <p className="text-[10px] font-bold text-red-600 uppercase mb-1">Correction Needed:</p>
                                    <p className="text-xs text-red-800 font-medium">{lead.status_reason || 'Follow admin instructions.'}</p>
                                </div>
                            )}

                            <div className="flex gap-2 text-center">
                                <button
                                    onClick={() => onView(lead)}
                                    className="flex-1 py-2.5 sm:py-3 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-lg font-medium text-[13px] sm:text-sm text-slate-700 transition-all active:scale-[0.98]"
                                >
                                    View
                                </button>
                                {lead.status === 'Temporarily Closed' && (
                                    <button
                                        onClick={() => onEdit(lead)}
                                        className="flex-[1.5] py-2.5 sm:py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-[13px] sm:text-sm transition-all active:scale-[0.98] shadow-md shadow-orange-100 flex items-center justify-center gap-1.5"
                                    >
                                        <Plus size={14} className="rotate-45" /> Edit & Resubmit
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center border border-slate-200 shadow-sm">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-slate-300">
                        <Icon size={28} className="sm:w-8 sm:h-8" />
                    </div>
                    <p className="text-base sm:text-lg text-slate-900 font-semibold mb-1">
                        {emptyMessage || 'No tasks found'}
                    </p>
                    <p className="text-sm sm:text-base text-slate-500">
                        Try adjusting your search or check back later.
                    </p>
                </div>
            )}
        </div>
    );
};

const PendingTasksView = ({ leads, onView, onEdit }) => (
    <LeadListView
        title="Under Construction"
        icon={Clock}
        leads={leads}
        onView={onView}
        onEdit={onEdit}
        emptyMessage="No under construction projects found"
    />
);

const CompletedTasksView = ({ leads, onView }) => (
    <LeadListView
        title="Closed Won"
        icon={CheckCircle2}
        leads={leads}
        onView={onView}
        emptyMessage="No closed won projects found"
    />
);

const NotificationsView = ({ user, handleNotificationClick }) => <NotificationCenter user={user} fullPage={true} onNotificationClick={handleNotificationClick} />;
const ProfileView = ({ user }) => <PlaceholderView icon={User} title={`Profile: ${user?.fullName}`} />;

const PlaceholderView = ({ icon: Icon, title }) => (
    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
        <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon size={40} />
        </div>
        <p className="text-2xl font-black text-slate-900 mb-2">{title}</p>
        <p className="text-slate-500 font-bold max-w-sm mx-auto">Profile management and settings are coming soon to matched the government portal style.</p>
    </div>
);

export default FieldSurveyDashboard;

