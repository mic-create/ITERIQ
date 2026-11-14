export function renderNotificationCenter(container, notifications = []) {
    if (!notifications || notifications.length === 0) {
        container.innerHTML = `<p style="font-size: 13px; color: var(--color-text-muted); padding: 12px;">No attendance submissions received yet.</p>`;
        return;
    }

    container.innerHTML = `
        <div class="notification-list">
            ${notifications.map(n => `
                <div class="notification-item">
                    <div class="notif-dot"></div>
                    <div class="notif-content">
                        <strong>${n.studentName} (${n.matricNumber})</strong>
                        <p style="font-size: 12px; color: var(--color-text-muted);">Signed ${n.courseCode} • ${n.venueName} • ${new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>
            `).join('')}
        </div>
        <style>
            .notification-list { display: flex; flex-direction: column; gap: 12px; max-height: 360px; overflow-y: auto; }
            .notification-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px; background-color: var(--color-ivory); border-radius: 8px; border: 1px solid var(--color-border); }
            .notif-dot { width: 8px; height: 8px; background-color: var(--color-primary); border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
            .notif-content strong { font-size: 13px; color: var(--color-text); }
        </style>
    `;
}