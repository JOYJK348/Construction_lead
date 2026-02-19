import React from 'react';
import {
    User, Building2, Users, DoorOpen, CreditCard, CheckCircle,
    Sparkles, MapPin, Phone, Mail, Calendar, Info,
    ChevronRight, ArrowRight, ShieldCheck, Clock, MessageCircle,
    Maximize, TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

// Helper Components for clean UI
const SectionCard = ({ icon: Icon, title, children, variant = "default" }) => {
    const variants = {
        default: "border-slate-200",
        emerald: "border-emerald-100 bg-emerald-50/20",
        indigo: "border-indigo-100 bg-indigo-50/20",
        orange: "border-orange-100 bg-orange-50/20"
    };

    const iconColors = {
        default: "text-indigo-600 bg-indigo-50",
        emerald: "text-emerald-600 bg-emerald-50",
        indigo: "text-indigo-600 bg-indigo-50",
        orange: "text-orange-600 bg-orange-50"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-3xl border shadow-sm overflow-hidden mb-4 ${variants[variant] || variants.default}`}
        >
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border border-slate-100 ${iconColors[variant] || iconColors.default}`}>
                        <Icon size={18} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm tracking-tight">{title}</h3>
                </div>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-slate-100 rounded-full" />
                </div>
            </div>
            <div className="p-5">
                <div className="space-y-4">
                    {children}
                </div>
            </div>
        </motion.div>
    );
};

const DataRow = ({ label, value, icon: Icon, highlight = false }) => (
    <div className="flex items-start gap-4 group">
        {Icon && (
            <div className="mt-1 flex-shrink-0">
                <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400 group-hover:text-indigo-500 transition-colors">
                    <Icon size={14} />
                </div>
            </div>
        )}
        <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
            <p className={`text-sm sm:text-base font-semibold leading-relaxed break-words ${highlight ? 'text-indigo-600' : 'text-slate-900'}`}>
                {Array.isArray(value) ? value.join(', ') : (value || '-')}
            </p>
        </div>
        {highlight && <ChevronRight size={16} className="text-slate-200 mt-5" />}
    </div>
);

const doorNames = {
    mainDoor: { name: 'Main Door', icon: '🚪' },
    interiorDoor: { name: 'Interior Door', icon: '🚪' },
    bathroomDoor: { name: 'Bathroom Door', icon: '🛁' },
    furtherDetails: { name: 'Details', icon: '✨' },
    specialDoor: { name: 'Special Door', icon: '🚪' }
};

const Summary = ({ data, isReview = true }) => {
    // Robust data extraction: Handles both Raw DB Lead and Form Data
    const getNested = (path, fallback = {}) => {
        const parts = path.split('.');
        let current = data;
        for (const part of parts) {
            if (!current) return fallback;
            const next = current[part];
            current = Array.isArray(next) ? next[0] : next;
        }
        return current || fallback;
    };

    // Extract Sections
    const customer = data?.customer || {
        name: getNested('customer_details').customer_name,
        mobile: getNested('customer_details').mobile_number,
        email: getNested('customer_details').email_address,
        address: getNested('customer_details').site_address,
        alternateContact: getNested('customer_details').alternate_contact,
        alternateNumber: getNested('customer_details').alternate_number,
        remarks: getNested('customer_details').remarks,
        isClientAvailable: getNested('customer_details').is_client_available,
        followUpDate: getNested('customer_details').follow_up_date,
        estimatedDoorCount: getNested('customer_details').estimated_door_count
    };

    const siteVisit = getNested('site_visits', {});

    // Improved detection: Check form state first, then DB status, then DB visit record
    const isClientAvailable = data?.customer
        ? data.customer.isClientAvailable !== 'no'
        : (data?.status === 'Temporarily Closed' || siteVisit.is_available === false) ? false : true;

    let followUpDate = data?.customer?.followUpDate || siteVisit.follow_up_date || data?.status_reason?.match(/Follow-up:?\s*([^\s,]+)/)?.[1];
    let estimatedDoors = data?.customer?.estimatedDoorCount || siteVisit.estimated_door_count || data?.status_reason?.match(/Est\. Doors:?\s*(\d+)/)?.[1];

    if (!isClientAvailable && (!followUpDate || !estimatedDoors)) {
        const fullRemarks = customer.remarks || data.status_reason || '';
        if (!followUpDate) {
            const dateMatch = fullRemarks.match(/Follow-up Date:?\s*(\d{4}-\d{2}-\d{2})/);
            if (dateMatch) followUpDate = dateMatch[1];
        }
        if (!estimatedDoors) {
            const doorMatch = fullRemarks.match(/Est\. Doors:?\s*(\d+)/);
            if (doorMatch) estimatedDoors = doorMatch[1];
        }
    }

    const project = data?.project || {
        projectName: getNested('project_information').project_name,
        buildingType: getNested('project_information').building_type,
        constructionStage: getNested('project_information').construction_stage,
        doorRequirementTimeline: getNested('project_information').door_requirement_timeline
    };

    const stakeholders = data?.stakeholders || {
        architectName: getNested('stakeholder_details').architect_engineer_name,
        architectContact: getNested('stakeholder_details').architect_contact_number,
        contractorName: getNested('stakeholder_details').contractor_name,
        contractorContact: getNested('stakeholder_details').contractor_contact_number,
        otherOngoingProjects: getNested('stakeholder_details').other_ongoing_projects
    };

    const payment = data?.payment || {
        paymentMethods: getNested('payment_details').payment_methods,
        leadSource: getNested('payment_details').lead_source,
        projectPriority: getNested('payment_details').project_priority,
        interiorWorkInterest: getNested('payment_details').interior_work_interest
    };

    const doorSpecs = data?.doorSpecifications || {};
    const dbDoors = data?.door_specifications || [];

    const doorEntries = data?.doorSpecifications
        ? Object.entries(doorSpecs).filter(([_, d]) => d.quantity > 0)
        : dbDoors.map(d => [
            Object.keys(doorNames).find(k => doorNames[k].name === d.door_type) || d.door_type,
            { material: d.material_type, size: d.size, quantity: d.quantity, photo: d.photo_url, villageName: d.village_name }
        ]);

    return (
        <div className="space-y-6">
            {isReview && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mb-4 shadow-xl shadow-indigo-200">
                        <ShieldCheck className="text-white" size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Review Summary</h2>
                    <p className="text-slate-500 font-medium">Verify all details before finalizing the lead</p>
                </motion.div>
            )}

            <div className="space-y-4">
                {!isClientAvailable ? (
                    <SectionCard icon={Clock} title="Site Visit Update" variant="orange">
                        <div className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-100 flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shrink-0 shadow-sm border border-orange-200">
                                <Calendar size={24} strokeWidth={2.5} />
                            </div>
                            <div className="flex-1">
                                <p className="text-orange-900 font-bold text-base leading-none">Revisit Scheduled</p>
                                <p className="text-orange-600 text-[11px] font-bold uppercase tracking-wider mt-1 opacity-80">Client was Unavailable</p>
                            </div>
                            <div className="px-3 py-1.5 bg-white rounded-xl border border-orange-200 shadow-sm">
                                <span className="text-orange-600 text-xs font-black">{followUpDate || 'Pending'}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 pt-4">
                            <DataRow label="Client / Site Name" value={customer.name} icon={User} highlight />
                            <DataRow label="Site Address" value={customer.address} icon={MapPin} />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                                    <DataRow label="Target Return Date" value={followUpDate} icon={Calendar} highlight />
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <DataRow label="Estimated Doors" value={estimatedDoors} icon={DoorOpen} />
                                </div>
                            </div>
                            <DataRow label="Remarks / Observations" value={customer.remarks || data?.status_reason} icon={MessageCircle} />
                        </div>
                    </SectionCard>
                ) : (
                    <SectionCard icon={User} title="Customer Information" variant="indigo">
                        <div className="grid grid-cols-1 gap-6">
                            <DataRow label="Full Name" value={customer.name} icon={User} highlight />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <DataRow label="Mobile Number" value={customer.mobile} icon={Phone} />
                                <DataRow label="Email Address" value={customer.email} icon={Mail} />
                            </div>
                            <DataRow label="Site Address" value={customer.address} icon={MapPin} />

                            {customer.alternateContact && (
                                <div className="mt-2 pt-4 border-t border-slate-50">
                                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4">Secondary Contact</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <DataRow label="Contact Name" value={customer.alternateContact} icon={User} />
                                        <DataRow label="Contact Number" value={customer.alternateNumber} icon={Phone} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </SectionCard>
                )}

                {isClientAvailable && (
                    <>
                        <SectionCard icon={Building2} title="Project Analysis" variant="indigo">
                            <div className="grid grid-cols-1 gap-6">
                                <DataRow label="Project Name" value={project.projectName} icon={Building2} highlight />
                                <div className="grid grid-cols-2 gap-4">
                                    <DataRow label="Building Type" value={project.buildingType} icon={Users} />
                                    <DataRow label="Construction Stage" value={project.constructionStage} icon={Sparkles} />
                                </div>
                                <DataRow label="Requirement Timeline" value={project.doorRequirementTimeline} icon={Calendar} />
                            </div>
                        </SectionCard>

                        <SectionCard icon={Users} title="Stakeholder Network" variant="indigo">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-4">
                                    <DataRow label="Architect / Design Professional" value={stakeholders.architectName} icon={User} />
                                    <DataRow label="Architect Contact" value={stakeholders.architectContact} icon={Phone} />
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-4">
                                    <DataRow label="Contractor Name" value={stakeholders.contractorName} icon={User} />
                                    <DataRow label="Contractor Contact" value={stakeholders.contractorContact} icon={Phone} />
                                </div>
                                {stakeholders.otherOngoingProjects && (
                                    <DataRow label="Ongoing Projects Map" value={stakeholders.otherOngoingProjects} icon={MapPin} />
                                )}
                            </div>
                        </SectionCard>

                        {doorEntries.length > 0 && (
                            <SectionCard icon={DoorOpen} title="Door Specifications" variant="emerald">
                                <div className="grid grid-cols-1 gap-4">
                                    {doorEntries.map(([doorKey, door]) => {
                                        const doorInfo = doorNames[doorKey] || doorNames.specialDoor;
                                        return (
                                            <div key={doorKey} className="bg-white rounded-2xl border border-slate-100 overflow-hidden group shadow-sm">
                                                <div className="p-4 flex items-center justify-between border-b border-slate-50">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xl shadow-inner">
                                                            {doorInfo.icon}
                                                        </div>
                                                        <h4 className="font-bold text-slate-900">{doorInfo.name}</h4>
                                                    </div>
                                                    <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                                                        {door.quantity} Units
                                                    </div>
                                                </div>
                                                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-3">
                                                        <DataRow label="Material Preference" value={door.material} icon={Sparkles} />
                                                        <DataRow label="Standard Size" value={door.size} icon={Maximize} />
                                                    </div>
                                                    {door.photo ? (
                                                        <div className="rounded-2xl overflow-hidden border border-slate-100 h-40 relative group-hover:shadow-md transition-shadow">
                                                            <img src={door.photo} alt="door" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                            {door.villageName && (
                                                                <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-md p-2 text-[10px] text-white font-bold flex items-center gap-1.5">
                                                                    <MapPin size={10} className="text-emerald-400" />
                                                                    {door.villageName}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="rounded-2xl bg-slate-50 border border-dashed border-slate-200 h-40 flex flex-col items-center justify-center text-slate-400 gap-2">
                                                            <DoorOpen size={24} className="opacity-30" />
                                                            <span className="text-[10px] font-bold uppercase tracking-wider">No Photo</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </SectionCard>
                        )}

                        <SectionCard icon={CreditCard} title="Commercial & Priority" variant="indigo">
                            <div className="grid grid-cols-1 gap-6">
                                <DataRow label="Payment Strategy" value={payment.paymentMethods?.join(' + ')} icon={CreditCard} />
                                <div className="grid grid-cols-2 gap-4">
                                    <DataRow label="Lead Channel" value={payment.leadSource} icon={ArrowRight} />
                                    <DataRow label="Project Priority" value={payment.projectPriority} icon={TrendingUp} />
                                </div>
                                <DataRow label="Interior Upsell Interest" value={payment.interiorWorkInterest} icon={Sparkles} />
                            </div>
                        </SectionCard>
                    </>
                )}
            </div>
        </div>
    );
};



export default Summary;
