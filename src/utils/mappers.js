
/**
 * Maps Supabase Lead DB schema to App FormData schema.
 * @param {Object} dbLead - Full lead object including joins from Supabase
 * @returns {Object} formData - Structure compatible with Summary component and App state
 */
export const mapDbLeadToFormData = (dbLead) => {
    if (!dbLead) return null;

    // Helper to safely access array[0] from joins
    // Note: In Supabase, joining single child often returns array of 1
    const customer = dbLead.customer_details?.[0] || dbLead.customer_details || {};
    const project = dbLead.project_information?.[0] || dbLead.project_information || {};
    const stakeholder = dbLead.stakeholder_details?.[0] || dbLead.stakeholder_details || {};
    const payment = dbLead.payment_details?.[0] || dbLead.payment_details || {};

    // Process Door Specifications from Array to Object Map
    const doorSpecs = {};
    const doorTypeReverseMap = {
        'Main Door': 'mainDoor',
        'Interior Door': 'interiorDoor',
        'Bathroom Door': 'bathroomDoor',
        'Further Details': 'furtherDetails'
    };

    if (dbLead.door_specifications && Array.isArray(dbLead.door_specifications)) {
        dbLead.door_specifications.forEach(ds => {
            const key = doorTypeReverseMap[ds.door_type] || 'specialDoor';
            if (key) {
                doorSpecs[key] = {
                    material: ds.material_type,
                    quantity: String(ds.quantity),
                    photo: ds.photo_url,
                    villageName: ds.village_name
                };
            }
        });
    }

    // Fallback payment methods handling (string to array for UI)
    let pMethods = payment.payment_methods || [];
    if (typeof pMethods === 'string') {
        pMethods = pMethods.split(',').map(m => m.trim());
    }

    return {
        customer: {
            name: customer.customer_name || '',
            mobile: customer.mobile_number || '',
            email: customer.email_address || '',
            address: customer.site_address || '',
            alternateContact: customer.alternate_contact || '',
            alternateNumber: customer.alternate_number || '',
            remarks: customer.remarks || ''
        },
        project: {
            projectName: project.project_name || '',
            buildingType: project.building_type || '',
            constructionStage: project.construction_stage || '',
            doorRequirementTimeline: project.door_requirement_timeline || '',
            estimatedTotalDoorCount: String(project.estimated_total_door_count || '')
        },
        stakeholders: {
            architectName: stakeholder.architect_engineer_name || '',
            architectContact: stakeholder.architect_contact_number || '',
            contractorName: stakeholder.contractor_name || '',
            contractorContact: stakeholder.contractor_contact_number || '',
            otherOngoingProjects: stakeholder.other_ongoing_projects || ''
        },
        doorSpecifications: doorSpecs,
        payment: {
            paymentMethods: pMethods,
            leadSource: payment.lead_source || '',
            projectPriority: payment.project_priority || '',
            interiorWorkInterest: payment.interior_work_interest || ''
        }
    };
};
