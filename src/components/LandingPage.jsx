import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ShieldCheck,
    Smartphone,
    BarChart3,
    ChevronRight,
    ArrowRight,
    HardHat,
    Clock,
    Layout,
    Zap,
    Globe,
    Database,
    CheckCircle,
    Construction
} from 'lucide-react';

const LandingPage = ({ onStart }) => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <div className="bg-slate-950 min-h-screen text-white overflow-hidden font-sans selection:bg-emerald-500 selection:text-white">

            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/20 blur-[120px] mix-blend-screen animate-pulse duration-[10s]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary-600/20 blur-[100px] mix-blend-screen animate-pulse duration-[8s] delay-1000"></div>
                <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-purple-500/10 blur-[80px] mix-blend-screen"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150"></div>
            </div>

            {/* Premium Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-all duration-300">
                <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 shadow-2xl shadow-black/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Construction className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white leading-none tracking-tight font-display">LeadPro</h1>
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] font-display">Enterprise</span>
                        </div>
                    </div>
                    <button
                        onClick={onStart}
                        className="hidden sm:flex px-6 py-2.5 bg-white text-slate-950 text-sm font-bold rounded-xl hover:bg-emerald-50 transition-all active:scale-95 shadow-lg shadow-white/10 items-center gap-2 group"
                    >
                        Launch System
                        <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover:animate-ping" />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 md:pt-48 md:pb-20 px-6 z-10 min-h-screen flex items-center">
                <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold mb-8 backdrop-blur-md">
                            <Zap size={14} className="fill-current" />
                            <span>Faster Field Data Collection</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight md:leading-[1.05] mb-8 tracking-tight font-display">
                            Construction <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 filter drop-shadow-2xl">
                                Intelligence
                            </span> <br />
                            Reimagined.
                        </h1>

                        <p className="text-lg text-slate-400 mb-12 leading-relaxed font-medium max-w-xl border-l-[3px] border-emerald-500/50 pl-6">
                            The first offline-capable, mobile-first CRM designed specifically for construction site managers. Capture structure data, client needs, and site progress in seconds.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5">
                            <button
                                onClick={onStart}
                                className="group relative px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.5)] transition-all overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 skew-y-6"></div>
                                <span className="relative z-10">Start Collection</span>
                                <ChevronRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={20} />
                            </button>

                            <button className="px-8 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center gap-3 backdrop-blur-sm">
                                <Globe size={18} className="text-slate-400" />
                                Live Demo
                            </button>
                        </div>
                    </motion.div>

                    {/* 3D-like Floating Mockups */}
                    <motion.div
                        style={{ y: y2 }}
                        className="relative hidden lg:block perspective-1000"
                    >
                        {/* Background Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[80px] animate-pulse"></div>

                        <motion.div
                            initial={{ rotateY: 15, rotateX: 5, opacity: 0, scale: 0.8 }}
                            animate={{ rotateY: -5, rotateX: 2, opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            whileHover={{ rotateY: 0, rotateX: 0, scale: 1.05 }}
                            className="relative z-20 mx-auto w-[350px]"
                        >
                            <div className="relative rounded-[40px] border-[6px] border-slate-800 bg-slate-900 overflow-hidden shadow-2xl shadow-emerald-900/50">
                                <img
                                    src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1000"
                                    alt="Construction App"
                                    className="w-full h-[650px] object-cover opacity-80"
                                />

                                {/* Simulated UI Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900 flex flex-col justify-end p-8">
                                    <div className="space-y-4">
                                        <div className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-emerald-500 rounded-lg text-white">
                                                    <CheckCircle size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-emerald-200 font-bold">Site Verified</p>
                                                    <p className="text-sm font-bold text-white">Green Valley Project</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-emerald-400">+12%</span>
                                        </div>

                                        <div className="flex gap-2">
                                            <div className="flex-1 h-12 bg-emerald-500 rounded-xl"></div>
                                            <div className="w-12 h-12 bg-white/10 rounded-xl"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-20 -right-12 p-5 bg-white backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl z-30"
                            >
                                <BarChart3 className="text-emerald-600 mb-1" size={32} />
                                <p className="text-xs font-black text-slate-400">EFFICIENCY</p>
                                <p className="text-2xl font-black text-slate-800">4.5x</p>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute bottom-40 -left-12 p-5 bg-slate-800 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-30"
                            >
                                <Database className="text-cyan-400 mb-1" size={32} />
                                <p className="text-xs font-black text-slate-500">SYNC STATUS</p>
                                <p className="text-xl font-black text-white">Live • 24ms</p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>

                <motion.div
                    style={{ opacity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
                >
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-500/50">Scroll to Explore</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-emerald-500/50 to-transparent"></div>
                </motion.div>
            </section>

            {/* Grid Features Section */}
            <section className="py-20 md:py-32 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12 md:mb-20">
                        <h2 className="text-3xl md:text-6xl font-black text-white mb-6 tracking-tight font-display">
                            Built for the <br />
                            <span className="text-emerald-500">Modern Job Site.</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl font-medium">Traditional methods fail in the field. We created a system that works as hard as your ground team.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <BentoCard
                            icon={<Smartphone />}
                            title="Mobile First"
                            desc="Large touch targets, swipe gestures, and one-hand optimization for active sites."
                            delay={0}
                        />
                        <BentoCard
                            icon={<Layout />}
                            title="Wizard Flow"
                            desc="Intelligent step-by-step guidance ensures 100% data completeness."
                            delay={0.1}
                            featured
                        />
                        <BentoCard
                            icon={<ShieldCheck />}
                            title="Auto-Validate"
                            desc="Real-time field validation prevents bad data from ever reaching your CRM."
                            delay={0.2}
                        />
                    </div>
                </div>
            </section>

            {/* Parallax Stats Section */}
            <section className="py-20 border-y border-white/5 bg-slate-900/50 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay"></div>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
                    <Stat number="50K+" label="Leads Captured" />
                    <Stat number="120+" label="Active Sites" />
                    <Stat number="0.2s" label="Sync Latency" />
                    <Stat number="100%" label="Uptime" />
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 md:py-32 px-4 md:px-6 relative">
                <div className="max-w-5xl mx-auto relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-[2.5rem] md:rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                    <div className="relative bg-slate-900 border border-white/10 rounded-[2.5rem] md:rounded-[3rem] px-6 py-12 md:p-20 text-center overflow-hidden">
                        {/* Glossy Overlay */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                        <h2 className="text-4xl md:text-7xl font-black text-white mb-6 md:mb-8 tracking-tighter relative z-10 font-display leading-tight">
                            Start Your <br />
                            Transformation
                        </h2>
                        <p className="text-slate-400 mb-8 md:mb-12 max-w-xl mx-auto text-base md:text-lg font-medium relative z-10 px-4">
                            Join top construction firms automating their lead flow. No credit card required for Phase 1 access.
                        </p>

                        <button
                            onClick={onStart}
                            className="relative z-10 bg-white text-slate-950 w-full sm:w-auto px-8 md:px-12 py-5 md:py-6 rounded-2xl font-black text-lg md:text-xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3 mx-auto"
                        >
                            Launch Platform
                            <ArrowRight size={24} />
                        </button>
                    </div>
                </div>
            </section>

            <footer className="py-12 px-6 border-t border-white/5 bg-slate-950">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm font-medium">
                    <p>© 2025 LeadPro Construction Systems.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
                        <a href="#" className="hover:text-emerald-400 transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const BentoCard = ({ icon, title, desc, delay, featured }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ y: -5 }}
        className={`
      group p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm 
      hover:bg-white/10 transition-colors relative overflow-hidden
      ${featured ? 'bg-gradient-to-b from-emerald-500/10 to-transparent border-emerald-500/20' : ''}
    `}
    >
        <div className={`
      w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white
      ${featured ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-slate-800 group-hover:bg-emerald-500 transition-colors'}
    `}>
            {React.cloneElement(icon, { size: 28 })}
        </div>

        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">{title}</h3>
        <p className="text-slate-400 leading-relaxed font-medium">{desc}</p>

        {/* Decorative corner glow */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-[50px] group-hover:bg-emerald-500/30 transition-all"></div>
    </motion.div>
);

const Stat = ({ number, label }) => (
    <div className="flex flex-col items-center">
        <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-2">{number}</span>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">{label}</span>
    </div>
);

export default LandingPage;
