import type { AIAnswer, AIAnswerRequest, AnswerTemplate, PodcastConversation, PodcastDialogue } from '../types';

export class AIAnswerService {
  private static instance: AIAnswerService;
  
  // Default podcast characters
  private readonly characters = {
    student: {
      name: 'Serwaa',
      role: 'student' as const,
      gender: 'female' as const,
      voice: 'female-ghana'
    },
    teacher: {
      name: 'Das',
      role: 'teacher' as const,
      gender: 'male' as const,
      voice: 'male-ghana'
    }
  };

  // Subject-specific answer templates
  private readonly answerTemplates: AnswerTemplate[] = [
    {
      subject: 'social-studies',
      marksRange: { min: 12, max: 20 },
      structure: {
        introduction: true,
        bodyParagraphs: 6,
        conclusion: true,
        examples: true,
        references: true
      },
      guidelines: [
        'Provide historical context and background',
        'Include specific examples and case studies',
        'Analyze causes and effects',
        'Discuss social, economic, and political implications',
        'Reference Ghana\'s national development',
        'Conclude with contemporary relevance'
      ]
    },
    {
      subject: 'rme',
      marksRange: { min: 12, max: 20 },
      structure: {
        introduction: true,
        bodyParagraphs: 6,
        conclusion: true,
        examples: true,
        references: true
      },
      guidelines: [
        'Begin with spiritual/moral foundation',
        'Reference religious texts and teachings',
        'Provide moral examples and stories',
        'Discuss practical applications in daily life',
        'Include interfaith perspectives where relevant',
        'Emphasize character development and values'
      ]
    },
    {
      subject: 'english',
      marksRange: { min: 12, max: 20 },
      structure: {
        introduction: true,
        bodyParagraphs: 6,
        conclusion: true,
        examples: true,
        references: true
      },
      guidelines: [
        'Use sophisticated vocabulary and varied sentence structures',
        'Provide literary analysis with textual evidence',
        'Include relevant quotations and references',
        'Demonstrate critical thinking and interpretation',
        'Connect themes to broader human experiences',
        'Maintain formal academic writing style'
      ]
    }
  ];

  public static getInstance(): AIAnswerService {
    if (!AIAnswerService.instance) {
      AIAnswerService.instance = new AIAnswerService();
    }
    return AIAnswerService.instance;
  }

  // Generate detailed AI answer based on marks and subject
  async generateAnswer(request: AIAnswerRequest): Promise<AIAnswer> {
    const template = this.getTemplate(request.subject, request.marks);
    const answerType = this.determineAnswerType(request.marks);
    
    let content = '';
    let paragraphs: string[] = [];
    let keyPoints: string[] = [];

    if (request.marks >= 12) {
      // Generate full 6-paragraph essay (Introduction + 4 body paragraphs + Conclusion)
      content = await this.generateSixParagraphEssay(request, template);
      paragraphs = this.extractParagraphs(content);
      keyPoints = this.extractKeyPoints(content);
    } else if (request.marks >= 4) {
      // Generate full sentences answer
      content = await this.generateFullSentencesAnswer(request, template);
      paragraphs = this.extractParagraphs(content);
      keyPoints = this.extractKeyPoints(content);
    } else {
      // Generate basic complete sentences
      content = await this.generateBasicAnswer(request);
      paragraphs = [content];
      keyPoints = [content];
    }

    return {
      id: this.generateId(),
      questionId: request.question,
      marks: request.marks,
      answerType,
      content,
      paragraphs,
      keyPoints,
      conclusion: paragraphs[paragraphs.length - 1],
      createdAt: new Date().toISOString(),
      generatedBy: 'ai'
    };
  }

  // Generate podcast conversation from answer
  async generatePodcastConversation(answer: AIAnswer, questionText: string): Promise<PodcastConversation> {
    const dialogues = await this.createDialogues(answer, questionText);
    const transcript = this.generateTranscript(dialogues);

    return {
      id: this.generateId(),
      questionId: answer.questionId,
      answerId: answer.id,
      title: `Discussion: ${this.extractTitle(questionText)}`,
      dialogues,
      characters: this.characters,
      transcript,
      createdAt: new Date().toISOString(),
      status: 'ready'
    };
  }

  private getTemplate(subject: string, marks: number): AnswerTemplate {
    return this.answerTemplates.find(t => 
      t.subject === subject && 
      marks >= t.marksRange.min && 
      marks <= t.marksRange.max
    ) || this.answerTemplates[0];
  }

  private determineAnswerType(marks: number): 'detailed-essay' | 'complete-sentences' | 'structured-response' {
    if (marks >= 12) return 'detailed-essay';
    if (marks >= 4) return 'structured-response';
    return 'complete-sentences';
  }

  private async generateSixParagraphEssay(request: AIAnswerRequest, template: AnswerTemplate): Promise<string> {
    // AI essay generation based on subject
    switch (request.subject) {
      case 'social-studies':
        return this.generateSocialStudiesEssay(request, template);
      case 'rme':
        return this.generateRMEEssay(request, template);
      case 'english':
        return this.generateEnglishEssay(request, template);
      default:
        return this.generateGenericEssay(request, template);
    }
  }

  private generateSocialStudiesEssay(request: AIAnswerRequest, _template: AnswerTemplate): string {
    const topic = request.question;
    
    return `**Introduction**
The study of ${topic} represents a fundamental aspect of Ghana's social and historical development. Understanding this topic requires examining its historical context, contemporary relevance, and impact on Ghanaian society. This essay will explore the key dimensions of ${topic}, analyzing its significance within the broader framework of social studies education and national development.

**Historical Context and Background**
Throughout Ghana's history, ${topic} has played a crucial role in shaping our national identity and social structures. From pre-colonial times through independence and into the modern era, this aspect of our society has evolved significantly. The traditional systems and customs that governed our ancestors provide important insights into how ${topic} has been understood and practiced over generations.

**Social and Economic Implications**
The social implications of ${topic} extend far beyond individual communities to impact the entire nation. Economically, this topic influences various sectors including agriculture, trade, and industry. The interconnected nature of social and economic factors means that changes in one area inevitably affect others, creating ripple effects throughout Ghanaian society.

**Political and Governance Aspects**
From a political perspective, ${topic} intersects with governance structures at local, regional, and national levels. The role of traditional authorities, government policies, and democratic institutions all contribute to how this topic is addressed in contemporary Ghana. Understanding these political dimensions is essential for comprehensive analysis.

**Contemporary Challenges and Opportunities**
In modern Ghana, ${topic} presents both challenges and opportunities for national development. Current initiatives and policies aimed at addressing related issues demonstrate the government's commitment to progress. However, ongoing challenges require innovative solutions and sustained effort from all sectors of society.

**Regional and Global Perspectives**
Ghana's position within West Africa and the global community adds important dimensions to understanding ${topic}. Regional cooperation through ECOWAS and international partnerships influence how Ghana addresses related issues. Learning from experiences of other nations while maintaining our unique cultural identity remains a delicate balance.

**Conclusion**
In conclusion, ${topic} represents a complex and multifaceted aspect of Ghanaian society that requires careful study and understanding. The historical foundations, contemporary challenges, and future opportunities all contribute to its significance in social studies education. As Ghana continues to develop and modernize, maintaining awareness of these issues while working toward positive change remains essential for all citizens. The lessons learned from studying ${topic} will undoubtedly contribute to building a stronger, more unified, and prosperous Ghana for future generations.`;
  }

  private generateRMEEssay(request: AIAnswerRequest, _template: AnswerTemplate): string {
    const topic = request.question;
    
    return `**Introduction**
Religious and Moral Education plays a vital role in character formation and spiritual development. The topic of ${topic} holds particular significance in understanding the moral and ethical foundations that guide human behavior. This essay examines the religious, moral, and practical dimensions of this topic, drawing from various faith traditions and moral teachings that shape our understanding of right and wrong.

**Religious Foundations and Teachings**
The major world religions—Christianity, Islam, and traditional African religions—all provide valuable insights into ${topic}. Sacred texts and religious teachings offer guidance on how believers should approach this aspect of life. The Bible, Quran, and traditional oral teachings contain wisdom that has guided generations in making moral decisions related to this topic.

**Moral Principles and Values**
Central to understanding ${topic} are the universal moral principles that transcend religious boundaries. Values such as honesty, compassion, justice, and respect for human dignity form the foundation for ethical behavior. These principles provide a framework for evaluating actions and decisions related to the topic under consideration.

**Practical Applications in Daily Life**
The practical application of religious and moral teachings in everyday situations demonstrates the relevance of ${topic} to modern life. Whether in family relationships, community interactions, or professional settings, the principles learned through RME guide individuals in making decisions that reflect their values and beliefs.

**Character Development and Personal Growth**
Studying ${topic} contributes significantly to character development and personal growth. The process of examining moral dilemmas and ethical questions helps individuals develop critical thinking skills and moral reasoning abilities. This personal development benefits not only the individual but also the broader community.

**Interfaith Understanding and Tolerance**
In Ghana's diverse religious landscape, understanding different perspectives on ${topic} promotes interfaith dialogue and mutual respect. Learning about how different faith traditions approach moral and ethical questions builds bridges between communities and strengthens social cohesion.

**Conclusion**
The study of ${topic} through Religious and Moral Education provides essential foundation for ethical living and spiritual growth. The combination of religious teachings, moral principles, and practical applications creates a comprehensive framework for understanding this important aspect of human experience. As individuals and communities continue to face moral challenges, the wisdom gained from RME studies serves as a valuable guide for making decisions that reflect the highest values and principles. Through continued study and reflection on these topics, we can build stronger moral foundations for ourselves and future generations.`;
  }

  private generateEnglishEssay(request: AIAnswerRequest, _template: AnswerTemplate): string {
    const topic = request.question;
    
    return `**Introduction**
The English language serves as both a tool for communication and a gateway to understanding literature, culture, and human expression. The examination of ${topic} within the context of English Language studies reveals the intricate relationship between language, thought, and meaning. This comprehensive analysis explores the literary, linguistic, and cultural dimensions of this topic, demonstrating its significance in the broader study of English as a subject.

**Literary Analysis and Interpretation**
Literary works provide rich contexts for exploring ${topic}, offering readers opportunities to examine human experiences through the lens of creative expression. Authors employ various literary devices—symbolism, metaphor, characterization, and narrative structure—to convey complex ideas and emotions. The analysis of how different writers approach this topic reveals the versatility and power of language as an artistic medium.

**Language Structure and Communication**
The linguistic aspects of ${topic} demonstrate the sophisticated nature of English as a communication system. Grammar, syntax, vocabulary, and style all contribute to how meaning is constructed and conveyed. Understanding these elements enhances our ability to express ideas clearly and persuasively, whether in written or spoken form.

**Cultural and Historical Context**
English literature and language carry the weight of cultural and historical significance, reflecting the experiences of diverse societies across different time periods. The treatment of ${topic} in various cultural contexts reveals how language evolves and adapts to express changing social values and perspectives.

**Critical Thinking and Analysis**
The study of ${topic} in English Language education develops critical thinking skills essential for academic success and lifelong learning. Students learn to analyze texts, evaluate arguments, construct coherent responses, and engage with complex ideas. These analytical skills transfer to other subjects and real-world situations.

**Creative Expression and Personal Voice**
English Language studies encourage students to develop their own voice and style while exploring ${topic}. Through creative writing, discussion, and analysis, students learn to express their thoughts and feelings effectively. This personal engagement with language and literature fosters intellectual growth and emotional intelligence.

**Conclusion**
The comprehensive study of ${topic} within English Language education demonstrates the subject's multifaceted nature and enduring relevance. Through literary analysis, linguistic exploration, and creative expression, students develop both technical skills and cultural understanding. The ability to think critically, communicate effectively, and appreciate the richness of human expression remains invaluable in an increasingly connected world. As students continue their journey in English Language studies, the insights gained from examining topics like this will serve as foundation stones for continued intellectual and personal development.`;
  }

  private generateGenericEssay(request: AIAnswerRequest, _template: AnswerTemplate): string {
    const topic = request.question;
    
    return `**Introduction**
${topic} represents an important area of study that requires careful examination and analysis. This essay provides a comprehensive exploration of the key aspects, implications, and significance of this topic.

**Key Concepts and Definitions**
Understanding the fundamental concepts related to ${topic} is essential for meaningful analysis. The various terms and ideas associated with this area of study provide the foundation for deeper exploration.

**Analysis and Discussion**
The main body of analysis reveals the complexity and multifaceted nature of ${topic}. Various perspectives and approaches contribute to a comprehensive understanding of the subject matter.

**Practical Applications**
The practical relevance of ${topic} extends to real-world situations and applications. Understanding how theoretical concepts translate into practice enhances the value of this study.

**Challenges and Opportunities**
Like many areas of study, ${topic} presents both challenges and opportunities for further development and understanding. Identifying these aspects helps focus future research and application.

**Future Implications**
The long-term implications of ${topic} suggest its continued relevance and importance in academic and practical contexts.

**Conclusion**
In conclusion, ${topic} represents a significant area of study with broad implications and applications. The comprehensive examination of its various aspects contributes to better understanding and appreciation of this important subject.`;
  }

  private async generateFullSentencesAnswer(request: AIAnswerRequest, _template: AnswerTemplate): Promise<string> {
    const topic = request.question;
    const numSentences = Math.floor(request.marks / 1); // Roughly 1 sentence per mark for 4-8 marks range
    
    // Generate subject-specific full sentences
    switch (request.subject) {
      case 'social-studies':
        return this.generateSocialStudiesFullSentences(topic, numSentences);
      case 'rme':
        return this.generateRMEFullSentences(topic, numSentences);
      case 'english':
        return this.generateEnglishFullSentences(topic, numSentences);
      default:
        return this.generateGenericFullSentences(topic, numSentences);
    }
  }

  private generateBasicAnswer(request: AIAnswerRequest): string {
    const topic = request.question;
    return `${topic} is an important concept that requires understanding and analysis. The key aspects include definition, significance, and practical applications in relevant contexts.`;
  }

  // Full sentence generators for 4-8 marks range
  private generateSocialStudiesFullSentences(topic: string, numSentences: number): string {
    const sentences = [
      `${topic} is a significant aspect of Ghana's social and historical development that has shaped our national identity.`,
      `The historical context of ${topic} dates back to pre-colonial times and has evolved through various periods of Ghana's history.`,
      `From a social perspective, ${topic} influences various communities and contributes to the cultural fabric of Ghanaian society.`,
      `The economic implications of ${topic} affect multiple sectors including agriculture, trade, and modern industry in Ghana.`,
      `Political factors surrounding ${topic} involve government policies, traditional authorities, and democratic institutions.`,
      `Contemporary challenges related to ${topic} require innovative solutions and collaboration between different stakeholders.`,
      `Regional cooperation through ECOWAS and international partnerships play important roles in addressing issues related to ${topic}.`,
      `The future development of ${topic} depends on continued education, policy implementation, and community engagement across Ghana.`
    ];
    
    return sentences.slice(0, Math.min(numSentences, sentences.length)).join(' ');
  }

  private generateRMEFullSentences(topic: string, numSentences: number): string {
    const sentences = [
      `${topic} holds significant importance in Religious and Moral Education as it relates to character formation and spiritual development.`,
      `Major world religions including Christianity, Islam, and traditional African religions provide valuable teachings about ${topic}.`,
      `The moral principles associated with ${topic} include fundamental values such as honesty, compassion, justice, and respect for human dignity.`,
      `Practical applications of ${topic} can be seen in family relationships, community interactions, and daily decision-making processes.`,
      `Sacred texts and religious teachings offer guidance on how believers should approach ${topic} in their spiritual journey.`,
      `The study of ${topic} contributes to personal character development and helps individuals develop strong moral reasoning abilities.`,
      `Interfaith understanding regarding ${topic} promotes tolerance and mutual respect among Ghana's diverse religious communities.`,
      `Modern applications of ${topic} in contemporary Ghanaian society demonstrate the continued relevance of religious and moral teachings.`
    ];
    
    return sentences.slice(0, Math.min(numSentences, sentences.length)).join(' ');
  }

  private generateEnglishFullSentences(topic: string, numSentences: number): string {
    const sentences = [
      `${topic} represents an important concept in English Language studies that demonstrates the relationship between language, thought, and communication.`,
      `Literary analysis of ${topic} reveals how authors use various literary devices such as symbolism, metaphor, and characterization to convey meaning.`,
      `The linguistic structure of ${topic} showcases the sophisticated nature of English grammar, syntax, and vocabulary in effective communication.`,
      `Cultural and historical contexts surrounding ${topic} reflect the experiences of diverse societies and changing social values over time.`,
      `Critical thinking skills developed through studying ${topic} include text analysis, argument evaluation, and coherent response construction.`,
      `Creative expression related to ${topic} encourages students to develop their own voice and style while exploring complex ideas.`,
      `The practical applications of ${topic} extend to academic writing, professional communication, and everyday language use.`,
      `Understanding ${topic} enhances both technical language skills and cultural appreciation, preparing students for lifelong learning and communication.`
    ];
    
    return sentences.slice(0, Math.min(numSentences, sentences.length)).join(' ');
  }

  private generateGenericFullSentences(topic: string, numSentences: number): string {
    const sentences = [
      `${topic} is an important concept that requires careful examination and thorough understanding.`,
      `The fundamental principles related to ${topic} provide the foundation for deeper analysis and study.`,
      `Various perspectives and approaches contribute to a comprehensive understanding of ${topic}.`,
      `Practical applications of ${topic} demonstrate its relevance in real-world situations and contexts.`,
      `Contemporary research and evidence support the continued importance and study of ${topic}.`,
      `The implications of ${topic} extend to multiple areas of knowledge and practical application.`,
      `Future developments in ${topic} will likely influence ongoing research and educational approaches.`,
      `Understanding ${topic} contributes to broader knowledge and intellectual development.`
    ];
    
    return sentences.slice(0, Math.min(numSentences, sentences.length)).join(' ');
  }

  private async createDialogues(answer: AIAnswer, questionText: string): Promise<PodcastDialogue[]> {
    const dialogues: PodcastDialogue[] = [];
    let order = 1;

    // Teacher introduces the topic
    dialogues.push({
      id: this.generateId(),
      character: this.characters.teacher,
      text: `Hello Serwaa! Today we're going to discuss an interesting topic: "${questionText}". Are you ready to explore this together?`,
      order: order++
    });

    // Student responds with interest
    dialogues.push({
      id: this.generateId(),
      character: this.characters.student,
      text: `Yes, Mr. Das! I'm excited to learn about this topic. Could you help me understand the main points we should cover?`,
      order: order++
    });

    // Break down the answer into conversational segments
    const paragraphs = answer.paragraphs;
    
    for (let i = 0; i < paragraphs.length && i < 6; i++) {
      const paragraph = paragraphs[i];
      const simplifiedContent = this.simplifyForConversation(paragraph);

      // Teacher explains a point
      dialogues.push({
        id: this.generateId(),
        character: this.characters.teacher,
        text: `Let me explain this section: ${simplifiedContent}`,
        order: order++
      });

      // Student asks for clarification or shows understanding
      const studentResponse = i % 2 === 0 
        ? `That's very helpful, Mr. Das. Could you give me an example to make it clearer?`
        : `I understand! This connects to what we learned earlier. What should we focus on next?`;

      dialogues.push({
        id: this.generateId(),
        character: this.characters.student,
        text: studentResponse,
        order: order++
      });
    }

    // Closing dialogue
    dialogues.push({
      id: this.generateId(),
      character: this.characters.teacher,
      text: `Excellent questions, Serwaa! You've really grasped the key concepts. Remember to practice writing detailed answers using the structure we discussed.`,
      order: order++
    });

    dialogues.push({
      id: this.generateId(),
      character: this.characters.student,
      text: `Thank you so much, Mr. Das! This conversation has really helped me understand the topic better. I feel more confident about writing comprehensive answers now.`,
      order: order++
    });

    return dialogues;
  }

  private simplifyForConversation(paragraph: string): string {
    // Remove markdown formatting and simplify language for spoken conversation
    return paragraph
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .substring(0, 200) + (paragraph.length > 200 ? '...' : '');
  }

  private generateTranscript(dialogues: PodcastDialogue[]): string {
    return dialogues
      .map(d => `${d.character.name.toUpperCase()}: ${d.text}`)
      .join('\n\n');
  }

  private extractParagraphs(content: string): string[] {
    return content
      .split('\n\n')
      .filter(p => p.trim().length > 0)
      .map(p => p.replace(/\*\*(.*?)\*\*/g, '$1'));
  }

  private extractKeyPoints(content: string): string[] {
    const sentences = content.split('.');
    return sentences
      .filter(s => s.trim().length > 20)
      .slice(0, 8)
      .map(s => s.trim());
  }

  private extractTitle(questionText: string): string {
    return questionText.length > 50 
      ? questionText.substring(0, 47) + '...'
      : questionText;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
