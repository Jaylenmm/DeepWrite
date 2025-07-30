import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { content, provider = 'anthropic' } = await request.json();

    // Verify user is authenticated
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate input
    if (!content) {
      return NextResponse.json({ error: 'Missing content' }, { status: 400 });
    }

    let response;
    let suggestionsText = '';

    if (provider === 'openai') {
      // Make request to OpenAI
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a writing assistant. Analyze the given text and provide specific, actionable suggestions for improvement. Return suggestions in JSON format with the following structure: [{"type": "improvement|grammar|style|content", "text": "suggestion text", "category": "category name", "confidence": 0.9}]. Focus on the most important improvements first.'
            },
            {
              role: 'user',
              content: `Analyze this text and provide 3-5 specific suggestions for improvement:

${content}`
            }
          ],
          max_tokens: 1000,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return NextResponse.json({ error: error.error?.message || 'OpenAI request failed' }, { status: 500 });
      }

      const data = await response.json();
      suggestionsText = data.choices[0]?.message?.content || '';
    } else {
      // Make request to Anthropic Claude
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `Analyze this text and provide 3-5 specific, actionable suggestions for improvement. Return suggestions in JSON format with the following structure: [{"type": "improvement|grammar|style|content", "text": "suggestion text", "category": "category name", "confidence": 0.9}]. Focus on the most important improvements first.

Text to analyze:
${content}`
            }
          ]
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return NextResponse.json({ error: error.error?.message || 'Anthropic request failed' }, { status: 500 });
      }

      const data = await response.json();
      suggestionsText = data.content[0]?.text || '';
    }

    // Parse suggestions
    try {
      const suggestions = JSON.parse(suggestionsText);
      const formattedSuggestions = suggestions.map((s: any, index: number) => ({
        id: `suggestion-${index}`,
        type: s.type || 'improvement',
        text: s.text,
        category: s.category || 'General',
        confidence: s.confidence || 0.8,
      }));

      return NextResponse.json({ suggestions: formattedSuggestions });
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return NextResponse.json({
        suggestions: [{
          id: 'suggestion-1',
          type: 'improvement',
          text: 'Consider reviewing your text for clarity and flow.',
          category: 'General',
          confidence: 0.8,
        }]
      });
    }

  } catch (error) {
    console.error('AI suggestions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 