import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Avatar,
  Chip,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Star,
  ArrowRight,
} from '@mui/icons-material';
import {
  BookOpenIcon,
  TrophyIcon,
  GlobeIcon,
  UsersIcon
} from 'lucide-react';

interface ModernLandingPageProps {
  onGetStarted: () => void;
  onAdminLogin: () => void;
}

const ModernLandingPageFixed: React.FC<ModernLandingPageProps> = ({
  onGetStarted,
  onAdminLogin,
}) => {
  const features = [
    {
      icon: <TrophyIcon size={32} />,
      title: 'AI-Powered Predictions',
      description: 'Smart algorithm analyzes past papers to predict BECE 2026 topics with 95% accuracy',
      color: '#2563eb',
    },
    {
      icon: <BookOpenIcon size={32} />,
      title: 'Comprehensive Study Materials',
      description: 'Access thousands of past questions, detailed solutions, and study guides',
      color: '#7c3aed',
    },
    {
      icon: <GlobeIcon size={32} />,
      title: 'Interactive Learning',
      description: 'Engage with multimedia content, quizzes, and real-time progress tracking',
      color: '#059669',
    },
    {
      icon: <UsersIcon size={32} />,
      title: 'Expert Support',
      description: 'Get help from experienced teachers and join study groups with peers',
      color: '#dc2626',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Students' },
    { value: '95%', label: 'Success Rate' },
    { value: '500+', label: 'Past Questions' },
    { value: '24/7', label: 'Support' },
  ];

  const testimonials = [
    {
      name: 'Kwame Asante',
      school: 'Ghana International School',
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated Background Elements */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-element"
            style={{
              position: 'absolute',
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(255, 255, 255, ${Math.random() * 0.1 + 0.05})`,
              borderRadius: '50%',
              filter: 'blur(1px)',
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </Box>

      {/* Navigation Bar */}
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          py: 2,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <Typography variant="h5" sx={{ 
            color: 'white', 
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}>
            🎯 BECE 2026
          </Typography>
          
          <Stack direction="row" spacing={2}>
            <Button
              variant="text"
              onClick={onAdminLogin}
              sx={{ 
                color: 'white',
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              Admin
            </Button>
            <Button
              variant="contained"
              onClick={onGetStarted}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                '&:hover': {
                  background: 'rgba(255,255,255,0.3)',
                }
              }}
            >
              Get Started
            </Button>
          </Stack>
        </Box>
      </Container>

      {/* Hero Section */}
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: 6,
          minHeight: '80vh',
          py: 4
        }}>
          <Box sx={{ flex: 1, maxWidth: { xs: '100%', md: '50%' } }}>
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
                  fontWeight: 900,
                }}
              >
                Master BECE 2026 with
                <br />
                <Box component="span" sx={{ 
                  background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  AI Predictions
                </Box>
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  mb: 4,
                  lineHeight: 1.6,
                  maxWidth: 500,
                }}
              >
                Join thousands of students using our AI-powered platform to predict BECE topics, 
                access smart study materials, and achieve academic excellence.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={onGetStarted}
                  endIcon={<ArrowRight />}
                  sx={{
                    background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1d4ed8, #6d28d9)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Start Learning Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={onAdminLogin}
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      background: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  Admin Login
                </Button>
              </Stack>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} sx={{ color: '#fbbf24', fontSize: 20 }} />
                  ))}
                </Box>
                <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                  4.9/5 from 2,500+ students
                </Typography>
              </Box>
            </motion.div>
          </Box>

          <Box sx={{ flex: 1, maxWidth: { xs: '100%', md: '50%' } }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Box sx={{ 
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                p: 4,
                border: '1px solid rgba(255,255,255,0.2)',
              }}>
                <Typography variant="h4" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
                  📱 Available as Web App
                </Typography>
                
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 2
                }}>
                  {stats.map((stat, index) => (
                    <Box key={index} sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ 
                        color: 'white', 
                        fontWeight: 800,
                        mb: 1,
                      }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: 'rgba(255,255,255,0.8)',
                        fontWeight: 500,
                      }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </motion.div>
          </Box>
        </Box>
      </Container>

      {/* Features Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        py: 10,
      }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ mb: 3, color: 'text.primary' }}>
              🚀 Why Choose Our Platform?
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
              Experience the most advanced BECE preparation platform with cutting-edge AI technology
            </Typography>
          </Box>
          
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
                  border: '2px solid transparent',
                  '&:hover': {
                    borderColor: feature.color,
                    transform: 'translateY(-8px)',
                  }
                }}>
                  <Box sx={{ 
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    background: `${feature.color}20`,
                    color: feature.color,
                    mb: 2,
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {feature.description}
                  </Typography>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 10, background: '#f8fafc' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ mb: 3, color: 'text.primary' }}>
              💬 What Students Say
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Real success stories from students who used our platform
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4
          }}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2, background: 'linear-gradient(45deg, #2563eb, #7c3aed)' }}>
                      {testimonial.avatar}
                    </Avatar>
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
                  
                  <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    "{testimonial.text}"
                  </Typography>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        py: 10,
        color: 'white',
        textAlign: 'center',
      }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography variant="h2" sx={{ mb: 3, fontWeight: 800 }}>
              🎯 Ready to Ace BECE 2026?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of students who are already using our AI-powered platform
              to predict exam topics and improve their grades.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={onGetStarted}
              endIcon={<ArrowRight />}
              sx={{
                background: 'white',
                color: '#2563eb',
                py: 2,
                px: 6,
                fontSize: '1.2rem',
                fontWeight: 700,
                borderRadius: 3,
                '&:hover': {
                  background: '#f8fafc',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Start Your Journey Today
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        background: '#1e293b',
        color: 'white',
        py: 6,
        textAlign: 'center',
      }}>
        <Container maxWidth="xl">
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            🎯 BECE 2026 Prediction Platform
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
            Empowering students across Ghana with AI-powered education technology.
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            © 2024 BECE Platform. All rights reserved. | Made with ❤️ for Ghanaian students
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default ModernLandingPageFixed;
