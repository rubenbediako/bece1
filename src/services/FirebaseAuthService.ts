import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  type UserCredential
} from 'firebase/auth';
import { auth } from '../config/firebase';
import FirebaseService from './FirebaseService';
import type { User } from '../types';

class FirebaseAuthService {
  private currentUser: User | null = null;
  private authInitialized = false;

  // Initialize auth state listener
  init(): Promise<void> {
    return new Promise((resolve) => {
      if (this.authInitialized) {
        resolve();
        return;
      }

      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // User is signed in
          try {
            const userData = await FirebaseService.getUserById(firebaseUser.uid);
            if (userData) {
              this.currentUser = userData;
            } else {
              // Create user profile if it doesn't exist
              const newUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
                email: firebaseUser.email || '',
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                role: 'student', // Default role
                school: '',
                grade: '',
                subjects: [],
                lastLoginAt: new Date().toISOString(),
                preferences: {
                  theme: 'light',
                  notifications: true,
                  language: 'en'
                }
              };
              
              await FirebaseService.createUser(newUser);
              const createdUser = await FirebaseService.getUserById(firebaseUser.uid);
              this.currentUser = createdUser;
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            this.currentUser = null;
          }
        } else {
          // User is signed out
          this.currentUser = null;
        }

        if (!this.authInitialized) {
          this.authInitialized = true;
          resolve();
        }
      });
    });
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update last login time
      await FirebaseService.updateUser(firebaseUser.uid, {
        lastLoginAt: new Date().toISOString()
      });

      const userData = await FirebaseService.getUserById(firebaseUser.uid);
      if (!userData) {
        throw new Error('User data not found');
      }

      this.currentUser = userData;
      return userData;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  // Register new user
  async register(
    email: string, 
    password: string, 
    userData: {
      fullName: string;
      role?: 'student' | 'teacher' | 'admin';
      school?: string;
      grade?: string;
    }
  ): Promise<User> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(firebaseUser, {
        displayName: userData.fullName
      });

      // Create user document in Firestore
      const newUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
        email: firebaseUser.email || '',
        name: userData.fullName,
        role: userData.role || 'student',
        school: userData.school || '',
        grade: userData.grade || '',
        subjects: [],
        lastLoginAt: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: true,
          language: 'en'
        }
      };

      await FirebaseService.createUser(newUser);
      const createdUser = await FirebaseService.getUserById(firebaseUser.uid);
      
      if (!createdUser) {
        throw new Error('Failed to create user profile');
      }

      this.currentUser = createdUser;
      return createdUser;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  // Sign out
  async signOutUser(): Promise<void> {
    try {
      await signOut(auth);
      this.currentUser = null;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  // Update user profile
  async updateUserProfile(updates: Partial<User>): Promise<void> {
    if (!this.currentUser) {
      throw new Error('No user signed in');
    }

    try {
      await FirebaseService.updateUser(this.currentUser.id, updates);
      
      // Update local user data
      this.currentUser = { ...this.currentUser, ...updates };
      
      // Update Firebase Auth profile if display name changed
      if (updates.name && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: updates.name
        });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Create initial admin user
  async createInitialAdmin(adminData: {
    email: string;
    password: string;
    fullName: string;
  }): Promise<User> {
    try {
      // Check if any admin users exist
      const users = await FirebaseService.getUsers();
      const adminExists = users.some(user => user.role === 'admin');
      
      if (adminExists) {
        throw new Error('Admin user already exists');
      }

      return await this.register(adminData.email, adminData.password, {
        fullName: adminData.fullName,
        role: 'admin'
      });
    } catch (error) {
      console.error('Create initial admin error:', error);
      throw error;
    }
  }

  // Check if any users exist
  async hasUsers(): Promise<boolean> {
    try {
      const users = await FirebaseService.getUsers();
      return users.length > 0;
    } catch (error) {
      console.error('Check users error:', error);
      return false;
    }
  }

  // Get user-friendly error messages
  private getAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No user found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      default:
        return 'An error occurred. Please try again.';
    }
  }

  // Admin access code validation (for backward compatibility)
  validateAccessCode(code: string): boolean {
    // For demo purposes - in production, this should be more secure
    const validCodes = ['BECE2026ADMIN', 'ADMIN123', 'TEACHER2026'];
    return validCodes.includes(code.toUpperCase());
  }
}

export default new FirebaseAuthService();
