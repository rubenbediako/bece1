import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Interfaces for data structures
export interface SubjectData {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  createdAt: string;
}

export interface TopicData {
  id: string;
  name: string;
  subjectId: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  createdAt: string;
  isActive: boolean;
  isPredictionTopic: boolean;
}

export interface PredictionData {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  topicId: string; // Single topic ID for student view
  topicIds: string[]; // Multiple topic IDs for admin view
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedScore: number;
  confidence: number;
  probability: number;
  priority: 'High' | 'Medium' | 'Low';
  estimatedQuestions: number;
  lastUpdated: string;
  createdAt: string;
  isActive: boolean;
  questionIds: number[];
}

export interface QuestionData {
  id: string;
  topicId: string;
  subjectId: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  timeAllowed: number;
  points: number;
  createdAt: string;
  isActive: boolean;
  isPublished: boolean;
  solutionAccess: 'immediate' | 'after-attempt' | 'never';
  tags: string[];
}

interface AppContextType {
  subjects: SubjectData[];
  topics: TopicData[];
  predictions: PredictionData[];
  questions: QuestionData[];
  setSubjects: (subjects: SubjectData[]) => void;
  setTopics: (topics: TopicData[]) => void;
  setPredictions: (predictions: PredictionData[]) => void;
  setQuestions: (questions: QuestionData[]) => void;
  
  // Helper functions
  getPredictionTopics: () => TopicData[];
  getTopicsBySubject: (subjectId: string) => TopicData[];
  getQuestionsByTopic: (topicId: string) => QuestionData[];
  getPublishedQuestions: () => QuestionData[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample data - same as in AdminDashboard but centralized here
const initialSubjects: SubjectData[] = [
  { id: 'mathematics', name: 'Mathematics', description: 'Core mathematical concepts and problem-solving', icon: '📊', color: '#2563eb', isActive: true, createdAt: '2024-10-01' },
  { id: 'english', name: 'English Language', description: 'Language skills and communication', icon: '📖', color: '#7c3aed', isActive: true, createdAt: '2024-10-01' },
  { id: 'science', name: 'Integrated Science', description: 'Physics, Chemistry, and Biology concepts', icon: '🔬', color: '#059669', isActive: true, createdAt: '2024-10-01' },
  { id: 'social_studies', name: 'Social Studies', description: 'History, Geography, and Civics', icon: '🌍', color: '#dc2626', isActive: true, createdAt: '2024-10-01' },
  { id: 'rme', name: 'Religious & Moral Education', description: 'Ethics and moral reasoning', icon: '⛪', color: '#7c2d12', isActive: true, createdAt: '2024-10-01' },
  { id: 'french', name: 'French', description: 'French language and culture', icon: '🇫🇷', color: '#9333ea', isActive: true, createdAt: '2024-10-01' }
];

const initialTopics: TopicData[] = [
  // Mathematics topics
  { id: 'algebra', name: 'Algebra', subjectId: 'mathematics', description: 'Variables, equations, and expressions', difficulty: 'Intermediate', estimatedHours: 20, createdAt: '2024-10-01', isActive: true, isPredictionTopic: true },
  { id: 'geometry', name: 'Geometry', subjectId: 'mathematics', description: 'Shapes, angles, and spatial relationships', difficulty: 'Intermediate', estimatedHours: 18, createdAt: '2024-10-01', isActive: true, isPredictionTopic: true },
  { id: 'statistics', name: 'Statistics', subjectId: 'mathematics', description: 'Data analysis and probability', difficulty: 'Advanced', estimatedHours: 15, createdAt: '2024-10-01', isActive: true, isPredictionTopic: false },
  { id: 'fractions', name: 'Fractions', subjectId: 'mathematics', description: 'Working with parts of whole numbers', difficulty: 'Beginner', estimatedHours: 12, createdAt: '2024-10-01', isActive: true, isPredictionTopic: true },
  { id: 'percentage', name: 'Percentage', subjectId: 'mathematics', description: 'Calculating percentages and ratios', difficulty: 'Intermediate', estimatedHours: 10, createdAt: '2024-10-01', isActive: true, isPredictionTopic: false },
  { id: 'mensuration', name: 'Mensuration', subjectId: 'mathematics', description: 'Area, volume, and measurements', difficulty: 'Advanced', estimatedHours: 16, createdAt: '2024-10-01', isActive: true, isPredictionTopic: true },
  
  // English topics
  { id: 'grammar', name: 'Grammar', subjectId: 'english', description: 'Rules of English language structure', difficulty: 'Intermediate', estimatedHours: 25, createdAt: '2024-10-01', isActive: true, isPredictionTopic: true },
  { id: 'comprehension', name: 'Comprehension', subjectId: 'english', description: 'Reading and understanding texts', difficulty: 'Intermediate', estimatedHours: 20, createdAt: '2024-10-01', isActive: true, isPredictionTopic: false },
  { id: 'essay_writing', name: 'Essay Writing', subjectId: 'english', description: 'Structured writing and composition', difficulty: 'Advanced', estimatedHours: 30, createdAt: '2024-10-01', isActive: true, isPredictionTopic: true },
  { id: 'literature', name: 'Literature', subjectId: 'english', description: 'Analysis of literary works', difficulty: 'Advanced', estimatedHours: 35, createdAt: '2024-10-01', isActive: true, isPredictionTopic: false },
  { id: 'vocabulary', name: 'Vocabulary', subjectId: 'english', description: 'Word knowledge and usage', difficulty: 'Beginner', estimatedHours: 15, createdAt: '2024-10-01', isActive: true, isPredictionTopic: false },
  
  // Science topics
  { id: 'physics', name: 'Physics', subjectId: 'science', description: 'Motion, energy, and matter', difficulty: 'Advanced', estimatedHours: 40, createdAt: '2024-10-01', isActive: true, isPredictionTopic: true },
  { id: 'chemistry', name: 'Chemistry', subjectId: 'science', description: 'Chemical reactions and properties', difficulty: 'Advanced', estimatedHours: 35, createdAt: '2024-10-01', isActive: true, isPredictionTopic: true },
  { id: 'biology', name: 'Biology', subjectId: 'science', description: 'Living organisms and life processes', difficulty: 'Intermediate', estimatedHours: 30, createdAt: '2024-10-01', isActive: true, isPredictionTopic: false },
  { id: 'environmental_science', name: 'Environmental Science', subjectId: 'science', description: 'Ecology and environmental issues', difficulty: 'Intermediate', estimatedHours: 25, createdAt: '2024-10-01', isActive: true, isPredictionTopic: false },
  
  // Social Studies topics
  { id: 'geography', name: 'Geography', subjectId: 'social_studies', description: 'Physical and human geography', difficulty: 'Intermediate', estimatedHours: 25, createdAt: '2024-10-01', isActive: true, isPredictionTopic: true },
  { id: 'history', name: 'History', subjectId: 'social_studies', description: 'Historical events and chronology', difficulty: 'Intermediate', estimatedHours: 30, createdAt: '2024-10-01', isActive: true, isPredictionTopic: false },
  { id: 'civics', name: 'Civics', subjectId: 'social_studies', description: 'Government and citizenship', difficulty: 'Advanced', estimatedHours: 20, createdAt: '2024-10-01', isActive: true, isPredictionTopic: true },
  { id: 'economics', name: 'Economics', subjectId: 'social_studies', description: 'Economic principles and systems', difficulty: 'Advanced', estimatedHours: 22, createdAt: '2024-10-01', isActive: true, isPredictionTopic: false },
  
  // RME topics
  { id: 'christianity', name: 'Christianity', subjectId: 'rme', description: 'Christian beliefs and practices', difficulty: 'Intermediate', estimatedHours: 20, createdAt: '2024-10-01', isActive: true, isPredictionTopic: false },
  { id: 'islam', name: 'Islam', subjectId: 'rme', description: 'Islamic beliefs and practices', difficulty: 'Intermediate', estimatedHours: 20, createdAt: '2024-10-01', isActive: true, isPredictionTopic: false },
  { id: 'traditional_religion', name: 'Traditional Religion', subjectId: 'rme', description: 'African traditional beliefs', difficulty: 'Intermediate', estimatedHours: 18, createdAt: '2024-10-01', isActive: true, isPredictionTopic: true },
  
  // French topics
  { id: 'french_grammar', name: 'French Grammar', subjectId: 'french', description: 'French language structure and rules', difficulty: 'Intermediate', estimatedHours: 25, createdAt: '2024-10-01', isActive: true, isPredictionTopic: false },
  { id: 'french_vocabulary', name: 'French Vocabulary', subjectId: 'french', description: 'Essential French words and phrases', difficulty: 'Beginner', estimatedHours: 20, createdAt: '2024-10-01', isActive: true, isPredictionTopic: true }
];

const initialPredictions: PredictionData[] = [
  { 
    id: 'pred_1', 
    title: 'Algebra Questions Expected',
    description: 'High probability of algebraic equations in exam',
    subjectId: 'mathematics',
    topicId: 'algebra',
    topicIds: ['algebra'],
    difficulty: 'Medium',
    estimatedScore: 85,
    confidence: 95,
    probability: 95, 
    priority: 'High', 
    estimatedQuestions: 4, 
    lastUpdated: '2024-10-01',
    createdAt: '2024-10-01',
    isActive: true,
    questionIds: [1, 2]
  },
  { 
    id: 'pred_2', 
    title: 'Geometry Problems Likely',
    description: 'Geometric calculations and proofs expected',
    subjectId: 'mathematics',
    topicId: 'geometry',
    topicIds: ['geometry'],
    difficulty: 'Medium',
    estimatedScore: 78,
    confidence: 90,
    probability: 90, 
    priority: 'High', 
    estimatedQuestions: 3, 
    lastUpdated: '2024-10-01',
    createdAt: '2024-10-01',
    isActive: true,
    questionIds: [3]
  },
  { 
    id: 'pred_3', 
    title: 'Fraction Operations',
    description: 'Basic fraction arithmetic will be tested',
    subjectId: 'mathematics',
    topicId: 'fractions',
    topicIds: ['fractions'],
    difficulty: 'Easy',
    estimatedScore: 82,
    confidence: 85,
    probability: 85, 
    priority: 'Medium', 
    estimatedQuestions: 2, 
    lastUpdated: '2024-10-01',
    createdAt: '2024-10-01',
    isActive: true,
    questionIds: []
  },
  { 
    id: 'pred_4', 
    title: 'English Grammar Focus',
    description: 'Parts of speech and sentence structure',
    subjectId: 'english',
    topicId: 'grammar',
    topicIds: ['grammar'],
    difficulty: 'Medium',
    estimatedScore: 80,
    confidence: 88,
    probability: 88, 
    priority: 'High', 
    estimatedQuestions: 5, 
    lastUpdated: '2024-10-01',
    createdAt: '2024-10-01',
    isActive: true,
    questionIds: []
  },
  { 
    id: 'pred_5', 
    title: 'Essay Writing Required',
    description: 'Narrative or argumentative essay expected',
    subjectId: 'english',
    topicId: 'essay_writing',
    topicIds: ['essay_writing'],
    difficulty: 'Hard',
    estimatedScore: 75,
    confidence: 92,
    probability: 92, 
    priority: 'High', 
    estimatedQuestions: 1, 
    lastUpdated: '2024-10-01',
    createdAt: '2024-10-01',
    isActive: true,
    questionIds: []
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [subjects, setSubjects] = useState<SubjectData[]>(initialSubjects);
  const [topics, setTopics] = useState<TopicData[]>(initialTopics);
  const [predictions, setPredictions] = useState<PredictionData[]>(initialPredictions);
  const [questions, setQuestions] = useState<QuestionData[]>([]);

  const getPredictionTopics = (): TopicData[] => {
    return topics.filter(topic => topic.isPredictionTopic && topic.isActive);
  };

  const getTopicsBySubject = (subjectId: string): TopicData[] => {
    return topics.filter(topic => topic.subjectId === subjectId && topic.isActive);
  };

  const getQuestionsByTopic = (topicId: string): QuestionData[] => {
    return questions.filter(question => question.topicId === topicId && question.isActive);
  };

  const getPublishedQuestions = (): QuestionData[] => {
    return questions.filter(question => question.isPublished && question.isActive);
  };

  const value: AppContextType = {
    subjects,
    topics,
    predictions,
    questions,
    setSubjects,
    setTopics,
    setPredictions,
    setQuestions,
    getPredictionTopics,
    getTopicsBySubject,
    getQuestionsByTopic,
    getPublishedQuestions
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
