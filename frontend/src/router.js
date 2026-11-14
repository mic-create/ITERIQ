import { SessionManager } from './core/session.js';
import { renderShell } from './shell/shell.js';
import { renderAuthPage } from './pages/auth.page.js';
import { renderDashboardPage } from './pages/dashboard.page.js';
import { renderAttendancePage } from './pages/attendance.page.js';
import { renderProfilePage } from './pages/profile.page.js';

export const Router = {
    init() {
        window.addEventListener('popstate', () => this.handleRoute());
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[data-link]');
            if (anchor) {
                e.preventDefault();
                this.navigateTo(anchor.getAttribute('href'));
            }
        });
        this.handleRoute();
    },

    navigateTo(path) {
        window.history.pushState({}, '', path);
        this.handleRoute();
    },

    handleRoute() {
        const path = window.location.pathname === '/' || window.location.pathname === '' ? '/access/sign-in' : window.location.pathname;
        const isAuthenticated = !!SessionManager.getToken();

        const appContainer = document.getElementById('app');
        appContainer.innerHTML = '';

        if (path.startsWith('/access/')) {
            if (isAuthenticated) {
                this.navigateTo('/portal/overview');
                return;
            }
            renderAuthPage(appContainer, path);
        } else if (path.startsWith('/portal/')) {
            if (!isAuthenticated) {
                this.navigateTo('/access/sign-in');
                return;
            }
            renderShell(appContainer, path);
        } else {
            this.navigateTo(isAuthenticated ? '/portal/overview' : '/access/sign-in');
        }
    }
};