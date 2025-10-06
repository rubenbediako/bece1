import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';

interface SimpleLandingPageProps {
  onGetStarted: () => void;
  onAdminLogin: () => void;
}

const SimpleLandingPage: React.FC<SimpleLandingPageProps> = ({
  onGetStarted,
  onAdminLogin,
}) => {
  const features = [
    {
      title: 'AI-Powered Predictions',
      description: 'Smart algorithm analyzes past papers to predict BECE 2026 topics',
      color: '#2563eb',
      emoji: '🎯',
    },
    {
      title: 'Interactive Learning',
      description: 'Engaging lessons with AI-generated solutions and explanations',
      color: '#7c3aed',
      emoji: '📚',
    },
    {
      title: 'Progress Tracking',
      description: 'Monitor your performance across all subjects with analytics',
      color: '#059669',
      emoji: '📊',
    },
    {
      title: 'Global Sync',
      description: 'Your progress syncs across all devices automatically',
      color: '#dc2626',
      emoji: '🌐',
    },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Navigation */}
      <Container maxWidth="xl">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          py: 3,
          position: 'relative',
          zIndex: 2,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.3)',
              width: 48,
              height: 48,
            }}>
              🎓
            </Avatar>
            <Typography variant="h5" sx={{ 
              color: 'white', 
              fontWeight: 800,
            }}>
              BECE 2026
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={2}>
            <Button 
              variant="outlined" 
              onClick={onAdminLogin}
              sx={{ 
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Admin Login
            </Button>
            <Button 
              variant="contained" 
              onClick={onGetStarted}
              sx={{ 
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
                },
              }}
            >
              Get Started
            </Button>
          </Stack>
        </Box>
      </Container>

      {/* Hero Section */}
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Chip 
              label="🚀 The Future of BECE Preparation" 
              sx={{ 
                mb: 3,
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            />
            
            <Typography 
              variant="h2" 
              sx={{ 
                color: 'white',
                mb: 3,
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
              }}
            >
              AI-Powered BECE 2026 
              <Box component="span" sx={{ 
                color: '#fbbf24',
                display: 'block',
              }}>
                Prediction Platform
              </Box>
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)', 
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Master your BECE with smart predictions, AI-generated solutions, 
              and interactive learning designed for Ghanaian students.
            </Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={onGetStarted}
                sx={{ 
                  py: 2,
                  px: 4,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
                  },
                }}
              >
                Start Learning Free
              </Button>
            </Stack>
          </motion.div>
        </Box>
      </Container>

      {/* Features Section */}
      <Box sx={{ 
        background: 'white',
        py: 8,
        position: 'relative',
        zIndex: 2,
      }}>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography 
              variant="h3" 
              sx={{ 
                textAlign: 'center', 
                mb: 2,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Why Students Choose Us
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                textAlign: 'center', 
                mb: 6,
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Experience the future of BECE preparation with our cutting-edge platform
            </Typography>
            
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 4
            }}>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                    <Card sx={{ 
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      '&:hover': {
                        transform: 'translateY(-8px)',
                      },
                      transition: 'all 0.3s ease-in-out',
                    }}>
                      <CardContent>
                        <Typography sx={{ fontSize: '3rem', mb: 2 }}>
                          {feature.emoji}
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        py: 8,
        color: 'white',
      }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
                Ready to Ace Your BECE?
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.8 }}>
                Join thousands of students who've improved their grades with our platform
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  onClick={onGetStarted}
                  sx={{ 
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
                    },
                  }}
                >
                  Start Free Today
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={onAdminLogin}
                  sx={{ 
                    py: 2,
                    px: 4,
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Admin Access
                </Button>
              </Stack>
              
              <Typography sx={{ mt: 4, opacity: 0.6, fontSize: '0.875rem' }}>
                💬 Need help? WhatsApp us: 054045614
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default SimpleLandingPage;
