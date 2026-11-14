import { SessionManager } from '../core/session.js';
import { renderAttendanceForm } from '../components/attendance-form.js';
import { renderCampusMap } from '../components/campus-map.js';

export function renderAttendancePage(container) {
    const user = SessionManager.getUser() || { role: 'STUDENT' };
    const isRep = user.role === 'COURSE_REPRESENTATIVE';

    container.innerHTML = `
        <div class="attendance-page-container">
            <div class="page-header">
                <h2>${isRep ? 'Attendance Registers & Verification Logs' : 'Campus Attendance Verification'}</h2>
                <p>${isRep ? 'Monitor student geofence submissions and retrieve official PDF registers.' : 'Verify your GPS location within approved Bells University lecture venues to sign attendance.'}</p>
            </div>
            ${isRep ? renderRepAttendanceView() : renderStudentAttendanceView()}
        </div>
        <style>
            .attendance-page-container { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
            .page-header h2 { font-family: var(--font-serif); font-size: 26px; font-weight: 700; color: var(--color-text); margin-bottom: 4px; }
            .page-header p { font-size: 14px; color: var(--color-text-muted); }
            .attendance-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
            @media (max-width: 900px) { .attendance-grid { grid-template-columns: 1fr; } }
        </style>
    `;

    if (isRep) {
        // Rep view bindings
    } else {
        renderAttendanceForm(document.getElementById('attendance-form-container'));
        renderCampusMap(document.getElementById('attendance-map-container'), { interactive: true });
    }
}

function renderStudentAttendanceView() {
    return `
        <div class="attendance-grid">
            <div id="attendance-form-container"></div>
            <div style="background: #fff; padding: 24px; border-radius: var(--radius-smooth); border: 1px solid var(--color-border); box-shadow: var(--shadow-subtle);">
                <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 16px;">Live Campus Geofence Map</h3>
                <div id="attendance-map-container" style="height: 400px; border-radius: 8px; overflow: hidden; border: 1px solid var(--color-border);"></div>
            </div>
        </div>
    `;
}

function renderRepAttendanceView() {
    return `
        <div style="background: #fff; padding: 32px; border-radius: var(--radius-smooth); border: 1px solid var(--color-border); box-shadow: var(--shadow-subtle);">
            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px;">Generated Course Registers</h3>
            <p style="font-size: 14px; color: var(--color-text-muted); margin-bottom: 24px;">Download certified A4 landscape attendance registers generated via Python ReportLab service.</p>
            <div style="padding: 20px; background-color: var(--color-ivory); border-radius: 8px; border: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>CSC 301 - Software Engineering Register</strong>
                    <p style="font-size: 12px; color: var(--color-text-muted); margin-top: 2px;">Session Date: Today • Total Students: 42</p>
                </div>
                <button class="btn-primary" style="padding: 8px 16px; font-size: 13px;">Download PDF Register</button>
            </div>
        </div>
    `;
}