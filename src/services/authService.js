import { supabase } from '../supabase';

/**
 * Authentication & User Management Service
 */

// Get all engineers for assignment dropdown
export const getAllEngineers = async () => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, full_name, email')
            .eq('role', 'engineer')
            .eq('is_active', true)
            .order('full_name');

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('[AuthService] Get Engineers Error:', error);
        return { success: false, error };
    }
};

// Assign engineer to a lead
export const assignEngineerToLead = async (leadId, engineerId, assignedBy) => {
    try {
        // First, mark all previous assignments as not current
        await supabase
            .from('lead_assignments')
            .update({ is_current: false })
            .eq('lead_id', leadId);

        // Create new assignment
        const { data, error } = await supabase
            .from('lead_assignments')
            .insert([{
                lead_id: leadId,
                engineer_id: engineerId,
                is_current: true,
                created_by: assignedBy
            }])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('[AuthService] Assignment Error:', error);
        return { success: false, error };
    }
};

// Get current engineer for a lead
export const getCurrentEngineer = async (leadId) => {
    try {
        const { data, error } = await supabase
            .from('lead_assignments')
            .select(`
                *,
                engineer:users!engineer_id(id, full_name, email)
            `)
            .eq('lead_id', leadId)
            .eq('is_current', true)
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error };
    }
};
// Get all users (Admin only)
export const getAllUsers = async () => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('[AuthService] Get Users Error:', error);
        return { success: false, error };
    }
};

// Create a new user
export const createUser = async (userData) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .insert([userData])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('[AuthService] Create User Error:', error);
        return { success: false, error };
    }
};

// Update an existing user
export const updateUser = async (userId, updateData) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('[AuthService] Update User Error:', error);
        return { success: false, error };
    }
};

// Delete a user (Soft delete is better, but this handles hard delete for now)
export const deleteUser = async (userId) => {
    try {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('[AuthService] Delete User Error:', error);
        return { success: false, error };
    }
};
