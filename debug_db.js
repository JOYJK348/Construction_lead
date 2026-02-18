
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkLeads() {
    console.log('--- Checking Leads ---');
    const { data: leads, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (leadError) {
        console.error('Lead Error:', leadError);
    } else {
        console.log('Recent Leads:', leads);
    }

    console.log('\n--- Checking Assignments ---');
    const { data: assignments, error: assignError } = await supabase
        .from('lead_assignments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (assignError) {
        console.error('Assignment Error:', assignError);
    } else {
        console.log('Recent Assignments:', assignments);
    }

    console.log('\n--- Checking Users ---');
    const { data: users, error: userError } = await supabase
        .from('users')
        .select('id, email, role, full_name')
        .limit(5);

    if (userError) {
        console.error('User Error:', userError);
    } else {
        console.log('Users:', users);
    }
}

checkLeads();
