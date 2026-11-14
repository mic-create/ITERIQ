import { apiRequest } from './api.js';
import { SessionManager } from './session.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.4/+esm';

// Frontend Supabase Client for direct Auth operations
const SUPABASE_URL = 'https://agqrdntjoztalrkwbavb.supabase.co'; // Configured via build/env
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFncXJkbnRqb3p0YWxya3diYXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ2NTM3NTAsImV4cCI6MjExMDIyOTc1MH0.lpjPts6C__57qlo2NXLfGNv8OCom2M5B4t7Ytv_3OpY';

export const supabaseAuthClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const AuthService = {
    async login(email, password, role) {
        const { data, error } = await supabaseAuthClient.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);

        // Fetch user profile
        const { data: profile, error: profileError } = await supabaseAuthClient
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profileError || !profile) {
            throw new Error('User profile not found.');
        }

        if (profile.role !== role) {
            throw new Error(`Role mismatch. Selected role does not match account.`);
        }

        let extraData = {};
        if (role === 'STUDENT') {
            const { data: studentData } = await supabaseAuthClient
                .from('students')
                .select('*')
                .eq('id', profile.id)
                .single();
            extraData = studentData || {};
        }

        const sessionUser = {
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            role: profile.role,
            academic_level: extraData.academic_level || '300 Level',
            matric_number: extraData.matric_number || ''
        };

        SessionManager.setSession(data.session.access_token, sessionUser);
        return sessionUser;
    },

    async registerStudent(studentData) {
        // Sign up with Supabase Auth
        const { data, error } = await supabaseAuthClient.auth.signUp({
            email: studentData.email,
            password: studentData.password,
            options: {
                data: { full_name: studentData.fullName, role: 'STUDENT' }
            }
        });

        if (error) throw new Error(error.message);
        const userId = data.user.id;

        // Insert profile and student records via Supabase client (secured by RLS or direct insert)
        await supabaseAuthClient.from('profiles').insert({
            id: userId,
            email: studentData.email,
            full_name: studentData.fullName,
            role: 'STUDENT'
        });

        await supabaseAuthClient.from('students').insert({
            id: userId,
            matric_number: studentData.matricNumber,
            academic_level: studentData.academicLevel
        });

        return { success: true, message: 'Student account successfully registered.' };
    },

    async registerRepresentative(repData) {
        return await apiRequest('/representatives/register', {
            method: 'POST',
            body: JSON.stringify(repData)
        });
    },

    async logout() {
        await supabaseAuthClient.auth.signOut();
        SessionManager.clearSession();
        window.location.hash = '/access/sign-in';
    }
};