import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import {
    Home, Users, ClipboardList, UserCheck, ShoppingCart, FileText,
    Bell, Archive, Building2, ChevronRight, Clock,
    LogOut, X, Menu, ArrowLeft, AlertCircle, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationCenter from './NotificationCenter';

// Import Admin Module Components
import HomeOverview from './Admin/HomeOverview';
import LeadsManagement from './Admin/LeadsManagement';
import ReportsExports from './Admin/ReportsExports';
import MasterArchive from './Admin/MasterArchive';
import ClosedLossArchive from './Admin/ClosedLossArchive';
import UserManagement from './Admin/UserManagement';

import { checkAndCreateFollowUpNotifications } from '../services/notificationService';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

const AdminDashboard = ({
    user, onLogout, onNewLead, onView,
    LeadFormView, LeadSuccessView, LeadDetailView, isSubmitted
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine activeView from current path
    const getActiveView = () => {
        const path = location.pathname;
        if (path.includes('/admin/leads')) return 'leads';
        if (path.includes('/admin/users')) return 'users';
        if (path.includes('/admin/reminders')) return 'reminders';
        if (path.includes('/admin/reports')) return 'reports';
        if (path.includes('/admin/archive')) return 'archive';
        if (path.includes('/admin/loss')) return 'loss';
        if (path.includes('/admin/notifications')) return 'notifications';
        if (path.includes('/admin/view')) return 'view';
        if (path.includes('/admin/new')) return 'new';
        return 'home';
    };

    const activeView = getActiveView();

    const [leads, setLeads] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, reminders: 0, surveyPersonsCount: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

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
            .channel('admin_dashboard_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
                fetchLeads(false);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id]);

    const fetchLeads = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        setError(null);
        try {
            const { data, error: fetchErr } = await supabase
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
                `)
                .order('created_at', { ascending: false });

            if (fetchErr) {
                setError(`Fetch Error: ${fetchErr.message}`);
                return;
            }

            if (data) {
                const activeLeads = data.filter(l => l.status !== 'Closed Permanently');
                setLeads(activeLeads);

                // Fetch survey person count for consistency
                const { count: surveyCount } = await supabase
                    .from('users')
                    .select('*', { count: 'exact', head: true })
                    .eq('role', 'engineer'); // Database role still 'engineer' but UI says 'Field Survey Person'

                const statsObj = {
                    total: data.length,
                    underConstruction: data.filter(l => String(l.status || '').toLowerCase() === 'roaming').length,
                    closedWon: data.filter(l => String(l.status || '').toLowerCase() === 'master').length,
                    pending: data.filter(l => String(l.status || '').toLowerCase() === 'temporarily closed').length,
                    closedLoss: data.filter(l => String(l.status || '').toLowerCase() === 'closed permanently').length,
                    surveyPersonsCount: surveyCount || 0
                };
                setStats(statsObj);
            }
        } catch (err) {
            setError(`System Error: ${err.message}`);
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
            navigate('/admin/leads');
        }
    };

    const navigationItems = [
        { id: 'home', label: 'Home Overview', icon: Home, path: '/admin', color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { id: 'leads', label: 'Leads Management', icon: ClipboardList, path: '/admin/leads', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
        { id: 'users', label: 'User Control', icon: Users, path: '/admin/users', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
        { id: 'reminders', label: 'Follow-ups', icon: Clock, path: '/admin/reminders', color: 'text-amber-600', bgColor: 'bg-amber-50' },
        { id: 'reports', label: 'Reports & Exports', icon: FileText, path: '/admin/reports', color: 'text-rose-600', bgColor: 'bg-rose-50' },
        { id: 'archive', label: 'Closed Won', icon: Archive, path: '/admin/archive', color: 'text-slate-600', bgColor: 'bg-slate-50' },
        { id: 'loss', label: 'Closed Loss', icon: XCircle, path: '/admin/loss', color: 'text-red-600', bgColor: 'bg-red-50' },
        { id: 'notifications', label: 'Notifications', icon: Bell, path: '/admin/notifications', color: 'text-violet-600', bgColor: 'bg-violet-50' },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Premium Mobile-First Top Bar - Hidden on View/New to avoid overlap */}
            {activeView !== 'view' && activeView !== 'new' && (
                <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
                    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3">
                        <div className="flex items-center justify-between">
                            {/* Logo Section - Mobile Optimized */}
                            <button
                                onClick={() => navigate('/admin')}
                                className="flex items-center gap-2 sm:gap-2.5 hover:opacity-80 transition-opacity active:scale-95"
                            >
                                <div className="w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center transition-transform hover:scale-110">
                                    <img src="/assests/logo.png" alt="Logo" className="w-full h-full object-contain filter drop-shadow-sm" />
                                </div>
                                <div className="text-left">
                                    <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight tracking-tight">
                                        <span className="text-slate-800">Survey</span><span className="text-emerald-500">2</span><span className="text-emerald-600">Lead</span>
                                    </h1>
                                    <p className="text-[9px] sm:text-[10px] text-slate-500 font-semibold hidden sm:block leading-tight tracking-wider uppercase">Admin Portal</p>
                                </div>
                            </button>

                            {/* Right Side - Notifications & Profile */}
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <NotificationCenter
                                    user={user}
                                    leads={leads}
                                    onNotificationClick={handleNotificationClick}
                                    onSeeAll={() => navigate('/admin/notifications')}
                                />

                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2.5 py-1.5 sm:py-2 hover:bg-slate-50 active:bg-slate-100 rounded-lg sm:rounded-xl transition-all border border-slate-200"
                                >
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-sm">
                                        {user.fullName?.charAt(0) || 'A'}
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-semibold text-slate-900 leading-tight">{user.fullName || 'Admin'}</p>
                                        <p className="text-[10px] text-slate-500 font-medium leading-tight">Administrator</p>
                                    </div>
                                    <ChevronRight
                                        size={14}
                                        className={`hidden sm:block text-slate-400 transition-transform ${showProfileMenu ? 'rotate-90' : ''}`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Menu Panel - Mobile Optimized */}
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
                                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 sm:p-5 text-white">
                                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                                            <h2 className="text-base sm:text-lg font-bold">Menu</h2>
                                            <button
                                                onClick={() => setShowProfileMenu(false)}
                                                className="p-2 hover:bg-white/20 active:bg-white/30 rounded-lg transition-all"
                                            >
                                                <X size={18} className="sm:w-5 sm:h-5" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2.5 sm:gap-3">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-lg sm:text-xl font-bold border-2 border-white/30">
                                                {user.fullName?.charAt(0) || 'A'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-base sm:text-lg truncate">{user.fullName || 'Admin'}</p>
                                                <p className="text-white/80 text-xs sm:text-sm font-medium">Administrator</p>
                                                <p className="text-white/60 text-[10px] sm:text-xs font-medium mt-0.5 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Navigation - Scrollable */}
                                    <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                                        <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 sm:mb-3 px-2">Navigation</p>
                                        <div className="space-y-1">
                                            {navigationItems.map(item => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => {
                                                        navigate(item.path);
                                                        setShowProfileMenu(false);
                                                    }}
                                                    className={`
                                                    w-full flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl 
                                                    font-semibold text-xs sm:text-sm transition-all group
                                                    ${activeView === item.id
                                                            ? 'bg-slate-100 text-slate-900 shadow-sm'
                                                            : 'text-slate-700 hover:bg-slate-50 active:bg-slate-100'}
                                                `}
                                                >
                                                    <div className={`
                                                    w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl transition-all flex items-center justify-center 
                                                    ${item.bgColor} 
                                                    ${activeView === item.id ? 'ring-2 ring-slate-200 shadow-sm' : 'group-hover:scale-105'}
                                                `}>
                                                        <item.icon size={18} className={`${item.color} sm:w-5 sm:h-5`} />
                                                    </div>
                                                    <span className={`flex-1 text-left ${activeView === item.id ? 'translate-x-0.5 transition-transform' : ''}`}>
                                                        {item.label}
                                                    </span>
                                                    {item.id === 'reminders' && stats.pending > 0 && (
                                                        <span className="px-2 py-0.5 bg-amber-500 text-white rounded-lg text-[10px] font-bold shadow-sm">
                                                            {stats.pending}
                                                        </span>
                                                    )}
                                                    {item.id === 'leads' && stats.underConstruction > 0 && (
                                                        <span className="px-2 py-0.5 bg-emerald-500 text-white rounded-lg text-[10px] font-bold shadow-sm">
                                                            {stats.underConstruction}
                                                        </span>
                                                    )}
                                                    {activeView === item.id ? (
                                                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                                                    ) : (
                                                        <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Quick Stats Card */}
                                        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl border border-indigo-100">
                                            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 sm:mb-3">Quick Stats</p>
                                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                                <div className="bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl p-2.5 sm:p-3 border border-white">
                                                    <p className="text-xl sm:text-2xl font-bold text-indigo-600">{stats.total}</p>
                                                    <p className="text-[10px] sm:text-xs font-semibold text-slate-600">Total</p>
                                                </div>
                                                <div className="bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl p-2.5 sm:p-3 border border-white">
                                                    <p className="text-xl sm:text-2xl font-bold text-amber-600">{stats.underConstruction}</p>
                                                    <p className="text-[10px] sm:text-xs font-semibold text-slate-600">Active</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Logout Button - Sticky Bottom */}
                                    <div className="p-3 sm:p-4 border-t border-slate-100 bg-white">
                                        <button
                                            onClick={onLogout}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-red-50 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-100 active:bg-red-200 transition-all border border-red-200"
                                        >
                                            <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
                                            Logout
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </header>
            )}

            <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 pb-24 lg:pb-6">
                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-slate-600 font-bold">Loading dashboard...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="text-red-600" size={24} />
                                    <div>
                                        <p className="text-red-900 font-bold">Data Access Alert</p>
                                        <p className="text-red-700 text-sm font-medium">{error}</p>
                                    </div>
                                </div>
                                <button onClick={() => fetchLeads()} className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all shadow-md active:scale-95">Retry Fetch</button>
                            </div>
                        )}

                        <Routes>
                            <Route index element={<HomeOverview stats={stats} leads={leads} onView={onView} onNewLead={onNewLead} />} />
                            <Route path="home" element={<Navigate to="/admin" replace />} />
                            <Route path="leads" element={<LeadsManagement leads={leads} fetchLeads={fetchLeads} onView={onView} onNewLead={onNewLead} />} />
                            <Route path="users" element={<UserManagement />} />
                            <Route path="reminders" element={<LeadsManagement leads={leads.filter(l => String(l.status || '').toLowerCase() === 'temporarily closed')} fetchLeads={fetchLeads} onView={onView} onNewLead={onNewLead} title="Pending Reminders" />} />
                            <Route path="reports" element={<ReportsExports leads={leads} onView={onView} />} />
                            <Route path="archive" element={<MasterArchive leads={leads} onView={onView} />} />
                            <Route path="loss" element={<ClosedLossArchive leads={leads} onView={onView} />} />
                            <Route path="notifications" element={<NotificationCenter user={user} fullPage onNotificationClick={handleNotificationClick} />} />
                            <Route path="new" element={isSubmitted ? LeadSuccessView : LeadFormView} />
                            <Route path="view" element={LeadDetailView} />
                        </Routes>
                    </>
                )}
            </main>


            {/* Mobile Bottom Navigation - Instagram Style */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-2xl z-40 safe-area-inset-bottom">
                <div className="grid grid-cols-4 gap-0.5 p-1.5">
                    {[
                        { id: 'home', icon: Home, label: 'Home', path: '/admin', color: 'text-indigo-600' },
                        { id: 'leads', icon: ClipboardList, label: 'Leads', path: '/admin/leads', color: 'text-emerald-600', badge: stats.underConstruction },
                        { id: 'reports', icon: FileText, label: 'Reports', path: '/admin/reports', color: 'text-rose-600' },
                        { id: 'menu', icon: Menu, label: 'Menu', onClick: () => setShowProfileMenu(true), color: 'text-slate-600' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => item.onClick ? item.onClick() : navigate(item.path)}
                            className={`
                                relative flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all active:scale-95
                                ${activeView === item.id ? 'bg-slate-50' : ''}
                            `}
                        >
                            {item.badge > 0 && (
                                <span className="absolute top-1.5 right-1/4 min-w-[16px] h-4 px-1 bg-gradient-to-br from-red-500 to-pink-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                                    {item.badge > 9 ? '9+' : item.badge}
                                </span>
                            )}
                            <item.icon
                                size={20}
                                className={`transition-colors ${activeView === item.id || item.id === 'menu' ? item.color : 'text-slate-400'}`}
                                strokeWidth={activeView === item.id ? 2.5 : 2}
                            />
                            <span className={`
                                text-[10px] font-semibold uppercase tracking-tight transition-colors
                                ${activeView === item.id ? item.color : 'text-slate-400'}
                            `}>
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
