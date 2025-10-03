export interface Subject {
  id: string;
  name: string;
  description: string;
  topics: Topic[];
  sections?: Section[];
  createdAt: string;
  updatedAt: string;
  isPredicted?: boolean;
}

export interface Section {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  order: number;
  parts: Part[];
  createdAt: string;
  updatedAt: string;
}

export interface Part {
  id: string;
  sectionId: string;
  subjectId: string;
  name: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  topicId: string;
  subjectId: string;
  sectionId?: string;
  partId?: string;
  question: string;
  type: 'multiple-choice' | 'short-answer' | 'essay' | 'practical';
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  solution?: QuestionSolution;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  marks?: number;
  tags?: string[];
  subQuestions?: SubQuestion[];
  createdAt: string;
  updatedAt: string;
  isPredicted?: boolean;
}

export interface QuestionSolution {
  textSolution?: string;
  hasPodcast?: boolean;
  podcastUrl?: string;
  podcastDuration?: number;
  podcastTranscript?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubQuestion {
  id: string;
  parentQuestionId: string;
  question: string;
  type: 'multiple-choice' | 'short-answer' | 'essay' | 'practical';
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  solution?: QuestionSolution;
  points: number;
  marks?: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface PredictedTopic {
  id: string;
  topicId: string;
  subjectId: string;
  year?: number;
  probability: number;
  reasoning: string;
  isActive: boolean;
  createdAt: string;
}
