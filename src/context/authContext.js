import React, { createContext, useState, useEffect } from 'react';
import { login, logout, checkAuth, setAuthToken } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthToken(token);
      }
      try {
        const { isAuthenticated, user } = await checkAuth();
        setIsAuthenticated(isAuthenticated);
        setUser(user);
        setIsPremium(user?.isPaid || false);
      } catch (error) {
        console.error('Error during authentication check:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const result = await login({ email, password });
      if (result.success) {
        setIsAuthenticated(true);
        setUser(result.user);
        setIsPremium(result.user.isPaid || false);
        return true;
      } else {
        console.error('Login failed:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setIsPremium(false);
      localStorage.removeItem('token');
      setAuthToken(null);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        setIsAuthenticated, 
        user, 
        setUser, 
        isPremium, 
        setIsPremium, 
        login: handleLogin, 
        logout: handleLogout, 
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;