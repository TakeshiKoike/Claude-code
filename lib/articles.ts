import db from './db';

export interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  author: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewArticle {
  title: string;
  content: string;
  category: string;
  author?: string;
  image_url?: string;
}

// すべての記事を取得
export function getAllArticles(): Article[] {
  const stmt = db.prepare('SELECT * FROM articles ORDER BY created_at DESC');
  return stmt.all() as Article[];
}

// カテゴリ別の記事を取得
export function getArticlesByCategory(category: string): Article[] {
  const stmt = db.prepare('SELECT * FROM articles WHERE category = ? ORDER BY created_at DESC');
  return stmt.all(category) as Article[];
}

// IDで記事を取得
export function getArticleById(id: number): Article | undefined {
  const stmt = db.prepare('SELECT * FROM articles WHERE id = ?');
  return stmt.get(id) as Article | undefined;
}

// 記事を作成
export function createArticle(article: NewArticle): Article {
  const stmt = db.prepare(`
    INSERT INTO articles (title, content, category, author, image_url)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    article.title,
    article.content,
    article.category,
    article.author || '編集部',
    article.image_url || null
  );
  return getArticleById(Number(info.lastInsertRowid))!;
}

// 記事を更新
export function updateArticle(id: number, article: Partial<NewArticle>): Article | undefined {
  const updates: string[] = [];
  const values: any[] = [];

  if (article.title !== undefined) {
    updates.push('title = ?');
    values.push(article.title);
  }
  if (article.content !== undefined) {
    updates.push('content = ?');
    values.push(article.content);
  }
  if (article.category !== undefined) {
    updates.push('category = ?');
    values.push(article.category);
  }
  if (article.author !== undefined) {
    updates.push('author = ?');
    values.push(article.author);
  }
  if (article.image_url !== undefined) {
    updates.push('image_url = ?');
    values.push(article.image_url);
  }

  if (updates.length === 0) {
    return getArticleById(id);
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  const stmt = db.prepare(`
    UPDATE articles
    SET ${updates.join(', ')}
    WHERE id = ?
  `);
  stmt.run(...values);

  return getArticleById(id);
}

// 記事を削除
export function deleteArticle(id: number): boolean {
  const stmt = db.prepare('DELETE FROM articles WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
}

// 最新の記事を取得
export function getLatestArticles(limit: number = 10): Article[] {
  const stmt = db.prepare('SELECT * FROM articles ORDER BY created_at DESC LIMIT ?');
  return stmt.all(limit) as Article[];
}
