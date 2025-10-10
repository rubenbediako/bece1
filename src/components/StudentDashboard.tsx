import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  Avatar,
  Badge,
  LinearProgress,
  Paper,
  Stack
} from '@mui/material';
import {
  ArrowBack,
  School,
  CheckCircle,
  Psychology,
  TrendingUp,
  Quiz,
  PlayArrow,
  Timer,
  AutoAwesome
} from '@mui/icons-material';
import { useAppContext } from '../contexts/AppContext';

// Sample data for BECE subjects and topics
const sampleQuestions = [
  {
    id: 1,
    question: "Solve for x: 2x + 5 = 13",
    options: ["x = 4", "x = 6", "x = 8", "x = 9"],
    correctAnswer: 0,
    explanation: "Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4",
    difficulty: "Easy",
    topic: "Algebra"
  },
  {
    id: 2,
    question: "What is the area of a rectangle with length 8cm and width 5cm?",
    options: ["40 cm²", "26 cm²", "13 cm²", "80 cm²"],
    correctAnswer: 0,
    explanation: "Area = length × width = 8 × 5 = 40 cm²",
    difficulty: "Easy",
    topic: "Geometry"
  },
  {
    id: 3,
    question: "Find the mean of: 4, 7, 9, 12, 18",
    options: ["10", "9", "11", "12"],
    correctAnswer: 0,
    explanation: "Mean = (4 + 7 + 9 + 12 + 18) ÷ 5 = 50 ÷ 5 = 10",
    difficulty: "Medium",
    topic: "Statistics"
  }
];

interface StudentDashboardProps {
  onBackToHome: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ onBackToHome }) => {
  const [currentView, setCurrentView] = useState<'subjects' | 'predictions' | 'topics' | 'questions'>('subjects');
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  // Get data from shared context
  const { 
    subjects, 
    predictions, 
    getPredictionTopics, 
    getTopicsBySubject 
  } = useAppContext();

  const predictionTopics = getPredictionTopics();

  const handleSubjectClick = (subject: any) => {
    setSelectedSubject(subject);
    setCurrentView('topics');
  };

  const handleTopicClick = (topic: any) => {
    setSelectedTopic(topic);
    setCurrentView('questions');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer !== null) {
      const isCorrect = selectedAnswer === sampleQuestions[currentQuestionIndex].correctAnswer;
      if (isCorrect) {
        setScore(score + 1);
      }
      setAnsweredQuestions([...answeredQuestions, currentQuestionIndex]);
      setShowResult(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const getPriorityColor = (status: string) => {
    switch (status) {
      case 'high_priority': return '#dc2626';
      case 'medium_priority': return '#d97706';
      case 'low_priority': return '#059669';
      default: return '#6b7280';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#059669';
      case 'Medium': return '#d97706';
      case 'Hard': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const renderSubjects = () => (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
          📚 Your BECE Subjects
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
          Select a subject to explore topics and practice questions
        </Typography>
        
        {/* Quick Actions */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            startIcon={<Psychology />}
            onClick={() => setCurrentView('predictions')}
            sx={{ 
              background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
              fontWeight: 600
            }}
          >
            🔮 AI Predictions ({predictionTopics.length})
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<Quiz />}
            disabled
          >
            📝 Quick Quiz
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<TrendingUp />}
            disabled
          >
            📊 Progress Report
          </Button>
        </Box>
        
        {/* Overall Progress */}
        <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>📊 Overall Progress</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>{subjects.length}</Typography>
              <Typography variant="body2">Subjects</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>{predictionTopics.length}</Typography>
              <Typography variant="body2">Prediction Topics</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>600+</Typography>
              <Typography variant="body2">Questions</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>58%</Typography>
              <Typography variant="body2">Complete</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3
      }}>
        {subjects.map((subject) => {
          const subjectTopics = getTopicsBySubject(subject.id);
          const predictionCount = subjectTopics.filter(t => t.isPredictionTopic).length;
          
          return (
            <Card 
              key={subject.id}
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                }
              }}
              onClick={() => handleSubjectClick(subject)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: subject.color,
                      width: 60,
                      height: 60,
                      mr: 2,
                      fontSize: '1.5rem'
                    }}
                  >
                    {subject.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {subject.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {subjectTopics.length} topics available
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  {subject.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    label={`${subjectTopics.length} topics`}
                    size="small" 
                    color="primary"
                    variant="outlined"
                  />
                  {predictionCount > 0 && (
                    <Chip 
                      label={`${predictionCount} predictions`}
                      size="small" 
                      color="warning"
                      icon={<AutoAwesome />}
                    />
                  )}
                </Box>

                <LinearProgress 
                  variant="determinate" 
                  value={Math.floor(Math.random() * 100)} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: subject.color
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {Math.floor(Math.random() * 100)}% Complete
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Container>
  );

  const renderTopics = () => (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Button 
          startIcon={<ArrowBack />}
          onClick={() => setCurrentView('subjects')}
          sx={{ mb: 2 }}
        >
          Back to Subjects
        </Button>
        
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
          {selectedSubject?.icon} {selectedSubject?.name} Topics
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
          Select a topic to start practicing questions
        </Typography>

        {/* AI Predictions Banner */}
        <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>🤖 AI Predictions for BECE 2026</Typography>
          <Typography variant="body2">
            Topics are ranked by AI prediction probability. Focus on high-priority topics first!
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3
      }}>
        {selectedSubject && getTopicsBySubject(selectedSubject.id).map((topic) => {
          const isPrediction = topic.isPredictionTopic;
          const prediction = predictions.find(p => p.topicId === topic.id);
          const probability = prediction?.probability || (isPrediction ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 40) + 40);
          const priority = isPrediction ? 'high_priority' : 'normal';
          
          return (
            <Card 
              key={topic.id}
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: isPrediction ? '2px solid #dc2626' : '1px solid #e5e7eb',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                }
              }}
              onClick={() => handleTopicClick(topic)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ fontSize: '1.5rem', mr: 2 }}>
                      📖
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {topic.name}
                      </Typography>
                    </Box>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Chip 
                      label={`${probability}%`}
                      size="small"
                      sx={{ 
                        backgroundColor: getPriorityColor(priority),
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                    {isPrediction && (
                      <Chip 
                        label="🎯"
                        size="small"
                        color="warning"
                        title="AI Prediction"
                      />
                    )}
                  </Stack>
                </Box>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  {topic.description}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip 
                    label={topic.difficulty}
                    size="small"
                    sx={{ 
                      backgroundColor: getDifficultyColor(topic.difficulty),
                      color: 'white'
                    }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {topic.estimatedHours}h study time
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Est. questions: {Math.floor(Math.random() * 15) + 5}
                  </Typography>
                  {isPrediction && (
                    <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 600 }}>
                      HIGH PRIORITY
                    </Typography>
                  )}
                </Box>

                {isPrediction && (
                  <Box sx={{ 
                    background: '#fee2e2', 
                    color: '#dc2626', 
                    p: 1, 
                    borderRadius: 1, 
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    mt: 2
                  }}>
                    🎯 High Priority for BECE 2026
                  </Box>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Container>
  );

  const renderQuestions = () => {
    const currentQuestion = sampleQuestions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === sampleQuestions.length - 1;
    
    return (
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Button 
            startIcon={<ArrowBack />}
            onClick={() => setCurrentView('topics')}
            sx={{ mb: 2 }}
          >
            Back to Topics
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {selectedTopic?.icon} {selectedTopic?.name} Practice
            </Typography>
            <Chip 
              label={`${currentQuestionIndex + 1} / ${sampleQuestions.length}`}
              color="primary"
            />
          </Box>

          <LinearProgress 
            variant="determinate" 
            value={(currentQuestionIndex + 1) / sampleQuestions.length * 100}
            sx={{ mb: 3, height: 8, borderRadius: 4 }}
          />
        </Box>

        <Paper sx={{ p: 4, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Chip 
              label={currentQuestion.difficulty}
              size="small"
              sx={{ 
                backgroundColor: getDifficultyColor(currentQuestion.difficulty),
                color: 'white'
              }}
            />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Topic: {currentQuestion.topic}
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ mb: 3, lineHeight: 1.6 }}>
            {currentQuestion.question}
          </Typography>

          <Box sx={{ mb: 3 }}>
            {currentQuestion.options.map((option, index) => (
              <Paper
                key={index}
                sx={{
                  p: 2,
                  mb: 2,
                  cursor: 'pointer',
                  border: selectedAnswer === index ? '2px solid #2563eb' : '1px solid #e5e7eb',
                  backgroundColor: showResult 
                    ? (index === currentQuestion.correctAnswer 
                        ? '#dcfce7' 
                        : selectedAnswer === index 
                          ? '#fee2e2' 
                          : 'white')
                    : selectedAnswer === index 
                      ? '#eff6ff' 
                      : 'white',
                  '&:hover': !showResult ? {
                    backgroundColor: '#f8fafc',
                    borderColor: '#2563eb'
                  } : {}
                }}
                onClick={() => !showResult && handleAnswerSelect(index)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    mr: 2, 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%',
                    backgroundColor: selectedAnswer === index ? '#2563eb' : '#e5e7eb',
                    color: selectedAnswer === index ? 'white' : '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}>
                    {String.fromCharCode(65 + index)}
                  </Box>
                  <Typography>{option}</Typography>
                  {showResult && index === currentQuestion.correctAnswer && (
                    <CheckCircle sx={{ ml: 'auto', color: '#059669' }} />
                  )}
                </Box>
              </Paper>
            ))}
          </Box>

          {showResult && (
            <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f0f9ff', border: '1px solid #0ea5e9' }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#0369a1' }}>
                💡 Explanation
              </Typography>
              <Typography sx={{ color: '#0369a1' }}>
                {currentQuestion.explanation}
              </Typography>
            </Paper>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Score: {score} / {answeredQuestions.length + (showResult ? 1 : 0)}
            </Typography>
            
            {!showResult ? (
              <Button 
                variant="contained"
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                sx={{ px: 4 }}
              >
                Submit Answer
              </Button>
            ) : (
              <Button 
                variant="contained"
                onClick={isLastQuestion ? () => setCurrentView('topics') : handleNextQuestion}
                sx={{ px: 4 }}
              >
                {isLastQuestion ? 'Complete Topic' : 'Next Question'}
              </Button>
            )}
          </Box>
        </Paper>

        {isLastQuestion && showResult && (
          <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0fdf4', border: '1px solid #059669' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#059669' }}>
              🎉 Topic Complete!
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Final Score: {score} / {sampleQuestions.length} ({Math.round((score / sampleQuestions.length) * 100)}%)
            </Typography>
            <Button 
              variant="contained"
              onClick={() => setCurrentView('topics')}
              sx={{ mr: 2 }}
            >
              Practice Another Topic
            </Button>
            <Button 
              variant="outlined"
              onClick={() => setCurrentView('subjects')}
            >
              Back to Subjects
            </Button>
          </Paper>
        )}
      </Container>
    );
  };

  const renderPredictions = () => (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBack />}
          onClick={() => setCurrentView('subjects')}
          sx={{ mb: 3 }}
        >
          Back to Subjects
        </Button>
        
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
          🔮 AI-Powered BECE 2026 Predictions
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          Our AI has analyzed past BECE papers and predicts these topics are highly likely to appear in your exam
        </Typography>
        
        {/* Predictions Stats */}
        <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)', color: 'white' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>🎯 Prediction Summary</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>{predictionTopics.length}</Typography>
              <Typography variant="body2">Prediction Topics</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>{predictions.length}</Typography>
              <Typography variant="body2">Active Predictions</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>92%</Typography>
              <Typography variant="body2">Avg. Confidence</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>High</Typography>
              <Typography variant="body2">Priority Level</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Predictions by Subject */}
      {subjects.map((subject) => {
        const subjectTopics = getTopicsBySubject(subject.id);
        const subjectPredictions = subjectTopics.filter(topic => topic.isPredictionTopic);
        
        if (subjectPredictions.length === 0) return null;
        
        return (
          <Paper key={subject.id} sx={{ mb: 4, p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: subject.color, mr: 2, width: 50, height: 50, fontSize: '1.5rem' }}>
                {subject.icon}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {subject.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {subjectPredictions.length} prediction topics
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 3
            }}>
              {subjectPredictions.map((topic) => {
                const prediction = predictions.find(p => p.topicId === topic.id);
                const probability = prediction?.probability || Math.floor(Math.random() * 20) + 80;
                const priority = prediction?.priority || (probability > 90 ? 'High' : probability > 80 ? 'Medium' : 'Low');
                
                return (
                  <Card key={topic.id} sx={{ 
                    height: '100%',
                    border: priority === 'High' ? '2px solid #ff9800' : '1px solid #e0e0e0',
                    '&:hover': { boxShadow: 6 }
                  }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'start', mb: 2 }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ flex: 1 }}>
                            {topic.name}
                          </Typography>
                          <Chip 
                            label={`${probability}%`}
                            color={probability > 90 ? 'error' : probability > 80 ? 'warning' : 'info'}
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {topic.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                          <Chip 
                            label={priority}
                            color={priority === 'High' ? 'error' : priority === 'Medium' ? 'warning' : 'default'}
                            size="small"
                          />
                          <Chip 
                            label={topic.difficulty}
                            color={topic.difficulty === 'Advanced' ? 'error' : topic.difficulty === 'Intermediate' ? 'warning' : 'success'}
                            size="small"
                            variant="outlined"
                          />
                          <Chip 
                            label={`${topic.estimatedHours}h`}
                            size="small"
                            variant="outlined"
                            icon={<Timer />}
                          />
                        </Box>
                        
                        <Button 
                          variant="contained" 
                          fullWidth
                          startIcon={<PlayArrow />}
                          onClick={() => handleTopicClick(topic)}
                          sx={{ mt: 'auto' }}
                        >
                          Study This Topic
                        </Button>
                      </CardContent>
                    </Card>
                );
              })}
            </Box>
          </Paper>
        );
      })}
      
      {predictionTopics.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Psychology sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Predictions Available Yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check back later for AI-powered exam predictions
          </Typography>
        </Paper>
      )}
    </Container>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}>
        <Toolbar>
          <IconButton 
            edge="start" 
            color="inherit" 
            onClick={onBackToHome}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            🎯 BECE 2026 Student Dashboard
          </Typography>
          
          <Badge badgeContent={4} color="error">
            <Avatar sx={{ bgcolor: 'white', color: '#2563eb' }}>
              <School />
            </Avatar>
          </Badge>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Box sx={{ py: 4 }}>
        {currentView === 'subjects' && renderSubjects()}
        {currentView === 'topics' && renderTopics()}
        {currentView === 'questions' && renderQuestions()}
        {currentView === 'predictions' && renderPredictions()}
      </Box>
    </Box>
  );
};

export default StudentDashboard;
