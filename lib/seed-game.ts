import db from './db';

export function seedGameScenarios() {
  // 既存のゲームデータをクリア
  db.prepare('DELETE FROM game_choices').run();
  db.prepare('DELETE FROM game_scenarios').run();

  // シナリオ1: 夜勤の始まり
  const scenario1 = db.prepare(`
    INSERT INTO game_scenarios (id, title, description, scenario_type, is_ending)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    1,
    '夜勤の始まり',
    '午後10時。あなたは総合病院の内科病棟で夜勤に入りました。\n引き継ぎを終え、病棟を見回っていると、301号室からナースコールが鳴りました。\n301号室の田中さん（68歳、男性）は糖尿病で入院中の患者さんです。',
    '日常ケア',
    0
  );

  // シナリオ2: 患者の訴えを聞く
  const scenario2 = db.prepare(`
    INSERT INTO game_scenarios (id, title, description, scenario_type, is_ending)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    2,
    '患者の訴え',
    '病室に入ると、田中さんは少し苦しそうな表情で「なんだか気分が悪くて...」と訴えています。\n顔色はやや青白く、額に軽い発汗が見られます。',
    '患者対応',
    0
  );

  // シナリオ3: 見守りの選択
  const scenario3 = db.prepare(`
    INSERT INTO game_scenarios (id, title, description, scenario_type, is_ending)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    3,
    '様子観察',
    'あなたは田中さんの様子を見守ることにしました。\n5分後、田中さんは「少し楽になりました」と言いましたが、依然として顔色は優れません。\n\n評価: 慎重な対応ですが、より積極的なアセスメントが必要でした。',
    '患者対応',
    1
  );

  // シナリオ4: バイタルサイン測定
  const scenario4 = db.prepare(`
    INSERT INTO game_scenarios (id, title, description, scenario_type, is_ending)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    4,
    'バイタルサイン測定',
    'バイタルサインを測定しました：\n・血圧: 90/60 mmHg（通常は130/80）\n・脈拍: 100回/分（頻脈）\n・体温: 36.2℃\n・SpO2: 96%\n\n田中さんは糖尿病の患者さんです。この状況から何を考えますか？',
    '緊急対応',
    0
  );

  // シナリオ5: 低血糖の疑い
  const scenario5 = db.prepare(`
    INSERT INTO game_scenarios (id, title, description, scenario_type, is_ending)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    5,
    '低血糖への対応',
    '血糖値を測定すると52mg/dL。低血糖を起こしていました！\nすぐにブドウ糖を投与し、医師に報告。田中さんの状態は徐々に改善しました。\n\n素晴らしい判断です！糖尿病患者の気分不良では、まず低血糖を疑うことが重要です。\nバイタルサインの測定と、糖尿病という既往歴から適切に判断できました。',
    '緊急対応',
    1
  );

  // シナリオ6: 医師への報告
  const scenario6 = db.prepare(`
    INSERT INTO game_scenarios (id, title, description, scenario_type, is_ending)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    6,
    '医師への報告',
    'すぐに当直医に連絡し、状況を報告しました。\n医師の指示でバイタルサインと血糖値を測定したところ、血糖値が55mg/dLと低値でした。\n\nブドウ糖投与の指示を受け、適切に対応できました。\n良い判断です。異常を感じたらすぐに医師に報告することも重要なスキルです。',
    '緊急対応',
    1
  );

  // シナリオ7: 休ませる選択
  const scenario7 = db.prepare(`
    INSERT INTO game_scenarios (id, title, description, scenario_type, is_ending)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    7,
    '休息を促す',
    '「少し休んでくださいね」と声をかけて病室を出ました。\n\n30分後、再びナースコールが。田中さんの意識レベルが低下していました。\n低血糖による意識障害でした。\n\n反省点: 糖尿病患者の気分不良は、低血糖の可能性を常に考慮する必要があります。\nバイタルサインの測定や血糖値のチェックを行うべきでした。',
    '患者対応',
    1
  );

  console.log('Scenarios inserted:', scenario1.changes, scenario2.changes, scenario3.changes, scenario4.changes, scenario5.changes, scenario6.changes, scenario7.changes);

  // 選択肢の追加
  // シナリオ1の選択肢
  db.prepare(`
    INSERT INTO game_choices (scenario_id, choice_text, next_scenario_id, score, feedback)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    1,
    'すぐに病室に向かう',
    2,
    10,
    '迅速な対応です。患者の訴えには速やかに応じることが大切です。'
  );

  // シナリオ2の選択肢
  db.prepare(`
    INSERT INTO game_choices (scenario_id, choice_text, next_scenario_id, score, feedback)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    2,
    'バイタルサインを測定する',
    4,
    20,
    '良い判断です！客観的なデータを集めることが重要です。'
  );

  db.prepare(`
    INSERT INTO game_choices (scenario_id, choice_text, next_scenario_id, score, feedback)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    2,
    '様子を見守る',
    3,
    5,
    '観察も大切ですが、もっと積極的なアセスメントが必要でした。'
  );

  db.prepare(`
    INSERT INTO game_choices (scenario_id, choice_text, next_scenario_id, score, feedback)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    2,
    '「少し休んでください」と伝える',
    7,
    0,
    '患者の訴えを軽視してはいけません。'
  );

  // シナリオ4の選択肢
  db.prepare(`
    INSERT INTO game_choices (scenario_id, choice_text, next_scenario_id, score, feedback)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    4,
    '血糖値を測定する',
    5,
    30,
    '完璧です！糖尿病患者の低血圧・頻脈では低血糖を疑います。'
  );

  db.prepare(`
    INSERT INTO game_choices (scenario_id, choice_text, next_scenario_id, score, feedback)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    4,
    '医師に報告する',
    6,
    20,
    '報告は重要ですが、血糖値の測定も同時に行えるとより良いです。'
  );

  console.log('Game scenarios seeded successfully!');
}

// スクリプトとして実行された場合
if (require.main === module) {
  seedGameScenarios();
  console.log('Game data seeding complete!');
  process.exit(0);
}
