import { SessionManager } from '../core/session.js';
import { renderAttendanceForm } from '../components/attendance-form.js';
import { renderCampusMap } from '../components/campus-map.js';
import { apiRequest } from '../core/api.js';
import { CONFIG } from '../config.js';

export async function renderAttendancePage(container) {
    const user = SessionManager.getUser() || { role: 'STUDENT' };
    const isRep = user.role === 'COURSE_REPRESENTATIVE';

    container.innerHTML = `
        <div class="attendance-page-container">
            <div class="page-header">
                <h2>${isRep ? 'Attendance Registers & Session Logs' : 'Campus Attendance Verification'}</h2>
                <p>${isRep ? 'Manage sessions and retrieve official certified attendance registers.' : 'Verify your GPS location within approved Bells University lecture venues to sign attendance.'}</p>
            </div>
            <div id="attendance-dynamic-content">Loading...</div>
        </div>
        <style>
            .attendance-page-container { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
            .page-header h2 { font-family: var(--font-serif); font-size: 26px; font-weight: 700; color: var(--color-text); margin-bottom: 4px; }
            .page-header p { font-size: 14px; color: var(--color-text-muted); }
            .attendance-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
            @media (max-width: 900px) { .attendance-grid { grid-template-columns: 1fr; } }
        </style>
    `;

    const dynContainer = document.getElementById('attendance-dynamic-content');

    if (isRep) {
        try {
            const data = await apiRequest('/attendance/representative/dashboard');
            const sessions = data.sessions || [];

            dynContainer.innerHTML = `
                <div style="background: #fff; padding: 32px; border-radius: var(--radius-smooth); border: 1px solid var(--color-border); box-shadow: var(--shadow-subtle);">
                    <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px;">Course: ${data.representative.course_code} (${data.representative.academic_level})</h3>
                    <p style="font-size: 14px; color: var(--color-text-muted); margin-bottom: 24px;">Select an attendance session to view the student roster or download the official PDF register.</p>
                    
                    ${sessions.length === 0 ? '<p style="color: var(--color-text-muted);">No attendance sessions created yet.</p>' : `
                        <div style="display: flex; flex-direction: column; gap: 12px;" id="sessions-list-container">
                            ${sessions.map(s => `
                                <div style="padding: 16px; background-color: var(--color-ivory); border-radius: 8px; border: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <strong>${s.course_title}</strong>
                                        <p style="font-size: 12px; color: var(--color-text-muted); margin-top: 2px;">Date: ${new Date(s.created_at).toLocaleDateString()} • Venue ID: ${s.venue_id}</p>
                                    </div>
                                    <div style="display: flex; gap: 10px;">
                                        <button class="btn-primary view-session-btn" data-session-id="${s.id}" style="padding: 8px 16px; font-size: 13px;">View Roster</button>
                                        <button class="btn-secondary download-pdf-btn" data-session-id="${s.id}" style="padding: 8px 16px; font-size: 13px; background-color: var(--color-bronze); color: #fff; border: none; border-radius: 8px; cursor: pointer;">Download PDF</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                    <div id="session-roster-container" style="margin-top: 32px;"></div>
                </div>
            `;

            // View Roster Handler
            document.querySelectorAll('.view-session-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const sessionId = e.target.getAttribute('data-session-id');
                    const rosterContainer = document.getElementById('session-roster-container');
                    rosterContainer.innerHTML = '<p>Loading session roster...</p>';
                    try {
                        const res = await apiRequest(`/attendance/session/${sessionId}/records`);
                        const records = res.records || [];
                        rosterContainer.innerHTML = `
                            <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Session Roster (${records.length} Students Signed)</h4>
                            ${records.length === 0 ? '<p>No students recorded for this session.</p>': `
                                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                                    <thead>
                                        <tr style="background: var(--color-primary-dark); color: #fff; text-align: left;">
                                            <th style="padding: 10px;">S/N</th>
                                            <th style="padding: 10px;">Full Name</th>
                                            <th style="padding: 10px;">Matric Number</th>
                                            <th style="padding: 10px;">Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${records.map((r, idx) => `
                                            <tr style="border-bottom: 1px solid var(--color-border);">
                                                <td style="padding: 10px;">${idx + 1}</td>
                                                <td style="padding: 10px;">${r.profiles?.full_name || 'N/A'}</td>
                                                <td style="padding: 10px;">${r.students?.matric_number || 'N/A'}</td>
                                                <td style="padding: 10px;">${new Date(r.verified_at).toLocaleTimeString()}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            `}
                        `;
                    } catch (err) {
                        rosterContainer.innerHTML = `<p style="color: var(--color-error);">${err.message}</p>`;
                    }
                });
            });

            // Download PDF Handler
            document.querySelectorAll('.download-pdf-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const sessionId = e.target.getAttribute('data-session-id');
                    const token = SessionManager.getToken();
                    btn.textContent = 'Generating PDF...';
                    btn.disabled = true;

                    try {
                        const response = await fetch(`${CONFIG.API_BASE_URL}/attendance/session/${sessionId}/pdf`, {
                            method: 'GET',
                            headers: { 'Authorization': `Bearer ${token}` }
                        });

                        if (!response.ok) {
                            const errData = await response.json();
                            throw new Error(errData.message || 'Failed to download PDF');
                        }

                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `ITERIQ_Register_${sessionId.slice(0, 8)}.pdf`;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        window.URL.revokeObjectURL(url);
                        btn.textContent = 'Download PDF';
                        btn.disabled = false;
                    } catch (err) {
                        alert(`PDF Download Failed: ${err.message}`);
                        btn.textContent = 'Download PDF';
                        btn.disabled = false;
                    }
                });
            });

        } catch (err) {
            dynContainer.innerHTML = `<p style="color: var(--color-error);">${err.message}</p>`;
        }
    } else {
        dynContainer.innerHTML = `
            <div class="attendance-grid">
                <div id="attendance-form-container"></div>
                <div style="background: #fff; padding: 24px; border-radius: var(--radius-smooth); border: 1px solid var(--color-border); box-shadow: var(--shadow-subtle);">
                    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 16px;">Live Campus Geofence Map</h3>
                    <div id="attendance-map-container" style="height: 400px; border-radius: 8px; overflow: hidden; border: 1px solid var(--color-border);"></div>
                </div>
            </div>
        `;
        renderAttendanceForm(document.getElementById('attendance-form-container'));
        renderCampusMap(document.getElementById('attendance-map-container'), { interactive: true });
    }
}