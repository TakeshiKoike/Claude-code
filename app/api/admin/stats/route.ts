import { NextResponse } from 'next/server';
import { getAllArticles } from '@/lib/articles';
import { getSubscriberCount } from '@/lib/subscribers';
import { getPremiumMemberCount } from '@/lib/premium';

export async function GET() {
  try {
    const articles = getAllArticles();
    const subscriberCount = getSubscriberCount();
    const premiumCount = getPremiumMemberCount();

    return NextResponse.json({
      totalArticles: articles.length,
      premiumArticles: articles.filter((a: any) => a.is_premium).length,
      subscriberCount,
      premiumMemberCount: premiumCount,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
