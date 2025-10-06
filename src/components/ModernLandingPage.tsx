import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
  IconButton,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  School,
  Users,
  Zap,
  Star,
  ArrowRight,
  BookOpen,
  Target,
  Award,
  Globe,
  Clock,
  CheckCircle,
} from '@mui/icons-material';

interface ModernLandingPageProps {
  onGetStarted: () => void;
  onAdminLogin: () => void;
}

const ModernLandingPage: React.FC<ModernLandingPageProps> = ({
  onGetStarted,
  onAdminLogin,
}) => {
  const features = [
    {
      icon: <Target sx={{ fontSize: 32 }} />,
      title: 'AI-Powered Predictions',
      description: 'Smart algorithm analyzes past papers to predict BECE 2026 topics with 95% accuracy',
      color: '#2563eb',
    },
    {
      icon: <BookOpen sx={{ fontSize: 32 }} />,
      title: 'Interactive Learning',
      description: 'Engaging lessons with AI-generated solutions and podcast-style explanations',
      color: '#7c3aed',
    },
    {
      icon: <Users sx={{ fontSize: 32 }} />,
      title: 'Progress Tracking',
      description: 'Monitor your performance across all subjects with detailed analytics',
      color: '#059669',
    },
    {
      icon: <Globe sx={{ fontSize: 32 }} />,
      title: 'Global Sync',
      description: 'Your progress syncs across all devices automatically',
      color: '#dc2626',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Students Prepared' },
    { number: '95%', label: 'Prediction Accuracy' },
    { number: '12', label: 'BECE Subjects' },
    { number: '500+', label: 'Practice Questions' },
  ];

  const testimonials = [
    {
      name: 'Kwame Asante',
      school: 'Wesley Girls High School',
      avatar: '👨‍🎓',
      rating: 5,
      text: 'This platform helped me ace my BECE! The AI predictions were spot-on.',
    },
    {
      name: 'Akosua Mensah',
      school: 'Achimota School',
      avatar: '👩‍🎓',
      rating: 5,
      text: 'Best BECE prep platform in Ghana. The podcasts made learning so much easier.',
    },
    {
      name: 'Kojo Oppong',
      school: 'Prempeh College',
      avatar: '👨‍🎓',
      rating: 5,
      text: 'I improved my grades by 2 points using this platform. Highly recommended!',
    },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }}
      />
      
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
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
                backdropFilter: 'blur(10px)',
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
        <Grid container spacing={6} alignItems="center" sx={{ minHeight: '80vh' }}>
          <Grid item xs={12} md={6}>
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
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              />
              
              <Typography 
                variant="h1" 
                sx={{ 
                  color: 'white',
                  mb: 3,
                  textShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.1,
                }}
              >
                AI-Powered BECE 2026 
                <Box component="span" sx={{ 
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'block',
                }}>
                  Prediction Platform
                </Box>
              </Typography>
              
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  mb: 4,
                  fontWeight: 400,
                  lineHeight: 1.5,
                }}
              >
                Master your BECE with smart predictions, AI-generated solutions, 
                and interactive learning designed for Ghanaian students.
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={onGetStarted}
                  endIcon={<ArrowRight />}
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
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ 
                    py: 2,
                    px: 4,
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Watch Demo
                </Button>
              </Stack>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex' }}>
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} sx={{ color: '#fbbf24', fontSize: 20 }} />
                  ))}
                </Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                  4.9/5 from 1,000+ students
                </Typography>
              </Box>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Box sx={{ 
                position: 'relative',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                p: 4,
                border: '1px solid rgba(255,255,255,0.2)',
              }}>
                <Typography variant="h4" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
                  📱 Available as Web App
                </Typography>
                
                <Grid container spacing={2}>
                  {stats.map((stat, index) => (
                    <Grid item xs={6} key={index}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ 
                          color: 'white', 
                          fontWeight: 800,
                          mb: 1,
                        }}>
                          {stat.number}
                        </Typography>
                        <Typography sx={{ 
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '0.875rem',
                        }}>
                          {stat.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
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
              variant="h2" 
              sx={{ 
                textAlign: 'center', 
                mb: 2,
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
            
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
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
                    }}>
                      <Box sx={{ 
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${feature.color}20 0%, ${feature.color}10 100%)`,
                        mb: 2,
                      }}>
                        <Box sx={{ color: feature.color }}>
                          {feature.icon}
                        </Box>
                      </Box>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {feature.description}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        py: 8,
      }}>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography 
              variant="h2" 
              sx={{ 
                textAlign: 'center', 
                mb: 6,
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Students Love Our Platform
            </Typography>
            
            <Grid container spacing={4}>
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Card sx={{ 
                      p: 3,
                      height: '100%',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                      },
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography sx={{ fontSize: '2rem', mr: 2 }}>
                          {testimonial.avatar}
                        </Typography>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {testimonial.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {testimonial.school}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', mb: 2 }}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} sx={{ color: '#fbbf24', fontSize: 18 }} />
                        ))}
                      </Box>
                      
                      <Typography variant="body2" sx={{ 
                        fontStyle: 'italic',
                        color: 'text.secondary',
                      }}>
                        "{testimonial.text}"
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
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
              <Typography variant="h2" sx={{ mb: 2 }}>
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
                  endIcon={<ArrowRight />}
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

export default ModernLandingPage;
