import React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
} from '@mui/material';

interface TestLandingPageProps {
  onGetStarted: () => void;
  onAdminLogin: () => void;
}

const TestLandingPage: React.FC<TestLandingPageProps> = ({
  onGetStarted,
  onAdminLogin,
}) => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      p: 3
    }}>
      <Typography variant="h1" sx={{ mb: 3, textAlign: 'center' }}>
        🚀 BECE 2026 Platform
      </Typography>
      <Typography variant="h5" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
        Welcome to the future of BECE preparation
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', maxWidth: 600 }}>
        Your AI-powered platform for BECE 2026 exam preparation with modern Quantic.edu-inspired design,
        Firebase backend, and real-time data synchronization.
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button 
          variant="contained" 
          size="large" 
          onClick={onGetStarted}
          sx={{ px: 4, py: 2 }}
        >
          Get Started as Student
        </Button>
        <Button 
          variant="outlined" 
          size="large" 
          onClick={onAdminLogin}
          sx={{ px: 4, py: 2 }}
        >
          Admin Login
        </Button>
      </Stack>
      <Typography variant="caption" sx={{ mt: 4, color: 'text.secondary' }}>
        App Status: ✅ Working | Firebase: {import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Connected' : '❌ Not configured'}
      </Typography>
    </Box>
  );
};

export default TestLandingPage;
