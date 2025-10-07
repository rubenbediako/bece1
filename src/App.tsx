import { useState } from 'react';
import {
  Container,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Tab,
  Tabs,
  Typography,
  LinearProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import AdminDashboard from './components/AdminDashboard.tsx';
import SubjectManagerGlobal from './components/SubjectManagerGlobal.tsx';
import QuestionManagerGlobal from './components/QuestionManagerGlobal.tsx';
import PredictionManagerGlobal from './components/PredictionManagerGlobal.tsx';
import ModernStudentView from './components/ModernStudentView.tsx';
import AuthPage from './components/AuthPage.tsx';
import AppHeader from './components/AppHeader.tsx';
import ModernAppHeader from './components/ModernAppHeader.tsx';
import ModernLandingPageFixed from './components/ModernLandingPageFixed.tsx';
import InitialSetup from './components/InitialSetup.tsx';
import GlobalStateMonitor from './components/GlobalStateMonitor.tsx';
import PWAInstallPrompt from './components/PWAInstallPrompt.tsx';
import PWAStatus from './components/PWAStatus.tsx';
import { GlobalStateProvider, useGlobalState } from './contexts/GlobalStateContext.tsx';
import { FirebaseProvider, useFirebase } from './contexts/FirebaseContext.tsx';
import { FirebaseGlobalStateProvider, useFirebaseGlobalState } from './contexts/FirebaseGlobalStateContext.tsx';
import { useAuth } from './contexts/AuthContext';
import { beceTopics, activePredictions } from './sampleData';
import type { Topic, PredictedTopic } from './types';
import './App-modern.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb', // Modern blue
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7c3aed', // Modern purple
      light: '#8b5cf6',
      dark: '#6d28d9',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#475569',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#64748b',
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.025em',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          '&.Mui-selected': {
            color: '#2563eb',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 8,
          background: '#e2e8f0',
        },
        bar: {
          borderRadius: 8,
          background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)',
        },
      },
    },
  },
});

// Firebase-enabled App Content
const FirebaseAppContent: React.FC = () => {
  const firebase = useFirebase();
  const globalState = useFirebaseGlobalState();
  
  const [currentTab, setCurrentTab] = useState(0);
  const [showStudentAuth, setShowStudentAuth] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  
  // Use Firebase data or fallback data
  const subjects = globalState.subjects;
  const questions = globalState.questions;
  const topics = globalState.topics.length > 0 ? globalState.topics : beceTopics;
  const predictedTopics = globalState.predictions.length > 0 ? globalState.predictions : activePredictions;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Show loading while initializing
  if (firebase.loading || globalState.loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PWAStatus />
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
          <Typography variant="body1">Connecting to Firebase...</Typography>
          <LinearProgress sx={{ width: 300 }} />
        </Box>
      </ThemeProvider>
    );
  }

  // Show initial setup if no users exist
  if (!firebase.hasUsers) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PWAStatus />
        <GlobalStateMonitor />
        <InitialSetup onSetupComplete={firebase.createInitialAdmin} />
      </ThemeProvider>
    );
  }

  // Show authentication page when requested
  if ((showStudentAuth || showAdminAuth) && !firebase.isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PWAStatus />
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
  if (firebase.isAuthenticated && firebase.isAdmin) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PWAStatus />
        <PWAInstallPrompt />
        <GlobalStateMonitor />
        
        <Box sx={{ 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          minHeight: '100vh',
        }}>
          <AppHeader />
          
          <Container maxWidth="xl" sx={{ py: 2 }}>
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
                  <ModernStudentView
                    subjects={subjects}
                    topics={topics}
                    questions={questions}
                    predictedTopics={predictedTopics}
                  />
                )}
              </motion.div>
            </Box>
          </Container>
        </Box>
        
        {/* Modern Floating WhatsApp Button */}
        <Box
          component="a"
          href="https://wa.me/233540456149?text=Hi! I need help with BECE 2026 Prediction Platform"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            textDecoration: 'none',
            boxShadow: '0 8px 32px rgba(37, 211, 102, 0.3)',
            zIndex: 1000,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1) translateY(-2px)',
              boxShadow: '0 12px 40px rgba(37, 211, 102, 0.4)',
            },
          }}
        >
          💬
        </Box>
      </ThemeProvider>
    );
  }

  // If authenticated as student, show student view
  if (firebase.isAuthenticated && !firebase.isAdmin) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PWAStatus />
        <PWAInstallPrompt />
        <GlobalStateMonitor />
        
        <Box sx={{ 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          minHeight: '100vh',
        }}>
          <ModernAppHeader />
          
          <Container maxWidth="xl" sx={{ py: 2 }}>
            <ModernStudentView
              subjects={subjects}
              topics={topics}
              questions={questions}
              predictedTopics={predictedTopics}
            />
          </Container>
        </Box>
        
        {/* Modern Floating WhatsApp Button */}
        <Box
          component="a"
          href="https://wa.me/233540456149?text=Hi! I need help with BECE 2026 Prediction Platform"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            textDecoration: 'none',
            boxShadow: '0 8px 32px rgba(37, 211, 102, 0.3)',
            zIndex: 1000,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1) translateY(-2px)',
              boxShadow: '0 12px 40px rgba(37, 211, 102, 0.4)',
            },
          }}
        >
          💬
        </Box>
      </ThemeProvider>
    );
  }

  // Default: Always show landing page with both login options
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PWAStatus />
      <PWAInstallPrompt />
      <GlobalStateMonitor />
      <ModernLandingPageFixed 
        onGetStarted={() => setShowStudentAuth(true)}
        onAdminLogin={() => setShowAdminAuth(true)}
      />
    </ThemeProvider>
  );
};

// Legacy App Content (for backward compatibility)
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
        <PWAStatus />
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
        <PWAStatus />
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
        <PWAStatus />
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
        <PWAStatus />
        <PWAInstallPrompt />
        <GlobalStateMonitor />
        
        <Box sx={{ 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          minHeight: '100vh',
        }}>
          <AppHeader />
          
          <Container maxWidth="xl" sx={{ py: 2 }}>
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
                  <ModernStudentView
                    subjects={subjects}
                    topics={topics}
                    questions={questions}
                    predictedTopics={predictedTopics}
                  />
                )}
              </motion.div>
            </Box>
          </Container>
        </Box>
        
        {/* Modern Floating WhatsApp Button */}
        <Box
          component="a"
          href="https://wa.me/233540456149?text=Hi! I need help with BECE 2026 Prediction Platform"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            textDecoration: 'none',
            boxShadow: '0 8px 32px rgba(37, 211, 102, 0.3)',
            zIndex: 1000,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1) translateY(-2px)',
              boxShadow: '0 12px 40px rgba(37, 211, 102, 0.4)',
            },
          }}
        >
          💬
        </Box>
      </ThemeProvider>
    );
  }

  // If authenticated as student, show student view
  if (isAuthenticated && !isAdmin) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PWAStatus />
        <PWAInstallPrompt />
        <GlobalStateMonitor />
        
        <Box sx={{ 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          minHeight: '100vh',
        }}>
          <ModernAppHeader />
          
          <Container maxWidth="xl" sx={{ py: 2 }}>
            <ModernStudentView
              subjects={subjects}
              topics={topics}
              questions={questions}
              predictedTopics={predictedTopics}
            />
          </Container>
        </Box>
        
        {/* Modern Floating WhatsApp Button */}
        <Box
          component="a"
          href="https://wa.me/233540456149?text=Hi! I need help with BECE 2026 Prediction Platform"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            textDecoration: 'none',
            boxShadow: '0 8px 32px rgba(37, 211, 102, 0.3)',
            zIndex: 1000,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1) translateY(-2px)',
              boxShadow: '0 12px 40px rgba(37, 211, 102, 0.4)',
            },
          }}
        >
          💬
        </Box>
      </ThemeProvider>
    );
  }

  // Default: Always show landing page with both login options
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PWAStatus />
      <PWAInstallPrompt />
      <GlobalStateMonitor />
      <ModernLandingPageFixed 
        onGetStarted={() => setShowStudentAuth(true)}
        onAdminLogin={() => setShowAdminAuth(true)}
      />
    </ThemeProvider>
  );
};

export default function App() {
  // Check if Firebase is configured
  const useFirebaseAuth = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  
  if (useFirebaseAuth) {
    // Use Firebase providers
    return (
      <FirebaseProvider>
        <FirebaseGlobalStateProvider>
          <FirebaseAppContent />
        </FirebaseGlobalStateProvider>
      </FirebaseProvider>
    );
  } else {
    // Use legacy providers
    return (
      <GlobalStateProvider>
        <AppContent />
      </GlobalStateProvider>
    );
  }
}
