# AI Setup Guide for DeepWrite

## Prerequisites

To use the AI functionality in DeepWrite, you'll need:

1. An Anthropic API key (recommended for free tier)
2. An OpenAI API key (optional, for comparison testing)
3. A Supabase account (for authentication and document storage)

## Setup Instructions

### 1. Anthropic API Key (Recommended - Free Tier)

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" in your dashboard
4. Create a new API key
5. Copy the API key

### 2. OpenAI API Key (Optional - For Comparison)

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" in your dashboard
4. Create a new API key
5. Copy the API key

### 3. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Anthropic API Configuration (Recommended)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# OpenAI API Configuration (Optional)
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration (if not already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Supabase Database Setup

Make sure you have a `documents` table in your Supabase database with the following structure:

```sql
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Document',
  content TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to access only their own documents
CREATE POLICY "Users can view own documents" ON documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" ON documents
  FOR DELETE USING (auth.uid() = user_id);
```

## AI Features Available

### 1. Content Generation
- **Improve Writing**: Enhance clarity, grammar, and style
- **Expand Content**: Add more details and examples
- **Summarize**: Create concise summaries
- **Rewrite**: Rephrase with different tone and style
- **Provider Selection**: Choose between Claude (free) and GPT-4 (paid)

### 2. Writing Templates
- Blog Post structure
- Professional Email format
- Business Report template
- Creative Story framework

### 3. AI Suggestions
- Real-time writing suggestions
- Grammar and style improvements
- Content enhancement recommendations

### 4. Writing Statistics
- Character count
- Word count
- Sentence count
- Reading time estimation
- Grammar score

## Usage

1. Start the development server: `npm run dev`
2. Sign in to your account
3. Start writing in the editor
4. Use the AI controls to enhance your content
5. View real-time suggestions in the sidebar

## Cost Considerations

### Anthropic Claude (Recommended)
- **Free Tier**: 5 messages per minute, 25 messages per day
- **Paid Tier**: $1.50 per million input tokens, $7.50 per million output tokens
- **Model**: Claude 3 Haiku (fast and cost-effective)

### OpenAI GPT-4 (Optional)
- **No Free Tier**: Requires credits
- **Cost**: ~$0.03 per 1K input tokens, ~$0.06 per 1K output tokens
- **Model**: GPT-4 (high quality but more expensive)

### Recommendations
- Start with Anthropic Claude for testing (free tier available)
- Use GPT-4 for comparison or when you need the highest quality
- Monitor your API usage regularly
- Set up usage limits in your accounts

## Troubleshooting

### Common Issues

1. **"Anthropic API key not configured"**
   - Make sure your `.env.local` file exists and contains the correct API key
   - Restart your development server after adding environment variables

2. **"AI request failed"**
   - Check your API key is valid
   - For Anthropic: Ensure you haven't exceeded the free tier limits
   - For OpenAI: Ensure you have sufficient credits
   - Check the browser console for detailed error messages

3. **"Rate limit exceeded"**
   - Anthropic free tier: 5 messages per minute, 25 per day
   - Wait a moment and try again
   - Consider upgrading to paid tier for higher limits

3. **Suggestions not appearing**
   - Make sure you have content in the editor
   - Wait a few seconds for the AI to analyze your text
   - Check your internet connection

### Support

If you encounter any issues, please check:
1. Your environment variables are correctly set
2. Your OpenAI API key is valid and has sufficient credits
3. Your Supabase configuration is correct
4. The browser console for any error messages 