/**
 * Dynamic Sidebar Navigation Builder based on User Role & Designation
 */
const Sidebar = {
  render(activePage = '') {
    const container = document.getElementById('sidebarNavContainer');
    if (!container) return;

    const user = Auth.getCurrentUser();
    if (!user) return;

    const base = Auth.getBaseUrl();
    let menuItems = [];

    if (user.role === 'citizen') {
      menuItems = [
        { label: 'Dashboard', url: `${base}citizen/citizen-dashboard.html`, icon: '📊', id: 'dashboard' },
        { label: 'Apply Service', url: `${base}citizen/apply-service.html`, icon: '📝', id: 'apply' },
        { label: 'My Applications', url: `${base}citizen/my-applications.html`, icon: '📋', id: 'my-applications' },
        { label: 'Track Application', url: `${base}citizen/track-application.html`, icon: '🔍', id: 'track' },
        { label: 'Raise Grievance', url: `${base}citizen/raise-grievance.html`, icon: '⚖️', id: 'raise-grievance' },
        { label: 'My Grievances', url: `${base}citizen/my-grievances.html`, icon: '💬', id: 'my-grievances' },
        { label: 'Certificates Vault', url: `${base}citizen/certificates.html`, icon: '📜', id: 'certificates' },
        { label: 'My Profile', url: `${base}profile.html`, icon: '👤', id: 'profile' },
      ];
    } else if (user.role === 'officer') {
      menuItems = [
        { label: 'Workload Dashboard', url: `${base}officer/officer-dashboard.html`, icon: '📊', id: 'dashboard' },
        { label: 'Application Queue', url: `${base}officer/queue.html`, icon: '📥', id: 'queue' },
        { label: 'Citizen Queries', url: `${base}officer/queries.html`, icon: '💬', id: 'queries' },
        { label: 'My Profile', url: `${base}profile.html`, icon: '👤', id: 'profile' },
      ];

      if (user.designationId === 'DESIG-GRIEVANCE-OFFICER') {
        menuItems.splice(2, 0, {
          label: 'Grievances Desk',
          url: `${base}grievance/grievance-dashboard.html`,
          icon: '⚖️',
          id: 'grievance',
        });
      }
    } else if (user.role === 'admin') {
      if (user.adminTier === 'CENTRAL') {
        menuItems = [
          { label: 'National Dashboard', url: `${base}admin/central/dashboard.html`, icon: '🇮🇳', id: 'dashboard' },
          { label: 'State Onboarding', url: `${base}admin/central/state-onboarding.html`, icon: '🏢', id: 'states' },
          { label: 'My Profile', url: `${base}profile.html`, icon: '👤', id: 'profile' },
        ];
      } else if (user.adminTier === 'STATE') {
        menuItems = [
          { label: 'State Dashboard', url: `${base}admin/state/dashboard.html`, icon: '🏛️', id: 'dashboard' },
          { label: 'Line Departments', url: `${base}admin/state/dept-onboarding.html`, icon: '📁', id: 'departments' },
          { label: 'Geography Masters', url: `${base}admin/state/geography-config.html`, icon: '🗺️', id: 'geography' },
          { label: 'Revenue Reports', url: `${base}admin/state/revenue-reports.html`, icon: '💰', id: 'revenue' },
          { label: 'My Profile', url: `${base}profile.html`, icon: '👤', id: 'profile' },
        ];
      } else {
        // Department Admin (CCLA, CDMA)
        menuItems = [
          { label: 'Department Overview', url: `${base}admin/department/dashboard.html`, icon: '📊', id: 'dashboard' },
          { label: 'Manage Services', url: `${base}admin/department/manage-services.html`, icon: '📋', id: 'services' },
          { label: 'Workflow Pipelines', url: `${base}admin/department/workflow-config.html`, icon: '🔄', id: 'workflow' },
          { label: 'Designation Matrix', url: `${base}admin/department/designation-matrix.html`, icon: '👮', id: 'designations' },
          { label: 'Officer Onboarding', url: `${base}admin/department/officer-onboarding.html`, icon: '👥', id: 'officers' },
          { label: 'My Profile', url: `${base}profile.html`, icon: '👤', id: 'profile' },
        ];
      }
    }

    container.innerHTML = `
      <div class="sidebar-brand" style="padding:20px 24px; border-bottom:1px solid rgba(255,255,255,0.08); display:flex; align-items:center; gap:12px;">
        <span style="font-size:1.5rem;">🏛️</span>
        <div>
          <div style="color:#FFF; font-weight:700; font-size:1.1rem; letter-spacing:-0.3px;">DigiConnect</div>
          <div style="color:rgba(255,255,255,0.5); font-size:0.75rem; text-transform:uppercase; letter-spacing:0.5px;">Pan-India UCSDP</div>
        </div>
      </div>
      <nav class="sidebar-nav" style="padding:16px 12px; display:flex; flex-direction:column; gap:4px;">
        ${menuItems.map(item => {
          const isActive = activePage === item.id;
          const bg = isActive ? 'rgba(37,99,235,0.15)' : 'transparent';
          const color = isActive ? '#60A5FA' : '#94A3B8';
          const border = isActive ? '2px solid #3B82F6' : '2px solid transparent';
          return `
            <a href="${item.url}" style="display:flex; align-items:center; gap:12px; padding:10px 14px; border-radius:8px; text-decoration:none; color:${color}; font-size:0.9rem; font-weight:${isActive ? '600' : '500'}; background:${bg}; border-left:${border}; transition:all 0.15s ease;">
              <span style="font-size:1.1rem;">${item.icon}</span>
              <span>${item.label}</span>
            </a>
          `;
        }).join('')}
      </nav>
    `;
  },
};

window.Sidebar = Sidebar;
