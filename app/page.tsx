import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';

export default function Home() {
  const articles = getAllArticles();

  // カテゴリごとに記事を分類
  const categories = ['電子カルテ', '医療DX', '看護教育', 'デジタルヘルス', 'その他'];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-primary-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">看護デジタルニュース</h1>
              <p className="text-primary-100 mt-1">Nursing Digital News</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/game"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition font-medium"
              >
                アドベンチャーゲーム
              </Link>
              <Link
                href="/admin"
                className="bg-white text-primary-600 px-4 py-2 rounded hover:bg-primary-50 transition"
              >
                管理画面
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* カテゴリナビゲーション */}
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-3">
          <div className="flex space-x-6 overflow-x-auto">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 font-medium whitespace-nowrap"
            >
              すべて
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/?category=${encodeURIComponent(category)}`}
                className="text-gray-700 hover:text-primary-600 font-medium whitespace-nowrap"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">まだ記事がありません</p>
              <Link href="/admin" className="text-primary-600 hover:underline mt-2 inline-block">
                管理画面から記事を作成する
              </Link>
            </div>
          ) : (
            articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="card group"
              >
                {article.image_url && (
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg mb-4 overflow-hidden">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                    />
                  </div>
                )}
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(article.created_at).toLocaleDateString('ja-JP')}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition">
                  {article.title}
                </h2>
                <p className="text-gray-600 line-clamp-3">
                  {article.content.substring(0, 150)}...
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  執筆: {article.author}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* フッター */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p>&copy; 2024 看護デジタルニュース All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
