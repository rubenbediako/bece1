import { kv } from '@vercel/kv';
import type { Subject, Question, User, AIAnswer, PodcastConversation, StudentProgress } from '../types';

export class DatabaseService {
  private static instance: DatabaseService;

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Subject Management
  async saveSubject(subject: Subject): Promise<void> {
    await kv.set(`subject:${subject.id}`, subject);
    
    // Add to subjects list
    const subjectIds = await kv.get<string[]>('subjects:list') || [];
    if (!subjectIds.includes(subject.id)) {
      subjectIds.push(subject.id);
      await kv.set('subjects:list', subjectIds);
    }
  }

  async getSubject(id: string): Promise<Subject | null> {
    return await kv.get<Subject>(`subject:${id}`);
  }

  async getAllSubjects(): Promise<Subject[]> {
    const subjectIds = await kv.get<string[]>('subjects:list') || [];
    const subjects: Subject[] = [];
    
    for (const id of subjectIds) {
      const subject = await this.getSubject(id);
      if (subject) {
        subjects.push(subject);
      }
    }
    
    return subjects;
  }

  // Question Management
  async saveQuestion(question: Question): Promise<void> {
    await kv.set(`question:${question.id}`, question);
    
    // Add to subject's questions list
    const questionIds = await kv.get<string[]>(`subject:${question.subjectId}:questions`) || [];
    if (!questionIds.includes(question.id)) {
      questionIds.push(question.id);
      await kv.set(`subject:${question.subjectId}:questions`, questionIds);
    }
  }

  async getQuestion(id: string): Promise<Question | null> {
    return await kv.get<Question>(`question:${id}`);
  }

  async getQuestionsBySubject(subjectId: string): Promise<Question[]> {
    const questionIds = await kv.get<string[]>(`subject:${subjectId}:questions`) || [];
    const questions: Question[] = [];
    
    for (const id of questionIds) {
      const question = await this.getQuestion(id);
      if (question) {
        questions.push(question);
      }
    }
    
    return questions;
  }

  async deleteQuestion(id: string): Promise<void> {
    const question = await this.getQuestion(id);
    if (question) {
      // Remove from subject's questions list
      const questionIds = await kv.get<string[]>(`subject:${question.subjectId}:questions`) || [];
      const updatedIds = questionIds.filter(qId => qId !== id);
      await kv.set(`subject:${question.subjectId}:questions`, updatedIds);
      
      // Delete the question
      await kv.del(`question:${id}`);
      
      // Delete associated AI answers and podcasts
      await kv.del(`ai-answer:${id}`);
      await kv.del(`podcast:${id}`);
    }
  }

  // AI Answer Management
  async saveAIAnswer(questionId: string, aiAnswer: AIAnswer): Promise<void> {
    await kv.set(`ai-answer:${questionId}`, aiAnswer);
  }

  async getAIAnswer(questionId: string): Promise<AIAnswer | null> {
    return await kv.get<AIAnswer>(`ai-answer:${questionId}`);
  }

  // Podcast Conversation Management
  async savePodcastConversation(questionId: string, podcast: PodcastConversation): Promise<void> {
    try {
      console.log('DatabaseService.savePodcastConversation: Saving podcast for question:', questionId);
      console.log('DatabaseService.savePodcastConversation: Podcast data:', podcast);
      
      if (!questionId) {
        throw new Error('Question ID is required');
      }
      
      if (!podcast) {
        throw new Error('Podcast conversation data is required');
      }

      await kv.set(`podcast:${questionId}`, podcast);
      console.log('DatabaseService.savePodcastConversation: Successfully saved');
    } catch (error) {
      console.error('DatabaseService.savePodcastConversation: Error:', error);
      throw error;
    }
  }

  async getPodcastConversation(questionId: string): Promise<PodcastConversation | null> {
    try {
      console.log('DatabaseService.getPodcastConversation: Fetching podcast for question:', questionId);
      
      if (!questionId) {
        throw new Error('Question ID is required');
      }

      const result = await kv.get<PodcastConversation>(`podcast:${questionId}`);
      console.log('DatabaseService.getPodcastConversation: Result:', result);
      return result;
    } catch (error) {
      console.error('DatabaseService.getPodcastConversation: Error:', error);
      throw error;
    }
  }

  // User Management
  async saveUser(user: User): Promise<void> {
    await kv.set(`user:${user.id}`, user);
  }

  async getUser(id: string): Promise<User | null> {
    return await kv.get<User>(`user:${id}`);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    // Create email->id mapping
    const userId = await kv.get<string>(`email:${email}`);
    if (userId) {
      return await this.getUser(userId);
    }
    return null;
  }

  async createUser(user: User): Promise<void> {
    await this.saveUser(user);
    // Create email->id mapping for quick lookup
    await kv.set(`email:${user.email}`, user.id);
  }

  // Student Progress Tracking
  async saveStudentProgress(userId: string, subjectId: string, progress: StudentProgress): Promise<void> {
    await kv.set(`progress:${userId}:${subjectId}`, progress);
  }

  async getStudentProgress(userId: string, subjectId: string): Promise<StudentProgress | null> {
    return await kv.get<StudentProgress>(`progress:${userId}:${subjectId}`);
  }

  // Analytics and Statistics
  async incrementQuestionViews(questionId: string): Promise<number> {
    const key = `stats:question:${questionId}:views`;
    const views = await kv.get<number>(key) || 0;
    const newViews = views + 1;
    await kv.set(key, newViews);
    return newViews;
  }

  async incrementAIAnswerGenerations(subjectId: string): Promise<number> {
    const key = `stats:subject:${subjectId}:ai-generations`;
    const count = await kv.get<number>(key) || 0;
    const newCount = count + 1;
    await kv.set(key, newCount);
    return newCount;
  }

  async getPopularQuestions(): Promise<{questionId: string, views: number}[]> {
    // This would require scanning - implement based on your needs
    // For now, return empty array
    return [];
  }

  // Backup and Restore
  async backupData(): Promise<{subjects: Subject[], questions: Question[]}> {
    const subjects = await this.getAllSubjects();
    const allQuestions: Question[] = [];
    
    for (const subject of subjects) {
      const questions = await this.getQuestionsBySubject(subject.id);
      allQuestions.push(...questions);
    }
    
    return { subjects, questions: allQuestions };
  }

  // Cache Management
  async clearCache(): Promise<void> {
    // Implement cache clearing logic if needed
    console.log('Cache clearing not implemented yet');
  }

  // Health Check
  async healthCheck(): Promise<{status: 'ok' | 'error', timestamp: string}> {
    try {
      await kv.set('health-check', Date.now());
      const value = await kv.get('health-check');
      return {
        status: value ? 'ok' : 'error',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString()
      };
    }
  }
}

export default DatabaseService;
