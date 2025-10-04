import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, HelpCircle, Save, RefreshCw } from 'lucide-react';
import { useGlobalState } from '../contexts/GlobalStateContext';
import DatabaseService from '../services/DatabaseService';
import type { Subject, Topic, Question } from '../types';

interface QuestionManagerGlobalProps {
  subjects: Subject[];
  topics: Topic[];
  questions: Question[];
}

const QuestionManagerGlobal: React.FC<QuestionManagerGlobalProps> = ({ 
  subjects: globalSubjects,
  topics: globalTopics,
  questions: globalQuestions
}) => {
  const { refreshData, syncStatus } = useGlobalState();
  const [subjects] = useState<Subject[]>(globalSubjects);
  const [topics] = useState<Topic[]>(globalTopics);
  const [questions, setQuestions] = useState<Question[]>(globalQuestions);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const dbService = DatabaseService.getInstance();

  // Sync local state with global state when it changes
  React.useEffect(() => {
    setQuestions(globalQuestions);
  }, [globalQuestions]);

  const [formData, setFormData] = useState({
    subjectId: '',
    topicId: '',
    type: 'multiple-choice' as 'multiple-choice' | 'short-answer' | 'essay' | 'practical',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    points: 10,
    marks: 10
  });

  const resetForm = () => {
    setFormData({
      subjectId: '',
      topicId: '',
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      difficulty: 'medium',
      points: 10,
      marks: 10
    });
    setSelectedQuestion(null);
  };

  const handleOpenDialog = (question?: Question) => {
    if (question) {
      setSelectedQuestion(question);
      setFormData({
        subjectId: question.subjectId,
        topicId: question.topicId,
        type: question.type,
        question: question.question,
        options: question.options || ['', '', '', ''],
        correctAnswer: question.correctAnswer,
        explanation: question.explanation || '',
        difficulty: question.difficulty,
        points: question.points,
        marks: question.marks || question.points
      });
    } else {
      resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
  };

  const handleSaveQuestion = async () => {
    if (!formData.question.trim() || !formData.subjectId || !formData.topicId) {
      setError('Question text, subject, and topic are required');
      return;
    }

    if (formData.type === 'multiple-choice' && formData.options.some(opt => !opt.trim())) {
      setError('All multiple choice options must be filled');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const now = new Date().toISOString();
      const questionData: Question = {
        id: selectedQuestion?.id || `question_${Date.now()}`,
        subjectId: formData.subjectId,
        topicId: formData.topicId,
        type: formData.type,
        question: formData.question.trim(),
        options: formData.type === 'multiple-choice' ? formData.options.filter(opt => opt.trim()) : undefined,
        correctAnswer: formData.correctAnswer,
        explanation: formData.explanation.trim(),
        difficulty: formData.difficulty,
        points: formData.points,
        marks: formData.marks,
        createdAt: selectedQuestion?.createdAt || now,
        updatedAt: now
      };

      // Check database status
      const storageStatus = dbService.getStorageStatus();

      // Save to global database
      await dbService.saveQuestion(questionData);

      // Update local state and show success message based on storage type
      if (storageStatus.type === 'localStorage') {
        if (selectedQuestion) {
          setSuccess(`✅ Question updated locally! Note: Using browser storage as fallback. To sync globally, please configure Vercel KV database.`);
        } else {
          setSuccess(`✅ Question added locally! Note: Using browser storage as fallback. To sync globally, please configure Vercel KV database.`);
        }
      } else {
        if (selectedQuestion) {
          setSuccess(`✅ Question updated successfully! Available to all students globally.`);
        } else {
          setSuccess(`✅ New question added successfully! Available to all students globally.`);
        }
      }

      // Update local state
      if (selectedQuestion) {
        setQuestions(prev => prev.map(q => q.id === questionData.id ? questionData : q));
      } else {
        setQuestions(prev => [...prev, questionData]);
      }

      // Refresh global state to sync across all devices
      await refreshData();

      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save question:', error);
      setError(`❌ Failed to save question: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your database configuration.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (question: Question) => {
    if (!window.confirm(`Are you sure you want to delete this question? This action cannot be undone and will sync across all devices.`)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await dbService.deleteQuestion(question.id);
      setQuestions(prev => prev.filter(q => q.id !== question.id));
      setSuccess('Question deleted successfully and synced globally!');
      
      // Refresh global state to sync with other devices
      await refreshData();
    } catch (error) {
      console.error('Failed to delete question:', error);
      setError('Failed to delete question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshData = async () => {
    setLoading(true);
    try {
      await refreshData();
      setSuccess('Questions refreshed from global database!');
    } catch (error) {
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const getSubjectName = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.name || 'Unknown Subject';
  };

  const getTopicName = (topicId: string) => {
    return topics.find(t => t.id === topicId)?.name || 'Unknown Topic';
  };

  const filteredTopics = topics.filter(topic => topic.subjectId === formData.subjectId);

  return (
    <Box>
      {/* Header with Global Sync Status */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            ❓ Question Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage practice questions across all devices and locations globally
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="caption" color={syncStatus === 'success' ? 'success.main' : 'text.secondary'}>
            {syncStatus === 'success' ? '✅ Synced globally' : 
             syncStatus === 'syncing' ? '🔄 Syncing...' : 
             syncStatus === 'error' ? '❌ Sync error' : '⏳ Ready'}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={handleRefreshData}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <RefreshCw size={16} />}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            onClick={() => handleOpenDialog()}
            startIcon={<Plus size={20} />}
            disabled={loading}
          >
            Add Question
          </Button>
        </Box>
      </Box>

      {/* Questions Grid */}
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))' }}>
        {questions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card sx={{ 
              height: '100%',
              '&:hover': { boxShadow: 4 }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HelpCircle size={24} />
                    <Typography variant="h6" component="h2">
                      Question {index + 1}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(question)}
                      disabled={loading}
                    >
                      <Edit size={16} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteQuestion(question)}
                      disabled={loading}
                      sx={{ color: 'error.main' }}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body1" sx={{ mb: 2, fontWeight: 'medium' }}>
                  {question.question}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={getSubjectName(question.subjectId)} size="small" color="primary" />
                  <Chip label={getTopicName(question.topicId)} size="small" variant="outlined" />
                  <Chip 
                    label={question.type} 
                    size="small" 
                    color={question.type === 'essay' ? 'warning' : 'default'} 
                  />
                  <Chip 
                    label={question.difficulty} 
                    size="small" 
                    color={
                      question.difficulty === 'hard' ? 'error' : 
                      question.difficulty === 'medium' ? 'warning' : 'success'
                    } 
                  />
                </Box>

                {question.type === 'multiple-choice' && question.options && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Options:</Typography>
                    {question.options.slice(0, 2).map((option, idx) => (
                      <Typography key={idx} variant="body2" sx={{ fontSize: '0.85rem' }}>
                        {String.fromCharCode(65 + idx)}. {option}
                      </Typography>
                    ))}
                    {question.options.length > 2 && (
                      <Typography variant="caption" color="text.secondary">
                        +{question.options.length - 2} more options...
                      </Typography>
                    )}
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {question.points} points
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Updated: {new Date(question.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {questions.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <HelpCircle size={48} style={{ opacity: 0.5 }} />
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            No questions created yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first question to start building the question bank
          </Typography>
          <Button
            variant="contained"
            onClick={() => handleOpenDialog()}
            startIcon={<Plus size={20} />}
          >
            Create First Question
          </Button>
        </Paper>
      )}

      {/* Add/Edit Question Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedQuestion ? 'Edit Question' : 'Add New Question'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
              <FormControl fullWidth required>
                <InputLabel>Subject</InputLabel>
                <Select
                  value={formData.subjectId}
                  label="Subject"
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, subjectId: e.target.value, topicId: '' }));
                  }}
                  disabled={loading}
                >
                  {subjects.map(subject => (
                    <MenuItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth required disabled={!formData.subjectId}>
                <InputLabel>Topic</InputLabel>
                <Select
                  value={formData.topicId}
                  label="Topic"
                  onChange={(e) => setFormData(prev => ({ ...prev, topicId: e.target.value }))}
                  disabled={loading}
                >
                  {filteredTopics.map(topic => (
                    <MenuItem key={topic.id} value={topic.id}>
                      {topic.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <FormControl fullWidth>
              <InputLabel>Question Type</InputLabel>
              <Select
                value={formData.type}
                label="Question Type"
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                disabled={loading}
              >
                <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                <MenuItem value="essay">Essay</MenuItem>
                <MenuItem value="true-false">True/False</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Question"
              value={formData.question}
              onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
              fullWidth
              required
              multiline
              rows={3}
              disabled={loading}
            />

            {formData.type === 'multiple-choice' && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Answer Options
                </Typography>
                {formData.options.map((option, index) => (
                  <TextField
                    key={index}
                    label={`Option ${String.fromCharCode(65 + index)}`}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...formData.options];
                      newOptions[index] = e.target.value;
                      setFormData(prev => ({ ...prev, options: newOptions }));
                    }}
                    fullWidth
                    sx={{ mb: 1 }}
                    disabled={loading}
                  />
                ))}
              </Box>
            )}

            <TextField
              label="Correct Answer"
              value={formData.correctAnswer}
              onChange={(e) => setFormData(prev => ({ ...prev, correctAnswer: e.target.value }))}
              fullWidth
              disabled={loading}
            />
            
            <TextField
              label="Explanation"
              value={formData.explanation}
              onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
              fullWidth
              multiline
              rows={2}
              disabled={loading}
            />

            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr 1fr' }}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={formData.difficulty}
                  label="Difficulty"
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                  disabled={loading}
                >
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Points"
                type="number"
                value={formData.points}
                onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                disabled={loading}
              />

              <TextField
                label="Marks"
                type="number"
                value={formData.marks}
                onChange={(e) => setFormData(prev => ({ ...prev, marks: parseInt(e.target.value) || 0 }))}
                disabled={loading}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveQuestion}
            variant="contained"
            disabled={loading || !formData.question.trim()}
            startIcon={loading ? <CircularProgress size={16} /> : <Save size={16} />}
          >
            {loading ? 'Saving...' : (selectedQuestion ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbars */}
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QuestionManagerGlobal;
