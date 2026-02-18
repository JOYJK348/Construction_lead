import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import {
    Home, FileText, Plus, Clock, CheckCircle2, Bell, User,
    HelpCircle, Search, Filter, MapPin, Calendar,
    Phone, Building2, Camera, AlertCircle, ChevronRight,
    LogOut, TrendingUp, Activity, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EngineerDashboard = ({ user, onLogout, onNewLead, onView }) => {
    const [activeView, setActiveView] = useState('home');
    const [leads, setLeads] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, reminders: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        fetchLeads();
    }, [user]);

    const fetchLeads = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('leads')
            .select(`
                *,
                customer_details (*),
                project_information (*),
                site_visits (*),
                assignments:lead_assignments!inner(*)
            `)
            .eq('assignments.engineer_id', user.id)
            .eq('assignments.is_current', true)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setLeads(data);
            setStats({
                total: data.length,
                pending: data.filter(l => l.status === 'Roaming' || l.status === 'Temporarily Closed').length,
                completed: data.filter(l => l.status === 'Master').length,
                reminders: data.filter(l => l.status === 'Temporarily Closed').length
            });
        }
        setLoading(false);
    };

    const navigationItems = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'my-leads', label: 'My Leads', icon: FileText },
        { id: 'new-entry', label: 'New Entry', icon: Plus },
        { id: 'pending', label: 'Pending Tasks', icon: Clock },
        { id: 'completed', label: 'Completed', icon: CheckCircle2 },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'help', label: 'Help & Support', icon: HelpCircle },
    ];

    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            lead.lead_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.customer_details?.[0]?.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.site_visits?.[0]?.village_name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterStatus === 'all' ? true :
                filterStatus === 'pending' ? (lead.status === 'Roaming' || lead.status === 'Temporarily Closed') :
                    filterStatus === 'completed' ? lead.status === 'Master' : true;

        return matchesSearch && matchesFilter;
    });

    const renderContent = () => {
        switch (activeView) {
            case 'home': return <HomeView stats={stats} leads={leads} setActiveView={setActiveView} />;
            case 'my-leads': return <MyLeadsView leads={filteredLeads} searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterStatus={filterStatus} setFilterStatus={setFilterStatus} onView={onView} />;
            case 'new-entry': return <NewEntryView onComplete={() => { fetchLeads(); setActiveView('my-leads'); }} user={user} />;
            case 'pending': return <PendingTasksView leads={leads.filter(l => l.status === 'Roaming' || l.status === 'Temporarily Closed')} onView={onView} />;
            case 'completed': return <CompletedTasksView leads={leads.filter(l => l.status === 'Master')} onView={onView} />;
            case 'notifications': return <NotificationsView user={user} />;
            case 'profile': return <ProfileView user={user} stats={stats} />;
            case 'help': return <HelpView />;
            default: return <HomeView stats={stats} leads={leads} setActiveView={setActiveView} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Clean Top Navigation Bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3.5">
                    <div className="flex items-center justify-between">
                        {/* Logo & Brand */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
                                <Building2 size={22} />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-slate-900 leading-none">LeadPro</h1>
                                <p className="text-xs text-slate-500 font-semibold">Field Management Portal</p>
                            </div>
                        </div>

                        {/* Right Side - Notifications & Profile */}
                        <div className="flex items-center gap-3">
                            {/* Notifications */}
                            <button
                                onClick={() => setActiveView('notifications')}
                                className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-all"
                            >
                                <Bell size={22} className="text-slate-600" />
                                {stats.reminders > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center animate-pulse">
                                        {stats.reminders}
                                    </span>
                                )}
                            </button>

                            {/* Profile Button */}
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl transition-all border border-slate-200"
                            >
                                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                                    {user.fullName?.charAt(0) || 'E'}
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-bold text-slate-900 leading-none">{user.fullName}</p>
                                    <p className="text-xs text-slate-500 font-medium">Field Engineer</p>
                                </div>
                                <ChevronRight
                                    size={18}
                                    className={`text-slate-400 transition-transform ${showProfileMenu ? 'rotate-90' : ''}`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side Dropdown Panel */}
                <AnimatePresence>
                    {showProfileMenu && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowProfileMenu(false)}
                                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                            />

                            {/* Dropdown Panel */}
                            <motion.div
                                initial={{ opacity: 0, x: 300 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 300 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="fixed top-0 right-0 h-screen w-80 bg-white shadow-2xl z-50 overflow-y-auto"
                            >
                                {/* Profile Header */}
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-black">Menu</h2>
                                        <button
                                            onClick={() => setShowProfileMenu(false)}
                                            className="p-2 hover:bg-white/20 rounded-lg transition-all"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl font-black border-2 border-white/30">
                                            {user.fullName?.charAt(0) || 'E'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{user.fullName}</p>
                                            <p className="text-xs text-blue-100 font-medium">{user.email}</p>
                                            <p className="text-xs text-blue-200 font-semibold mt-1">Field Engineer</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation Section */}
                                <div className="p-4">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Navigation</p>
                                    <nav className="space-y-1">
                                        {navigationItems.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    setActiveView(item.id);
                                                    setShowProfileMenu(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all group ${activeView === item.id
                                                        ? 'bg-blue-50 text-blue-700'
                                                        : 'text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon size={20} className={activeView === item.id ? 'text-blue-600' : 'text-slate-400'} />
                                                    <span>{item.label}</span>
                                                </div>
                                                {item.id === 'pending' && stats.pending > 0 && (
                                                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-black">
                                                        {stats.pending}
                                                    </span>
                                                )}
                                                {item.id === 'notifications' && stats.reminders > 0 && (
                                                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-black">
                                                        {stats.reminders}
                                                    </span>
                                                )}
                                                <ChevronRight
                                                    size={16}
                                                    className={`${activeView === item.id ? 'text-blue-600' : 'text-slate-300'} group-hover:translate-x-1 transition-transform`}
                                                />
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                {/* Logout Section */}
                                <div className="p-4 border-t border-slate-200 absolute bottom-0 left-0 right-0 bg-white">
                                    <button
                                        onClick={onLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-600 hover:bg-red-50 transition-all"
                                    >
                                        <LogOut size={20} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </header>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 py-6 pb-24 lg:pb-6">
                {renderContent()}
            </main>

            {/* Mobile Bottom Quick Actions */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-2xl z-40">
                <div className="grid grid-cols-4 gap-1 p-2">
                    {[
                        { id: 'home', icon: Home, label: 'Home' },
                        { id: 'my-leads', icon: FileText, label: 'Leads' },
                        { id: 'new-entry', icon: Plus, label: 'New' },
                        { id: 'menu', icon: Menu, label: 'Menu', onClick: () => setShowProfileMenu(true) }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => item.onClick ? item.onClick() : setActiveView(item.id)}
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${activeView === item.id
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-slate-500'
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="text-xs font-bold">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EngineerDashboard;
