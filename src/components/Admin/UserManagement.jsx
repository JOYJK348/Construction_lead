import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, UserPlus, Search, Edit2, Trash2, X, Check,
    Shield, User, Mail, Lock, Phone, MapPin, Hash,
    Loader2, AlertCircle, RefreshCw, MoreVertical
} from 'lucide-react';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../services/authService';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        password_hash: '',
        full_name: '',
        email: '',
        role: 'engineer',
        phone: '',
        address: '',
        is_active: true
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        const result = await getAllUsers();
        if (result.success) {
            setUsers(result.data);
        } else {
            setError('Failed to fetch users');
        }
        setLoading(false);
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                username: user.username || '',
                password_hash: user.password_hash || '',
                full_name: user.full_name || '',
                email: user.email || '',
                role: user.role || 'engineer',
                phone: user.phone || '',
                address: user.address || '',
                is_active: user.is_active ?? true
            });
        } else {
            setEditingUser(null);
            setFormData({
                username: '',
                password_hash: '',
                full_name: '',
                email: '',
                role: 'engineer',
                phone: '',
                address: '',
                is_active: true
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const result = editingUser
            ? await updateUser(editingUser.id, formData)
            : await createUser(formData);

        if (result.success) {
            fetchUsers();
            setShowModal(false);
        } else {
            alert('Error: ' + (result.error?.message || 'Something went wrong'));
        }
        setSubmitting(false);
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        const result = await deleteUser(userId);
        if (result.success) {
            fetchUsers();
        } else {
            alert('Error deleting user');
        }
    };

    const filteredUsers = users.filter(user =>
        String(user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(user.user_number || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4 sm:space-y-6 pb-6">
            {/* Header - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">User Management</h2>
                    <p className="text-slate-600 font-medium text-sm sm:text-base mt-0.5">Manage admin and field survey person accounts</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all active:scale-95"
                >
                    <UserPlus size={18} className="sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Add New User</span>
                    <span className="sm:hidden">New User</span>
                </button>
            </div>

            {/* Stats Summary - Mobile Optimized */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Total</p>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900">{users.length}</p>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-[10px] sm:text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Active</p>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900">{users.filter(u => u.is_active).length}</p>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-[10px] sm:text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">Admins</p>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900">{users.filter(u => u.role === 'admin').length}</p>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-[10px] sm:text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Field Surveyors</p>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900">{users.filter(u => u.role === 'engineer').length}</p>
                </div>
            </div>

            {/* Search Card - Mobile Optimized */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-3 sm:p-4 md:p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative">
                        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none shadow-sm"
                        />
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">User ID</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Username</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Role</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <Loader2 className="animate-spin mx-auto text-indigo-600 mb-2" size={32} />
                                        <p className="text-slate-500 font-semibold">Loading users...</p>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <Users className="mx-auto text-slate-200 mb-2" size={48} />
                                        <p className="text-slate-500 font-semibold">No users found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">
                                                {user.user_number || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-slate-900">{user.full_name}</p>
                                            <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-slate-700">@{user.username}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${user.role === 'admin'
                                                ? 'bg-purple-50 text-purple-700 border border-purple-100'
                                                : 'bg-blue-50 text-blue-700 border border-blue-100'
                                                }`}>
                                                <Shield size={10} />
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${user.is_active ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-slate-400 bg-slate-100 border border-slate-200'
                                                }`}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(user)}
                                                    className="p-2 hover:bg-slate-200 text-slate-600 rounded-lg transition-all"
                                                    title="Edit User"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg transition-all"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden divide-y divide-slate-100">
                    {loading ? (
                        <div className="p-12 text-center">
                            <Loader2 className="animate-spin mx-auto text-indigo-600 mb-2" size={32} />
                            <p className="text-slate-500 font-semibold text-sm">Loading users...</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="p-12 text-center">
                            <Users className="mx-auto text-slate-200 mb-2" size={40} />
                            <p className="text-slate-500 font-semibold text-sm">No users found</p>
                        </div>
                    ) : (
                        filteredUsers.map(user => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onEdit={() => handleOpenModal(user)}
                                onDelete={() => handleDelete(user.id)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Create/Edit Modal - Mobile Optimized */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-xl relative overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                        {editingUser ? <Edit2 size={18} className="sm:w-5 sm:h-5" /> : <UserPlus size={18} className="sm:w-5 sm:h-5" />}
                                    </div>
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                                            {editingUser ? 'Edit User' : 'New User'}
                                        </h3>
                                        <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                                            {editingUser ? 'Update account info' : 'Create new account'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400"
                                >
                                    <X size={20} className="sm:w-6 sm:h-6" />
                                </button>
                            </div>

                            {/* Modal Body - Scrollable Form */}
                            <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                                {/* Personal Information */}
                                <div className="space-y-3 sm:space-y-4">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Personal Details</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-700 ml-1">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.full_name}
                                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                                    className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-700 ml-1">Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                                <input
                                                    required
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-700 ml-1">Phone</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                    placeholder="+91 00000 00000"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-700 ml-1">Role</label>
                                            <div className="relative">
                                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                                <select
                                                    value={formData.role}
                                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                    className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none"
                                                >
                                                    <option value="engineer">Field Survey Person</option>
                                                    <option value="admin">Administrator</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700 ml-1">Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-2.5 text-slate-400" size={14} />
                                            <textarea
                                                rows="2"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                                                placeholder="Street, City, State..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Credentials */}
                                <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Authentication</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-700 ml-1">Username</label>
                                            <div className="relative">
                                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.username}
                                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                    className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 italic"
                                                    placeholder="john_doe"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-700 ml-1">Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                                <input
                                                    required={!editingUser}
                                                    type="text"
                                                    value={formData.password_hash}
                                                    onChange={(e) => setFormData({ ...formData, password_hash: e.target.value })}
                                                    className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {editingUser && (
                                        <div className="flex items-center gap-2 p-2.5 sm:p-3 bg-amber-50 rounded-lg sm:rounded-xl border border-amber-100">
                                            <AlertCircle className="text-amber-600 shrink-0" size={16} />
                                            <p className="text-[10px] sm:text-xs font-medium text-amber-700">Leave password as is if no change needed.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Status Toggle */}
                                <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-200">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Account Access</p>
                                        <p className="text-xs text-slate-500 font-medium">Allow user to sign in</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                        className={`w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-all relative ${formData.is_active ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                    >
                                        <div className={`absolute top-0.5 sm:top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${formData.is_active ? 'left-6 sm:left-8' : 'left-0.5 sm:left-1'}`} />
                                    </button>
                                </div>

                                {/* Modal Footer */}
                                <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 sticky bottom-0 bg-white">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm sm:text-base hover:bg-slate-200 transition-all active:scale-95"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-[2] px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} />
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Check size={18} />
                                                <span>{editingUser ? 'Update' : 'Create'}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Mobile User Card Component
const UserCard = ({ user, onEdit, onDelete }) => (
    <div className="p-4 hover:bg-slate-50 transition-colors">
        <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        {user.user_number || 'N/A'}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${user.role === 'admin'
                        ? 'bg-purple-50 text-purple-700 border border-purple-100'
                        : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>
                        <Shield size={8} />
                        {user.role}
                    </span>
                </div>
                <p className="font-semibold text-slate-900 text-sm truncate">{user.full_name}</p>
                <p className="text-xs text-slate-500 font-medium truncate">@{user.username}</p>
                <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${user.is_active ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-slate-400 bg-slate-100 border border-slate-200'
                    }`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={onEdit}
                        className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-all"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-all"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default UserManagement;
