import React, { useState } from 'react';
import {
  Box,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Paper,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { UserPlus, LogIn, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

interface AuthPageProps {
  adminMode?: boolean;
  onBack?: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ adminMode = false, onBack }) => {
  const { login, register } = useAuth();
  const [tabValue, setTabValue] = useState(adminMode ? 0 : 0); // Always start with login for both
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    accessCode: '',
    userType: 'student' as 'admin' | 'student'
  });

  // Registration form state
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'student' as 'admin' | 'student'
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(
        loginForm.email, 
        loginForm.password, 
        loginForm.userType === 'student' ? loginForm.accessCode : undefined
      );
      if (!success) {
        if (loginForm.userType === 'student' && !loginForm.accessCode) {
          setError('Access code is required for student login');
        } else if (loginForm.userType === 'student') {
          setError('Invalid email, password, or access code');
        } else {
          setError('Invalid email or password');
        }
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const success = await register({
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
        fullName: registerForm.fullName,
        role: registerForm.role
      });

      if (!success) {
        setError('Email or username already exists');
      } else {
        setSuccess('Registration successful! You are now logged in.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={8} sx={{ overflow: 'hidden' }}>
          {/* Header */}
          <Box sx={{ 
            background: adminMode 
              ? 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)'
              : 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            color: 'white',
            p: 4,
            textAlign: 'center',
            position: 'relative'
          }}>
            {onBack && (
              <Button
                onClick={onBack}
                sx={{ 
                  position: 'absolute', 
                  left: 16, 
                  top: 16,
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                ← Back
              </Button>
            )}
            <BookOpen size={48} style={{ marginBottom: 16 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              {adminMode ? 'Admin Portal' : 'BECE 2026 Prediction'}
            </Typography>
            <Typography variant="subtitle1">
              {adminMode ? 'Platform Administration' : 'Your Gateway to BECE Success'}
            </Typography>
          </Box>



          {/* WhatsApp Contact for Access Code */}
          <Box sx={{ p: 3, bgcolor: 'rgba(37, 211, 102, 0.1)', borderBottom: 1, borderColor: 'rgba(37, 211, 102, 0.3)' }}>
            <Typography variant="subtitle2" sx={{ color: '#25D366', fontWeight: 'bold', mb: 1 }}>
              📱 Need Access Code? WhatsApp Us!
            </Typography>
            <Typography variant="h6" sx={{ color: '#25D366', fontWeight: 'bold', mb: 1 }}>
              054045614
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Get instant access codes and technical support
            </Typography>
            <Button
              size="small"
              variant="contained"
              sx={{ 
                bgcolor: '#25D366', 
                '&:hover': { bgcolor: '#128C7E' },
                color: 'white'
              }}
              href="https://wa.me/233540456149?text=Hi! I need an access code for BECE 2026 Prediction Platform"
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 Get Code on WhatsApp
            </Button>
          </Box>

          <CardContent sx={{ p: 0 }}>
            {/* Tabs */}
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab 
                label="Login" 
                icon={<LogIn size={20} />}
                iconPosition="start"
              />
              <Tab 
                label="Register" 
                icon={<UserPlus size={20} />}
                iconPosition="start"
              />
            </Tabs>

            {/* Error/Success Messages */}
            <Box sx={{ p: 3, pb: 0 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}
            </Box>

            {/* Login Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 3, pt: 0 }}>
                <form onSubmit={handleLogin}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => { setLoginForm(prev => ({ ...prev, email: e.target.value })); }}
                    margin="normal"
                    required
                    autoComplete="email"
                  />
                  
                  <FormControl fullWidth margin="normal">
                    <InputLabel>User Type</InputLabel>
                    <Select
                      value={loginForm.userType}
                      onChange={(e) => { setLoginForm(prev => ({ 
                        ...prev, 
                        userType: e.target.value,
                        accessCode: e.target.value === 'admin' ? '' : prev.accessCode
                      })); }}
                      label="User Type"
                    >
                      <MenuItem value="student">Student</MenuItem>
                      <MenuItem value="admin">Administrator</MenuItem>
                    </Select>
                  </FormControl>

                  {loginForm.userType === 'student' && (
                    <TextField
                      fullWidth
                      label="Access Code (Required for Students)"
                      type="text"
                      value={loginForm.accessCode}
                      onChange={(e) => { setLoginForm(prev => ({ ...prev, accessCode: e.target.value.toUpperCase() })); }}
                      margin="normal"
                      required
                      placeholder="Enter access code from your teacher"
                      helperText="Ask your teacher for the current access code"
                    />
                  )}
                  
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => { setLoginForm(prev => ({ ...prev, password: e.target.value })); }}
                    margin="normal"
                    required
                    autoComplete="current-password"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <LogIn size={20} />}
                    sx={{ mt: 3, mb: 2, py: 1.5 }}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </Box>
            </TabPanel>

            {/* Register Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 3, pt: 0 }}>
                <form onSubmit={handleRegister}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={registerForm.fullName}
                    onChange={(e) => { setRegisterForm(prev => ({ ...prev, fullName: e.target.value })); }}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Username"
                    value={registerForm.username}
                    onChange={(e) => { setRegisterForm(prev => ({ ...prev, username: e.target.value })); }}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => { setRegisterForm(prev => ({ ...prev, email: e.target.value })); }}
                    margin="normal"
                    required
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={registerForm.role}
                      onChange={(e) => { setRegisterForm(prev => ({ ...prev, role: e.target.value })); }}
                      label="Role"
                    >
                      <MenuItem value="student">Student</MenuItem>
                      <MenuItem value="admin">Administrator</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => { setRegisterForm(prev => ({ ...prev, password: e.target.value })); }}
                    margin="normal"
                    required
                    helperText="Minimum 6 characters"
                  />
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    value={registerForm.confirmPassword}
                    onChange={(e) => { setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value })); }}
                    margin="normal"
                    required
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <UserPlus size={20} />}
                    sx={{ mt: 3, mb: 2, py: 1.5 }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </Box>
            </TabPanel>
          </CardContent>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default AuthPage;
