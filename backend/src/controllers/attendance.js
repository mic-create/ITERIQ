import { verifyGeofence } from '../services/geofence.js';
import { resolveOrCreateActiveSession, recordAttendanceSubmission, getRepresentativeSessionsAndRecords, getSessionAttendanceRecords, generateSessionPdfStream } from '../services/attendance.js';
import { getRepresentativeNotifications } from '../services/notifications.js';
import { supabaseAdmin } from '../services/supabase.js';

export async function submitAttendance(req, res) {
    try {
        const { courseCode, academicLevel, latitude, longitude, accuracy, timestamp } = req.body;
        const studentId = req.user.id;

        const upperCourse = courseCode.toUpperCase().trim();

        const { data: rep, error: repError } = await supabaseAdmin
            .from('course_representatives')
            .select('profile_id')
            .eq('course_code', upperCourse)
            .eq('academic_level', academicLevel)
            .eq('status', 'ACTIVE')
            .maybeSingle();

        if (repError || !rep) {
            return res.status(404).json({
                success: false,
                message: `No active course representative registered for ${upperCourse} (${academicLevel}). Attendance cannot be signed.`
            });
        }

        const geofenceResult = verifyGeofence(latitude, longitude, accuracy, timestamp);

        if (!geofenceResult.verified) {
            return res.status(403).json({ success: false, message: geofenceResult.message });
        }

        const venueId = geofenceResult.venue.venue_id;
        const session = await resolveOrCreateActiveSession(upperCourse, academicLevel, venueId, rep.profile_id);
        const record = await recordAttendanceSubmission(session.id, studentId, latitude, longitude, accuracy);

        return res.status(201).json({
            success: true,
            message: 'Attendance successfully verified and recorded.',
            courseCode: upperCourse,
            venue: geofenceResult.venue.venue_name,
            distanceMeters: geofenceResult.distance,
            sessionId: session.id,
            recordId: record.id
        });
    } catch (err) {
        console.error('Attendance Submission Error:', err);
        return res.status(400).json({ success: false, message: err.message || 'Internal server error.' });
    }
}

export async function fetchRepresentativeDashboardData(req, res) {
    try {
        const repProfileId = req.user.id;
        const { repData, sessions } = await getRepresentativeSessionsAndRecords(repProfileId);
        const notifications = await getRepresentativeNotifications(repProfileId, 30);

        return res.status(200).json({
            success: true,
            representative: repData,
            sessions,
            notifications
        });
    } catch (err) {
        console.error('Rep Dashboard Error:', err);
        return res.status(400).json({ success: false, message: err.message });
    }
}

export async function fetchSessionRecordsEndpoint(req, res) {
    try {
        const { sessionId } = req.params;
        const repProfileId = req.user.id;
        const records = await getSessionAttendanceRecords(sessionId, repProfileId);

        return res.status(200).json({
            success: true,
            records
        });
    } catch (err) {
        console.error('Session Records Error:', err);
        return res.status(400).json({ success: false, message: err.message });
    }
}

export async function downloadSessionPdf(req, res) {
    try {
        const { sessionId } = req.params;
        const repProfileId = req.user.id;

        const { buffer, courseCode, academicLevel, date } = await generateSessionPdfStream(sessionId, repProfileId);
        const filename = `ITERIQ_${courseCode.replace(/\s+/g, '')}_${academicLevel.replace(/\s+/g, '')}_${date}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return res.send(Buffer.from(buffer));
    } catch (err) {
        console.error('PDF Download Error:', err);
        return res.status(400).json({ success: false, message: err.message || 'Failed to generate PDF register.' });
    }
}