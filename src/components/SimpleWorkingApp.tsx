import { useState } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';

const SimpleWorkingApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'student' | 'admin'>('home');

  if (currentView === 'student') {
    return <StudentDashboard onBackToHome={() => setCurrentView('home')} />;
  }

  if (currentView === 'admin') {
    return <AdminDashboard onBackToHome={() => setCurrentView('home')} />;
  }
  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textAlign: 'center',
      padding: 2
    }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ mb: 3, fontWeight: 900 }}>
          🎯 BECE 2026 Platform
        </Typography>
        
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          AI-powered exam preparation for Ghanaian students
        </Typography>
        
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 2,
          mb: 4,
          textAlign: 'center'
        }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>10K+</Typography>
            <Typography>Students</Typography>
          </Box>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>95%</Typography>
            <Typography>Success Rate</Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            size="large"
            sx={{
              background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
              px: 4,
              py: 2,
              fontSize: '1.1rem'
            }}
            onClick={() => setCurrentView('student')}
          >
            🚀 Start Learning
          </Button>
          
          <Button 
            variant="outlined" 
            size="large"
            sx={{
              borderColor: 'white',
              color: 'white',
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              '&:hover': {
                borderColor: 'white',
                background: 'rgba(255,255,255,0.1)'
              }
            }}
            onClick={() => setCurrentView('admin')}
          >
            👨‍💼 Admin Login
          </Button>
        </Box>
        
        <Box sx={{ 
          mt: 4, 
          p: 3, 
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 2,
          backdropFilter: 'blur(10px)'
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            ✅ Platform Status: WORKING
          </Typography>
          <Typography sx={{ opacity: 0.9 }}>
            React ✅ | TypeScript ✅ | Material-UI ✅ | Responsive ✅
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default SimpleWorkingApp;
