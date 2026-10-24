import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleById, getAllArticles } from '@/lib/articles';

export const dynamic = 'force-dynamic';

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
            <nav className="flex items-center space-x-4">
              <Link
                href="/premium"
                className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded font-bold text-sm hover:bg-yellow-300 transition"
              >
                PREMIUM
              </Link>
              <Link
                href="/about"
                className="text-white hover:text-primary-200 transition"
              >
                運営者情報
              </Link>
            </nav>
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

      {/* 広告バナー（トップ） */}
      <div className="container mx-auto px-4 pt-6 max-w-4xl">
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 text-center text-gray-400 text-xs">
          <div className="h-16 flex items-center justify-center">
            <span>広告スペース (728x90) - Google AdSense</span>
          </div>
        </div>
      </div>

      {/* 記事コンテンツ */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* メインコンテンツ */}
          <article className="flex-1">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* カテゴリとメタ情報 */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm font-medium">
                  {article.category}
                </span>
                {article.is_premium ? (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm font-bold">
                    PREMIUM
                  </span>
                ) : null}
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
              <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-xs">
                  Dr.
                </div>
                <div>
                  <p className="text-gray-800 font-medium">{article.author}</p>
                  <p className="text-gray-500 text-xs">博士（看護学）</p>
                </div>
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

              {/* 本文（プレミアム記事はプレビューのみ） */}
              {article.is_premium ? (
                <div>
                  {/* プレビュー部分 */}
                  <div className="prose prose-lg max-w-none">
                    {article.content.substring(0, 300).split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* ペイウォール */}
                  <div className="relative mt-4">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white h-20 -top-20" />
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 text-center border border-primary-200">
                      <div className="inline-block bg-yellow-400 text-yellow-900 text-sm font-bold px-4 py-1 rounded-full mb-4">
                        PREMIUM
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        この記事の続きはプレミアム会員限定です
                      </h3>
                      <p className="text-gray-600 mb-6">
                        博士号研究者による深掘り分析を、月額980円でお読みいただけます。
                      </p>
                      <Link
                        href="/premium"
                        className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-3 rounded-lg transition"
                      >
                        プレミアム会員になる
                      </Link>
                      <p className="text-gray-500 text-xs mt-3">年額プランなら2ヶ月分お得</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="prose prose-lg max-w-none">
                  {article.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {/* 更新日時 */}
              {article.updated_at !== article.created_at && (
                <div className="mt-8 pt-4 border-t text-sm text-gray-500">
                  最終更新: {new Date(article.updated_at).toLocaleDateString('ja-JP')}
                </div>
              )}
            </div>

            {/* 記事下広告 */}
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center text-gray-400 text-sm mt-6">
              <div className="h-20 flex items-center justify-center">
                <span>広告スペース (728x90) - Google AdSense</span>
              </div>
            </div>

            {/* メルマガCTA */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-2">この記事が役に立ったら</h3>
                <p className="text-gray-600 text-sm mb-4">
                  看護DXの最新ニュースを毎週無料でお届けします
                </p>
                <div className="flex gap-2 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="メールアドレスを入力"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                  />
                  <button className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-2 rounded-lg transition text-sm">
                    購読する
                  </button>
                </div>
              </div>
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

          {/* サイドバー */}
          <aside className="lg:w-72 space-y-6">
            {/* プレミアム誘導 */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl p-5 text-white">
              <div className="text-yellow-400 font-bold text-xs mb-2">PREMIUM</div>
              <h3 className="font-bold mb-2">すべての記事を読む</h3>
              <p className="text-primary-100 text-xs mb-3">月額980円で専門家の分析にフルアクセス</p>
              <Link
                href="/premium"
                className="block bg-yellow-400 text-yellow-900 text-center font-bold py-2 rounded-lg hover:bg-yellow-300 transition text-sm"
              >
                詳しく見る
              </Link>
            </div>

            {/* 広告（サイドバー） */}
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 text-center text-gray-400 text-xs">
              <div className="h-64 flex items-center justify-center">
                <span>広告 (300x250)</span>
              </div>
            </div>

            {/* 運営者情報 */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <h3 className="font-bold text-gray-800 mb-2">この記事の著者</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-xs">
                  Dr.
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{article.author}</p>
                  <p className="text-gray-500 text-xs">博士（看護学）</p>
                </div>
              </div>
              <Link href="/about" className="text-primary-600 hover:underline text-sm">
                プロフィールを見る →
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* フッター */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 py-10">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold mb-3">看護デジタルニュース</h4>
              <p className="text-gray-400 text-sm">
                看護・医療に関するデジタル技術の最新ニュースをお届けします。
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-3">リンク</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/" className="hover:text-white transition">ニュース一覧</Link></li>
                <li><Link href="/premium" className="hover:text-white transition">プレミアム会員</Link></li>
                <li><Link href="/about" className="hover:text-white transition">運営者情報</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-3">ニュースレター</h4>
              <p className="text-gray-400 text-sm mb-3">最新ニュースをメールで受け取る</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="メールアドレス"
                  className="flex-1 px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm placeholder-gray-400"
                />
                <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded text-sm transition">
                  登録
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; 2024 看護デジタルニュース All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
