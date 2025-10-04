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

// AI Answer Generation Types
export interface AIAnswerRequest {
  question: string;
  subject: 'social-studies' | 'rme' | 'english';
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  context?: string;
}

export interface AIAnswer {
  id: string;
  questionId: string;
  marks: number;
  answerType: 'detailed-essay' | 'complete-sentences' | 'structured-response';
  content: string;
  paragraphs: string[];
  keyPoints: string[];
  conclusion?: string;
  createdAt: string;
  generatedBy: 'ai';
}

// Podcast Conversation Types
export interface PodcastCharacter {
  name: string;
  role: 'student' | 'teacher';
  gender: 'male' | 'female';
  voice?: string;
}

export interface PodcastDialogue {
  id: string;
  character: PodcastCharacter;
  text: string;
  timestamp?: number;
  order: number;
}

export interface PodcastConversation {
  id: string;
  questionId: string;
  answerId: string;
  title: string;
  duration?: number;
  dialogues: PodcastDialogue[];
  characters: {
    student: PodcastCharacter;
    teacher: PodcastCharacter;
  };
  audioUrl?: string;
  transcript: string;
  createdAt: string;
  status: 'generating' | 'ready' | 'error';
}

// Enhanced Question Solution with AI
export interface EnhancedQuestionSolution extends QuestionSolution {
  aiAnswer?: AIAnswer;
  podcastConversation?: PodcastConversation;
  answerQuality: 'basic' | 'detailed' | 'comprehensive';
  hasAudioNarration?: boolean;
}

// Subject-specific answer templates
export interface AnswerTemplate {
  subject: string;
  marksRange: {
    min: number;
    max: number;
  };
  structure: {
    introduction: boolean;
    bodyParagraphs: number;
    conclusion: boolean;
    examples: boolean;
    references: boolean;
  };
  guidelines: string[];
}
