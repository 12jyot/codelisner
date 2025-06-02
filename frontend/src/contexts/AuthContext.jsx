import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      console.log('AuthContext - checkAuth called with token:', !!token);
      if (token) {
        try {
          // Check if it's a mock token
          if (token.startsWith('mock-jwt-token-')) {
            console.log('AuthContext - Using mock authentication');
            // For mock tokens, retrieve user from localStorage
            const savedUser = localStorage.getItem('mockUser');
            if (savedUser) {
              setUser(JSON.parse(savedUser));
            } else {
              // Default mock admin user if no saved user
              const mockUser = {
                _id: 'demo-admin-id',
                username: 'admin',
                email: 'admin@codenotes.com',
                role: 'admin',
                createdAt: new Date().toISOString()
              };
              setUser(mockUser);
              localStorage.setItem('mockUser', JSON.stringify(mockUser));
            }
          } else {
            // Try real backend authentication
            console.log('AuthContext - Making /api/auth/me request...');
            const response = await axios.get('http://localhost:5000/api/auth/me');
            console.log('AuthContext - /api/auth/me response:', response.data);
            setUser(response.data.user);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          console.log('AuthContext - Auth check failed, calling logout');
          logout();
        }
      } else {
        console.log('AuthContext - No token found, clearing user');
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      // First try the real backend
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token: newToken, user: userData } = response.data;

      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      console.error('Backend login failed, trying mock authentication:', error);

      // Fallback to mock authentication for demo purposes
      const demoCredentials = {
        'admin@codenotes.com': {
          password: 'admin123',
          user: {
            _id: 'demo-admin-id',
            username: 'admin',
            email: 'admin@codenotes.com',
            role: 'admin',
            createdAt: new Date().toISOString()
          }
        },
        'user@codenotes.com': {
          password: 'user123',
          user: {
            _id: 'demo-user-id',
            username: 'user',
            email: 'user@codenotes.com',
            role: 'user',
            createdAt: new Date().toISOString()
          }
        }
      };

      const demoUser = demoCredentials[email];

      if (demoUser && demoUser.password === password) {
        // Generate a mock token
        const mockToken = 'mock-jwt-token-' + Date.now();

        localStorage.setItem('token', mockToken);
        localStorage.setItem('mockUser', JSON.stringify(demoUser.user));
        setToken(mockToken);
        setUser(demoUser.user);

        return { success: true, user: demoUser.user };
      } else {
        return { success: false, message: 'Invalid credentials' };
      }
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password
      });

      const { token: newToken, user: userData } = response.data;

      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('mockUser');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isAuthenticated = () => {
    return !!user && !!token;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
