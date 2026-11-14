import { SessionManager } from '../core/session.js';
import { AuthService } from '../core/auth.js';

export function renderProfilePage(container) {
    const user = SessionManager.getUser() || { full_name: 'Bells Scholar', email: 'scholar@bellsuniversity.edu.ng', role: 'STUDENT', academic_level: '300 Level', matric_number: 'BU/22/CSC/1092' };
    const isRep = user.role === 'COURSE_REPRESENTATIVE';

    container.innerHTML = `
        <div class="profile-container">
            <div class="profile-header-card">
                <div class="profile-avatar-large">${user.full_name.charAt(0)}</div>
                <div class="profile-header-info">
                    <h2>${user.full_name}</h2>
                    <p>${isRep ? 'Course Representative' : 'Student'} • ${user.academic_level}</p>
                </div>
            </div>
            
            <div class="profile-details-card">
                <h3>Account Information</h3>
                <div class="detail-row">
                    <span class="detail-label">University Email</span>
                    <span class="detail-value">${user.email}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">${isRep ? 'Course Represented' : 'Matriculation Number'}</span>
                    <span class="detail-value">${isRep ? user.course_represented : user.matric_number}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Institution</span>
                    <span class="detail-value">Bells University of Technology, Ota</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">System Role</span>
                    <span class="detail-value">${user.role}</span>
                </div>
            </div>

            <div class="profile-actions-card">
                <h3>Security & Session</h3>
                <div style="display: flex; gap: 16px; margin-top: 16px;">
                    <button id="profile-logout-btn" class="btn-secondary" style="padding: 10px 20px; border-radius: 8px; border: 1px solid var(--color-border); background: #fff; font-weight: 600; cursor: pointer;">Sign Out</button>
                    <button id="profile-delete-btn" class="btn-danger" style="padding: 10px 20px; border-radius: 8px; border: 1px solid var(--color-error); background: #fff; color: var(--color-error); font-weight: 600; cursor: pointer;">Delete Account</button>
                </div>
            </div>
        </div>
        <style>
            .profile-container { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
            .profile-header-card { background: #fff; padding: 32px; border-radius: var(--radius-smooth); border: 1px solid var(--color-border); display: flex; align-items: center; gap: 24px; box-shadow: var(--shadow-subtle); }
            .profile-avatar-large { width: 72px; height: 72px; background-color: var(--color-primary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; font-family: var(--font-serif); }
            .profile-header-info h2 { font-family: var(--font-serif); font-size: 24px; font-weight: 700; color: var(--color-text); margin-bottom: 4px; }
            .profile-header-info p { font-size: 14px; color: var(--color-text-muted); }
            .profile-details-card, .profile-actions-card { background: #fff; padding: 32px; border-radius: var(--radius-smooth); border: 1px solid var(--color-border); box-shadow: var(--shadow-subtle); }
            .profile-details-card h3, .profile-actions-card h3 { font-size: 16px; font-weight: 600; color: var(--color-text); margin-bottom: 20px; }
            .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--color-border); font-size: 14px; }
            .detail-row:last-child { border-bottom: none; }
            .detail-label { color: var(--color-text-muted); font-weight: 500; }
            .detail-value { color: var(--color-text); font-weight: 600; }
        </style>
    `;

    document.getElementById('profile-logout-btn').addEventListener('click', () => AuthService.logout());
    document.getElementById('profile-delete-btn').addEventListener('click', () => alert('Account deletion requires administrative authorization.'));
}