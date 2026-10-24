import { NextRequest, NextResponse } from 'next/server';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const PLANS = {
  monthly: {
    name: 'プレミアム月額プラン',
    price: 980,
    interval: 'month' as const,
  },
  yearly: {
    name: 'プレミアム年額プラン',
    price: 9800,
    interval: 'year' as const,
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, email } = body;

    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Set STRIPE_SECRET_KEY environment variable.' },
        { status: 503 }
      );
    }

    const selectedPlan = PLANS[plan as keyof typeof PLANS];

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'subscription',
        'success_url': `${BASE_URL}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${BASE_URL}/premium`,
        ...(email ? { 'customer_email': email } : {}),
        'line_items[0][price_data][currency]': 'jpy',
        'line_items[0][price_data][product_data][name]': selectedPlan.name,
        'line_items[0][price_data][unit_amount]': selectedPlan.price.toString(),
        'line_items[0][price_data][recurring][interval]': selectedPlan.interval,
        'line_items[0][quantity]': '1',
      }),
    });

    const session = await response.json();

    if (!response.ok) {
      console.error('Stripe error:', session);
      return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
