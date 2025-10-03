// Production data for BECE 2026 Platform
// This file contains the official BECE subjects and topics structure
import type { Subject, Topic, Question, PredictedTopic } from './types';

export const beceSubjects: Subject[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Core Mathematics covering algebra, geometry, statistics, and arithmetic',
    topics: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'english',
    name: 'English Language',
    description: 'English language skills including grammar, comprehension, and composition',
    topics: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'science',
    name: 'Science',
    description: 'General science covering physics, chemistry, and biology concepts',
    topics: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'social-studies',
    name: 'Social Studies',
    description: 'Social studies covering history, geography, government, and economics',
    topics: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rme',
    name: 'Religious and Moral Education',
    description: 'Religious and moral education covering various faiths and ethics',
    topics: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'french',
    name: 'French',
    description: 'French language learning including grammar, vocabulary, and conversation',
    topics: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'computing',
    name: 'Computing',
    description: 'Computer studies including basic programming, internet, and digital literacy',
    topics: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'career-tech',
    name: 'Career Technology',
    description: 'Career and technology education including woodwork, metalwork, and technical drawing',
    topics: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'economics',
    name: 'Economics',
    description: 'Basic economic principles, money, banking, and trade',
    topics: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'creative-arts',
    name: 'Creative Arts and Design',
    description: 'Visual arts, music, dance, and creative design principles',
    topics: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const sampleTopics: Topic[] = [
  // Mathematics Topics
  { id: 'math-1', subjectId: 'mathematics', name: 'Number Operations', description: 'Basic arithmetic operations and number systems', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'math-2', subjectId: 'mathematics', name: 'Algebra', description: 'Algebraic expressions, equations, and inequalities', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'math-3', subjectId: 'mathematics', name: 'Geometry', description: 'Shapes, angles, area, and volume calculations', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  
  // English Topics
  { id: 'eng-1', subjectId: 'english', name: 'Grammar', description: 'Parts of speech, tenses, and sentence structure', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'eng-2', subjectId: 'english', name: 'Comprehension', description: 'Reading comprehension and passage analysis', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  
  // Science Topics
  { id: 'sci-1', subjectId: 'science', name: 'Matter and Energy', description: 'Properties of matter and forms of energy', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'sci-2', subjectId: 'science', name: 'Living Systems', description: 'Plants, animals, and human body systems', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

export const sampleQuestions: Question[] = [
  // Mathematics Questions
  {
    id: 'q-math-1',
    subjectId: 'mathematics',
    topicId: 'math-1',
    question: 'What is 25% of 80?',
    type: 'multiple-choice',
    options: ['15', '20', '25', '30'],
    correctAnswer: '20',
    explanation: '25% of 80 = (25/100) × 80 = 0.25 × 80 = 20',
    solution: 'To find 25% of 80:\nStep 1: Convert percentage to decimal: 25% = 25/100 = 0.25\nStep 2: Multiply: 0.25 × 80 = 20\nTherefore, 25% of 80 is 20.',
    difficulty: 'easy',
    points: 2,
    isPredicted: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'q-math-2',
    subjectId: 'mathematics',
    topicId: 'math-2',
    question: 'Solve for x: 2x + 5 = 13',
    type: 'multiple-choice',
    options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
    correctAnswer: 'x = 4',
    explanation: 'Subtract 5 from both sides, then divide by 2',
    solution: 'To solve 2x + 5 = 13:\nStep 1: Subtract 5 from both sides: 2x + 5 - 5 = 13 - 5\nStep 2: Simplify: 2x = 8\nStep 3: Divide both sides by 2: x = 8/2 = 4\nTherefore, x = 4.',
    difficulty: 'medium',
    points: 3,
    isPredicted: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // English Questions
  {
    id: 'q-eng-1',
    subjectId: 'english',
    topicId: 'eng-1',
    question: 'Choose the correct form: "She _____ to school every day."',
    type: 'multiple-choice',
    options: ['go', 'goes', 'going', 'went'],
    correctAnswer: 'goes',
    explanation: 'Third person singular present tense requires "goes"',
    solution: 'For third person singular subjects (she, he, it) in present tense, we add -s or -es to the verb. "She goes to school every day" is correct.',
    difficulty: 'easy',
    points: 2,
    isPredicted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // Science Questions
  {
    id: 'q-sci-1',
    subjectId: 'science',
    topicId: 'sci-1',
    question: 'What are the three states of matter?',
    type: 'multiple-choice',
    options: ['Solid, Liquid, Gas', 'Hot, Cold, Warm', 'Big, Medium, Small', 'Fast, Medium, Slow'],
    correctAnswer: 'Solid, Liquid, Gas',
    explanation: 'Matter exists in three primary states: solid, liquid, and gas',
    solution: 'The three states of matter are:\n1. Solid - particles are tightly packed\n2. Liquid - particles are loosely packed\n3. Gas - particles are spread far apart\nThese states depend on temperature and pressure conditions.',
    difficulty: 'easy',
    points: 2,
    isPredicted: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const samplePredictedTopics: PredictedTopic[] = [
  {
    id: 'pred-1',
    subjectId: 'mathematics',
    topicId: 'math-1',
    probability: 85,
    reasoning: 'Number operations frequently appear in BECE mathematics papers',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'pred-2',
    subjectId: 'mathematics',
    topicId: 'math-2',
    probability: 78,
    reasoning: 'Algebra is a core component of BECE mathematics curriculum',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'pred-3',
    subjectId: 'english',
    topicId: 'eng-1',
    probability: 90,
    reasoning: 'Grammar questions are essential in BECE English language papers',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'pred-4',
    subjectId: 'science',
    topicId: 'sci-1',
    probability: 75,
    reasoning: 'Matter and energy concepts are fundamental in science education',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];
