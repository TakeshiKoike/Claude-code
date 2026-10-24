import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';

export const dynamic = 'force-dynamic';

export default function Home() {
  const articles = getAllArticles();

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
              <Link
                href="/admin"
                className="bg-white text-primary-600 px-4 py-2 rounded hover:bg-primary-50 transition"
              >
                管理画面
              </Link>
            </nav>
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

      {/* 広告バナー（トップ） */}
      <div className="container mx-auto px-4 pt-6">
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center text-gray-400 text-sm">
          <div className="h-20 flex items-center justify-center">
            <span>広告スペース (728x90) - Google AdSense</span>
          </div>
          {/* Google AdSense: 下記コメントを実際のAdSenseコードに置き換えてください
          <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="XXXXXXXXXX"
            data-ad-format="auto"
            data-full-width-responsive="true" />
          */}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 記事一覧 */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">まだ記事がありません</p>
                  <Link href="/admin" className="text-primary-600 hover:underline mt-2 inline-block">
                    管理画面から記事を作成する
                  </Link>
                </div>
              ) : (
                articles.map((article, index) => (
                  <div key={article.id}>
                    <Link
                      href={`/articles/${article.id}`}
                      className="card group block"
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
                        {article.is_premium ? (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-bold">
                            PREMIUM
                          </span>
                        ) : null}
                        <span className="text-xs text-gray-500">
                          {new Date(article.created_at).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition">
                        {article.is_premium ? '🔒 ' : ''}{article.title}
                      </h2>
                      <p className="text-gray-600 line-clamp-3">
                        {article.content.substring(0, 150)}...
                      </p>
                      <div className="mt-4 text-sm text-gray-500">
                        執筆: {article.author}
                      </div>
                    </Link>

                    {/* 記事3つごとに広告を挿入 */}
                    {(index + 1) % 3 === 0 && index < articles.length - 1 && (
                      <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 text-center text-gray-400 text-xs mt-6">
                        <div className="h-16 flex items-center justify-center">
                          <span>広告スペース (336x280) - Google AdSense</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* サイドバー */}
          <aside className="lg:w-80 space-y-6">
            {/* プレミアム誘導 */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl p-6 text-white">
              <div className="text-yellow-400 font-bold text-sm mb-2">PREMIUM</div>
              <h3 className="text-lg font-bold mb-2">プレミアム会員になる</h3>
              <p className="text-primary-100 text-sm mb-4">
                博士号研究者による深掘り分析記事、最新研究レビューにフルアクセス。
              </p>
              <Link
                href="/premium"
                className="block bg-yellow-400 text-yellow-900 text-center font-bold py-2 rounded-lg hover:bg-yellow-300 transition"
              >
                月額980円で始める
              </Link>
            </div>

            {/* メルマガ登録 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">メルマガ登録</h3>
              <p className="text-gray-600 text-sm mb-4">
                最新の看護DXニュースを毎週お届け。無料です。
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="space-y-3"
              >
                <input
                  type="email"
                  placeholder="メールアドレス"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 rounded-lg transition text-sm"
                >
                  無料で購読する
                </button>
              </form>
              <p className="text-gray-400 text-xs mt-2">いつでも配信停止できます</p>
            </div>

            {/* 広告（サイドバー） */}
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 text-center text-gray-400 text-xs">
              <div className="h-64 flex items-center justify-center">
                <span>広告スペース (300x250)</span>
              </div>
            </div>

            {/* 運営者情報 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">運営者</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">
                  Dr.
                </div>
                <div>
                  <p className="font-medium text-gray-800">博士（看護学）</p>
                  <p className="text-gray-500 text-xs">看護 x IT エンジニア</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                看護学博士号を持つエンジニア。医療DXの最前線をお届けします。
              </p>
              <Link href="/about" className="text-primary-600 hover:underline text-sm">
                詳しいプロフィール →
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* フッター */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 py-10">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* サイト情報 */}
            <div>
              <h4 className="text-lg font-bold mb-3">看護デジタルニュース</h4>
              <p className="text-gray-400 text-sm">
                看護・医療に関するデジタル技術の最新ニュースをお届けします。
                博士号を持つ専門家が、信頼性の高い情報を発信しています。
              </p>
            </div>
            {/* リンク */}
            <div>
              <h4 className="text-lg font-bold mb-3">リンク</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/" className="hover:text-white transition">ニュース一覧</Link></li>
                <li><Link href="/premium" className="hover:text-white transition">プレミアム会員</Link></li>
                <li><Link href="/about" className="hover:text-white transition">運営者情報</Link></li>
                <li><Link href="/admin" className="hover:text-white transition">管理画面</Link></li>
              </ul>
            </div>
            {/* メルマガ（フッター） */}
            <div>
              <h4 className="text-lg font-bold mb-3">ニュースレター</h4>
              <p className="text-gray-400 text-sm mb-3">最新ニュースをメールで受け取る</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="メールアドレス"
                  className="flex-1 px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-primary-500"
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
