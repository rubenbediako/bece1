import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import FirebaseService from '../services/FirebaseService';
import type { Subject, Question, Topic, PredictedTopic } from '../types';

interface FirebaseGlobalStateData {
  subjects: Subject[];
  topics: Topic[];
  questions: Question[];
  predictions: PredictedTopic[];
  lastSync: string | null;
  isOnline: boolean;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
}

interface FirebaseGlobalStateActions {
  refreshData: () => Promise<void>;
  forceSync: () => Promise<void>;
  clearCache: () => Promise<void>;
  
  // Subject operations
  createSubject: (subject: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateSubject: (id: string, updates: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  
  // Topic operations
  createTopic: (topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateTopic: (id: string, updates: Partial<Topic>) => Promise<void>;
  deleteTopic: (id: string) => Promise<void>;
  
  // Question operations
  createQuestion: (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateQuestion: (id: string, updates: Partial<Question>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  
  // Prediction operations
  createPrediction: (prediction: Omit<PredictedTopic, 'id' | 'createdAt'>) => Promise<string>;
  updatePrediction: (id: string, updates: Partial<PredictedTopic>) => Promise<void>;
  deletePrediction: (id: string) => Promise<void>;
}

interface FirebaseGlobalStateContextType extends FirebaseGlobalStateData, FirebaseGlobalStateActions {
  loading: boolean;
  error: string | null;
}

const FirebaseGlobalStateContext = createContext<FirebaseGlobalStateContextType | undefined>(undefined);

interface FirebaseGlobalStateProviderProps {
  children: React.ReactNode;
}

export const FirebaseGlobalStateProvider: React.FC<FirebaseGlobalStateProviderProps> = ({ children }) => {
  const [state, setState] = useState<FirebaseGlobalStateData>({
    subjects: [],
    topics: [],
    questions: [],
    predictions: [],
    lastSync: null,
    isOnline: navigator.onLine,
    syncStatus: 'idle'
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Network status
  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initial data fetch
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setState(prev => ({ ...prev, syncStatus: 'syncing' }));
      setError(null);

      const [subjects, topics, questions, predictions] = await Promise.all([
        FirebaseService.getSubjects(),
        FirebaseService.getTopics(),
        FirebaseService.getQuestions(),
        FirebaseService.getPredictions()
      ]);

      setState(prev => ({
        ...prev,
        subjects,
        topics,
        questions,
        predictions,
        lastSync: new Date().toISOString(),
        syncStatus: 'success'
      }));
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
      setState(prev => ({ ...prev, syncStatus: 'error' }));
    } finally {
      setLoading(false);
    }
  }, []);

  const forceSync = useCallback(async () => {
    await refreshData();
  }, [refreshData]);

  const clearCache = useCallback(async () => {
    setState(prev => ({
      ...prev,
      subjects: [],
      topics: [],
      questions: [],
      predictions: [],
      lastSync: null
    }));
  }, []);

  // Subject operations
  const createSubject = useCallback(async (subject: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await FirebaseService.createSubject(subject);
      await refreshData(); // Refresh to get the new subject
      return id;
    } catch (error) {
      console.error('Error creating subject:', error);
      throw error;
    }
  }, [refreshData]);

  const updateSubject = useCallback(async (id: string, updates: Partial<Subject>) => {
    try {
      await FirebaseService.updateSubject(id, updates);
      await refreshData();
    } catch (error) {
      console.error('Error updating subject:', error);
      throw error;
    }
  }, [refreshData]);

  const deleteSubject = useCallback(async (id: string) => {
    try {
      await FirebaseService.deleteSubject(id);
      await refreshData();
    } catch (error) {
      console.error('Error deleting subject:', error);
      throw error;
    }
  }, [refreshData]);

  // Topic operations
  const createTopic = useCallback(async (topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await FirebaseService.createTopic(topic);
      await refreshData();
      return id;
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    }
  }, [refreshData]);

  const updateTopic = useCallback(async (id: string, updates: Partial<Topic>) => {
    try {
      await FirebaseService.updateTopic(id, updates);
      await refreshData();
    } catch (error) {
      console.error('Error updating topic:', error);
      throw error;
    }
  }, [refreshData]);

  const deleteTopic = useCallback(async (id: string) => {
    try {
      await FirebaseService.deleteTopic(id);
      await refreshData();
    } catch (error) {
      console.error('Error deleting topic:', error);
      throw error;
    }
  }, [refreshData]);

  // Question operations
  const createQuestion = useCallback(async (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await FirebaseService.createQuestion(question);
      await refreshData();
      return id;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }, [refreshData]);

  const updateQuestion = useCallback(async (id: string, updates: Partial<Question>) => {
    try {
      await FirebaseService.updateQuestion(id, updates);
      await refreshData();
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  }, [refreshData]);

  const deleteQuestion = useCallback(async (id: string) => {
    try {
      await FirebaseService.deleteQuestion(id);
      await refreshData();
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  }, [refreshData]);

  // Prediction operations
  const createPrediction = useCallback(async (prediction: Omit<PredictedTopic, 'id' | 'createdAt'>) => {
    try {
      const id = await FirebaseService.createPrediction(prediction);
      await refreshData();
      return id;
    } catch (error) {
      console.error('Error creating prediction:', error);
      throw error;
    }
  }, [refreshData]);

  const updatePrediction = useCallback(async (id: string, updates: Partial<PredictedTopic>) => {
    try {
      await FirebaseService.updatePrediction(id, updates);
      await refreshData();
    } catch (error) {
      console.error('Error updating prediction:', error);
      throw error;
    }
  }, [refreshData]);

  const deletePrediction = useCallback(async (id: string) => {
    try {
      await FirebaseService.deletePrediction(id);
      await refreshData();
    } catch (error) {
      console.error('Error deleting prediction:', error);
      throw error;
    }
  }, [refreshData]);

  const value: FirebaseGlobalStateContextType = {
    ...state,
    loading,
    error,
    refreshData,
    forceSync,
    clearCache,
    createSubject,
    updateSubject,
    deleteSubject,
    createTopic,
    updateTopic,
    deleteTopic,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    createPrediction,
    updatePrediction,
    deletePrediction
  };

  return (
    <FirebaseGlobalStateContext.Provider value={value}>
      {children}
    </FirebaseGlobalStateContext.Provider>
  );
};

export const useFirebaseGlobalState = (): FirebaseGlobalStateContextType => {
  const context = useContext(FirebaseGlobalStateContext);
  if (context === undefined) {
    throw new Error('useFirebaseGlobalState must be used within a FirebaseGlobalStateProvider');
  }
  return context;
};
