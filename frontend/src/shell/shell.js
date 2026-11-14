import { SessionManager } from '../core/session.js';
import { AuthService } from '../core/auth.js';
import { renderDashboardPage } from '../pages/dashboard.page.js';
import { renderAttendancePage } from '../pages/attendance.page.js';
import { renderProfilePage } from '../pages/profile.page.js';

export function renderShell(container, currentPath) {
    const user = SessionManager.getUser() || { full_name: 'Bells Scholar', role: 'STUDENT', academic_level: '300 Level' };

    container.innerHTML = `
        <div class="iteriq-shell">
            <aside class="iteriq-sidebar">
                <div class="sidebar-brand">
                    <div class="brand-mark-placeholder">ITERIQ</div>
                    <span class="brand-subtitle">Bells University</span>
                </div>
                <nav class="sidebar-nav">
                    <a href="/portal/overview" data-link class="nav-item ${currentPath === '/portal/overview' ? 'active' : ''}">
                        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                        Dashboard
                    </a>
                    <a href="/portal/attendance" data-link class="nav-item ${currentPath === '/portal/attendance' ? 'active' : ''}">
                        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                        Attendance
                    </a>
                    <a href="/portal/profile" data-link class="nav-item ${currentPath === '/portal/profile' ? 'active' : ''}">
                        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                        Profile
                    </a>
                </nav>
                <div class="sidebar-footer">
                    <div class="user-mini-card">
                        <div class="user-avatar">${user.full_name.charAt(0)}</div>
                        <div class="user-meta">
                            <span class="user-name">${user.full_name}</span>
                            <span class="user-role">${user.role === 'COURSE_REPRESENTATIVE' ? 'Course Rep' : user.academic_level}</span>
                        </div>
                    </div>
                    <button id="logout-btn" class="logout-btn" title="Sign Out">
                        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    </button>
                </div>
            </aside>
            <main class="iteriq-main-content">
                <header class="content-topbar">
                    <div class="topbar-title">Bells University of Technology — Attendance Verification</div>
                    <div class="topbar-badge">${user.role === 'COURSE_REPRESENTATIVE' ? 'Representative Portal' : 'Student Portal'}</div>
                </header>
                <div id="page-content-outlet" class="page-content-outlet"></div>
            </main>
        </div>
        <style>
            .iteriq-shell { display: flex; height: 100vh; background-color: var(--color-ivory); overflow: hidden; }
            .iteriq-sidebar { width: 280px; background-color: var(--color-primary-dark); color: #fff; display: flex; flex-direction: column; border-right: 1px solid rgba(255,255,255,0.08); z-index: 10; }
            .sidebar-brand { padding: 32px 24px; border-bottom: 1px solid rgba(255,255,255,0.08); }
            .brand-mark-placeholder { font-family: var(--font-serif); font-size: 28px; font-weight: 700; letter-spacing: 2px; color: #fff; }
            .brand-subtitle { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--color-bronze); opacity: 0.9; margin-top: 4px; display: block; }
            .sidebar-nav { padding: 24px 16px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
            .nav-item { display: flex; align-items: center; gap: 14px; padding: 12px 16px; color: rgba(255,255,255,0.7); text-decoration: none; font-size: 14px; font-weight: 500; border-radius: var(--radius-smooth); transition: var(--transition-smooth); }
            .nav-item:hover, .nav-item.active { background-color: rgba(255,255,255,0.08); color: #fff; }
            .nav-item.active { background-color: var(--color-primary-light); }
            .sidebar-footer { padding: 20px 24px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between; }
            .user-mini-card { display: flex; align-items: center; gap: 12px; }
            .user-avatar { width: 36px; height: 36px; background-color: var(--color-bronze); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; }
            .user-meta { display: flex; flex-direction: column; }
            .user-name { font-size: 13px; font-weight: 600; color: #fff; max-width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .user-role { font-size: 11px; color: rgba(255,255,255,0.6); }
            .logout-btn { background: none; border: none; color: rgba(255,255,255,0.6); cursor: pointer; padding: 8px; border-radius: 6px; transition: var(--transition-smooth); }
            .logout-btn:hover { color: #fff; background-color: rgba(229,62,62,0.2); }
            .iteriq-main-content { flex: 1; display: flex; flex-direction: column; overflow-y: auto; }
            .content-topbar { height: 72px; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; background-color: #fff; border-bottom: 1px solid var(--color-border); }
            .topbar-title { font-size: 14px; font-weight: 600; color: var(--color-text); }
            .topbar-badge { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; padding: 6px 12px; background-color: var(--color-ivory-card); color: var(--color-primary); border-radius: 20px; border: 1px solid var(--color-border); }
            .page-content-outlet { flex: 1; padding: 40px; background-color: var(--color-ivory); }
            @media (max-width: 768px) {
                .iteriq-shell { flex-direction: column; }
                .iteriq-sidebar { width: 100%; height: auto; }
                .sidebar-nav { flex-direction: row; justify-content: space-around; padding: 12px; }
                .sidebar-footer, .sidebar-brand { display: none; }
                .content-topbar { padding: 0 20px; height: 60px; }
                .page-content-outlet { padding: 20px; }
            }
        </style>
    `;

    document.getElementById('logout-btn').addEventListener('click', () => AuthService.logout());

    const outlet = document.getElementById('page-content-outlet');
    if (currentPath === '/portal/overview') renderDashboardPage(outlet);
    else if (currentPath === '/portal/attendance') renderAttendancePage(outlet);
    else if (currentPath === '/portal/profile') renderProfilePage(outlet);
}