import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import FirebaseAuthService from '../services/FirebaseAuthService';
import FirebaseService from '../services/FirebaseService';
import type { User } from '../types';

interface FirebaseContextType {
  // Auth state
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, userData: any) => Promise<User>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  
  // Admin methods
  createInitialAdmin: (adminData: any) => Promise<User>;
  hasUsers: () => Promise<boolean>;
  
  // Data methods
  seedInitialData: () => Promise<void>;
  logEvent: (event: string, data: any) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await FirebaseAuthService.init();
        setUser(FirebaseAuthService.getCurrentUser());
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<User> => {
    try {
      const userData = await FirebaseAuthService.signIn(email, password);
      setUser(userData);
      
      // Log sign in event
      await FirebaseService.logEvent('user_sign_in', {
        userId: userData.id,
        role: userData.role
      });
      
      return userData;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const register = async (
    email: string, 
    password: string, 
    userData: {
      fullName: string;
      role?: 'student' | 'teacher' | 'admin';
      school?: string;
      grade?: string;
    }
  ): Promise<User> => {
    try {
      const newUser = await FirebaseAuthService.register(email, password, userData);
      setUser(newUser);
      
      // Log registration event
      await FirebaseService.logEvent('user_register', {
        userId: newUser.id,
        role: newUser.role
      });
      
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      if (user) {
        await FirebaseService.logEvent('user_sign_out', {
          userId: user.id
        });
      }
      
      await FirebaseAuthService.signOutUser();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await FirebaseAuthService.resetPassword(email);
      await FirebaseService.logEvent('password_reset_requested', { email });
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    try {
      await FirebaseAuthService.updateUserProfile(updates);
      setUser(FirebaseAuthService.getCurrentUser());
      
      await FirebaseService.logEvent('profile_updated', {
        userId: user?.id,
        updates: Object.keys(updates)
      });
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const createInitialAdmin = async (adminData: {
    email: string;
    password: string;
    fullName: string;
  }): Promise<User> => {
    try {
      const adminUser = await FirebaseAuthService.createInitialAdmin(adminData);
      setUser(adminUser);
      
      // Seed initial data after creating admin
      await FirebaseService.seedInitialData();
      
      await FirebaseService.logEvent('initial_admin_created', {
        adminId: adminUser.id
      });
      
      return adminUser;
    } catch (error) {
      console.error('Create initial admin error:', error);
      throw error;
    }
  };

  const hasUsers = async (): Promise<boolean> => {
    try {
      return await FirebaseAuthService.hasUsers();
    } catch (error) {
      console.error('Check users error:', error);
      return false;
    }
  };

  const seedInitialData = async (): Promise<void> => {
    try {
      await FirebaseService.seedInitialData();
      await FirebaseService.logEvent('initial_data_seeded', {
        userId: user?.id
      });
    } catch (error) {
      console.error('Seed initial data error:', error);
      throw error;
    }
  };

  const logEvent = async (event: string, data: any): Promise<void> => {
    try {
      await FirebaseService.logEvent(event, {
        ...data,
        userId: user?.id
      });
    } catch (error) {
      console.error('Log event error:', error);
    }
  };

  const value: FirebaseContextType = {
    // Auth state
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    
    // Auth methods
    signIn,
    register,
    signOut,
    resetPassword,
    updateProfile,
    
    // Admin methods
    createInitialAdmin,
    hasUsers,
    
    // Data methods
    seedInitialData,
    logEvent
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
