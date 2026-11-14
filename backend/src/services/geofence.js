import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const locationsPath = path.join(__dirname, '../../data/campus_locations.json');

export function loadVenues() {
    try {
        const rawData = fs.readFileSync(locationsPath, 'utf8');
        const parsed = JSON.parse(rawData);
        return parsed.venues || [];
    } catch (err) {
        console.error('Failed to load campus locations JSON:', err);
        return [];
    }
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon1 - lon1) * Math.PI) / 180; // Note: fixed variable reference

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(((lon2 - lon1) * Math.PI) / 180) * Math.sin(((lon2 - lon1) * Math.PI) / 180);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

export function verifyGeofence(studentLat, studentLon, studentAccuracy, timestamp) {
    // 1. Freshness check (reject readings older than 60 seconds)
    if (timestamp && Date.now() - timestamp > 60000) {
        return { verified: false, message: 'GPS location reading is expired. Please refresh your location.' };
    }

    const venues = loadVenues();
    const matches = [];

    for (const venue of venues) {
        if (!venue.is_active || venue.latitude === null || venue.longitude === null) {
            continue; // Skip unconfigured or inactive venues
        }

        if (studentAccuracy > venue.max_gps_accuracy_meters) {
            continue; // Skip if accuracy is insufficient for this venue
        }

        const distance = calculateDistance(studentLat, studentLon, venue.latitude, venue.longitude);

        if (distance <= venue.permitted_radius_meters) {
            matches.push({ venue, distance });
        }
    }

    if (matches.length === 0) {
        return { verified: false, message: 'You are outside all approved Bells University lecture venue geofences.' };
    }

    if (matches.length > 1) {
        return { verified: false, message: 'Ambiguous location detected: overlapping geofence zones. Please move closer to the specific lecture venue.' };
    }

    return {
        verified: true,
        venue: matches[0].venue,
        distance: Math.round(matches[0].distance)
    };
}