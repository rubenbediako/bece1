import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  LinearProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress
} from '@mui/material';
import {
  Volume2,
  ChevronDown,
  Play,
  Pause,
  Square,
  Settings,
  Mic,
  GraduationCap,
  Brain,
  Sparkles,
  Download,
  Headphones
} from 'lucide-react';
import type { Question, AIAnswer, Subject, AudioExplanation, AudioSolutionConfig } from '../types';
import AudioSolutionService from '../services/AudioSolutionService';

interface Props {
  question: Question;
  subject: Subject;
  aiAnswer?: AIAnswer;
  open: boolean;
  onClose: () => void;
}

export const AudioSolutionDialog: React.FC<Props> = ({ 
  question, 
  subject, 
  aiAnswer, 
  open, 
  onClose 
}) => {
  const [audioExplanation, setAudioExplanation] = useState<AudioExplanation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Audio configuration state
  const [audioConfig, setAudioConfig] = useState<AudioSolutionConfig>({
    voice: {
      rate: 0.85,
      pitch: 1.0,
      volume: 0.9,
      language: 'en-US'
    },
    style: 'teacher',
    includeIntroduction: true,
    includeStepByStep: true,
    includeConclusion: true,
    duration: 'medium'
  });

  const audioService = AudioSolutionService.getInstance();

  // Generate audio explanation
  const generateAudioExplanation = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const explanation = await audioService.generateAudioExplanation(
        question,
        aiAnswer,
        audioConfig
      );
      setAudioExplanation(explanation);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate audio explanation';
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, [question, aiAnswer, audioConfig, audioService]);

  // Auto-generate explanation when dialog opens
  useEffect(() => {
    if (open && !audioExplanation && !isGenerating) {
      generateAudioExplanation();
    }
  }, [open, audioExplanation, isGenerating, generateAudioExplanation]);

  // Play audio explanation
  const playAudioExplanation = async () => {
    if (!audioExplanation) return;
    
    setIsPlaying(true);
    setCurrentSectionIndex(0);
    
    try {
      await audioService.playAudioExplanation(
        audioExplanation,
        (sectionIndex, isPlaying) => {
          setCurrentSectionIndex(sectionIndex);
          if (!isPlaying && sectionIndex === audioExplanation.sections.length - 1) {
            setIsPlaying(false);
            setCurrentSectionIndex(0);
          }
        },
        () => {
          setIsPlaying(false);
          setCurrentSectionIndex(0);
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Playback error');
      setIsPlaying(false);
    }
  };

  // Stop audio playback
  const stopAudioExplanation = () => {
    audioService.stopAudio();
    setIsPlaying(false);
    setCurrentSectionIndex(0);
  };

  // Update audio configuration
  const updateAudioConfig = (updates: Partial<AudioSolutionConfig>) => {
    setAudioConfig(prev => ({ ...prev, ...updates }));
    setAudioExplanation(null); // Reset explanation to trigger regeneration
  };

  // Format duration for display
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get available voices
  const availableVoices = audioService.getAvailableVoices();

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Headphones size={24} color="#1976d2" />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Audio Explanation
          </Typography>
          <IconButton onClick={() => setShowSettings(!showSettings)}>
            <Settings size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Question Info */}
        <Card sx={{ mb: 3, bgcolor: 'primary.50' }}>
          <CardContent>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              {subject.name} • {question.marks || question.points} marks
            </Typography>
            <Typography variant="body1">
              {question.question}
            </Typography>
          </CardContent>
        </Card>

        {/* Audio Settings */}
        {showSettings && (
          <Accordion sx={{ mb: 3 }}>
            <AccordionSummary expandIcon={<ChevronDown size={20} />}>
              <Typography variant="subtitle1">Audio Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Voice Style */}
                <FormControl fullWidth>
                  <InputLabel>Explanation Style</InputLabel>
                  <Select
                    value={audioConfig.style}
                    onChange={(e) => updateAudioConfig({ style: e.target.value as any })}
                    label="Explanation Style"
                  >
                    <MenuItem value="teacher">Teacher (Formal & Educational)</MenuItem>
                    <MenuItem value="conversational">Conversational (Friendly & Casual)</MenuItem>
                    <MenuItem value="expert">Expert (Detailed & Academic)</MenuItem>
                    <MenuItem value="student">Student (Peer-to-Peer)</MenuItem>
                  </Select>
                </FormControl>

                {/* Voice Settings */}
                <Box>
                  <Typography gutterBottom>Speech Rate</Typography>
                  <Slider
                    value={audioConfig.voice.rate}
                    onChange={(_, value) => updateAudioConfig({
                      voice: { ...audioConfig.voice, rate: value as number }
                    })}
                    min={0.5}
                    max={1.5}
                    step={0.1}
                    marks={[
                      { value: 0.5, label: 'Slow' },
                      { value: 1.0, label: 'Normal' },
                      { value: 1.5, label: 'Fast' }
                    ]}
                  />
                </Box>

                <Box>
                  <Typography gutterBottom>Voice Pitch</Typography>
                  <Slider
                    value={audioConfig.voice.pitch}
                    onChange={(_, value) => updateAudioConfig({
                      voice: { ...audioConfig.voice, pitch: value as number }
                    })}
                    min={0.5}
                    max={1.5}
                    step={0.1}
                    marks={[
                      { value: 0.5, label: 'Low' },
                      { value: 1.0, label: 'Normal' },
                      { value: 1.5, label: 'High' }
                    ]}
                  />
                </Box>

                {/* Content Options */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Include Sections:</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={audioConfig.includeIntroduction}
                        onChange={(e) => updateAudioConfig({ includeIntroduction: e.target.checked })}
                      />
                    }
                    label="Introduction"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={audioConfig.includeStepByStep}
                        onChange={(e) => updateAudioConfig({ includeStepByStep: e.target.checked })}
                      />
                    }
                    label="Step-by-Step Solution"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={audioConfig.includeConclusion}
                        onChange={(e) => updateAudioConfig({ includeConclusion: e.target.checked })}
                      />
                    }
                    label="Conclusion"
                  />
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Audio Explanation Content */}
        {isGenerating ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={48} />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Generating AI audio explanation...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This may take a few moments
            </Typography>
          </Box>
        ) : audioExplanation ? (
          <Box>
            {/* Audio Controls */}
            <Card sx={{ mb: 3, bgcolor: 'action.hover' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {audioExplanation.title}
                  </Typography>
                  <Chip 
                    label={`${formatDuration(audioExplanation.totalDuration)}`}
                    size="small"
                    color="primary"
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  {!isPlaying ? (
                    <Button
                      variant="contained"
                      startIcon={<Play size={20} />}
                      onClick={playAudioExplanation}
                      size="large"
                    >
                      Play Explanation
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<Square size={20} />}
                      onClick={stopAudioExplanation}
                      size="large"
                    >
                      Stop
                    </Button>
                  )}
                  
                  <Button
                    variant="outlined"
                    startIcon={<Sparkles size={20} />}
                    onClick={generateAudioExplanation}
                    disabled={isGenerating}
                  >
                    Regenerate
                  </Button>
                </Box>

                {/* Progress Indicator */}
                {isPlaying && (
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={(currentSectionIndex / audioExplanation.sections.length) * 100}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Playing section {currentSectionIndex + 1} of {audioExplanation.sections.length}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Audio Sections */}
            <Typography variant="h6" gutterBottom>
              Explanation Sections
            </Typography>
            <List>
              {audioExplanation.sections
                .sort((a, b) => a.order - b.order)
                .map((section, index) => (
                <ListItem 
                  key={section.id}
                  sx={{ 
                    bgcolor: currentSectionIndex === index && isPlaying ? 'primary.50' : 'transparent',
                    borderRadius: 1,
                    mb: 1
                  }}
                >
                  <ListItemIcon>
                    {currentSectionIndex === index && isPlaying ? (
                      <Volume2 size={20} color="#1976d2" />
                    ) : (
                      <Mic size={20} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={section.title}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Duration: {formatDuration(section.duration)}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {section.content.length > 150 
                            ? `${section.content.substring(0, 150)}...`
                            : section.content
                          }
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>

            {/* Full Transcript */}
            <Accordion sx={{ mt: 3 }}>
              <AccordionSummary expandIcon={<ChevronDown size={20} />}>
                <Typography variant="subtitle1">Full Transcript</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    whiteSpace: 'pre-line',
                    lineHeight: 1.8,
                    fontFamily: 'monospace'
                  }}
                >
                  {audioExplanation.transcript}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
        {audioExplanation && (
          <Button
            startIcon={<Download size={20} />}
            onClick={() => {
              // Create downloadable transcript
              const blob = new Blob([audioExplanation.transcript], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `audio-explanation-${question.id}.txt`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
          >
            Download Transcript
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AudioSolutionDialog;
