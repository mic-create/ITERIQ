import { SessionManager } from '../core/session.js';
import { renderCampusMap } from '../components/campus-map.js';
import { renderNotificationCenter } from '../components/notification-center.js';

export function renderDashboardPage(container) {
    const user = SessionManager.getUser() || { full_name: 'Bells Scholar', role: 'STUDENT', academic_level: '300 Level' };
    const isRep = user.role === 'COURSE_REPRESENTATIVE';

    container.innerHTML = `
        <div class="dashboard-grid">
            <div class="welcome-banner">
                <div class="welcome-text">
                    <h1>Welcome back, ${user.full_name}</h1>
                    <p>${isRep ? `Course Representative — ${user.course_represented || 'CSC 301'}` : `${user.academic_level} • Matric: ${user.matric_number || 'BU/22/CSC/1092'}`}</p>
                </div>
                <div class="institution-badge">Bells University of Technology</div>
            </div>

            ${isRep ? renderRepDashboardContent() : renderStudentDashboardContent()}
        </div>
        <style>
            .dashboard-grid { display: flex; flex-direction: column; gap: 24px; max-width: 1200px; margin: 0 auto; }
            .welcome-banner { background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary)); color: #fff; padding: 32px; border-radius: var(--radius-smooth); display: flex; justify-content: space-between; align-items: center; box-shadow: var(--shadow-card); }
            .welcome-text h1 { font-family: var(--font-serif); font-size: 28px; font-weight: 700; margin-bottom: 6px; }
            .welcome-text p { font-size: 14px; opacity: 0.85; }
            .institution-badge { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; background-color: rgba(255,255,255,0.15); padding: 8px 16px; border-radius: 20px; font-weight: 600; border: 1px solid rgba(255,255,255,0.2); }
            .dash-content-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
            .dash-card { background: #fff; padding: 24px; border-radius: var(--radius-smooth); border: 1px solid var(--color-border); box-shadow: var(--shadow-subtle); }
            .dash-card h3 { font-size: 16px; font-weight: 600; color: var(--color-text); margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; }
            @media (max-width: 900px) { .dash-content-grid { grid-template-columns: 1fr; } }
        </style>
    `;

    if (isRep) {
        renderNotificationCenter(document.getElementById('rep-notifications-container'));
    } else {
        renderCampusMap(document.getElementById('map-preview-container'), { interactive: false });
    }
}

function renderStudentDashboardContent() {
    return `
        <div class="dash-content-grid">
            <div class="dash-card">
                <h3>Campus Geofence Location Preview</h3>
                <div id="map-preview-container" style="height: 320px; border-radius: 8px; overflow: hidden; border: 1px solid var(--color-border);"></div>
            </div>
            <div class="dash-card">
                <h3>Today's Attendance</h3>
                <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 12px;">
                    <div style="padding: 16px; background-color: var(--color-ivory); border-radius: 8px; border-left: 4px solid var(--color-primary);">
                        <strong style="font-size: 14px; color: var(--color-primary);">CSC 301 - Software Engineering</strong>
                        <p style="font-size: 12px; color: var(--color-text-muted); margin-top: 4px;">Venue: Jeremiah Ojediran Hall</p>
                        <span style="display: inline-block; margin-top: 8px; font-size: 11px; font-weight: 600; color: var(--color-success); background: #e6f4ea; padding: 2px 8px; border-radius: 4px;">Verified Present</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderRepDashboardContent() {
    return `
        <div class="dash-content-grid">
            <div class="dash-card">
                <h3>Recent Attendance Submissions</h3>
                <div id="rep-notifications-container"></div>
            </div>
            <div class="dash-card">
                <h3>Official Register PDF Export</h3>
                <p style="font-size: 13px; color: var(--color-text-muted); margin-bottom: 16px;">Generate and retrieve publication-grade attendance registers for your course.</p>
                <a href="/portal/attendance" data-link style="display: block; text-align: center; padding: 12px; background-color: var(--color-primary); color: #fff; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 14px;">Access PDF Registers</a>
            </div>
        </div>
    `;
}