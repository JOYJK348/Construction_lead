import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../supabase';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Forces fields to be empty on fresh mount (anti-autofill)
    React.useEffect(() => {
        setEmail('');
        setPassword('');
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Support login with either email or username
            const { data, error: dbError } = await supabase
                .from('users')
                .select('id, email, username, password_hash, role, full_name')
                .or(`email.eq.${email.trim()},username.eq.${email.trim()}`)
                .eq('is_active', true)
                .single();

            if (dbError || !data) {
                throw new Error('Invalid credentials or account inactive');
            }

            // Strict Verification (Plain text matching as per system setup)
            if (password === data.password_hash) {
                // Success: Pass user context to App.jsx
                onLogin(data.role, data.email, data.id, data.full_name);
            } else {
                throw new Error('Invalid email/username or password');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-50 to-blue-50 rounded-full blur-3xl"></div>
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-md"
            >
                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-2xl -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-full blur-2xl -ml-20 -mb-20"></div>

                    {/* Header */}
                    <div className="text-center mb-8 sm:mb-10 relative">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="relative inline-block mb-6"
                        >
                            {/* Glow ring behind logo */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-200/60 via-pink-100/40 to-transparent blur-2xl scale-150 -z-10" />
                            {/* Logo container */}
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-red-100/60 overflow-hidden border border-slate-100/80 hover:scale-105 transition-transform duration-300">
                                <img src="/assests/logo.png" alt="Durkkas Logo" className="w-[85%] h-[85%] object-contain" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black mb-2 tracking-tight leading-none">
                                <span className="text-slate-800">Survey</span><span className="text-emerald-500">2</span><span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Lead</span>
                            </h1>
                            <p className="text-slate-400 font-medium text-xs sm:text-sm tracking-widest uppercase">
                                Construction Lead Management
                            </p>
                        </motion.div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6 relative" autoComplete="off">
                        {/* Username/Email Field */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-2"
                        >
                            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                                <User size={14} />
                                Username or Email
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors pointer-events-none">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    name="identifier"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your username or email"
                                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-12 pr-4 font-semibold text-slate-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none placeholder:text-slate-400 placeholder:font-normal text-sm sm:text-base"
                                    required
                                    disabled={isLoading}
                                    autoComplete="off"
                                />
                            </div>
                        </motion.div>

                        {/* Password Field */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-2"
                        >
                            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                                <Lock size={14} />
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors pointer-events-none">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-12 pr-12 font-semibold text-slate-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none placeholder:text-slate-400 placeholder:font-normal text-sm sm:text-base"
                                    required
                                    disabled={isLoading}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors focus:outline-none p-1 rounded-lg hover:bg-slate-100 active:scale-95"
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </motion.div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-start gap-3 text-rose-600 text-sm font-semibold bg-rose-50 p-4 rounded-xl sm:rounded-2xl border-2 border-rose-200"
                            >
                                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-xl sm:rounded-2xl font-bold shadow-xl shadow-slate-900/30 active:scale-[0.98] transition-all text-sm sm:text-base flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <LogIn size={20} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Footer Note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="mt-6 sm:mt-8 text-center"
                    >
                        <p className="text-xs sm:text-sm text-slate-600 font-semibold">
                            Secure access for authorized personnel only
                        </p>
                    </motion.div>
                </div>

                {/* Bottom Branding */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 text-center"
                >
                    <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-widest mb-1.5 opacity-60">
                        Version 1.0
                    </p>
                    <p className="text-xs sm:text-sm text-slate-400 font-semibold px-4">
                        Powered by <span className="text-slate-900 font-bold">Durkkas</span> © 2026
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
