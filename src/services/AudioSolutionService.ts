import type { Question, AIAnswer, PodcastConversation } from '../types';

export interface AudioSolutionConfig {
  voice: {
    rate: number;
    pitch: number;
    volume: number;
    language: string;
  };
  style: 'teacher' | 'student' | 'expert' | 'conversational';
  includeIntroduction: boolean;
  includeStepByStep: boolean;
  includeConclusion: boolean;
  duration: 'short' | 'medium' | 'detailed';
}

export interface AudioExplanation {
  id: string;
  questionId: string;
  title: string;
  sections: AudioSection[];
  totalDuration: number;
  transcript: string;
  audioUrl?: string;
  createdAt: string;
  config: AudioSolutionConfig;
}

export interface AudioSection {
  id: string;
  title: string;
  content: string;
  duration: number;
  voiceConfig: {
    rate: number;
    pitch: number;
    volume: number;
    voice?: string;
  };
  order: number;
}

export class AudioSolutionService {
  private static instance: AudioSolutionService;
  private speechSynthesis: SpeechSynthesis | null = null;
  private availableVoices: SpeechSynthesisVoice[] = [];

  public static getInstance(): AudioSolutionService {
    if (!AudioSolutionService.instance) {
      AudioSolutionService.instance = new AudioSolutionService();
    }
    return AudioSolutionService.instance;
  }

  constructor() {
    this.initializeSpeechSynthesis();
  }

  private initializeSpeechSynthesis(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis;
      this.loadVoices();
      
      // Listen for voices loaded event
      this.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  private loadVoices(): void {
    if (this.speechSynthesis) {
      this.availableVoices = this.speechSynthesis.getVoices();
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.availableVoices;
  }

  public async generateAudioExplanation(
    question: Question,
    aiAnswer?: AIAnswer,
    config: Partial<AudioSolutionConfig> = {}
  ): Promise<AudioExplanation> {
    const fullConfig: AudioSolutionConfig = {
      voice: {
        rate: 0.85,
        pitch: 1.0,
        volume: 0.9,
        language: 'en-US'
      },
      style: 'teacher',
      includeIntroduction: true,
      includeStepByStep: true,
      includeConclusion: true,
      duration: 'medium',
      ...config
    };

    const sections = await this.createAudioSections(question, aiAnswer, fullConfig);
    const transcript = this.generateFullTranscript(sections);
    const totalDuration = sections.reduce((sum, section) => sum + section.duration, 0);

    const audioExplanation: AudioExplanation = {
      id: this.generateId(),
      questionId: question.id,
      title: `Audio Explanation: ${this.extractQuestionTitle(question.question)}`,
      sections,
      totalDuration,
      transcript,
      createdAt: new Date().toISOString(),
      config: fullConfig
    };

    return audioExplanation;
  }

  private async createAudioSections(
    question: Question,
    aiAnswer?: AIAnswer,
    config: AudioSolutionConfig
  ): Promise<AudioSection[]> {
    const sections: AudioSection[] = [];
    let order = 0;

    // Introduction Section
    if (config.includeIntroduction) {
      const introContent = this.generateIntroductionContent(question, config.style);
      sections.push({
        id: this.generateId(),
        title: 'Introduction',
        content: introContent,
        duration: this.estimateAudioDuration(introContent),
        voiceConfig: this.getVoiceConfigForSection('introduction', config),
        order: order++
      });
    }

    // Question Analysis Section
    const analysisContent = this.generateQuestionAnalysis(question);
    sections.push({
      id: this.generateId(),
      title: 'Question Analysis',
      content: analysisContent,
      duration: this.estimateAudioDuration(analysisContent),
      voiceConfig: this.getVoiceConfigForSection('analysis', config),
      order: order++
    });

    // Solution Steps Section
    if (config.includeStepByStep && aiAnswer) {
      const stepsContent = this.generateStepByStepExplanation(aiAnswer, config.style);
      sections.push({
        id: this.generateId(),
        title: 'Step-by-Step Solution',
        content: stepsContent,
        duration: this.estimateAudioDuration(stepsContent),
        voiceConfig: this.getVoiceConfigForSection('solution', config),
        order: order++
      });
    }

    // Key Points Section
    if (aiAnswer && aiAnswer.keyPoints.length > 0) {
      const keyPointsContent = this.generateKeyPointsExplanation(aiAnswer.keyPoints, config.style);
      sections.push({
        id: this.generateId(),
        title: 'Key Points',
        content: keyPointsContent,
        duration: this.estimateAudioDuration(keyPointsContent),
        voiceConfig: this.getVoiceConfigForSection('keypoints', config),
        order: order++
      });
    }

    // Conclusion Section
    if (config.includeConclusion) {
      const conclusionContent = this.generateConclusionContent(question, aiAnswer, config.style);
      sections.push({
        id: this.generateId(),
        title: 'Conclusion',
        content: conclusionContent,
        duration: this.estimateAudioDuration(conclusionContent),
        voiceConfig: this.getVoiceConfigForSection('conclusion', config),
        order: order++
      });
    }

    return sections;
  }

  private generateIntroductionContent(question: Question, style: string): string {
    const questionType = question.type;
    const marks = question.marks || question.points || 1;
    
    switch (style) {
      case 'teacher':
        return `Welcome, students! Today we're going to work through this ${questionType} question together. This question is worth ${marks} marks, so let's make sure we understand exactly what's being asked and how to approach it systematically.`;
      
      case 'expert':
        return `Let's examine this ${questionType} question carefully. With ${marks} marks allocated, this requires a comprehensive response that demonstrates deep understanding of the key concepts involved.`;
      
      case 'conversational':
        return `Hey there! Let's break down this question step by step. It's a ${marks}-mark ${questionType} question, so we'll need to cover all the important points to get full credit.`;
      
      default:
        return `Let's analyze this ${questionType} question worth ${marks} marks and develop a complete solution together.`;
    }
  }

  private generateQuestionAnalysis(question: Question): string {
    const analysis = [];
    
    // Identify key command words
    const commandWords = this.identifyCommandWords(question.question);
    if (commandWords.length > 0) {
      analysis.push(`The key command words in this question are: ${commandWords.join(', ')}. These tell us exactly what type of response is expected.`);
    }

    // Break down the question components
    if (question.question.includes('?')) {
      const parts = question.question.split('?').filter(part => part.trim());
      if (parts.length > 1) {
        analysis.push(`This question has multiple parts that we need to address: ${parts.map((part, i) => `Part ${i + 1} asks about ${part.trim()}`).join('. ')}.`);
      }
    }

    // Mention marking scheme implications
    const marks = question.marks || question.points || 1;
    if (marks >= 10) {
      analysis.push(`With ${marks} marks available, this requires a detailed essay-style response with clear structure, examples, and thorough explanation.`);
    } else if (marks >= 5) {
      analysis.push(`This ${marks}-mark question needs a structured response with clear points and supporting details.`);
    } else {
      analysis.push(`For ${marks} marks, we need concise but complete answers that directly address the question.`);
    }

    return analysis.join(' ');
  }

  private generateStepByStepExplanation(aiAnswer: AIAnswer, style: string): string {
    const steps = [];
    
    if (aiAnswer.paragraphs && aiAnswer.paragraphs.length > 0) {
      steps.push("Let me walk you through the solution step by step:");
      
      aiAnswer.paragraphs.forEach((paragraph, index) => {
        const stepNumber = index + 1;
        const cleanParagraph = paragraph.replace(/^\d+\.\s*/, '').trim();
        
        switch (style) {
          case 'teacher':
            steps.push(`Step ${stepNumber}: ${cleanParagraph} This point is important because it directly addresses part of what the question is asking for.`);
            break;
          case 'conversational':
            steps.push(`So, step ${stepNumber} - ${cleanParagraph} Make sense? Let's continue.`);
            break;
          default:
            steps.push(`Step ${stepNumber}: ${cleanParagraph}`);
        }
      });
    }

    return steps.join(' ');
  }

  private generateKeyPointsExplanation(keyPoints: string[], style: string): string {
    const explanation = [];
    
    switch (style) {
      case 'teacher':
        explanation.push("Now, let's highlight the key points you must remember for questions like this:");
        break;
      case 'conversational':
        explanation.push("Here are the main takeaways from this solution:");
        break;
      default:
        explanation.push("The key points to remember are:");
    }

    keyPoints.forEach((point, index) => {
      explanation.push(`Key point ${index + 1}: ${point}`);
    });

    return explanation.join(' ');
  }

  private generateConclusionContent(question: Question, aiAnswer?: AIAnswer, style: string): string {
    const marks = question.marks || question.points || 1;
    
    switch (style) {
      case 'teacher':
        return `Excellent! We've worked through this ${marks}-mark question systematically. Remember, the key to success in BECE is understanding what each question is asking for and structuring your response accordingly. Practice similar questions to build your confidence.`;
      
      case 'conversational':
        return `And that's how we tackle this type of question! The main thing is to stay organized and make sure you're answering exactly what's being asked. Keep practicing, and you'll get the hang of it!`;
      
      default:
        return `This completes our solution to this ${marks}-mark question. The systematic approach we used here can be applied to similar questions in your BECE examination.`;
    }
  }

  private identifyCommandWords(questionText: string): string[] {
    const commandWords = [
      'explain', 'describe', 'analyze', 'compare', 'contrast', 'evaluate', 
      'discuss', 'examine', 'outline', 'state', 'list', 'identify', 
      'define', 'give', 'mention', 'name', 'write'
    ];
    
    const lowerQuestion = questionText.toLowerCase();
    return commandWords.filter(word => lowerQuestion.includes(word));
  }

  private getVoiceConfigForSection(sectionType: string, config: AudioSolutionConfig) {
    const baseConfig = config.voice;
    
    switch (sectionType) {
      case 'introduction':
        return {
          ...baseConfig,
          rate: baseConfig.rate * 0.9, // Slower for introduction
          pitch: baseConfig.pitch * 1.1 // Slightly higher pitch for welcoming tone
        };
      
      case 'analysis':
        return {
          ...baseConfig,
          rate: baseConfig.rate * 0.85, // Slower for analysis
          pitch: baseConfig.pitch // Normal pitch for serious analysis
        };
      
      case 'solution':
        return {
          ...baseConfig,
          rate: baseConfig.rate, // Normal speed for main content
          pitch: baseConfig.pitch
        };
      
      case 'conclusion':
        return {
          ...baseConfig,
          rate: baseConfig.rate * 0.9, // Slower for conclusion
          pitch: baseConfig.pitch * 1.05 // Slightly higher for positive ending
        };
      
      default:
        return baseConfig;
    }
  }

  private estimateAudioDuration(text: string): number {
    // Estimate duration based on text length and average speaking speed
    // Average speaking speed: ~150 words per minute
    const words = text.split(/\s+/).length;
    const wordsPerMinute = 140; // Slightly slower for educational content
    return Math.ceil((words / wordsPerMinute) * 60); // Return duration in seconds
  }

  private generateFullTranscript(sections: AudioSection[]): string {
    return sections
      .sort((a, b) => a.order - b.order)
      .map(section => `[${section.title}]\n${section.content}`)
      .join('\n\n');
  }

  public async playAudioExplanation(
    audioExplanation: AudioExplanation,
    onProgress?: (sectionIndex: number, isPlaying: boolean) => void,
    onComplete?: () => void
  ): Promise<void> {
    if (!this.speechSynthesis) {
      throw new Error('Speech synthesis not available');
    }

    return new Promise<void>((resolve, reject) => {
      let currentSectionIndex = 0;
      const sections = audioExplanation.sections.sort((a, b) => a.order - b.order);

      const playNextSection = () => {
        if (currentSectionIndex >= sections.length) {
          onComplete?.();
          resolve();
          return;
        }

        const section = sections[currentSectionIndex];
        onProgress?.(currentSectionIndex, true);

        const utterance = new SpeechSynthesisUtterance(section.content);
        
        // Apply voice configuration
        utterance.rate = section.voiceConfig.rate;
        utterance.pitch = section.voiceConfig.pitch;
        utterance.volume = section.voiceConfig.volume;

        // Try to set appropriate voice
        const voice = this.selectBestVoice(audioExplanation.config.voice.language);
        if (voice) {
          utterance.voice = voice;
        }

        utterance.onend = () => {
          onProgress?.(currentSectionIndex, false);
          currentSectionIndex++;
          // Small pause between sections
          setTimeout(playNextSection, 800);
        };

        utterance.onerror = (error) => {
          reject(new Error(`Speech synthesis error: ${error.error}`));
        };

        this.speechSynthesis!.speak(utterance);
      };

      playNextSection();
    });
  }

  private selectBestVoice(language: string): SpeechSynthesisVoice | null {
    if (this.availableVoices.length === 0) {
      return null;
    }

    // Try to find voice matching the language
    let voice = this.availableVoices.find(v => v.lang.startsWith(language));
    
    // If no exact match, try to find English voice
    if (!voice) {
      voice = this.availableVoices.find(v => v.lang.startsWith('en'));
    }

    // If still no match, use default voice
    if (!voice) {
      voice = this.availableVoices[0];
    }

    return voice;
  }

  public stopAudio(): void {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private extractQuestionTitle(questionText: string): string {
    // Extract first few words as title, remove question marks
    const words = questionText.replace(/[?!.]/g, '').split(' ').slice(0, 6);
    return words.join(' ') + (questionText.length > words.join(' ').length ? '...' : '');
  }
}

export default AudioSolutionService;
