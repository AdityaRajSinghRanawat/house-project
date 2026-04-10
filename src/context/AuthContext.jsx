import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('aura-user');
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        setUser(userData);
        setIsAdmin(userData.isAdmin || false);
      } catch (e) {
        console.error('Error parsing stored user data', e);
      }
    }
    setLoading(false);
  }, []);

  const register = (email, phone, password, isAdminReg = false) => {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('aura-users') || '[]');
    if (users.some(u => u.email === email)) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: Date.now(),
      email,
      phone,
      password, // In real app, this should be hashed
      isAdmin: isAdminReg,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('aura-users', JSON.stringify(users));

    // Auto-login after registration
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsAdmin(isAdminReg);
    localStorage.setItem('aura-user', JSON.stringify(userWithoutPassword));

    return userWithoutPassword;
  };

  const login = (email, password, isAdmin = false) => {
    const users = JSON.parse(localStorage.getItem('aura-users') || '[]');
    const foundUser = users.find(
      u => u.email === email && u.password === password && u.isAdmin === isAdmin
    );

    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    setIsAdmin(foundUser.isAdmin);
    localStorage.setItem('aura-user', JSON.stringify(userWithoutPassword));

    return userWithoutPassword;
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('aura-user');
  };

  const value = {
    user,
    isAdmin,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
