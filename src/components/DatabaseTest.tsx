import React from 'react';
import { Box, Typography, Alert, Chip, Paper } from '@mui/material';
import { CheckCircle, Error, Info } from '@mui/icons-material';
import { useAppContext } from '../contexts/AppContext';

const DatabaseTest: React.FC = () => {
  const { subjects, topics, predictions, questions, getPredictionTopics } = useAppContext();

  const tests = [
    {
      name: 'Subjects Data',
      status: subjects.length > 0 ? 'success' : 'error',
      count: subjects.length,
      expected: 6,
      description: 'BECE subject data loaded'
    },
    {
      name: 'Topics Data',
      status: topics.length > 0 ? 'success' : 'error',
      count: topics.length,
      expected: 22,
      description: 'Learning topics across all subjects'
    },
    {
      name: 'Predictions Data',
      status: predictions.length > 0 ? 'success' : 'error',
      count: predictions.length,
      expected: 5,
      description: 'AI predictions for BECE 2026'
    },
    {
      name: 'Questions Data',
      status: 'info',
      count: questions.length,
      expected: 0,
      description: 'Questions (initially empty, managed by admin)'
    },
    {
      name: 'Prediction Topics',
      status: getPredictionTopics().length > 0 ? 'success' : 'error',
      count: getPredictionTopics().length,
      expected: 8,
      description: 'Topics marked for predictions'
    }
  ];

  const overallStatus = tests.every(test => test.status === 'success' || test.status === 'info');

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {overallStatus ? <CheckCircle color="success" /> : <Error color="error" />}
        Database Status Check
      </Typography>

      <Alert 
        severity={overallStatus ? 'success' : 'error'} 
        sx={{ mb: 3 }}
      >
        {overallStatus 
          ? '✅ Database/Context is working correctly! All data loaded successfully.'
          : '❌ Database/Context has issues. Some data failed to load.'
        }
      </Alert>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 2
      }}>
        {tests.map((test, index) => (
          <Paper key={index} sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {test.status === 'success' && <CheckCircle color="success" fontSize="small" />}
              {test.status === 'error' && <Error color="error" fontSize="small" />}
              {test.status === 'info' && <Info color="info" fontSize="small" />}
              <Typography variant="h6" fontSize="1rem">
                {test.name}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {test.description}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={`Count: ${test.count}`}
                color={test.count >= test.expected ? 'success' : 'warning'}
                size="small"
              />
              <Chip 
                label={`Expected: ${test.expected}`}
                variant="outlined"
                size="small"
              />
            </Box>
          </Paper>
        ))}
      </Box>

      <Paper sx={{ p: 3, mt: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          Database Details
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Type:</strong> React Context API (In-Memory State Management)
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Storage:</strong> Client-side state with initial seed data
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Persistence:</strong> Session-based (resets on page refresh)
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>CRUD Operations:</strong> Full Create, Read, Update, Delete support via context methods
        </Typography>
        <Typography variant="body2">
          <strong>Data Types:</strong> Subjects, Topics, Predictions, Questions with TypeScript interfaces
        </Typography>
      </Paper>
    </Box>
  );
};

export default DatabaseTest;
