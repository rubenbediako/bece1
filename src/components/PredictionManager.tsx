import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Switch,
  FormControlLabel,
  Slider,
  LinearProgress,
  Stack
} from '@mui/material';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Target, Eye, EyeOff } from 'lucide-react';
import type { Subject, Topic, Question, PredictedTopic } from '../types';

interface PredictionManagerProps {
  subjects: Subject[];
  topics: Topic[];
  questions: Question[];
  predictedTopics: PredictedTopic[];
  setPredictedTopics: React.Dispatch<React.SetStateAction<PredictedTopic[]>>;
}

const PredictionManager: React.FC<PredictionManagerProps> = ({ 
  subjects, 
  topics,
  questions, 
  predictedTopics, 
  setPredictedTopics 
}) => {
  const [open, setOpen] = useState(false);
  const [editingPrediction, setEditingPrediction] = useState<PredictedTopic | null>(null);
  const [selectedSubject, setSelectedSubject] = useState('');

  const [formData, setFormData] = useState({
    subjectId: '',
    topicId: '',
    probability: 50,
    reasoning: '',
    isActive: true
  });

  const handleOpen = (prediction?: PredictedTopic) => {
    if (prediction) {
      setEditingPrediction(prediction);
      setFormData({
        subjectId: prediction.subjectId,
        topicId: prediction.topicId,
        probability: prediction.probability,
        reasoning: prediction.reasoning,
        isActive: prediction.isActive
      });
    } else {
      setEditingPrediction(null);
      setFormData({
        subjectId: '',
        topicId: '',
        probability: 50,
        reasoning: '',
        isActive: true
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPrediction(null);
  };

  const handleSave = () => {
    if (!formData.subjectId || !formData.topicId || !formData.reasoning.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const now = new Date().toISOString();

    if (editingPrediction) {
      // Update existing prediction
      setPredictedTopics(prev => prev.map(p => 
        p.id === editingPrediction.id
          ? {
              ...p,
              probability: formData.probability,
              reasoning: formData.reasoning,
              isActive: formData.isActive
            }
          : p
      ));
    } else {
      // Check if prediction already exists for this topic
      const existingPrediction = predictedTopics.find(p => 
        p.subjectId === formData.subjectId && p.topicId === formData.topicId
      );

      if (existingPrediction) {
        alert('A prediction already exists for this topic. Please edit the existing one.');
        return;
      }

      // Create new prediction
      const newPrediction: PredictedTopic = {
        id: `prediction-${Date.now()}`,
        subjectId: formData.subjectId,
        topicId: formData.topicId,
        probability: formData.probability,
        reasoning: formData.reasoning,
        isActive: formData.isActive,
        createdAt: now
      };
      setPredictedTopics(prev => [...prev, newPrediction]);
    }

    handleClose();
  };

  const handleDelete = (predictionId: string) => {
    if (window.confirm('Are you sure you want to delete this prediction?')) {
      setPredictedTopics(prev => prev.filter(p => p.id !== predictionId));
    }
  };

  const toggleActive = (predictionId: string) => {
    setPredictedTopics(prev => prev.map(p => 
      p.id === predictionId ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const handleSubjectChange = (subjectId: string) => {
    setFormData(prev => ({ ...prev, subjectId, topicId: '' }));
  };

  const getTopicsForSubject = (subjectId: string) => {
    return topics.filter(t => t.subjectId === subjectId);
  };

  const getSubjectName = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.name || 'Unknown Subject';
  };

  const getTopicName = (topicId: string) => {
    return topics.find(t => t.id === topicId)?.name || 'Unknown Topic';
  };

  const getQuestionCount = (topicId: string) => {
    return questions.filter(q => q.topicId === topicId).length;
  };

  const filteredPredictions = selectedSubject 
    ? predictedTopics.filter(p => p.subjectId === selectedSubject)
    : predictedTopics;

  const activePredictions = filteredPredictions.filter(p => p.isActive);
  const avgProbability = activePredictions.length > 0 
    ? Math.round(activePredictions.reduce((acc, p) => acc + p.probability, 0) / activePredictions.length)
    : 0;

  return (
    <Box>
      <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          🎯 Prediction Management
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Set topic predictions with probability and reasoning for BECE 2026
        </Typography>
      </Paper>

      {/* Controls and Stats */}
      <Stack direction="row" spacing={3} sx={{ mb: 3 }} flexWrap="wrap">
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => { handleOpen(); }}
          size="large"
        >
          Add Prediction
        </Button>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Subject</InputLabel>
          <Select
            value={selectedSubject}
            onChange={(e) => { setSelectedSubject(e.target.value); }}
            label="Filter by Subject"
          >
            <MenuItem value="">All Subjects</MenuItem>
            {subjects.map((subject) => (
              <MenuItem key={subject.id} value={subject.id}>
                {subject.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2">
            Active: {activePredictions.length}
          </Typography>
          <Typography variant="body2">
            Avg Probability: {avgProbability}%
          </Typography>
        </Box>
      </Stack>

      {/* Predictions List */}
      {filteredPredictions.length === 0 ? (
        <Alert severity="info">
          No predictions found. Add your first prediction to get started.
        </Alert>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 3 }}>
          {filteredPredictions.map((prediction, index) => (
            <motion.div
              key={prediction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                opacity: prediction.isActive ? 1 : 0.6,
                border: prediction.isActive ? '2px solid' : '1px solid',
                borderColor: prediction.isActive ? 'primary.main' : 'grey.300'
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Target size={24} color={prediction.isActive ? '#1976d2' : '#999'} />
                      <Box sx={{ ml: 1 }}>
                        <Typography variant="h6" color={prediction.isActive ? 'primary' : 'text.secondary'}>
                          {getSubjectName(prediction.subjectId)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {getTopicName(prediction.topicId)}
                        </Typography>
                      </Box>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={prediction.isActive}
                          onChange={() => { toggleActive(prediction.id); }}
                          size="small"
                        />
                      }
                      label={prediction.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                      sx={{ m: 0 }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Probability
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={prediction.probability} 
                        sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                        color={
                          prediction.probability >= 70 ? 'success' :
                          prediction.probability >= 40 ? 'warning' : 'error'
                        }
                      />
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        {prediction.probability}%
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Reasoning:
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {prediction.reasoning}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label={`${getQuestionCount(prediction.topicId)} questions`} 
                      size="small" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={prediction.isActive ? 'Active' : 'Inactive'} 
                      size="small" 
                      color={prediction.isActive ? 'success' : 'default'}
                    />
                  </Box>
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    startIcon={<Edit size={16} />}
                    onClick={() => { handleOpen(prediction); }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Trash2 size={16} />}
                    onClick={() => { handleDelete(prediction.id); }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          ))}
        </Box>
      )}

      {/* Add/Edit Prediction Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPrediction ? 'Edit Prediction' : 'Add New Prediction'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Subject and Topic Selection */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <FormControl fullWidth disabled={!!editingPrediction}>
                <InputLabel>Subject *</InputLabel>
                <Select
                  value={formData.subjectId}
                  onChange={(e) => { handleSubjectChange(e.target.value); }}
                  label="Subject *"
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth disabled={!formData.subjectId || !!editingPrediction}>
                <InputLabel>Topic *</InputLabel>
                <Select
                  value={formData.topicId}
                  onChange={(e) => { setFormData(prev => ({ ...prev, topicId: e.target.value })); }}
                  label="Topic *"
                >
                  {getTopicsForSubject(formData.subjectId).map((topic) => (
                    <MenuItem key={topic.id} value={topic.id}>
                      {topic.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Probability Slider */}
            <Box>
              <Typography variant="body1" gutterBottom>
                Probability: {formData.probability}%
              </Typography>
              <Slider
                value={formData.probability}
                onChange={(_, value) => { setFormData(prev => ({ ...prev, probability: value })); }}
                min={0}
                max={100}
                step={5}
                marks={[
                  { value: 0, label: '0%' },
                  { value: 25, label: '25%' },
                  { value: 50, label: '50%' },
                  { value: 75, label: '75%' },
                  { value: 100, label: '100%' }
                ]}
                sx={{ mt: 2 }}
              />
            </Box>

            {/* Reasoning */}
            <TextField
              label="Reasoning *"
              fullWidth
              multiline
              rows={4}
              value={formData.reasoning}
              onChange={(e) => { setFormData(prev => ({ ...prev, reasoning: e.target.value })); }}
              placeholder="Explain why this topic is likely to appear in BECE 2026..."
            />

            {/* Active Toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => { setFormData(prev => ({ ...prev, isActive: e.target.checked })); }}
                />
              }
              label="Active (visible in predictions)"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingPrediction ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PredictionManager;
