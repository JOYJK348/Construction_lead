import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import { INITIAL_LEAD_DATA } from '../utils/models';
import StepIndicator from './FormSteps/StepIndicator';
import CustomerDetails from './FormSteps/CustomerDetails';
import ProjectDetails from './FormSteps/ProjectDetails';
import StakeholderDetails from './FormSteps/StakeholderDetails';
import DoorSpecification from './FormSteps/DoorSpecification';
import PaymentPriority from './FormSteps/PaymentPriority';
import Summary from './FormSteps/Summary';
import { validateMobile } from '../utils/validation';
import { submitLead } from '../services/leadService';

const STEPS = ['Customer', 'Project', 'Stakeholders', 'Doors', 'Payment', 'Review'];

const FormWizardView = ({ user, onComplete, onCancel }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState(INITIAL_LEAD_DATA);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const mainContentRef = useRef(null);

    const updateFormData = (section, data) => {
        setFormData(prev => ({
            ...prev,
            [section]: data
        }));
        setErrors(prev => ({
            ...prev,
            [section]: {}
        }));
    };

    useEffect(() => {
        if (mainContentRef.current) {
            mainContentRef.current.scrollTop = 0;
        }
    }, [currentStep]);

    const validateCustomerDetails = () => {
        const { name, mobile, address, isClientAvailable, followUpDate, estimatedDoorCount } = formData.customer;
        const newErrors = {};

        // If client is unavailable, we only need basic info
        if (isClientAvailable === 'no') {
            if (!address) newErrors.address = 'Address/Site Location is required';
            if (!followUpDate) newErrors.followUpDate = 'Follow-up date is required';
            if (!estimatedDoorCount) newErrors.estimatedDoorCount = 'Estimated doors is required';
        } else {
            if (!name) newErrors.name = 'Customer/Owner Name is required';
            const mobileError = validateMobile(mobile);
            if (mobileError) newErrors.mobile = mobileError;
            if (!address) newErrors.address = 'Address/Site Location is required';
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
        const hasAnyDoor = Object.values(formData.doorSpecifications || {}).some(door => door.quantity > 0);
        if (!hasAnyDoor) {
            setErrors({ doorSpecifications: { general: 'At least one door type must be specified' } });
            return false;
        }
        return true;
    };

    const validatePaymentPriority = () => {
        const { paymentMethods, leadSource, projectPriority } = formData.payment;
        const newErrors = {};
        if (!paymentMethods || paymentMethods.length === 0) newErrors.paymentMethods = 'Payment method is required';
        if (!leadSource) newErrors.leadSource = 'Lead source is required';
        if (!projectPriority) newErrors.projectPriority = 'Project priority is required';
        setErrors({ payment: newErrors });
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        let isValid = true;
        if (currentStep === 0) {
            isValid = validateCustomerDetails();
            if (isValid && formData.customer.isClientAvailable === 'no') {
                // IMMEDIATELY SUBMIT if client not available
                handleSubmit();
                return;
            }
        }
        else if (currentStep === 1) isValid = validateProjectDetails();
        else if (currentStep === 2) isValid = validateStakeholderDetails();
        else if (currentStep === 3) isValid = validateDoorSpecifications();
        else if (currentStep === 4) isValid = validatePaymentPriority();

        if (isValid && currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const result = await submitLead(formData, user.id);
            if (result.success) {
                onComplete();
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Error submitting lead:', error);
            alert(`Failed to submit lead: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-full flex flex-col">
            {/* Step Indicator - Fixed at top */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
                <StepIndicator steps={STEPS} currentStep={currentStep} />
            </div>

            {/* Form Content - Scrollable */}
            <div ref={mainContentRef} className="flex-1 overflow-y-auto mb-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm min-h-[500px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
            </div>

            {/* Navigation Buttons - Sticky at bottom */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 p-3 md:p-4 shadow-lg rounded-t-2xl z-10">
                <div className="max-w-4xl mx-auto flex gap-2 md:gap-3">
                    {currentStep > 0 && (
                        <button
                            onClick={prevStep}
                            disabled={isSubmitting}
                            className="px-4 md:px-6 py-3 border-2 border-slate-200 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-1 md:gap-2 hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-50 text-sm md:text-base"
                        >
                            <ChevronLeft size={18} />
                            <span className="hidden sm:inline">Back</span>
                        </button>
                    )}

                    {currentStep < STEPS.length - 1 ? (
                        <button
                            onClick={nextStep}
                            disabled={isSubmitting}
                            className={`flex-1 py-3 px-4 md:px-6 rounded-xl font-bold flex items-center justify-center gap-1 md:gap-2 shadow-lg transition-all active:scale-95 group text-sm md:text-base ${currentStep === 0 && formData.customer.isClientAvailable === 'no'
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                                } disabled:opacity-50`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <span>{currentStep === 0 && formData.customer.isClientAvailable === 'no' ? 'Submit Site Visit' : 'Next Step'}</span>
                                    {currentStep === 0 && formData.customer.isClientAvailable === 'no' ? <CheckCircle2 size={18} /> : <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-4 md:px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold flex items-center justify-center gap-1 md:gap-2 shadow-lg hover:from-emerald-700 hover:to-teal-700 active:scale-95 transition-all disabled:opacity-75 disabled:cursor-not-allowed text-sm md:text-base"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span className="hidden sm:inline">Submitting...</span>
                                    <span className="sm:hidden">...</span>
                                </>
                            ) : (
                                <>
                                    <span>Submit Lead</span>
                                    <CheckCircle2 size={18} />
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormWizardView;
