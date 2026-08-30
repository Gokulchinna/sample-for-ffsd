/**
 * DigiConnect Unified API Client
 * Automatically attaches session headers (x-user-id, x-role, x-designation, x-state-code)
 */
const API_BASE_URL = 'http://localhost:3000/api';

const API = {
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        const user = JSON.parse(stored);
        if (user.userId) headers['x-user-id'] = user.userId;
        if (user.role) headers['x-role'] = user.role;
        if (user.designationId) headers['x-designation'] = user.designationId;
        if (user.stateCode) headers['x-state-code'] = user.stateCode;
      }
    } catch (e) {
      console.warn('Failed to parse currentUser from localStorage', e);
    }
    return headers;
  },

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...(options.headers || {}),
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = data.error?.message || data.message || `Request failed with status ${response.status}`;
        throw new Error(message);
      }
      return data;
    } catch (err) {
      console.error(`API Error on [${config.method || 'GET'} ${url}]:`, err);
      throw err;
    }
  },

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  patch(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};

window.API = API;
