import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabase';
import { INITIAL_LEAD_DATA } from './utils/models';
import StepIndicator from './components/FormSteps/StepIndicator';
import CustomerDetails from './components/FormSteps/CustomerDetails';
import ProjectDetails from './components/FormSteps/ProjectDetails';
import StakeholderDetails from './components/FormSteps/StakeholderDetails';
import DoorSpecification from './components/FormSteps/DoorSpecification';
import PaymentPriority from './components/FormSteps/PaymentPriority';
import Summary from './components/FormSteps/Summary';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import EngineerDashboard from './components/EngineerDashboard';
import { submitLead, approveLead, rejectLead } from './services/leadService';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
    CheckCircle2, ChevronLeft, ChevronRight, Save, Home,
    Loader2, LogOut, XCircle, Clock, X, Plus
} from 'lucide-react';
import SessionExpired from './components/SessionExpired';
import { validateMobile } from './utils/validation';

import { mapDbLeadToFormData } from './utils/mappers';

const STEPS = [
    'Customer',
    'Project',
    'Stakeholders',
    'Doors',
    'Payment',
    'Review'
];

const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 Minutes in milliseconds

// Global Scroll to Top component for route transitions
const ScrollToTop = () => {
    const { pathname, hash } = useLocation();
    useEffect(() => {
        if (!hash) {
            window.scrollTo(0, 0);
            document.querySelectorAll('main, .overflow-y-auto').forEach(el => {
                el.scrollTo(0, 0);
            });
        } else {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [pathname, hash]);
    return null;
};

// --- Sub-Components for Routing (Defined Outside to Prevent Unmounting) ---

const LeadSuccessView = ({ user, setIsSubmitted, setCurrentStep, setFormData, navigate, INITIAL_LEAD_DATA }) => (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-4 sm:p-6">
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="p-6 sm:p-8 md:p-10 bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl text-center max-w-md w-full border-t-4 sm:border-t-[6px] border-emerald-500"
        >
            {/* Success Icon */}
            <div className="relative mb-6 sm:mb-8">
                <div className="absolute inset-0 bg-emerald-100 rounded-full blur-2xl opacity-50 animate-pulse" />
                <CheckCircle2 size={80} className="text-emerald-500 mx-auto relative z-10 sm:w-24 sm:h-24" />
            </div>

            {/* Success Message */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 px-2">
                Lead Collected Successfully!
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mb-8 sm:mb-10 px-2 leading-relaxed">
                The lead has been recorded and is now ready for processing.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3 sm:space-y-3.5">
                <button
                    onClick={() => { setIsSubmitted(false); setCurrentStep(0); setFormData(INITIAL_LEAD_DATA); navigate(user.role === 'admin' ? '/admin/new' : '/engineer/new'); }}
                    className="w-full py-3.5 sm:py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all"
                >
                    Collect Another Lead
                </button>
                <button
                    onClick={() => { setIsSubmitted(false); navigate(user.role === 'admin' ? '/admin' : '/engineer'); }}
                    className="w-full py-3.5 sm:py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base active:scale-[0.98] transition-all"
                >
                    Back to Dashboard
                </button>
            </div>
        </motion.div>
    </div>
);

const LeadDetailView = ({ viewModeLead, navigate, user, handleApproveAction, isActionLoading, setShowRejectionModal, showRejectionModal, rejectionReason, setRejectionReason, handleRejectAction }) => {
    if (!viewModeLead) return <Navigate to="/" />;

    const leadStatus = viewModeLead.status || 'Pending';
    const statusConfig = {
        'Master': { label: 'Approved', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', dot: 'bg-emerald-500' },
        'Roaming': { label: 'Roaming', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', dot: 'bg-blue-500' },
        'Temporarily Closed': { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', dot: 'bg-amber-500' },
        'Pending': { label: 'Pending', bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100', dot: 'bg-slate-400' }
    };

    const status = statusConfig[leadStatus] || statusConfig['Pending'];

    return (
        <div className="bg-slate-50 min-h-screen font-sans flex flex-col">
            {/* Premium Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 px-4 py-3 sm:py-4">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-all active:scale-90"
                    >
                        <ChevronLeft size={20} strokeWidth={2.5} />
                    </button>

                    <div className="text-center flex-1 mx-4">
                        <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">Lead Details</h1>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                            {viewModeLead.lead_number}
                        </p>
                    </div>

                    <div className={`px-2.5 py-1 rounded-lg border ${status.bg} ${status.text} ${status.border} shadow-sm`}>
                        <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
                            <span className="text-[10px] font-black uppercase tracking-tight">{status.label}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 pb-32 sm:pb-12">
                <Summary data={viewModeLead} isReview={false} />

                {/* Admin Actions Bar */}
                {user?.role === 'admin' && (viewModeLead.status === 'Roaming' || viewModeLead.status === 'Temporarily Closed') && (
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/60 backdrop-blur-xl border-t border-slate-200 z-40 sm:sticky sm:bottom-6 sm:bg-transparent sm:border-0 sm:p-0 sm:mt-10">
                        <div className="max-w-2xl mx-auto flex gap-3">
                            {(() => {
                                const siteVisit = viewModeLead.site_visits?.[0] || {};
                                const isClientAvailable = viewModeLead.status === 'Temporarily Closed' || siteVisit.is_available === false ? false : true;

                                return (
                                    <motion.button
                                        whileTap={isClientAvailable ? { scale: 0.95 } : {}}
                                        onClick={() => isClientAvailable && handleApproveAction(viewModeLead)}
                                        disabled={isActionLoading || !isClientAvailable}
                                        className={`flex-[2] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${isClientAvailable
                                            ? 'bg-emerald-600 text-white shadow-emerald-200'
                                            : 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed'
                                            }`}
                                    >
                                        {isActionLoading ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                                        <span>
                                            {!isClientAvailable ? 'Cannot Approve (Unavailable)' : (isActionLoading ? 'Approving...' : 'Approve Lead')}
                                        </span>
                                    </motion.button>
                                );
                            })()}
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowRejectionModal(true)}
                                disabled={isActionLoading}
                                className="flex-1 py-4 bg-white text-rose-600 border-2 border-rose-50 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                            >
                                <XCircle size={20} />
                                <span>Reject</span>
                            </motion.button>
                        </div>
                    </div>
                )}
            </main>

            {/* Premium Rejection Modal */}
            <AnimatePresence>
                {showRejectionModal && (
                    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowRejectionModal(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative bg-white p-6 sm:p-8 rounded-t-[2.5rem] sm:rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
                        >
                            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6 sm:hidden" />

                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                                        <XCircle size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Need Changes?</h3>
                                </div>
                                <button
                                    onClick={() => setShowRejectionModal(false)}
                                    className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>
                            <p className="text-sm text-slate-500 font-medium mb-6 px-1">
                                Please specify what needs to be fixed for lead <span className="text-indigo-600 font-bold">#{viewModeLead?.lead_number}</span>.
                            </p>

                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Write your feedback here..."
                                className="w-full h-40 p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all resize-none text-sm font-semibold mb-6 placeholder:text-slate-300"
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowRejectionModal(false)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold active:scale-95 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRejectAction}
                                    disabled={isActionLoading || !rejectionReason.trim()}
                                    className="flex-[2] py-4 bg-rose-600 text-white rounded-2xl font-bold active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-rose-200"
                                >
                                    {isActionLoading ? 'Processing...' : 'Confirm Rejection'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const LeadFormView = ({
    user, navigate, showForm, setShowForm, currentStep, setCurrentStep, formData, setFormData,
    errors, setErrors, mainContentRef, updateFormData, nextStep, prevStep, handleSubmit, isSubmitting
}) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
            {/* Modern Header - Minimal & Clean */}
            <header className="bg-white border-b border-slate-200 px-4 py-3 shrink-0 sticky top-0 z-20">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(user.role === 'admin' ? '/admin' : '/engineer')}
                        className="p-2 -ml-2 active:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={24} className="text-slate-700" />
                    </button>
                    <div className="flex-1 text-center">
                        <h1 className="text-base font-semibold text-slate-900">New Lead</h1>
                        <p className="text-xs text-slate-500">{STEPS[currentStep]}</p>
                    </div>
                    <div className="w-10"></div> {/* Spacer for centering */}
                </div>

                {/* Progress Indicator */}
                <div className="mt-3">
                    <StepIndicator steps={STEPS} currentStep={currentStep} />
                </div>
            </header>

            {/* Content Area with Max Width for Better Readability */}
            <main ref={mainContentRef} className="flex-1 overflow-y-auto pb-28">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {currentStep === 0 && <CustomerDetails data={formData.customer} update={(d) => updateFormData('customer', d)} errors={errors.customer || {}} />}
                            {currentStep === 1 && <ProjectDetails data={formData.project} update={(d) => updateFormData('project', d)} errors={errors.project || {}} />}
                            {currentStep === 2 && <StakeholderDetails data={formData.stakeholders} update={(d) => updateFormData('stakeholders', d)} errors={errors.stakeholders || {}} />}
                            {currentStep === 3 && <DoorSpecification data={formData.doorSpecifications} update={(d) => updateFormData('doorSpecifications', d)} errors={errors.doorSpecifications || {}} />}
                            {currentStep === 4 && <PaymentPriority data={formData.payment} update={(d) => updateFormData('payment', d)} errors={errors.payment || {}} />}
                            {currentStep === 5 && <Summary data={formData} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Fixed Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50">
                <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                    <div className="flex gap-2 sm:gap-3">
                        {currentStep > 0 && (
                            <button
                                onClick={prevStep}
                                disabled={isSubmitting}
                                className="px-4 sm:px-6 py-3 sm:py-3.5 border border-slate-300 text-slate-700 rounded-xl font-medium active:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                            >
                                <ChevronLeft size={18} className="inline -ml-1 sm:w-5 sm:h-5" />
                                <span className="ml-1">Back</span>
                            </button>
                        )}

                        {currentStep < STEPS.length - 1 ? (
                            <button
                                onClick={nextStep}
                                disabled={isSubmitting}
                                className={`flex-1 py-3 sm:py-3.5 rounded-xl font-semibold active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base ${currentStep === 0 && formData.customer.isClientAvailable === 'no'
                                    ? 'bg-orange-500 text-white active:bg-orange-600'
                                    : 'bg-blue-500 text-white active:bg-blue-600'
                                    }`}
                            >
                                {isSubmitting ? 'Processing...' : (currentStep === 0 && formData.customer.isClientAvailable === 'no' ? 'Submit Site Visit' : 'Continue')}
                                {!(currentStep === 0 && formData.customer.isClientAvailable === 'no') && (
                                    <ChevronRight size={18} className="inline ml-1 -mr-1 sm:w-5 sm:h-5" />
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 py-3 sm:py-3.5 bg-green-500 text-white rounded-xl font-semibold active:bg-green-600 active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={16} className="inline animate-spin mr-2 sm:w-[18px] sm:h-[18px]" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit Lead
                                        <CheckCircle2 size={16} className="inline ml-2 -mr-1 sm:w-[18px] sm:h-[18px]" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

function App() {
    const [user, setUser] = useState(null);
    const [showForm, setShowForm] = useState(() => localStorage.getItem('leadpro_show_form') === 'true');
    const [viewModeLead, setViewModeLead] = useState(() => {
        const saved = localStorage.getItem('leadpro_view_lead');
        return saved ? JSON.parse(saved) : null;
    });
    const [currentStep, setCurrentStep] = useState(() => Number(localStorage.getItem('leadpro_current_step')) || 0);
    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem('leadpro_form_data');
        return saved ? JSON.parse(saved) : INITIAL_LEAD_DATA;
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [editingLeadId, setEditingLeadId] = useState(null);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    // PERSISTENCE: Save state when it changes
    useEffect(() => {
        localStorage.setItem('leadpro_show_form', showForm);
        localStorage.setItem('leadpro_view_lead', viewModeLead ? JSON.stringify(viewModeLead) : '');
        localStorage.setItem('leadpro_current_step', currentStep);
        localStorage.setItem('leadpro_form_data', JSON.stringify(formData));
    }, [showForm, viewModeLead, currentStep, formData]);

    const mainContentRef = useRef(null);
    const [isAppLoading, setIsAppLoading] = useState(true);

    // SESSION PERSISTENCE (Tab Specific): Load user from sessionStorage on mount
    useEffect(() => {
        const storedUser = sessionStorage.getItem('leadpro_session');
        const lastActivity = sessionStorage.getItem('leadpro_last_activity');

        if (storedUser && lastActivity) {
            const now = Date.now();
            if (now - parseInt(lastActivity) > IDLE_TIMEOUT) {
                // Session expired while away
                handleLogout();
            } else {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    // Refresh activity on load
                    sessionStorage.setItem('leadpro_last_activity', Date.now().toString());
                } catch (err) {
                    console.error("Failed to parse stored user session", err);
                    handleLogout();
                }
            }
        }
        setIsAppLoading(false);
    }, []);

    // IDLE TIMEOUT MONITORING
    useEffect(() => {
        if (!user) return;

        const updateActivity = () => {
            sessionStorage.setItem('leadpro_last_activity', Date.now().toString());
        };

        // Check for timeout every 30 seconds
        const checkInterval = setInterval(() => {
            const lastActivity = sessionStorage.getItem('leadpro_last_activity');
            if (lastActivity && Date.now() - parseInt(lastActivity) > IDLE_TIMEOUT) {
                // Instead of alert, redirect to session-expired
                handleLogout(true);
            }
        }, 30000);

        // Listen for user interactions
        window.addEventListener('mousemove', updateActivity);
        window.addEventListener('keydown', updateActivity);
        window.addEventListener('click', updateActivity);
        window.addEventListener('scroll', updateActivity);

        return () => {
            clearInterval(checkInterval);
            window.removeEventListener('mousemove', updateActivity);
            window.removeEventListener('keydown', updateActivity);
            window.removeEventListener('click', updateActivity);
            window.removeEventListener('scroll', updateActivity);
        };
    }, [user]);

    const navigate = useNavigate();

    const handleLogin = (role, email, id, fullName) => {
        const userData = { role, email, id, fullName };
        setUser(userData);
        sessionStorage.setItem('leadpro_session', JSON.stringify(userData));
        sessionStorage.setItem('leadpro_last_activity', Date.now().toString());

        // Navigate based on role after login
        if (role === 'admin') navigate('/admin');
        else navigate('/engineer');
    };

    const handleLogout = (isExpired = false) => {
        setUser(null);
        setShowForm(false);
        setViewModeLead(null);
        setCurrentStep(0);
        setFormData(INITIAL_LEAD_DATA);
        setFormData(INITIAL_LEAD_DATA);
        setEditingLeadId(null);
        localStorage.removeItem('leadpro_session');
        sessionStorage.removeItem('leadpro_last_activity');
        localStorage.removeItem('admin_active_view');
        localStorage.removeItem('engineer_active_view');
        localStorage.removeItem('leadpro_show_form');
        localStorage.removeItem('leadpro_view_lead');
        localStorage.removeItem('leadpro_current_step');
        localStorage.removeItem('leadpro_form_data');

        if (isExpired) {
            navigate('/session-expired');
        } else {
            navigate('/login');
        }
    };

    const updateFormData = (section, data) => {
        setFormData(prev => ({
            ...prev,
            [section]: data
        }));
        // Clear errors for this section when data is updated
        setErrors(prev => ({
            ...prev,
            [section]: {}
        }));
    };

    // Scroll to top whenever step changes
    useEffect(() => {
        window.scrollTo(0, 0);
        if (mainContentRef.current) {
            mainContentRef.current.scrollTop = 0;
        }
    }, [currentStep]);

    // Validation functions for each step
    const validateCustomerDetails = () => {
        const { name, mobile, address, isClientAvailable, followUpDate, estimatedDoorCount } = formData.customer;
        const newErrors = {};

        if (!address) newErrors.address = 'Address/Site Location is required';

        if (isClientAvailable === 'no') {
            // minimal validation for unavailable client
            if (!followUpDate) newErrors.followUpDate = 'Follow-up Date is required';
            if (!estimatedDoorCount) newErrors.estimatedDoorCount = 'Estimated Door Count is required';
        } else {
            // Standard validation
            if (!name) newErrors.name = 'Customer/Owner Name is required';
            const mobileError = validateMobile(mobile);
            if (mobileError) newErrors.mobile = mobileError;
        }

        setErrors({ customer: newErrors });
        return Object.keys(newErrors).length === 0;
    };

    const validateProjectDetails = () => {
        const { projectName, buildingType, constructionStage, doorRequirementTimeline, estimatedTotalDoorCount } = formData.project;
        const newErrors = {};

        if (!projectName) newErrors.projectName = 'Project Name is required';
        if (!buildingType) newErrors.buildingType = 'Building Type is required';
        if (!constructionStage) newErrors.constructionStage = 'Construction Stage is required';
        if (!doorRequirementTimeline) newErrors.doorRequirementTimeline = 'Requirement Timeline is required';
        if (!estimatedTotalDoorCount) newErrors.estimatedTotalDoorCount = 'Estimated Door Count is required';

        setErrors({ project: newErrors });
        return Object.keys(newErrors).length === 0;
    };

    const validateStakeholderDetails = () => {
        const { architectName, architectContact, contractorName, contractorContact } = formData.stakeholders;
        const newErrors = {};

        if (!architectName) newErrors.architectName = 'Architect/Engineer Name is required';

        const architectContactError = validateMobile(architectContact);
        if (architectContactError) newErrors.architectContact = architectContactError;

        if (!contractorName) newErrors.contractorName = 'Contractor Name is required';

        const contractorContactError = validateMobile(contractorContact);
        if (contractorContactError) newErrors.contractorContact = contractorContactError;

        setErrors({ stakeholders: newErrors });
        return Object.keys(newErrors).length === 0;
    };

    const validateDoorSpecifications = () => {
        // Check if at least one door type has been specified
        const doorSpecs = formData.doorSpecifications;
        const hasAnyDoor = Object.values(doorSpecs).some(door =>
            door.material && door.quantity && parseInt(door.quantity) > 0
        );

        if (!hasAnyDoor) {
            setErrors({
                doorSpecifications: {
                    general: 'Please specify at least one door type with Material and Quantity.'
                }
            });
            return false;
        }

        setErrors({ doorSpecifications: {} });
        return true;
    };

    const validatePaymentDetails = () => {
        const { paymentMethods, leadSource, projectPriority, expectedCompletionDate } = formData.payment;
        const newErrors = {};

        if (!paymentMethods || paymentMethods.length === 0) newErrors.paymentMethods = 'Select at least one payment method';
        if (!leadSource) newErrors.leadSource = 'Lead Source is required';
        if (!projectPriority) newErrors.projectPriority = 'Project Priority is required';

        setErrors({ payment: newErrors });
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        // Validate current step before proceeding
        let isValid = true;

        switch (currentStep) {
            case 0: // Customer Details
                isValid = validateCustomerDetails();
                if (isValid && formData.customer.isClientAvailable === 'no') {
                    // IMMEDIATELY SUBMIT if client not available
                    // No need to skip to Summary, just trigger the submission
                    handleSubmit();
                    return;
                }
                break;
            case 1: // Project Details
                isValid = validateProjectDetails();
                break;
            case 2: // Stakeholder Details
                isValid = validateStakeholderDetails();
                break;
            case 3: // Door Specifications
                isValid = validateDoorSpecifications();
                break;
            case 4: // Payment & Priority
                isValid = validatePaymentDetails();
                break;
            default:
                isValid = true;
        }

        if (isValid && currentStep < STEPS.length - 1) {
            setCurrentStep(curr => curr + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(curr => curr - 1);
        }
    };

    const handleSubmit = async () => {
        // Final validation before submit
        if (formData.customer.isClientAvailable !== 'no') {
            if (!validatePaymentDetails()) return;
        }

        setIsSubmitting(true);
        let result;

        if (editingLeadId) {
            // Updated lead submission - Resubmit rejected leads
            result = await submitLead(formData, user?.id, editingLeadId);
        } else {
            // New lead submission
            result = await submitLead(formData, user?.id);
        }

        setIsSubmitting(false);

        if (result.success) {
            setIsSubmitted(true);
            setEditingLeadId(null); // Clear editing state on success
        } else {
            console.error('Submission Failed:', result.error);
            alert('Failed to submit lead. Please try again. ' + (result.error?.message || ''));
        }
    };

    // Admin Handlers
    const handleApproveAction = async (lead) => {
        if (!lead) return;
        setIsActionLoading(true);
        const result = await approveLead(lead);
        setIsActionLoading(false);
        if (result.success) {
            setViewModeLead(null);
        } else {
            alert('Failed to approve lead: ' + (result.error?.message || 'Error'));
        }
    };

    const handleRejectAction = async () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }
        setIsActionLoading(true);
        const result = await rejectLead(viewModeLead, rejectionReason);
        setIsActionLoading(false);
        if (result.success) {
            setShowRejectionModal(false);
            setRejectionReason('');
            setViewModeLead(null);
        } else {
            alert('Failed to reject: ' + (result.error?.message || 'Error'));
        }
    };



    // 0. Initial Loading State
    if (isAppLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={40} className="animate-spin text-emerald-600 mx-auto mb-4" />
                    <p className="text-slate-600 font-bold">Initializing LeadPro...</p>
                </div>
            </div>
        );
    }

    // 0. Initial Loading State

    // --- Core Routing ---
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/session-expired" element={<SessionExpired />} />
                <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to={user.role === 'admin' ? '/admin' : '/engineer'} />} />

                <Route path="/admin/*" element={
                    user?.role === 'admin' ? (
                        <AdminDashboard
                            user={user}
                            onLogout={handleLogout}
                            onNewLead={() => { setFormData(INITIAL_LEAD_DATA); setCurrentStep(0); setIsSubmitted(false); navigate('/admin/new'); }}
                            onView={(l) => { setViewModeLead(l); navigate('/admin/view'); }}
                            LeadFormView={<LeadFormView
                                user={user}
                                navigate={navigate}
                                showForm={showForm}
                                setShowForm={setShowForm}
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                                formData={formData}
                                setFormData={setFormData}
                                errors={errors}
                                setErrors={setErrors}
                                mainContentRef={mainContentRef}
                                updateFormData={updateFormData}
                                nextStep={nextStep}
                                prevStep={prevStep}
                                handleSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                            />}
                            LeadSuccessView={<LeadSuccessView user={user} setIsSubmitted={setIsSubmitted} setCurrentStep={setCurrentStep} setFormData={setFormData} navigate={navigate} INITIAL_LEAD_DATA={INITIAL_LEAD_DATA} />}
                            LeadDetailView={<LeadDetailView
                                viewModeLead={viewModeLead}
                                navigate={navigate}
                                user={user}
                                handleApproveAction={handleApproveAction}
                                isActionLoading={isActionLoading}
                                setShowRejectionModal={setShowRejectionModal}
                                showRejectionModal={showRejectionModal}
                                rejectionReason={rejectionReason}
                                setRejectionReason={setRejectionReason}
                                handleRejectAction={handleRejectAction}
                            />}
                            isSubmitted={isSubmitted}
                        />
                    ) : <Navigate to="/login" />
                } />

                <Route path="/engineer/*" element={
                    (user?.role === 'engineer' || user?.role === 'user' || user?.role === 'field engineer') ? (
                        <EngineerDashboard
                            user={user}
                            onLogout={handleLogout}
                            onNewLead={() => {
                                setFormData(INITIAL_LEAD_DATA);
                                setEditingLeadId(null);
                                setCurrentStep(0);
                                setIsSubmitted(false);
                                navigate('/engineer/new');
                            }}
                            onEditLead={(lead) => {
                                const mappedData = mapDbLeadToFormData(lead);
                                if (mappedData) {
                                    setFormData(mappedData);
                                    setEditingLeadId(lead.id);
                                    setCurrentStep(0);
                                    setIsSubmitted(false);
                                    navigate('/engineer/new');
                                }
                            }}
                            onView={(l) => { setViewModeLead(l); navigate('/engineer/view'); }}
                            LeadFormView={<LeadFormView
                                user={user}
                                navigate={navigate}
                                showForm={showForm}
                                setShowForm={setShowForm}
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                                formData={formData}
                                setFormData={setFormData}
                                errors={errors}
                                setErrors={setErrors}
                                mainContentRef={mainContentRef}
                                updateFormData={updateFormData}
                                nextStep={nextStep}
                                prevStep={prevStep}
                                handleSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                            />}
                            LeadSuccessView={<LeadSuccessView user={user} setIsSubmitted={setIsSubmitted} setCurrentStep={setCurrentStep} setFormData={setFormData} navigate={navigate} INITIAL_LEAD_DATA={INITIAL_LEAD_DATA} />}
                            LeadDetailView={<LeadDetailView
                                viewModeLead={viewModeLead}
                                navigate={navigate}
                                user={user}
                                handleApproveAction={handleApproveAction}
                                isActionLoading={isActionLoading}
                                setShowRejectionModal={setShowRejectionModal}
                                showRejectionModal={showRejectionModal}
                                rejectionReason={rejectionReason}
                                setRejectionReason={setRejectionReason}
                                handleRejectAction={handleRejectAction}
                            />}
                            isSubmitted={isSubmitted}
                        />
                    ) : <Navigate to="/login" />
                } />

                <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/engineer') : '/login'} />} />
            </Routes>
        </>
    );
}
export default App;
