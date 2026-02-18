import React from 'react';
import { motion } from 'framer-motion';
import { Clock, LogIn, ShieldAlert, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SessionExpired = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[100px] opacity-60" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[100px] opacity-60" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-[480px] bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(15,23,42,0.1)] border border-slate-100 p-8 md:p-12 text-center relative z-10"
            >
                {/* Icon Container */}
                <div className="relative inline-block mb-10">
                    <motion.div
                        initial={{ rotate: -10, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="w-24 h-24 bg-gradient-to-tr from-slate-900 to-slate-800 rounded-[32px] flex items-center justify-center text-white shadow-2xl relative z-10"
                    >
                        <Clock size={44} strokeWidth={1.5} className="text-indigo-400" />
                    </motion.div>

                    {/* Ring animation */}
                    <div className="absolute inset-0 bg-indigo-100 rounded-[32px] animate-ping opacity-20" />

                    {/* Floating Alert Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                        className="absolute -top-3 -right-3 w-10 h-10 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-white"
                    >
                        <ShieldAlert size={20} />
                    </motion.div>
                </div>

                {/* Content */}
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                    Session <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Expired</span>
                </h1>

                <p className="text-slate-500 font-medium text-lg mb-10 leading-relaxed px-4">
                    For your security, you were logged out after <span className="text-slate-900 font-bold">30 minutes</span> of inactivity. Please sign in again to continue.
                </p>

                {/* Status Indicator */}
                <div className="flex items-center justify-center gap-2 mb-10">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">Connection Terminated</span>
                </div>

                {/* Action Button */}
                <button
                    onClick={() => navigate('/login')}
                    className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-lg shadow-[0_20px_40px_-12px_rgba(15,23,42,0.3)] hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-3 group"
                >
                    <span>Re-authenticate</span>
                    <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Footer Info */}
                <p className="mt-8 text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    Secure Access <ArrowRight size={12} /> LeadPro Management
                </p>
            </motion.div>

            {/* Subtle branding hint */}
            <div className="absolute bottom-10 left-0 right-0 text-center">
                <p className="text-slate-300 font-black text-sm uppercase tracking-[0.4em]">PRO-ACTIVE SECURITY SYSTEM</p>
            </div>
        </div>
    );
};

export default SessionExpired;
