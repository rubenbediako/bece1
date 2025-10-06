import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Subject, Topic, Question, User, PredictedTopic } from '../types';

class FirebaseService {
  // Collections
  private readonly COLLECTIONS = {
    SUBJECTS: 'subjects',
    TOPICS: 'topics',
    QUESTIONS: 'questions',
    USERS: 'users',
    PREDICTIONS: 'predictions',
    SESSIONS: 'sessions',
    ANALYTICS: 'analytics'
  };

  // Helper method to convert Firebase timestamps
  private convertTimestamp(data: any) {
    if (data.createdAt && data.createdAt.toDate) {
      data.createdAt = data.createdAt.toDate().toISOString();
    }
    if (data.updatedAt && data.updatedAt.toDate) {
      data.updatedAt = data.updatedAt.toDate().toISOString();
    }
    return data;
  }

  // SUBJECTS
  async getSubjects(): Promise<Subject[]> {
    try {
      const snapshot = await getDocs(collection(db, this.COLLECTIONS.SUBJECTS));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...this.convertTimestamp(doc.data())
      })) as Subject[];
    } catch (error) {
      console.error('Error fetching subjects:', error);
      throw error;
    }
  }

  async createSubject(subject: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTIONS.SUBJECTS), {
        ...subject,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating subject:', error);
      throw error;
    }
  }

  async updateSubject(id: string, updates: Partial<Subject>): Promise<void> {
    try {
      await updateDoc(doc(db, this.COLLECTIONS.SUBJECTS, id), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating subject:', error);
      throw error;
    }
  }

  async deleteSubject(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COLLECTIONS.SUBJECTS, id));
    } catch (error) {
      console.error('Error deleting subject:', error);
      throw error;
    }
  }

  // TOPICS
  async getTopics(): Promise<Topic[]> {
    try {
      const snapshot = await getDocs(collection(db, this.COLLECTIONS.TOPICS));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...this.convertTimestamp(doc.data())
      })) as Topic[];
    } catch (error) {
      console.error('Error fetching topics:', error);
      throw error;
    }
  }

  async getTopicsBySubject(subjectId: string): Promise<Topic[]> {
    try {
      const q = query(
        collection(db, this.COLLECTIONS.TOPICS),
        where('subjectId', '==', subjectId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...this.convertTimestamp(doc.data())
      })) as Topic[];
    } catch (error) {
      console.error('Error fetching topics by subject:', error);
      throw error;
    }
  }

  async createTopic(topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTIONS.TOPICS), {
        ...topic,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    }
  }

  async updateTopic(id: string, updates: Partial<Topic>): Promise<void> {
    try {
      await updateDoc(doc(db, this.COLLECTIONS.TOPICS, id), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating topic:', error);
      throw error;
    }
  }

  async deleteTopic(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COLLECTIONS.TOPICS, id));
    } catch (error) {
      console.error('Error deleting topic:', error);
      throw error;
    }
  }

  // QUESTIONS
  async getQuestions(): Promise<Question[]> {
    try {
      const snapshot = await getDocs(collection(db, this.COLLECTIONS.QUESTIONS));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...this.convertTimestamp(doc.data())
      })) as Question[];
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }

  async getQuestionsByTopic(topicId: string): Promise<Question[]> {
    try {
      const q = query(
        collection(db, this.COLLECTIONS.QUESTIONS),
        where('topicId', '==', topicId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...this.convertTimestamp(doc.data())
      })) as Question[];
    } catch (error) {
      console.error('Error fetching questions by topic:', error);
      throw error;
    }
  }

  async createQuestion(question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTIONS.QUESTIONS), {
        ...question,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }

  async updateQuestion(id: string, updates: Partial<Question>): Promise<void> {
    try {
      await updateDoc(doc(db, this.COLLECTIONS.QUESTIONS, id), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  }

  async deleteQuestion(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COLLECTIONS.QUESTIONS, id));
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  }

  // PREDICTIONS
  async getPredictions(): Promise<PredictedTopic[]> {
    try {
      const snapshot = await getDocs(collection(db, this.COLLECTIONS.PREDICTIONS));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...this.convertTimestamp(doc.data())
      })) as PredictedTopic[];
    } catch (error) {
      console.error('Error fetching predictions:', error);
      throw error;
    }
  }

  async createPrediction(prediction: Omit<PredictedTopic, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTIONS.PREDICTIONS), {
        ...prediction,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating prediction:', error);
      throw error;
    }
  }

  async updatePrediction(id: string, updates: Partial<PredictedTopic>): Promise<void> {
    try {
      await updateDoc(doc(db, this.COLLECTIONS.PREDICTIONS, id), updates);
    } catch (error) {
      console.error('Error updating prediction:', error);
      throw error;
    }
  }

  async deletePrediction(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COLLECTIONS.PREDICTIONS, id));
    } catch (error) {
      console.error('Error deleting prediction:', error);
      throw error;
    }
  }

  // USERS
  async getUsers(): Promise<User[]> {
    try {
      const snapshot = await getDocs(collection(db, this.COLLECTIONS.USERS));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...this.convertTimestamp(doc.data())
      })) as User[];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const docSnap = await getDoc(doc(db, this.COLLECTIONS.USERS, id));
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...this.convertTimestamp(docSnap.data())
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTIONS.USERS), {
        ...user,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<void> {
    try {
      await updateDoc(doc(db, this.COLLECTIONS.USERS, id), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // BATCH OPERATIONS
  async bulkCreateSubjects(subjects: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<string[]> {
    try {
      const batch = writeBatch(db);
      const ids: string[] = [];

      subjects.forEach(subject => {
        const docRef = doc(collection(db, this.COLLECTIONS.SUBJECTS));
        ids.push(docRef.id);
        batch.set(docRef, {
          ...subject,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      await batch.commit();
      return ids;
    } catch (error) {
      console.error('Error bulk creating subjects:', error);
      throw error;
    }
  }

  // REAL-TIME LISTENERS
  onSubjectsChange(callback: (subjects: Subject[]) => void) {
    return onSnapshot(collection(db, this.COLLECTIONS.SUBJECTS), (snapshot) => {
      const subjects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...this.convertTimestamp(doc.data())
      })) as Subject[];
      callback(subjects);
    });
  }

  onQuestionsChange(callback: (questions: Question[]) => void) {
    return onSnapshot(collection(db, this.COLLECTIONS.QUESTIONS), (snapshot) => {
      const questions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...this.convertTimestamp(doc.data())
      })) as Question[];
      callback(questions);
    });
  }

  // ANALYTICS
  async logEvent(event: string, data: any): Promise<void> {
    try {
      await addDoc(collection(db, this.COLLECTIONS.ANALYTICS), {
        event,
        data,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    } catch (error) {
      console.error('Error logging event:', error);
    }
  }

  // DATA SEEDING
  async seedInitialData(): Promise<void> {
    try {
      // Check if data already exists
      const subjectsSnapshot = await getDocs(collection(db, this.COLLECTIONS.SUBJECTS));
      if (!subjectsSnapshot.empty) {
        console.log('Initial data already exists');
        return;
      }

      // Seed subjects
      const subjects = [
        {
          name: 'Mathematics',
          description: 'Core mathematical concepts for BECE',
          topics: [],
          color: '#2563eb'
        },
        {
          name: 'English Language',
          description: 'Language arts and literature',
          topics: [],
          color: '#7c3aed'
        },
        {
          name: 'Integrated Science',
          description: 'Basic science concepts',
          topics: [],
          color: '#059669'
        },
        {
          name: 'Social Studies',
          description: 'History, geography, and civics',
          topics: [],
          color: '#dc2626'
        }
      ];

      const batch = writeBatch(db);
      subjects.forEach(subject => {
        const docRef = doc(collection(db, this.COLLECTIONS.SUBJECTS));
        batch.set(docRef, {
          ...subject,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      await batch.commit();
      console.log('Initial data seeded successfully');
    } catch (error) {
      console.error('Error seeding initial data:', error);
      throw error;
    }
  }
}

export default new FirebaseService();
