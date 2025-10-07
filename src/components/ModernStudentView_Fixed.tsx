import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Stack,
  Paper,
} from '@mui/material';
import {
  PlayArrowOutlined,
  TrendingUpOutlined,
  AccessTimeOutlined,
  CheckCircleOutlined,
  PodcastsOutlined,
  SmartToyOutlined,
  SchoolOutlined,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useGlobalState } from '../contexts/GlobalStateContext';
import { beceTopics, activePredictions } from '../sampleData';
import type { Topic, PredictedTopic } from '../types';

const ModernStudentView: React.FC = () => {
  const { subjects, questions } = useGlobalState();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  
  // Use sample data as fallback
  const topics: Topic[] = beceTopics;
  const predictedTopics: PredictedTopic[] = activePredictions;

  const getTopicsBySubject = (subjectId: string) => {
    return topics.filter((topic: Topic) => topic.subjectId === subjectId);
  };

  const getQuestionsByTopic = (topicId: string) => {
    return questions.filter(question => question.topicId === topicId);
  };

  const isPredicted = (topicId: string) => {
    return predictedTopics.some((pt: PredictedTopic) => pt.topicId === topicId);
  };

  const getSubjectProgress = (subjectId: string) => {
    const subjectTopics = getTopicsBySubject(subjectId);
    if (subjectTopics.length === 0) return 0;
    const progressSum = subjectTopics.reduce((sum: number, topic: Topic) => {
      const questionsCount = getQuestionsByTopic(topic.id).length;
      return sum + (questionsCount > 0 ? 75 : 25); // Mock progress
    }, 0);
    return Math.min(progressSum / subjectTopics.length, 100);
  };

  const getSubjectColor = (index: number) => {
    const colors = ['#2563eb', '#7c3aed', '#059669', '#dc2626', '#ea580c', '#0891b2'];
    return colors[index % colors.length];
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4,
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ 
              fontWeight: 700, 
              color: 'white',
              mb: 2,
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            }}>
              Welcome to BECE 2026 Platform
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 4 }}>
              Continue your BECE 2026 preparation journey
            </Typography>

            {/* Stats Cards */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
              gap: 3,
              mb: 4 
            }}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                color: 'white',
                '&:hover': { transform: 'translateY(-4px)' },
                transition: 'all 0.3s ease-in-out',
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <SchoolOutlined sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {subjects.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Subjects Available
                  </Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ 
                background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
                color: 'white',
                '&:hover': { transform: 'translateY(-4px)' },
                transition: 'all 0.3s ease-in-out',
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TrendingUpOutlined sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {predictedTopics.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    AI Predictions
                  </Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ 
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: 'white',
                '&:hover': { transform: 'translateY(-4px)' },
                transition: 'all 0.3s ease-in-out',
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <CheckCircleOutlined sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    68%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Overall Progress
                  </Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ 
                background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                color: 'white',
                '&:hover': { transform: 'translateY(-4px)' },
                transition: 'all 0.3s ease-in-out',
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <AccessTimeOutlined sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    42
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Study Days Left
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </motion.div>

        {/* Subjects Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '400px 1fr' },
          gap: 4 
        }}>
          {/* Subjects List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paper sx={{ 
              p: 3, 
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid #e2e8f0',
            }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                📚 Your Subjects
              </Typography>
              
              <Stack spacing={2}>
                {subjects.map((subject, index) => {
                  const progress = getSubjectProgress(subject.id);
                  const isSelected = selectedSubject === subject.id;
                  
                  return (
                    <Card
                      key={subject.id}
                      sx={{
                        cursor: 'pointer',
                        border: isSelected ? `2px solid ${getSubjectColor(index)}` : '1px solid #e2e8f0',
                        background: isSelected ? 'rgba(37, 99, 235, 0.05)' : 'white',
                        '&:hover': {
                          transform: 'translateX(4px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                        },
                        transition: 'all 0.3s ease-in-out',
                      }}
                      onClick={() => setSelectedSubject(
                        selectedSubject === subject.id ? null : subject.id
                      )}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar sx={{ 
                            background: `linear-gradient(135deg, ${getSubjectColor(index)} 0%, ${getSubjectColor(index)}80 100%)`,
                            width: 48,
                            height: 48,
                          }}>
                            <Typography sx={{ fontSize: '1.2rem', fontWeight: 600 }}>
                              {subject.name.charAt(0)}
                            </Typography>
                          </Avatar>
                          
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {subject.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                              {getTopicsBySubject(subject.id).length} topics
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{ 
                                  flex: 1, 
                                  height: 6, 
                                  borderRadius: 3,
                                  '& .MuiLinearProgress-bar': {
                                    background: `linear-gradient(90deg, ${getSubjectColor(index)} 0%, ${getSubjectColor(index)}80 100%)`,
                                  },
                                }}
                              />
                              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                {Math.round(progress)}%
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            </Paper>
          </motion.div>

          {/* Topics and Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {selectedSubject ? (
              <Paper sx={{ 
                p: 3, 
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid #e2e8f0',
              }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                    {subjects.find(s => s.id === selectedSubject)?.name} Topics
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Master these topics to excel in your BECE exam
                  </Typography>
                </Box>

                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 3 
                }}>
                  {getTopicsBySubject(selectedSubject).map((topic: Topic) => {
                    const topicQuestions = getQuestionsByTopic(topic.id);
                    const predicted = isPredicted(topic.id);
                    
                    return (
                      <Card
                        key={topic.id}
                        sx={{
                          position: 'relative',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                          },
                          transition: 'all 0.3s ease-in-out',
                          border: predicted ? '2px solid #10b981' : '1px solid #e2e8f0',
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          {predicted && (
                            <Chip
                              label="AI Predicted"
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                fontWeight: 600,
                              }}
                            />
                          )}
                          
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, pr: predicted ? 6 : 0 }}>
                            {topic.name}
                          </Typography>
                          
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                            {topic.description}
                          </Typography>
                          
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
                              Progress
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={Math.random() * 100} // Mock progress
                              sx={{ 
                                height: 6, 
                                borderRadius: 3,
                                '& .MuiLinearProgress-bar': {
                                  background: predicted 
                                    ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                                    : 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)',
                                },
                              }}
                            />
                          </Box>
                          
                          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                            <Chip
                              label={`${topicQuestions.length} Questions`}
                              size="small"
                              variant="outlined"
                              icon={<SmartToyOutlined />}
                            />
                            <Chip
                              label="AI Ready"
                              size="small"
                              variant="outlined"
                              icon={<PodcastsOutlined />}
                            />
                          </Stack>
                          
                          <Stack direction="row" spacing={2}>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<PlayArrowOutlined />}
                              sx={{
                                background: predicted 
                                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                  : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                                '&:hover': {
                                  background: predicted 
                                    ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                                    : 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                                },
                              }}
                            >
                              Start Practice
                            </Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Box>
              </Paper>
            ) : (
              <Paper sx={{ 
                p: 6, 
                borderRadius: 3,
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid #e2e8f0',
              }}>
                <Typography variant="h4" sx={{ mb: 2, opacity: 0.6 }}>
                  📖
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  Select a Subject
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Choose a subject from the left to start your learning journey
                </Typography>
              </Paper>
            )}
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default ModernStudentView;
