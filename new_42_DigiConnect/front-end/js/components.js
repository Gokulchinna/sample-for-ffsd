/**
 * Reusable UI Components: Modals, Toasts, Badges, Confirm Dialogs
 */
const Components = {
  showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 99999;
      `;
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bgColors = {
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      info: '#3B82F6',
    };

    toast.style.cssText = `
      background: ${bgColors[type] || '#1E293B'};
      color: #FFFFFF;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      gap: 12px;
      animation: slideUp 0.3s ease-out;
    `;

    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  },

  showModal({ title, content, onConfirm, confirmText = 'Confirm' }) {
    const existing = document.getElementById('globalModalOverlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'globalModalOverlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 20px;
    `;

    overlay.innerHTML = `
      <div style="background:#FFFFFF; width:100%; max-width:520px; border-radius:12px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25); overflow:hidden;">
        <div style="padding:20px 24px; border-bottom:1px solid #E2E8F0; display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0; font-size:1.15rem; font-weight:700; color:#0F172A;">${title}</h3>
          <button id="modalCloseBtn" style="background:none; border:none; font-size:1.4rem; color:#64748B; cursor:pointer;">&times;</button>
        </div>
        <div style="padding:24px; font-size:0.95rem; color:#334155; line-height:1.6;">
          ${content}
        </div>
        <div style="padding:16px 24px; background:#F8FAFC; border-top:1px solid #E2E8F0; display:flex; justify-content:flex-end; gap:12px;">
          <button id="modalCancelBtn" class="btn btn-outline" style="padding:8px 16px; border:1px solid #CBD5E1; background:#fff; border-radius:6px; cursor:pointer;">Cancel</button>
          <button id="modalConfirmBtn" class="btn btn-primary" style="padding:8px 18px; background:#2563EB; color:#fff; border:none; border-radius:6px; font-weight:600; cursor:pointer;">${confirmText}</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    overlay.querySelector('#modalCloseBtn').onclick = close;
    overlay.querySelector('#modalCancelBtn').onclick = close;
    overlay.querySelector('#modalConfirmBtn').onclick = async () => {
      if (onConfirm) await onConfirm();
      close();
    };
  },
};

window.Components = Components;
