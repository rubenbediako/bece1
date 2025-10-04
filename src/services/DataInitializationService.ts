import { DatabaseService } from './DatabaseService';
import type { Subject, Question } from '../types';

export class DataInitializationService {
  private static instance: DataInitializationService;
  private db = DatabaseService.getInstance();
  private isInitialized = false;

  public static getInstance(): DataInitializationService {
    if (!DataInitializationService.instance) {
      DataInitializationService.instance = new DataInitializationService();
    }
    return DataInitializationService.instance;
  }

  // Initialize app with persistent default data across all devices
  async initializeAppData(): Promise<void> {
    if (this.isInitialized) {
      console.log('📱 App data already initialized');
      return;
    }

    try {
      console.log('🚀 Initializing app data for global consistency...');
      
      // Check if data already exists
      const existingSubjects = await this.db.getAllSubjects();
      if (existingSubjects.length > 0) {
        console.log('✅ Found existing data, skipping initialization');
        this.isInitialized = true;
        return;
      }

      // Initialize default subjects (consistent across all devices)
      await this.initializeDefaultSubjects();
      
      // Initialize default questions
      await this.initializeDefaultQuestions();
      
      console.log('✅ App data initialized successfully - available on all devices');
      this.isInitialized = true;
      
    } catch (error) {
      console.error('❌ Failed to initialize app data:', error);
      throw error;
    }
  }

  private async initializeDefaultSubjects(): Promise<void> {
    const subjects: Subject[] = [
      {
        id: 'mathematics',
        name: 'Mathematics',
        description: 'Numbers, algebra, geometry, and problem-solving',
        color: '#2196F3',
        topics: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'english',
        name: 'English Language',
        description: 'Reading, writing, grammar, and literature',
        color: '#4CAF50',
        topics: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'science',
        name: 'Integrated Science',
        description: 'Physics, chemistry, biology, and scientific methods',
        color: '#FF9800',
        topics: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'social-studies',
        name: 'Social Studies',
        description: 'History, geography, government, and society',
        color: '#9C27B0',
        topics: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'rme',
        name: 'Religious and Moral Education',
        description: 'Ethics, values, and character development',
        color: '#E91E63',
        topics: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    for (const subject of subjects) {
      await this.db.saveSubject(subject);
    }

    console.log(`✅ Initialized ${subjects.length} default subjects`);
  }

  private async initializeDefaultQuestions(): Promise<void> {
    const defaultQuestions: Question[] = [
      // Social Studies Essay Questions (AI-powered)
      {
        id: 'ss-essay-1',
        topicId: 'ghana-independence',
        subjectId: 'social-studies',
        question: 'Discuss the factors that led to Ghana\'s independence and analyze their impact on modern Ghana.',
        type: 'essay' as const,
        correctAnswer: 'Multiple factors including nationalism, educated elite leadership, economic pressures, and international changes contributed to Ghana\'s independence.',
        explanation: 'This question requires analysis of historical factors and their contemporary relevance.',
        difficulty: 'hard' as const,
        points: 15,
        marks: 15,
        tags: ['independence', 'history', 'nationalism'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPredicted: true
      },
      {
        id: 'ss-essay-2',
        topicId: 'economic-development',
        subjectId: 'social-studies',
        question: 'Evaluate the role of agriculture in Ghana\'s economic development and suggest ways to improve agricultural productivity.',
        type: 'essay' as const,
        correctAnswer: 'Agriculture remains crucial to Ghana\'s economy, providing employment and food security, but faces challenges that require modern solutions.',
        explanation: 'Students should analyze both historical and contemporary aspects of Ghana\'s agricultural sector.',
        difficulty: 'medium' as const,
        points: 12,
        marks: 12,
        tags: ['agriculture', 'economy', 'development'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPredicted: true
      },
      
      // RME Essay Questions (AI-powered)
      {
        id: 'rme-essay-1',
        subjectId: 'rme',
        topicId: 'moral-values',
        question: 'Examine the importance of honesty in building trust within families and communities.',
        type: 'essay' as const,
        correctAnswer: 'Honesty is fundamental to building and maintaining trust, creating strong relationships, and establishing a harmonious society.',
        explanation: 'This question explores the moral value of honesty and its practical applications.',
        difficulty: 'medium' as const,
        points: 12,
        marks: 12,
        tags: ['honesty', 'trust', 'values'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPredicted: true
      },
      
      // English Essay Questions (AI-powered)
      {
        id: 'eng-essay-1',
        subjectId: 'english',
        topicId: 'essay-writing',
        question: 'Write an essay on the topic: "The importance of education in personal development"',
        type: 'essay' as const,
        correctAnswer: 'Education is crucial for personal development as it enhances knowledge, skills, critical thinking, and opens opportunities for success.',
        explanation: 'Students should demonstrate essay writing skills while exploring the value of education.',
        difficulty: 'medium' as const,
        points: 15,
        marks: 15,
        tags: ['education', 'personal development', 'essay'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPredicted: true
      },
      
      // Non-essay questions for other subjects
      {
        id: 'math-1',
        subjectId: 'mathematics',
        topicId: 'algebra',
        question: 'Solve for x: 2x + 5 = 15',
        type: 'short-answer' as const,
        correctAnswer: 'x = 5',
        explanation: 'Subtract 5 from both sides, then divide by 2: 2x = 10, x = 5',
        difficulty: 'easy' as const,
        points: 3,
        marks: 3,
        tags: ['algebra', 'equations'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPredicted: true
      },
      
      {
        id: 'science-1',
        subjectId: 'science',
        topicId: 'physics',
        question: 'What is the SI unit of force?',
        type: 'multiple-choice' as const,
        options: ['Joule', 'Newton', 'Watt', 'Pascal'],
        correctAnswer: 'Newton',
        explanation: 'The Newton (N) is the SI unit of force, named after Sir Isaac Newton.',
        difficulty: 'easy' as const,
        points: 2,
        marks: 2,
        tags: ['physics', 'units', 'force'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPredicted: true
      }
    ];

    for (const question of defaultQuestions) {
      await this.db.saveQuestion(question);
    }

    console.log(`✅ Initialized ${defaultQuestions.length} default questions`);
  }

  // Sync status check
  async getSyncStatus(): Promise<{
    isOnline: boolean;
    lastSync: string | null;
    dataIntegrity: boolean;
    deviceId: string;
  }> {
    try {
      const healthCheck = await this.db.healthCheck();
      const lastSync = await this.db.getLastSyncTimestamp();
      const integrity = await this.db.verifyDataIntegrity();
      
      return {
        isOnline: healthCheck.status === 'ok',
        lastSync,
        dataIntegrity: integrity.isValid,
        deviceId: this.getDeviceId()
      };
    } catch (error) {
      console.error('Error checking sync status:', error);
      return {
        isOnline: false,
        lastSync: null,
        dataIntegrity: false,
        deviceId: this.getDeviceId()
      };
    }
  }

  private getDeviceId(): string {
    // Generate consistent device ID
    if (typeof window !== 'undefined') {
      let deviceId = localStorage.getItem('bece-device-id');
      if (!deviceId) {
        deviceId = 'device-' + Date.now().toString(36) + Math.random().toString(36).substr(2);
        localStorage.setItem('bece-device-id', deviceId);
      }
      return deviceId;
    }
    return 'server';
  }
}

export default DataInitializationService;
