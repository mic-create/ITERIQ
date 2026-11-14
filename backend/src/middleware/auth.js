import { supabaseClient } from '../services/supabase.js';

export async function verifyAuthToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Access token missing or malformed.' });
        }

        const token = authHeader.split(' ')[1];
        const { data: { user }, error } = await supabaseClient.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('Auth Middleware Error:', err);
        return res.status(500).json({ success: false, message: 'Internal server authentication error.' });
    }
}