import Link from 'next/link';

export default function AboutPage() {
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
              <Link href="/premium" className="text-white hover:text-primary-200 transition">
                プレミアム
              </Link>
              <Link href="/about" className="text-primary-200 font-medium">
                運営者情報
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* プロフィールセクション */}
      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* ヒーロー */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white px-8 py-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-5xl shadow-lg">
                <span className="text-primary-600">Dr.</span>
              </div>
              <div className="text-center md:text-left">
                <p className="text-primary-200 text-sm mb-2">博士（看護学）/ IT Engineer</p>
                <h2 className="text-3xl font-bold mb-3">看護デジタルニュース 編集長</h2>
                <p className="text-primary-100 max-w-lg">
                  看護学の博士号を持つエンジニアとして、医療現場のDX推進と
                  看護教育のデジタル化に取り組んでいます。
                </p>
              </div>
            </div>
          </div>

          {/* 経歴・スキル */}
          <div className="px-8 py-10">
            <div className="grid md:grid-cols-2 gap-8">
              {/* 専門領域 */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-sm font-bold">1</span>
                  専門領域
                </h3>
                <ul className="space-y-3">
                  {[
                    '看護情報学・医療DX',
                    '電子カルテシステム設計',
                    '看護教育テクノロジー',
                    'デジタルヘルス・遠隔医療',
                    'エビデンスに基づく看護実践(EBP)',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-primary-500 mt-1">&#9679;</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 技術スキル */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-sm font-bold">2</span>
                  技術スキル
                </h3>
                <ul className="space-y-3">
                  {[
                    'TypeScript / React / Next.js',
                    'Python / データ分析',
                    'クラウドインフラ (AWS / GCP)',
                    'データベース設計・最適化',
                    'AI・機械学習の医療応用',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-primary-500 mt-1">&#9679;</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* サービス */}
        <h2 className="text-2xl font-bold text-gray-800 mt-12 mb-6">提供サービス</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'コンサルティング',
              description: '医療機関のDX推進、電子カルテ導入、看護業務効率化のコンサルティングを行います。',
              price: '要相談',
              icon: '&#128161;',
            },
            {
              title: '技術研修・講演',
              description: '看護師向けIT研修、医療DXセミナー、学会での講演を承ります。',
              price: '50,000円〜',
              icon: '&#127891;',
            },
            {
              title: 'システム開発',
              description: '医療系Webアプリケーション、看護記録システム、データ分析ツールを開発します。',
              price: '要相談',
              icon: '&#128187;',
            },
          ].map((service) => (
            <div key={service.title} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="text-3xl mb-4" dangerouslySetInnerHTML={{ __html: service.icon }} />
              <h3 className="text-lg font-bold text-gray-800 mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>
              <p className="text-primary-600 font-bold">{service.price}</p>
            </div>
          ))}
        </div>

        {/* お問い合わせCTA */}
        <div className="mt-12 bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">お仕事のご相談はこちら</h2>
          <p className="text-primary-100 mb-6 max-w-lg mx-auto">
            医療DX・看護教育のデジタル化について、お気軽にご相談ください。
            初回相談は無料です。
          </p>
          <a
            href="mailto:contact@nursing-digital-news.com"
            className="inline-block bg-white text-primary-600 font-bold px-8 py-3 rounded-lg hover:bg-primary-50 transition"
          >
            メールで相談する
          </a>
        </div>

        {/* 戻る */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block text-primary-600 hover:underline"
          >
            ← ニュース一覧に戻る
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p>&copy; 2024 看護デジタルニュース All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
