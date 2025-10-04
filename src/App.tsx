import { useState } from 'react';
import { 
  Container, 
  Box, 
  ThemeProvider, 
  createTheme,
  CssBaseline,
  Tab,
  Tabs,
  Fab,
  Tooltip,
  Typography,
  LinearProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import AdminDashboard from './components/AdminDashboard.tsx';
import SubjectManagerGlobal from './components/SubjectManagerGlobal.tsx';
import QuestionManagerGlobal from './components/QuestionManagerGlobal.tsx';
import PredictionManagerGlobal from './components/PredictionManagerGlobal.tsx';
import StudentView from './components/StudentView.tsx';
import AuthPage from './components/AuthPage.tsx';
import AppHeader from './components/AppHeader.tsx';
import LandingPage from './components/LandingPage.tsx';
import InitialSetup from './components/InitialSetup.tsx';
import GlobalStateMonitor from './components/GlobalStateMonitor.tsx';
import { GlobalStateProvider, useGlobalState } from './contexts/GlobalStateContext.tsx';
import { useAuth } from './contexts/AuthContext';
import { beceTopics, activePredictions } from './sampleData';
import type { Topic, PredictedTopic } from './types';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const AppContent: React.FC = () => {
  const { isAuthenticated, isAdmin, hasUsers, createInitialAdmin } = useAuth();
  const { subjects, questions, loading: globalLoading } = useGlobalState();
  const [currentTab, setCurrentTab] = useState(0);
  const [showStudentAuth, setShowStudentAuth] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  
  // Use fallback data while global state is loading
  const [topics] = useState<Topic[]>(beceTopics);
  const [predictedTopics] = useState<PredictedTopic[]>(activePredictions);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Show loading while global state initializes
  if (globalLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStateMonitor />
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography variant="h5">🚀 Loading BECE 2026 Platform...</Typography>
          <Typography variant="body1">Synchronizing data across all devices...</Typography>
          <LinearProgress sx={{ width: 300 }} />
        </Box>
      </ThemeProvider>
    );
  }

  // Show initial setup if no users exist
  if (!hasUsers()) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStateMonitor />
        <InitialSetup onSetupComplete={createInitialAdmin} />
      </ThemeProvider>
    );
  }

  // Show authentication page when requested
  if ((showStudentAuth || showAdminAuth) && !isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStateMonitor />
        <AuthPage 
          adminMode={showAdminAuth}
          onBack={() => {
            setShowStudentAuth(false);
            setShowAdminAuth(false);
          }}
        />
      </ThemeProvider>
    );
  }

  // If authenticated as admin, show admin dashboard
  if (isAuthenticated && isAdmin) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStateMonitor />
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <AppHeader />
          
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={currentTab} onChange={handleTabChange} aria-label="admin tabs">
                <Tab label="Dashboard" />
                <Tab label="Subjects" />
                <Tab label="Questions" />
                <Tab label="Predictions" />
                <Tab label="Student View" />
              </Tabs>
            </Box>
            
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentTab === 0 && (
                <AdminDashboard 
                  subjects={subjects}
                  topics={topics}
                  questions={questions}
                  predictedTopics={predictedTopics}
                />
              )}
              {currentTab === 1 && (
                <SubjectManagerGlobal
                  subjects={subjects}
                  topics={topics}
                />
              )}
              {currentTab === 2 && (
                <QuestionManagerGlobal
                  subjects={subjects}
                  topics={topics}
                  questions={questions}
                />
              )}
              {currentTab === 3 && (
                <PredictionManagerGlobal
                  subjects={subjects}
                  topics={topics}
                  questions={questions}
                  predictedTopics={predictedTopics}
                />
              )}
              {currentTab === 4 && (
                <StudentView
                  subjects={subjects}
                  topics={topics}
                  questions={questions}
                  predictedTopics={predictedTopics}
                />
              )}
            </motion.div>
          </Box>
        </Container>
        
        {/* Floating WhatsApp Button */}
        <Tooltip title="WhatsApp: 054045614" placement="left">
          <Fab
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              bgcolor: '#25D366',
              color: 'white',
              zIndex: 1000,
              boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
              '&:hover': {
                bgcolor: '#128C7E',
                transform: 'scale(1.1)',
                transition: 'all 0.3s ease'
              }
            }}
            href="https://wa.me/233540456149?text=Hi! I need help with BECE 2026 Prediction Platform"
            target="_blank"
            rel="noopener noreferrer"
            component="a"
          >
            💬
          </Fab>
        </Tooltip>
      </ThemeProvider>
    );
  }

  // If authenticated as student, show student view
  if (isAuthenticated && !isAdmin) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStateMonitor />
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <AppHeader />
          <StudentView
            subjects={subjects}
            topics={topics}
            questions={questions}
            predictedTopics={predictedTopics}
          />
        </Container>
        
        {/* Floating WhatsApp Button */}
        <Tooltip title="WhatsApp: 054045614" placement="left">
          <Fab
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              bgcolor: '#25D366',
              color: 'white',
              zIndex: 1000,
              boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
              '&:hover': {
                bgcolor: '#128C7E',
                transform: 'scale(1.1)',
                transition: 'all 0.3s ease'
              }
            }}
            href="https://wa.me/233540456149?text=Hi! I need help with BECE 2026 Prediction Platform"
            target="_blank"
            rel="noopener noreferrer"
            component="a"
          >
            💬
          </Fab>
        </Tooltip>
      </ThemeProvider>
    );
  }

  // Default: Always show landing page with both login options
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStateMonitor />
      <LandingPage 
        onGetStarted={() => setShowStudentAuth(true)}
        onAdminLogin={() => setShowAdminAuth(true)}
      />
    </ThemeProvider>
  );
};

export default function App() {
  return (
    <GlobalStateProvider>
      <AppContent />
    </GlobalStateProvider>
  );
}
