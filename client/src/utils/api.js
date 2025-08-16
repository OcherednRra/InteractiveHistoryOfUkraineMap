import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }
};

export const markersAPI = {
  getAll: async () => {
    const response = await api.get('/markers');
    return response.data;
  },

  create: async (markerData) => {
    const response = await api.post('/markers', markerData);
    return response.data;
  },

  update: async (markerId, markerData) => {
    const response = await api.put(`/markers/${markerId}`, markerData);
    return response.data;
  },

  delete: async (markerId) => {
    const response = await api.delete(`/markers/${markerId}`);
    return response.data;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp < currentTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Помилка при перевірці токена:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return false;
  }
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Помилка при отриманні данних користувача:', error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const testConnection = async () => {
  try {
    const response = await api.get('/test');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const moderationAPI = {
  getUnmoderated: async () => {
    const response = await api.get('/markers/unmoderated');
    return response.data;
  },

  approveMarker: async (markerId) => {
    const response = await api.put(`/markers/${markerId}/moderate`, { is_moderated: 1 });
    return response.data;
  },

  rejectMarker: async (markerId) => {
    const response = await api.delete(`/markers/${markerId}`);
    return response.data;
  },

  getModerationStats: async () => {
    const response = await api.get('/markers/moderation-stats');
    return response.data;
  },

  updateMarker: async (markerId, markerData) => {
    const response = await api.put(`/markers/${markerId}`, markerData);
    return response.data;
  }
};

export default api;