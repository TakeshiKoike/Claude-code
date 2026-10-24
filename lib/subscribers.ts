import db from './db';

export interface Subscriber {
  id: number;
  email: string;
  name: string | null;
  subscribed_at: string;
  is_active: number;
}

export function addSubscriber(email: string, name?: string): Subscriber {
  const stmt = db.prepare('INSERT OR IGNORE INTO subscribers (email, name) VALUES (?, ?)');
  stmt.run(email, name || null);
  return getSubscriberByEmail(email)!;
}

export function getSubscriberByEmail(email: string): Subscriber | undefined {
  return db.prepare('SELECT * FROM subscribers WHERE email = ?').get(email) as Subscriber | undefined;
}

export function getAllSubscribers(): Subscriber[] {
  return db.prepare('SELECT * FROM subscribers WHERE is_active = 1 ORDER BY subscribed_at DESC').all() as Subscriber[];
}

export function getSubscriberCount(): number {
  const result = db.prepare('SELECT COUNT(*) as count FROM subscribers WHERE is_active = 1').get() as { count: number };
  return result.count;
}

export function unsubscribe(email: string): boolean {
  const info = db.prepare('UPDATE subscribers SET is_active = 0 WHERE email = ?').run(email);
  return info.changes > 0;
}
