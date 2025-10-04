// Quick test script to validate podcast generation
const { AIAnswerService } = require('./dist/services/AIAnswerService.js');

// Mock AI answer for testing
const mockAnswer = {
  id: 'test-answer-1',
  questionId: 'test-question-1',
  marks: 15,
  answerType: 'detailed-essay',
  content: 'This is a test answer content for Social Studies.',
  paragraphs: [
    'Introduction: This topic is important for understanding Ghanaian society.',
    'Historical Context: Ghana has a rich history that influences this topic.',
    'Social Implications: The topic affects various communities.',
    'Economic Factors: Economic development is connected to this topic.',
    'Political Aspects: Government policies play a role.',
    'Conclusion: Understanding this topic is crucial for national development.'
  ],
  keyPoints: [
    'Historical significance',
    'Social impact',
    'Economic relevance',
    'Political implications'
  ],
  conclusion: 'Understanding this topic is crucial for national development.',
  createdAt: new Date().toISOString(),
  generatedBy: 'ai'
};

const testQuestion = 'Explain the role of traditional authorities in modern Ghana.';

async function testPodcastGeneration() {
  try {
    console.log('Testing podcast generation...');
    
    const aiService = AIAnswerService.getInstance();
    const conversation = await aiService.generatePodcastConversation(mockAnswer, testQuestion);
    
    console.log('✅ Podcast generation successful!');
    console.log('Title:', conversation.title);
    console.log('Number of dialogues:', conversation.dialogues.length);
    console.log('First dialogue:', conversation.dialogues[0]);
    console.log('Last dialogue:', conversation.dialogues[conversation.dialogues.length - 1]);
    
  } catch (error) {
    console.error('❌ Podcast generation failed:', error);
  }
}

testPodcastGeneration();
