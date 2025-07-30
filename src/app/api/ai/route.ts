import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { content, action, style, tone, customPrompt, provider = 'anthropic' } = await request.json();

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
    if (!content || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let response;
    let generatedContent = '';

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
              content: 'You are a professional writing assistant. Provide clear, well-structured responses that improve the given text according to the user\'s specifications.'
            },
            {
              role: 'user',
              content: generatePrompt(content, action, style, tone, customPrompt)
            }
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return NextResponse.json({ error: error.error?.message || 'OpenAI request failed' }, { status: 500 });
      }

      const data = await response.json();
      generatedContent = data.choices[0]?.message?.content || '';
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
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: `You are a professional writing assistant. Provide clear, well-structured responses that improve the given text according to the user's specifications.

${generatePrompt(content, action, style, tone, customPrompt)}`
            }
          ],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return NextResponse.json({ error: error.error?.message || 'Anthropic request failed' }, { status: 500 });
      }

      const data = await response.json();
      generatedContent = data.content[0]?.text || '';
    }

    return NextResponse.json({
      content: generatedContent,
      stats: {
        originalLength: content.length,
        newLength: generatedContent.length,
        improvement: calculateImprovement(content, generatedContent),
      }
    });

  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generatePrompt(content: string, action: string, style?: string, tone?: string, customPrompt?: string): string {
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

function calculateImprovement(original: string, improved: string): string {
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