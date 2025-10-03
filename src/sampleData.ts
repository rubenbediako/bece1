// Production data for BECE 2026 Platform
// This file contains the official BECE subjects structure for production use
import type { Subject, Topic, Question, PredictedTopic } from './types';

// Official BECE subjects based on Ghana Education Service curriculum
export const beceSubjects: Subject[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Core Mathematics covering algebra, geometry, statistics, and arithmetic',
    topics: [],
    sections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'english',
    name: 'English Language',
    description: 'English language skills including grammar, comprehension, and composition',
    topics: [],
    sections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'science',
    name: 'Science',
    description: 'General science covering physics, chemistry, and biology concepts',
    topics: [],
    sections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'social-studies',
    name: 'Social Studies',
    description: 'Social studies covering history, geography, government, and economics',
    topics: [],
    sections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rme',
    name: 'Religious and Moral Education',
    description: 'Religious and moral education covering various faiths and ethics',
    topics: [],
    sections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'french',
    name: 'French',
    description: 'French language learning including grammar, vocabulary, and conversation',
    topics: [],
    sections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'computing',
    name: 'Computing',
    description: 'Computer studies including basic programming, internet, and digital literacy',
    topics: [],
    sections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'career-tech',
    name: 'Career Technology',
    description: 'Career and technology education including woodwork, metalwork, and technical drawing',
    topics: [],
    sections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'economics',
    name: 'Economics',
    description: 'Basic economic principles, money, banking, and trade',
    topics: [],
    sections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'creative-arts',
    name: 'Creative Arts and Design',
    description: 'Visual arts, music, dance, and creative design principles',
    topics: [],
    sections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Production topics - to be populated by admin through the management interface
export const beceTopics: Topic[] = [];

// Production questions - to be added by admin through the question manager
export const beceQuestions: Question[] = [];

// Active predictions - managed by admin through the prediction manager
export const activePredictions: PredictedTopic[] = [];
