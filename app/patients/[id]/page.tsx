'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  chief_complaint: string;
  medical_history: string | null;
  current_symptoms: string;
  vital_temperature: number | null;
  vital_blood_pressure: string | null;
  vital_pulse: number | null;
  vital_respiration: number | null;
  vital_spo2: number | null;
  scenario_description: string | null;
  learning_objectives: string | null;
  difficulty_level: string;
  patient_personality: string | null;
  expected_responses: string | null;
}

interface Message {
  role: 'user' | 'patient' | 'system';
  content: string;
}

export default function PatientSimulationPage() {
  const params = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showVitals, setShowVitals] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    async function fetchPatient() {
      try {
        const res = await fetch(`/api/patients/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setPatient(data);
          setMessages([
            {
              role: 'system',
              content: `シミュレーションを開始します。${data.name}さん（${data.age}歳、${data.gender}）が来院しました。`,
            },
            {
              role: 'patient',
              content: `（${data.patient_personality || '患者が座っています'}）`,
            },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch patient:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPatient();
  }, [params.id]);

  const generatePatientResponse = (question: string): string => {
    if (!patient) return '';

    const q = question.toLowerCase();

    // 痛みに関する質問
    if (q.includes('痛') || q.includes('いた')) {
      return `${patient.chief_complaint}です。`;
    }

    // いつからの質問
    if (q.includes('いつから') || q.includes('いつ頃')) {
      return '今朝からです。だんだん強くなってきた気がします。';
    }

    // 既往歴の質問
    if (q.includes('病歴') || q.includes('既往') || q.includes('今まで')) {
      return patient.medical_history || '特に大きな病気はしたことありません。';
    }

    // 症状の質問
    if (q.includes('症状') || q.includes('どんな')) {
      return patient.current_symptoms;
    }

    // アレルギーの質問
    if (q.includes('アレルギー')) {
      return '特にありません。';
    }

    // 薬の質問
    if (q.includes('薬') || q.includes('服用')) {
      return patient.medical_history ? '持病の薬を飲んでいます。' : '今は何も飲んでいません。';
    }

    // 名前の質問
    if (q.includes('名前') || q.includes('お名前')) {
      return `${patient.name}です。`;
    }

    // 年齢の質問
    if (q.includes('年齢') || q.includes('おいくつ')) {
      return `${patient.age}歳です。`;
    }

    // デフォルト応答
    const defaultResponses = [
      'そうですね...どうでしょうか。',
      'ちょっとわかりません。',
      'えーと、特に変わったことは...。',
    ];
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !patient) return;

    const userMessage: Message = { role: 'user', content: inputValue };
    const patientResponse: Message = {
      role: 'patient',
      content: generatePatientResponse(inputValue),
    };

    setMessages((prev) => [...prev, userMessage, patientResponse]);
    setInputValue('');
  };

  const quickQuestions = [
    'どこが痛みますか？',
    'いつから症状がありますか？',
    '今までに大きな病気をしたことはありますか？',
    '今飲んでいる薬はありますか？',
    'アレルギーはありますか？',
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">患者が見つかりませんでした</p>
          <Link href="/patients" className="text-primary-600 hover:underline">
            一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-primary-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">シミュレーション</h1>
              <p className="text-primary-100 text-sm">{patient.name}さん</p>
            </div>
            <Link
              href="/patients"
              className="bg-white text-primary-600 px-4 py-2 rounded hover:bg-primary-50 transition text-sm"
            >
              終了
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 flex gap-4 h-[calc(100vh-80px)]">
        {/* サイドバー */}
        <aside className="w-80 bg-white rounded-lg shadow p-4 overflow-y-auto">
          <div className="mb-6">
            <h2 className="font-bold text-gray-800 mb-2">患者情報</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">氏名:</span> {patient.name}</p>
              <p><span className="font-medium">年齢:</span> {patient.age}歳</p>
              <p><span className="font-medium">性別:</span> {patient.gender}</p>
              <p><span className="font-medium">主訴:</span> {patient.chief_complaint}</p>
            </div>
          </div>

          {/* バイタルサイン */}
          <div className="mb-6">
            <button
              onClick={() => setShowVitals(!showVitals)}
              className="w-full bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 transition text-sm font-medium"
            >
              {showVitals ? 'バイタルを隠す' : 'バイタルを測定'}
            </button>
            {showVitals && (
              <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
                <h3 className="font-medium text-blue-800 mb-2">バイタルサイン</h3>
                <div className="space-y-1 text-blue-700">
                  <p>体温: {patient.vital_temperature}℃</p>
                  <p>血圧: {patient.vital_blood_pressure} mmHg</p>
                  <p>脈拍: {patient.vital_pulse} /分</p>
                  <p>呼吸数: {patient.vital_respiration} /分</p>
                  <p>SpO2: {patient.vital_spo2}%</p>
                </div>
              </div>
            )}
          </div>

          {/* 学習目標 */}
          {patient.learning_objectives && (
            <div className="mb-6">
              <h2 className="font-bold text-gray-800 mb-2">学習目標</h2>
              <p className="text-sm text-gray-600">{patient.learning_objectives}</p>
            </div>
          )}

          {/* ヒント */}
          <div>
            <button
              onClick={() => setShowHint(!showHint)}
              className="w-full bg-yellow-100 text-yellow-700 px-4 py-2 rounded hover:bg-yellow-200 transition text-sm font-medium"
            >
              {showHint ? 'ヒントを隠す' : 'ヒントを見る'}
            </button>
            {showHint && patient.scenario_description && (
              <div className="mt-3 p-3 bg-yellow-50 rounded text-sm">
                <h3 className="font-medium text-yellow-800 mb-2">シナリオヒント</h3>
                <p className="text-yellow-700">{patient.scenario_description}</p>
              </div>
            )}
          </div>
        </aside>

        {/* チャットエリア */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow">
          {/* メッセージ一覧 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : message.role === 'patient'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-blue-100 text-blue-800 text-sm italic'
                  }`}
                >
                  {message.role === 'patient' && (
                    <span className="text-xs text-gray-500 block mb-1">患者</span>
                  )}
                  {message.role === 'user' && (
                    <span className="text-xs text-primary-200 block mb-1">あなた</span>
                  )}
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          {/* クイック質問 */}
          <div className="px-4 py-2 border-t bg-gray-50">
            <p className="text-xs text-gray-500 mb-2">よくある質問:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(q)}
                  className="text-xs bg-white border border-gray-300 px-3 py-1 rounded-full hover:bg-gray-100 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* 入力フォーム */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="患者さんに質問してください..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
              >
                送信
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
