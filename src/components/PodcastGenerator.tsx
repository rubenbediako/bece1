import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  LinearProgress,
  Stack,
  Chip,
  Paper
} from '@mui/material';
import { Mic, Play, Download, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { QuestionSolution } from '../types';

interface PodcastGeneratorProps {
  open: boolean;
  onClose: () => void;
  onSave: (solution: QuestionSolution) => void;
  existingSolution?: QuestionSolution;
  questionText: string;
}

const PodcastGenerator: React.FC<PodcastGeneratorProps> = ({
  open,
  onClose,
  onSave,
  existingSolution,
  questionText
}) => {
  const [generating, setGenerating] = useState(false);
  const [solution, setSolution] = useState<QuestionSolution>(
    existingSolution || {
      textSolution: '',
      hasPodcast: false,
      podcastUrl: '',
      podcastDuration: 0,
      podcastTranscript: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  );

  const handleGeneratePodcast = async () => {
    if (!solution.textSolution?.trim()) {
      alert('Please enter a text solution first to generate the podcast.');
      return;
    }

    setGenerating(true);
    
    // Simulate podcast generation process
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock podcast data
      const duration = Math.floor(Math.random() * 180) + 60; // 1-4 minutes
      const mockPodcastUrl = `https://podcast.bece2026.com/solutions/${Date.now()}.mp3`;
      
      setSolution(prev => ({
        ...prev,
        hasPodcast: true,
        podcastUrl: mockPodcastUrl,
        podcastDuration: duration,
        podcastTranscript: generatePodcastTranscript(prev.textSolution || ''),
        updatedAt: new Date().toISOString()
      }));
      
    } catch (error) {
      alert('Failed to generate podcast. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const generatePodcastTranscript = (textSolution: string): string => {
    return `Welcome to BECE 2026 Solution Podcast!

Today we'll be walking through the solution to this question step by step.

The question asks: "${questionText.substring(0, 100)}${questionText.length > 100 ? '...' : ''}"

Let me break down the solution for you:

${textSolution}

I hope this explanation helps you understand the concept better. Remember to practice similar problems to strengthen your understanding.

Thank you for listening to BECE 2026 Solution Podcast!`;
  };

  const handleSave = () => {
    const finalSolution: QuestionSolution = {
      ...solution,
      updatedAt: new Date().toISOString()
    };
    onSave(finalSolution);
    onClose();
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Volume2 size={24} />
          <Typography variant="h6">
            Enhanced Solution with Podcast
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={3}>
          {/* Question Preview */}
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" gutterBottom color="primary">
              Question:
            </Typography>
            <Typography variant="body2">
              {questionText}
            </Typography>
          </Paper>

          {/* Text Solution */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Text Solution (Optional)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={solution.textSolution || ''}
              onChange={(e) => setSolution(prev => ({ 
                ...prev, 
                textSolution: e.target.value 
              }))}
              placeholder="Enter the detailed solution explanation here... (This will be used to generate the podcast)"
              variant="outlined"
            />
          </Box>

          {/* Podcast Generation */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">
                Audio Podcast Solution
              </Typography>
              <Button
                variant="contained"
                startIcon={<Mic />}
                onClick={handleGeneratePodcast}
                disabled={generating || !solution.textSolution?.trim()}
                color="secondary"
              >
                {generating ? 'Generating...' : 'Generate Podcast'}
              </Button>
            </Box>

            {generating && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  🎙️ Creating your personalized solution podcast...
                </Typography>
                <LinearProgress />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  This may take a few moments. We're converting your text solution into an engaging audio explanation.
                </Typography>
              </Box>
            )}

            {solution.hasPodcast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Paper sx={{ p: 2, bgcolor: 'success.50', border: 1, borderColor: 'success.200' }}>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        icon={<Volume2 size={16} />} 
                        label="Podcast Ready" 
                        color="success" 
                        size="small"
                      />
                      <Chip 
                        label={`Duration: ${formatDuration(solution.podcastDuration || 0)}`} 
                        variant="outlined" 
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary">
                      🎉 Your solution podcast has been generated successfully! Students will be able to listen to a clear, step-by-step audio explanation.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<Play />} variant="outlined">
                        Preview
                      </Button>
                      <Button size="small" startIcon={<Download />} variant="outlined">
                        Download
                      </Button>
                    </Box>
                  </Stack>
                </Paper>
              </motion.div>
            )}
          </Box>

          {/* Podcast Transcript (if generated) */}
          {solution.podcastTranscript && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Generated Podcast Transcript:
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.50', maxHeight: 200, overflow: 'auto' }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {solution.podcastTranscript}
                </Typography>
              </Paper>
            </Box>
          )}

          {/* Additional Features */}
          <Alert severity="info">
            <strong>🎯 Pro Tip:</strong> Podcasts help students learn auditorily and can be listened to while commuting or studying. 
            They're automatically generated from your text solutions using AI voice synthesis.
          </Alert>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Solution
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PodcastGenerator;
