import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Paper,
  Chip,
  Stack,
  Avatar
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Users, 
  Award, 
  Brain,
  ChevronRight,
  Star
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onAdminLogin?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onAdminLogin }) => {
  const features = [
    {
      icon: Target,
      title: "AI-Powered Predictions",
      description: "Get accurate predictions for BECE 2026 exam topics using advanced algorithms"
    },
    {
      icon: Brain,
      title: "Smart Learning",
      description: "Interactive solutions with podcast-style explanations for better understanding"
    },
    {
      icon: BookOpen,
      title: "Complete Coverage",
      description: "All BECE subjects including Math, English, Science, Social Studies and more"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your preparation progress and identify areas for improvement"
    },
    {
      icon: Users,
      title: "Student & Admin",
      description: "Separate interfaces for students and administrators with role-based access"
    },
    {
      icon: Award,
      title: "Exam Ready",
      description: "Practice with real exam-style questions and detailed step-by-step solutions"
    }
  ];

  const subjects = [
    "Mathematics", "English Language", "Science", "Social Studies",
    "Religious & Moral Education", "French", "Computing", "Career Technology",
    "Economics", "Creative Arts & Design"
  ];

  const testimonials = [
    {
      name: "Kwame Asante",
      role: "BECE Student",
      message: "This platform helped me understand difficult math concepts with the podcast explanations!",
      rating: 5
    },
    {
      name: "Ms. Akosua Mensah",
      role: "JHS Teacher",
      message: "The prediction accuracy and question quality make this an invaluable teaching tool.",
      rating: 5
    },
    {
      name: "Ama Osei",
      role: "BECE Student",
      message: "The AMA & DAS conversations make learning so much more engaging and fun!",
      rating: 5
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Paper
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          borderRadius: 0,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h2" fontWeight="bold" gutterBottom>
                🎓 BECE 2026 Prediction Platform
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Your Ultimate Study Companion for Junior High School Certificate Examination
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                Prepare for BECE 2026 with AI-powered topic predictions, interactive solutions, 
                and podcast-style explanations from AMA (student) and DAS (teacher).
              </Typography>
              
              {/* Login Options */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={onGetStarted}
                  sx={{
                    bgcolor: 'secondary.main',
                    color: 'white',
                    px: 4,
                    py: 2,
                    fontSize: '1.2rem',
                    flex: 1,
                    '&:hover': { bgcolor: 'secondary.dark' }
                  }}
                  endIcon={<ChevronRight />}
                >
                  Student Login
                </Button>
                
                {onAdminLogin && (
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={onAdminLogin}
                    sx={{
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      px: 4,
                      py: 2,
                      fontSize: '1.2rem',
                      flex: 1,
                      '&:hover': { 
                        bgcolor: 'primary.main',
                        color: 'white' 
                      }
                    }}
                    endIcon={<ChevronRight />}
                  >
                    Admin Login
                  </Button>
                )}
              </Stack>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                Students: Register and access BECE 2026 predictions<br />
                Administrators: Manage platform and generate access codes
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
          Why Choose Our Platform?
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Comprehensive features designed to maximize your BECE preparation success
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 4 }}>
          {features.map((feature, index) => (
            <Box key={feature.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                  <CardContent>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 60,
                        height: 60,
                        mx: 'auto',
                        mb: 2
                      }}
                    >
                      <feature.icon size={30} />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Subjects Section */}
      <Paper sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
            All BECE Subjects Covered
          </Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
            Complete coverage of all Junior High School Certificate Examination subjects
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {subjects.map((subject, index) => (
              <motion.div
                key={subject}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Chip
                  label={subject}
                  size="medium"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    p: 1,
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                />
              </motion.div>
            ))}
          </Box>
        </Container>
      </Paper>

      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
          How It Works
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Simple steps to maximize your BECE preparation
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4, alignItems: 'center' }}>
          <Box>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', width: 80, height: 80, mx: 'auto', mb: 2 }}>
                <Typography variant="h4" fontWeight="bold">1</Typography>
              </Avatar>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Choose Your Subject
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select from all available BECE subjects to start your focused preparation
              </Typography>
            </Box>
          </Box>

          <Box>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', width: 80, height: 80, mx: 'auto', mb: 2 }}>
                <Typography variant="h4" fontWeight="bold">2</Typography>
              </Avatar>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Study Predicted Topics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Focus on AI-predicted high-probability topics for efficient study
              </Typography>
            </Box>
          </Box>

          <Box>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'info.main', width: 80, height: 80, mx: 'auto', mb: 2 }}>
                <Typography variant="h4" fontWeight="bold">3</Typography>
              </Avatar>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Practice & Listen
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Solve questions and listen to AMA & DAS podcast explanations
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Testimonials Section */}
      <Paper sx={{ py: 8, bgcolor: 'primary.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
            What Students & Teachers Say
          </Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Real feedback from our satisfied users
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {testimonials.map((testimonial, index) => (
              <Box key={testimonial.name}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Card sx={{ height: '100%', p: 3 }}>
                    <CardContent>
                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} size={20} fill="gold" color="gold" />
                        ))}
                      </Stack>
                      <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                        "{testimonial.message}"
                      </Typography>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            ))}
          </Box>
        </Container>
      </Paper>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Ready to Ace Your BECE 2026?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Join thousands of students already preparing with our platform
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={onGetStarted}
          sx={{
            bgcolor: 'primary.main',
            px: 4,
            py: 2,
            fontSize: '1.2rem',
            mb: 3
          }}
          endIcon={<ChevronRight />}
        >
          Start Learning Today
        </Button>
        
        {/* WhatsApp Contact CTA */}
        <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(37, 211, 102, 0.1)', borderRadius: 2, maxWidth: 500, mx: 'auto' }}>
          <Typography variant="h6" sx={{ color: '#25D366', mb: 1 }}>
            💬 WhatsApp for Instant Code Access
          </Typography>
          <Typography variant="h4" sx={{ color: '#25D366', fontWeight: 'bold', mb: 2 }}>
            054045614
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Message us for instant access codes and support
          </Typography>
          <Button
            variant="outlined"
            sx={{ 
              borderColor: '#25D366', 
              color: '#25D366',
              '&:hover': { 
                borderColor: '#128C7E', 
                color: '#128C7E',
                bgcolor: 'rgba(37, 211, 102, 0.1)'
              }
            }}
            href="https://wa.me/233540456149"
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 Get Code via WhatsApp
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Paper sx={{ py: 4, bgcolor: 'grey.900', color: 'white', mt: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              🎓 BECE 2026 Prediction Platform
            </Typography>
            <Typography variant="body2" color="grey.400" sx={{ mb: 2 }}>
              Empowering students for Junior High School Certificate Examination success
            </Typography>
            
            {/* WhatsApp Contact */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(37, 211, 102, 0.1)', borderRadius: 2, border: '1px solid rgba(37, 211, 102, 0.3)' }}>
              <Typography variant="h6" sx={{ color: '#25D366', mb: 1 }}>
                📱 Need Help? Contact Us on WhatsApp
              </Typography>
              <Typography variant="h5" sx={{ color: '#25D366', fontWeight: 'bold', mb: 1 }}>
                054045614
              </Typography>
              <Typography variant="body2" color="grey.300">
                Get instant support, access codes, and technical assistance
              </Typography>
              <Button
                variant="contained"
                sx={{ 
                  mt: 2, 
                  bgcolor: '#25D366', 
                  '&:hover': { bgcolor: '#128C7E' },
                  color: 'white'
                }}
                href="https://wa.me/233540456149"
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 Chat on WhatsApp
              </Button>
            </Box>

            <Typography variant="caption" color="grey.500" sx={{ mt: 2, display: 'block' }}>
              © 2025 BECE Prediction Platform. Built for Ghanaian students.
            </Typography>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default LandingPage;
