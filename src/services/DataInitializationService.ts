import { DatabaseService } from './DatabaseService';
import type { Subject } from '../types';

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

  // Initialize app with basic structure only (no demo data)
  async initializeAppData(): Promise<void> {
    if (this.isInitialized) {
      console.log('📱 App data already initialized');
      return;
    }

    try {
      console.log('🚀 Initializing basic app structure...');
      
      // Check if data already exists
      const existingSubjects = await this.db.getAllSubjects();
      if (existingSubjects.length > 0) {
        console.log('✅ Found existing data, skipping initialization');
        this.isInitialized = true;
        return;
      }

      // Initialize only the basic subject structure (no demo questions)
      await this.initializeBasicSubjects();
      
      console.log('✅ Basic app structure initialized - ready for content creation');
      this.isInitialized = true;
      
    } catch (error) {
      console.error('❌ Failed to initialize app structure:', error);
      throw error;
    }
  }

  private async initializeBasicSubjects(): Promise<void> {
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
      },
      {
        id: 'ghanaian-language',
        name: 'Ghanaian Language',
        description: 'Local language studies and cultural communication',
        color: '#795548',
        topics: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'french',
        name: 'French',
        description: 'French language learning and communication',
        color: '#607D8B',
        topics: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    for (const subject of subjects) {
      await this.db.saveSubject(subject);
    }

    console.log(`✅ Initialized ${subjects.length} basic subjects (no demo content)`);
  }

  // Reset all data (for admin use)
  async resetAllData(): Promise<void> {
    try {
      console.log('🔄 Resetting all app data...');
      await this.db.clearAllData();
      this.isInitialized = false;
      await this.initializeAppData();
      console.log('✅ All data reset and reinitialized');
    } catch (error) {
      console.error('❌ Failed to reset data:', error);
      throw error;
    }
  }

  // Get initialization status
  getInitializationStatus(): boolean {
    return this.isInitialized;
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
