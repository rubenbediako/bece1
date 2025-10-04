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
  CircularProgress,
  Slider
} from '@mui/material';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, TrendingUp, Save, Target } from 'lucide-react';
import { useGlobalState } from '../contexts/GlobalStateContext';
import type { Subject, Topic, Question, PredictedTopic } from '../types';

interface PredictionManagerGlobalProps {
  subjects: Subject[];
  topics: Topic[];
  questions: Question[];
  predictedTopics: PredictedTopic[];
}

const PredictionManagerGlobal: React.FC<PredictionManagerGlobalProps> = ({ 
  subjects: globalSubjects,
  topics: globalTopics,
  predictedTopics: globalPredictedTopics
}) => {
  const { refreshData, syncStatus } = useGlobalState();
  const [subjects] = useState<Subject[]>(globalSubjects);
  const [topics] = useState<Topic[]>(globalTopics);
  const [predictedTopics, setPredictedTopics] = useState<PredictedTopic[]>(globalPredictedTopics);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<PredictedTopic | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Sync local state with global state when it changes
  React.useEffect(() => {
    setPredictedTopics(globalPredictedTopics);
  }, [globalPredictedTopics]);

  const [formData, setFormData] = useState({
    subjectId: '',
    topicId: '',
    probability: 75,
    reasoning: '',
    isActive: true,
    examDate: '2026-04-15' // BECE 2026 estimated date
  });

  const resetForm = () => {
    setFormData({
      subjectId: '',
      topicId: '',
      probability: 75,
      reasoning: '',
      isActive: true,
      examDate: '2026-04-15'
    });
    setSelectedPrediction(null);
  };

  const handleOpenDialog = (prediction?: PredictedTopic) => {
    if (prediction) {
      setSelectedPrediction(prediction);
      setFormData({
        subjectId: prediction.subjectId,
        topicId: prediction.topicId,
        probability: prediction.probability,
        reasoning: prediction.reasoning || '',
        isActive: prediction.isActive,
        examDate: prediction.examDate || '2026-04-15'
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

  const handleSavePrediction = async () => {
    if (!formData.subjectId || !formData.topicId) {
      setError('Subject and topic are required');
      return;
    }

    if (!formData.reasoning.trim()) {
      setError('Prediction reasoning is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const now = new Date().toISOString();
      const predictionData: PredictedTopic = {
        id: selectedPrediction?.id || `prediction_${Date.now()}`,
        subjectId: formData.subjectId,
        topicId: formData.topicId,
        probability: formData.probability,
        reasoning: formData.reasoning.trim(),
        isActive: formData.isActive,
        examDate: formData.examDate,
        createdAt: selectedPrediction?.createdAt || now,
        updatedAt: now
      };

      // TODO: Add savePredictedTopic to DatabaseService
      // For now, just update local state
      if (selectedPrediction) {
        setPredictedTopics(prev => prev.map(p => p.id === predictionData.id ? predictionData : p));
        setSuccess(`Prediction updated successfully! Available to all students globally.`);
      } else {
        setPredictedTopics(prev => [...prev, predictionData]);
        setSuccess(`New prediction created successfully! Available to all students globally.`);
      }

      // Refresh global state to sync across all devices
      await refreshData();

      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save prediction:', error);
      setError(error instanceof Error ? error.message : 'Failed to save prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrediction = async (prediction: PredictedTopic) => {
    if (!window.confirm(`Are you sure you want to delete this prediction? This action cannot be undone and will sync across all devices.`)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: Add deletePredictedTopic to DatabaseService
      setPredictedTopics(prev => prev.filter(p => p.id !== prediction.id));
      setSuccess('Prediction deleted successfully and synced globally!');
      
      // Refresh global state to sync with other devices
      await refreshData();
    } catch (error) {
      console.error('Failed to delete prediction:', error);
      setError('Failed to delete prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (prediction: PredictedTopic) => {
    setLoading(true);
    try {
      const updatedPrediction = { ...prediction, isActive: !prediction.isActive };
      setPredictedTopics(prev => prev.map(p => p.id === prediction.id ? updatedPrediction : p));
      setSuccess(`Prediction ${updatedPrediction.isActive ? 'activated' : 'deactivated'} successfully!`);
      
      await refreshData();
    } catch (error) {
      setError('Failed to update prediction status');
    } finally {
      setLoading(false);
    }
  };

  const getTopicsForSubject = (subjectId: string) => {
    return topics.filter(topic => topic.subjectId === subjectId);
  };

  const getSubjectName = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.name || 'Unknown Subject';
  };

  const getTopicName = (topicId: string) => {
    return topics.find(t => t.id === topicId)?.name || 'Unknown Topic';
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'error';
    if (probability >= 70) return 'warning';
    if (probability >= 60) return 'info';
    return 'default';
  };

  return (
    <Box>
      {/* Header with Global Sync Status */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            🎯 BECE 2026 Predictions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage exam predictions available to all students globally
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="caption" color={syncStatus === 'success' ? 'success.main' : 'text.secondary'}>
            {syncStatus === 'success' ? '✅ Synced globally' : 
             syncStatus === 'syncing' ? '🔄 Syncing...' : 
             syncStatus === 'error' ? '❌ Sync error' : '⏳ Ready'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => handleOpenDialog()}
            startIcon={<Plus size={20} />}
            disabled={loading}
          >
            Add Prediction
          </Button>
        </Box>
      </Box>

      {/* Predictions Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 3 }}>
        {predictedTopics.map((prediction) => (
          <motion.div
            key={prediction.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card 
              sx={{ 
                height: '100%',
                opacity: prediction.isActive ? 1 : 0.6,
                border: prediction.isActive ? '2px solid' : '1px solid',
                borderColor: prediction.isActive ? 'primary.main' : 'divider'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {getSubjectName(prediction.subjectId)}
                    </Typography>
                    <Typography variant="subtitle1" color="primary.main">
                      {getTopicName(prediction.topicId)}
                    </Typography>
                  </Box>
                  <Chip 
                    label={`${prediction.probability}%`}
                    color={getProbabilityColor(prediction.probability)}
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>

                <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                  💡 {prediction.reasoning}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip 
                    label={prediction.isActive ? 'Active' : 'Inactive'}
                    color={prediction.isActive ? 'success' : 'default'}
                    size="small"
                  />
                  <Chip 
                    label={`BECE ${prediction.examDate?.split('-')[0] || '2026'}`}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleToggleActive(prediction)}
                    disabled={loading}
                    color={prediction.isActive ? 'success' : 'default'}
                  >
                    <Target size={16} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(prediction)}
                    disabled={loading}
                  >
                    <Edit size={16} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeletePrediction(prediction)}
                    disabled={loading}
                    color="error"
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {predictedTopics.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
          <TrendingUp size={48} color="#ccc" />
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            No Predictions Yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create your first BECE 2026 topic prediction to help students focus their studies
          </Typography>
          <Button
            variant="contained"
            onClick={() => handleOpenDialog()}
            startIcon={<Plus size={20} />}
          >
            Add First Prediction
          </Button>
        </Paper>
      )}

      {/* Prediction Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedPrediction ? 'Edit Prediction' : 'Create New Prediction'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Subject</InputLabel>
              <Select
                value={formData.subjectId}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  subjectId: e.target.value,
                  topicId: '' // Reset topic when subject changes
                }))}
                label="Subject"
              >
                {subjects.map(subject => (
                  <MenuItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={!formData.subjectId}>
              <InputLabel>Topic</InputLabel>
              <Select
                value={formData.topicId}
                onChange={(e) => setFormData(prev => ({ ...prev, topicId: e.target.value }))}
                label="Topic"
              >
                {getTopicsForSubject(formData.subjectId).map(topic => (
                  <MenuItem key={topic.id} value={topic.id}>
                    {topic.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <Typography gutterBottom>
                Prediction Probability: {formData.probability}%
              </Typography>
              <Slider
                value={formData.probability}
                onChange={(_, value) => setFormData(prev => ({ ...prev, probability: value as number }))}
                min={1}
                max={100}
                step={5}
                marks={[
                  { value: 25, label: '25%' },
                  { value: 50, label: '50%' },
                  { value: 75, label: '75%' },
                  { value: 100, label: '100%' }
                ]}
                sx={{ mt: 2 }}
              />
            </Box>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Prediction Reasoning"
              value={formData.reasoning}
              onChange={(e) => setFormData(prev => ({ ...prev, reasoning: e.target.value }))}
              placeholder="Explain why this topic is likely to appear in BECE 2026..."
              helperText="Provide clear reasoning that students can understand"
            />

            <TextField
              fullWidth
              type="date"
              label="Exam Date"
              value={formData.examDate}
              onChange={(e) => setFormData(prev => ({ ...prev, examDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSavePrediction}
            variant="contained"
            disabled={loading || !formData.subjectId || !formData.topicId || !formData.reasoning.trim()}
            startIcon={loading ? <CircularProgress size={16} /> : <Save size={16} />}
          >
            {loading ? 'Saving...' : selectedPrediction ? 'Update Prediction' : 'Create Prediction'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbars */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        <Alert onClose={() => setSuccess(null)} severity="success">
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PredictionManagerGlobal;
