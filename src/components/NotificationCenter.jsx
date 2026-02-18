import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, X, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabase';

const NotificationCenter = ({ user, fullPage = false, onNotificationClick, onSeeAll }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleItemClick = (notification) => {
        if (!notification.is_read) markAsRead(notification.id);
        if (onNotificationClick) onNotificationClick(notification);
        if (!fullPage) setIsOpen(false);
    };

    useEffect(() => {
        if (isOpen && !fullPage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, fullPage]);

    useEffect(() => {
        if (user?.id) {
            fetchNotifications();

            // REAL-TIME: Listen for new notifications
            const channel = supabase
                .channel(`user-notifications-${user.id}`)
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                }, (payload) => {
                    console.log('New notification received:', payload.new);
                    setNotifications(prev => [payload.new, ...prev]);
                    setUnreadCount(prev => prev + 1);

                    // Haptic feedback
                    if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
                })
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [user.id]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;

            setNotifications(data || []);
            setUnreadCount(data?.filter(n => !n.is_read).length || 0);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', notificationId);

            if (error) throw error;

            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', user.id)
                .eq('is_read', false);

            if (error) throw error;

            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('id', notificationId);

            if (error) throw error;

            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            setUnreadCount(prev => {
                const notification = notifications.find(n => n.id === notificationId);
                return notification && !notification.is_read ? prev - 1 : prev;
            });
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'reminder': return '⏰';
            case 'completion': return '✅';
            case 'assignment': return '👤';
            case 'approval': return '✓';
            case 'rejection': return '✗';
            default: return '📢';
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'reminder': return { bg: 'bg-amber-50', ring: 'ring-amber-100', icon: 'bg-gradient-to-br from-amber-400 to-orange-500' };
            case 'completion': return { bg: 'bg-emerald-50', ring: 'ring-emerald-100', icon: 'bg-gradient-to-br from-emerald-400 to-teal-500' };
            case 'assignment': return { bg: 'bg-blue-50', ring: 'ring-blue-100', icon: 'bg-gradient-to-br from-blue-400 to-indigo-500' };
            case 'approval': return { bg: 'bg-green-50', ring: 'ring-green-100', icon: 'bg-gradient-to-br from-green-400 to-emerald-500' };
            case 'rejection': return { bg: 'bg-red-50', ring: 'ring-red-100', icon: 'bg-gradient-to-br from-red-400 to-rose-500' };
            default: return { bg: 'bg-indigo-50', ring: 'ring-indigo-100', icon: 'bg-gradient-to-br from-indigo-400 to-purple-500' };
        }
    };

    const formatTime = (timestamp) => {
        const now = new Date();
        const notifTime = new Date(timestamp);
        const diffMs = now - notifTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return notifTime.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    const renderNotificationList = (isDropdown = false) => (
        <div className={`
            ${fullPage && !isDropdown ? 'w-full' : 'w-full'} 
            bg-white ${isDropdown ? 'rounded-t-3xl sm:rounded-2xl' : 'rounded-2xl'} shadow-2xl border border-slate-200 overflow-hidden
            ${!fullPage && isDropdown ? 'max-h-[85vh] sm:max-h-[600px]' : ''}
        `}>
            {/* Header */}
            <div className="sticky top-0 z-10 px-4 sm:px-5 py-4 border-b border-slate-100 bg-white/95 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-900 text-base sm:text-lg">Notifications</h3>
                        {unreadCount > 0 && (
                            <p className="text-[10px] sm:text-xs text-blue-600 font-semibold mt-0.5">
                                {unreadCount} new {unreadCount === 1 ? 'update' : 'updates'}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold hover:bg-blue-100 active:scale-95 transition-all"
                            >
                                <CheckCheck size={14} />
                                <span className="hidden sm:inline">Mark all</span>
                            </button>
                        )}
                        {isDropdown && (
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all active:scale-95"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* List */}
            <div className={`${fullPage && !isDropdown ? 'min-h-[400px]' : 'max-h-[calc(85vh-120px)] sm:max-h-[480px]'} overflow-y-auto`}>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                        <p className="text-sm text-slate-500 font-medium">Loading notifications...</p>
                    </div>
                ) : notifications.length > 0 ? (
                    <div>
                        {notifications.map((notification, index) => {
                            const colors = getNotificationColor(notification.type);
                            return (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className={`
                                        relative px-4 sm:px-5 py-4 border-b border-slate-50 last:border-0
                                        ${!notification.is_read ? 'bg-blue-50/30' : 'bg-white'}
                                        hover:bg-slate-50/80 active:bg-slate-100/80 transition-all cursor-pointer group
                                    `}
                                    onClick={() => handleItemClick(notification)}
                                >
                                    {/* Unread indicator */}
                                    {!notification.is_read && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r-full"></div>
                                    )}

                                    <div className="flex items-start gap-3">
                                        {/* Icon */}
                                        <div className={`
                                            relative flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${colors.icon}
                                            flex items-center justify-center text-white text-lg shadow-lg
                                            group-hover:scale-110 transition-transform duration-200
                                        `}>
                                            <span className="relative z-10">{getNotificationIcon(notification.type)}</span>
                                            <div className={`absolute inset-0 ${colors.icon} opacity-20 blur-xl rounded-2xl`}></div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 pt-0.5">
                                            <p className={`
                                                text-sm sm:text-[15px] leading-snug mb-1.5
                                                ${!notification.is_read ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}
                                            `}>
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] sm:text-xs text-blue-600 font-semibold uppercase tracking-wide">
                                                    {notification.type || 'Update'}
                                                </span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
                                                    {formatTime(notification.created_at)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Delete button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification(notification.id);
                                            }}
                                            className="
                                                flex-shrink-0 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 
                                                rounded-full transition-all opacity-0 group-hover:opacity-100
                                                active:scale-90
                                            "
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-6">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-4xl sm:text-5xl mb-4 shadow-inner">
                            🔔
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2">All caught up!</h4>
                        <p className="text-sm text-slate-500 font-medium text-center max-w-xs">
                            No new notifications. We'll notify you when something important happens.
                        </p>
                    </div>
                )}
            </div>

            {/* Footer - Only in Dropdown mode */}
            {isDropdown && notifications.length > 0 && (
                <div className="sticky bottom-0 px-4 py-3 border-t border-slate-100 bg-white/95 backdrop-blur-xl">
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            if (onSeeAll) onSeeAll();
                        }}
                        className="w-full py-2.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                        View All Notifications
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );

    if (fullPage) {
        const todayNotifs = notifications.filter(n => {
            const today = new Date().toDateString();
            return new Date(n.created_at).toDateString() === today;
        });
        const earlierNotifs = notifications.filter(n => {
            const today = new Date().toDateString();
            return new Date(n.created_at).toDateString() !== today;
        });

        const NotifItem = ({ notification, index }) => {
            const colors = getNotificationColor(notification.type);
            return (
                <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className={`
                        relative flex items-start gap-3 px-4 py-4 border-b border-slate-100 last:border-0
                        ${!notification.is_read ? 'bg-blue-50/40' : 'bg-white'}
                        active:bg-slate-50 transition-all cursor-pointer group
                    `}
                    onClick={() => handleItemClick(notification)}
                >
                    {/* Unread left bar */}
                    {!notification.is_read && (
                        <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r-full" />
                    )}

                    {/* Icon */}
                    <div className={`
                        relative flex-shrink-0 w-11 h-11 rounded-2xl ${colors.icon}
                        flex items-center justify-center text-lg shadow-md
                        group-active:scale-95 transition-transform
                    `}>
                        <span className="relative z-10">{getNotificationIcon(notification.type)}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug mb-1 ${!notification.is_read ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                            {notification.message}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${colors.bg} ${notification.type === 'reminder' ? 'text-amber-700' : notification.type === 'completion' ? 'text-emerald-700' : notification.type === 'assignment' ? 'text-blue-700' : notification.type === 'approval' ? 'text-green-700' : notification.type === 'rejection' ? 'text-red-700' : 'text-indigo-700'}`}>
                                {notification.type || 'update'}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                                {formatTime(notification.created_at)}
                            </span>
                        </div>
                    </div>

                    {/* Delete */}
                    <button
                        onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 active:scale-90"
                    >
                        <Trash2 size={15} />
                    </button>
                </motion.div>
            );
        };

        return (
            <div className="w-full min-h-screen bg-slate-50 flex flex-col">
                {/* Sticky Page Header */}
                <div className="sticky top-0 z-20 bg-white border-b border-slate-100 shadow-sm">
                    <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between">
                        <div>
                            <h1 className="text-base font-bold text-slate-900 leading-tight">Notifications</h1>
                            {unreadCount > 0 ? (
                                <p className="text-[11px] text-blue-600 font-semibold mt-0.5">
                                    {unreadCount} unread
                                </p>
                            ) : (
                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">All caught up</p>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 active:scale-95 transition-all"
                            >
                                <CheckCheck size={14} />
                                Mark all read
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 pb-28 space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <div className="w-10 h-10 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
                            <p className="text-sm text-slate-500 font-medium">Loading...</p>
                        </div>
                    ) : notifications.length > 0 ? (
                        <>
                            {/* Today */}
                            {todayNotifs.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Today</p>
                                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                        {todayNotifs.map((n, i) => <NotifItem key={n.id} notification={n} index={i} />)}
                                    </div>
                                </div>
                            )}

                            {/* Earlier */}
                            {earlierNotifs.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Earlier</p>
                                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                        {earlierNotifs.map((n, i) => <NotifItem key={n.id} notification={n} index={i} />)}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-24 px-6">
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-5xl mb-5 shadow-inner">
                                🔔
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 mb-2">All caught up!</h4>
                            <p className="text-sm text-slate-500 font-medium text-center max-w-xs leading-relaxed">
                                No notifications yet. We'll alert you when something needs your attention.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Notification Bell */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    relative p-2 sm:p-2.5 rounded-xl transition-all group active:scale-95
                    ${isOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'}
                `}
            >
                <Bell
                    size={22}
                    className={`transition-transform ${unreadCount > 0 ? 'animate-[swing_2s_ease-in-out_infinite]' : ''}`}
                />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-[20px] px-1 bg-gradient-to-br from-red-500 to-pink-600 text-white text-[10px] sm:text-[11px] font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Notification Panel (Dropdown Mode) */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] bg-black/20 sm:bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed inset-x-0 bottom-0 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-3 z-[70] sm:w-[420px] origin-bottom sm:origin-top-right"
                        >
                            {renderNotificationList(true)}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes swing {
                    0%, 100% { transform: rotate(0deg); }
                    10% { transform: rotate(14deg); }
                    20% { transform: rotate(-12deg); }
                    30% { transform: rotate(10deg); }
                    40% { transform: rotate(-8deg); }
                    50% { transform: rotate(6deg); }
                    60% { transform: rotate(-4deg); }
                    70% { transform: rotate(2deg); }
                    80% { transform: rotate(-1deg); }
                }
            `}} />
        </div>
    );
};

export default NotificationCenter;
