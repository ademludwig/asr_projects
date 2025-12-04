// context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // {email, userId, is_admin, token}
  const [votedFor, setVotedFor] = useState(null);

  // Load user from localStorage on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        email: payload.email,
        userId: payload.userId,
        is_admin: payload.is_admin,
        token
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, votedFor, setVotedFor }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
