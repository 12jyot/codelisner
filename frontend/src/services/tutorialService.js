import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://codenotes-backend.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout for Render cold starts
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fallback data for when backend is unavailable
const fallbackTutorials = [
  {
    _id: 'fallback-1',
    title: 'JavaScript Fundamentals',
    slug: 'javascript-fundamentals',
    category: 'JavaScript',
    excerpt: 'Learn the basics of JavaScript programming language.',
    difficulty: 'Beginner',
    estimatedReadTime: 10,
    isPublished: true,
    views: 1234,
    likes: 89,
    createdAt: new Date().toISOString(),
    author: { username: 'CodeNotes Team' }
  },
  {
    _id: 'fallback-2',
    title: 'Python for Beginners',
    slug: 'python-for-beginners',
    category: 'Python',
    excerpt: 'Start your Python journey with this comprehensive guide.',
    difficulty: 'Beginner',
    estimatedReadTime: 15,
    isPublished: true,
    views: 987,
    likes: 67,
    createdAt: new Date().toISOString(),
    author: { username: 'CodeNotes Team' }
  },
  {
    _id: 'fallback-3',
    title: 'HTML5 Semantic Elements',
    slug: 'html5-semantic-elements',
    category: 'HTML',
    excerpt: 'Understanding modern HTML5 semantic elements.',
    difficulty: 'Beginner',
    estimatedReadTime: 8,
    isPublished: true,
    views: 756,
    likes: 45,
    createdAt: new Date().toISOString(),
    author: { username: 'CodeNotes Team' }
  }
];

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
      console.log('🔄 Fetching tutorials from backend...');
      const queryParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await api.get(`/tutorials?${queryParams}`);
      console.log('✅ Successfully fetched tutorials from backend');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch tutorials from backend:', error.message);

      // Check if it's a network/timeout error
      if (error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR' || !error.response) {
        console.log('🔄 Backend unavailable, using fallback data...');

        // Return fallback data with same structure as backend
        return {
          tutorials: fallbackTutorials,
          pagination: {
            current: 1,
            pages: 1,
            total: fallbackTutorials.length
          },
          message: 'Backend is starting up. Showing sample tutorials.'
        };
      }

      throw error;
    }
  },

  async getTutorialBySlug(slug) {
    try {
      const response = await api.get(`/tutorials/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tutorial:', error);

      // Check if it's a fallback tutorial
      const fallbackTutorial = fallbackTutorials.find(t => t.slug === slug);
      if (fallbackTutorial && (error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR' || !error.response)) {
        console.log('🔄 Using fallback tutorial data...');
        return {
          tutorial: {
            ...fallbackTutorial,
            content: `# ${fallbackTutorial.title}\n\nThis is a sample tutorial. The backend is starting up.\n\n## Getting Started\n\nThis tutorial will guide you through the basics.\n\n## Next Steps\n\nContinue learning with more tutorials!`
          }
        };
      }

      throw error;
    }
  },

  // Wake up backend function
  async wakeUpBackend() {
    try {
      console.log('🔄 Waking up backend...');
      const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
      console.log('✅ Backend is awake!');
      return true;
    } catch (error) {
      console.log('⏳ Backend is still starting...');
      return false;
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
