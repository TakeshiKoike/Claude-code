'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  author: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '電子カルテ',
    author: '編集部',
    image_url: '',
  });
  const router = useRouter();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingArticle
        ? `/api/articles/${editingArticle.id}`
        : '/api/articles';
      const method = editingArticle ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchArticles();
        setShowForm(false);
        setEditingArticle(null);
        setFormData({
          title: '',
          content: '',
          category: '電子カルテ',
          author: '編集部',
          image_url: '',
        });
      }
    } catch (error) {
      console.error('Failed to save article:', error);
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      category: article.category,
      author: article.author,
      image_url: article.image_url || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('この記事を削除してもよろしいですか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchArticles();
      }
    } catch (error) {
      console.error('Failed to delete article:', error);
    }
  };

  const categories = ['電子カルテ', '医療DX', '看護教育', 'デジタルヘルス', 'その他'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-primary-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">管理画面</h1>
            <div className="flex items-center space-x-4">
              <Link href="/" className="hover:text-primary-200 transition">
                サイトを表示
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white text-primary-700 px-4 py-2 rounded hover:bg-primary-50 transition"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* アクションボタン */}
        <div className="mb-6">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingArticle(null);
              setFormData({
                title: '',
                content: '',
                category: '電子カルテ',
                author: '編集部',
                image_url: '',
              });
            }}
            className="btn-primary"
          >
            {showForm ? '閉じる' : '+ 新規記事作成'}
          </button>
        </div>

        {/* 記事作成/編集フォーム */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingArticle ? '記事を編集' : '新規記事作成'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  タイトル
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  カテゴリ
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  著者
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  画像URL（オプション）
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  本文
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={10}
                  required
                />
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="btn-primary">
                  {editingArticle ? '更新' : '作成'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingArticle(null);
                  }}
                  className="btn-secondary"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 記事一覧 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">記事一覧</h2>
          {loading ? (
            <p>読み込み中...</p>
          ) : articles.length === 0 ? (
            <p className="text-gray-500">まだ記事がありません</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">タイトル</th>
                    <th className="text-left py-3 px-4">カテゴリ</th>
                    <th className="text-left py-3 px-4">著者</th>
                    <th className="text-left py-3 px-4">作成日</th>
                    <th className="text-right py-3 px-4">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr key={article.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Link
                          href={`/articles/${article.id}`}
                          className="text-primary-600 hover:underline"
                        >
                          {article.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-sm">
                          {article.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">{article.author}</td>
                      <td className="py-3 px-4">
                        {new Date(article.created_at).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(article)}
                          className="text-primary-600 hover:underline"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="text-red-600 hover:underline"
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
