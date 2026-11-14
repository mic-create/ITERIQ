import express from 'express';
import { verifyAuthToken } from '../middleware/auth.js';
import { validateAttendanceSubmission } from '../validators/attendance.js';
import { submitAttendance, fetchRepresentativeDashboardData, fetchSessionRecordsEndpoint, downloadSessionPdf } from '../controllers/attendance.js';

const router = express.Router();

router.post('/verify', verifyAuthToken, validateAttendanceSubmission, submitAttendance);
router.get('/representative/dashboard', verifyAuthToken, fetchRepresentativeDashboardData);
router.get('/session/:sessionId/records', verifyAuthToken, fetchSessionRecordsEndpoint);
router.get('/session/:sessionId/pdf', verifyAuthToken, downloadSessionPdf);

export default router;