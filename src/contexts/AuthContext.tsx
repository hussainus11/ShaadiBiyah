import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'vendor' | 'admin';
  isVerified: boolean;
  profileImage?: string;
  weddingDate?: string;
  partnerName?: string;
  budget?: number;
  guestCount?: number;
  preferences?: {
    venueType: string;
    cuisine: string;
    theme: string;
    music: string;
  };
}

export interface Vendor {
  id: string;
  businessName: string;
  category: string;
  email: string;
  role: 'vendor';
  isVerified: boolean;
  isActive: boolean;
  rating: number;
  totalBookings: number;
  location: string;
}

interface AuthContextType {
  user: User | Vendor | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User | Vendor>) => void;
  switchToVendor: () => void;
  switchToUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      console.log('Attempting login with:', { email, password: '***' });
      
      // Real API call to backend
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);

      if (data.success && data.data.user && data.data.token) {
        const userData = data.data.user;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('userRole', userData.role);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Real API call to backend
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: 'user123', // Default password for demo
          phone: userData.phone || '',
          role: 'USER'
        }),
      });

      const data = await response.json();

      if (data.success && data.data.user && data.data.token) {
        const userData = data.data.user;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('userRole', userData.role);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  };

  const updateUser = (userData: Partial<User | Vendor>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const switchToVendor = () => {
    if (user && user.role === 'user') {
      // In a real app, this would make an API call to register as vendor
      const vendorData: Vendor = {
        id: user.id,
        businessName: `${user.firstName} ${user.lastName} Business`,
        category: 'General',
        email: user.email,
        role: 'vendor',
        isVerified: false,
        isActive: true,
        rating: 0,
        totalBookings: 0,
        location: 'Not specified'
      };
      setUser(vendorData);
      localStorage.setItem('user', JSON.stringify(vendorData));
    }
  };

  const switchToUser = () => {
    if (user && user.role === 'vendor') {
      // In a real app, this would fetch the user profile
      const userData: User = {
        id: user.id,
        email: user.email,
        firstName: 'User',
        lastName: 'Name',
        role: 'user',
        isVerified: true
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    switchToVendor,
    switchToUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

