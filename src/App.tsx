import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useState } from 'react';
import SimpleWorkingApp from './components/SimpleWorkingApp';
import InitialSetup from './components/InitialSetup';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    success: {
      main: '#388e3c',
    },
    error: {
      main: '#d32f2f',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const AppContent: React.FC = () => {
  const { user, hasUsers, createInitialAdmin } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'app'>('landing');
  const [adminMode, setAdminMode] = useState(false);

  // If user is logged in, show main app
  if (user) {
    return <SimpleWorkingApp />;
  }

  // If no users exist, show initial setup
  if (!hasUsers()) {
    return <InitialSetup onSetupComplete={createInitialAdmin} />;
  }

  // Show landing page, auth, or main app based on current view
  switch (currentView) {
    case 'auth':
      return (
        <AuthPage
          adminMode={adminMode}
          onBack={() => setCurrentView('landing')}
        />
      );
    case 'app':
      return <SimpleWorkingApp />;
    default:
      return (
        <LandingPage
          onNavigateToAuth={(isAdmin) => {
            setAdminMode(isAdmin);
            setCurrentView('auth');
          }}
        />
      );
  }
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppContent />
        </ThemeProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
