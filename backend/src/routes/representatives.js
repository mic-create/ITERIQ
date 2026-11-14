import express from 'express';
import rateLimit from 'express-rate-limit';
import { registerRepresentative } from '../controllers/representatives.js';

const router = express.Router();

// Strict rate limiter for registration to prevent brute-force attacks on access codes
const regRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 registration requests per window
    message: { success: false, message: 'Too many registration attempts from this IP. Please try again later.' }
});

router.post('/register', regRateLimiter, registerRepresentative);

export default router;