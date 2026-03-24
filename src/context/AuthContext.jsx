import { createContext, useEffect, useState } from 'react';
import { api } from '../utils/axios.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Check user on app load (cookie-based auth)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ Login
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', {
        email,
        password,
      });

      setUser(data.user);
      return data;
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  // ✅ Register
  const register = async (username, email, password) => {
    try {
      const { data } = await api.post('/auth/register', {
        username,
        email,
        password,
      });

      return data;
    } catch (err) {
      console.error('Registration failed:', err);
      throw err;
    }
  };

  // ✅ Verify OTP
  const verifyOtp = async (email, otp) => {
    try {
      const { data } = await api.post('/auth/verify-otp', {
        email,
        otp,
      });

      setUser(data.user);
      return data;
    } catch (err) {
      console.error('OTP verification failed:', err);
      throw err;
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await api.post('/auth/logout'); // backend clears cookie
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        verifyOtp,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
