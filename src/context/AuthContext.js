'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  login: async (email, password) => {},
  register: async (name, email, password) => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem('unnes_board_auth');
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        setIsLoggedIn(parsed.isLoggedIn);
        setUser(parsed.user);
      } catch (e) {
        console.error("Failed to parse stored auth", e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulated Auth
    const dummyUser = {
      name: email.split('@')[0],
      email: email,
      avatar: email.charAt(0).toUpperCase(),
      role: 'Mahasiswa',
      nim: '12014220' + Math.floor(10 + Math.random() * 90),
    };
    
    const authData = { isLoggedIn: true, user: dummyUser };
    setIsLoggedIn(true);
    setUser(dummyUser);
    localStorage.setItem('unnes_board_auth', JSON.stringify(authData));
  };

  const register = async (name, email, password) => {
    // Simulated Registration
    const dummyUser = {
      name: name,
      email: email,
      avatar: name.charAt(0).toUpperCase(),
      role: 'Mahasiswa',
      nim: '12014220' + Math.floor(10 + Math.random() * 90),
    };
    
    const authData = { isLoggedIn: true, user: dummyUser };
    setIsLoggedIn(true);
    setUser(dummyUser);
    localStorage.setItem('unnes_board_auth', JSON.stringify(authData));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('unnes_board_auth');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
