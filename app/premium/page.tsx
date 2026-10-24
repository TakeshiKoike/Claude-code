'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PremiumPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  const handleCheckout = async (plan: 'monthly' | 'yearly') => {
    setLoading(plan);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, email: email || undefined }),
      });
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        alert(data.error);
      }
    } catch (error) {
      alert('エラーが発生しました。しばらくしてからお試しください。');
    } finally {
      setLoading(null);
    }
  };

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
              <Link href="/premium" className="text-primary-200 font-medium">
                プレミアム
              </Link>
              <Link href="/about" className="text-white hover:text-primary-200 transition">
                運営者情報
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="inline-block bg-yellow-400 text-yellow-900 text-sm font-bold px-4 py-1 rounded-full mb-6">
            PREMIUM
          </div>
          <h2 className="text-4xl font-bold mb-4">
            看護DXの最前線を、あなたに
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            博士号を持つ専門家が執筆する深掘り分析記事、最新研究レビュー、
            実践ガイドにフルアクセス。
          </p>
        </div>
      </section>

      {/* 特典 */}
      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">プレミアム会員の特典</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: '専門家による深掘り分析', desc: '博士号研究者の視点で、医療DXの最新動向を徹底解説' },
            { title: '最新研究レビュー', desc: '国内外の看護・医療IT論文を分かりやすく要約' },
            { title: '実践ガイド', desc: '現場ですぐに使えるDX導入ステップを具体的に解説' },
            { title: '月1回のQ&Aセッション', desc: '医療DXに関する疑問に専門家が直接回答' },
            { title: '会員限定メルマガ', desc: '週1回、プレミアム会員だけの特別コンテンツを配信' },
            { title: '過去記事アーカイブ', desc: 'すべてのプレミアム記事に無制限アクセス' },
          ].map((benefit) => (
            <div key={benefit.title} className="flex gap-4 bg-white rounded-xl p-5 shadow-sm">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 font-bold flex-shrink-0">
                &#10003;
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">{benefit.title}</h4>
                <p className="text-gray-600 text-sm">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 料金プラン */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">料金プラン</h3>
          <p className="text-center text-gray-600 mb-8">年額プランなら2ヶ月分お得</p>

          {/* メールアドレス入力 */}
          <div className="max-w-md mx-auto mb-8">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレスを入力"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* 月額プラン */}
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <h4 className="text-lg font-bold text-gray-800 mb-2">月額プラン</h4>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">980</span>
                <span className="text-gray-600">円/月</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">いつでもキャンセル可能</p>
              <button
                onClick={() => handleCheckout('monthly')}
                disabled={loading !== null}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === 'monthly' ? '処理中...' : '月額で始める'}
              </button>
            </div>

            {/* 年額プラン */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-2 border-primary-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                おすすめ
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">年額プラン</h4>
              <div className="mb-1">
                <span className="text-4xl font-bold text-gray-900">9,800</span>
                <span className="text-gray-600">円/年</span>
              </div>
              <p className="text-primary-600 text-sm font-medium mb-1">月額換算 約817円/月</p>
              <p className="text-gray-500 text-sm mb-6">2ヶ月分お得</p>
              <button
                onClick={() => handleCheckout('yearly')}
                disabled={loading !== null}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === 'yearly' ? '処理中...' : '年額で始める'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">よくある質問</h3>
        <div className="space-y-4">
          {[
            { q: '無料記事とプレミアム記事の違いは？', a: '無料記事は一般的なニュース速報が中心です。プレミアム記事は、博士号研究者による深掘り分析、研究レビュー、実践ガイドなど、より専門的で実践的な内容をお届けします。' },
            { q: 'いつでもキャンセルできますか？', a: 'はい、月額・年額ともにいつでもキャンセル可能です。キャンセル後も、期間終了まではプレミアムコンテンツにアクセスできます。' },
            { q: '領収書は発行できますか？', a: 'はい、Stripeの決済画面から領収書のダウンロードが可能です。法人利用の場合は別途ご相談ください。' },
            { q: '団体割引はありますか？', a: '5名以上のチーム利用には割引プランをご用意しています。お問い合わせください。' },
          ].map((faq) => (
            <div key={faq.q} className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="font-bold text-gray-800 mb-2">{faq.q}</h4>
              <p className="text-gray-600 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 戻る */}
      <div className="text-center pb-12">
        <Link href="/" className="text-primary-600 hover:underline">
          ← ニュース一覧に戻る
        </Link>
      </div>

      {/* フッター */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-6 text-center">
          <p>&copy; 2024 看護デジタルニュース All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
