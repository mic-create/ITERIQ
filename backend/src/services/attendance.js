import { supabaseAdmin } from './supabase.js';
import { config } from '../config.js';
import axios from 'axios';

export async function resolveOrCreateActiveSession(courseCode, academicLevel, venueId, representativeId) {
    const upperCourse = courseCode.toUpperCase().trim();
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    const { data: existingSession, error: fetchError } = await supabaseAdmin
        .from('attendance_sessions')
        .select('*')
        .eq('course_code', upperCourse)
        .eq('academic_level', academicLevel)
        .eq('venue_id', venueId)
        .gte('created_at', startOfDay)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (fetchError) {
        throw new Error('Failed to resolve attendance session.');
    }

    if (existingSession) {
        return existingSession;
    }

    const expiresAt = new Date(now.getTime() + 12 * 60 * 60 * 1000).toISOString();
    const { data: newSession, error: createError } = await supabaseAdmin
        .from('attendance_sessions')
        .insert({
            course_code: upperCourse,
            course_title: `${upperCourse} Lecture Session`,
            academic_level: academicLevel,
            venue_id: venueId,
            representative_id: representativeId,
            expires_at: expiresAt
        })
        .select()
        .single();

    if (createError) {
        throw new Error(`Failed to create attendance session: ${createError.message}`);
    }

    return newSession;
}

export async function recordAttendanceSubmission(sessionId, studentId, latitude, longitude, accuracy) {
    const { data, error } = await supabaseAdmin
        .from('attendance_records')
        .insert({
            session_id: sessionId,
            student_id: studentId,
            latitude_submitted: latitude,
            longitude_submitted: longitude,
            accuracy_meters: accuracy
        })
        .select()
        .single();

    if (error) {
        if (error.code === '23505') {
            throw new Error('Duplicate attendance: You have already signed attendance for this session.');
        }
        throw new Error(error.message);
    }

    return data;
}

export async function getRepresentativeSessionsAndRecords(repProfileId) {
    const { data: repData, error: repError } = await supabaseAdmin
        .from('course_representatives')
        .select('course_code, academic_level')
        .eq('profile_id', repProfileId)
        .eq('status', 'ACTIVE')
        .single();

    if (repError || !repData) {
        throw new Error('Active course representative profile not found.');
    }

    const { data: sessions, error: sessionError } = await supabaseAdmin
        .from('attendance_sessions')
        .select(`
            id,
            course_code,
            course_title,
            academic_level,
            venue_id,
            created_at,
            venues (venue_name)
        `)
        .eq('course_code', repData.course_code)
        .eq('academic_level', repData.academic_level)
        .order('created_at', { ascending: false });

    if (sessionError) {
        throw new Error('Failed to retrieve attendance sessions.');
    }

    return { repData, sessions: sessions || [] };
}

export async function getSessionAttendanceRecords(sessionId, repProfileId) {
    const { data: session, error: sessError } = await supabaseAdmin
        .from('attendance_sessions')
        .select('course_code, academic_level')
        .eq('id', sessionId)
        .single();

    if (sessError || !session) {
        throw new Error('Session not found.');
    }

    const { data: repData } = await supabaseAdmin
        .from('course_representatives')
        .select('course_code, academic_level')
        .eq('profile_id', repProfileId)
        .single();

    if (!repData || repData.course_code !== session.course_code || repData.academic_level !== session.academic_level) {
        throw new Error('Unauthorized access to attendance records for this session.');
    }

    const { data: records, error: recError } = await supabaseAdmin
        .from('attendance_records')
        .select(`
            id,
            verified_at,
            accuracy_meters,
            profiles:student_id (full_name, email),
            students:student_id (matric_number, academic_level)
        `)
        .eq('session_id', sessionId)
        .order('verified_at', { ascending: false });

    if (recError) {
        throw new Error('Failed to retrieve attendance records.');
    }

    return records || [];
}

export async function generateSessionPdfStream(sessionId, repProfileId) {
    // 1. Verify representative and get session details
    const { data: session, error: sessError } = await supabaseAdmin
        .from('attendance_sessions')
        .select(`
            *,
            venues (venue_name)
        `)
        .eq('id', sessionId)
        .single();

    if (sessError || !session) {
        throw new Error('Attendance session not found.');
    }

    const { data: repData, error: repError } = await supabaseAdmin
        .from('course_representatives')
        .select('course_code, academic_level, profiles:profile_id (full_name)')
        .eq('profile_id', repProfileId)
        .single();

    if (repError || !repData || repData.course_code !== session.course_code || repData.academic_level !== session.academic_level) {
        throw new Error('Unauthorized: You are not the assigned representative for this session.');
    }

    // 2. Fetch all student records for this session
    const { data: records, error: recError } = await supabaseAdmin
        .from('attendance_records')
        .select(`
            verified_at,
            profiles:student_id (full_name),
            students:student_id (matric_number, academic_level)
        `)
        .eq('session_id', sessionId)
        .order('verified_at', { ascending: true });

    if (recError) {
        throw new Error('Failed to retrieve session records for PDF export.');
    }

    const formattedRecords = (records || []).map(r => ({
        full_name: r.profiles?.full_name || 'Unknown Student',
        matric_number: r.students?.matric_number || 'N/A',
        academic_level: r.students?.academic_level || session.academic_level,
        timestamp: new Date(r.verified_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }));

    const payload = {
        institution: "Bells University of Technology, Ota",
        course_code: session.course_code,
        course_title: session.course_title,
        academic_level: session.academic_level,
        venue_name: session.venues?.venue_name || "Campus Lecture Venue",
        session_date: new Date(session.created_at).toLocaleDateString(),
        total_count: formattedRecords.length,
        representative_name: repData.profiles?.full_name || "Course Representative",
        records: formattedRecords
    };

    // 3. Call Python FastAPI PDF service
    try {
        const response = await axios.post(`${config.pdfServiceUrl}/generate-pdf`, payload, {
            headers: {
                'X-Pdf-Service-Token': config.pdfServiceToken,
                'Content-Type': 'application/json'
            },
            responseType: 'arraybuffer'
        });
        return { buffer: response.data, courseCode: session.course_code, academicLevel: session.academic_level, date: new Date(session.created_at).toISOString().split('T')[0] };
    } catch (err) {
        console.error('Python PDF Service Communication Error:', err.response?.data || err.message);
        throw new Error('Failed to communicate with the PDF generation microservice.');
    }
}