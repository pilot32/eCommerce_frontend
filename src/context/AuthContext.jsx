import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  try {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  } catch (error) {
    console.error('Failed to restore auth state:', error);

    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } finally {
    setLoading(false);
  }
}, []);

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    const { user: userData, token: authToken } = response.data;
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await authApi.register({ name, email, password });
    return response.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;