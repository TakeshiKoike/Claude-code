import { NextRequest, NextResponse } from 'next/server';
import { getAllSubscribers, getSubscriberCount } from '@/lib/subscribers';

export async function GET(request: NextRequest) {
  try {
    const subscribers = getAllSubscribers();
    const count = getSubscriberCount();
    return NextResponse.json({ subscribers, count });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}
