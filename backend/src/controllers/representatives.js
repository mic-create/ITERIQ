import { supabaseAdmin } from '../services/supabase.js';
import { config } from '../config.js';
import crypto from 'crypto';

export async function registerRepresentative(req, res) {
    try {
        const { fullName, email, password, courseCode, academicLevel, registrationCode } = req.body;

        if (!fullName || !email || !password || !courseCode || !academicLevel || !registrationCode) {
            return res.status(400).json({ success: false, message: 'All registration fields are required.' });
        }

        // Constant-time comparison for secure access code validation
        const providedBuffer = Buffer.from(registrationCode);
        const expectedBuffer = Buffer.from(config.courseRepCode);
        
        if (providedBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(providedBuffer, expectedBuffer)) {
            return res.status(403).json({ success: false, message: 'Invalid course representative registration access code.' });
        }

        // Check if an active representative already exists for this course and academic level
        const { data: existingRep, error: repCheckError } = await supabaseAdmin
            .from('course_representatives')
            .select('id')
            .eq('course_code', courseCode.toUpperCase().trim())
            .eq('academic_level', academicLevel)
            .eq('status', 'ACTIVE')
            .maybeSingle();

        if (repCheckError) {
            console.error('Rep check error:', repCheckError);
            return res.status(500).json({ success: false, message: 'Database validation error.' });
        }

        if (existingRep) {
            return res.status(409).json({ 
                success: false, 
                message: `An active course representative is already registered for ${courseCode} (${academicLevel}).` 
            });
        }

        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: fullName, role: 'COURSE_REPRESENTATIVE' }
        });

        if (authError) {
            return res.status(400).json({ success: false, message: authError.message });
        }

        const userId = authData.user.id;

        // Insert into profiles table
        const { error: profileError } = await supabaseAdmin.from('profiles').insert({
            id: userId,
            email,
            full_name: fullName,
            role: 'COURSE_REPRESENTATIVE',
            status: 'ACTIVE'
        });

        if (profileError) {
            await supabaseAdmin.auth.admin.deleteUser(userId);
            return res.status(400).json({ success: false, message: profileError.message });
        }

        // Insert into course_representatives table
        const { error: repInsertError } = await supabaseAdmin.from('course_representatives').insert({
            profile_id: userId,
            course_code: courseCode.toUpperCase().trim(),
            academic_level: academicLevel,
            status: 'ACTIVE'
        });

        if (repInsertError) {
            await supabaseAdmin.auth.admin.deleteUser(userId);
            return res.status(400).json({ success: false, message: repInsertError.message });
        }

        return res.status(201).json({
            success: true,
            message: 'Course representative account successfully registered.',
            userId
        });

    } catch (err) {
        console.error('Representative Registration Error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error during registration.' });
    }
}