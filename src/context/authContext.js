import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { login, logout, checkAuth, setAuthToken, setupAxiosInterceptors } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const isLoggingOut = useRef(false);



  const handleLogout = useCallback(async () => {
    if (isLoggingOut.current) return;
    isLoggingOut.current = true;
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
      isLoggingOut.current = false;
    }
  }, []);


  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setAuthToken(token);
        const { isAuthenticated, user } = await checkAuth();
        if (isAuthenticated && user) {
          setIsAuthenticated(true);
          setUser(user);
          setIsPremium(user.isPaid || false);
        } else {
          await handleLogout();
        }
      } catch (error) {
        console.error('Error during authentication check:', error);
        await handleLogout();
      } finally {
        setLoading(false);
      }
    };

    setupAxiosInterceptors(handleLogout);
    initAuth();
  }, [handleLogout]);


  const handleLogin = async (email, password) => {
    try {
      const result = await login({ email, password });
      if (result.success && result.token) {
        setAuthToken(result.token);
        setIsAuthenticated(true);
        setUser(result.user);
        setIsPremium(result.user.isPaid || false);
        localStorage.setItem('token', result.token);
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