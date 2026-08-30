/**
 * In-Site Notifications Manager
 */
const Notifications = {
  items: [],

  async init() {
    await this.fetchNotifications();
    this.setupEventListeners();
  },

  async fetchNotifications() {
    try {
      const data = await API.get('/notifications');
      this.items = Array.isArray(data) ? data : [];
      this.updateBadge();
    } catch (e) {
      console.warn('Could not fetch notifications:', e);
    }
  },

  updateBadge() {
    const unreadCount = this.items.filter(n => !n.isRead).length;
    const badge = document.getElementById('notifBadge');
    if (badge) {
      if (unreadCount > 0) {
        badge.innerText = unreadCount > 9 ? '9+' : unreadCount;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    }
  },

  toggleDropdown() {
    let dropdown = document.getElementById('notifDropdown');
    if (dropdown) {
      dropdown.remove();
      return;
    }

    const bellBtn = document.getElementById('notifBellBtn');
    if (!bellBtn) return;

    dropdown = document.createElement('div');
    dropdown.id = 'notifDropdown';
    dropdown.style.cssText = `
      position: absolute;
      top: 60px;
      right: 20px;
      width: 360px;
      max-height: 480px;
      background: #FFFFFF;
      border-radius: 10px;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1);
      border: 1px solid #E2E8F0;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: fadeIn 0.2s ease-out;
    `;

    const unread = this.items.filter(n => !n.isRead);

    dropdown.innerHTML = `
      <div style="padding:14px 18px; border-bottom:1px solid #E2E8F0; display:flex; justify-content:space-between; align-items:center; background:#F8FAFC;">
        <span style="font-weight:700; font-size:0.95rem; color:#0F172A;">Notifications (${unread.length} new)</span>
        <button id="markAllReadBtn" style="background:none; border:none; color:#2563EB; font-size:0.8rem; font-weight:600; cursor:pointer;">Mark all as read</button>
      </div>
      <div id="notifListContainer" style="overflow-y:auto; max-height:400px; padding:0;">
        ${this.renderList()}
      </div>
    `;

    document.body.appendChild(dropdown);

    // Close on outside click
    setTimeout(() => {
      const outsideClick = (e) => {
        if (!dropdown.contains(e.target) && !bellBtn.contains(e.target)) {
          dropdown.remove();
          document.removeEventListener('click', outsideClick);
        }
      };
      document.addEventListener('click', outsideClick);
    }, 50);

    dropdown.querySelector('#markAllReadBtn').onclick = async () => {
      await API.patch('/notifications/read-all');
      this.items.forEach(n => n.isRead = true);
      this.updateBadge();
      dropdown.querySelector('#notifListContainer').innerHTML = this.renderList();
    };
  },

  renderList() {
    if (this.items.length === 0) {
      return `<div style="padding:28px; text-align:center; color:#94A3B8; font-size:0.9rem;">No notifications right now.</div>`;
    }

    return this.items.map(item => {
      const typeIcons = {
        success: '🎉',
        warning: '⚠️',
        action_required: '📥',
        info: '🔔',
      };
      const icon = typeIcons[item.type] || '🔔';
      const bg = item.isRead ? '#FFFFFF' : '#F0F7FF';
      const base = Auth.getBaseUrl();
      const link = item.linkUrl ? `${base}${item.linkUrl}` : '#';

      return `
        <div onclick="Notifications.handleItemClick('${item.id}', '${link}')" style="padding:14px 18px; border-bottom:1px solid #F1F5F9; background:${bg}; cursor:pointer; transition:background 0.15s ease;" onmouseover="this.style.background='#F8FAFC'" onmouseout="this.style.background='${bg}'">
          <div style="display:flex; gap:10px; align-items:flex-start;">
            <span style="font-size:1.1rem; line-height:1.2;">${icon}</span>
            <div style="flex:1;">
              <div style="font-weight:600; font-size:0.88rem; color:#1E293B; margin-bottom:3px;">${item.title}</div>
              <div style="font-size:0.82rem; color:#475569; line-height:1.4;">${item.message}</div>
              <div style="font-size:0.75rem; color:#94A3B8; margin-top:6px;">${new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            ${!item.isRead ? `<span style="width:8px; height:8px; background:#2563EB; border-radius:50%; margin-top:4px;"></span>` : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  async handleItemClick(id, link) {
    await API.patch(`/notifications/${id}/read`);
    const n = this.items.find(item => item.id === id);
    if (n) n.isRead = true;
    this.updateBadge();
    const dd = document.getElementById('notifDropdown');
    if (dd) dd.remove();
    if (link && link !== '#') {
      window.location.href = link;
    }
  },

  setupEventListeners() {
    const bellBtn = document.getElementById('notifBellBtn');
    if (bellBtn) {
      bellBtn.onclick = () => this.toggleDropdown();
    }
  },
};

window.Notifications = Notifications;
