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
    let analysisText = '';

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
              content: 'You are a grammar checker. Analyze the text for grammatical errors, spelling mistakes, and punctuation issues. Return the analysis in JSON format: {"errors": [{"type": "grammar|spelling|punctuation", "message": "error description", "position": "approximate location"}], "score": 85}'
            },
            {
              role: 'user',
              content: `Check the grammar and spelling of this text:

${content}`
            }
          ],
          max_tokens: 800,
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return NextResponse.json({ error: error.error?.message || 'OpenAI request failed' }, { status: 500 });
      }

      const data = await response.json();
      analysisText = data.choices[0]?.message?.content || '';
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
          max_tokens: 800,
          messages: [
            {
              role: 'user',
              content: `Check the grammar and spelling of this text. Return the analysis in JSON format: {"errors": [{"type": "grammar|spelling|punctuation", "message": "error description", "position": "approximate location"}], "score": 85}

Text to check:
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
      analysisText = data.content[0]?.text || '';
    }

    // Parse grammar analysis
    try {
      const analysis = JSON.parse(analysisText);
      return NextResponse.json({
        errors: analysis.errors || [],
        score: analysis.score || 100,
      });
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return NextResponse.json({
        errors: [],
        score: 100,
      });
    }

  } catch (error) {
    console.error('AI grammar check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 