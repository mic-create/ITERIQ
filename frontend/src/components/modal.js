export function renderModal(title, contentHTML, onClose) {
    const modalEl = document.createElement('div');
    modalEl.className = 'iteriq-modal-overlay';
    modalEl.innerHTML = `
        <div class="iteriq-modal-card">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close-btn">&times;</button>
            </div>
            <div class="modal-body">${contentHTML}</div>
        </div>
        <style>
            .iteriq-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
            .iteriq-modal-card { background: #fff; width: 90%; max-width: 600px; border-radius: var(--radius-smooth); overflow: hidden; box-shadow: var(--shadow-card); }
            .modal-header { padding: 20px 24px; background: var(--color-primary-dark); color: #fff; display: flex; justify-content: space-between; align-items: center; }
            .modal-header h3 { font-size: 16px; font-weight: 600; }
            .modal-close-btn { background: none; border: none; color: #fff; font-size: 24px; cursor: pointer; }
            .modal-body { padding: 24px; max-height: 70vh; overflow-y: auto; }
        </style>
    `;

    document.body.appendChild(modalEl);
    modalEl.querySelector('.modal-close-btn').addEventListener('click', () => {
        modalEl.remove();
        if (onClose) onClose();
    });
}