/**
 * Dynamic Topbar Header with Officer Badges, Notification Bell & Logout
 */
const Topbar = {
  render() {
    const container = document.getElementById('topbarContainer');
    if (!container) return;

    const user = Auth.getCurrentUser();
    if (!user) return;

    const designationBadge = user.designation || (user.adminTier ? `${user.adminTier} Admin` : 'Citizen');
    const jurisdictionBadge = user.jurisdictionMandalOrWard ? `${user.jurisdictionMandalOrWard}, ${user.stateCode}` : `${user.stateCode}`;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; width:100%; padding:14px 28px; background:#FFFFFF; border-bottom:1px solid #E2E8F0; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
        <!-- Left: Search / Breadcrumb / Title -->
        <div style="display:flex; align-items:center; gap:16px;">
          <span style="font-size:1.1rem; font-weight:700; color:#0F172A;">DigiConnect Unified Platform</span>
          <span style="background:#EFF6FF; color:#2563EB; font-size:0.75rem; font-weight:700; padding:3px 10px; border-radius:20px; text-transform:uppercase;">
            ${user.stateCode} Portal
          </span>
        </div>

        <!-- Right: Profile Info, Badges & Notification Bell -->
        <div style="display:flex; align-items:center; gap:20px;">
          <!-- Notification Bell -->
          <div style="position:relative;">
            <button id="notifBellBtn" style="background:none; border:none; cursor:pointer; font-size:1.25rem; display:flex; align-items:center; justify-content:center; width:38px; height:38px; border-radius:50%; background:#F1F5F9; color:#475569; position:relative;">
              🔔
              <span id="notifBadge" style="display:none; position:absolute; top:-2px; right:-2px; background:#EF4444; color:#FFF; font-size:0.65rem; font-weight:700; width:18px; height:18px; border-radius:50%; align-items:center; justify-content:center; border:2px solid #FFF;"></span>
            </button>
          </div>

          <!-- User Badges -->
          <div style="text-align:right;">
            <div style="font-size:0.9rem; font-weight:700; color:#0F172A;">${user.fullName}</div>
            <div style="display:flex; gap:6px; justify-content:flex-end; margin-top:2px;">
              <span style="background:#F8FAFC; border:1px solid #CBD5E1; color:#334155; font-size:0.72rem; font-weight:600; padding:1px 8px; border-radius:12px;">
                ${designationBadge}
              </span>
              <span style="background:#ECFDF5; border:1px solid #A7F3D0; color:#065F46; font-size:0.72rem; font-weight:600; padding:1px 8px; border-radius:12px;">
                📍 ${jurisdictionBadge}
              </span>
            </div>
          </div>

          <!-- Logout Button -->
          <button onclick="Auth.logout()" class="btn btn-outline" style="padding:7px 14px; font-size:0.82rem; font-weight:600; border:1px solid #E2E8F0; background:#FFF; border-radius:6px; cursor:pointer; color:#EF4444;" title="Sign out">
            Sign Out
          </button>
        </div>
      </div>
    `;

    // Initialize notification listeners
    if (window.Notifications) {
      Notifications.init();
    }
  },
};

window.Topbar = Topbar;
