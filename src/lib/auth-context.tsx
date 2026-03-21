import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Record<string, { role: Role; name: string }> = {
  'admin@lanedu.com': { role: 'ADMIN', name: 'System Admin' },
  'teacher@lanedu.com': { role: 'TEACHER', name: 'Nguyễn Văn Teacher' },
  'student@lanedu.com': { role: 'STUDENT', name: 'Trần Thị Student' },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('lms_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password?: string) => {
    // Mock authentication logic
    const userData = MOCK_USERS[email.toLowerCase()];
    
    if (!userData) {
      throw new Error('Invalid credentials');
    }

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name,
      email,
      role: userData.role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    
    setUser(mockUser);
    localStorage.setItem('lms_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lms_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
