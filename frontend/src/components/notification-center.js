export function renderNotificationCenter(container) {
    container.innerHTML = `
        <div class="notification-list">
            <div class="notification-item">
                <div class="notif-dot"></div>
                <div class="notif-content">
                    <strong>Oluwaseun Adekunle signed attendance</strong>
                    <p style="font-size: 12px; color: var(--color-text-muted);">CSC 301 • Jeremiah Ojediran Hall • 2 mins ago</p>
                </div>
            </div>
            <div class="notification-item">
                <div class="notif-dot"></div>
                <div class="notif-content">
                    <strong>Folashade Adeleke signed attendance</strong>
                    <p style="font-size: 12px; color: var(--color-text-muted);">CSC 301 • Jeremiah Ojediran Hall • 5 mins ago</p>
                </div>
            </div>
            <div class="notification-item">
                <div class="notif-dot"></div>
                <div class="notif-content">
                    <strong>Chukwuma Obi signed attendance</strong>
                    <p style="font-size: 12px; color: var(--color-text-muted);">CSC 301 • Jeremiah Ojediran Hall • 12 mins ago</p>
                </div>
            </div>
        </div>
        <style>
            .notification-list { display: flex; flex-direction: column; gap: 12px; max-height: 320px; overflow-y: auto; }
            .notification-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px; background-color: var(--color-ivory); border-radius: 8px; border: 1px solid var(--color-border); }
            .notif-dot { width: 8px; height: 8px; background-color: var(--color-primary); border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
            .notif-content strong { font-size: 13px; color: var(--color-text); }
        </style>
    `;
}