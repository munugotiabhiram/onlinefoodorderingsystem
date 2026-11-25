/**
 * Centralized API & Authentication Service
 */
const API = {
  baseUrl: window.location.origin,

  getToken() {
    return localStorage.getItem('ofos_token') || null;
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('ofos_token', token);
    } else {
      localStorage.removeItem('ofos_token');
    }
  },

  getUser() {
    const raw = localStorage.getItem('ofos_user');
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  setUser(user) {
    if (user) {
      localStorage.setItem('ofos_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ofos_user');
    }
  },

  clearSession() {
    localStorage.removeItem('ofos_token');
    localStorage.removeItem('ofos_user');
  },

  async request(endpoint, options = {}) {
    const headers = options.headers || {};
    const token = this.getToken();

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const config = {
      ...options,
      headers,
      credentials: 'include'
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 && !endpoint.includes('/login') && !endpoint.includes('/auth/google')) {
          this.clearSession();
          if (window.location.pathname.includes('dashboard') || window.location.pathname.includes('admin')) {
            window.location.href = '/index.html?session_expired=1';
          }
        }
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err);
      throw err;
    }
  },

  // Auth endpoints
  async loginDemo(role = 'customer') {
    const res = await this.request('/api/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role })
    });
    if (res.token) {
      this.setToken(res.token);
      this.setUser(res.user);
    }
    return res;
  },

  async loginWithGoogleToken(credential) {
    const res = await this.request('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential })
    });
    if (res.token) {
      this.setToken(res.token);
      this.setUser(res.user);
    }
    return res;
  },

  async getGoogleAuthUrl() {
    return await this.request('/api/auth/google/url');
  },

  async getAuthConfig() {
    return await this.request('/api/auth/config');
  },

  async getCurrentUser() {
    return await this.request('/api/auth/me');
  },

  async logout() {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    this.clearSession();
    window.location.href = '/index.html';
  },

  // Food & Menu
  async getFoods(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return await this.request(`/api/foods${qs ? '?' + qs : ''}`);
  },

  async getCategories() {
    return await this.request('/api/foods/meta/categories');
  },

  async getRestaurants() {
    return await this.request('/api/foods/meta/restaurants');
  },

  async getCoupons() {
    return await this.request('/api/foods/meta/coupons');
  },

  // Orders
  async createOrder(orderPayload) {
    return await this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload)
    });
  },

  async getOrders() {
    return await this.request('/api/orders');
  },

  async getOrder(orderId) {
    return await this.request(`/api/orders/${orderId}`);
  },

  async advanceOrderStage(orderId) {
    return await this.request(`/api/orders/${orderId}/advance-stage`, {
      method: 'POST'
    });
  },

  // User Profile
  async getProfile() {
    return await this.request('/api/user/profile');
  },

  async updateProfile(profileData) {
    return await this.request('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  async addAddress(addressData) {
    return await this.request('/api/user/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData)
    });
  },

  async deleteAddress(addressId) {
    return await this.request(`/api/user/addresses/${addressId}`, {
      method: 'DELETE'
    });
  },

  async toggleFavorite(foodId) {
    return await this.request(`/api/user/favorites/${foodId}`, {
      method: 'POST'
    });
  },

  // Admin
  async getAdminStats() {
    return await this.request('/api/admin/stats');
  },

  async getAdminOrders(status = 'all') {
    return await this.request(`/api/admin/orders?status=${status}`);
  },

  async updateOrderStatus(orderId, stage) {
    return await this.request(`/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ stage })
    });
  },

  async getAdminCustomers() {
    return await this.request('/api/admin/customers');
  },

  async createFood(foodData) {
    return await this.request('/api/foods', {
      method: 'POST',
      body: JSON.stringify(foodData)
    });
  },

  async updateFood(id, foodData) {
    return await this.request(`/api/foods/${id}`, {
      method: 'PUT',
      body: JSON.stringify(foodData)
    });
  },

  async deleteFood(id) {
    return await this.request(`/api/foods/${id}`, {
      method: 'DELETE'
    });
  }
};

// UI Toast Utility
const Toast = {
  show(message, type = 'info', duration = 4000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    toast.innerHTML = `
      <span style="font-weight: 800; font-size: 16px;">${icon}</span>
      <div style="flex: 1;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  success(msg) { this.show(msg, 'success'); },
  error(msg) { this.show(msg, 'error'); },
  info(msg) { this.show(msg, 'info'); }
};
