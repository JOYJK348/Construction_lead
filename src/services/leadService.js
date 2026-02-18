import { supabase } from '../supabase';

/**
 * Enhanced Lead Submission Service
 * Supports: UUIDs, Audit Columns (created_by), and New Table Structure
 */
export const submitLead = async (formData, userId, existingLeadId = null) => {
    console.log('[LeadService] Starting submission with User ID:', userId, existingLeadId ? `(Updating lead ${existingLeadId})` : '(New lead)');

    try {
        const isClientAvailable = formData.customer.isClientAvailable !== 'no';

        const leadStatus = isClientAvailable ? 'Roaming' : 'Temporarily Closed';
        const leadPayload = {
            status: leadStatus,
            updated_by: userId,
            status_reason: isClientAvailable ? null : `Client Unavailable. Follow-up: ${formData.customer.followUpDate}. Est. Doors: ${formData.customer.estimatedDoorCount}`,
            updated_at: new Date().toISOString()
        };

        let leadId, leadNumber;

        if (existingLeadId) {
            // Update mode
            const { data: updateData, error: updateError } = await supabase
                .from('leads')
                .update(leadPayload)
                .eq('id', existingLeadId)
                .select()
                .single();
            if (updateError) throw updateError;
            leadId = existingLeadId;
            leadNumber = updateData.lead_number;
        } else {
            // Insert mode
            const now = new Date();
            leadNumber = formData.customer.leadNumber || `CL-${now.getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}-${String(now.getSeconds()).padStart(2, '0')}`;
            const { data: leadData, error: leadError } = await supabase
                .from('leads')
                .insert([{
                    ...leadPayload,
                    lead_number: leadNumber,
                    created_by: userId
                }])
                .select()
                .single();
            if (leadError) throw leadError;
            leadId = leadData.id;
        }

        // 2. Insert Customer Details
        // Handle unavailable client with placeholders to satisfy DB constraints
        const customerName = isClientAvailable ? formData.customer.name : 'Client Unavailable';
        const mobileNumber = isClientAvailable ? formData.customer.mobile : '0000000000';
        let remarks = formData.customer.remarks || '';

        if (!isClientAvailable) {
            remarks += `\n[System]: Client Unavailable.\nFollow-up Date: ${formData.customer.followUpDate}\nEst. Doors: ${formData.customer.estimatedDoorCount}`;
        }

        const customerPayload = {
            lead_id: leadId,
            customer_name: customerName,
            mobile_number: mobileNumber,
            email_address: formData.customer.email || null,
            site_address: formData.customer.address,
            alternate_contact: formData.customer.alternateContact || null,
            alternate_number: formData.customer.alternateNumber || null,
            remarks: remarks,
            updated_by: userId
        };

        if (existingLeadId) {
            await supabase.from('customer_details').update(customerPayload).eq('lead_id', leadId);
        } else {
            const { error: customerError } = await supabase
                .from('customer_details')
                .insert([{ ...customerPayload, created_by: userId }]);
            if (customerError) throw customerError;
        }

        // 3. Insert Project Information
        const projectPayload = {
            lead_id: leadId,
            project_name: isClientAvailable ? formData.project.projectName : 'Unknown Project',
            building_type: isClientAvailable ? formData.project.buildingType : 'Residential',
            construction_stage: isClientAvailable ? formData.project.constructionStage : 'Unknown',
            door_requirement_timeline: isClientAvailable ? formData.project.doorRequirementTimeline : 'Unknown',
            estimated_total_door_count: isClientAvailable
                ? (parseInt(formData.project.estimatedTotalDoorCount) || 0)
                : (parseInt(formData.customer.estimatedDoorCount) || 0),
            updated_by: userId
        };

        if (existingLeadId) {
            await supabase.from('project_information').update(projectPayload).eq('lead_id', leadId);
        } else {
            const { error: projectError } = await supabase
                .from('project_information')
                .insert([{ ...projectPayload, created_by: userId }]);
            if (projectError) throw projectError;
        }

        // 4. Insert Stakeholder Details
        const stakeholderPayload = {
            lead_id: leadId,
            architect_engineer_name: isClientAvailable ? formData.stakeholders.architectName : 'Unknown',
            architect_contact_number: isClientAvailable ? formData.stakeholders.architectContact : '0000000000',
            contractor_name: isClientAvailable ? formData.stakeholders.contractorName : 'Unknown',
            contractor_contact_number: isClientAvailable ? formData.stakeholders.contractorContact : '0000000000',
            other_ongoing_projects: isClientAvailable ? (formData.stakeholders.otherOngoingProjects || null) : null,
            updated_by: userId
        };

        if (existingLeadId) {
            await supabase.from('stakeholder_details').update(stakeholderPayload).eq('lead_id', leadId);
        } else {
            const { error: stakeholderError } = await supabase
                .from('stakeholder_details')
                .insert([{ ...stakeholderPayload, created_by: userId }]);
            if (stakeholderError) throw stakeholderError;
        }

        // 5. Create Initial Site Visit Log
        let visitLocation = {
            latitude: formData.customer.locationMetadata?.latitude || null,
            longitude: formData.customer.locationMetadata?.longitude || null,
            villageName: formData.customer.locationMetadata?.villageName || null,
            placeDetails: formData.customer.address
        };

        if (!visitLocation.latitude && isClientAvailable) {
            for (const [key, spec] of Object.entries(formData.doorSpecifications || {})) {
                if (spec.latitude && spec.longitude) {
                    visitLocation = {
                        latitude: spec.latitude,
                        longitude: spec.longitude,
                        villageName: spec.villageName,
                        placeDetails: spec.placeDetails || formData.customer.address
                    };
                    break;
                }
            }
        }

        const visitPayload = {
            lead_id: leadId,
            engineer_id: userId,
            is_available: isClientAvailable,
            visit_notes: isClientAvailable
                ? 'Data updated by Field Survey Person'
                : `Update: Client Unavailable. Follow-up: ${formData.customer.followUpDate}`,
            latitude: visitLocation.latitude,
            longitude: visitLocation.longitude,
            village_name: visitLocation.villageName,
            place_details: visitLocation.placeDetails
        };

        let visitId;
        if (existingLeadId) {
            // Check for existing visit or create new log
            const { data: existingVisit } = await supabase.from('site_visits').select('id').eq('lead_id', leadId).order('created_at', { ascending: false }).limit(1).single();
            if (existingVisit) {
                visitId = existingVisit.id;
                await supabase.from('site_visits').update(visitPayload).eq('id', visitId);
            } else {
                const { data: nv } = await supabase.from('site_visits').insert([{ ...visitPayload, created_by: userId }]).select('id').single();
                visitId = nv.id;
            }
        } else {
            const { data: visitData, error: visitError } = await supabase
                .from('site_visits')
                .insert([{ ...visitPayload, created_by: userId }])
                .select()
                .single();
            if (visitError) throw visitError;
            visitId = visitData.id;
        }

        // 6. Insert Door Specifications (Only if available)
        if (isClientAvailable) {
            const doorTypeMap = { mainDoor: 'Main Door', interiorDoor: 'Interior Door', bathroomDoor: 'Bathroom Door', furtherDetails: 'Further Details' };
            const doorInserts = [];
            for (const [key, spec] of Object.entries(formData.doorSpecifications || {})) {
                const qty = parseInt(spec.quantity) || 0;
                if (qty > 0) {
                    doorInserts.push({
                        lead_id: leadId,
                        visit_id: visitId,
                        door_type: doorTypeMap[key] || key,
                        material_type: spec.material || 'Not Specified',
                        quantity: qty,
                        photo_url: spec.photo || null,
                        created_by: userId
                    });
                }
            }

            if (existingLeadId) {
                await supabase.from('door_specifications').delete().eq('lead_id', leadId);
            }
            if (doorInserts.length > 0) {
                const { error: doorError } = await supabase.from('door_specifications').insert(doorInserts);
                if (doorError) throw doorError;
            }
        }

        // 7. Insert Payment Details
        const paymentPayload = {
            lead_id: leadId,
            payment_methods: isClientAvailable ? (formData.payment.paymentMethods || []) : [],
            lead_source: isClientAvailable ? formData.payment.leadSource : 'Direct Visit',
            project_priority: isClientAvailable ? formData.payment.projectPriority : 'Cold',
            interior_work_interest: isClientAvailable ? (formData.payment.interiorWorkInterest || null) : null,
            updated_by: userId
        };

        if (existingLeadId) {
            await supabase.from('payment_details').update(paymentPayload).eq('lead_id', leadId);
        } else {
            const { error: paymentError } = await supabase
                .from('payment_details')
                .insert([{ ...paymentPayload, created_by: userId }]);
            if (paymentError) throw paymentError;
        }

        // 8. Auto-assign and Notify
        if (userId) {
            const { data: userData } = await supabase.from('users').select('role, full_name').eq('id', userId).single();
            const userRole = userData?.role?.toLowerCase();

            if (!existingLeadId && (userRole === 'engineer' || userRole === 'user' || userRole === 'field engineer' || userRole === 'field survey person')) {
                await supabase.from('lead_assignments').insert([{
                    lead_id: leadId,
                    engineer_id: userId,
                    is_current: true,
                    created_by: userId
                }]);
            }

            // Enhance notification message with names
            const customerName = formData.customer.isClientAvailable !== 'no' ? formData.customer.name : 'Unknown Client';
            const projectName = formData.project.projectName || 'General Site';

            let title = isClientAvailable ? `🆕 New Lead: ${customerName}` : `⚠️ Missed Visit: ${customerName}`;
            if (existingLeadId) title = `🔄 Resubmitted: ${customerName}`;

            const { data: admins } = await supabase.from('users').select('id').eq('role', 'admin');
            if (admins) {
                const adminNotifications = admins.map(admin => ({
                    user_id: admin.id,
                    lead_id: leadId,
                    message: existingLeadId
                        ? `Lead for ${customerName} (${projectName}) has been corrected and resubmitted by ${userData.full_name}.`
                        : `${title} (${projectName}) - ${isClientAvailable ? 'Customer Available' : 'Client Not Available'} - Logged by ${userData.full_name}`,
                    type: existingLeadId ? 'assignment' : (isClientAvailable ? 'assignment' : 'reminder')
                }));
                await supabase.from('notifications').insert(adminNotifications);
            }
        }

        console.log('[LeadService] ✅ Lead submitted successfully');
        return { success: true, leadId, leadNumber };

    } catch (error) {
        console.error('[LeadService] Submission Error:', error);
        return { success: false, error, message: error.message };
    }
};

/**
 * Approve a lead and move to Master status
 */
export const approveLead = async (lead) => {
    try {
        const { error } = await supabase
            .from('leads')
            .update({
                status: 'Master'
            })
            .eq('id', lead.id);

        if (error) throw error;

        // Notifications logic
        const engId = lead.assignments?.[0]?.engineer_id;
        const creatorId = lead.created_by;
        const notifications = [];

        // Enhance notification message
        const customerName = lead.customer_details?.[0]?.customer_name || 'Valued Client';
        const projectName = lead.project_information?.[0]?.project_name || lead.lead_number;

        if (engId) {
            notifications.push({
                user_id: engId,
                lead_id: lead.id,
                message: `✅ Lead for ${customerName} (${projectName}) was approved and moved to Master!`,
                type: 'completion'
            });
        }

        if (creatorId && creatorId !== engId) {
            notifications.push({
                user_id: creatorId,
                lead_id: lead.id,
                message: `✅ Your lead for ${customerName} has been approved by Admin!`,
                type: 'completion'
            });
        }

        if (notifications.length > 0) {
            await supabase.from('notifications').insert(notifications);
        }

        return { success: true };
    } catch (error) {
        console.error('[LeadService] Approve Error:', error);
        return { success: false, error };
    }
};

/**
 * Reject a lead or mark it as needing updates
 */
export const rejectLead = async (lead, reason) => {
    try {
        const { error } = await supabase
            .from('leads')
            .update({
                status: 'Temporarily Closed',
                status_reason: reason
            })
            .eq('id', lead.id);

        if (error) throw error;

        // Notifications logic
        const engId = lead.assignments?.[0]?.engineer_id;
        const creatorId = lead.created_by;
        const notifications = [];

        // Enhance notification message
        const customerName = lead.customer_details?.[0]?.customer_name || 'Valued Client';

        if (engId) {
            notifications.push({
                user_id: engId,
                lead_id: lead.id,
                message: `⚠️ Action Required: Lead for ${customerName} needs changes: ${reason}`,
                type: 'reminder'
            });
        }

        if (creatorId && creatorId !== engId) {
            notifications.push({
                user_id: creatorId,
                lead_id: lead.id,
                message: `⚠️ Update Needed: Your lead for ${customerName} was marked for action: ${reason}`,
                type: 'reminder'
            });
        }

        if (notifications.length > 0) {
            await supabase.from('notifications').insert(notifications);
        }

        return { success: true };
    } catch (error) {
        console.error('[LeadService] Reject Error:', error);
        return { success: false, error };
    }
};

/**
 * Permanently close a lead (Archive/Hide from all views)
 */
export const closePermanently = async (lead, reason) => {
    try {
        const { error } = await supabase
            .from('leads')
            .update({
                status: 'Closed Permanently',
                status_reason: reason,
                updated_at: new Date().toISOString()
            })
            .eq('id', lead.id);

        if (error) throw error;

        // Notify relevant parties
        const engId = lead.assignments?.[0]?.engineer_id;
        const creatorId = lead.created_by;
        const notifications = [];

        // Enhance notification message
        const customerName = lead.customer_details?.[0]?.customer_name || 'Valued Client';

        if (engId) {
            notifications.push({
                user_id: engId,
                lead_id: lead.id,
                message: `🚫 Lead for ${customerName} has been closed permanently by Admin.`,
                type: 'system'
            });
        }

        if (creatorId && creatorId !== engId) {
            notifications.push({
                user_id: creatorId,
                lead_id: lead.id,
                message: `🚫 Your lead for ${customerName} has been closed permanently.`,
                type: 'system'
            });
        }

        if (notifications.length > 0) {
            await supabase.from('notifications').insert(notifications);
        }

        return { success: true };
    } catch (error) {
        console.error('[LeadService] Permanently Close Error:', error);
        return { success: false, error };
    }
};


