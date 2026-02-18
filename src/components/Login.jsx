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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-sm border border-white/50 relative overflow-hidden"
            >
                {/* Decorative background blur */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

                <div className="text-center mb-10 relative">
                    <div className="w-20 h-20 bg-gradient-to-tr from-emerald-50 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-sm transform rotate-3">
                        <LogIn size={36} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 font-display mb-2 tracking-tight">LeadPro Portal</h1>
                    <p className="text-slate-500 font-medium text-sm">Sign in with your credentials</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 relative" autoComplete="off">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 font-display uppercase tracking-wider ml-1">Username or Email</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none">
                                <User size={20} />
                            </div>
                            <input
                                type="text"
                                name="identifier"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Username or Email"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none placeholder:text-slate-300 placeholder:font-medium"
                                required
                                disabled={isLoading}
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 font-display uppercase tracking-wider ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none">
                                <Lock size={20} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none placeholder:text-slate-300 placeholder:font-medium"
                                required
                                disabled={isLoading}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                                title={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="flex items-center gap-3 text-rose-500 text-sm font-bold bg-rose-50 p-4 rounded-2xl border border-rose-100"
                        >
                            <AlertCircle size={18} className="flex-shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 active:scale-95 transition-all text-base flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <LogIn size={18} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </>
                        )}
                    </button>


                </form>
            </motion.div>
        </div>
    );
};

export default Login;
