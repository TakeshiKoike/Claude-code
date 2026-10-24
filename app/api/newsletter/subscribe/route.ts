import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber, getSubscriberByEmail } from '@/lib/subscribers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const existing = getSubscriberByEmail(email);
    if (existing && existing.is_active) {
      return NextResponse.json(
        { message: 'Already subscribed', subscriber: existing },
        { status: 200 }
      );
    }

    const subscriber = addSubscriber(email, name);
    return NextResponse.json(
      { message: 'Successfully subscribed', subscriber },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error subscribing:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
