import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Paper,
  Chip,
  FormControlLabel,
  Stack,
  Card,
  CardContent,
  IconButton,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ButtonGroup,
  Switch
} from '@mui/material';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ChevronDown, BookOpen, Calculator, Brain } from 'lucide-react';
import type { Subject, Topic, Question } from '../types';
import AIQuestionSolutionDialog from './AIQuestionSolutionDialog';

interface QuestionManagerProps {
  subjects: Subject[];
  topics: Topic[];
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

const QuestionManager: React.FC<QuestionManagerProps> = ({ 
  subjects, 
  topics, 
  questions, 
  setQuestions 
}) => {
  const [open, setOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);
  const [showMathEditor, setShowMathEditor] = useState(false);
  const [aiSolutionQuestion, setAiSolutionQuestion] = useState<Question | null>(null);
  const [showAISolution, setShowAISolution] = useState(false);

  const [formData, setFormData] = useState({
    subjectId: '',
    topicId: '',
    question: '',
    type: 'multiple-choice' as Question['type'],
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    difficulty: 'medium' as Question['difficulty'],
    points: 1,
    marks: undefined as number | undefined,
    isPredicted: false
  });

  const handleOpen = (question?: Question) => {
    if (question) {
      setEditingQuestion(question);        setFormData({
          subjectId: question.subjectId,
          topicId: question.topicId,
          question: question.question,
          type: question.type,
          options: question.options || ['', '', '', ''],
          correctAnswer: question.correctAnswer,
          explanation: question.explanation || '',
          difficulty: question.difficulty,
          points: question.points,
          marks: question.marks,
          isPredicted: question.isPredicted || false
        });
    } else {
      setEditingQuestion(null);
      setFormData({
        subjectId: '',
        topicId: '',
        question: '',
        type: 'multiple-choice',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
        difficulty: 'medium',
        points: 1,
        marks: undefined,
        isPredicted: false
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingQuestion(null);
    setShowMathEditor(false);
  };

  const handleSave = async () => {
    if (!formData.subjectId || !formData.topicId || !formData.question.trim() || 
        !formData.correctAnswer.trim()) {
      alert('Please fill in all required fields (Subject, Topic, Question, and Correct Answer)');
      return;
    }

    const now = new Date().toISOString();

    const questionData = {
      ...formData,
      explanation: formData.explanation || undefined,
      marks: formData.marks || undefined,
      options: formData.type === 'multiple-choice' ? formData.options.filter(opt => opt.trim()) : undefined
    };

    if (editingQuestion) {
      // Update existing question
      setQuestions(prev => prev.map(q => 
        q.id === editingQuestion.id
          ? {
              ...questionData,
              id: q.id,
              createdAt: q.createdAt,
              updatedAt: now
            }
          : q
      ));
    } else {
      // Create new question
      const newQuestion: Question = {
        ...questionData,
        id: `question-${Date.now()}`,
        createdAt: now,
        updatedAt: now
      };
      setQuestions(prev => [...prev, newQuestion]);
    }

    handleClose();
  };

  const handleDelete = (questionId: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    }
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

  const filteredQuestions = selectedSubject 
    ? questions.filter(q => q.subjectId === selectedSubject)
    : questions;

  const groupedQuestions = filteredQuestions.reduce<Record<string, Question[]>>((acc, question) => {
    const key = `${question.subjectId}-${question.topicId}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(question);
    return acc;
  }, {});

  return (
    <Box>
      <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          📝 Question Management
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Create and manage questions with AI-generated solutions
        </Typography>
      </Paper>

      {/* Controls */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap">
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => { handleOpen(); }}
          size="large"
        >
          Add New Question
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
      </Stack>

      {/* Questions List */}
      {Object.keys(groupedQuestions).length === 0 ? (
        <Alert severity="info">
          No questions found. Add your first question to get started.
        </Alert>
      ) : (
        <Box>
          {Object.entries(groupedQuestions).map(([key, questionsGroup]) => {
            const firstQuestion = questionsGroup[0];
            const subjectName = getSubjectName(firstQuestion.subjectId);
            const topicName = getTopicName(firstQuestion.topicId);
            
            return (
              <Accordion
                key={key}
                expanded={expandedAccordion === key}
                onChange={(_, isExpanded) => { setExpandedAccordion(isExpanded ? key : false); }}
                sx={{ mb: 2 }}
              >
                <AccordionSummary expandIcon={<ChevronDown />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <BookOpen size={20} color="#1976d2" />
                    <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                      {subjectName} - {topicName}
                    </Typography>
                    <Chip 
                      label={`${questionsGroup.length} question${questionsGroup.length > 1 ? 's' : ''}`} 
                      size="small" 
                      color="primary" 
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    {questionsGroup.map((question, index) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                              <Stack direction="row" spacing={1}>
                                <Chip label={question.type} size="small" />
                                <Chip 
                                  label={question.difficulty} 
                                  size="small" 
                                  color={
                                    question.difficulty === 'easy' ? 'success' : 
                                    question.difficulty === 'medium' ? 'warning' : 'error'
                                  } 
                                />
                                <Chip label={`${question.points} pts`} size="small" variant="outlined" />
                                {question.marks && (
                                  <Chip label={`${question.marks} marks`} size="small" variant="outlined" color="info" />
                                )}
                                {question.isPredicted && (
                                  <Chip 
                                    label="🔮 PREDICTED" 
                                    size="small" 
                                    color="warning" 
                                    variant="filled"
                                    sx={{ fontWeight: 'bold' }}
                                  />
                                )}
                              </Stack>
                              <Box>
                                {/* AI Solution Button for eligible subjects */}
                                {['social-studies', 'rme', 'english'].includes(question.subjectId) && (
                                  <>
                                    <IconButton 
                                      onClick={() => {
                                        setAiSolutionQuestion(question);
                                        setShowAISolution(true);
                                      }} 
                                      size="small"
                                      color="primary"
                                      title="View AI Solution"
                                    >
                                      <Brain size={16} />
                                    </IconButton>
                                    {question.marks && question.marks >= 4 && (
                                      <Chip 
                                        icon={<Brain size={12} />}
                                        label={question.marks >= 12 ? "6-Para Essay" : "Full Sentences"} 
                                        size="small" 
                                        color="primary" 
                                        variant="outlined"
                                        sx={{ ml: 1 }}
                                      />
                                    )}
                                  </>
                                )}
                                <IconButton onClick={() => { handleOpen(question); }} size="small">
                                  <Edit size={16} />
                                </IconButton>
                                <IconButton 
                                  onClick={() => { handleDelete(question.id); }} 
                                  size="small"
                                  color="error"
                                >
                                  <Trash2 size={16} />
                                </IconButton>
                              </Box>
                            </Box>

                            <Typography variant="h6" gutterBottom>
                              {question.question}
                            </Typography>

                            {question.type === 'multiple-choice' && question.options && (
                              <Box sx={{ ml: 2, mb: 2 }}>
                                {question.options.map((option, idx) => (
                                  <Typography 
                                    key={idx} 
                                    variant="body2" 
                                    sx={{ 
                                      color: option === question.correctAnswer ? 'success.main' : 'text.primary',
                                      fontWeight: option === question.correctAnswer ? 'bold' : 'normal'
                                    }}
                                  >
                                    {String.fromCharCode(65 + idx)}. {option}
                                    {option === question.correctAnswer && ' ✓'}
                                  </Typography>
                                ))}
                              </Box>
                            )}

                            <Divider sx={{ my: 2 }} />

                            {question.explanation && (
                              <>
                                <Typography variant="subtitle2" color="primary" gutterBottom>
                                  Explanation:
                                </Typography>
                                <Typography variant="body2" paragraph>
                                  {question.explanation}
                                </Typography>
                              </>
                            )}

                            {/* AI Solution Indicator */}
                            {['social-studies', 'rme', 'english'].includes(question.subjectId) && question.marks && question.marks >= 4 && (
                              <Paper sx={{ p: 2, bgcolor: 'primary.50', border: 1, borderColor: 'primary.200', mt: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Brain size={20} color="#1976d2" />
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle2" color="primary.dark">
                                      {question.marks >= 12 ? 'AI 6-Paragraph Essay Available' : 'AI Full Sentence Answers Available'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {question.marks >= 12 
                                        ? `Comprehensive essay with introduction, 4 body paragraphs, and conclusion (${question.marks} marks)`
                                        : `Complete sentence answers and podcast conversation (${question.marks} marks)`
                                      }
                                    </Typography>
                                  </Box>
                                  <Button 
                                    size="small" 
                                    startIcon={<Brain />} 
                                    variant="outlined" 
                                    color="primary"
                                    onClick={() => {
                                      setAiSolutionQuestion(question);
                                      setShowAISolution(true);
                                    }}
                                  >
                                    View Solution
                                  </Button>
                                </Box>
                              </Paper>
                            )}

                            {question.marks && (
                              <Box sx={{ mt: 2 }}>
                                <Chip 
                                  label={`Total Marks: ${question.marks}`} 
                                  variant="outlined" 
                                  color="info"
                                  size="small"
                                />
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      )}

      {/* Add/Edit Question Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editingQuestion ? 'Edit Question' : 'Add New Question'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Subject and Topic Selection */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <FormControl fullWidth>
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

              <FormControl fullWidth disabled={!formData.subjectId}>
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

            {/* Question Details */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="subtitle1">Question *</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showMathEditor}
                      onChange={(e) => { setShowMathEditor(e.target.checked); }}
                      size="small"
                    />
                  }
                  label="Use Math Editor"
                />
              </Box>

              {showMathEditor ? (
                <MathTextEditor
                  value={formData.question}
                  onChange={(value) => { setFormData(prev => ({ ...prev, question: value })); }}
                  placeholder="Enter mathematical question with symbols and functions..."
                  label="Mathematical Question Editor"
                />
              ) : (
                <TextField
                  label="Question"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.question}
                  onChange={(e) => { setFormData(prev => ({ ...prev, question: e.target.value })); }}
                  placeholder="Enter the question here..."
                />
              )}
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => { setFormData(prev => ({ ...prev, type: e.target.value })); }}
                  label="Type"
                >
                  <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                  <MenuItem value="short-answer">Short Answer</MenuItem>
                  <MenuItem value="essay">Essay</MenuItem>
                  <MenuItem value="practical">Practical</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={formData.difficulty}
                  onChange={(e) => { setFormData(prev => ({ ...prev, difficulty: e.target.value })); }}
                  label="Difficulty"
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
                onChange={(e) => { setFormData(prev => ({ ...prev, points: parseInt(e.target.value) || 1 })); }}
                inputProps={{ min: 1, max: 20 }}
              />

              <TextField
                label="Marks (Optional)"
                type="number"
                value={formData.marks || ''}
                onChange={(e) => { 
                  const value = e.target.value ? parseInt(e.target.value) : undefined;
                  setFormData(prev => ({ ...prev, marks: value })); 
                }}
                inputProps={{ min: 1, max: 100 }}
                placeholder="Total marks for this question"
              />

              {/* Prediction Option */}
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPredicted}
                    onChange={(e) => { setFormData(prev => ({ ...prev, isPredicted: e.target.checked })); }}
                    color="warning"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>Mark as Predicted Question</Typography>
                    <Chip 
                      label="PREDICTION" 
                      size="small" 
                      color="warning" 
                      variant={formData.isPredicted ? "filled" : "outlined"}
                    />
                  </Box>
                }
                sx={{ mt: 1 }}
              />
            </Box>

            {/* Multiple Choice Options */}
            {formData.type === 'multiple-choice' && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Answer Options:
                </Typography>
                <Stack spacing={2}>
                  {formData.options.map((option, index) => (
                    showMathEditor ? (
                      <MathTextEditor
                        key={index}
                        value={option}
                        onChange={(value) => {
                          const newOptions = [...formData.options];
                          newOptions[index] = value;
                          setFormData(prev => ({ ...prev, options: newOptions }));
                        }}
                        placeholder={`Enter option ${String.fromCharCode(65 + index)} with mathematical notation...`}
                        label={`Option ${String.fromCharCode(65 + index)} (Math Mode)`}
                      />
                    ) : (
                      <TextField
                        key={index}
                        label={`Option ${String.fromCharCode(65 + index)}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...formData.options];
                          newOptions[index] = e.target.value;
                          setFormData(prev => ({ ...prev, options: newOptions }));
                        }}
                        placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
                      />
                    )
                  ))}
                </Stack>
              </Box>
            )}

            {/* Correct Answer */}
            {showMathEditor ? (
              <MathTextEditor
                value={formData.correctAnswer}
                onChange={(value) => { setFormData(prev => ({ ...prev, correctAnswer: value })); }}
                placeholder="Enter the correct answer with mathematical notation..."
                label="Correct Answer (Math Mode)"
              />
            ) : (
              <TextField
                label="Correct Answer *"
                fullWidth
                value={formData.correctAnswer}
                onChange={(e) => { setFormData(prev => ({ ...prev, correctAnswer: e.target.value })); }}
                placeholder={formData.type === 'multiple-choice' ? 'Enter the correct option text' : 'Enter the correct answer'}
              />
            )}

            {/* Explanation (Optional) */}
            {showMathEditor ? (
              <MathTextEditor
                value={formData.explanation || ''}
                onChange={(value) => { setFormData(prev => ({ ...prev, explanation: value })); }}
                placeholder="Brief explanation with mathematical notation... (Optional)"
                label="Explanation (Math Mode) - Optional"
              />
            ) : (
              <TextField
                label="Explanation (Optional)"
                fullWidth
                multiline
                rows={3}
                value={formData.explanation || ''}
                onChange={(e) => { setFormData(prev => ({ ...prev, explanation: e.target.value })); }}
                placeholder="Brief explanation of why this is the correct answer (optional)"
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingQuestion ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI Solution Dialog */}
      {showAISolution && aiSolutionQuestion && (
        <AIQuestionSolutionDialog
          question={aiSolutionQuestion}
          subject={subjects.find(s => s.id === aiSolutionQuestion.subjectId)!}
          onClose={() => {
            setShowAISolution(false);
            setAiSolutionQuestion(null);
          }}
        />
      )}
    </Box>
  );
};

// Math Text Editor Component for Admin
const MathTextEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}> = ({ value, onChange, placeholder = 'Enter mathematical expression...', label = 'Math Expression Editor' }) => {
  const textFieldRef = useRef<HTMLInputElement>(null);

  const insertSymbol = (symbol: string) => {
    if (textFieldRef.current) {
      const input = textFieldRef.current;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const newValue = value.substring(0, start) + symbol + value.substring(end);
      onChange(newValue);
      
      // Set cursor position after inserted symbol
      setTimeout(() => {
        if (textFieldRef.current) {
          textFieldRef.current.setSelectionRange(start + symbol.length, start + symbol.length);
          textFieldRef.current.focus();
        }
      }, 10);
    }
  };

  const insertFunction = (func: string) => {
    const functionFormats: Record<string, string> = {
      'sqrt': '√(',
      'frac': '/',
      'sum': '∑',
      'int': '∫',
      'lim': 'lim',
      'sin': 'sin(',
      'cos': 'cos(',
      'tan': 'tan(',
      'log': 'log(',
      'ln': 'ln(',
      'vec': '⃗',
      'arrow': '→',
      'sigma': 'Σ',
    };
    
    const symbol = functionFormats[func] || func;
    insertSymbol(symbol);
  };

  const clearEditor = () => {
    onChange('');
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  };

  const basicSymbols = ['+', '−', '×', '÷', '=', '≠', '<', '>', '≤', '≥'];
  const advancedSymbols = ['½', '¼', '¾', '²', '³', '√', '∛', '±', '∞', 'π', 'θ', 'α', 'β', 'Σ', '→', '⃗'];
  const functions = ['sqrt', 'sin', 'cos', 'tan', 'log', 'ln', 'sum', 'int', 'lim', 'vec', 'arrow', 'sigma'];

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Calculator size={18} />
        {label}
      </Typography>
      
      <TextField
        fullWidth
        multiline
        rows={3}
        value={value}
        onChange={(e) => { onChange(e.target.value); }}
        placeholder={placeholder}
        inputRef={textFieldRef}
        sx={{ mb: 2 }}
        variant="outlined"
      />

      {value && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Preview:
          </Typography>
          <Typography sx={{ fontFamily: 'monospace', fontSize: '1.1em', wordBreak: 'break-all' }}>
            {value}
          </Typography>
        </Box>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>Basic Symbols:</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {basicSymbols.map((symbol, index) => (
            <Button
              key={index}
              variant="outlined"
              size="small"
              onClick={() => { insertSymbol(symbol); }}
              sx={{ 
                minWidth: 36, 
                height: 36,
                fontSize: '1.1em'
              }}
            >
              {symbol}
            </Button>
          ))}
        </Box>

        <Typography variant="subtitle2" gutterBottom>Advanced Symbols:</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {advancedSymbols.map((symbol, index) => (
            <Button
              key={index}
              variant="outlined"
              size="small"
              onClick={() => { insertSymbol(symbol); }}
              sx={{ 
                minWidth: 36, 
                height: 36,
                fontSize: '1.1em'
              }}
            >
              {symbol}
            </Button>
          ))}
        </Box>

        <Typography variant="subtitle2" gutterBottom>Functions:</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {functions.map((func, index) => (
            <Button
              key={index}
              variant="outlined"
              size="small"
              onClick={() => { insertFunction(func); }}
              sx={{ 
                fontSize: '0.75em',
                textTransform: 'none'
              }}
            >
              {func}
            </Button>
          ))}
        </Box>

        <ButtonGroup variant="outlined" size="small">
          <Button onClick={clearEditor} startIcon={<Trash2 size={14} />}>
            Clear
          </Button>
        </ButtonGroup>
      </Box>
    </Paper>
  );
};

export default QuestionManager;
