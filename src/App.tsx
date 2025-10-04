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
  Tooltip
} from '@mui/material';
import { motion } from 'framer-motion';
import AdminDashboard from './components/AdminDashboard.tsx';
import SubjectManager from './components/SubjectManager.tsx';
import QuestionManager from './components/QuestionManager.tsx';
import PredictionManager from './components/PredictionManager.tsx';
import StudentView from './components/StudentView.tsx';
import AuthPage from './components/AuthPage.tsx';
import AppHeader from './components/AppHeader.tsx';
import LandingPage from './components/LandingPage.tsx';
import InitialSetup from './components/InitialSetup.tsx';
import GlobalStateMonitor from './components/GlobalStateMonitor.tsx';
import { GlobalStateProvider } from './contexts/GlobalStateContext.tsx';
import { useAuth } from './contexts/AuthContext';
import { beceSubjects, beceTopics, beceQuestions, activePredictions } from './sampleData';
import type { Subject, Topic, Question, PredictedTopic } from './types';
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

export default function App() {
  const { isAuthenticated, isAdmin, hasUsers, createInitialAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [showStudentAuth, setShowStudentAuth] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>(beceSubjects);
  const [topics, setTopics] = useState<Topic[]>(beceTopics);
  const [questions, setQuestions] = useState<Question[]>(beceQuestions);
  const [predictedTopics, setPredictedTopics] = useState<PredictedTopic[]>(activePredictions);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Wrap everything in GlobalStateProvider
  const renderContent = () => {
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
                  <SubjectManager
                    subjects={subjects}
                    setSubjects={setSubjects}
                    topics={topics}
                    setTopics={setTopics}
                  />
                )}
                {currentTab === 2 && (
                  <QuestionManager
                    subjects={subjects}
                    topics={topics}
                    questions={questions}
                    setQuestions={setQuestions}
                  />
                )}
                {currentTab === 3 && (
                  <PredictionManager
                    subjects={subjects}
                    topics={topics}
                    questions={questions}
                    predictedTopics={predictedTopics}
                    setPredictedTopics={setPredictedTopics}
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

  return (
    <GlobalStateProvider>
      {renderContent()}
    </GlobalStateProvider>
  );
}
