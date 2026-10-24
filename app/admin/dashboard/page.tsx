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
  is_premium: number;
  created_at: string;
  updated_at: string;
}

interface Subscriber {
  id: number;
  email: string;
  name: string | null;
  subscribed_at: string;
  is_active: number;
}

interface Stats {
  totalArticles: number;
  premiumArticles: number;
  subscriberCount: number;
  premiumMemberCount: number;
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'articles' | 'subscribers' | 'stats'>('articles');
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '電子カルテ',
    author: '編集部',
    image_url: '',
    is_premium: false,
  });
  const router = useRouter();

  useEffect(() => {
    fetchArticles();
    fetchStats();
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

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/admin/subscribers');
      const data = await response.json();
      setSubscribers(data.subscribers || []);
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          is_premium: formData.is_premium ? 1 : 0,
        }),
      });

      if (response.ok) {
        fetchArticles();
        fetchStats();
        setShowForm(false);
        setEditingArticle(null);
        setFormData({
          title: '',
          content: '',
          category: '電子カルテ',
          author: '編集部',
          image_url: '',
          is_premium: false,
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
      is_premium: !!article.is_premium,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('この記事を削除してもよろしいですか？')) return;
    try {
      const response = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchArticles();
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to delete article:', error);
    }
  };

  const handleTogglePremium = async (article: Article) => {
    try {
      await fetch(`/api/articles/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_premium: article.is_premium ? 0 : 1 }),
      });
      fetchArticles();
      fetchStats();
    } catch (error) {
      console.error('Failed to toggle premium:', error);
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
        {/* 統計ダッシュボード */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-gray-500 text-sm">総記事数</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalArticles}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-gray-500 text-sm">プレミアム記事</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.premiumArticles}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-gray-500 text-sm">メルマガ購読者</p>
              <p className="text-3xl font-bold text-primary-600">{stats.subscriberCount}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-gray-500 text-sm">プレミアム会員</p>
              <p className="text-3xl font-bold text-green-600">{stats.premiumMemberCount}</p>
            </div>
          </div>
        )}

        {/* タブ */}
        <div className="flex space-x-1 bg-gray-200 rounded-lg p-1 mb-6 max-w-md">
          {[
            { key: 'articles' as const, label: '記事管理' },
            { key: 'subscribers' as const, label: '購読者' },
            { key: 'stats' as const, label: '収益' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                if (tab.key === 'subscribers') fetchSubscribers();
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                activeTab === tab.key
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 記事管理タブ */}
        {activeTab === 'articles' && (
          <>
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
                    is_premium: false,
                  });
                }}
                className="btn-primary"
              >
                {showForm ? '閉じる' : '+ 新規記事作成'}
              </button>
            </div>

            {showForm && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">
                  {editingArticle ? '記事を編集' : '新規記事作成'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">タイトル</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">著者</label>
                      <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">画像URL（オプション）</label>
                    <input
                      type="text"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* プレミアム設定 */}
                  <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <input
                      type="checkbox"
                      id="is_premium"
                      checked={formData.is_premium}
                      onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
                      className="w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500"
                    />
                    <label htmlFor="is_premium" className="text-sm">
                      <span className="font-bold text-yellow-800">PREMIUM記事にする</span>
                      <span className="text-yellow-700 ml-2">（有料会員限定コンテンツ）</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">本文</label>
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
                      onClick={() => { setShowForm(false); setEditingArticle(null); }}
                      className="btn-secondary"
                    >
                      キャンセル
                    </button>
                  </div>
                </form>
              </div>
            )}

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
                        <th className="text-center py-3 px-4">種別</th>
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
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleTogglePremium(article)}
                              className={`px-3 py-1 rounded text-xs font-bold transition ${
                                article.is_premium
                                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              }`}
                            >
                              {article.is_premium ? 'PREMIUM' : '無料'}
                            </button>
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
          </>
        )}

        {/* 購読者タブ */}
        {activeTab === 'subscribers' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">メルマガ購読者一覧</h2>
              <span className="text-gray-500 text-sm">{subscribers.length}名</span>
            </div>
            {subscribers.length === 0 ? (
              <p className="text-gray-500">まだ購読者がいません</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">メールアドレス</th>
                      <th className="text-left py-3 px-4">名前</th>
                      <th className="text-left py-3 px-4">登録日</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((sub) => (
                      <tr key={sub.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{sub.email}</td>
                        <td className="py-3 px-4 text-gray-500">{sub.name || '-'}</td>
                        <td className="py-3 px-4">
                          {new Date(sub.subscribed_at).toLocaleDateString('ja-JP')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 収益タブ */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">収益概要</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">プレミアム会員収益</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">会員数</span>
                      <span className="font-bold">{stats?.premiumMemberCount || 0}名</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">月額プラン単価</span>
                      <span className="font-bold">980円/月</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">年額プラン単価</span>
                      <span className="font-bold">9,800円/年</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="text-gray-800 font-medium">推定月収</span>
                      <span className="text-green-600 font-bold text-lg">
                        {((stats?.premiumMemberCount || 0) * 980).toLocaleString()}円
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">広告収益（AdSense）</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ステータス</span>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">設定待ち</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                      Google AdSenseの審査通過後、広告スペースに自動で広告が配信されます。
                    </p>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                      <p className="font-medium mb-1">設定手順:</p>
                      <ol className="list-decimal list-inside space-y-1 text-xs">
                        <li>Google AdSenseに登録</li>
                        <li>サイト審査を通過</li>
                        <li>広告コードを各ページに設置</li>
                        <li>収益の確認はAdSense管理画面で</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Stripe設定</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-3">
                  プレミアム会員の決済にはStripeを使用します。以下の環境変数を設定してください:
                </p>
                <div className="space-y-2 font-mono text-xs bg-gray-800 text-green-400 p-4 rounded-lg">
                  <p>STRIPE_SECRET_KEY=sk_live_...</p>
                  <p>NEXT_PUBLIC_BASE_URL=https://your-domain.com</p>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Stripeダッシュボード → 開発者 → APIキー からシークレットキーを取得できます。
                  Webhook URLは https://your-domain.com/api/stripe/webhook に設定してください。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
