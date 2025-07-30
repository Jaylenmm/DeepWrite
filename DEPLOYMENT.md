# Vercel Deployment Guide

## Environment Variables Required

Add these environment variables in your Vercel dashboard:

### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### AI Provider Configuration
```
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
```

### Stripe Configuration (optional)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Optimized for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add all environment variables above
   - Deploy

3. **Configure Webhooks** (if using Stripe)
   - In your Stripe dashboard, add webhook endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Use the webhook secret in your environment variables

## Build Optimization

The project is optimized with:
- ✅ Next.js 15 with App Router
- ✅ Tailwind CSS v4 configuration
- ✅ TypeScript strict mode
- ✅ ESLint disabled during build (for production deployment)
- ✅ Optimized imports and bundle splitting
- ✅ Security headers
- ✅ API route optimization

## Troubleshooting

### Build Issues
- Ensure all environment variables are set in Vercel
- Check that Node.js version is 18+ (specified in package.json)
- Verify API keys are valid and have sufficient credits

### Runtime Issues
- Check Vercel function logs for API errors
- Verify Supabase connection and database setup
- Ensure CORS is properly configured for API routes

## Performance Optimizations

- Static pages are pre-rendered where possible
- API routes have 30-second timeout for AI operations
- Images are optimized with WebP/AVIF formats
- Console logs are removed in production
- Bundle splitting is enabled for better caching 