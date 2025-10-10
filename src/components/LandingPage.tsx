import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Paper,
  Stack,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  School,
  TrendingUp,
  VolumeUp,
  Users,
  BookOpen,
  Award,
  PlayCircle,
  HeadphonesIcon,
  BrainCircuit,
  Target,
  Menu as MenuIcon,
  LoginIcon,
  UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onNavigateToAuth: (adminMode: boolean) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToAuth }) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const features = [
    {
      icon: <BrainCircuit size={48} />,
      title: 'AI-Powered Predictions',
      description: 'Advanced algorithms analyze past papers to predict likely BECE 2026 topics with high accuracy.',
      color: '#1976d2'
    },
    {
      icon: <HeadphonesIcon size={48} />,
      title: 'Audio Explanations',
      description: 'Listen to detailed solution explanations with customizable voice settings and teaching styles.',
      color: '#9c27b0'
    },
    {
      icon: <Target size={48} />,
      title: 'Focused Learning',
      description: 'Study efficiently with topic predictions and comprehensive question banks for all subjects.',
      color: '#388e3c'
    },
    {
      icon: <Award size={48} />,
      title: 'Proven Results',
      description: 'Join thousands of students who have improved their BECE performance using our platform.',
      color: '#f57c00'
    }
  ];

  const subjects = [
    'Social Studies', 'RME', 'English Language', 'Mathematics', 
    'Integrated Science', 'Ghanaian Language', 'French'
  ];

  const stats = [
    { number: '10,000+', label: 'Students Helped' },
    { number: '95%', label: 'Success Rate' },
    { number: '1,500+', label: 'Practice Questions' },
    { number: '24/7', label: 'Platform Access' }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Navigation */}
      <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <School size={32} color="#1976d2" />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              BECE 2026 Prediction
            </Typography>
          </Box>

          {!isMobile ? (
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<LoginIcon size={20} />}
                onClick={() => onNavigateToAuth(false)}
              >
                Student Login
              </Button>
              <Button
                variant="contained"
                startIcon={<UserPlus size={20} />}
                onClick={() => onNavigateToAuth(true)}
                sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}
              >
                Admin Portal
              </Button>
            </Stack>
          ) : (
            <>
              <IconButton onClick={handleMenuOpen}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => { onNavigateToAuth(false); handleMenuClose(); }}>
                  Student Login
                </MenuItem>
                <MenuItem onClick={() => { onNavigateToAuth(true); handleMenuClose(); }}>
                  Admin Portal
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.2
                  }}
                >
                  Master Your BECE 2026
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    fontSize: { xs: '1.2rem', md: '1.5rem' }
                  }}
                >
                  AI-powered predictions, interactive learning, and audio explanations to guarantee your success
                </Typography>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PlayCircle size={24} />}
                    onClick={() => onNavigateToAuth(false)}
                    sx={{
                      bgcolor: 'white',
                      color: '#1976d2',
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                  >
                    Start Learning Now
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<VolumeUp size={24} />}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                    }}
                  >
                    Try Audio Explanations
                  </Button>
                </Stack>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip label="🤖 AI-Powered" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                  <Chip label="🎧 Audio Learning" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                  <Chip label="📱 Mobile Friendly" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                  <Chip label="🔒 Secure Access" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                </Box>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Paper
                  elevation={8}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Typography variant="h6" gutterBottom color="text.primary" sx={{ fontWeight: 'bold' }}>
                    🎯 2026 Topic Predictions
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    {subjects.slice(0, 4).map((subject, index) => (
                      <Box key={subject} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.primary">{subject}</Typography>
                        <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                          {95 - index * 3}% likely
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<TrendingUp size={20} />}
                    onClick={() => onNavigateToAuth(false)}
                  >
                    View Full Predictions
                  </Button>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box textAlign="center">
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 'bold',
                      color: '#1976d2',
                      fontSize: { xs: '2rem', md: '3rem' }
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      <Divider />

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              mb: 6,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Why Choose Our Platform?
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    elevation={2}
                    sx={{
                      height: '100%',
                      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 3,
                          color: feature.color
                        }}
                      >
                        {feature.icon}
                        <Typography
                          variant="h5"
                          sx={{ ml: 2, fontWeight: 'bold' }}
                        >
                          {feature.title}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ lineHeight: 1.6 }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      <Divider />

      {/* Subjects Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              mb: 6,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            All BECE Subjects Covered
          </Typography>
          
          <Grid container spacing={2} justifyContent="center">
            {subjects.map((subject, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      borderRadius: 3,
                      transition: 'all 0.3s ease-in-out',
                      cursor: 'pointer',
                      '&:hover': {
                        elevation: 4,
                        transform: 'scale(1.05)',
                        bgcolor: '#f5f5f5'
                      }
                    }}
                  >
                    <BookOpen size={32} color="#1976d2" style={{ marginBottom: 8 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', md: '1.1rem' } }}>
                      {subject}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)',
          color: 'white',
          py: 8
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Box textAlign="center">
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  mb: 3,
                  fontSize: { xs: '2rem', md: '3rem' }
                }}
              >
                Ready to Excel in BECE 2026?
              </Typography>
              <Typography
                variant="h6"
                sx={{ mb: 4, opacity: 0.9 }}
              >
                Join thousands of students who are already preparing with our AI-powered platform
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Users size={24} />}
                  onClick={() => onNavigateToAuth(false)}
                  sx={{
                    bgcolor: 'white',
                    color: '#388e3c',
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    '&:hover': { bgcolor: '#f5f5f5' }
                  }}
                >
                  Get Started as Student
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<School size={24} />}
                  onClick={() => onNavigateToAuth(true)}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Admin Portal
                </Button>
              </Stack>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#263238', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <School size={32} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  BECE 2026 Prediction
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                Empowering Ghanaian students with AI-powered learning tools and predictions for BECE success.
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.6 }}>
                © 2025 BECE 2026 Prediction Platform. All rights reserved.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Platform Features
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>🤖 AI Topic Predictions</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>🎧 Audio Explanations</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>📚 Complete Question Banks</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>📊 Progress Tracking</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>👥 Multi-user Management</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
