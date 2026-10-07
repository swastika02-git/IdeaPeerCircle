const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('ideapeercircle_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('ideapeercircle_token', token);
    } else {
      localStorage.removeItem('ideapeercircle_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (err) {
      console.error(`API Error on ${endpoint}:`, err);
      throw err;
    }
  }

  // Auth Endpoints
  async register(userData) {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async login(credentials) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async demoSwitch(username) {
    const res = await this.request('/auth/demo-switch', {
      method: 'POST',
      body: JSON.stringify({ username })
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // Projects Endpoints
  async getProjects(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const qs = query.toString();
    return this.request(`/projects${qs ? `?${qs}` : ''}`);
  }

  async getProject(id) {
    return this.request(`/projects/${id}`);
  }

  async createProject(projectData) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  }

  async updateProject(id, projectData) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData)
    });
  }

  async deleteProject(id) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE'
    });
  }

  // Reviews Endpoints
  async submitReview(projectId, reviewData) {
    return this.request(`/projects/${projectId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  }

  async getReviews(projectId) {
    return this.request(`/projects/${projectId}/reviews`);
  }

  // AI Endpoints
  async analyzeProject(projectId) {
    return this.request(`/ai/projects/${projectId}/analyze`, {
      method: 'POST'
    });
  }

  // Collaborations Endpoints
  async getCollaborations() {
    return this.request('/collaborations');
  }

  async getCollabMatches() {
    return this.request('/collaborations/matches');
  }

  async sendCollabRequest(data) {
    return this.request('/collaborations', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateCollabStatus(id, status) {
    return this.request(`/collaborations/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // Learning Endpoints
  async getLearningPlan() {
    return this.request('/learning');
  }

  // Notifications Endpoints
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT'
    });
  }

  async markAllNotificationsRead() {
    return this.request('/notifications/read-all', {
      method: 'PUT'
    });
  }

  // Users Endpoints
  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async searchUsers(query) {
    return this.request(`/users?search=${encodeURIComponent(query)}`);
  }
}

export const api = new ApiClient();
export default api;
