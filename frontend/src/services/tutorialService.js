import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://codenotes-backend.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const tutorialService = {
  // Public API methods
  async getAllTutorials(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await api.get(`/tutorials?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tutorials:', error);
      throw error;
    }
  },

  async getTutorialBySlug(slug) {
    try {
      const response = await api.get(`/tutorials/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tutorial:', error);
      throw error;
    }
  },

  async getCategories() {
    try {
      const response = await api.get('/tutorials/meta/categories');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  },

  async getStats() {
    try {
      const response = await api.get('/tutorials/meta/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      throw error;
    }
  },

  async searchTutorials(query, params = {}) {
    try {
      const queryParams = new URLSearchParams({ q: query });
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await api.get(`/tutorials/search?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Failed to search tutorials:', error);
      throw error;
    }
  },

  // Admin API methods
  async getAdminTutorials(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await api.get(`/tutorials/admin/all?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch admin tutorials:', error);
      throw error;
    }
  },

  async getTutorialById(id) {
    try {
      const response = await api.get(`/tutorials/admin/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tutorial by ID:', error);
      throw error;
    }
  },

  async createTutorial(tutorialData) {
    try {
      const response = await api.post('/tutorials', tutorialData);
      return response.data;
    } catch (error) {
      console.error('Failed to create tutorial:', error);
      throw error;
    }
  },

  async updateTutorial(id, tutorialData) {
    try {
      const response = await api.patch(`/tutorials/${id}`, tutorialData);
      return response.data;
    } catch (error) {
      console.error('Failed to update tutorial:', error);
      throw error;
    }
  },

  async deleteTutorial(id) {
    try {
      const response = await api.delete(`/tutorials/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete tutorial:', error);
      throw error;
    }
  },

  // Utility methods
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  },

  validateTutorial(tutorial) {
    const errors = [];

    if (!tutorial.title?.trim()) {
      errors.push('Title is required');
    }

    if (!tutorial.category?.trim()) {
      errors.push('Category is required');
    }

    if (!tutorial.content?.trim() && (!tutorial.contentBlocks || tutorial.contentBlocks.length === 0)) {
      errors.push('Content is required');
    }

    return errors;
  },

  formatTutorialForSave(tutorial) {
    return {
      ...tutorial,
      slug: this.generateSlug(tutorial.title),
      tags: tutorial.tags?.filter(tag => tag.trim()) || [],
      estimatedReadTime: tutorial.estimatedReadTime || 5,
    };
  }
};

export default tutorialService;
