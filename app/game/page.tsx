'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface GameScenario {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  scenario_type: string;
  is_ending: number;
}

interface GameChoice {
  id: number;
  scenario_id: number;
  choice_text: string;
  next_scenario_id: number | null;
  score: number;
  feedback: string | null;
}

export default function GamePage() {
  const [currentScenario, setCurrentScenario] = useState<GameScenario | null>(null);
  const [choices, setChoices] = useState<GameChoice[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [gameHistory, setGameHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChoice, setSelectedChoice] = useState<GameChoice | null>(null);

  // ゲーム開始時にシナリオ1を読み込む
  useEffect(() => {
    loadScenario(1);
  }, []);

  const loadScenario = async (scenarioId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/game/scenario/${scenarioId}`);
      const data = await response.json();

      if (data.scenario) {
        setCurrentScenario(data.scenario);
        setChoices(data.choices || []);
        setSelectedChoice(null);
      }
    } catch (error) {
      console.error('Failed to load scenario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = (choice: GameChoice) => {
    // スコアを加算
    setTotalScore(prev => prev + choice.score);

    // 選択肢を記録
    setSelectedChoice(choice);

    // 履歴に追加
    if (currentScenario) {
      setGameHistory(prev => [...prev, `${currentScenario.title}: ${choice.choice_text}`]);
    }

    // フィードバック表示後、次のシナリオへ
    if (choice.next_scenario_id) {
      setTimeout(() => {
        loadScenario(choice.next_scenario_id!);
      }, 3000);
    }
  };

  const resetGame = () => {
    setTotalScore(0);
    setGameHistory([]);
    setSelectedChoice(null);
    loadScenario(1);
  };

  if (loading && !currentScenario) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">シナリオを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ヘッダー */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">看護アドベンチャーゲーム</h1>
              <p className="text-sm text-gray-600">Nursing Adventure Game</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="text-right">
                <p className="text-sm text-gray-600">スコア</p>
                <p className="text-2xl font-bold text-primary-600">{totalScore}</p>
              </div>
              <Link
                href="/"
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                トップへ戻る
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* シナリオ表示エリア */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            {currentScenario && (
              <>
                <div className="mb-4">
                  <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                    {currentScenario.scenario_type}
                  </span>
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  {currentScenario.title}
                </h2>

                {currentScenario.image_url && (
                  <div className="mb-6 rounded-lg overflow-hidden">
                    <img
                      src={currentScenario.image_url}
                      alt={currentScenario.title}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}

                <div className="prose max-w-none mb-8">
                  <p className="text-lg text-gray-700 whitespace-pre-line leading-relaxed">
                    {currentScenario.description}
                  </p>
                </div>

                {/* フィードバック表示 */}
                {selectedChoice && selectedChoice.feedback && (
                  <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <p className="text-blue-800 font-medium">
                      {selectedChoice.feedback}
                    </p>
                    <p className="text-sm text-blue-600 mt-2">
                      獲得スコア: +{selectedChoice.score}
                    </p>
                  </div>
                )}

                {/* 選択肢 */}
                {!currentScenario.is_ending && !selectedChoice && choices.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                      どうしますか？
                    </h3>
                    {choices.map((choice) => (
                      <button
                        key={choice.id}
                        onClick={() => handleChoice(choice)}
                        className="w-full text-left p-4 bg-gradient-to-r from-primary-50 to-primary-100
                                 hover:from-primary-100 hover:to-primary-200
                                 border-2 border-primary-300 rounded-lg
                                 transition-all duration-200 transform hover:scale-[1.02]
                                 shadow-sm hover:shadow-md"
                      >
                        <span className="text-primary-700 font-medium text-lg">
                          → {choice.choice_text}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* ゲーム終了時 */}
                {currentScenario.is_ending && (
                  <div className="text-center mt-8">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg mb-6">
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">
                        シナリオ終了
                      </h3>
                      <p className="text-xl text-gray-700 mb-2">
                        最終スコア: <span className="text-3xl font-bold text-primary-600">{totalScore}</span>
                      </p>
                    </div>
                    <button
                      onClick={resetGame}
                      className="bg-primary-600 text-white px-8 py-3 rounded-lg
                               hover:bg-primary-700 transition text-lg font-medium
                               shadow-md hover:shadow-lg"
                    >
                      もう一度プレイする
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ゲーム履歴 */}
          {gameHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">プレイ履歴</h3>
              <div className="space-y-2">
                {gameHistory.map((entry, index) => (
                  <div key={index} className="text-sm text-gray-600 border-l-2 border-gray-300 pl-3 py-1">
                    {index + 1}. {entry}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
