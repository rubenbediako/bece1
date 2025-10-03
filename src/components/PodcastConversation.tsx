import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Paper,
  IconButton,
  LinearProgress,
  Chip,
  Divider
} from '@mui/material';
import { Play, Pause, RotateCcw, Volume2, User, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  id: string;
  question: string;
  correctAnswer: string;
  explanation: string;
  solution: string;
  type: string;
  options?: string[];
}

interface ConversationMessage {
  speaker: 'AMA' | 'DAS';
  message: string;
  timestamp: number;
}

interface PodcastConversationProps {
  question: Question;
  onClose: () => void;
}

const PodcastConversation: React.FC<PodcastConversationProps> = ({ question, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [progress, setProgress] = useState(0);

  // Generate conversation based on the question
  useEffect(() => {
    const generateConversation = () => {
      const messages: ConversationMessage[] = [
        {
          speaker: 'AMA',
          message: `Hi DAS! I'm looking at this question: "${question.question}" Could you help me understand how to solve it?`,
          timestamp: 0
        },
        {
          speaker: 'DAS',
          message: `Hello AMA! Great question! Let me break this down for you step by step. This is a ${question.type} question, so let's approach it systematically.`,
          timestamp: 1
        }
      ];

      // Add options discussion for multiple choice
      if (question.type === 'multiple-choice' && question.options) {
        messages.push({
          speaker: 'AMA',
          message: `I see there are multiple options here. How do I know which one is correct?`,
          timestamp: 2
        });
        messages.push({
          speaker: 'DAS',
          message: `Excellent question! Let's examine each option carefully. The key is to understand the underlying concept first, then eliminate wrong answers systematically.`,
          timestamp: 3
        });
      }

      // Add explanation
      messages.push({
        speaker: 'DAS',
        message: `Here's the explanation: ${question.explanation}`,
        timestamp: messages.length
      });

      messages.push({
        speaker: 'AMA',
        message: `That makes sense! But could you show me the detailed solution step by step?`,
        timestamp: messages.length
      });

      // Add solution
      messages.push({
        speaker: 'DAS',
        message: `Absolutely! Here's the detailed solution: ${question.solution}`,
        timestamp: messages.length
      });

      messages.push({
        speaker: 'AMA',
        message: `Wow, that's really clear! So the correct answer is "${question.correctAnswer}". Thank you for explaining it so well!`,
        timestamp: messages.length
      });

      messages.push({
        speaker: 'DAS',
        message: `You're very welcome, AMA! Remember, practice makes perfect. Try similar questions to reinforce your understanding. Good luck with your BECE preparation!`,
        timestamp: messages.length
      });

      setConversation(messages);
    };

    generateConversation();
  }, [question]);

  // Speech synthesis functions
  const speakMessage = (message: string, voice: 'male' | 'female' = 'female') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      const voices = speechSynthesis.getVoices();
      
      // Try to set appropriate voice
      const selectedVoice = voices.find(v => 
        voice === 'male' ? v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') :
        v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha')
      ) || voices[0];
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.rate = 0.9;
      utterance.pitch = voice === 'male' ? 0.8 : 1.1;
      
      return new Promise<void>((resolve) => {
        utterance.onend = () => { resolve(); };
        speechSynthesis.speak(utterance);
      });
    }
    return Promise.resolve();
  };

  const playConversation = async () => {
    setIsPlaying(true);
    setCurrentMessageIndex(0);
    
    for (let i = 0; i < conversation.length; i++) {
      if (!isPlaying) break;
      
      setCurrentMessageIndex(i);
      setProgress((i / conversation.length) * 100);
      
      const message = conversation[i];
      const voice = message.speaker === 'DAS' ? 'male' : 'female';
      
      await speakMessage(message.message, voice);
      
      // Small pause between messages
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsPlaying(false);
    setProgress(100);
  };

  const stopConversation = () => {
    setIsPlaying(false);
    speechSynthesis.cancel();
  };

  const resetConversation = () => {
    setIsPlaying(false);
    setCurrentMessageIndex(0);
    setProgress(0);
    speechSynthesis.cancel();
  };

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', mt: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            🎧 Study Podcast: AMA & DAS Discussion
          </Typography>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </Box>

        <Paper sx={{ p: 2, mb: 3, bgcolor: 'info.50' }}>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Volume2 size={16} />
            Listen to a conversation between AMA (Student) and DAS (Teacher) about this question
          </Typography>
        </Paper>

        {/* Progress Bar */}
        <Box sx={{ mb: 3 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            {Math.round(progress)}% Complete
          </Typography>
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'center' }}>
          <Button
            variant={isPlaying ? "outlined" : "contained"}
            onClick={isPlaying ? stopConversation : playConversation}
            startIcon={isPlaying ? <Pause /> : <Play />}
            size="large"
          >
            {isPlaying ? 'Pause' : 'Play Conversation'}
          </Button>
          <IconButton onClick={resetConversation}>
            <RotateCcw />
          </IconButton>
        </Box>

        {/* Conversation Display */}
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          <AnimatePresence>
            {conversation.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: index <= currentMessageIndex ? 1 : 0.3,
                  y: 0 
                }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: message.speaker === 'AMA' ? 'primary.50' : 'success.50',
                    border: index === currentMessageIndex && isPlaying ? 2 : 1,
                    borderColor: index === currentMessageIndex && isPlaying ? 'primary.main' : 'divider'
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: message.speaker === 'AMA' ? 'primary.main' : 'success.main',
                      width: 40,
                      height: 40
                    }}
                  >
                    {message.speaker === 'AMA' ? <User size={20} /> : <GraduationCap size={20} />}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {message.speaker === 'AMA' ? 'AMA (Student)' : 'DAS (Teacher)'}
                      </Typography>
                      {index === currentMessageIndex && isPlaying && (
                        <Chip 
                          label="Speaking..." 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      )}
                    </Box>
                    <Typography variant="body1">
                      {message.message}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>

        <Divider sx={{ my: 3 }} />
        
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          💡 This conversation is generated to help you understand the solution better. 
          Make sure your device volume is on to hear the audio.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PodcastConversation;
