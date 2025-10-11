import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Alert,
  Chip,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  AutoAwesome,
  Visibility,
  School,
  Quiz,
  Publish,
  UnpublishedOutlined,
  CheckCircle,
  AccessTime,
  FileDownload,
  Subject,
  Psychology,
  MenuBook
} from '@mui/icons-material';
import { useAppContext } from '../contexts/AppContext';

// Data structure types
import type { SubjectData, TopicData, PredictionData, QuestionData } from '../contexts/AppContext';

// Math symbols and functions for mathematical questions
const mathSymbols = [
  { symbol: '√', name: 'Square Root', latex: '\\sqrt{}' },
  { symbol: '∫', name: 'Integral', latex: '\\int' },
  { symbol: '∑', name: 'Summation', latex: '\\sum' },
  { symbol: '∏', name: 'Product', latex: '\\prod' },
  { symbol: '∞', name: 'Infinity', latex: '\\infty' },
  { symbol: 'π', name: 'Pi', latex: '\\pi' },
  { symbol: 'α', name: 'Alpha', latex: '\\alpha' },
  { symbol: 'β', name: 'Beta', latex: '\\beta' },
  { symbol: 'θ', name: 'Theta', latex: '\\theta' },
  { symbol: '°', name: 'Degree', latex: '^\\circ' },
  { symbol: '²', name: 'Squared', latex: '^2' },
  { symbol: '³', name: 'Cubed', latex: '^3' },
  { symbol: '±', name: 'Plus/Minus', latex: '\\pm' },
  { symbol: '≤', name: 'Less than or equal', latex: '\\leq' },
  { symbol: '≥', name: 'Greater than or equal', latex: '\\geq' },
  { symbol: '≠', name: 'Not equal', latex: '\\neq' },
  { symbol: '÷', name: 'Division', latex: '\\div' },
  { symbol: '×', name: 'Multiplication', latex: '\\times' },
  { symbol: '∠', name: 'Angle', latex: '\\angle' },
  { symbol: '△', name: 'Triangle', latex: '\\triangle' }
];

const questionTypes = [
  { value: 'multiple-choice', label: 'Multiple Choice', icon: '☑️' },
  { value: 'essay', label: 'Essay Question', icon: '📝' },
  { value: 'short-answer', label: 'Short Answer', icon: '✏️' },
  { value: 'true-false', label: 'True/False', icon: '✔️' }
];

interface AdminDashboardProps {
  onBackToHome: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToHome }) => {
  const [tabValue, setTabValue] = useState(0);
  
  // Get data from shared context
  const { 
    subjects, 
    predictions, 
    questions,
    setSubjects, 
    setTopics: setContextTopics, 
    setPredictions,
    setQuestions,
    getTopicsBySubject,
    getQuestionsByTopic,
    getPublishedQuestions
  } = useAppContext();

  // Convert context topics array to the format expected by AdminDashboard
  const topics: { [key: string]: TopicData[] } = {};
  subjects.forEach(subject => {
    topics[subject.id] = getTopicsBySubject(subject.id);
  });

  // Helper function to update topics in context
  const setTopics = (updater: (prev: { [key: string]: TopicData[] }) => { [key: string]: TopicData[] }) => {
    const currentTopics = updater(topics);
    const flatTopics = Object.values(currentTopics).flat();
    setContextTopics(flatTopics);
  };

  // Use questions from context instead of local state
  // Note: Questions are now managed through context

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionData | null>(null);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState<QuestionData | null>(null);
  const [publishDialog, setPublishDialog] = useState(false);
  const [publishingQuestion, setPublishingQuestion] = useState<QuestionData | null>(null);
  
  // New dialog states for subjects, topics, and predictions
  const [subjectDialog, setSubjectDialog] = useState(false);
  const [topicDialog, setTopicDialog] = useState(false);
  const [predictionDialog, setPredictionDialog] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectData | null>(null);
  const [editingTopic, setEditingTopic] = useState<TopicData | null>(null);
  const [editingPrediction, setEditingPrediction] = useState<PredictionData | null>(null);
  
  // Form states
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [formData, setFormData] = useState<Partial<QuestionData>>({
    topicId: '',
    subjectId: '',
    question: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    difficulty: 'Beginner',
    timeAllowed: 30,
    points: 5,
    isActive: true,
    isPublished: false,
    solutionAccess: 'after-attempt',
    tags: []
  });

  // New form states
  const [subjectFormData, setSubjectFormData] = useState<Partial<SubjectData>>({
    name: '',
    icon: '',
    description: '',
    isActive: true
  });

  const [topicFormData, setTopicFormData] = useState<Partial<TopicData>>({
    name: '',
    subjectId: '',
    description: '',
    difficulty: 'Beginner',
    estimatedHours: 10,
    isActive: true,
    isPredictionTopic: false
  });

  const [predictionFormData, setPredictionFormData] = useState<Partial<PredictionData>>({
    title: '',
    description: '',
    subjectId: '',
    topicIds: [],
    difficulty: 'Easy',
    estimatedScore: 75,
    confidence: 80,
    isActive: true,
    questionIds: []
  });

  // Notification states
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setNotification({ open: true, message, severity });
    setTimeout(() => setNotification(prev => ({ ...prev, open: false })), 3000);
  };

  const handleTabChange = (_: any, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setFormData({
      topicId: '',
      subjectId: '',
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      difficulty: 'Beginner',
      timeAllowed: 30,
      points: 5,
      isActive: true,
      isPublished: false,
      solutionAccess: 'after-attempt',
      tags: []
    });
    setOpenDialog(true);
  };

  const handleEditQuestion = (question: QuestionData) => {
    setEditingQuestion(question);
    setFormData(question);
    setSelectedSubject(question.subjectId);
    setSelectedTopic(question.topicId);
    setOpenDialog(true);
  };

  const handleDeleteQuestion = (id: string) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);
    showNotification('Question deleted successfully');
  };

  const handleSaveQuestion = () => {
    // Basic validation
    if (!formData.subjectId || !formData.topicId || !formData.question || !formData.explanation) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    // Type-specific validation
    switch (formData.type) {
      case 'multiple-choice':
        if (!formData.options?.every(opt => opt.trim()) || !formData.correctAnswer?.trim()) {
          showNotification('Please provide all options and select the correct answer', 'error');
          return;
        }
        break;
      case 'true-false':
        if (!formData.correctAnswer?.trim()) {
          showNotification('Please select the correct answer (True/False)', 'error');
          return;
        }
        break;
      case 'short-answer':
        if (!formData.correctAnswer?.trim()) {
          showNotification('Please provide the expected answer', 'error');
          return;
        }
        break;
      case 'essay':
        if (!formData.correctAnswer?.trim()) {
          showNotification('Please provide grading criteria or sample answer', 'error');
          return;
        }
        break;
    }

    if (editingQuestion) {
      const updatedQuestions = questions.map(q => 
        q.id === editingQuestion.id 
          ? { ...formData, id: editingQuestion.id } as QuestionData
          : q
      );
      setQuestions(updatedQuestions);
      showNotification('Question updated successfully');
    } else {
      const newQuestion: QuestionData = {
        ...formData,
        id: 'q_' + Date.now(),
        createdAt: new Date().toISOString().split('T')[0]
      } as QuestionData;
      const updatedQuestions = [...questions, newQuestion];
      setQuestions(updatedQuestions);
      showNotification('Question added successfully');
    }
    
    setOpenDialog(false);
  };

  const handleGenerateAISolution = () => {
    // Simulate AI generation
    const aiExplanations = [
      'This solution is generated using advanced AI algorithms to provide step-by-step reasoning.',
      'AI Analysis: Breaking down the problem systematically to find the most logical approach.',
      'Using pattern recognition and mathematical principles, the AI determines the optimal solution path.',
      'Advanced AI reasoning suggests this approach based on similar problem patterns in the database.'
    ];
    
    const randomExplanation = aiExplanations[Math.floor(Math.random() * aiExplanations.length)];
    
    setFormData(prev => ({
      ...prev,
      explanation: randomExplanation,
      tags: [...(prev.tags || []), 'AI-generated']
    }));
    
    showNotification('AI solution generated successfully!', 'info');
  };

  const handlePreview = (question: QuestionData) => {
    setPreviewQuestion(question);
    setPreviewDialog(true);
  };

  const handlePublish = (question: QuestionData) => {
    setPublishingQuestion(question);
    setPublishDialog(true);
  };

  const handlePublishQuestion = (publishWithSolution: boolean, solutionAccessLevel: 'immediate' | 'after-attempt' | 'never') => {
    if (publishingQuestion) {
      const updatedQuestions = questions.map(q => 
        q.id === publishingQuestion.id 
          ? { 
              ...q, 
              isPublished: true, 
              solutionAccess: solutionAccessLevel
            }
          : q
      );
      setQuestions(updatedQuestions);
      showNotification(`Question published ${publishWithSolution ? 'with solutions' : 'without solutions'}`, 'success');
    }
    setPublishDialog(false);
    setPublishingQuestion(null);
  };

  const handleUnpublish = (id: string) => {
    const updatedQuestions = questions.map(q => 
      q.id === id 
        ? { ...q, isPublished: false }
        : q
    );
    setQuestions(updatedQuestions);
    showNotification('Question unpublished successfully');
  };

  const handleBulkPublish = (questionIds: string[], publishWithSolution: boolean, solutionAccessLevel: 'immediate' | 'after-attempt' | 'never') => {
    const updatedQuestions = questions.map(q => 
      questionIds.includes(q.id)
        ? { 
            ...q, 
            isPublished: true, 
            solutionAccess: solutionAccessLevel
          }
        : q
    );
    setQuestions(updatedQuestions);
    showNotification(`${questionIds.length} questions published successfully`, 'success');
  };

  const exportPublishedQuestions = () => {
    const publishedQuestions = questions.filter(q => q.isPublished);
    const exportData = {
      exportDate: new Date().toISOString(),
      totalQuestions: publishedQuestions.length,
      questions: publishedQuestions.map(q => ({
        id: q.id,
        subjectId: q.subjectId,
        topicId: q.topicId,
        question: q.question,
        type: q.type,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.solutionAccess !== 'never' ? q.explanation : null,
        difficulty: q.difficulty,
        points: q.points,
        solutionAccess: q.solutionAccess,
        createdAt: q.createdAt
      }))
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `published-questions-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    showNotification('Published questions exported successfully', 'success');
  };

  // Subject management handlers
  const handleAddSubject = () => {
    setEditingSubject(null);
    setSubjectFormData({
      name: '',
      icon: '',
      description: '',
      isActive: true
    });
    setSubjectDialog(true);
  };

  const handleEditSubject = (subject: SubjectData) => {
    setEditingSubject(subject);
    setSubjectFormData(subject);
    setSubjectDialog(true);
  };

  const handleSaveSubject = () => {
    if (!subjectFormData.name || !subjectFormData.icon || !subjectFormData.description) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    if (editingSubject) {
      const updatedSubjects = subjects.map((s: SubjectData) => 
        s.id === editingSubject.id 
          ? { ...subjectFormData, id: editingSubject.id } as SubjectData
          : s
      );
      setSubjects(updatedSubjects);
      showNotification('Subject updated successfully');
    } else {
      const newSubject: SubjectData = {
        ...subjectFormData,
        id: subjectFormData.name?.toLowerCase().replace(/\s+/g, '_') || '',
        createdAt: new Date().toISOString().split('T')[0]
      } as SubjectData;
      const updatedSubjects = [...subjects, newSubject];
      setSubjects(updatedSubjects);
      setTopics(prev => ({ ...prev, [newSubject.id]: [] }));
      showNotification('Subject added successfully');
    }
    
    setSubjectDialog(false);
  };

  const handleDeleteSubject = (id: string) => {
    const updatedSubjects = subjects.filter((s: SubjectData) => s.id !== id);
    setSubjects(updatedSubjects);
    setTopics(prev => {
      const newTopics = { ...prev };
      delete newTopics[id];
      return newTopics;
    });
    showNotification('Subject deleted successfully');
  };

  // Topic management handlers
  const handleAddTopic = () => {
    setEditingTopic(null);
    setTopicFormData({
      name: '',
      subjectId: '',
      description: '',
      difficulty: 'Beginner',
      estimatedHours: 10,
      isActive: true
    });
    setTopicDialog(true);
  };

  const handleEditTopic = (topic: TopicData) => {
    setEditingTopic(topic);
    setTopicFormData(topic);
    setTopicDialog(true);
  };

  const handleSaveTopic = () => {
    if (!topicFormData.name || !topicFormData.subjectId || !topicFormData.description) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    if (editingTopic) {
      setTopics(prev => ({
        ...prev,
        [editingTopic.subjectId]: prev[editingTopic.subjectId].map(t => 
          t.id === editingTopic.id 
            ? { ...topicFormData, id: editingTopic.id } as TopicData
            : t
        )
      }));
      showNotification('Topic updated successfully');
    } else {
      const newTopic: TopicData = {
        ...topicFormData,
        id: topicFormData.name?.toLowerCase().replace(/\s+/g, '_') || '',
        createdAt: new Date().toISOString().split('T')[0]
      } as TopicData;
      
      setTopics(prev => ({
        ...prev,
        [newTopic.subjectId]: [...(prev[newTopic.subjectId] || []), newTopic]
      }));
      showNotification('Topic added successfully');
    }
    
    setTopicDialog(false);
  };

  const handleDeleteTopic = (topicId: string, subjectId: string) => {
    setTopics(prev => ({
      ...prev,
      [subjectId]: prev[subjectId].filter(t => t.id !== topicId)
    }));
    showNotification('Topic deleted successfully');
  };

  // Prediction management handlers
  const handleAddPrediction = () => {
    setEditingPrediction(null);
    setPredictionFormData({
      title: '',
      description: '',
      subjectId: '',
      topicIds: [],
      difficulty: 'Easy',
      estimatedScore: 75,
      confidence: 80,
      isActive: true,
      questionIds: []
    });
    setPredictionDialog(true);
  };

  const handleEditPrediction = (prediction: PredictionData) => {
    setEditingPrediction(prediction);
    setPredictionFormData(prediction);
    setPredictionDialog(true);
  };

  const handleSavePrediction = () => {
    if (!predictionFormData.title || !predictionFormData.description || !predictionFormData.subjectId) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    if (editingPrediction) {
      const updatedPredictions = predictions.map((p: PredictionData) => 
        p.id === editingPrediction.id 
          ? { ...predictionFormData, id: editingPrediction.id } as PredictionData
          : p
      );
      setPredictions(updatedPredictions);
      showNotification('Prediction updated successfully');
    } else {
      const newPrediction: PredictionData = {
        ...predictionFormData,
        id: `pred_${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0]
      } as PredictionData;
      const updatedPredictions = [...predictions, newPrediction];
      setPredictions(updatedPredictions);
      showNotification('Prediction added successfully');
    }
    
    setPredictionDialog(false);
  };

  const handleDeletePrediction = (id: string) => {
    const updatedPredictions = predictions.filter((p: PredictionData) => p.id !== id);
    setPredictions(updatedPredictions);
    showNotification('Prediction deleted successfully');
  };

  // Toggle prediction topic status
  const handleTogglePredictionTopic = (topicId: string, subjectId: string) => {
    setTopics(prev => ({
      ...prev,
      [subjectId]: prev[subjectId].map(t => 
        t.id === topicId 
          ? { ...t, isPredictionTopic: !t.isPredictionTopic }
          : t
      )
    }));
    const topic = topics[subjectId]?.find(t => t.id === topicId);
    showNotification(
      `${topic?.name} ${topic?.isPredictionTopic ? 'removed from' : 'added to'} predictions`, 
      'success'
    );
  };

  const filteredQuestions = questions.filter(q => {
    if (selectedSubject && q.subjectId !== selectedSubject) return false;
    if (selectedTopic && q.topicId !== selectedTopic) return false;
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'default';
    }
  };

  // Render question type specific fields
  const renderQuestionTypeFields = () => {
    switch (formData.type) {
      case 'multiple-choice':
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Answer Options
            </Typography>
            {formData.options?.map((option, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.correctAnswer === option}
                      onChange={() => setFormData(prev => ({ ...prev, correctAnswer: option }))}
                      color="success"
                    />
                  }
                  label="Correct"
                />
                <TextField
                  fullWidth
                  size="small"
                  label={`Option ${String.fromCharCode(65 + index)}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...(formData.options || [])];
                    newOptions[index] = e.target.value;
                    setFormData(prev => ({ ...prev, options: newOptions }));
                  }}
                />
              </Box>
            ))}
          </Box>
        );

      case 'true-false':
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Correct Answer
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Select Correct Answer</InputLabel>
              <Select
                value={formData.correctAnswer || 'true'}
                label="Select Correct Answer"
                onChange={(e) => setFormData(prev => ({ ...prev, correctAnswer: e.target.value }))}
              >
                <MenuItem value="true">True</MenuItem>
                <MenuItem value="false">False</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );

      case 'short-answer':
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Expected Answer
            </Typography>
            <TextField
              fullWidth
              label="Expected Answer"
              value={formData.correctAnswer || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, correctAnswer: e.target.value }))}
              placeholder="Enter the expected answer..."
            />
            <TextField
              fullWidth
              label="Points"
              type="number"
              value={formData.points || 5}
              onChange={(e) => setFormData(prev => ({ ...prev, points: Number(e.target.value) }))}
              sx={{ mt: 2 }}
            />
          </Box>
        );

      case 'essay':
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Essay Settings
            </Typography>
            <TextField
              fullWidth
              label="Grading Criteria or Sample Answer"
              multiline
              rows={4}
              value={formData.correctAnswer || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, correctAnswer: e.target.value }))}
              placeholder="Enter grading criteria or a sample answer..."
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Total Points"
              type="number"
              value={formData.points || 20}
              onChange={(e) => setFormData(prev => ({ ...prev, points: Number(e.target.value) }))}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', p: 3 }}>
      {/* Header */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              👨‍💼 BECE 2026 Admin Dashboard
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Manage questions, solutions, and exam content
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={onBackToHome}
            sx={{ color: 'white', borderColor: 'white' }}
          >
            Back to Home
          </Button>
        </Box>
      </Paper>

      {/* Statistics Cards */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 3,
        mb: 4
      }}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <School sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" color="primary.main" fontWeight="bold">
              {subjects.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Subjects
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Quiz sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
            <Typography variant="h4" color="secondary.main" fontWeight="bold">
              {questions.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Questions
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <AutoAwesome sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {questions.filter(q => q.tags?.includes('AI-generated')).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI Generated
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main" fontWeight="bold" sx={{ mb: 1 }}>
              📊
            </Typography>
            <Typography variant="h4" color="warning.main" fontWeight="bold">
              {questions.filter(q => q.isActive).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Questions
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Publish sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
            <Typography variant="h4" color="info.main" fontWeight="bold">
              {questions.filter(q => q.isPublished).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Published Questions
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Psychology sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
            <Typography variant="h4" color="error.main" fontWeight="bold">
              {predictions.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Predictions
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <MenuBook sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
            <Typography variant="h4" color="secondary.main" fontWeight="bold">
              {Object.values(topics).reduce((total, topicArray) => total + topicArray.length, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Topics
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Psychology sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h4" color="warning.main" fontWeight="bold">
              {Object.values(topics).reduce((total, topicArray) => 
                total + topicArray.filter(t => t.isPredictionTopic).length, 0
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Prediction Topics
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Main Content */}
      <Paper elevation={1} sx={{ borderRadius: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Question Management" />
          <Tab label="Subject Management" />
          <Tab label="Topic Management" />
          <Tab label="Prediction Management" />
          <Tab label="Publication Center" />
          <Tab label="Analytics" />
          <Tab label="Settings" />
        </Tabs>

        {/* Question Management Tab */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Question Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddQuestion}
              >
                Add New Question
              </Button>
            </Box>

            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Filter by Subject</InputLabel>
                <Select
                  value={selectedSubject}
                  label="Filter by Subject"
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <MenuItem value="">All Subjects</MenuItem>
                  {subjects.map(subject => (
                    <MenuItem key={subject.id} value={subject.id}>
                      {subject.icon} {subject.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Filter by Topic</InputLabel>
                <Select
                  value={selectedTopic}
                  label="Filter by Topic"
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  disabled={!selectedSubject}
                >
                  <MenuItem value="">All Topics</MenuItem>
                  {selectedSubject && topics[selectedSubject as keyof typeof topics]?.map(topic => (
                    <MenuItem key={topic.id} value={topic.id}>
                      {topic.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Questions Table */}
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell><strong>ID</strong></TableCell>
                    <TableCell><strong>Subject</strong></TableCell>
                    <TableCell><strong>Topic</strong></TableCell>
                    <TableCell><strong>Type</strong></TableCell>
                    <TableCell><strong>Question</strong></TableCell>
                    <TableCell><strong>Difficulty</strong></TableCell>
                    <TableCell><strong>AI Generated</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Published</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredQuestions.map((question) => (
                    <TableRow key={question.id} hover>
                      <TableCell>{question.id}</TableCell>
                      <TableCell>
                        {subjects.find(s => s.id === question.subjectId)?.icon}{' '}
                        {subjects.find(s => s.id === question.subjectId)?.name}
                      </TableCell>
                      <TableCell>
                        {topics[question.subjectId]?.find(t => t.id === question.topicId)?.name || question.topicId}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={questionTypes.find(qt => qt.value === question.type)?.icon + ' ' + 
                                questionTypes.find(qt => qt.value === question.type)?.label}
                          color="secondary"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell sx={{ maxWidth: 300 }}>
                        {question.question.length > 60 
                          ? question.question.substring(0, 60) + '...'
                          : question.question
                        }
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={question.difficulty}
                          color={getDifficultyColor(question.difficulty) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {question.tags?.includes('AI-generated') ? 
                          <Chip label="AI" color="info" size="small" icon={<AutoAwesome />} /> :
                          <Chip label="Manual" color="default" size="small" />
                        }
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={question.isActive ? 'Active' : 'Inactive'}
                          color={question.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {question.isPublished ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip 
                              label="Published" 
                              color="success" 
                              size="small" 
                              icon={<CheckCircle />}
                            />
                            <Chip 
                              label={`Solutions: ${question.solutionAccess}`}
                              color="info"
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        ) : (
                          <Chip 
                            label="Unpublished" 
                            color="default" 
                            size="small" 
                            icon={<UnpublishedOutlined />}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton 
                            size="small" 
                            onClick={() => handlePreview(question)}
                            color="info"
                          >
                            <Visibility />
                          </IconButton>
                          {!question.isPublished ? (
                            <IconButton 
                              size="small" 
                              onClick={() => handlePublish(question)}
                              color="success"
                              title="Publish Question"
                            >
                              <Publish />
                            </IconButton>
                          ) : (
                            <IconButton 
                              size="small" 
                              onClick={() => handleUnpublish(question.id)}
                              color="warning"
                              title="Unpublish Question"
                            >
                              <UnpublishedOutlined />
                            </IconButton>
                          )}
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditQuestion(question)}
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteQuestion(question.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Subject Management Tab */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Subject Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddSubject}
              >
                Add New Subject
              </Button>
            </Box>

            {/* Subjects Table */}
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell><strong>Icon</strong></TableCell>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Description</strong></TableCell>
                    <TableCell><strong>Topics</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Created</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subjects.map((subject) => (
                    <TableRow key={subject.id} hover>
                      <TableCell sx={{ fontSize: '24px' }}>{subject.icon}</TableCell>
                      <TableCell><strong>{subject.name}</strong></TableCell>
                      <TableCell sx={{ maxWidth: 300 }}>
                        {subject.description.length > 80 
                          ? subject.description.substring(0, 80) + '...'
                          : subject.description
                        }
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${topics[subject.id]?.length || 0} topics`}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={subject.isActive ? 'Active' : 'Inactive'}
                          color={subject.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{subject.createdAt}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditSubject(subject)}
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteSubject(subject.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Topic Management Tab */}
        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Topic Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddTopic}
              >
                Add New Topic
              </Button>
            </Box>

            {/* Topics by Subject */}
            {subjects.map((subject) => (
              <Paper key={subject.id} sx={{ mb: 3, p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {subject.icon} {subject.name}
                  <Chip 
                    label={`${topics[subject.id]?.length || 0} topics`}
                    color="primary"
                    size="small"
                  />
                </Typography>
                
                {topics[subject.id] && topics[subject.id].length > 0 ? (
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 2,
                    mt: 2
                  }}>
                    {topics[subject.id].map((topic) => (
                      <Card key={topic.id} variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                            <Typography variant="h6">{topic.name}</Typography>
                            <Stack direction="row" spacing={1}>
                              <IconButton 
                                size="small" 
                                onClick={() => handleTogglePredictionTopic(topic.id, subject.id)}
                                color={topic.isPredictionTopic ? 'warning' : 'default'}
                                title={topic.isPredictionTopic ? 'Remove from predictions' : 'Add to predictions'}
                              >
                                <Psychology />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                onClick={() => handleEditTopic(topic)}
                                color="primary"
                              >
                                <Edit />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                onClick={() => handleDeleteTopic(topic.id, subject.id)}
                                color="error"
                              >
                                <Delete />
                              </IconButton>
                            </Stack>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {topic.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                              label={topic.difficulty}
                              color={
                                topic.difficulty === 'Beginner' ? 'success' :
                                topic.difficulty === 'Intermediate' ? 'warning' : 'error'
                              }
                              size="small"
                            />
                            <Chip 
                              label={`${topic.estimatedHours}h`}
                              variant="outlined"
                              size="small"
                            />
                            <Chip 
                              label={topic.isActive ? 'Active' : 'Inactive'}
                              color={topic.isActive ? 'success' : 'default'}
                              size="small"
                              variant="outlined"
                            />
                            {topic.isPredictionTopic && (
                              <Chip 
                                label="Prediction Topic"
                                color="warning"
                                size="small"
                                icon={<Psychology />}
                              />
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    No topics found for {subject.name}. Add some topics to get started.
                  </Alert>
                )}
              </Paper>
            ))}
          </Box>
        )}

        {/* Prediction Management Tab */}
        {tabValue === 3 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Prediction Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddPrediction}
              >
                Add New Prediction
              </Button>
            </Box>

            {/* Predictions Grid */}
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gap: 3
            }}>
              {predictions.map((prediction) => (
                <Card key={prediction.id} variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>{prediction.title}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {prediction.description}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditPrediction(prediction)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeletePrediction(prediction.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip 
                        label={subjects.find(s => s.id === prediction.subjectId)?.name || 'Unknown Subject'}
                        color="primary"
                        size="small"
                        icon={<Subject />}
                      />
                      <Chip 
                        label={prediction.difficulty}
                        color={
                          prediction.difficulty === 'Easy' ? 'success' :
                          prediction.difficulty === 'Medium' ? 'warning' : 'error'
                        }
                        size="small"
                      />
                      <Chip 
                        label={`${prediction.topicIds.length} topics`}
                        variant="outlined"
                        size="small"
                      />
                      <Chip 
                        label={`${prediction.questionIds.length} questions`}
                        variant="outlined"
                        size="small"
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Estimated Score: <strong>{prediction.estimatedScore}%</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Confidence: <strong>{prediction.confidence}%</strong>
                        </Typography>
                      </Box>
                      <Chip 
                        label={prediction.isActive ? 'Active' : 'Inactive'}
                        color={prediction.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
              
              {predictions.length === 0 && (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Psychology sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Predictions Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Create your first prediction to help students prepare for their exams.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddPrediction}
                  >
                    Add First Prediction
                  </Button>
                </Paper>
              )}
            </Box>
          </Box>
        )}

        {/* Publication Center Tab */}
        {tabValue === 4 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Publication Center
              </Typography>
              <Button
                variant="contained"
                startIcon={<FileDownload />}
                onClick={exportPublishedQuestions}
                color="secondary"
              >
                Export Published Questions
              </Button>
            </Box>

            {/* Publication Statistics */}
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 2,
              mb: 4
            }}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <CheckCircle sx={{ fontSize: 30, color: 'success.main', mb: 1 }} />
                  <Typography variant="h5" color="success.main" fontWeight="bold">
                    {questions.filter(q => q.isPublished).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Published Questions
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <UnpublishedOutlined sx={{ fontSize: 30, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h5" color="warning.main" fontWeight="bold">
                    {questions.filter(q => !q.isPublished && q.isActive).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ready to Publish
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <AutoAwesome sx={{ fontSize: 30, color: 'info.main', mb: 1 }} />
                  <Typography variant="h5" color="info.main" fontWeight="bold">
                    {questions.filter(q => q.isPublished && q.solutionAccess !== 'never').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Published with Solutions
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <AccessTime sx={{ fontSize: 30, color: 'secondary.main', mb: 1 }} />
                  <Typography variant="h5" color="secondary.main" fontWeight="bold">
                    {questions.filter(q => q.isPublished && q.createdAt === new Date().toISOString().split('T')[0]).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Published Today
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Quick Actions */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>
                Quick Publication Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<Publish />}
                  onClick={() => {
                    const unpublishedQuestions = questions.filter(q => !q.isPublished && q.isActive);
                    if (unpublishedQuestions.length > 0) {
                      handleBulkPublish(
                        unpublishedQuestions.map(q => q.id), 
                        true, 
                        'after-attempt'
                      );
                    } else {
                      showNotification('No unpublished questions available', 'info');
                    }
                  }}
                >
                  Publish All Ready Questions
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Publish />}
                  onClick={() => {
                    const mathQuestions = questions.filter(q => 
                      !q.isPublished && q.subjectId === 'mathematics' && q.isActive
                    );
                    if (mathQuestions.length > 0) {
                      handleBulkPublish(
                        mathQuestions.map(q => q.id), 
                        true, 
                        'immediate'
                      );
                    } else {
                      showNotification('No unpublished mathematics questions available', 'info');
                    }
                  }}
                >
                  Publish Math Questions
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<UnpublishedOutlined />}
                  color="warning"
                  onClick={() => {
                    const publishedQuestions = questions.filter(q => q.isPublished);
                    if (publishedQuestions.length > 0) {
                      const updatedQuestions = questions.map(q => ({ ...q, isPublished: false }));
                      setQuestions(updatedQuestions);
                      showNotification('All questions unpublished', 'warning');
                    } else {
                      showNotification('No published questions to unpublish', 'info');
                    }
                  }}
                >
                  Unpublish All
                </Button>
              </Box>
            </Paper>

            {/* Published Questions Table */}
            <Typography variant="h6" gutterBottom>
              Published Questions
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell><strong>ID</strong></TableCell>
                    <TableCell><strong>Subject</strong></TableCell>
                    <TableCell><strong>Question</strong></TableCell>
                    <TableCell><strong>Solutions</strong></TableCell>
                    <TableCell><strong>Access Level</strong></TableCell>
                    <TableCell><strong>Published Date</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.filter(q => q.isPublished).map((question) => (
                    <TableRow key={question.id} hover>
                      <TableCell>{question.id}</TableCell>
                      <TableCell>
                        {subjects.find(s => s.id === question.subjectId)?.icon}{' '}
                        {subjects.find(s => s.id === question.subjectId)?.name}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 400 }}>
                        {question.question.length > 80 
                          ? question.question.substring(0, 80) + '...'
                          : question.question
                        }
                      </TableCell>
                      <TableCell>
                        {question.solutionAccess !== 'never' ? (
                          <Chip label="Included" color="success" size="small" />
                        ) : (
                          <Chip label="Not Included" color="default" size="small" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={question.solutionAccess}
                          color={
                            question.solutionAccess === 'immediate' ? 'success' :
                            question.solutionAccess === 'after-attempt' ? 'warning' : 'error'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{question.createdAt}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton 
                            size="small" 
                            onClick={() => handlePreview(question)}
                            color="info"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleUnpublish(question.id)}
                            color="warning"
                          >
                            <UnpublishedOutlined />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditQuestion(question)}
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {questions.filter(q => q.isPublished).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography color="text.secondary" sx={{ py: 4 }}>
                          No published questions yet. Start by publishing some questions from the Question Management tab.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Analytics Tab */}
        {tabValue === 5 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Analytics Dashboard
            </Typography>
            <Alert severity="info">
              Analytics features will be implemented in the next phase. This will include question performance metrics, student engagement data, and prediction accuracy reports.
            </Alert>
          </Box>
        )}

        {/* Settings Tab */}
        {tabValue === 6 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Settings
            </Typography>
            
            {/* Access Code Management */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🎫 Student Access Code Management
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Generate and manage access codes for student registration. Students need a valid access code to register on the platform.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<AutoAwesome />}
                    onClick={() => {
                      // This will use the generateAccessCode from useAuth
                      window.location.reload(); // Simple refresh to show new code
                    }}
                  >
                    Generate New Access Code
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<FileDownload />}
                    onClick={() => {
                      // This could export access codes or send via WhatsApp
                      alert('Access code sharing features will be implemented');
                    }}
                  >
                    Share Code
                  </Button>
                </Box>
                
                <Alert severity="info" sx={{ mt: 2 }}>
                  💡 <strong>How it works:</strong> Generate access codes for your students. Each code is valid for 8 months. 
                  Students use these codes during registration to join your platform.
                </Alert>
              </CardContent>
            </Card>

            {/* User Management */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  👥 User Management
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Manage administrator, teacher, and student accounts.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    // This could open UserManagement component or navigate to it
                    alert('User management features are available in the admin panel');
                  }}
                >
                  Manage Users
                </Button>
              </CardContent>
            </Card>

            {/* System Information */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ℹ️ System Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Platform: BECE 2026 Prediction System<br/>
                  Version: 1.0.0 Production<br/>
                  Status: Operational
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}
      </Paper>

      {/* Add/Edit Question Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingQuestion ? 'Edit Question' : 'Add New Question'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select
                  value={formData.subjectId || ''}
                  label="Subject"
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, subjectId: e.target.value, topicId: '' }));
                    setSelectedSubject(e.target.value);
                  }}
                >
                  {subjects.map(subject => (
                    <MenuItem key={subject.id} value={subject.id}>
                      {subject.icon} {subject.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Topic</InputLabel>
                <Select
                  value={formData.topicId || ''}
                  label="Topic"
                  onChange={(e) => setFormData(prev => ({ ...prev, topicId: e.target.value }))}
                  disabled={!formData.subjectId}
                >
                  {formData.subjectId && topics[formData.subjectId as keyof typeof topics]?.map(topic => (
                    <MenuItem key={topic.id} value={topic.id}>
                      {topic.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={formData.difficulty || 'Beginner'}
                  label="Difficulty"
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                >
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Question Type Selection */}
            <FormControl fullWidth>
              <InputLabel>Question Type</InputLabel>
              <Select
                value={formData.type || 'multiple-choice'}
                label="Question Type"
                onChange={(e) => {
                  const newType = e.target.value as QuestionData['type'];
                  setFormData(prev => ({ 
                    ...prev, 
                    type: newType,
                    // Reset type-specific fields
                    options: newType === 'multiple-choice' ? ['', '', '', ''] : undefined,
                    correctAnswer: ''
                  }));
                }}
              >
                {questionTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Question"
              multiline
              rows={3}
              fullWidth
              value={formData.question || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
              placeholder="Enter the question text here..."
            />

            {/* Question Type Specific Fields */}
            {renderQuestionTypeFields()}

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2">
                  Explanation
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AutoAwesome />}
                  onClick={handleGenerateAISolution}
                  size="small"
                >
                  Generate AI Solution
                </Button>
              </Box>
              <TextField
                multiline
                rows={4}
                fullWidth
                value={formData.explanation || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
                placeholder="Enter detailed explanation for the correct answer..."
              />
              {formData.tags?.includes('AI-generated') && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  <AutoAwesome sx={{ mr: 1 }} />
                  This explanation was generated using AI
                </Alert>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveQuestion} 
            variant="contained" 
            startIcon={<Save />}
          >
            {editingQuestion ? 'Update' : 'Save'} Question
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Question Dialog */}
      <Dialog 
        open={previewDialog} 
        onClose={() => setPreviewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Question Preview</DialogTitle>
        <DialogContent>
          {previewQuestion && (
            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {previewQuestion.question}
                </Typography>
                <Chip 
                  label={questionTypes.find(qt => qt.value === previewQuestion.type)?.icon + ' ' + 
                        questionTypes.find(qt => qt.value === previewQuestion.type)?.label}
                  color="primary"
                  size="small"
                />
              </Box>

              {/* Render based on question type */}
              {previewQuestion.type === 'multiple-choice' && previewQuestion.options && (
                <Stack spacing={1} sx={{ mb: 2 }}>
                  {previewQuestion.options.map((option, index) => (
                    <Box 
                      key={index}
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: previewQuestion.correctAnswer === option ? 'success.main' : 'grey.300',
                        borderRadius: 1,
                        bgcolor: previewQuestion.correctAnswer === option ? 'success.50' : 'transparent'
                      }}
                    >
                      <Typography>
                        {String.fromCharCode(65 + index)}. {option}
                        {previewQuestion.correctAnswer === option && ' ✓'}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}

              {previewQuestion.type === 'true-false' && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Correct Answer:</Typography>
                  <Chip 
                    label={previewQuestion.correctAnswer === 'true' ? 'True' : 'False'}
                    color="success"
                    variant="filled"
                  />
                </Box>
              )}

              {previewQuestion.type === 'short-answer' && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Expected Answer:</Typography>
                  <Typography 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'success.50', 
                      borderRadius: 1, 
                      border: 1, 
                      borderColor: 'success.main' 
                    }}
                  >
                    {previewQuestion.correctAnswer}
                  </Typography>
                </Box>
              )}

              {previewQuestion.type === 'essay' && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Essay Requirements:</Typography>
                  <Box sx={{ p: 2, bgcolor: 'info.50', borderRadius: 1, border: 1, borderColor: 'info.main' }}>
                    <Typography variant="body2">
                      • Points: {previewQuestion.points}
                    </Typography>
                    <Typography variant="body2">
                      • Grading Criteria: {previewQuestion.correctAnswer}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Typography variant="subtitle2" gutterBottom>
                Explanation:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {previewQuestion.explanation}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Publish Question Dialog */}
      <Dialog 
        open={publishDialog} 
        onClose={() => setPublishDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Publish Question</DialogTitle>
        <DialogContent>
          {publishingQuestion && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="h6" gutterBottom>
                {publishingQuestion.question.length > 100 
                  ? publishingQuestion.question.substring(0, 100) + '...'
                  : publishingQuestion.question
                }
              </Typography>
              
              <Alert severity="info" sx={{ mb: 3 }}>
                Publishing this question will make it available to students in the prediction app.
              </Alert>

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                Solution Settings
              </Typography>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Solution Access Level
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>When should students see the solution?</InputLabel>
                  <Select
                    value={publishingQuestion.solutionAccess || 'after-attempt'}
                    label="When should students see the solution?"
                    onChange={(e) => setPublishingQuestion(prev => 
                      prev ? { ...prev, solutionAccess: e.target.value as any } : null
                    )}
                  >
                      <MenuItem value="immediate">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle color="success" />
                          <Box>
                            <Typography variant="body2">Immediately</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Students can see the solution right away
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                      <MenuItem value="after-attempt">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTime color="warning" />
                          <Box>
                            <Typography variant="body2">After Attempt</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Students see solution after submitting their answer
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                      <MenuItem value="never">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Cancel color="error" />
                          <Box>
                            <Typography variant="body2">Never</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Solutions are hidden from students (admin/teacher only)
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                <strong>Subject:</strong> {subjects.find(s => s.id === publishingQuestion.subjectId)?.name}<br/>
                <strong>Topic:</strong> {publishingQuestion.topicId}<br/>
                <strong>Difficulty:</strong> {publishingQuestion.difficulty}<br/>
                <strong>Points:</strong> {publishingQuestion.points}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishDialog(false)} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button 
            onClick={() => publishingQuestion && handlePublishQuestion(
              true, 
              publishingQuestion.solutionAccess || 'after-attempt'
            )} 
            variant="contained" 
            startIcon={<Publish />}
            color="success"
          >
            Publish Question
          </Button>
        </DialogActions>
      </Dialog>

      {/* Subject Dialog */}
      <Dialog 
        open={subjectDialog} 
        onClose={() => setSubjectDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingSubject ? 'Edit Subject' : 'Add New Subject'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Subject Name"
              fullWidth
              value={subjectFormData.name || ''}
              onChange={(e) => setSubjectFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Mathematics, English Language"
            />
            <TextField
              label="Icon (Emoji)"
              fullWidth
              value={subjectFormData.icon || ''}
              onChange={(e) => setSubjectFormData(prev => ({ ...prev, icon: e.target.value }))}
              placeholder="e.g., 📊, 📖, 🔬"
            />
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              value={subjectFormData.description || ''}
              onChange={(e) => setSubjectFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the subject..."
            />
            <FormControlLabel
              control={
                <Switch
                  checked={subjectFormData.isActive || false}
                  onChange={(e) => setSubjectFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  color="primary"
                />
              }
              label="Active Subject"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubjectDialog(false)} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveSubject} 
            variant="contained" 
            startIcon={<Save />}
          >
            {editingSubject ? 'Update' : 'Add'} Subject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Topic Dialog */}
      <Dialog 
        open={topicDialog} 
        onClose={() => setTopicDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingTopic ? 'Edit Topic' : 'Add New Topic'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Subject</InputLabel>
              <Select
                value={topicFormData.subjectId || ''}
                label="Subject"
                onChange={(e) => setTopicFormData(prev => ({ ...prev, subjectId: e.target.value }))}
              >
                {subjects.map(subject => (
                  <MenuItem key={subject.id} value={subject.id}>
                    {subject.icon} {subject.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Topic Name"
              fullWidth
              value={topicFormData.name || ''}
              onChange={(e) => setTopicFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Algebra, Grammar, Physics"
            />
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              value={topicFormData.description || ''}
              onChange={(e) => setTopicFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the topic..."
            />
            <FormControl fullWidth>
              <InputLabel>Difficulty Level</InputLabel>
              <Select
                value={topicFormData.difficulty || 'Beginner'}
                label="Difficulty Level"
                onChange={(e) => setTopicFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
              >
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Estimated Study Hours"
              type="number"
              fullWidth
              value={topicFormData.estimatedHours || 10}
              onChange={(e) => setTopicFormData(prev => ({ ...prev, estimatedHours: Number(e.target.value) }))}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={topicFormData.isActive || false}
                  onChange={(e) => setTopicFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  color="primary"
                />
              }
              label="Active Topic"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTopicDialog(false)} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveTopic} 
            variant="contained" 
            startIcon={<Save />}
          >
            {editingTopic ? 'Update' : 'Add'} Topic
          </Button>
        </DialogActions>
      </Dialog>

      {/* Prediction Dialog */}
      <Dialog 
        open={predictionDialog} 
        onClose={() => setPredictionDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingPrediction ? 'Edit Prediction' : 'Add New Prediction'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Prediction Title"
              fullWidth
              value={predictionFormData.title || ''}
              onChange={(e) => setPredictionFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., BECE Mathematics Excellence Path"
            />
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              value={predictionFormData.description || ''}
              onChange={(e) => setPredictionFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of the prediction..."
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select
                  value={predictionFormData.subjectId || ''}
                  label="Subject"
                  onChange={(e) => setPredictionFormData(prev => ({ ...prev, subjectId: e.target.value, topicIds: [] }))}
                >
                  {subjects.map(subject => (
                    <MenuItem key={subject.id} value={subject.id}>
                      {subject.icon} {subject.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={predictionFormData.difficulty || 'Easy'}
                  label="Difficulty"
                  onChange={(e) => setPredictionFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                >
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            {predictionFormData.subjectId && (
              <FormControl fullWidth>
                <InputLabel>Related Topics</InputLabel>
                <Select
                  multiple
                  value={predictionFormData.topicIds || []}
                  label="Related Topics"
                  onChange={(e) => setPredictionFormData(prev => ({ 
                    ...prev, 
                    topicIds: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value 
                  }))}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip 
                          key={value} 
                          label={topics[predictionFormData.subjectId!]?.find(t => t.id === value)?.name || value}
                          size="small" 
                        />
                      ))}
                    </Box>
                  )}
                >
                  {topics[predictionFormData.subjectId]?.map(topic => (
                    <MenuItem key={topic.id} value={topic.id}>
                      {topic.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Estimated Score (%)"
                type="number"
                fullWidth
                value={predictionFormData.estimatedScore || 75}
                onChange={(e) => setPredictionFormData(prev => ({ ...prev, estimatedScore: Number(e.target.value) }))}
                inputProps={{ min: 0, max: 100 }}
              />
              <TextField
                label="Confidence (%)"
                type="number"
                fullWidth
                value={predictionFormData.confidence || 80}
                onChange={(e) => setPredictionFormData(prev => ({ ...prev, confidence: Number(e.target.value) }))}
                inputProps={{ min: 0, max: 100 }}
              />
            </Box>

            <FormControl fullWidth>
              <InputLabel>Related Questions</InputLabel>
              <Select
                multiple
                value={predictionFormData.questionIds || []}
                label="Related Questions"
                onChange={(e) => setPredictionFormData(prev => ({ 
                  ...prev, 
                  questionIds: typeof e.target.value === 'string' ? [] : e.target.value as number[]
                }))}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip 
                        key={value} 
                        label={`Question ${value}`}
                        size="small" 
                      />
                    ))}
                  </Box>
                )}
              >
                {questions.filter(q => q.subjectId === predictionFormData.subjectId).map(question => (
                  <MenuItem key={question.id} value={question.id}>
                    Question {question.id}: {question.question.substring(0, 50)}...
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={predictionFormData.isActive || false}
                  onChange={(e) => setPredictionFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  color="primary"
                />
              }
              label="Active Prediction"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPredictionDialog(false)} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button 
            onClick={handleSavePrediction} 
            variant="contained" 
            startIcon={<Save />}
          >
            {editingPrediction ? 'Update' : 'Add'} Prediction
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      {notification.open && (
        <Alert 
          severity={notification.severity}
          sx={{ 
            position: 'fixed', 
            top: 20, 
            right: 20, 
            zIndex: 9999,
            minWidth: 300
          }}
        >
          {notification.message}
        </Alert>
      )}
    </Box>
  );
};

export default AdminDashboard;
