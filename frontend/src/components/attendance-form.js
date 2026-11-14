import { LocationService } from '../core/location.js';

export function renderAttendanceForm(container) {
    container.innerHTML = `
        <div class="attendance-form-card">
            <h3>Sign Attendance</h3>
            <p style="font-size: 13px; color: var(--color-text-muted); margin-bottom: 20px;">Ensure you are physically present within the approved lecture venue geofence radius.</p>
            <form id="attendance-sign-form" style="display: flex; flex-direction: column; gap: 16px;">
                <div class="form-group">
                    <label>Active Course</label>
                    <select id="attendance-course" class="form-input">
                        <option value="CSC301">CSC 301 - Software Engineering</option>
                        <option value="CSC303">CSC 303 - Operating Systems</option>
                        <option value="MTS301">MTS 301 - Numerical Analysis</option>
                    </select>
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

    detectBtn.addEventListener('click', async () => {
        statusText.textContent = 'Detecting high-accuracy GPS position...';
        try {
            const pos = await LocationService.getCurrentPosition();
            statusText.innerHTML = `<strong>Location Acquired:</strong> Lat: ${pos.latitude.toFixed(4)}, Lon: ${pos.longitude.toFixed(4)} <br><span style="color: var(--color-success); font-weight: 600;">GPS Accuracy: ±${pos.accuracy.toFixed(1)}m (Accepted)</span>`;
            detectBtn.style.backgroundColor = 'var(--color-success)';
            detectBtn.textContent = 'Location Verified';
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        } catch (err) {
            statusText.innerHTML = `<span style="color: var(--color-error); font-weight: 600;">${err.message}</span>`;
            detectBtn.style.backgroundColor = 'var(--color-error)';
        }
    });

    document.getElementById('attendance-sign-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Attendance submission prepared for backend validation contract.');
    });
}