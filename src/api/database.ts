import { DatabaseService } from '../services/DatabaseService';
import type { Subject, Question, AIAnswer, PodcastConversation } from '../types';

const db = DatabaseService.getInstance();

// Subject API
export const subjectAPI = {
  async getAll(): Promise<Subject[]> {
    return await db.getAllSubjects();
  },

  async getById(id: string): Promise<Subject | null> {
    return await db.getSubject(id);
  },

  async save(subject: Subject): Promise<void> {
    // Add timestamps
    const now = new Date().toISOString();
    const subjectWithTimestamps = {
      ...subject,
      createdAt: subject.createdAt || now,
      updatedAt: now
    };
    
    await db.saveSubject(subjectWithTimestamps);
  }
};

// Question API
export const questionAPI = {
  async getBySubject(subjectId: string): Promise<Question[]> {
    return await db.getQuestionsBySubject(subjectId);
  },

  async getById(id: string): Promise<Question | null> {
    return await db.getQuestion(id);
  },

  async save(question: Question): Promise<void> {
    // Add timestamps
    const now = new Date().toISOString();
    const questionWithTimestamps = {
      ...question,
      createdAt: question.createdAt || now,
      updatedAt: now
    };
    
    await db.saveQuestion(questionWithTimestamps);
    
    // Track view analytics
    await db.incrementQuestionViews(question.id);
  },

  async delete(id: string): Promise<void> {
    await db.deleteQuestion(id);
  }
};

// AI Answer API
export const aiAnswerAPI = {
  async get(questionId: string): Promise<AIAnswer | null> {
    return await db.getAIAnswer(questionId);
  },

  async save(questionId: string, aiAnswer: AIAnswer): Promise<void> {
    await db.saveAIAnswer(questionId, aiAnswer);
    
    // Get question to find subject for analytics
    const question = await db.getQuestion(questionId);
    if (question) {
      await db.incrementAIAnswerGenerations(question.subjectId);
    }
  }
};

// Podcast API
export const podcastAPI = {
  async get(questionId: string): Promise<PodcastConversation | null> {
    return await db.getPodcastConversation(questionId);
  },

  async save(questionId: string, podcast: PodcastConversation): Promise<void> {
    await db.savePodcastConversation(questionId, podcast);
  }
};

// Analytics API
export const analyticsAPI = {
  async getQuestionViews(questionId: string): Promise<number> {
    return await db.incrementQuestionViews(questionId);
  },

  async getPopularQuestions(): Promise<{questionId: string, views: number}[]> {
    return await db.getPopularQuestions();
  }
};

// Health Check API
export const healthAPI = {
  async check(): Promise<{status: 'ok' | 'error', timestamp: string}> {
    return await db.healthCheck();
  }
};

// Backup API
export const backupAPI = {
  async exportData(): Promise<{subjects: Subject[], questions: Question[]}> {
    return await db.backupData();
  }
};
