export interface AIRequest {
  content: string;
  action: 'improve' | 'expand' | 'summarize' | 'rewrite' | 'custom';
  style?: 'professional' | 'casual' | 'academic' | 'creative' | 'technical';
  tone?: 'friendly' | 'formal' | 'persuasive' | 'informative' | 'humorous';
  customPrompt?: string;
  provider?: 'openai' | 'anthropic';
}

export interface AIResponse {
  content: string;
  suggestions?: string[];
  stats?: {
    originalLength: number;
    newLength: number;
    improvement: string;
  };
}

export interface WritingSuggestion {
  id: string;
  type: 'improvement' | 'grammar' | 'style' | 'content';
  text: string;
  category: string;
  confidence: number;
}

import { supabase } from './supabaseClient';

class AIService {
  constructor() {
    // API keys are now handled server-side for security
  }



  private getPromptForAction(request: AIRequest): string {
    const { action, content, style, tone, customPrompt } = request;
    
    const stylePrompt = style ? `Write in a ${style} style.` : '';
    const tonePrompt = tone ? `Use a ${tone} tone.` : '';
    
    switch (action) {
      case 'improve':
        return `Improve the following text by enhancing clarity, grammar, and style. ${stylePrompt} ${tonePrompt} Focus on making it more engaging and professional while maintaining the original meaning:

${content}`;

      case 'expand':
        return `Expand the following text by adding more details, examples, and context. ${stylePrompt} ${tonePrompt} Make it more comprehensive and informative:

${content}`;

      case 'summarize':
        return `Create a concise summary of the following text, capturing the key points and main ideas:

${content}`;

      case 'rewrite':
        return `Rewrite the following text with a different approach while maintaining the core message. ${stylePrompt} ${tonePrompt} Make it fresh and engaging:

${content}`;

      case 'custom':
        return customPrompt ? `${customPrompt}

Text to work with:
${content}` : `Improve the following text:

${content}`;

      default:
        return `Improve the following text:

${content}`;
    }
  }

  async generateContent(request: AIRequest): Promise<AIResponse> {
    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'AI request failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('AI generation error:', error);
      throw error;
    }
  }

  async getWritingSuggestions(content: string, provider: 'openai' | 'anthropic' = 'anthropic'): Promise<WritingSuggestion[]> {
    if (!content.trim()) return [];

    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.warn('No active session for writing suggestions');
        return [];
      }

      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ content, provider }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error getting suggestions:', error);
        return [];
      }

      const data = await response.json();
      return data.suggestions || [];
    } catch (error) {
      console.error('Error getting writing suggestions:', error);
      return [];
    }
  }

  async checkGrammar(content: string, provider: 'openai' | 'anthropic' = 'anthropic'): Promise<{ errors: any[], score: number }> {
    if (!content.trim()) return { errors: [], score: 100 };

    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.warn('No active session for grammar check');
        return { errors: [], score: 100 };
      }

      const response = await fetch('/api/ai/grammar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ content, provider }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error checking grammar:', error);
        return { errors: [], score: 100 };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking grammar:', error);
      return { errors: [], score: 100 };
    }
  }

  private calculateImprovement(original: string, improved: string): string {
    const originalWords = original.split(' ').length;
    const improvedWords = improved.split(' ').length;
    const wordDiff = improvedWords - originalWords;
    
    if (wordDiff > 0) {
      return `Added ${wordDiff} words for better clarity`;
    } else if (wordDiff < 0) {
      return `Reduced by ${Math.abs(wordDiff)} words for conciseness`;
    } else {
      return 'Maintained length while improving quality';
    }
  }

  async generateTemplate(templateType: string, topic?: string): Promise<string> {
    const templates = {
      'blog-post': `# ${topic || 'Your Blog Title'}

## Introduction
Start with an engaging hook that captures your reader's attention.

## Main Content
Break down your main points into clear sections with subheadings.

### Key Point 1
Support your first main point with evidence and examples.

### Key Point 2
Develop your second main point with relevant details.

### Key Point 3
Present your third main point with compelling arguments.

## Conclusion
Summarize your main points and leave readers with a memorable takeaway.

## Call to Action
Encourage readers to engage further with your content.`,

      'email': `Subject: ${topic || 'Clear and Professional Subject Line'}

Dear [Recipient Name],

I hope this email finds you well.

[Opening paragraph - establish context and purpose]

[Main content - clearly state your points, requests, or information]

[Closing paragraph - summarize key points and next steps]

Best regards,
[Your Name]
[Your Title]
[Contact Information]`,

      'report': `# ${topic || 'Business Report Title'}

## Executive Summary
Brief overview of the report's key findings and recommendations.

## Introduction
Background information and objectives of the report.

## Methodology
Description of how the research or analysis was conducted.

## Findings
Detailed presentation of the main results and data.

### Key Finding 1
[Detailed explanation with supporting data]

### Key Finding 2
[Detailed explanation with supporting data]

## Analysis
Interpretation of the findings and their implications.

## Recommendations
Specific, actionable recommendations based on the findings.

## Conclusion
Summary of the report's main points and significance.`,

      'story': `# ${topic || 'Creative Story Title'}

## Opening
Set the scene and introduce your main character or situation.

## Rising Action
Build tension and develop the plot through a series of events.

## Climax
The turning point or most intense moment of the story.

## Falling Action
Show the consequences of the climax and begin to resolve conflicts.

## Resolution
Bring the story to a satisfying conclusion that ties up loose ends.`
    };

    return templates[templateType as keyof typeof templates] || templates['blog-post'];
  }
}

export const aiService = new AIService(); 