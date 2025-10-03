import React from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { CheckCircle, Users, BookOpen, Brain, Target } from 'lucide-react';

const ProductInfo: React.FC = () => {
  const features = [
    "AI-powered BECE topic predictions",
    "Interactive podcast explanations (AMA & DAS)",
    "Complete subject coverage (10 subjects)",
    "Role-based access (Student & Admin)",
    "Secure access code system",
    "Real-time text-to-speech conversations",
    "Math expression editor",
    "Progress tracking",
    "Question prediction management",
    "Comprehensive solution explanations"
  ];

  const subjects = [
    "Mathematics", "English Language", "Integrated Science", 
    "Social Studies", "Religious & Moral Education", "French",
    "Information & Communication Technology", "Basic Design & Technology",
    "Economics", "Creative Arts & Design"
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, mb: 4, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom textAlign="center">
          🎓 BECE 2026 Prediction Platform
        </Typography>
        <Typography variant="h6" textAlign="center" sx={{ opacity: 0.9 }}>
          The Ultimate Study Companion for Junior High School Certificate Examination
        </Typography>
      </Paper>

      <Box sx={{ display: 'grid', gap: 4 }}>
        {/* Main Features */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Target color="primary" />
                Key Features
              </Typography>
              <List>
                {features.map((feature, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CheckCircle color="green" size={20} />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Subjects Covered */}
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BookOpen color="primary" />
                Subjects Covered
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {subjects.map((subject) => (
                  <Chip 
                    key={subject} 
                    label={subject} 
                    color="primary" 
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* How It Works */}
        <Card>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Brain color="primary" />
              How The Platform Works
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mt: 2 }}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  1. Subject Selection
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Choose from all 10 BECE subjects to focus your study sessions
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  2. AI Predictions
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Study high-probability topics identified by our prediction algorithm
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  3. Interactive Learning
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Listen to AMA & DAS conversations for detailed explanations
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* User Types */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Users color="success" />
                For Students
              </Typography>
              <List dense>
                <ListItem><ListItemText primary="Access with teacher-provided code" /></ListItem>
                <ListItem><ListItemText primary="Study predicted exam topics" /></ListItem>
                <ListItem><ListItemText primary="Practice with real exam questions" /></ListItem>
                <ListItem><ListItemText primary="Listen to solution explanations" /></ListItem>
                <ListItem><ListItemText primary="Use math expression editor" /></ListItem>
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Users color="warning" />
                For Administrators
              </Typography>
              <List dense>
                <ListItem><ListItemText primary="Generate student access codes" /></ListItem>
                <ListItem><ListItemText primary="Manage subjects and topics" /></ListItem>
                <ListItem><ListItemText primary="Create and edit questions" /></ListItem>
                <ListItem><ListItemText primary="Set prediction priorities" /></ListItem>
                <ListItem><ListItemText primary="Monitor platform usage" /></ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Technical Specifications */}
        <Card>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Technical Specifications
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">Frontend:</Typography>
                <Typography variant="body2">React 18 + TypeScript</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">UI Framework:</Typography>
                <Typography variant="body2">Material-UI (MUI)</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">Animations:</Typography>
                <Typography variant="body2">Framer Motion</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">Audio:</Typography>
                <Typography variant="body2">Web Speech API</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ProductInfo;
