import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId } = await request.json();

    // Get user from Supabase
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user already has a subscription
    const { data: existingSubscription } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.user.id)
      .single();

    let customerId = existingSubscription?.stripe_customer_id;

    // Create or get Stripe customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.user.email,
        metadata: {
          supabase_user_id: user.user.id,
        },
      });
      customerId = customer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.nextUrl.origin}/editor?success=true`,
      cancel_url: `${request.nextUrl.origin}/billing?canceled=true`,
      metadata: {
        user_id: user.user.id,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 