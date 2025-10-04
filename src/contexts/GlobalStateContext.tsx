import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import DatabaseService from '../services/DatabaseService';
import type { Subject, Question, User } from '../types';

interface GlobalStateData {
  subjects: Subject[];
  questions: Question[];
  users: User[];
  currentUser: User | null;
  lastSync: string | null;
  isOnline: boolean;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
}

interface GlobalStateActions {
  refreshData: () => Promise<void>;
  forceSync: () => Promise<any>;
  getGlobalState: () => Promise<any>;
  clearCache: () => Promise<void>;
  exportData: () => Promise<any>;
  verifyDataIntegrity: () => Promise<any>;
}

interface GlobalStateContextType extends GlobalStateData, GlobalStateActions {
  loading: boolean;
  error: string | null;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};

interface GlobalStateProviderProps {
  children: React.ReactNode;
}

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({ children }) => {
  const [data, setData] = useState<GlobalStateData>({
    subjects: [],
    questions: [],
    users: [],
    currentUser: null,
    lastSync: null,
    isOnline: navigator.onLine,
    syncStatus: 'idle'
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const dbService = DatabaseService.getInstance();

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setData(prev => ({ ...prev, isOnline: true }));
      // Auto-sync when coming back online
      forceSync();
    };
    
    const handleOffline = () => {
      setData(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Refresh all data from global database
  const refreshData = useCallback(async () => {
    try {
      setError(null);
      setData(prev => ({ ...prev, syncStatus: 'syncing' }));

      // Get all global data
      const [subjects, questions, globalState] = await Promise.all([
        dbService.getAllSubjects(),
        dbService.getAllQuestions(),
        dbService.getGlobalState()
      ]);

      setData(prev => ({
        ...prev,
        subjects,
        questions,
        lastSync: globalState.lastSync,
        syncStatus: 'success'
      }));

      console.log('✅ Global data refreshed successfully');
    } catch (err) {
      console.error('❌ Failed to refresh global data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
      setData(prev => ({ ...prev, syncStatus: 'error' }));
    }
  }, [dbService]);

  // Force full synchronization
  const forceSync = useCallback(async () => {
    try {
      setError(null);
      setData(prev => ({ ...prev, syncStatus: 'syncing' }));

      // Initialize global lists
      await dbService.initializeGlobalLists();
      
      // Force full sync
      const syncResult = await dbService.forceFullSync();
      
      // Refresh local data
      await refreshData();

      console.log('✅ Force sync completed:', syncResult);
      setData(prev => ({ ...prev, syncStatus: 'success' }));
      
      return syncResult;
    } catch (err) {
      console.error('❌ Force sync failed:', err);
      setError(err instanceof Error ? err.message : 'Sync failed');
      setData(prev => ({ ...prev, syncStatus: 'error' }));
      throw err;
    }
  }, [dbService, refreshData]);

  // Get global state information
  const getGlobalState = useCallback(async () => {
    try {
      return await dbService.getGlobalState();
    } catch (err) {
      console.error('Failed to get global state:', err);
      throw err;
    }
  }, [dbService]);

  // Clear cache and force refresh
  const clearCache = useCallback(async () => {
    try {
      setError(null);
      setData(prev => ({ ...prev, syncStatus: 'syncing' }));
      
      // Clear cache (if implemented)
      await dbService.clearCache();
      
      // Refresh data
      await refreshData();
      
      console.log('✅ Cache cleared and data refreshed');
    } catch (err) {
      console.error('❌ Failed to clear cache:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear cache');
      setData(prev => ({ ...prev, syncStatus: 'error' }));
    }
  }, [dbService, refreshData]);

  // Export all data
  const exportData = useCallback(async () => {
    try {
      return await dbService.exportAllData();
    } catch (err) {
      console.error('Failed to export data:', err);
      throw err;
    }
  }, [dbService]);

  // Verify data integrity
  const verifyDataIntegrity = useCallback(async () => {
    try {
      return await dbService.verifyDataIntegrity();
    } catch (err) {
      console.error('Failed to verify data integrity:', err);
      throw err;
    }
  }, [dbService]);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check database health
        const healthCheck = await dbService.healthCheck();
        if (healthCheck.status === 'error') {
          throw new Error('Database is not accessible');
        }

        // Initialize global lists if needed
        await dbService.initializeGlobalLists();

        // Initialize default app data if this is the first time
        const DataInitializationService = (await import('../services/DataInitializationService')).DataInitializationService;
        const dataInit = DataInitializationService.getInstance();
        await dataInit.initializeAppData();

        // Load initial data
        await refreshData();

        console.log('✅ Global state initialized successfully');
      } catch (err) {
        console.error('❌ Failed to initialize global state:', err);
        setError(err instanceof Error ? err.message : 'Initialization failed');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [dbService, refreshData]);

  // Periodic sync every 30 seconds when online
  useEffect(() => {
    if (!data.isOnline) return;

    const interval = setInterval(async () => {
      try {
        const currentState = await dbService.getGlobalState();
        
        // Only refresh if data has been updated by another device/session
        if (currentState.lastSync && currentState.lastSync !== data.lastSync) {
          console.log('🔄 Detected remote changes, refreshing local data...');
          await refreshData();
        }
      } catch (err) {
        console.warn('Periodic sync check failed:', err);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [data.isOnline, data.lastSync, dbService, refreshData]);

  const value: GlobalStateContextType = {
    ...data,
    loading,
    error,
    refreshData,
    forceSync,
    getGlobalState,
    clearCache,
    exportData,
    verifyDataIntegrity
  };

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateProvider;
