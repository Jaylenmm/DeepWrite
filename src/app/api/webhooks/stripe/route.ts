import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionChange(subscription: any) {
  const customerId = subscription.customer;
  const subscriptionId = subscription.id;
  const status = subscription.status;
  const planType = getPlanTypeFromPriceId(subscription.items.data[0].price.id);

  // Get user from customer metadata
  const customer = await stripe.customers.retrieve(customerId);
  const userId = (customer as any).metadata?.supabase_user_id;

  // Update or create subscription record
  const { error } = await supabase
    .from('user_subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      plan_type: planType,
      status: status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
      word_limit: getWordLimitForPlan(planType),
      updated_at: new Date(),
    });

  if (error) {
    console.error('Error updating subscription:', error);
  }
}

async function handleSubscriptionCanceled(subscription: any) {
  const customerId = subscription.customer;
  
  // Get user from customer metadata
  const customer = await stripe.customers.retrieve(customerId);
  const userId = (customer as any).metadata?.supabase_user_id;

  // Update subscription status
  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date(),
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Error canceling subscription:', error);
  }
}

async function handlePaymentSucceeded(invoice: any) {
  // Reset word usage for new billing period
  const customerId = invoice.customer;
  
  const customer = await stripe.customers.retrieve(customerId);
  const userId = (customer as any).metadata?.supabase_user_id;

  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      words_used: 0,
      updated_at: new Date(),
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Error resetting word usage:', error);
  }
}

async function handlePaymentFailed(invoice: any) {
  const customerId = invoice.customer;
  
  const customer = await stripe.customers.retrieve(customerId);
  const userId = (customer as any).metadata?.supabase_user_id;

  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date(),
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating payment failed status:', error);
  }
}

function getPlanTypeFromPriceId(priceId: string): string {
  // Map your Stripe price IDs to plan types
  const priceMap: { [key: string]: string } = {
    'price_pro_monthly': 'pro',
    'price_pro_yearly': 'pro',
    'price_team_monthly': 'team',
    'price_team_yearly': 'team',
  };
  return priceMap[priceId] || 'free';
}

function getWordLimitForPlan(planType: string): number {
  const limits: { [key: string]: number } = {
    free: 5000,
    pro: 50000,
    team: 100000,
  };
  return limits[planType] || 5000;
} 