import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
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
  Volume2,
  Users,
  BookOpen,
  Award,
  PlayCircle,
  Headphones,
  ArrowRight,
  CheckCircle,
  Star,
  Menu as MenuIcon,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<Props> = ({ onGetStarted }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const subjects = [
    { name: 'Mathematics', icon: '🧮', color: '#1976d2' },
    { name: 'English Language', icon: '📝', color: '#d32f2f' },
    { name: 'Science', icon: '🔬', color: '#388e3c' },
    { name: 'Social Studies', icon: '🌍', color: '#f57c00' },
    { name: 'ICT', icon: '💻', color: '#7b1fa2' },
    { name: 'Technical Skills', icon: '🔧', color: '#455a64' }
  ];

  const features = [
    {
      icon: <TrendingUp size={40} />,
      title: 'Smart Predictions',
      description: 'AI-powered analysis of past BECE papers to predict likely exam questions',
      color: '#1976d2'
    },
    {
      icon: <Volume2 size={40} />,
      title: 'Audio Explanations',
      description: 'Listen to detailed explanations of solutions in multiple teaching styles',
      color: '#d32f2f'
    },
    {
      icon: <Users size={40} />,
      title: 'Student Management',
      description: 'Track multiple students progress and performance across all subjects',
      color: '#388e3c'
    },
    {
      icon: <Award size={40} />,
      title: 'BECE Ready',
      description: 'Specifically designed for Ghana BECE 2026 examination preparation',
      color: '#f57c00'
    }
  ];

  const stats = [
    { label: 'Subjects Covered', value: '6', icon: <BookOpen size={24} /> },
    { label: 'BECE Focused', value: '2026', icon: <TrendingUp size={24} /> },
    { label: 'Audio Features', value: 'AI', icon: <Headphones size={24} /> },
    { label: 'Platform Ready', value: '100%', icon: <Users size={24} /> }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Navigation */}
      <AppBar position="fixed" sx={{ bgcolor: 'rgba(25, 118, 210, 0.95)', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <School size={32} color="white" />
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold', color: 'white' }}>
              BECE 2026 Predictions
            </Typography>
          </Box>
          
          {!isMobile && (
            <Stack direction="row" spacing={2}>
              <Button color="inherit" href="#features">Features</Button>
              <Button color="inherit" href="#subjects">Subjects</Button>
              <Button color="inherit" href="#contact">Contact</Button>
              <Button 
                variant="contained" 
                sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                onClick={onGetStarted}
              >
                Get Started
              </Button>
            </Stack>
          )}
          
          {isMobile && (
            <IconButton 
              color="inherit" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </IconButton>
          )}
        </Toolbar>
        
        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <Box sx={{ bgcolor: 'rgba(25, 118, 210, 0.98)', p: 2 }}>
            <Stack spacing={2}>
              <Button color="inherit" href="#features" fullWidth>Features</Button>
              <Button color="inherit" href="#subjects" fullWidth>Subjects</Button>
              <Button color="inherit" href="#contact" fullWidth>Contact</Button>
              <Button 
                variant="contained" 
                sx={{ bgcolor: 'white', color: 'primary.main' }}
                onClick={onGetStarted}
                fullWidth
              >
                Get Started
              </Button>
            </Stack>
          </Box>
        )}
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%)',
          color: 'white',
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Container maxWidth="lg">
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={4} 
            alignItems="center"
            sx={{ minHeight: { md: '60vh' } }}
          >
            <Box flex={1}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    mb: 2,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  BECE 2026 Prediction Platform
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 4, 
                    opacity: 0.9,
                    fontSize: { xs: '1.2rem', md: '1.5rem' }
                  }}
                >
                  AI-powered exam predictions with interactive audio explanations for BECE success
                </Typography>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                  <Button
                    size="large"
                    variant="contained"
                    onClick={onGetStarted}
                    startIcon={<PlayCircle size={24} />}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': { bgcolor: 'grey.100', transform: 'translateY(-2px)' },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Start Learning
                  </Button>
                  
                  <Button
                    size="large"
                    variant="outlined"
                    startIcon={<Volume2 size={24} />}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': { 
                        bgcolor: 'rgba(255,255,255,0.1)', 
                        borderColor: 'white',
                        transform: 'translateY(-2px)' 
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Audio Features
                  </Button>
                </Stack>

                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                  <Chip label="🎯 BECE Focused" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                  <Chip label="🧠 AI Powered" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                  <Chip label="🔊 Audio Learning" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                  <Chip label="📱 Mobile Friendly" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                </Stack>
              </motion.div>
            </Box>
            
            <Box flex={1}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Paper
                  elevation={20}
                  sx={{
                    p: 4,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 4,
                    textAlign: 'center'
                  }}
                >
                  <School size={80} color="white" style={{ marginBottom: 16 }} />
                  <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                    Ready for BECE 2026?
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Start your BECE 2026 preparation journey with AI-powered predictions and comprehensive study materials.
                  </Typography>
                </Paper>
              </motion.div>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center" sx={{ mb: 6, fontWeight: 'bold' }}>
          Ready for BECE 2026 Preparation
        </Typography>
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={4} 
          justifyContent="center"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card 
                sx={{ 
                  textAlign: 'center', 
                  p: 3,
                  minWidth: 200,
                  '&:hover': { 
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Card>
            </motion.div>
          ))}
        </Stack>
      </Container>

      {/* Features Section */}
      <Box id="features" sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" textAlign="center" sx={{ mb: 2, fontWeight: 'bold' }}>
            Why Choose Our Platform?
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Advanced features designed specifically for BECE 2026 success
          </Typography>
          
          <Stack spacing={4}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card 
                  sx={{ 
                    p: 4,
                    '&:hover': { 
                      transform: 'translateY(-5px)',
                      boxShadow: 8
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={3} 
                    alignItems="center"
                  >
                    <Box 
                      sx={{ 
                        color: feature.color,
                        bgcolor: `${feature.color}15`,
                        p: 2,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Box flex={1}>
                      <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </motion.div>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Subjects Section */}
      <Box id="subjects" sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" textAlign="center" sx={{ mb: 2, fontWeight: 'bold' }}>
            Complete Subject Coverage
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            All BECE subjects with predicted questions and audio explanations
          </Typography>
          
          <Stack 
            direction="row" 
            spacing={2} 
            flexWrap="wrap" 
            justifyContent="center"
            useFlexGap
          >
            {subjects.map((subject, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card 
                  sx={{ 
                    p: 3,
                    minWidth: 200,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': { 
                      transform: 'translateY(-5px)',
                      boxShadow: 6,
                      bgcolor: `${subject.color}10`
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    {subject.icon}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: subject.color
                    }}
                  >
                    {subject.name}
                  </Typography>
                </Card>
              </motion.div>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          py: 8,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4} alignItems="center" textAlign="center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                Ready to Excel in BECE 2026?
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Join our platform today and start your journey to BECE success
              </Typography>
              
              <Button
                size="large"
                variant="contained"
                onClick={onGetStarted}
                endIcon={<ArrowRight size={24} />}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  '&:hover': { 
                    bgcolor: 'grey.100',
                    transform: 'translateY(-3px)',
                    boxShadow: 6
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Get Started Now
              </Button>
            </motion.div>
          </Stack>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box id="contact" sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Need Help?
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              spacing={4} 
              sx={{ width: '100%', maxWidth: 800 }}
            >
              <Card sx={{ flex: 1, p: 4, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  📧 Email Support
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Get help with technical issues or account questions
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  support@bece2026.edu.gh
                </Typography>
              </Card>
              
              <Card sx={{ flex: 1, p: 4, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  📱 WhatsApp
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Quick assistance for students and teachers
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  +233 XX XXX XXXX
                </Typography>
              </Card>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={2} 
            justifyContent="space-between" 
            alignItems="center"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <School size={24} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                BECE 2026 Prediction Platform
              </Typography>
            </Stack>
            
            <Typography variant="body2" color="grey.400">
              © 2024 BECE Prediction Platform. All rights reserved.
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
