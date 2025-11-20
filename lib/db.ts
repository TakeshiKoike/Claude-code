import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'nursing-news.db');
const db = new Database(dbPath);

// テーブルの初期化
export function initDatabase() {
  // 記事テーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      author TEXT DEFAULT '編集部',
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 管理者テーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ゲームシナリオテーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS game_scenarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT,
      scenario_type TEXT DEFAULT '一般',
      is_ending INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ゲーム選択肢テーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS game_choices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scenario_id INTEGER NOT NULL,
      choice_text TEXT NOT NULL,
      next_scenario_id INTEGER,
      score INTEGER DEFAULT 0,
      feedback TEXT,
      FOREIGN KEY (scenario_id) REFERENCES game_scenarios(id)
    )
  `);

  // デフォルト管理者の作成（パスワード: admin123）
  // 本番環境では必ず変更してください
  const userExists = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userExists.count === 0) {
    // 簡易的なパスワードハッシュ（本番環境ではbcryptなどを使用）
    const password = Buffer.from('admin123').toString('base64');
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run('admin', password);
  }
}

// データベースの初期化を実行
initDatabase();

export default db;
