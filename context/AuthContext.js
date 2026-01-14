'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    router.push('/login');
  }, [router]);

  const secureFetch = useCallback(async (url, options = {}) => {
    const storedToken = localStorage.getItem('token');
    
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${storedToken}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(url, { ...options, headers });

      if (response.status === 401) {
        console.warn("Session expired or unauthorized. Terminal lock engaged.");
        logout();
        return null;
      }

      return response;
    } catch (error) {
      console.error("Network Transmission Error:", error);
      throw error;
    }
  }, [logout]);

  useEffect(() => {
    const syncAuth = () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        try {
          const payload = JSON.parse(atob(storedToken.split('.')[1]));
          if (payload.exp * 1000 < Date.now()) {
            logout();
          } else {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
          }
        } catch (e) {
          logout();
        }
      }
      setLoading(false);
    };

    syncAuth();
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, token, loading, setUser, setToken, logout, secureFetch }}>
      {!loading && children}
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