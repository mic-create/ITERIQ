import { CONFIG } from '../config.js';
import { SessionManager } from './session.js';

export async function apiRequest(endpoint, options = {}) {
    const token = SessionManager.getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {})
    };

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (response.status === 401) {
            SessionManager.clearSession();
            window.location.hash = '/access/sign-in';
            throw new Error('Session expired. Please sign in again.');
        }

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'An error occurred during the request.');
        }
        return data;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
    }
}