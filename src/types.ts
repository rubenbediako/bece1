export interface Subject {
  id: string;
  name: string;
  description: string;
  topics: Topic[];
  createdAt: string;
  updatedAt: string;
  isPredicted?: boolean;
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
  question: string;
  type: 'multiple-choice' | 'short-answer' | 'essay' | 'practical';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  solution: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  isPredicted?: boolean;
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
