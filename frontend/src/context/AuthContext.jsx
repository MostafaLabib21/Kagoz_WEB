import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production'
  ? 'https://kagoz-web.onrender.com'
  : 'http://localhost:5000');

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate user from cookie on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('/api/auth/me');
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const register = async (name, email, password) => {
    const { data } = await axios.post('/api/auth/register', { name, email, password });
    return data;
  };

  const verifyEmail = async (email, otp) => {
    const { data } = await axios.post('/api/auth/verify-email', { email, otp });
    setUser(data.user);
    return data;
  };

  const resendVerification = async (email) => {
    const { data } = await axios.post('/api/auth/resend-verification', { email });
    return data;
  };

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    setUser(data.user);
    return data;
  };

  const googleLogin = async (credential) => {
    const { data } = await axios.post('/api/auth/google', { credential });
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await axios.post('/api/auth/logout');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const { data } = await axios.get('/api/auth/me');
      setUser(data.user);
    } catch {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        verifyEmail,
        resendVerification,
        login,
        googleLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
