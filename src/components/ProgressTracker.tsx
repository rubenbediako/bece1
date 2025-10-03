import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  TrendingUp, 
  Target, 
  Calendar, 
  Award,
  BookOpen,
  Clock,
  CheckCircle
} from 'lucide-react';

interface ProgressTrackerProps {
  onBack: () => void;
}

interface StudySession {
  id: string;
  subject: string;
  date: string;
  questionsAttempted: number;
  correctAnswers: number;
  timeSpent: number; // in minutes
  score: number;
}

interface SubjectProgress {
  subject: string;
  totalSessions: number;
  averageScore: number;
  totalTimeSpent: number;
  questionsAttempted: number;
  correctAnswers: number;
  lastSession: string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ onBack }) => {
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([]);

  useEffect(() => {
    // Load mock data - in a real app, this would come from a backend
    const mockSessions: StudySession[] = [
      {
        id: '1',
        subject: 'Mathematics',
        date: '2025-10-01',
        questionsAttempted: 15,
        correctAnswers: 12,
        timeSpent: 25,
        score: 80
      },
      {
        id: '2',
        subject: 'English Language',
        date: '2025-09-30',
        questionsAttempted: 10,
        correctAnswers: 8,
        timeSpent: 18,
        score: 80
      },
      {
        id: '3',
        subject: 'Integrated Science',
        date: '2025-09-29',
        questionsAttempted: 12,
        correctAnswers: 9,
        timeSpent: 22,
        score: 75
      },
      {
        id: '4',
        subject: 'Mathematics',
        date: '2025-09-28',
        questionsAttempted: 18,
        correctAnswers: 15,
        timeSpent: 30,
        score: 83
      },
      {
        id: '5',
        subject: 'Social Studies',
        date: '2025-09-27',
        questionsAttempted: 14,
        correctAnswers: 10,
        timeSpent: 20,
        score: 71
      }
    ];

    setStudySessions(mockSessions);
    calculateSubjectProgress(mockSessions);
  }, []);

  const calculateSubjectProgress = (sessions: StudySession[]) => {
    const subjectMap = new Map<string, StudySession[]>();
    
    sessions.forEach(session => {
      if (!subjectMap.has(session.subject)) {
        subjectMap.set(session.subject, []);
      }
      subjectMap.get(session.subject)!.push(session);
    });

    const progress: SubjectProgress[] = Array.from(subjectMap.entries()).map(([subject, sessions]) => {
      const totalSessions = sessions.length;
      const averageScore = sessions.reduce((sum, s) => sum + s.score, 0) / totalSessions;
      const totalTimeSpent = sessions.reduce((sum, s) => sum + s.timeSpent, 0);
      const questionsAttempted = sessions.reduce((sum, s) => sum + s.questionsAttempted, 0);
      const correctAnswers = sessions.reduce((sum, s) => sum + s.correctAnswers, 0);
      const lastSession = sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date;

      return {
        subject,
        totalSessions,
        averageScore: Math.round(averageScore),
        totalTimeSpent,
        questionsAttempted,
        correctAnswers,
        lastSession
      };
    });

    setSubjectProgress(progress);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getOverallStats = () => {
    const totalSessions = studySessions.length;
    const totalTimeSpent = studySessions.reduce((sum, s) => sum + s.timeSpent, 0);
    const totalQuestions = studySessions.reduce((sum, s) => sum + s.questionsAttempted, 0);
    const totalCorrect = studySessions.reduce((sum, s) => sum + s.correctAnswers, 0);
    const averageScore = studySessions.reduce((sum, s) => sum + s.score, 0) / totalSessions;

    return {
      totalSessions,
      totalTimeSpent,
      totalQuestions,
      accuracy: Math.round((totalCorrect / totalQuestions) * 100),
      averageScore: Math.round(averageScore)
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const stats = getOverallStats();

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowLeft />} 
          onClick={onBack}
          sx={{ mr: 2 }}
        >
          Back to Subjects
        </Button>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Progress Tracker
        </Typography>
      </Box>

      {/* Overall Statistics */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3, mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
              <BookOpen />
            </Avatar>
            <Typography variant="h4" color="primary">
              {stats.totalSessions}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Practice Sessions
            </Typography>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1 }}>
              <Target />
            </Avatar>
            <Typography variant="h4" color="success.main">
              {stats.accuracy}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Overall Accuracy
            </Typography>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1 }}>
              <Clock />
            </Avatar>
            <Typography variant="h4" color="warning.main">
              {Math.round(stats.totalTimeSpent / 60)}h
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Study Time
            </Typography>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 1 }}>
              <Award />
            </Avatar>
            <Typography variant="h4" color="secondary.main">
              {stats.averageScore}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Average Score
            </Typography>
          </Card>
        </motion.div>
      </Box>

      {/* Subject Progress */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp /> Subject Progress
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 3 }}>
          {subjectProgress.map((subject, index) => (
            <motion.div
              key={subject.subject}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {subject.subject}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Average Score</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {subject.averageScore}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={subject.averageScore} 
                    color={getScoreColor(subject.averageScore)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, fontSize: '0.875rem' }}>
                  <Typography variant="body2" color="text.secondary">
                    Sessions: {subject.totalSessions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Time: {subject.totalTimeSpent}m
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Questions: {subject.questionsAttempted}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last: {formatDate(subject.lastSession)}
                  </Typography>
                </Box>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Paper>

      {/* Recent Sessions */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Calendar /> Recent Practice Sessions
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell align="center">Questions</TableCell>
                <TableCell align="center">Correct</TableCell>
                <TableCell align="center">Time</TableCell>
                <TableCell align="center">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studySessions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{formatDate(session.date)}</TableCell>
                  <TableCell>
                    <Chip label={session.subject} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="center">{session.questionsAttempted}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <CheckCircle size={16} color="green" />
                      {session.correctAnswers}
                    </Box>
                  </TableCell>
                  <TableCell align="center">{session.timeSpent}m</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={`${session.score}%`} 
                      size="small" 
                      color={getScoreColor(session.score)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ProgressTracker;
