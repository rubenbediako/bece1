import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import SimpleWorkingApp from './components/SimpleWorkingApp';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#7c3aed',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
});

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SimpleWorkingApp />
        </ThemeProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
