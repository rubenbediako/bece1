// Test script for Audio Solution Service
// This script can be run in the browser console to test the audio explanation functionality

import AudioSolutionService from '../src/services/AudioSolutionService.js';

// Mock question data for testing
const mockQuestion = {
  id: 'test-question-1',
  topicId: 'social-studies-topic-1',
  subjectId: 'social-studies',
  question: 'Explain the major causes and effects of climate change on Ghana\'s agricultural sector. Discuss three adaptation strategies that can be implemented.',
  type: 'essay',
  marks: 15,
  difficulty: 'medium',
  points: 15,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  correctAnswer: 'Sample answer about climate change impacts on Ghana\'s agriculture...'
};

// Mock AI Answer data
const mockAIAnswer = {
  id: 'ai-answer-1',
  questionId: 'test-question-1',
  marks: 15,
  answerType: 'detailed-essay',
  content: 'Climate change significantly impacts Ghana\'s agricultural sector through various interconnected mechanisms...',
  paragraphs: [
    'Introduction: Climate change represents one of the most significant challenges facing Ghana\'s agricultural sector in the 21st century.',
    'The first major cause of climate change affecting agriculture is irregular rainfall patterns, leading to droughts and flooding.',
    'Temperature increases constitute another critical factor, affecting crop yields and livestock productivity.',
    'Deforestation and land degradation compound these problems by reducing soil fertility and water retention.',
    'Adaptation strategies include drought-resistant crop varieties, improved irrigation systems, and sustainable farming practices.',
    'Conclusion: Implementing these adaptation strategies requires coordinated efforts from government, farmers, and international organizations.'
  ],
  keyPoints: [
    'Irregular rainfall patterns cause crop failures',
    'Rising temperatures reduce agricultural productivity',
    'Drought-resistant varieties can improve resilience',
    'Sustainable farming practices are essential for long-term adaptation'
  ],
  conclusion: 'Climate change adaptation in Ghana\'s agriculture requires immediate action and sustained commitment.',
  createdAt: new Date().toISOString(),
  generatedBy: 'ai'
};

// Test function
async function testAudioExplanation() {
  console.log('🎧 Testing Audio Solution Service...');
  
  try {
    // Initialize the service
    const audioService = AudioSolutionService.getInstance();
    console.log('✅ Audio service initialized');
    
    // Check available voices
    const voices = audioService.getAvailableVoices();
    console.log(`🔊 Available voices: ${voices.length}`);
    voices.forEach(voice => {
      console.log(`  - ${voice.name} (${voice.lang}) ${voice.default ? '[Default]' : ''}`);
    });
    
    // Test different configurations
    const configs = [
      {
        style: 'teacher',
        voice: { rate: 0.8, pitch: 1.0, volume: 0.9, language: 'en-US' },
        duration: 'medium'
      },
      {
        style: 'conversational',
        voice: { rate: 0.9, pitch: 1.1, volume: 0.8, language: 'en-US' },
        duration: 'detailed'
      },
      {
        style: 'expert',
        voice: { rate: 0.7, pitch: 0.9, volume: 0.9, language: 'en-US' },
        duration: 'detailed'
      }
    ];
    
    for (let i = 0; i < configs.length; i++) {
      const config = configs[i];
      console.log(`\n🎯 Testing configuration ${i + 1}: ${config.style} style`);
      
      // Generate audio explanation
      const audioExplanation = await audioService.generateAudioExplanation(
        mockQuestion,
        mockAIAnswer,
        config
      );
      
      console.log(`✅ Generated audio explanation: ${audioExplanation.title}`);
      console.log(`📊 Sections: ${audioExplanation.sections.length}`);
      console.log(`⏱️  Total duration: ${audioExplanation.totalDuration} seconds`);
      console.log(`📝 Transcript length: ${audioExplanation.transcript.length} characters`);
      
      // Log section details
      audioExplanation.sections.forEach((section, index) => {
        console.log(`  📑 Section ${index + 1}: ${section.title} (${section.duration}s)`);
      });
      
      // Test playback (short preview)
      console.log(`🔊 Testing audio playback for ${config.style} style...`);
      
      if (confirm(`Play audio explanation with ${config.style} style? (Duration: ${Math.round(audioExplanation.totalDuration / 60)} minutes)`)) {
        await audioService.playAudioExplanation(
          audioExplanation,
          (sectionIndex, isPlaying) => {
            if (isPlaying) {
              console.log(`🎵 Playing section ${sectionIndex + 1}: ${audioExplanation.sections[sectionIndex].title}`);
            } else {
              console.log(`⏹️  Finished section ${sectionIndex + 1}`);
            }
          },
          () => {
            console.log(`✅ Completed audio explanation with ${config.style} style`);
          }
        );
      }
    }
    
    console.log('\n🎉 Audio explanation testing completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing audio explanation:', error);
  }
}

// Export for manual testing
window.testAudioExplanation = testAudioExplanation;
window.AudioSolutionService = AudioSolutionService;

console.log('🎧 Audio Solution Test Script Loaded!');
console.log('Run testAudioExplanation() to start testing');
console.log('Available test functions:');
console.log('  - testAudioExplanation(): Complete test of audio explanation functionality');
console.log('  - AudioSolutionService.getInstance(): Get service instance for manual testing');
