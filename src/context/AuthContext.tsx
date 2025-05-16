import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { firstname: string; lastname: string; email: string; password: string; role: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshToken: () => Promise<string>;
  setUser: (user: User | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      console.log('Initializing auth - Stored user:', storedUser, 'Token:', token);

      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Error parsing stored user:', err);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const redirectToDashboard = (role: string) => {
    switch (role) {
      case 'admin':
        navigate('/dashboard/admin');
        break;
      case 'host':
        navigate('/dashboard/host');
        break;
      case 'guest':
        navigate('/dashboard/guest');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const refreshToken = async (): Promise<string> => {
    try {
      const response = await axiosInstance.post('/users/refresh-token', {}, {
        headers: { 'X-Skip-Redirect': 'true' },
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      return token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/users/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      redirectToDashboard(user.role);
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      throw error;
    }
  };

  const register = async (userData: { firstname: string; lastname: string; email: string; password: string; role: string }) => {
    try {
      const response = await axiosInstance.post('/users/register', userData);
      const { message } = response.data; // Assuming backend returns a success message
      console.log('Registration successful:', message);
      navigate('/'); // Redirect to homepage after successful signup
    } catch (error: any) {
      // Log detailed error information
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Unknown error';
      console.error('Registration failed:', {
        status: error.response?.status,
        data: error.response?.data,
        message: errorMessage,
      });
      // Attempt auto-login to handle cases where user was registered despite error
      // try {
      //   await login(userData.email, userData.password);
      //   console.log('User was registered; auto-login successful');
      // } catch (loginError) {
      //   console.error('Auto-login after registration failed:', loginError);
      //   throw new Error(`Registration failed: ${errorMessage}`);
      // }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated, refreshToken, setUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};