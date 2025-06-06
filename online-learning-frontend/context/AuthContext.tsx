"use client";
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    console.log('DEBUG AuthProvider: storedToken', storedToken, 'storedUser', storedUser);
    if (storedToken && storedUser && storedUser !== 'undefined') {
      try {
        setToken(storedToken);
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.role) parsedUser.role = parsedUser.role.toLowerCase();
        setUser(parsedUser);
      } catch (e) {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    try {
      const res = await axios.post('http://localhost:3000/auth/login', { email, username: email, password });
      console.log('LOGIN RESPONSE:', res.data);

      // Always use user and access_token from backend
      const userObj = res.data.user;
      const token = res.data.access_token;
      if (!userObj || !userObj.email) {
        throw new Error('Login failed: user object or email missing from response');
      }
      userObj.role = userObj.role.charAt(0).toUpperCase() + userObj.role.slice(1).toLowerCase();
      setToken(token);
      setUser(userObj);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userObj));
      setLoading(false);
      router.push('/');
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
