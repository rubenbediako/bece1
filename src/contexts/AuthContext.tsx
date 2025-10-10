import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'student' | 'teacher';
  fullName: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, accessCode?: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  createInitialAdmin: (adminData: {
    email: string;
    password: string;
    fullName: string;
    username: string;
  }) => Promise<boolean>;
  hasUsers: () => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  generateAccessCode: () => string;
  getCurrentAccessCode: () => string;
  sendCodeToWhatsApp: (phoneNumber: string, message?: string) => void;
  sendCodeViaSMS: (phoneNumber: string, message?: string) => void;
  sendCodeViaBoth: (phoneNumber: string, message?: string) => void;
  generateAndSendCode: (phoneNumber: string, method?: 'whatsapp' | 'sms' | 'both') => string;
  autoGenerateCodes: boolean;
  setAutoGenerateCodes: (enabled: boolean) => void;
  sendCodeToAdmin: (code: string, userPhone?: string, method?: string) => void;
  generateCodeForUser: (userPhone: string, method?: 'whatsapp' | 'sms' | 'both') => string;
  // User management functions
  getAllUsers: () => User[];
  createUser: (userData: RegisterData & { password: string }) => Promise<boolean>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'student' | 'teacher';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Production users - empty initially, users will be created through registration
const initialUsers: User[] = [];

// Production credentials - empty initially, credentials will be added during registration
const userCredentials: { email: string; password: string }[] = [];

// Access code management - empty initially, admin will generate codes as needed
let currentAccessCode = '';
const accessCodeHistory: string[] = [];

// Access code expiration tracking (8 months validity)
interface AccessCodeWithExpiry {
  code: string;
  createdAt: Date;
  expiresAt: Date;
}

let currentAccessCodeWithExpiry: AccessCodeWithExpiry | null = null;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [autoGenerateCodes, setAutoGenerateCodes] = useState<boolean>(false);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('beceUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Load auto-generation preference
    const autoGenSetting = localStorage.getItem('beceAutoGenCodes');
    if (autoGenSetting) {
      setAutoGenerateCodes(JSON.parse(autoGenSetting));
    }

    // Load saved access code with expiry
    const savedAccessCode = localStorage.getItem('beceAccessCodeExpiry');
    if (savedAccessCode) {
      const codeData = JSON.parse(savedAccessCode);
      const expiryDate = new Date(codeData.expiresAt);
      
      // Check if code is still valid (not expired)
      if (expiryDate > new Date()) {
        currentAccessCode = codeData.code;
        currentAccessCodeWithExpiry = {
          code: codeData.code,
          createdAt: new Date(codeData.createdAt),
          expiresAt: expiryDate
        };
      } else {
        // Code expired, remove from storage
        localStorage.removeItem('beceAccessCodeExpiry');
        currentAccessCode = '';
        currentAccessCodeWithExpiry = null;
      }
    }

    // Generate initial access code if none exists (admin will need to generate codes)
    if (!currentAccessCode) {
      // Don't auto-generate - wait for admin to create first code
      currentAccessCode = '';
      currentAccessCodeWithExpiry = null;
    }
  }, []);

  // Save auto-generation preference when it changes
  useEffect(() => {
    localStorage.setItem('beceAutoGenCodes', JSON.stringify(autoGenerateCodes));
  }, [autoGenerateCodes]);

  const login = async (email: string, password: string, accessCode?: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check credentials against registered users
    const credentialMatch = userCredentials.find(
      (cred: { email: string; password: string }) => cred.email === email && cred.password === password
    );

    if (credentialMatch) {
      // Check in both dynamic users and initial users
      const userData = users.find(u => u.email === email) || 
                      initialUsers.find(u => u.email === email);
      
      if (userData) {
        // If user is a student, require valid access code
        if (userData.role === 'student') {
          if (!accessCode || !isAccessCodeValid(accessCode)) {
            return false; // Invalid or missing access code
          }
        }
        
        setUser(userData);
        localStorage.setItem('beceUser', JSON.stringify(userData));
        return true;
      }
    }

    return false;
  };

  const isAccessCodeValid = (code: string): boolean => {
    // Check if code matches current valid code
    if (code !== currentAccessCode) {
      return false;
    }

    // Check if code has not expired (8 months validity)
    if (currentAccessCodeWithExpiry) {
      return new Date() <= currentAccessCodeWithExpiry.expiresAt;
    }

    return true;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if email already exists
    const emailExists = users.some(u => u.email === userData.email);
    const usernameExists = users.some(u => u.username === userData.username);

    if (emailExists || usernameExists) {
      return false;
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      fullName: userData.fullName,
      createdAt: new Date().toISOString()
    };

    // Add to users list and credentials
    setUsers(prev => [...prev, newUser]);
    userCredentials.push({ email: userData.email, password: userData.password });

    // Auto-login after registration
    setUser(newUser);
    localStorage.setItem('beceUser', JSON.stringify(newUser));

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('beceUser');
  };

  const hasUsers = (): boolean => {
    return users.length > 0 || initialUsers.length > 0;
  };

  const createInitialAdmin = async (adminData: {
    email: string;
    password: string;
    fullName: string;
    username: string;
  }): Promise<boolean> => {
    // Only allow if no users exist yet
    if (hasUsers()) {
      return false;
    }

    const newAdmin: User = {
      id: `admin-${Date.now()}`,
      username: adminData.username,
      email: adminData.email,
      role: 'admin',
      fullName: adminData.fullName,
      createdAt: new Date().toISOString()
    };

    // Add to credentials
    userCredentials.push({
      email: adminData.email,
      password: adminData.password
    });

    // Add to users
    setUsers([newAdmin]);
    
    // Auto-login the new admin
    setUser(newAdmin);
    localStorage.setItem('beceUser', JSON.stringify(newAdmin));
    
    return true;
  };

  const generateAccessCode = (): string => {
    // Generate a new 8-character access code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'BECE';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Create expiry date (8 months from now)
    const createdAt = new Date();
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 8);
    
    currentAccessCode = result;
    currentAccessCodeWithExpiry = {
      code: result,
      createdAt,
      expiresAt
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('beceAccessCodeExpiry', JSON.stringify(currentAccessCodeWithExpiry));
    
    accessCodeHistory.push(result);
    return result;
  };

  const getCurrentAccessCode = (): string => {
    if (!currentAccessCode || !isAccessCodeValid(currentAccessCode)) {
      // Generate new access code if none exists or current one expired
      return generateAccessCode();
    }
    return currentAccessCode;
  };

  const getCodeExpiryInfo = (): { expiresAt: Date | null; daysRemaining: number } => {
    if (!currentAccessCodeWithExpiry) {
      return { expiresAt: null, daysRemaining: 0 };
    }
    
    const now = new Date();
    const daysRemaining = Math.ceil((currentAccessCodeWithExpiry.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      expiresAt: currentAccessCodeWithExpiry.expiresAt,
      daysRemaining: Math.max(0, daysRemaining)
    };
  };

  const sendCodeToWhatsApp = (phoneNumber: string, message?: string): void => {
    const { daysRemaining } = getCodeExpiryInfo();
    const validityText = daysRemaining > 30 ? '8 months' : `${daysRemaining} days`;
    const defaultMessage = message || `Your BECE 2026 access code is: ${currentAccessCode}. Use this code to login to the platform. Valid for ${validityText}.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const sendCodeViaSMS = (phoneNumber: string, message?: string): void => {
    const { daysRemaining } = getCodeExpiryInfo();
    const validityText = daysRemaining > 30 ? '8 months' : `${daysRemaining} days`;
    const defaultMessage = message || `Your BECE 2026 access code is: ${currentAccessCode}. Use this code to login to the platform. Valid for ${validityText}.`;
    const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(defaultMessage)}`;
    window.open(smsUrl, '_blank');
  };

  const sendCodeViaBoth = (phoneNumber: string, message?: string): void => {
    // Send via WhatsApp first
    sendCodeToWhatsApp(phoneNumber, message);
    
    // Send via SMS after a small delay
    setTimeout(() => {
      sendCodeViaSMS(phoneNumber, message);
    }, 1000);
  };

  const generateAndSendCode = (phoneNumber: string, method: 'whatsapp' | 'sms' | 'both' = 'whatsapp'): string => {
    const newCode = generateAccessCode();
    const { daysRemaining } = getCodeExpiryInfo();
    const validityText = daysRemaining > 30 ? '8 months' : `${daysRemaining} days`;
    const message = `🎓 BECE 2026 Platform Access Code\n\nYour new access code: ${newCode}\n\nThis code is valid for ${validityText}. Use it to login to the BECE 2026 Prediction Platform.\n\n📅 Expires: ${currentAccessCodeWithExpiry?.expiresAt.toLocaleDateString()}\n\n🆘 Need help? Reply to this message!`;
    
    // Send via selected method
    setTimeout(() => {
      switch (method) {
        case 'sms':
          sendCodeViaSMS(phoneNumber, message);
          break;
        case 'both':
          sendCodeViaBoth(phoneNumber, message);
          break;
        default:
          sendCodeToWhatsApp(phoneNumber, message);
          break;
      }
    }, 500); // Small delay to ensure code is generated
    
    return newCode;
  };

  const sendCodeToAdmin = (code: string, userPhone?: string, method?: string): void => {
    const adminPhone = '233540456414'; // +233540456414
    const timestamp = new Date().toLocaleString();
    const deliveryMethod = method || 'WhatsApp';
    const { expiresAt, daysRemaining } = getCodeExpiryInfo();
    const expiryInfo = expiresAt ? `\n📅 Expires: ${expiresAt.toLocaleDateString()} (${daysRemaining} days remaining)` : '';
    
    const message = `🤖 BECE 2026 - New Access Code Generated\n\n🔑 Code: ${code}\n📱 For User: ${userPhone || 'Manual Generation'}\n📤 Sent via: ${deliveryMethod}\n⏰ Generated: ${timestamp}${expiryInfo}\n\n✅ Code valid for 8 months\n✅ Share this code with the student\n\n--\nBECE 2026 Admin Notification`;
    
    // Always send admin notifications via WhatsApp
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const generateCodeForUser = (userPhone: string, method: 'whatsapp' | 'sms' | 'both' = 'whatsapp'): string => {
    const newCode = generateAccessCode();
    
    // Send code to user
    const { daysRemaining } = getCodeExpiryInfo();
    const validityText = daysRemaining > 30 ? '8 months' : `${daysRemaining} days`;
    const expiryDate = currentAccessCodeWithExpiry?.expiresAt.toLocaleDateString() || 'N/A';
    
    const userMessage = `🎓 BECE 2026 Platform Access Code\n\nYour new access code: ${newCode}\n\nUse this code to login to the BECE 2026 Prediction Platform.\n⏰ Valid for ${validityText}\n📅 Expires: ${expiryDate}\n\n📚 Start your BECE 2026 preparation now!\n\n🆘 Need help? Reply to this message!`;
    
    // Format user phone number
    let formattedUserPhone = userPhone.replace(/\s+/g, '');
    if (formattedUserPhone.startsWith('0')) {
      formattedUserPhone = '233' + formattedUserPhone.substring(1);
    }
    if (!formattedUserPhone.startsWith('233')) {
      formattedUserPhone = '233' + formattedUserPhone;
    }
    
    // Send to user via selected method
    setTimeout(() => {
      switch (method) {
        case 'sms':
          sendCodeViaSMS(formattedUserPhone, userMessage);
          break;
        case 'both':
          sendCodeViaBoth(formattedUserPhone, userMessage);
          break;
        default:
          sendCodeToWhatsApp(formattedUserPhone, userMessage);
          break;
      }
    }, 500);
    
    // Notify admin with delivery method info
    setTimeout(() => {
      const methodName = method === 'sms' ? 'SMS' : method === 'both' ? 'WhatsApp + SMS' : 'WhatsApp';
      sendCodeToAdmin(newCode, userPhone, methodName);
    }, 1000);
    
    return newCode;
  };

  // User management functions for admin
  const getAllUsers = (): User[] => {
    return [...users, ...initialUsers];
  };

  const createUser = async (userData: RegisterData & { password: string }): Promise<boolean> => {
    // Check if email already exists
    const allUsers = getAllUsers();
    const emailExists = allUsers.some(u => u.email === userData.email);
    const usernameExists = allUsers.some(u => u.username === userData.username);

    if (emailExists || usernameExists) {
      return false;
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      fullName: userData.fullName,
      createdAt: new Date().toISOString()
    };

    // Add to credentials
    userCredentials.push({
      email: userData.email,
      password: userData.password
    });

    // Add to users
    setUsers(prev => [...prev, newUser]);
    return true;
  };

  const updateUser = async (userId: string, userData: Partial<User>): Promise<boolean> => {
    try {
      setUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, ...userData, id: userId } // Keep original ID
            : user
        )
      );
      return true;
    } catch (error) {
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      // Don't allow deleting the current user or default admin
      if (user?.id === userId || userId === 'admin-default') {
        return false;
      }

      // Find user to get email for credential removal
      const userToDelete = users.find(u => u.id === userId);
      if (userToDelete) {
        // Remove from credentials
        const credIndex = userCredentials.findIndex(cred => cred.email === userToDelete.email);
        if (credIndex > -1) {
          userCredentials.splice(credIndex, 1);
        }
      }

      // Remove from users
      setUsers(prev => prev.filter(user => user.id !== userId));
      return true;
    } catch (error) {
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    createInitialAdmin,
    hasUsers,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student' || user?.role === 'teacher',
    generateAccessCode,
    getCurrentAccessCode,
    sendCodeToWhatsApp,
    sendCodeViaSMS,
    sendCodeViaBoth,
    generateAndSendCode,
    autoGenerateCodes,
    setAutoGenerateCodes,
    sendCodeToAdmin,
    generateCodeForUser,
    // User management functions
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
