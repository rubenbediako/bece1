import React, { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  AutoAwesome,
  VolumeUp,
  ExpandMore,
  PlayArrow,
  Pause,
  Download,
  School,
  Psychology
} from '@mui/icons-material';
import type { Question, AIAnswer, PodcastConversation, PodcastDialogue, Subject } from '../types';
import { AIAnswerService } from '../services/AIAnswerService';
import { aiAnswerAPI, podcastAPI } from '../api/database';

interface Props {
  question: Question;
  subject: Subject;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const AIQuestionSolutionDialog: React.FC<Props> = ({ question, subject, onClose }) => {
  const [aiAnswer, setAiAnswer] = useState<AIAnswer | null>(null);
  const [podcastConversation, setPodcastConversation] = useState<PodcastConversation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPodcast, setIsGeneratingPodcast] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [playbackInterval, setPlaybackInterval] = useState<number | null>(null);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const aiService = AIAnswerService.getInstance();

  // Determine if question is eligible for AI enhancement
  const isEligibleSubject = ['social-studies', 'rme', 'english'].includes(subject.id);
  const questionMarks = question.marks ?? question.points ?? 10;

  const generateAIAnswerCallback = React.useCallback(async () => {
    if (!isEligibleSubject) return;

    setIsGenerating(true);
    try {
      // First check if we already have a cached AI answer
      let cachedAnswer = null;
      try {
        cachedAnswer = await aiAnswerAPI.get(question.id);
      } catch (dbError) {
        console.warn('Database error when fetching cached answer, continuing with generation:', dbError);
        // Continue without database - generate fresh answer
      }
      
      if (cachedAnswer) {
        setAiAnswer(cachedAnswer);
        return;
      }

      // Generate new AI answer
      const aiAnswerRequest = {
        question: question.question,
        subject: subject.id as 'social-studies' | 'rme' | 'english',
        marks: questionMarks,
        difficulty: question.difficulty,
        context: subject.description
      };

      const generatedAnswer = await aiService.generateAnswer(aiAnswerRequest);
      setAiAnswer(generatedAnswer);
      
      // Try to save to database, but don't fail if database is unavailable
      try {
        await aiAnswerAPI.save(question.id, generatedAnswer);
        console.log('AI answer saved successfully to database');
      } catch (dbError) {
        console.warn('Database not available for saving AI answer - proceeding without cache:', dbError);
        // This is fine - the answer will still work, just won't be cached
      }
    } catch (error) {
      console.error('Error generating AI answer:', error);
      // Show user-friendly error
      alert(`Failed to generate AI answer: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsGenerating(false);
    }
  }, [isEligibleSubject, question.id, question.question, question.difficulty, subject.id, subject.description, questionMarks, aiService]);

  useEffect(() => {
    if (isEligibleSubject && !aiAnswer) {
      void generateAIAnswerCallback();
    }
    
    // Initialize speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
      
      // Load voices (sometimes needed on first page load)
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', () => {
          // Voices loaded
        });
      }
    }
  }, [question.id, isEligibleSubject, aiAnswer, generateAIAnswerCallback]);



  const generatePodcastConversation = async () => {
    if (!aiAnswer) {
      console.error('Cannot generate podcast: No AI answer available');
      return;
    }

    setIsGeneratingPodcast(true);
    try {
      console.log('Checking for cached podcast for question:', question.id);
      
      // Check if we already have a cached podcast
      let cachedPodcast = null;
      try {
        cachedPodcast = await podcastAPI.get(question.id);
      } catch (dbError) {
        console.warn('Database error when fetching cached podcast, continuing with generation:', dbError);
        // Continue without database - generate fresh podcast
      }
      
      if (cachedPodcast) {
        console.log('Found cached podcast:', cachedPodcast);
        setPodcastConversation(cachedPodcast);
        return;
      }

      console.log('No cached podcast found. Generating new conversation...');
      console.log('AI Answer:', aiAnswer);
      console.log('Question:', question.question);

      // Generate new podcast conversation
      const conversation = await aiService.generatePodcastConversation(aiAnswer, question.question);
      console.log('Generated conversation:', conversation);
      
      if (!conversation || !conversation.dialogues || conversation.dialogues.length === 0) {
        throw new Error('Generated conversation is empty or invalid');
      }

      setPodcastConversation(conversation);
      
      // Try to save to database, but don't fail if database is unavailable
      console.log('Attempting to save conversation to database...');
      try {
        await podcastAPI.save(question.id, conversation);
        console.log('Conversation saved successfully to database');
      } catch (dbError) {
        console.warn('Database not available for saving conversation - proceeding without cache:', dbError);
        // This is fine - the conversation will still work, just won't be cached
      }
    } catch (error) {
      console.error('Error generating podcast conversation:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        aiAnswer: aiAnswer ? 'Present' : 'Missing',
        questionId: question.id,
        questionText: question.question
      });
      
      // Show user-friendly error with more context
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to generate podcast conversation: ${errorMessage}. This might be due to a temporary service issue. Please try again.`);
    } finally {
      setIsGeneratingPodcast(false);
    }
  };

  const playPodcastConversation = () => {
    if (!podcastConversation) {
      return;
    }

    if (!speechSynthesis) {
      alert('Speech synthesis is not supported in your browser. Please check your browser settings or try a different browser.');
      return;
    }
    
    setIsPlaying(true);
    setCurrentDialogueIndex(0);
    playDialogue(0);
  };

  const playDialogue = (index: number) => {
    if (!podcastConversation || !speechSynthesis || index >= podcastConversation.dialogues.length) {
      setIsPlaying(false);
      setCurrentDialogueIndex(0);
      return;
    }

    const dialogue = podcastConversation.dialogues[index];
    setCurrentDialogueIndex(index);

    // Stop any current speech
    speechSynthesis.cancel();

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(dialogue.text);
    
    // Ensure voices are loaded
    let voices = speechSynthesis.getVoices();
    if (voices.length === 0) {
      // Voices not yet loaded, wait for them
      speechSynthesis.onvoiceschanged = () => {
        voices = speechSynthesis.getVoices();
        setVoiceAndSpeak();
      };
      return;
    }
    
    const setVoiceAndSpeak = () => {
      // Set voice based on character
      
      if (voices.length > 0) {
        let selectedVoice = null;
        
        if (dialogue.character.gender === 'female') {
          // Try to find female voice with better criteria
          selectedVoice = voices.find((voice: SpeechSynthesisVoice) => 
            voice.name.toLowerCase().includes('female') || 
            voice.name.toLowerCase().includes('woman') ||
            voice.name.toLowerCase().includes('zira') ||
            voice.name.toLowerCase().includes('susan') ||
            voice.name.toLowerCase().includes('samantha') ||
            voice.name.toLowerCase().includes('victoria')
          );
          
          // Fallback: find any voice that sounds female
          if (!selectedVoice) {
            selectedVoice = voices.find((voice: SpeechSynthesisVoice) => 
              voice.name.includes('2') || voice.name.includes('Female')
            );
          }
        } else {
          // Try to find male voice
          selectedVoice = voices.find((voice: SpeechSynthesisVoice) => 
            voice.name.toLowerCase().includes('male') || 
            voice.name.toLowerCase().includes('man') ||
            voice.name.toLowerCase().includes('david') ||
            voice.name.toLowerCase().includes('mark') ||
            voice.name.toLowerCase().includes('alex') ||
            voice.name.toLowerCase().includes('tom')
          );
          
          // Fallback: find any voice that sounds male
          if (!selectedVoice) {
            selectedVoice = voices.find((voice: SpeechSynthesisVoice) => 
              voice.name.includes('1') || voice.name.includes('Male')
            );
          }
        }
        
        // If we found a specific voice, use it; otherwise use default
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      // Set speech parameters
      utterance.rate = 0.9; // Slightly slower for better comprehension
      utterance.pitch = dialogue.character.gender === 'female' ? 1.2 : 0.8;
      utterance.volume = 0.8;

      // Handle speech events
      utterance.onstart = () => {
        // Speech started
      };

      utterance.onend = () => {
        if (isPlaying) {
          // Wait a moment between dialogues
          const timeout = setTimeout(() => {
            playDialogue(index + 1);
          }, 1000);
          setPlaybackInterval(timeout);
        }
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      setCurrentUtterance(utterance);
      speechSynthesis.speak(utterance);
    };
    
    setVoiceAndSpeak();
  };

  const pausePodcastConversation = () => {
    setIsPlaying(false);
    
    // Cancel current speech
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
    
    // Clear any pending timeouts
    if (playbackInterval) {
      clearTimeout(playbackInterval);
      setPlaybackInterval(null);
    }
    
    setCurrentUtterance(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
      if (playbackInterval) {
        clearTimeout(playbackInterval);
      }
      if (currentUtterance) {
        setCurrentUtterance(null);
      }
    };
  }, [speechSynthesis, playbackInterval, currentUtterance]);

  const downloadAnswer = () => {
    if (!aiAnswer) return;

    const content = `Question: ${question.question}\n\nAnswer (${aiAnswer.marks} marks):\n\n${aiAnswer.content}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `answer_${question.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPodcastTranscript = () => {
    if (!podcastConversation) return;

    const content = `Podcast Conversation: ${podcastConversation.title}\n\nTranscript:\n\n${podcastConversation.transcript}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `podcast_transcript_${question.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getMarksBasedDescription = (marks: number) => {
    if (marks >= 12) return "6-paragraph essay: Introduction + 4 body paragraphs + Conclusion";
    if (marks >= 4) return "Complete sentences with detailed explanations";
    return "Basic response";
  };

  return (
    <Dialog 
      open={true} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      slotProps={{
        paper: { sx: { minHeight: '80vh' } }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Psychology color="primary" />
          <Box flex={1}>
            <Typography variant="h6">AI-Powered Solution</Typography>
            <Typography variant="body2" color="text.secondary">
              {subject.name} • {questionMarks} marks • {getMarksBasedDescription(questionMarks)}
            </Typography>
          </Box>
          {isEligibleSubject && (
            <Chip 
              icon={<AutoAwesome />} 
              label="AI Enhanced" 
              color="primary" 
              variant="outlined" 
            />
          )}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Question</Typography>
            <Typography variant="body1">{question.question}</Typography>
            <Box mt={2} display="flex" gap={1} flexWrap="wrap">
              <Chip label={`${questionMarks} marks`} size="small" />
              <Chip label={question.difficulty} size="small" color="secondary" />
              <Chip label={question.type} size="small" variant="outlined" />
            </Box>
          </CardContent>
        </Card>

        {!isEligibleSubject ? (
          <Alert severity="info">
            AI-powered detailed answers are available for Social Studies, RME, and English Language questions.
          </Alert>
        ) : (
          <>
            <Tabs value={tabValue} onChange={(_: React.SyntheticEvent, newValue: number) => setTabValue(newValue)}>
              <Tab icon={<School />} label="AI Answer" />
              <Tab 
                icon={<VolumeUp />} 
                label="Podcast Conversation" 
                disabled={!aiAnswer} 
              />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              {isGenerating ? (
                <Box>
                  <LinearProgress sx={{ mb: 2 }} />
                  <Typography>Generating comprehensive AI answer...</Typography>
                </Box>
              ) : aiAnswer ? (
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">
                      Detailed Answer ({aiAnswer.marks} marks)
                    </Typography>
                    <Button
                      startIcon={<Download />}
                      onClick={downloadAnswer}
                      size="small"
                    >
                      Download
                    </Button>
                  </Box>

                  <Alert severity="success" sx={{ mb: 2 }}>
                    AI has generated a {aiAnswer.answerType.replace('-', ' ')} with {aiAnswer.paragraphs.length} sections
                    {questionMarks >= 12 ? ' (6-paragraph essay format)' : questionMarks >= 4 ? ' (full sentences format)' : ''}
                  </Alert>

                  {aiAnswer.paragraphs.map((paragraph: string, index: number) => {
                    const getSectionTitle = () => {
                      if (questionMarks >= 12) {
                        // 6-paragraph essay structure
                        if (index === 0) return 'Introduction';
                        if (index === aiAnswer.paragraphs.length - 1) return 'Conclusion';
                        return `Body Paragraph ${index}`;
                      } else {
                        // Full sentences structure
                        return `Section ${index + 1}`;
                      }
                    };

                    return (
                      <Accordion key={index} defaultExpanded={index < 2}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="subtitle1">
                            {getSectionTitle()}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                            {paragraph}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" gutterBottom>Key Points</Typography>
                  <Box>
                    {aiAnswer.keyPoints.map((point: string, index: number) => (
                      <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                        • {point}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              ) : (
                  <Button
                    startIcon={<AutoAwesome />}
                    onClick={() => void generateAIAnswerCallback()}
                    variant="contained"
                    size="large"
                  >
                    Generate AI Answer
                  </Button>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {!podcastConversation ? (
                <Box textAlign="center">
                  <Typography variant="h6" gutterBottom>
                    Podcast Conversation
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Generate an interactive conversation between Student Serwaa and Teacher Das
                  </Typography>
                  
                  {!speechSynthesis && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      Speech synthesis is not supported in your browser. You can still read the transcript.
                    </Alert>
                  )}
                  
                  <Button
                    startIcon={<VolumeUp />}
                    onClick={generatePodcastConversation}
                    variant="contained"
                    size="large"
                    disabled={isGeneratingPodcast}
                  >
                    {isGeneratingPodcast ? 'Generating Conversation...' : 'Generate Podcast'}
                  </Button>
                  {import.meta.env.DEV && (
                    <>
                      <Button
                        onClick={() => {
                          console.log('Debug Info:');
                          console.log('AI Answer:', aiAnswer);
                          console.log('Question:', question);
                          console.log('Subject:', subject);
                          console.log('Speech Synthesis Available:', !!speechSynthesis);
                          if (speechSynthesis) {
                            console.log('Available Voices:', speechSynthesis.getVoices());
                          }
                        }}
                        variant="outlined"
                        size="small"
                        sx={{ ml: 2 }}
                      >
                        Debug Info
                      </Button>
                      <Button
                        onClick={async () => {
                          if (!aiAnswer) {
                            alert('No AI answer available for testing');
                            return;
                          }
                          
                          console.log('Testing podcast generation without database...');
                          try {
                            const testConversation = await aiService.generatePodcastConversation(aiAnswer, question.question);
                            console.log('✅ Test successful! Generated conversation:', testConversation);
                            setPodcastConversation(testConversation);
                          } catch (error) {
                            console.error('❌ Test failed:', error);
                            alert(`Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                          }
                        }}
                        variant="outlined"
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        Test Generate
                      </Button>
                    </>
                  )}
                  {isGeneratingPodcast && <LinearProgress sx={{ mt: 2 }} />}
                </Box>
              ) : (
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6">{podcastConversation.title}</Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      {isPlaying && (
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                          Playing: {podcastConversation.dialogues[currentDialogueIndex]?.character.name}
                        </Typography>
                      )}
                      <IconButton
                        onClick={isPlaying ? pausePodcastConversation : playPodcastConversation}
                        color="primary"
                        size="large"
                        sx={{ 
                          backgroundColor: isPlaying ? 'warning.light' : 'primary.light',
                          color: isPlaying ? 'warning.dark' : 'primary.dark',
                          '&:hover': {
                            backgroundColor: isPlaying ? 'warning.main' : 'primary.main',
                            color: 'white'
                          }
                        }}
                      >
                        {isPlaying ? <Pause /> : <PlayArrow />}
                      </IconButton>
                      <Button
                        startIcon={<Download />}
                        onClick={downloadPodcastTranscript}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        Transcript
                      </Button>
                    </Box>
                  </Box>

                  <Alert severity="info" sx={{ mb: 3 }}>
                    Listen to an interactive conversation between Serwaa (Student) and Das (Teacher). 
                    {!speechSynthesis && ' Speech synthesis not supported - view transcript below.'}
                  </Alert>

                  <Box>
                    {podcastConversation.dialogues.map((dialogue: PodcastDialogue, index: number) => (
                      <Card 
                        key={dialogue.id} 
                        sx={{ 
                          mb: 2, 
                          backgroundColor: dialogue.character.role === 'teacher' ? 'primary.50' : 'secondary.50',
                          border: currentDialogueIndex === index && isPlaying ? '2px solid' : '1px solid',
                          borderColor: currentDialogueIndex === index && isPlaying ? 'primary.main' : 'divider'
                        }}
                      >
                        <CardContent>
                          <Box display="flex" alignItems="center" gap={2} mb={1}>
                            <Chip
                              label={dialogue.character.name}
                              color={dialogue.character.role === 'teacher' ? 'primary' : 'secondary'}
                              size="small"
                            />
                            <Typography variant="caption" color="text.secondary">
                              {dialogue.character.role === 'teacher' ? '👨‍🏫 Teacher' : '👩‍🎓 Student'}
                            </Typography>
                          </Box>
                          <Typography variant="body1">{dialogue.text}</Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>
              )}
            </TabPanel>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AIQuestionSolutionDialog;
