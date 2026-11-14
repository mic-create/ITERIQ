import { LocationService } from '../core/location.js';
import { apiRequest } from '../core/api.js';
import { SessionManager } from '../core/session.js';

export function renderAttendanceForm(container) {
    const user = SessionManager.getUser() || {};

    container.innerHTML = `
        <div class="attendance-form-card">
            <h3>Sign Attendance</h3>
            <p style="font-size: 13px; color: var(--color-text-muted); margin-bottom: 20px;">Your location is verified against approved Bells University lecture venue geofences.</p>
            <form id="attendance-sign-form" style="display: flex; flex-direction: column; gap: 16px;">
                <div class="form-group">
                    <label>Student Name (Verified Profile)</label>
                    <input type="text" class="form-input" value="${user.full_name || ''}" disabled style="background: #f0f4f1;" />
                </div>
                <div class="form-group">
                    <label>Matriculation Number</label>
                    <input type="text" class="form-input" value="${user.matric_number || ''}" disabled style="background: #f0f4f1;" />
                </div>
                <div class="form-group">
                    <label>Academic Level</label>
                    <input type="text" class="form-input" value="${user.academic_level || '300 Level'}" disabled style="background: #f0f4f1;" />
                </div>
                <div class="form-group">
                    <label>Course Code (e.g. CSC 301)</label>
                    <input type="text" id="attendance-course-code" class="form-input" placeholder="CSC 301" required />
                </div>
                <div id="location-status-box" style="padding: 14px; background-color: var(--color-ivory); border-radius: 8px; border: 1px solid var(--color-border); font-size: 13px;">
                    <span id="loc-status-text">GPS Location not yet acquired.</span>
                </div>
                <button type="button" id="detect-location-btn" class="btn-primary" style="background-color: var(--color-bronze);">Detect Current Location</button>
                <button type="submit" id="submit-attendance-btn" class="btn-primary" disabled style="opacity: 0.6; cursor: not-allowed;">Sign Attendance</button>
            </form>
        </div>
        <style>
            .attendance-form-card { background: #fff; padding: 24px; border-radius: var(--radius-smooth); border: 1px solid var(--color-border); box-shadow: var(--shadow-subtle); }
            .attendance-form-card h3 { font-size: 16px; font-weight: 600; margin-bottom: 6px; color: var(--color-text); }
        </style>
    `;

    const detectBtn = document.getElementById('detect-location-btn');
    const submitBtn = document.getElementById('submit-attendance-btn');
    const statusText = document.getElementById('loc-status-text');

    let acquiredPosition = null;

    detectBtn.addEventListener('click', async () => {
        statusText.textContent = 'Detecting high-accuracy GPS position...';
        try {
            const pos = await LocationService.getCurrentPosition();
            acquiredPosition = { ...pos, timestamp: Date.now() };
            statusText.innerHTML = `<strong>Location Acquired:</strong> Lat: ${pos.latitude.toFixed(4)}, Lon: ${pos.longitude.toFixed(4)} <br><span style="color: var(--color-success); font-weight: 600;">GPS Accuracy: ±${pos.accuracy.toFixed(1)}m (Fresh & Ready)</span>`;
            detectBtn.style.backgroundColor = 'var(--color-success)';
            detectBtn.textContent = 'Location Verified Locally';
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        } catch (err) {
            statusText.innerHTML = `<span style="color: var(--color-error); font-weight: 600;">${err.message}</span>`;
            detectBtn.style.backgroundColor = 'var(--color-error)';
        }
    });

    document.getElementById('attendance-sign-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!acquiredPosition) return;

        const courseCode = document.getElementById('attendance-course-code').value.trim();
        const academicLevel = user.academic_level || '300 Level';

        submitBtn.disabled = true;
        submitBtn.textContent = 'Verifying Geofence & Registering...';

        try {
            const response = await apiRequest('/attendance/verify', {
                method: 'POST',
                body: JSON.stringify({
                    courseCode,
                    academicLevel,
                    latitude: acquiredPosition.latitude,
                    longitude: acquiredPosition.longitude,
                    accuracy: acquiredPosition.accuracy,
                    timestamp: acquiredPosition.timestamp
                })
            });

            alert(`Success! Venue verified: ${response.venue} (${response.distanceMeters}m away). Attendance recorded for ${response.courseCode}.`);
            submitBtn.textContent = 'Attendance Recorded Successfully';
        } catch (err) {
            alert(`Verification Failed: ${err.message}`);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign Attendance';
        }
    });
}