import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleById, getAllArticles } from '@/lib/articles';

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    id: article.id.toString(),
  }));
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const article = getArticleById(parseInt(params.id));

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-primary-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="hover:opacity-80 transition">
              <h1 className="text-3xl font-bold">看護デジタルニュース</h1>
              <p className="text-primary-100 mt-1">Nursing Digital News</p>
            </Link>
            <Link
              href="/admin"
              className="bg-white text-primary-600 px-4 py-2 rounded hover:bg-primary-50 transition"
            >
              管理画面
            </Link>
          </div>
        </div>
      </header>

      {/* パンくずリスト */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">
              ホーム
            </Link>
            <span>/</span>
            <span className="text-gray-800">{article.title}</span>
          </div>
        </div>
      </nav>

      {/* 記事コンテンツ */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* カテゴリとメタ情報 */}
          <div className="flex items-center space-x-4 mb-6">
            <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm font-medium">
              {article.category}
            </span>
            <span className="text-gray-500 text-sm">
              {new Date(article.created_at).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          {/* タイトル */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {article.title}
          </h1>

          {/* 著者 */}
          <div className="text-gray-600 mb-6">
            執筆: {article.author}
          </div>

          {/* アイキャッチ画像 */}
          {article.image_url && (
            <div className="mb-8">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}

          {/* 本文 */}
          <div className="prose prose-lg max-w-none">
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* 更新日時 */}
          {article.updated_at !== article.created_at && (
            <div className="mt-8 pt-4 border-t text-sm text-gray-500">
              最終更新: {new Date(article.updated_at).toLocaleDateString('ja-JP')}
            </div>
          )}
        </div>

        {/* 戻るボタン */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition"
          >
            ← ニュース一覧に戻る
          </Link>
        </div>
      </article>

      {/* フッター */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p>&copy; 2024 看護デジタルニュース All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
