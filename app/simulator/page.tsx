'use client';

import { useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { VRM } from '@pixiv/three-vrm';

// クライアントサイドのみでレンダリング（Three.jsはSSR非対応）
const PatientViewer = dynamic(
  () => import('@/components/avatar/PatientViewer'),
  { ssr: false }
);

// サンプル患者データ
const samplePatients = [
  {
    id: 1,
    name: '山田 太郎',
    age: 65,
    gender: '男性',
    chiefComplaint: '胸の痛み',
    vrmUrl: '/models/sample.vrm'
  },
  {
    id: 2,
    name: '佐藤 花子',
    age: 45,
    gender: '女性',
    chiefComplaint: '頭痛',
    vrmUrl: '/models/seed-san.vrm'
  }
];

export default function SimulatorPage() {
  const [selectedPatient, setSelectedPatient] = useState(samplePatients[0]);
  const [customVrmUrl, setCustomVrmUrl] = useState<string | null>(null);
  const [isVrmLoaded, setIsVrmLoaded] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'patient'; text: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const vrmRef = useRef<VRM | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // VRMファイルのアップロード
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.vrm')) {
      const url = URL.createObjectURL(file);
      setCustomVrmUrl(url);
      setIsVrmLoaded(false);
    }
  }, []);

  // VRM読み込み完了
  const handleVRMLoaded = useCallback((vrm: VRM) => {
    vrmRef.current = vrm;
    setIsVrmLoaded(true);
    console.log('VRM loaded:', vrm);
  }, []);

  // チャット送信（ダミー実装 - 後でAI連携）
  const handleSendMessage = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // ユーザーメッセージを追加
    setChatMessages(prev => [...prev, { role: 'user', text: inputText }]);

    // ダミーの患者応答（後でOpenAI APIに置き換え）
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        role: 'patient',
        text: `（${selectedPatient.name}）そうですね...${selectedPatient.chiefComplaint}について、もう少し詳しくお話しします。`
      }]);
    }, 1000);

    setInputText('');
  }, [inputText, selectedPatient]);

  // 現在使用するVRM URL
  const currentVrmUrl = customVrmUrl || selectedPatient.vrmUrl;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
              ← ホームに戻る
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">
              デジタル模擬患者シミュレーター
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            看護学生向け学習システム
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左サイドバー：患者選択 */}
          <div className="lg:col-span-1 space-y-4">
            {/* VRMアップロード */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-3">アバター設定</h2>
              <input
                ref={fileInputRef}
                type="file"
                accept=".vrm"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
              >
                VRMファイルをアップロード
              </button>
              {customVrmUrl && (
                <p className="text-sm text-green-600 mt-2">
                  カスタムVRMを使用中
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                ※ VRoid Hub等から無料のVRMモデルをダウンロードできます
              </p>
            </div>

            {/* 患者選択 */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-3">患者を選択</h2>
              <div className="space-y-2">
                {samplePatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => {
                      setSelectedPatient(patient);
                      setCustomVrmUrl(null);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition ${
                      selectedPatient.id === patient.id && !customVrmUrl
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-gray-500">
                      {patient.age}歳 {patient.gender} / {patient.chiefComplaint}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* 患者情報 */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-3">患者情報</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">氏名</dt>
                  <dd className="font-medium">{selectedPatient.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">年齢</dt>
                  <dd className="font-medium">{selectedPatient.age}歳</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">性別</dt>
                  <dd className="font-medium">{selectedPatient.gender}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">主訴</dt>
                  <dd className="font-medium text-red-600">{selectedPatient.chiefComplaint}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* 中央：3Dアバター表示 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 3Dビューア */}
            <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: '500px' }}>
              <PatientViewer
                vrmUrl={currentVrmUrl}
                patientName={selectedPatient.name}
                onVRMLoaded={handleVRMLoaded}
              />
            </div>

            {/* チャットエリア */}
            <div className="bg-white rounded-lg shadow">
              {/* チャット履歴 */}
              <div className="h-48 overflow-y-auto p-4 border-b">
                {chatMessages.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    患者さんに話しかけてみましょう
                  </p>
                ) : (
                  <div className="space-y-3">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] px-4 py-2 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 入力フォーム */}
              <form onSubmit={handleSendMessage} className="p-4 flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="患者さんへの質問を入力..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
                >
                  送信
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
