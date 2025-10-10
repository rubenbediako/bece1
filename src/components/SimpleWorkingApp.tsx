import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Card, 
  CardContent, 
  Chip, 
  Paper, 
  Stack,
  Avatar,
  CircularProgress
} from '@mui/material';
import { 
  School, 
  TrendingUp, 
  Psychology, 
  Quiz, 
  CheckCircle, 
  ArrowForward,
  AdminPanelSettings,
  AutoAwesome,
  BugReport,
  Login,
  Logout,
  Person
} from '@mui/icons-material';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';
import DatabaseTest from './DatabaseTest';
import AuthPage from './AuthPage';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

const SimpleWorkingApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'student' | 'admin' | 'database-test' | 'auth' | 'admin-auth'>('home');
  const { subjects, getPredictionTopics, predictions } = useAppContext();
  const { user, isAuthenticated, logout, isAdmin, isStudent } = useAuth();

  // Show authentication page if not authenticated and trying to access protected routes
  if (currentView === 'auth') {
    return <AuthPage onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'admin-auth') {
    return <AuthPage adminMode onBack={() => setCurrentView('home')} />;
  }

  // Protect admin routes
  if (currentView === 'admin' && (!isAuthenticated || !isAdmin)) {
    return <AuthPage adminMode onBack={() => setCurrentView('home')} />;
  }

  // Protect student routes (optional - you can allow guest access)
  if (currentView === 'student' && !isAuthenticated) {
    return <AuthPage onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'student') {
    return <StudentDashboard onBackToHome={() => setCurrentView('home')} />;
  }

  if (currentView === 'admin') {
    return <AdminDashboard onBackToHome={() => setCurrentView('home')} />;
  }

  if (currentView === 'database-test') {
    return (
      <Box>
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Button 
            variant="outlined" 
            onClick={() => setCurrentView('home')}
            sx={{ color: 'white', borderColor: 'white' }}
          >
            ← Back to Home
          </Button>
        </Box>
        <DatabaseTest />
      </Box>
    );
  }

  const predictionTopics = getPredictionTopics();
  const totalQuestions = subjects.reduce((total: number, _subject: any) => total + 25, 0);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 8,
        textAlign: 'center'
      }}>
        <Container maxWidth="lg">
          {/* User Authentication Section */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            {isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    <Person />
                  </Avatar>
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {user?.fullName}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<Logout />}
                  onClick={logout}
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      background: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Logout
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Login />}
                  onClick={() => setCurrentView('auth')}
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      background: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Student Login
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AdminPanelSettings />}
                  onClick={() => setCurrentView('admin-auth')}
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      background: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Admin Login
                </Button>
              </Box>
            )}
          </Box>

          <Typography variant="h2" sx={{ mb: 3, fontWeight: 900 }}>
            🎯 BECE 2026 Platform
          </Typography>
          
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            AI-powered exam preparation platform designed specifically for Ghanaian students preparing for their Basic Education Certificate Examination
          </Typography>
          
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 4,
            mb: 6,
            textAlign: 'center'
          }}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#FFD700' }}>10K+</Typography>
              <Typography variant="h6">Students</Typography>
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#FFD700' }}>95%</Typography>
              <Typography variant="h6">Success Rate</Typography>
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#FFD700' }}>{subjects.length}</Typography>
              <Typography variant="h6">Subjects</Typography>
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#FFD700' }}>{totalQuestions}+</Typography>
              <Typography variant="h6">Questions</Typography>
            </Box>
          </Box>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
            <Button 
              variant="contained" 
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                px: 4,
                py: 2,
                fontSize: '1.2rem',
                borderRadius: 3,
                boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
              }}
              onClick={() => setCurrentView('student')}
            >
              🚀 Start Learning
            </Button>
            
            {(isAuthenticated && isAdmin) && (
              <Button 
                variant="outlined" 
                size="large"
                startIcon={<AdminPanelSettings />}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 2,
                  fontSize: '1.2rem',
                  borderRadius: 3,
                  border: '2px solid white',
                  '&:hover': {
                    borderColor: 'white',
                    background: 'rgba(255,255,255,0.1)',
                    border: '2px solid white'
                  }
                }}
                onClick={() => setCurrentView('admin')}
              >
                Admin Dashboard
              </Button>
            )}
            
            <Button 
              variant="outlined" 
              size="large"
              startIcon={<BugReport />}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                borderRadius: 3,
                border: '2px solid white',
                '&:hover': {
                  borderColor: 'white',
                  background: 'rgba(255,255,255,0.1)',
                  border: '2px solid white'
                }
              }}
              onClick={() => setCurrentView('database-test')}
            >
              Database Test
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, mb: 6 }}>
          🌟 Platform Features
        </Typography>
        
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 4
        }}>
          <Card sx={{ height: '100%', boxShadow: 3, '&:hover': { boxShadow: 6 } }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Psychology sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight="bold">
                AI Predictions
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Advanced AI algorithms analyze past BECE papers to predict likely exam questions and topics
              </Typography>
              <Chip label={`${predictionTopics.length} Active Predictions`} color="primary" />
            </CardContent>
          </Card>
          
          <Card sx={{ height: '100%', boxShadow: 3, '&:hover': { boxShadow: 6 } }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Quiz sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Smart Practice
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Practice with questions tailored to your learning level and exam requirements
              </Typography>
              <Chip label="Adaptive Learning" color="secondary" />
            </CardContent>
          </Card>
          
          <Card sx={{ height: '100%', boxShadow: 3, '&:hover': { boxShadow: 6 } }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <TrendingUp sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Progress Tracking
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Monitor your learning progress and identify areas that need more attention
              </Typography>
              <Chip label="Real-time Analytics" color="success" />
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Subjects Overview */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, mb: 6 }}>
            📚 BECE Subjects
          </Typography>
          
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3
          }}>
            {subjects.map((subject: any) => (
              <Card 
                key={subject.id}
                sx={{ 
                  height: '100%', 
                  boxShadow: 2,
                  '&:hover': { 
                    boxShadow: 4, 
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s ease'
                  } 
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ 
                      bgcolor: subject.color, 
                      mr: 2, 
                      width: 50, 
                      height: 50,
                      fontSize: '1.5rem'
                    }}>
                      {subject.icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      {subject.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {subject.description}
                  </Typography>
                  <Chip 
                    label="Available" 
                    color="success" 
                    size="small"
                    icon={<CheckCircle />}
                  />
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Predictions Showcase */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
          🔮 AI Predictions
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
          Topics our AI predicts will likely appear in BECE 2026
        </Typography>
        
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3
        }}>
          {predictions.slice(0, 6).map((prediction: any) => {
            const topic = predictionTopics.find((t: any) => t.id === prediction.topicId);
            const subject = subjects.find((s: any) => s.id === topic?.subjectId);
            
            return (
              <Paper 
                key={prediction.id}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: prediction.priority === 'High' ? '2px solid #ff9800' : '1px solid #e0e0e0',
                  '&:hover': { boxShadow: 4 }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: subject?.color, mr: 2, width: 40, height: 40 }}>
                    {subject?.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {topic?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {subject?.name}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {prediction.description}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label={`${prediction.probability}% Likely`}
                    color={prediction.probability > 90 ? 'error' : prediction.probability > 80 ? 'warning' : 'info'}
                    size="small"
                  />
                  <Chip 
                    label={prediction.priority}
                    color={prediction.priority === 'High' ? 'error' : prediction.priority === 'Medium' ? 'warning' : 'default'}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Paper>
            );
          })}
        </Box>
        
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => setCurrentView('student')}
            endIcon={<ArrowForward />}
          >
            View All Predictions
          </Button>
        </Box>
      </Container>

      {/* Platform Status */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
            gap: 4,
            alignItems: 'center'
          }}>
            <Box>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                ✅ Platform Status: FULLY OPERATIONAL
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                All systems are running smoothly. Ready for your BECE 2026 preparation journey!
              </Typography>
            </Box>
            <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                Technical Stack
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                  <CheckCircle sx={{ mr: 1, fontSize: 20 }} />
                  <Typography>React + TypeScript</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                  <CheckCircle sx={{ mr: 1, fontSize: 20 }} />
                  <Typography>Material-UI Design</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                  <CheckCircle sx={{ mr: 1, fontSize: 20 }} />
                  <Typography>AI-Powered Analytics</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                  <CheckCircle sx={{ mr: 1, fontSize: 20 }} />
                  <Typography>Responsive Design</Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* Call to Action */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
          {isAuthenticated ? `Welcome back, ${user?.fullName?.split(' ')[0]}! 👋` : 'Ready to Ace Your BECE 2026? 🏆'}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          {isAuthenticated 
            ? 'Continue your BECE 2026 preparation journey' 
            : 'Join thousands of students already using our platform to prepare for success'
          }
        </Typography>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
          <Button 
            variant="contained" 
            size="large"
            startIcon={<School />}
            endIcon={<ArrowForward />}
            onClick={() => setCurrentView('student')}
            sx={{
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              borderRadius: 3
            }}
          >
            {isAuthenticated ? 'Continue Learning' : 'Start Learning Now'}
          </Button>
          
          {!isAuthenticated && (
            <Button 
              variant="outlined" 
              size="large"
              startIcon={<Login />}
              onClick={() => setCurrentView('auth')}
              sx={{
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                borderRadius: 3
              }}
            >
              Sign Up / Login
            </Button>
          )}
          
          {isAuthenticated && (
            <Button 
              variant="outlined" 
              size="large"
              startIcon={<AutoAwesome />}
              onClick={() => setCurrentView('student')}
              sx={{
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                borderRadius: 3
              }}
            >
              Explore Predictions
            </Button>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default SimpleWorkingApp;
