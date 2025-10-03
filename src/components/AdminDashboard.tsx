import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  Stack,
  Chip,
  Button,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { motion } from 'framer-motion';
import { BookOpen, HelpCircle, Target, TrendingUp, Key, Copy, RefreshCw } from 'lucide-react';
import type { Subject, Topic, Question, PredictedTopic } from '../types';
import { useAuth } from '../contexts/AuthContext';
import AutoCodeGenerator from './AutoCodeGenerator';

interface AdminDashboardProps {
  subjects: Subject[];
  topics: Topic[];
  questions: Question[];
  predictedTopics: PredictedTopic[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  subjects, 
  topics,
  questions, 
  predictedTopics 
}) => {
  const { generateAccessCode, getCurrentAccessCode } = useAuth();
  const [currentCode, setCurrentCode] = useState(getCurrentAccessCode());
  const [copySuccess, setCopySuccess] = useState(false);
  
  const totalTopics = topics.length;
  const totalQuestions = questions.length;
  const activePredictions = predictedTopics.filter(p => p.isActive).length;
  const predictedQuestions = questions.filter(q => q.isPredicted).length;
  
  const handleGenerateNewCode = () => {
    const newCode = generateAccessCode();
    setCurrentCode(newCode);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopySuccess(true);
      setTimeout(() => { setCopySuccess(false); }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const statsCards = [
    { icon: BookOpen, title: 'Total Subjects', value: subjects.length, color: 'primary' },
    { icon: HelpCircle, title: 'Total Topics', value: totalTopics, color: 'secondary' },
    { icon: Target, title: 'Total Questions', value: totalQuestions, color: 'success' },
    { icon: TrendingUp, title: 'Active Predictions', value: activePredictions, color: 'warning' },
    { icon: Key, title: 'Predicted Questions', value: predictedQuestions, color: 'info' }
  ];

  return (
    <Box>
      <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          🎯 BECE 2026 Admin Dashboard
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Manage subjects, questions, and predictions for BECE 2026
        </Typography>
      </Paper>

      {/* Statistics Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: 3, 
        mb: 4 
      }}>
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <stat.icon size={40} />
                <Typography variant="h3" color={`${stat.color}.main`} fontWeight="bold" sx={{ mt: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* Auto Code Generator */}
      <AutoCodeGenerator />

      {/* Quick Start Guide */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          📚 Quick Start Guide
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body1" fontWeight="bold">1. Create Subjects</Typography>
            <Typography variant="body2" color="text.secondary">
              Go to the Subjects tab to add subjects like Mathematics, English, Science, etc.
            </Typography>
          </Box>
          <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body1" fontWeight="bold">2. Add Questions</Typography>
            <Typography variant="body2" color="text.secondary">
              Use the Questions tab to create questions for each subject and topic.
            </Typography>
          </Box>
          <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body1" fontWeight="bold">3. Set Predictions</Typography>
            <Typography variant="body2" color="text.secondary">
              Configure topic predictions with probability percentages in the Predictions tab.
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Subject Overview */}
      {subjects.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            📊 Subject Overview
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 2 
          }}>
            {subjects.map((subject) => {
              const subjectTopics = topics.filter(t => t.subjectId === subject.id);
              const subjectQuestions = questions.filter(q => q.subjectId === subject.id);
              const subjectPredictions = predictedTopics.filter(p => p.subjectId === subject.id && p.isActive);
              
              return (
                <Card key={subject.id} sx={{ p: 2 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {subject.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {subject.description}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip label={`${subjectTopics.length} Topics`} size="small" color="primary" />
                    <Chip label={`${subjectQuestions.length} Questions`} size="small" color="success" />
                    <Chip label={`${subjectPredictions.length} Predictions`} size="small" color="warning" />
                  </Stack>
                </Card>
              );
            })}
          </Box>
        </Paper>
      )}
      
      {/* Access Code Management */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          🔐 Student Access Code Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Generate and manage access codes for student login. Students need the current access code to login to the system.
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box sx={{ 
            p: 3, 
            bgcolor: 'primary.50', 
            border: 2, 
            borderColor: 'primary.main',
            borderRadius: 2,
            textAlign: 'center'
          }}>
            <Typography variant="subtitle2" color="primary.main" gutterBottom>
              Current Access Code
            </Typography>
            <Typography 
              variant="h4" 
              fontFamily="monospace" 
              fontWeight="bold" 
              color="primary.main"
              sx={{ letterSpacing: 2 }}
            >
              {currentCode}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Tooltip title={copySuccess ? "Copied!" : "Copy to clipboard"}>
                <IconButton 
                  onClick={handleCopyCode}
                  color="primary"
                  size="small"
                >
                  <Copy size={16} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Generate new code">
                <IconButton 
                  onClick={handleGenerateNewCode}
                  color="primary"
                  size="small"
                >
                  <RefreshCw size={16} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          <Stack spacing={2}>
            <Alert severity="info">
              <strong>How it works:</strong>
              <br />
              • Students need this code to login
              <br />
              • Generate new codes regularly for security
              <br />
              • Share with students when they need access
            </Alert>
            
            {/* WhatsApp Contact for Code Distribution */}
            <Box sx={{ 
              p: 2, 
              bgcolor: 'rgba(37, 211, 102, 0.1)', 
              border: 1, 
              borderColor: 'rgba(37, 211, 102, 0.3)',
              borderRadius: 2 
            }}>
              <Typography variant="subtitle2" sx={{ color: '#25D366', fontWeight: 'bold', mb: 1 }}>
                📱 Share Codes via WhatsApp
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Students can get instant access codes via WhatsApp:
              </Typography>
              <Typography variant="h6" sx={{ color: '#25D366', fontWeight: 'bold', mb: 1 }}>
                054045614
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{ 
                  borderColor: '#25D366', 
                  color: '#25D366',
                  '&:hover': { 
                    borderColor: '#128C7E', 
                    color: '#128C7E' 
                  }
                }}
                href={`https://wa.me/233540456149?text=Current access code: ${currentCode}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 Share on WhatsApp
              </Button>
            </Box>
            
            <Button
              variant="contained"
              onClick={handleGenerateNewCode}
              startIcon={<RefreshCw size={20} />}
              size="large"
              fullWidth
            >
              Generate New Access Code
            </Button>
            
            {copySuccess && (
              <Alert severity="success">
                Access code copied to clipboard!
              </Alert>
            )}
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
