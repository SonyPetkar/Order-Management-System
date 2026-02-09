import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const me = await authService.getCurrentUser();
          setUser(me.data.user);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register({ name, email, password });
      localStorage.setItem('token', response.data.token);
      
      const me = await authService.getCurrentUser();
      setUser(me.data.user); 
      
      navigate('/'); 
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message); 
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [navigate]); 

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem('token', response.data.token);
      const me = await authService.getCurrentUser();
      setUser(me.data.user); 
      
      navigate('/'); 
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [navigate]); 

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login'); 
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);