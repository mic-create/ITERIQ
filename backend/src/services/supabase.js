import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

if (!config.supabaseUrl || !config.supabaseServiceKey) {
    console.error('CRITICAL: Supabase URL or Service Role Key missing in environment.');
}

// Admin client using Service Role Key for trusted backend operations
export const supabaseAdmin = createClient(config.supabaseUrl, config.supabaseServiceKey, {
    auth: { persistSession: false }
});

// Client using Anon key for token verification checks
export const supabaseClient = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: { persistSession: false }
});