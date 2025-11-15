import db from './db';

export interface User {
  id: number;
  username: string;
  password: string;
  created_at: string;
}

// ユーザー認証
export function authenticateUser(username: string, password: string): boolean {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  const user = stmt.get(username) as User | undefined;

  if (!user) {
    return false;
  }

  // 簡易的なパスワード検証（本番環境ではbcryptなどを使用）
  const hashedPassword = Buffer.from(password).toString('base64');
  return user.password === hashedPassword;
}

// ユーザーの存在確認
export function userExists(username: string): boolean {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM users WHERE username = ?');
  const result = stmt.get(username) as { count: number };
  return result.count > 0;
}
