import Link from 'next/link';
import { getAllPatients, insertSamplePatients } from '@/lib/patients';

// サンプルデータを初期化
insertSamplePatients();

export default function PatientsPage() {
  const patients = getAllPatients();

  const difficultyColors: { [key: string]: string } = {
    '初級': 'bg-green-100 text-green-700',
    '中級': 'bg-yellow-100 text-yellow-700',
    '上級': 'bg-red-100 text-red-700',
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-primary-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">デジタル模擬患者</h1>
              <p className="text-primary-100 mt-1">Digital Simulated Patient</p>
            </div>
            <Link
              href="/"
              className="bg-white text-primary-600 px-4 py-2 rounded hover:bg-primary-50 transition"
            >
              ニュースへ戻る
            </Link>
          </div>
        </div>
      </header>

      {/* 説明 */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">シミュレーション学習</h2>
          <p className="text-gray-600">
            デジタル模擬患者との対話を通じて、臨床現場で必要なアセスメントスキルを練習できます。
            各シナリオには学習目標が設定されており、難易度別に選択できます。
          </p>
        </div>
      </section>

      {/* 難易度フィルター */}
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-3">
          <div className="flex space-x-4">
            <Link
              href="/patients"
              className="px-4 py-2 rounded bg-primary-600 text-white"
            >
              すべて
            </Link>
            <Link
              href="/patients?difficulty=初級"
              className="px-4 py-2 rounded bg-green-100 text-green-700 hover:bg-green-200"
            >
              初級
            </Link>
            <Link
              href="/patients?difficulty=中級"
              className="px-4 py-2 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
            >
              中級
            </Link>
            <Link
              href="/patients?difficulty=上級"
              className="px-4 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200"
            >
              上級
            </Link>
          </div>
        </div>
      </nav>

      {/* 模擬患者一覧 */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">模擬患者がまだ登録されていません</p>
            </div>
          ) : (
            patients.map((patient) => (
              <Link
                key={patient.id}
                href={`/patients/${patient.id}`}
                className="card group hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 text-xl font-bold">
                        {patient.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 group-hover:text-primary-600 transition">
                        {patient.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {patient.age}歳 {patient.gender}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${difficultyColors[patient.difficulty_level] || 'bg-gray-100 text-gray-700'}`}>
                    {patient.difficulty_level}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">主訴</p>
                  <p className="text-gray-600">{patient.chief_complaint}</p>
                </div>

                {patient.learning_objectives && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700">学習目標</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{patient.learning_objectives}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex space-x-4 text-xs text-gray-500">
                    <span>体温: {patient.vital_temperature}℃</span>
                    <span>SpO2: {patient.vital_spo2}%</span>
                  </div>
                  <span className="text-primary-600 text-sm font-medium group-hover:underline">
                    開始 →
                  </span>
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
