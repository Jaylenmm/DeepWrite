# DeepWrite - AI-Powered Writing Assistant

DeepWrite is a modern, AI-powered writing assistant that helps you create, improve, and enhance your content with the help of advanced AI models.

## ✨ Features

- **AI Content Generation**: Improve, expand, summarize, and rewrite your text
- **Dual AI Providers**: Support for both Anthropic Claude (free tier) and OpenAI GPT-4
- **Real-time Suggestions**: Get intelligent writing suggestions as you type
- **Grammar Checking**: Automatic grammar and spelling analysis
- **Writing Templates**: Pre-built templates for blogs, emails, reports, and stories
- **Document Management**: Save, organize, and manage your documents
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Authentication**: Secure user authentication with Supabase

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **AI Providers**: Anthropic Claude, OpenAI GPT-4
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- An Anthropic API key (recommended for free tier)
- An OpenAI API key (optional, for comparison)
- A Supabase account

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/deepwrite.git
   cd deepwrite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # AI Provider Configuration
   ANTHROPIC_API_KEY=your_anthropic_api_key
   OPENAI_API_KEY=your_openai_api_key

   # Stripe Configuration (optional)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

4. **Set up Supabase Database**
   Run the following SQL in your Supabase SQL editor:
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

   -- Create policies
   CREATE POLICY "Users can view own documents" ON documents
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own documents" ON documents
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update own documents" ON documents
     FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete own documents" ON documents
     FOR DELETE USING (auth.uid() = user_id);
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Getting Started
1. Sign up or sign in to your account
2. Start writing in the editor
3. Use AI controls to enhance your content
4. View real-time suggestions in the sidebar
5. Save and manage your documents

### AI Features
- **Improve Writing**: Enhance clarity, grammar, and style
- **Expand Content**: Add more details and examples
- **Summarize**: Create concise summaries
- **Rewrite**: Rephrase with different tone and style
- **Provider Selection**: Choose between Claude (free) and GPT-4 (paid)

### Writing Templates
- Blog Post structure
- Professional Email format
- Business Report template
- Creative Story framework

## 💰 Cost Considerations

### Anthropic Claude (Recommended)
- **Free Tier**: 5 messages per minute, 25 messages per day
- **Paid Tier**: $1.50 per million input tokens, $7.50 per million output tokens
- **Model**: Claude 3 Haiku (fast and cost-effective)

### OpenAI GPT-4 (Optional)
- **No Free Tier**: Requires credits
- **Cost**: ~$0.03 per 1K input tokens, ~$0.06 per 1K output tokens
- **Model**: GPT-4 (high quality but more expensive)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**
2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add your environment variables
   - Deploy

### Environment Variables for Production
Make sure to add all your environment variables in your Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:
1. Check the [AI Setup Guide](AI_SETUP.md) for troubleshooting
2. Ensure your environment variables are correctly set
3. Verify your API keys are valid and have sufficient credits
4. Check the browser console for detailed error messages

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for authentication and database
- [Anthropic](https://anthropic.com/) for Claude AI
- [OpenAI](https://openai.com/) for GPT-4
- [Tailwind CSS](https://tailwindcss.com/) for styling
