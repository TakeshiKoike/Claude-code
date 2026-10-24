import { NextRequest, NextResponse } from 'next/server';
import { addPremiumMember, updateMemberStatus } from '@/lib/premium';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const event = JSON.parse(body);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        if (session.customer_email) {
          addPremiumMember(
            session.customer_email,
            session.metadata?.plan || 'monthly',
            session.customer,
            session.subscription
          );
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        if (subscription.customer_email) {
          updateMemberStatus(subscription.customer_email, 'canceled');
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        if (invoice.customer_email) {
          updateMemberStatus(invoice.customer_email, 'past_due');
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
