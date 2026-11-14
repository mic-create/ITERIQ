import { calculateDistance, verifyGeofence } from '../backend/src/services/geofence.js';

describe('ITERIQ Geofencing & Distance Engine', () => {
    test('calculateDistance returns correct approximate distance in meters', () => {
        // Two known coordinates with a small delta
        const lat1 = 6.684387;
        const lon1 = 3.173601;
        const lat2 = 6.684487;
        const lon2 = 3.173701;

        const dist = calculateDistance(lat1, lon1, lat2, lon2);
        expect(dist).toBeGreaterThan(0);
        expect(dist).toBeLessThan(50);
    });

    test('verifyGeofence rejects expired GPS readings', () => {
        const expiredTimestamp = Date.now() - 70000; // 70 seconds old
        const result = verifyGeofence(6.684387, 3.173601, 5, expiredTimestamp);
        expect(result.verified).toBe(false);
        expect(result.message).toContain('expired');
    });

    test('verifyGeofence rejects poor GPS accuracy', () => {
        const freshTimestamp = Date.now();
        // Accuracy 30m exceeds max_gps_accuracy_meters (15m) for Jeremiah Ojediran Hall
        const result = verifyGeofence(6.684387, 3.173601, 30, freshTimestamp);
        expect(result.verified).toBe(false);
        expect(result.message).toContain('outside all approved');
    });
});