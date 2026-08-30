/**
 * DigiConnect Session & Auth Management (Zero JWT Overhead)
 */
const Auth = {
  getCurrentUser() {
    try {
      const stored = localStorage.getItem('currentUser');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  logout() {
    localStorage.removeItem('currentUser');
    window.location.href = this.getBaseUrl() + 'login.html';
  },

  getBaseUrl() {
    // Computes relative path depth to root front-end directory
    const path = window.location.pathname;
    if (path.includes('/citizen/') || path.includes('/officer/') || path.includes('/grievance/')) {
      return '../';
    }
    if (path.includes('/admin/central/') || path.includes('/admin/state/') || path.includes('/admin/department/')) {
      return '../../';
    }
    return './';
  },

  getDashboardUrl(user) {
    const base = this.getBaseUrl();
    if (!user) return base + 'login.html';

    if (user.role === 'citizen') {
      return base + 'citizen/citizen-dashboard.html';
    }
    if (user.role === 'officer') {
      if (user.designationId === 'DESIG-GRIEVANCE-OFFICER') {
        return base + 'grievance/grievance-dashboard.html';
      }
      return base + 'officer/officer-dashboard.html';
    }
    if (user.role === 'admin') {
      if (user.adminTier === 'CENTRAL') return base + 'admin/central/dashboard.html';
      if (user.adminTier === 'STATE') return base + 'admin/state/dashboard.html';
      return base + 'admin/department/dashboard.html';
    }
    return base + 'index.html';
  },

  async login(loginId, password) {
    const res = await API.post('/auth/login', { loginId, password });
    if (res && res.user) {
      this.setCurrentUser(res.user);
      window.location.href = this.getDashboardUrl(res.user);
      return res.user;
    }
    throw new Error('Login failed: Invalid server response');
  },

  async quickLogin(loginId) {
    return this.login(loginId, 'password123');
  },

  requireAuth(allowedRoles = []) {
    const user = this.getCurrentUser();
    const base = this.getBaseUrl();
    if (!user) {
      window.location.href = base + 'login.html';
      return null;
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      alert(`Access Restricted. Allowed roles: ${allowedRoles.join(', ')}`);
      window.location.href = this.getDashboardUrl(user);
      return null;
    }
    return user;
  },
};

window.Auth = Auth;
