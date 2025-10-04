import { useState, useEffect, useCallback } from 'react';
import { subjectAPI, questionAPI, aiAnswerAPI, podcastAPI } from '../api/database';
import type { Subject, Question, AIAnswer, PodcastConversation } from '../types';

// Hook for managing subjects
export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await subjectAPI.getAll();
      setSubjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subjects');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSubject = useCallback(async (subject: Subject) => {
    try {
      await subjectAPI.save(subject);
      await loadSubjects(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save subject');
      throw err;
    }
  }, [loadSubjects]);

  useEffect(() => {
    void loadSubjects();
  }, [loadSubjects]);

  return {
    subjects,
    loading,
    error,
    loadSubjects,
    saveSubject
  };
};

// Hook for managing questions by subject
export const useQuestions = (subjectId: string) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = useCallback(async () => {
    if (!subjectId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await questionAPI.getBySubject(subjectId);
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  const saveQuestion = useCallback(async (question: Question) => {
    try {
      await questionAPI.save(question);
      await loadQuestions(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save question');
      throw err;
    }
  }, [loadQuestions]);

  const deleteQuestion = useCallback(async (questionId: string) => {
    try {
      await questionAPI.delete(questionId);
      await loadQuestions(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete question');
      throw err;
    }
  }, [loadQuestions]);

  useEffect(() => {
    void loadQuestions();
  }, [loadQuestions]);

  return {
    questions,
    loading,
    error,
    loadQuestions,
    saveQuestion,
    deleteQuestion
  };
};

// Hook for managing AI answers
export const useAIAnswer = (questionId: string) => {
  const [aiAnswer, setAiAnswer] = useState<AIAnswer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAIAnswer = useCallback(async () => {
    if (!questionId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await aiAnswerAPI.get(questionId);
      setAiAnswer(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load AI answer');
    } finally {
      setLoading(false);
    }
  }, [questionId]);

  const saveAIAnswer = useCallback(async (answer: AIAnswer) => {
    try {
      setLoading(true);
      await aiAnswerAPI.save(questionId, answer);
      setAiAnswer(answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save AI answer');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [questionId]);

  useEffect(() => {
    void loadAIAnswer();
  }, [loadAIAnswer]);

  return {
    aiAnswer,
    loading,
    error,
    loadAIAnswer,
    saveAIAnswer
  };
};

// Hook for managing podcast conversations
export const usePodcastConversation = (questionId: string) => {
  const [podcast, setPodcast] = useState<PodcastConversation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPodcast = useCallback(async () => {
    if (!questionId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await podcastAPI.get(questionId);
      setPodcast(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load podcast');
    } finally {
      setLoading(false);
    }
  }, [questionId]);

  const savePodcast = useCallback(async (conversation: PodcastConversation) => {
    try {
      setLoading(true);
      await podcastAPI.save(questionId, conversation);
      setPodcast(conversation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save podcast');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [questionId]);

  useEffect(() => {
    void loadPodcast();
  }, [loadPodcast]);

  return {
    podcast,
    loading,
    error,
    loadPodcast,
    savePodcast
  };
};

// Hook for database health check
export const useDatabaseHealth = () => {
  const [status, setStatus] = useState<'ok' | 'error' | 'checking'>('checking');
  const [lastCheck, setLastCheck] = useState<string>('');

  const checkHealth = useCallback(async () => {
    try {
      const { status: dbStatus, timestamp } = await fetch('/api/health').then(res => res.json());
      setStatus(dbStatus);
      setLastCheck(timestamp);
    } catch {
      setStatus('error');
      setLastCheck(new Date().toISOString());
    }
  }, []);

  useEffect(() => {
    void checkHealth();
    // Check health every 5 minutes
    const interval = setInterval(checkHealth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return {
    status,
    lastCheck,
    checkHealth
  };
};
