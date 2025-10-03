import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  LinearProgress,
  Alert,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, Clock, Trophy } from 'lucide-react';
import type { Subject } from '../types';

interface PracticeModeProps {
  subject: Subject;
  onBack: () => void;
}

interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'short-answer' | 'essay';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  points: number;
}

interface Answer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  timeSpent: number;
}

const PracticeMode: React.FC<PracticeModeProps> = ({ subject, onBack }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const mockQuestions = generateMockQuestions(subject);
    setQuestions(mockQuestions);
    setStartTime(Date.now());
  }, [subject]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(Date.now() - startTime);
    }, 1000);

    return () => { clearInterval(interval); };
  }, [startTime]);

  const generateMockQuestions = (subject: Subject): Question[] => {
    const questionBank: Record<string, Question[]> = {
      mathematics: [
        {
          id: 'math-1',
          question: 'Express 45,600,000 in standard form',
          type: 'multiple-choice',
          options: ['4.56 × 10⁷', '45.6 × 10⁶', '4.56 × 10⁸', '456 × 10⁵'],
          correctAnswer: '4.56 × 10⁷',
          explanation: 'Standard form: Move decimal point 7 places left from 45,600,000 to get 4.56 × 10⁷',
          topic: 'Standard Form',
          points: 10
        },
        {
          id: 'math-2',
          question: 'Simplify: ¾ + ⅝ - ½',
          type: 'short-answer',
          correctAnswer: '7/8',
          explanation: 'Convert to common denominator 8: ⁶⁄₈ + ⅝ - ⁴⁄₈ = ⁷⁄₈',
          topic: 'Fractions (BODMAS & Applications)',
          points: 15
        },
        {
          id: 'math-3',
          question: 'A shopkeeper bought an item for GH¢80 and sold it at 30% profit. Calculate the selling price.',
          type: 'short-answer',
          correctAnswer: '104',
          explanation: 'Profit = 30% of 80 = 24. Selling price = 80 + 24 = GH¢104',
          topic: 'Percentages & Applications',
          points: 15
        },
        {
          id: 'math-4',
          question: 'Factorize: x² + 5x + 6',
          type: 'short-answer',
          correctAnswer: '(x + 2)(x + 3)',
          explanation: 'Find two numbers that multiply to 6 and add to 5: 2 and 3. So x² + 5x + 6 = (x + 2)(x + 3)',
          topic: 'Algebra - Factorization & Expansion',
          points: 20
        },
        {
          id: 'math-5',
          question: 'Expand: (x + 4)(x - 3)',
          type: 'short-answer',
          correctAnswer: 'x² + x - 12',
          explanation: '(x + 4)(x - 3) = x² - 3x + 4x - 12 = x² + x - 12',
          topic: 'Two Binomials',
          points: 15
        },
        {
          id: 'math-6',
          question: 'Make y the subject: 3x + 2y = 12',
          type: 'short-answer',
          correctAnswer: 'y = (12 - 3x)/2',
          explanation: '3x + 2y = 12 → 2y = 12 - 3x → y = (12 - 3x)/2',
          topic: 'Change of Subject',
          points: 15
        },
        {
          id: 'math-7',
          question: 'If y varies directly as x², and y = 18 when x = 3, find y when x = 4',
          type: 'short-answer',
          correctAnswer: '32',
          explanation: 'y = kx². When x=3, y=18: 18 = k(9), so k=2. When x=4: y = 2(16) = 32',
          topic: 'Variations',
          points: 20
        },
        {
          id: 'math-8',
          question: 'Solve: 2x + 5 = 3x - 7',
          type: 'short-answer',
          correctAnswer: '12',
          explanation: '2x + 5 = 3x - 7 → 5 + 7 = 3x - 2x → 12 = x',
          topic: 'Equations & Applications',
          points: 10
        },
        {
          id: 'math-9',
          question: 'Solve: 3x - 4 ≥ 8',
          type: 'short-answer',
          correctAnswer: 'x ≥ 4',
          explanation: '3x - 4 ≥ 8 → 3x ≥ 12 → x ≥ 4',
          topic: 'Inequalities & Applications',
          points: 15
        },
        {
          id: 'math-10',
          question: 'In a triangle, two angles are 65° and 45°. Find the third angle.',
          type: 'multiple-choice',
          options: ['60°', '70°', '80°', '90°'],
          correctAnswer: '70°',
          explanation: 'Sum of angles in triangle = 180°. Third angle = 180° - 65° - 45° = 70°',
          topic: 'Angles - Triangles & Quadrilaterals',
          points: 10
        },
        {
          id: 'math-11',
          question: 'Find the area of a circle with radius 14cm (use π = 22/7)',
          type: 'short-answer',
          correctAnswer: '616',
          explanation: 'Area = πr² = (22/7) × 14² = (22/7) × 196 = 616 cm²',
          topic: 'Area & Perimeter',
          points: 15
        },
        {
          id: 'math-12',
          question: 'Calculate the volume of a cube with side length 5cm',
          type: 'short-answer',
          correctAnswer: '125',
          explanation: 'Volume of cube = side³ = 5³ = 125 cm³',
          topic: 'Volume & Total Surface Area',
          points: 10
        },
        {
          id: 'math-13',
          question: 'Find the median of: 3, 7, 2, 9, 5, 8, 4',
          type: 'short-answer',
          correctAnswer: '5',
          explanation: 'Arrange in order: 2, 3, 4, 5, 7, 8, 9. Median is middle value = 5',
          topic: 'Statistics (Mean, Mode, Median)',
          points: 15
        },
        {
          id: 'math-14',
          question: 'A fair die is thrown. What is the probability of getting an even number?',
          type: 'multiple-choice',
          options: ['1/6', '1/3', '1/2', '2/3'],
          correctAnswer: '1/2',
          explanation: 'Even numbers on die: 2, 4, 6. P(even) = 3/6 = 1/2',
          topic: 'Probability',
          points: 10
        },
        {
          id: 'math-15',
          question: 'If vector a = (2, 3) and vector b = (4, 1), find 2a + b',
          type: 'short-answer',
          correctAnswer: '(8, 7)',
          explanation: '2a = 2(2, 3) = (4, 6). 2a + b = (4, 6) + (4, 1) = (8, 7)',
          topic: 'Vectors',
          points: 20
        },
        {
          id: 'math-16',
          question: 'Find the gradient of the line joining points (2, 3) and (6, 11)',
          type: 'short-answer',
          correctAnswer: '2',
          explanation: 'Gradient = (y₂ - y₁)/(x₂ - x₁) = (11 - 3)/(6 - 2) = 8/4 = 2',
          topic: 'Coordinate Geometry',
          points: 15
        },
        {
          id: 'math-17',
          question: 'In a right triangle, if cos θ = 4/5, find sin θ',
          type: 'short-answer',
          correctAnswer: '3/5',
          explanation: 'Using Pythagoras: if cos θ = 4/5, then opposite = 3, so sin θ = 3/5',
          topic: 'Trigonometry',
          points: 20
        },
        {
          id: 'math-18',
          question: 'A point P(3, 2) is reflected in the x-axis. Find the coordinates of the image.',
          type: 'short-answer',
          correctAnswer: '(3, -2)',
          explanation: 'Reflection in x-axis: (x, y) → (x, -y). So (3, 2) → (3, -2)',
          topic: 'Transformations',
          points: 15
        }
      ],
      english: [
        {
          id: 'eng-1',
          question: 'Which of the following is a metaphor?',
          type: 'multiple-choice',
          options: [
            'She runs like the wind',
            'The classroom was a zoo',
            'He is as brave as a lion',
            'The leaves danced in the breeze'
          ],
          correctAnswer: 'The classroom was a zoo',
          explanation: 'A metaphor directly compares two things without using "like" or "as"',
          topic: 'Grammar',
          points: 10
        },
        {
          id: 'eng-2',
          question: 'Write the past tense of "begin"',
          type: 'short-answer',
          correctAnswer: 'began',
          explanation: 'Begin is an irregular verb. Past tense: began, Past participle: begun',
          topic: 'Grammar',
          points: 5
        }
      ],
      science: [
        {
          id: 'sci-1',
          question: 'What gas do plants absorb during photosynthesis?',
          type: 'multiple-choice',
          options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'],
          correctAnswer: 'Carbon dioxide',
          explanation: 'Plants absorb CO₂ from the air and release oxygen during photosynthesis',
          topic: 'Biology',
          points: 10
        },
        {
          id: 'sci-2',
          question: 'Name three states of matter',
          type: 'short-answer',
          correctAnswer: 'solid, liquid, gas',
          explanation: 'The three common states are solid, liquid, and gas. Plasma is the fourth state.',
          topic: 'Physics',
          points: 15
        }
      ]
    };

    return questionBank[subject.id] || questionBank.mathematics;
  };

  const handleAnswerSubmit = () => {
    if (!currentAnswer.trim()) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentAnswer.toLowerCase().trim() === 
                     currentQuestion.correctAnswer.toLowerCase().trim();

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      answer: currentAnswer,
      isCorrect,
      timeSpent: Date.now() - startTime
    };

    setAnswers([...answers, newAnswer]);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setCurrentAnswer('');
    setShowExplanation(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setStartTime(Date.now());
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const totalPoints = answers.reduce((sum, answer) => {
      const question = questions.find(q => q.id === answer.questionId);
      return sum + (answer.isCorrect ? (question?.points || 0) : 0);
    }, 0);
    const maxPoints = questions.reduce((sum, q) => sum + q.points, 0);
    
    return {
      correctAnswers,
      totalQuestions: questions.length,
      totalPoints,
      maxPoints,
      percentage: Math.round((correctAnswers / questions.length) * 100)
    };
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / 60000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Trophy size={64} color="#FF9800" />
          <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
            Practice Complete!
          </Typography>
          
          <Paper sx={{ p: 3, mt: 3, maxWidth: 500, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom color="primary">
              Your Results
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Correct Answers:</Typography>
              <Typography fontWeight="bold">
                {score.correctAnswers}/{score.totalQuestions}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Score:</Typography>
              <Typography fontWeight="bold">
                {score.percentage}%
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Points:</Typography>
              <Typography fontWeight="bold">
                {score.totalPoints}/{score.maxPoints}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography>Time:</Typography>
              <Typography fontWeight="bold">
                {formatTime(timeElapsed)}
              </Typography>
            </Box>

            <Alert 
              severity={score.percentage >= 70 ? 'success' : score.percentage >= 50 ? 'warning' : 'error'}
              sx={{ mb: 3 }}
            >
              {score.percentage >= 70 && 'Excellent work! You\'re well prepared for BECE 2026.'}
              {score.percentage >= 50 && score.percentage < 70 && 'Good effort! Review the topics you missed.'}
              {score.percentage < 50 && 'Keep practicing! Focus on understanding the concepts.'}
            </Alert>

            <Button variant="contained" onClick={onBack} sx={{ mr: 2 }}>
              Back to Predictions
            </Button>
            <Button variant="outlined" onClick={() => { window.location.reload(); }}>
              Practice Again
            </Button>
          </Paper>
        </motion.div>
      </Box>
    );
  }

  if (questions.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6">Loading practice questions...</Typography>
        <LinearProgress sx={{ mt: 2, width: '300px', mx: 'auto' }} />
      </Box>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowLeft />} 
          onClick={onBack}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Practice Mode - {subject.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Clock size={20} />
          <Typography>{formatTime(timeElapsed)}</Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Typography>
          <Chip label={currentQuestion.topic} color="primary" />
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ mb: 3, height: 8, borderRadius: 4 }}
        />

        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Typography variant="h6" sx={{ mb: 3, lineHeight: 1.6 }}>
            {currentQuestion.question}
          </Typography>

          {currentQuestion.type === 'multiple-choice' && (
            <RadioGroup
              value={currentAnswer}
              onChange={(e) => { setCurrentAnswer(e.target.value); }}
            >
              {currentQuestion.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                  sx={{ mb: 1 }}
                />
              ))}
            </RadioGroup>
          )}

          {(currentQuestion.type === 'short-answer' || currentQuestion.type === 'essay') && (
            <TextField
              fullWidth
              multiline={currentQuestion.type === 'essay'}
              rows={currentQuestion.type === 'essay' ? 4 : 1}
              value={currentAnswer}
              onChange={(e) => { setCurrentAnswer(e.target.value); }}
              placeholder="Type your answer here..."
              variant="outlined"
            />
          )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            {!showExplanation ? (
              <Button
                variant="contained"
                onClick={handleAnswerSubmit}
                disabled={!currentAnswer.trim()}
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNextQuestion}
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
              </Button>
            )}
          </Box>
        </motion.div>
      </Paper>

      <Dialog open={showExplanation} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {answers[answers.length - 1]?.isCorrect ? (
            <>
              <CheckCircle color="green" />
              Correct!
            </>
          ) : (
            <>
              <XCircle color="red" />
              Incorrect
            </>
          )}
        </DialogTitle>
        <DialogContent>
          <Alert 
            severity={answers[answers.length - 1]?.isCorrect ? 'success' : 'error'}
            sx={{ mb: 2 }}
          >
            <strong>Your answer:</strong> {currentAnswer}
            <br />
            <strong>Correct answer:</strong> {currentQuestion.correctAnswer}
          </Alert>
          
          <Typography variant="h6" gutterBottom>
            Explanation:
          </Typography>
          <Typography variant="body1">
            {currentQuestion.explanation}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNextQuestion} variant="contained">
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PracticeMode;
