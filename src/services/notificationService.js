import { supabase } from '../supabase';

/**
 * Service to handle automated notifications and reminders
 */
export const checkAndCreateFollowUpNotifications = async (userId) => {
    if (!userId) return;

    try {
        console.log('[NotificationService] Checking for upcoming follow-ups...');

        // 1. Calculate the date for tomorrow (Local Time)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        const tomorrowStr = `${yyyy}-${mm}-${dd}`;

        console.log(`[NotificationService] Checking for follow-ups on: ${tomorrowStr}`);

        // 2. Fetch leads joined with customer_details to get the Name
        const { data: upcomingFollowUps, error: fetchError } = await supabase
            .from('payment_details')
            .select(`
                lead_id,
                expected_completion_date,
                leads (
                    lead_number,
                    created_by,
                    customer_details (customer_name)
                )
            `)
            .eq('expected_completion_date', tomorrowStr);

        if (fetchError) throw fetchError;
        if (!upcomingFollowUps || upcomingFollowUps.length === 0) {
            console.log('[NotificationService] No meetings scheduled for tomorrow.');
            return;
        }

        console.log(`[NotificationService] Found ${upcomingFollowUps.length} follow-ups for tomorrow.`);

        // 3. Process each found follow-up
        for (const followUp of upcomingFollowUps) {
            const { lead_id, expected_completion_date, leads: leadInfo } = followUp;
            if (!leadInfo) continue;

            const customerName = leadInfo.customer_details?.[0]?.customer_name || 'Valued Client';
            const reminderMessage = `⏰ REMINDER: Meeting tomorrow (${expected_completion_date}) with ${customerName} for Lead ${leadInfo.lead_number}. Please prepare for the visit.`;

            // Check if this specific reminder message already exists
            const { data: existingNotif } = await supabase
                .from('notifications')
                .select('id')
                .eq('lead_id', lead_id)
                .eq('message', reminderMessage)
                .limit(1);

            if (existingNotif && existingNotif.length > 0) continue;

            // 4. Identify recipients (Owner + Admins)
            const recipients = [];
            if (leadInfo.created_by) recipients.push(leadInfo.created_by);

            const { data: admins } = await supabase.from('users').select('id').eq('role', 'admin');
            if (admins) {
                admins.forEach(admin => {
                    if (!recipients.includes(admin.id)) recipients.push(admin.id);
                });
            }

            // 5. Bulk insert notifications
            const notificationsToInsert = recipients.map(recvId => ({
                user_id: recvId,
                lead_id: lead_id,
                message: reminderMessage,
                type: 'reminder'
            }));

            if (notificationsToInsert.length > 0) {
                const { error: insertError } = await supabase
                    .from('notifications')
                    .insert(notificationsToInsert);

                if (insertError) {
                    console.error('[NotificationService] Error inserting notifications:', insertError);
                } else {
                    console.log(`[NotificationService] Reminder sent for ${leadInfo.lead_number}`);
                }
            }
        }

    } catch (err) {
        console.error('[NotificationService] Critical error in automation:', err);
    }
};
