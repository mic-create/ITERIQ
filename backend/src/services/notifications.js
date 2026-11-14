import { supabaseAdmin } from './supabase.js';

export async function getRepresentativeNotifications(repProfileId, limit = 50) {
    // 1. Get representative course code and academic level
    const { data: repData, error: repError } = await supabaseAdmin
        .from('course_representatives')
        .select('course_code, academic_level')
        .eq('profile_id', repProfileId)
        .eq('status', 'ACTIVE')
        .single();

    if (repError || !repData) {
        return [];
    }

    // 2. Fetch session IDs for this representative
    const { data: sessions } = await supabaseAdmin
        .from('attendance_sessions')
        .select('id')
        .eq('course_code', repData.course_code)
        .eq('academic_level', repData.academic_level);

    if (!sessions || sessions.length === 0) {
        return [];
    }

    const sessionIds = sessions.map(s => s.id);

    // 3. Fetch recent attendance records across those sessions
    const { data: records, error: recError } = await supabaseAdmin
        .from('attendance_records')
        .select(`
            id,
            verified_at,
            attendance_sessions (
                course_code,
                academic_level,
                venues (venue_name)
            ),
            profiles:student_id (full_name),
            students:student_id (matric_number)
        `)
        .in('session_id', sessionIds)
        .order('verified_at', { ascending: false })
        .limit(limit);

    if (recError) {
        console.error('Failed to fetch notifications:', recError);
        return [];
    }

    return (records || []).map(r => ({
        id: r.id,
        studentName: r.profiles?.full_name || 'Unknown Student',
        matricNumber: r.students?.matric_number || 'N/A',
        courseCode: r.attendance_sessions?.course_code,
        academicLevel: r.attendance_sessions?.academic_level,
        venueName: r.attendance_sessions?.venues?.venue_name || 'Campus Venue',
        timestamp: r.verified_at
    }));
}