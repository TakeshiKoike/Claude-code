import Link from 'next/link';

export default function PremiumSuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
            &#10003;
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            プレミアム会員登録完了
          </h1>
          <p className="text-gray-600 mb-8">
            ありがとうございます！すべてのプレミアム記事にアクセスできるようになりました。
          </p>
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-lg transition"
            >
              記事を読む
            </Link>
            <Link
              href="/premium"
              className="block text-primary-600 hover:underline text-sm"
            >
              プレミアムページに戻る
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
