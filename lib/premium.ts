import db from './db';

export interface PremiumMember {
  id: number;
  email: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: string;
  status: string;
  subscribed_at: string;
  expires_at: string | null;
}

export function addPremiumMember(email: string, plan: string, stripeCustomerId?: string, stripeSubscriptionId?: string): PremiumMember {
  const stmt = db.prepare(`
    INSERT INTO premium_members (email, plan, status, stripe_customer_id, stripe_subscription_id)
    VALUES (?, ?, 'active', ?, ?)
  `);
  stmt.run(email, plan, stripeCustomerId || null, stripeSubscriptionId || null);
  return getPremiumMemberByEmail(email)!;
}

export function getPremiumMemberByEmail(email: string): PremiumMember | undefined {
  return db.prepare('SELECT * FROM premium_members WHERE email = ?').get(email) as PremiumMember | undefined;
}

export function getAllPremiumMembers(): PremiumMember[] {
  return db.prepare('SELECT * FROM premium_members ORDER BY subscribed_at DESC').all() as PremiumMember[];
}

export function getPremiumMemberCount(): number {
  const result = db.prepare("SELECT COUNT(*) as count FROM premium_members WHERE status = 'active'").get() as { count: number };
  return result.count;
}

export function updateMemberStatus(email: string, status: string): boolean {
  const info = db.prepare('UPDATE premium_members SET status = ? WHERE email = ?').run(status, email);
  return info.changes > 0;
}

export function isPremiumMember(email: string): boolean {
  const member = db.prepare("SELECT * FROM premium_members WHERE email = ? AND status = 'active'").get(email) as PremiumMember | undefined;
  return !!member;
}
