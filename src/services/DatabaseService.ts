import { kv } from '@vercel/kv';
import type { Subject, Question, User, AIAnswer, PodcastConversation, StudentProgress } from '../types';

export class DatabaseService {
  private static instance: DatabaseService;
  private readonly prefix = 'bece_2026_';
  private isInitialized = false;
  private initializationError: Error | null = null;

  private constructor() {
    this.initializeDatabase();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Check if database is properly configured
  private isDatabaseConfigured(): boolean {
    // In production, check if we're on Vercel and KV should be available
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isProduction = hostname.includes('vercel.app') || hostname.includes('vercel.com');
      const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
      
      // For local development, we might not have KV configured
      if (isLocal) {
        console.warn('🔶 Running locally - database operations may fail if KV is not configured');
        return true; // Allow operations but expect failures
      }
      
      // For production, KV should be configured
      return isProduction;
    }
    
    return true; // Default to allowing operations
  }

  // Initialize database connection and setup
  private async initializeDatabase(): Promise<void> {
    try {
      if (!this.isDatabaseConfigured()) {
        throw new Error('Database not configured for this environment');
      }

      // Test connection
      await this.healthCheck();
      this.isInitialized = true;
      this.initializationError = null;
      console.log('✅ Database initialized successfully');
    } catch (error) {
      this.initializationError = error as Error;
      console.error('❌ Database initialization failed:', error);
      
      // Provide helpful error messages
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          console.error('💡 This might be due to missing Vercel KV configuration');
          console.error('💡 Please ensure KV_REST_API_URL and KV_REST_API_TOKEN are set in Vercel');
        }
      }
    }
  }

  // Get initialization status
  public getInitializationStatus(): { initialized: boolean; error: Error | null } {
    return {
      initialized: this.isInitialized,
      error: this.initializationError
    };
  }

  // Health check with retry mechanism and better error reporting
  async healthCheck(): Promise<{status: 'ok' | 'error', timestamp: string, version?: string, error?: string}> {
    const maxRetries = 3;
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const timestamp = new Date().toISOString();
        const testKey = `${this.prefix}health_check`;
        
        // Write test data
        await kv.set(testKey, { timestamp, version: '1.0.0' }, { ex: 30 });
        
        // Read back test data
        const retrieved = await kv.get(testKey);
        
        if (retrieved) {
          await kv.del(testKey); // Cleanup
          return { 
            status: 'ok', 
            timestamp, 
            version: '1.0.0' 
          };
        } else {
          throw new Error('Health check data not found after write');
        }
      } catch (error) {
        lastError = error;
        console.warn(`Database health check attempt ${attempt}/${maxRetries} failed:`, error);
        
        // Provide specific error information
        if (error instanceof Error) {
          if (error.message.includes('fetch')) {
            console.error('🔥 Database connection failed - this usually means:');
            console.error('   1. Vercel KV is not configured');
            console.error('   2. KV_REST_API_URL and KV_REST_API_TOKEN environment variables are missing');
            console.error('   3. Your Vercel project does not have the KV addon enabled');
          }
        }
        
        if (attempt < maxRetries) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    console.error('🔥 Database health check failed after all retries:', lastError);
    return { 
      status: 'error', 
      timestamp: new Date().toISOString(), 
      error: lastError instanceof Error ? lastError.message : 'Unknown error'
    };
  }

  // Enhanced operation wrapper with retry mechanism and fallback handling
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string,
    maxRetries: number = 2,
    fallbackValue?: T
  ): Promise<T> {
    // If database wasn't initialized properly, provide helpful error
    if (this.initializationError) {
      console.error(`🔥 ${operationName} failed: Database not initialized`, this.initializationError.message);
      
      if (fallbackValue !== undefined) {
        console.warn(`🔶 Using fallback value for ${operationName}`);
        return fallbackValue;
      }
      
      throw new Error(`Database not available: ${this.initializationError.message}`);
    }

    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        console.warn(`${operationName} attempt ${attempt}/${maxRetries} failed:`, error);
        
        // Provide specific guidance for common errors
        if (error instanceof Error) {
          if (error.message.includes('fetch')) {
            console.error(`🔥 ${operationName} failed due to database connection issues`);
            console.error('💡 Please check Vercel KV configuration in your deployment');
          }
        }
        
        if (attempt < maxRetries) {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    console.error(`🔥 ${operationName} failed after ${maxRetries} attempts:`, lastError);
    
    // If a fallback value is provided, use it instead of throwing
    if (fallbackValue !== undefined) {
      console.warn(`🔶 Using fallback value for ${operationName} due to database error`);
      return fallbackValue;
    }
    
    throw new Error(`${operationName} failed: ${lastError instanceof Error ? lastError.message : 'Unknown error'}`);
  }

  // Subject Management with global persistence
  async saveSubject(subject: Subject): Promise<void> {
    return this.executeWithRetry(async () => {
      // Add timestamp for global sync
      const subjectWithTimestamp = {
        ...subject,
        lastSynced: new Date().toISOString()
      };
      
      await kv.set(`${this.prefix}subject:${subject.id}`, subjectWithTimestamp);
      
      // Add to global subjects list
      const subjectIds = await kv.get<string[]>(`${this.prefix}subjects:list`) || [];
      if (!subjectIds.includes(subject.id)) {
        subjectIds.push(subject.id);
        await kv.set(`${this.prefix}subjects:list`, subjectIds);
      }
      
      // Update global sync timestamp
      await kv.set(`${this.prefix}last_update`, new Date().toISOString());
    }, 'saveSubject');
  }

  async getSubject(id: string): Promise<Subject | null> {
    return this.executeWithRetry(async () => {
      return await kv.get<Subject>(`${this.prefix}subject:${id}`);
    }, 'getSubject');
  }

  async getAllSubjects(): Promise<Subject[]> {
    return this.executeWithRetry(async () => {
      const subjectIds = await kv.get<string[]>(`${this.prefix}subjects:list`) || [];
      const subjects: Subject[] = [];
      
      for (const id of subjectIds) {
        const subject = await this.getSubject(id);
        if (subject) {
          subjects.push(subject);
        }
      }
      
      return subjects;
    }, 'getAllSubjects', 2, []); // Provide empty array as fallback
  }

  // Question Management with global persistence
  async saveQuestion(question: Question): Promise<void> {
    return this.executeWithRetry(async () => {
      // Add timestamp for global sync
      const questionWithTimestamp = {
        ...question,
        lastSynced: new Date().toISOString()
      };
      
      await kv.set(`${this.prefix}question:${question.id}`, questionWithTimestamp);
      
      // Add to subject's questions list
      const questionIds = await kv.get<string[]>(`${this.prefix}subject:${question.subjectId}:questions`) || [];
      if (!questionIds.includes(question.id)) {
        questionIds.push(question.id);
        await kv.set(`${this.prefix}subject:${question.subjectId}:questions`, questionIds);
      }
      
      // Add to global questions list
      const allQuestionIds = await kv.get<string[]>(`${this.prefix}questions:list`) || [];
      if (!allQuestionIds.includes(question.id)) {
        allQuestionIds.push(question.id);
        await kv.set(`${this.prefix}questions:list`, allQuestionIds);
      }
      
      // Update global sync timestamp
      await kv.set(`${this.prefix}last_update`, new Date().toISOString());
    }, 'saveQuestion');
  }

  async getQuestion(id: string): Promise<Question | null> {
    return this.executeWithRetry(async () => {
      return await kv.get<Question>(`${this.prefix}question:${id}`);
    }, 'getQuestion');
  }

  async getAllQuestions(): Promise<Question[]> {
    return this.executeWithRetry(async () => {
      const questionIds = await kv.get<string[]>(`${this.prefix}questions:list`) || [];
      const questions: Question[] = [];
      
      for (const id of questionIds) {
        const question = await this.getQuestion(id);
        if (question) {
          questions.push(question);
        }
      }
      
      return questions;
    }, 'getAllQuestions', 2, []); // Provide empty array as fallback
  }

  async getQuestionsBySubject(subjectId: string): Promise<Question[]> {
    return this.executeWithRetry(async () => {
      const questionIds = await kv.get<string[]>(`${this.prefix}subject:${subjectId}:questions`) || [];
      const questions: Question[] = [];
      
      for (const id of questionIds) {
        const question = await this.getQuestion(id);
        if (question) {
          questions.push(question);
        }
      }
      
      return questions;
    }, 'getQuestionsBySubject');
  }

  async deleteQuestion(id: string): Promise<void> {
    return this.executeWithRetry(async () => {
      const question = await this.getQuestion(id);
      if (question) {
        // Remove from subject's questions list
        const questionIds = await kv.get<string[]>(`${this.prefix}subject:${question.subjectId}:questions`) || [];
        const updatedIds = questionIds.filter(qId => qId !== id);
        await kv.set(`${this.prefix}subject:${question.subjectId}:questions`, updatedIds);
        
        // Remove from global questions list
        const allQuestionIds = await kv.get<string[]>(`${this.prefix}questions:list`) || [];
        const updatedAllIds = allQuestionIds.filter(qId => qId !== id);
        await kv.set(`${this.prefix}questions:list`, updatedAllIds);
        
        // Delete the question
        await kv.del(`${this.prefix}question:${id}`);
        
        // Delete associated AI answers and podcasts
        await kv.del(`${this.prefix}ai-answer:${id}`);
        await kv.del(`${this.prefix}podcast:${id}`);
        
        // Update global sync timestamp
        await kv.set(`${this.prefix}last_update`, new Date().toISOString());
      }
    }, 'deleteQuestion');
  }

  // AI Answer Management with global persistence
  async saveAIAnswer(questionId: string, aiAnswer: AIAnswer): Promise<void> {
    return this.executeWithRetry(async () => {
      const aiAnswerWithTimestamp = {
        ...aiAnswer,
        lastSynced: new Date().toISOString()
      };
      
      await kv.set(`${this.prefix}ai-answer:${questionId}`, aiAnswerWithTimestamp);
      
      // Track in global AI answers list for sync
      const aiAnswerIds = await kv.get<string[]>(`${this.prefix}ai-answers:list`) || [];
      if (!aiAnswerIds.includes(questionId)) {
        aiAnswerIds.push(questionId);
        await kv.set(`${this.prefix}ai-answers:list`, aiAnswerIds);
      }
      
      // Update global sync timestamp
      await kv.set(`${this.prefix}last_update`, new Date().toISOString());
    }, 'saveAIAnswer');
  }

  async getAIAnswer(questionId: string): Promise<AIAnswer | null> {
    return this.executeWithRetry(async () => {
      return await kv.get<AIAnswer>(`${this.prefix}ai-answer:${questionId}`);
    }, 'getAIAnswer');
  }

  // Podcast Conversation Management with global persistence
  async savePodcastConversation(questionId: string, podcast: PodcastConversation): Promise<void> {
    return this.executeWithRetry(async () => {
      console.log('DatabaseService.savePodcastConversation: Saving podcast for question:', questionId);
      
      if (!questionId) {
        throw new Error('Question ID is required');
      }
      
      if (!podcast) {
        throw new Error('Podcast conversation data is required');
      }

      const podcastWithTimestamp = {
        ...podcast,
        lastSynced: new Date().toISOString()
      };

      await kv.set(`${this.prefix}podcast:${questionId}`, podcastWithTimestamp);
      
      // Track in global podcasts list for sync
      const podcastIds = await kv.get<string[]>(`${this.prefix}podcasts:list`) || [];
      if (!podcastIds.includes(questionId)) {
        podcastIds.push(questionId);
        await kv.set(`${this.prefix}podcasts:list`, podcastIds);
      }
      
      // Update global sync timestamp
      await kv.set(`${this.prefix}last_update`, new Date().toISOString());
      
      console.log('DatabaseService.savePodcastConversation: Successfully saved with global sync');
    }, 'savePodcastConversation');
  }

  async getPodcastConversation(questionId: string): Promise<PodcastConversation | null> {
    return this.executeWithRetry(async () => {
      console.log('DatabaseService.getPodcastConversation: Fetching podcast for question:', questionId);
      
      if (!questionId) {
        throw new Error('Question ID is required');
      }

      const result = await kv.get<PodcastConversation>(`${this.prefix}podcast:${questionId}`);
      console.log('DatabaseService.getPodcastConversation: Result:', result ? 'Found' : 'Not found');
      return result;
    }, 'getPodcastConversation');
  }

  // User Management with global persistence
  async saveUser(user: User): Promise<void> {
    return this.executeWithRetry(async () => {
      const userWithTimestamp = {
        ...user,
        lastSynced: new Date().toISOString()
      };
      
      await kv.set(`${this.prefix}user:${user.id}`, userWithTimestamp);
      
      // Add to global users list
      const userIds = await kv.get<string[]>(`${this.prefix}users:list`) || [];
      if (!userIds.includes(user.id)) {
        userIds.push(user.id);
        await kv.set(`${this.prefix}users:list`, userIds);
      }
      
      // Update global sync timestamp
      await kv.set(`${this.prefix}last_update`, new Date().toISOString());
    }, 'saveUser');
  }

  async getUser(id: string): Promise<User | null> {
    return this.executeWithRetry(async () => {
      return await kv.get<User>(`${this.prefix}user:${id}`);
    }, 'getUser');
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.executeWithRetry(async () => {
      // Create email->id mapping
      const userId = await kv.get<string>(`${this.prefix}email:${email}`);
      if (userId) {
        return await this.getUser(userId);
      }
      return null;
    }, 'getUserByEmail');
  }

  async createUser(user: User): Promise<void> {
    return this.executeWithRetry(async () => {
      await this.saveUser(user);
      // Create email->id mapping for quick lookup
      await kv.set(`${this.prefix}email:${user.email}`, user.id);
    }, 'createUser');
  }

  // Student Progress Tracking with global persistence
  async saveStudentProgress(userId: string, subjectId: string, progress: StudentProgress): Promise<void> {
    return this.executeWithRetry(async () => {
      const progressWithTimestamp = {
        ...progress,
        lastSynced: new Date().toISOString()
      };
      
      await kv.set(`${this.prefix}progress:${userId}:${subjectId}`, progressWithTimestamp);
      
      // Track in global progress list
      const progressKey = `${userId}:${subjectId}`;
      const progressIds = await kv.get<string[]>(`${this.prefix}progress:list`) || [];
      if (!progressIds.includes(progressKey)) {
        progressIds.push(progressKey);
        await kv.set(`${this.prefix}progress:list`, progressIds);
      }
      
      // Update global sync timestamp
      await kv.set(`${this.prefix}last_update`, new Date().toISOString());
    }, 'saveStudentProgress');
  }

  async getStudentProgress(userId: string, subjectId: string): Promise<StudentProgress | null> {
    return this.executeWithRetry(async () => {
      return await kv.get<StudentProgress>(`${this.prefix}progress:${userId}:${subjectId}`);
    }, 'getStudentProgress');
  }

  async getAllStudentProgress(userId: string): Promise<StudentProgress[]> {
    return this.executeWithRetry(async () => {
      const progressIds = await kv.get<string[]>(`${this.prefix}progress:list`) || [];
      const userProgressIds = progressIds.filter(id => id.startsWith(`${userId}:`));
      const progressList: StudentProgress[] = [];
      
      for (const progressId of userProgressIds) {
        const [, subjectId] = progressId.split(':');
        const progress = await this.getStudentProgress(userId, subjectId);
        if (progress) {
          progressList.push(progress);
        }
      }
      
      return progressList;
    }, 'getAllStudentProgress');
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

  // Global Sync Management for cross-device data consistency
  async getLastSyncTimestamp(): Promise<string | null> {
    return this.executeWithRetry(async () => {
      return await kv.get<string>(`${this.prefix}last_update`);
    }, 'getLastSyncTimestamp');
  }

  async forceFullSync(): Promise<{
    subjects: number;
    questions: number;
    aiAnswers: number;
    podcasts: number;
    users: number;
    progressRecords: number;
    lastSync: string;
  }> {
    return this.executeWithRetry(async () => {
      const [subjects, questionIds, aiAnswerIds, podcastIds, userIds, progressIds] = await Promise.all([
        this.getAllSubjects(),
        kv.get<string[]>(`${this.prefix}questions:list`),
        kv.get<string[]>(`${this.prefix}ai-answers:list`),
        kv.get<string[]>(`${this.prefix}podcasts:list`),
        kv.get<string[]>(`${this.prefix}users:list`),
        kv.get<string[]>(`${this.prefix}progress:list`)
      ]);

      const syncTimestamp = new Date().toISOString();
      await kv.set(`${this.prefix}last_update`, syncTimestamp);

      return {
        subjects: subjects.length,
        questions: (questionIds || []).length,
        aiAnswers: (aiAnswerIds || []).length,
        podcasts: (podcastIds || []).length,
        users: (userIds || []).length,
        progressRecords: (progressIds || []).length,
        lastSync: syncTimestamp
      };
    }, 'forceFullSync');
  }

  async clearAllData(): Promise<void> {
    console.warn('⚠️ Clearing all application data - this cannot be undone!');
    return this.executeWithRetry(async () => {
      // Get all data lists
      const [subjectIds, questionIds, aiAnswerIds, podcastIds, userIds, progressIds] = await Promise.all([
        kv.get<string[]>(`${this.prefix}subjects:list`),
        kv.get<string[]>(`${this.prefix}questions:list`),
        kv.get<string[]>(`${this.prefix}ai-answers:list`),
        kv.get<string[]>(`${this.prefix}podcasts:list`),
        kv.get<string[]>(`${this.prefix}users:list`),
        kv.get<string[]>(`${this.prefix}progress:list`)
      ]);

      // Delete all subjects and their questions
      for (const subjectId of (subjectIds || [])) {
        const subjectQuestionIds = await kv.get<string[]>(`${this.prefix}subject:${subjectId}:questions`) || [];
        
        // Delete all questions for this subject
        for (const questionId of subjectQuestionIds) {
          await kv.del(`${this.prefix}question:${questionId}`);
        }
        
        // Delete subject questions list
        await kv.del(`${this.prefix}subject:${subjectId}:questions`);
        
        // Delete subject
        await kv.del(`${this.prefix}subject:${subjectId}`);
      }

      // Delete all questions
      for (const questionId of (questionIds || [])) {
        await kv.del(`${this.prefix}question:${questionId}`);
      }

      // Delete all AI answers
      for (const questionId of (aiAnswerIds || [])) {
        await kv.del(`${this.prefix}ai-answer:${questionId}`);
      }

      // Delete all podcasts
      for (const questionId of (podcastIds || [])) {
        await kv.del(`${this.prefix}podcast:${questionId}`);
      }

      // Delete all users
      for (const userId of (userIds || [])) {
        await kv.del(`${this.prefix}user:${userId}`);
      }

      // Delete all progress records
      for (const progressId of (progressIds || [])) {
        await kv.del(`${this.prefix}progress:${progressId}`);
      }

      // Delete global lists
      await Promise.all([
        kv.del(`${this.prefix}subjects:list`),
        kv.del(`${this.prefix}questions:list`),
        kv.del(`${this.prefix}ai-answers:list`),
        kv.del(`${this.prefix}podcasts:list`),
        kv.del(`${this.prefix}users:list`),
        kv.del(`${this.prefix}progress:list`),
        kv.del(`${this.prefix}last_update`)
      ]);

      console.log('✅ All application data cleared successfully');
    }, 'clearAllData');
  }

  // Data integrity check
  async verifyDataIntegrity(): Promise<{
    isValid: boolean;
    issues: string[];
    summary: {
      subjects: number;
      questions: number;
      aiAnswers: number;
      podcasts: number;
      users: number;
      progressRecords: number;
    };
  }> {
    return this.executeWithRetry(async () => {
      const issues: string[] = [];
      
      // Check subjects
      const subjectIds = await kv.get<string[]>(`${this.prefix}subjects:list`) || [];
      const actualSubjects = [];
      
      for (const subjectId of subjectIds) {
        const subject = await kv.get(`${this.prefix}subject:${subjectId}`);
        if (!subject) {
          issues.push(`Subject ${subjectId} is listed but not found in database`);
        } else {
          actualSubjects.push(subject);
        }
      }

      // Check questions
      const questionIds = await kv.get<string[]>(`${this.prefix}questions:list`) || [];
      let validQuestions = 0;
      
      for (const questionId of questionIds) {
        const question = await kv.get(`${this.prefix}question:${questionId}`);
        if (!question) {
          issues.push(`Question ${questionId} is listed but not found in database`);
        } else {
          validQuestions++;
        }
      }

      // Check subject-question relationships
      for (const subjectId of subjectIds) {
        const subjectQuestionIds = await kv.get<string[]>(`${this.prefix}subject:${subjectId}:questions`) || [];
        
        for (const questionId of subjectQuestionIds) {
          const question = await kv.get(`${this.prefix}question:${questionId}`);
          if (!question) {
            issues.push(`Question ${questionId} is linked to subject ${subjectId} but not found in database`);
          } else if (!questionIds.includes(questionId)) {
            issues.push(`Question ${questionId} exists but is not in global questions list`);
          }
        }
      }

      // Check AI answers
      const aiAnswerIds = await kv.get<string[]>(`${this.prefix}ai-answers:list`) || [];
      for (const questionId of aiAnswerIds) {
        const aiAnswer = await kv.get(`${this.prefix}ai-answer:${questionId}`);
        if (!aiAnswer) {
          issues.push(`AI Answer for question ${questionId} is listed but not found in database`);
        }
      }

      // Check podcasts
      const podcastIds = await kv.get<string[]>(`${this.prefix}podcasts:list`) || [];
      for (const questionId of podcastIds) {
        const podcast = await kv.get(`${this.prefix}podcast:${questionId}`);
        if (!podcast) {
          issues.push(`Podcast for question ${questionId} is listed but not found in database`);
        }
      }

      // Check users
      const userIds = await kv.get<string[]>(`${this.prefix}users:list`) || [];
      for (const userId of userIds) {
        const user = await kv.get(`${this.prefix}user:${userId}`);
        if (!user) {
          issues.push(`User ${userId} is listed but not found in database`);
        }
      }

      // Check progress records
      const progressIds = await kv.get<string[]>(`${this.prefix}progress:list`) || [];
      for (const progressId of progressIds) {
        const progress = await kv.get(`${this.prefix}progress:${progressId}`);
        if (!progress) {
          issues.push(`Progress record ${progressId} is listed but not found in database`);
        }
      }

      return {
        isValid: issues.length === 0,
        issues,
        summary: {
          subjects: actualSubjects.length,
          questions: validQuestions,
          aiAnswers: aiAnswerIds.length,
          podcasts: podcastIds.length,
          users: userIds.length,
          progressRecords: progressIds.length
        }
      };
    }, 'verifyDataIntegrity');
  }

  // Global State Management for cross-device consistency
  async getGlobalState(): Promise<{
    lastSync: string | null;
    dataVersion: string;
    totalRecords: {
      subjects: number;
      questions: number;
      aiAnswers: number;
      podcasts: number;
      users: number;
      progressRecords: number;
    };
  }> {
    return this.executeWithRetry(async () => {
      const [lastSync, subjectIds, questionIds, aiAnswerIds, podcastIds, userIds, progressIds] = await Promise.all([
        this.getLastSyncTimestamp(),
        kv.get<string[]>(`${this.prefix}subjects:list`),
        kv.get<string[]>(`${this.prefix}questions:list`),
        kv.get<string[]>(`${this.prefix}ai-answers:list`),
        kv.get<string[]>(`${this.prefix}podcasts:list`),
        kv.get<string[]>(`${this.prefix}users:list`),
        kv.get<string[]>(`${this.prefix}progress:list`)
      ]);

      return {
        lastSync,
        dataVersion: '2.0.0', // Increment when data structure changes
        totalRecords: {
          subjects: (subjectIds || []).length,
          questions: (questionIds || []).length,
          aiAnswers: (aiAnswerIds || []).length,
          podcasts: (podcastIds || []).length,
          users: (userIds || []).length,
          progressRecords: (progressIds || []).length
        }
      };
    }, 'getGlobalState');
  }

  // Ensure global lists are initialized
  async initializeGlobalLists(): Promise<void> {
    return this.executeWithRetry(async () => {
      const lists = [
        `${this.prefix}subjects:list`,
        `${this.prefix}questions:list`,
        `${this.prefix}ai-answers:list`,
        `${this.prefix}podcasts:list`,
        `${this.prefix}users:list`,
        `${this.prefix}progress:list`
      ];

      for (const listKey of lists) {
        const existingList = await kv.get<string[]>(listKey);
        if (!existingList) {
          await kv.set(listKey, []);
        }
      }

      // Set initial sync timestamp if not exists
      const lastSync = await this.getLastSyncTimestamp();
      if (!lastSync) {
        await kv.set(`${this.prefix}last_update`, new Date().toISOString());
      }
    }, 'initializeGlobalLists');
  }

  // Rebuild global lists from existing data (data recovery)
  async rebuildGlobalLists(): Promise<{
    rebuilt: {
      subjects: number;
      questions: number;
      aiAnswers: number;
      podcasts: number;
      users: number;
      progressRecords: number;
    };
    errors: string[];
  }> {
    return this.executeWithRetry(async () => {
      const errors: string[] = [];
      const rebuilt = {
        subjects: 0,
        questions: 0,
        aiAnswers: 0,
        podcasts: 0,
        users: 0,
        progressRecords: 0
      };

      try {
        // This would require scanning all keys - implementation depends on your KV provider
        // For now, we'll just initialize empty lists
        await this.initializeGlobalLists();
        console.log('✅ Global lists initialized (rebuild from scan not implemented)');
      } catch (error) {
        errors.push(`Failed to rebuild global lists: ${error}`);
      }

      return { rebuilt, errors };
    }, 'rebuildGlobalLists');
  }

  // Export all data for backup/migration
  async exportAllData(): Promise<{
    subjects: any[];
    questions: any[];
    aiAnswers: any[];
    podcasts: any[];
    users: any[];
    progressRecords: any[];
    metadata: {
      exportDate: string;
      dataVersion: string;
      totalRecords: number;
    };
  }> {
    return this.executeWithRetry(async () => {
      const [subjectIds, questionIds, aiAnswerIds, podcastIds, userIds, progressIds] = await Promise.all([
        kv.get<string[]>(`${this.prefix}subjects:list`),
        kv.get<string[]>(`${this.prefix}questions:list`),
        kv.get<string[]>(`${this.prefix}ai-answers:list`),
        kv.get<string[]>(`${this.prefix}podcasts:list`),
        kv.get<string[]>(`${this.prefix}users:list`),
        kv.get<string[]>(`${this.prefix}progress:list`)
      ]);

      // Fetch all subjects
      const subjects = [];
      for (const subjectId of (subjectIds || [])) {
        const subject = await kv.get(`${this.prefix}subject:${subjectId}`);
        if (subject) subjects.push(subject);
      }

      // Fetch all questions
      const questions = [];
      for (const questionId of (questionIds || [])) {
        const question = await kv.get(`${this.prefix}question:${questionId}`);
        if (question) questions.push(question);
      }

      // Fetch all AI answers
      const aiAnswers = [];
      for (const questionId of (aiAnswerIds || [])) {
        const aiAnswer = await kv.get(`${this.prefix}ai-answer:${questionId}`);
        if (aiAnswer) aiAnswers.push(aiAnswer);
      }

      // Fetch all podcasts
      const podcasts = [];
      for (const questionId of (podcastIds || [])) {
        const podcast = await kv.get(`${this.prefix}podcast:${questionId}`);
        if (podcast) podcasts.push(podcast);
      }

      // Fetch all users
      const users = [];
      for (const userId of (userIds || [])) {
        const user = await kv.get(`${this.prefix}user:${userId}`);
        if (user) users.push(user);
      }

      // Fetch all progress records
      const progressRecords = [];
      for (const progressId of (progressIds || [])) {
        const progress = await kv.get(`${this.prefix}progress:${progressId}`);
        if (progress) progressRecords.push(progress);
      }

      const totalRecords = subjects.length + questions.length + aiAnswers.length + 
                          podcasts.length + users.length + progressRecords.length;

      return {
        subjects,
        questions,
        aiAnswers,
        podcasts,
        users,
        progressRecords,
        metadata: {
          exportDate: new Date().toISOString(),
          dataVersion: '2.0.0',
          totalRecords
        }
      };
    }, 'exportAllData');
  }

  // ...existing code...
}

export default DatabaseService;
