import db from './db';

export interface SimulatedPatient {
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
  created_at: string;
  updated_at: string;
}

export interface CreatePatientInput {
  name: string;
  age: number;
  gender: string;
  chief_complaint: string;
  medical_history?: string;
  current_symptoms: string;
  vital_temperature?: number;
  vital_blood_pressure?: string;
  vital_pulse?: number;
  vital_respiration?: number;
  vital_spo2?: number;
  scenario_description?: string;
  learning_objectives?: string;
  difficulty_level?: string;
  patient_personality?: string;
  expected_responses?: string;
}

// 全ての模擬患者を取得
export function getAllPatients(): SimulatedPatient[] {
  const stmt = db.prepare('SELECT * FROM simulated_patients ORDER BY created_at DESC');
  return stmt.all() as SimulatedPatient[];
}

// IDで模擬患者を取得
export function getPatientById(id: number): SimulatedPatient | undefined {
  const stmt = db.prepare('SELECT * FROM simulated_patients WHERE id = ?');
  return stmt.get(id) as SimulatedPatient | undefined;
}

// 難易度で模擬患者をフィルタ
export function getPatientsByDifficulty(difficulty: string): SimulatedPatient[] {
  const stmt = db.prepare('SELECT * FROM simulated_patients WHERE difficulty_level = ? ORDER BY created_at DESC');
  return stmt.all(difficulty) as SimulatedPatient[];
}

// 模擬患者を作成
export function createPatient(input: CreatePatientInput): SimulatedPatient {
  const stmt = db.prepare(`
    INSERT INTO simulated_patients (
      name, age, gender, chief_complaint, medical_history, current_symptoms,
      vital_temperature, vital_blood_pressure, vital_pulse, vital_respiration, vital_spo2,
      scenario_description, learning_objectives, difficulty_level, patient_personality, expected_responses
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    input.name,
    input.age,
    input.gender,
    input.chief_complaint,
    input.medical_history || null,
    input.current_symptoms,
    input.vital_temperature || null,
    input.vital_blood_pressure || null,
    input.vital_pulse || null,
    input.vital_respiration || null,
    input.vital_spo2 || null,
    input.scenario_description || null,
    input.learning_objectives || null,
    input.difficulty_level || '初級',
    input.patient_personality || null,
    input.expected_responses || null
  );

  return getPatientById(result.lastInsertRowid as number)!;
}

// 模擬患者を更新
export function updatePatient(id: number, input: Partial<CreatePatientInput>): SimulatedPatient | undefined {
  const existing = getPatientById(id);
  if (!existing) return undefined;

  const updates: string[] = [];
  const values: (string | number | null)[] = [];

  if (input.name !== undefined) { updates.push('name = ?'); values.push(input.name); }
  if (input.age !== undefined) { updates.push('age = ?'); values.push(input.age); }
  if (input.gender !== undefined) { updates.push('gender = ?'); values.push(input.gender); }
  if (input.chief_complaint !== undefined) { updates.push('chief_complaint = ?'); values.push(input.chief_complaint); }
  if (input.medical_history !== undefined) { updates.push('medical_history = ?'); values.push(input.medical_history); }
  if (input.current_symptoms !== undefined) { updates.push('current_symptoms = ?'); values.push(input.current_symptoms); }
  if (input.vital_temperature !== undefined) { updates.push('vital_temperature = ?'); values.push(input.vital_temperature); }
  if (input.vital_blood_pressure !== undefined) { updates.push('vital_blood_pressure = ?'); values.push(input.vital_blood_pressure); }
  if (input.vital_pulse !== undefined) { updates.push('vital_pulse = ?'); values.push(input.vital_pulse); }
  if (input.vital_respiration !== undefined) { updates.push('vital_respiration = ?'); values.push(input.vital_respiration); }
  if (input.vital_spo2 !== undefined) { updates.push('vital_spo2 = ?'); values.push(input.vital_spo2); }
  if (input.scenario_description !== undefined) { updates.push('scenario_description = ?'); values.push(input.scenario_description); }
  if (input.learning_objectives !== undefined) { updates.push('learning_objectives = ?'); values.push(input.learning_objectives); }
  if (input.difficulty_level !== undefined) { updates.push('difficulty_level = ?'); values.push(input.difficulty_level); }
  if (input.patient_personality !== undefined) { updates.push('patient_personality = ?'); values.push(input.patient_personality); }
  if (input.expected_responses !== undefined) { updates.push('expected_responses = ?'); values.push(input.expected_responses); }

  if (updates.length === 0) return existing;

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  const stmt = db.prepare(`UPDATE simulated_patients SET ${updates.join(', ')} WHERE id = ?`);
  stmt.run(...values);

  return getPatientById(id);
}

// 模擬患者を削除
export function deletePatient(id: number): boolean {
  const stmt = db.prepare('DELETE FROM simulated_patients WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

// サンプル模擬患者データを挿入
export function insertSamplePatients(): void {
  const existingCount = db.prepare('SELECT COUNT(*) as count FROM simulated_patients').get() as { count: number };
  if (existingCount.count > 0) return;

  const samplePatients: CreatePatientInput[] = [
    {
      name: '山田 太郎',
      age: 68,
      gender: '男性',
      chief_complaint: '胸の痛みと息苦しさ',
      medical_history: '高血圧（10年前から）、糖尿病（5年前から）',
      current_symptoms: '2時間前から胸部中央に締め付けられるような痛みがある。冷や汗をかいている。',
      vital_temperature: 36.8,
      vital_blood_pressure: '165/95',
      vital_pulse: 98,
      vital_respiration: 24,
      vital_spo2: 94,
      scenario_description: '急性冠症候群が疑われる患者。迅速なアセスメントと医師への報告が求められる。',
      learning_objectives: '胸痛患者のアセスメント、12誘導心電図の必要性の判断、緊急性の評価',
      difficulty_level: '中級',
      patient_personality: '不安が強く、質問が多い。痛みで話しづらそうにしている。',
      expected_responses: '「痛みはどのくらいですか？」→「10段階で8くらい」「いつから痛みますか？」→「2時間くらい前から」'
    },
    {
      name: '佐藤 花子',
      age: 45,
      gender: '女性',
      chief_complaint: '頭痛と吐き気',
      medical_history: '片頭痛の既往あり',
      current_symptoms: '今朝から激しい頭痛。光がまぶしく感じる。吐き気もある。',
      vital_temperature: 36.5,
      vital_blood_pressure: '130/82',
      vital_pulse: 78,
      vital_respiration: 18,
      vital_spo2: 98,
      scenario_description: '片頭痛の急性発作患者。ただし、くも膜下出血などの除外が必要。',
      learning_objectives: '頭痛のアセスメント、危険な頭痛の見分け方、適切な対応',
      difficulty_level: '初級',
      patient_personality: '比較的落ち着いているが、痛みで目を閉じていることが多い。',
      expected_responses: '「いつもの頭痛と違いますか？」→「いつもより強い気がする」「首のこわばりはありますか？」→「少しあるかも」'
    },
    {
      name: '鈴木 一郎',
      age: 82,
      gender: '男性',
      chief_complaint: '転倒後の腰痛',
      medical_history: '骨粗しょう症、認知症（軽度）',
      current_symptoms: '自宅で転倒し、腰を強打。動くと痛みが増強する。',
      vital_temperature: 36.3,
      vital_blood_pressure: '145/88',
      vital_pulse: 84,
      vital_respiration: 20,
      vital_spo2: 96,
      scenario_description: '高齢者の転倒による腰椎圧迫骨折が疑われる患者。安静と適切な移動介助が必要。',
      learning_objectives: '高齢者の転倒アセスメント、骨折の可能性の評価、安全な移動介助',
      difficulty_level: '中級',
      patient_personality: '認知症があるため、質問に対する回答があいまいなことがある。',
      expected_responses: '「どこが痛みますか？」→「腰の辺り...ここ」「転んだときのことを覚えていますか？」→「えーと...足がもつれて...」'
    }
  ];

  for (const patient of samplePatients) {
    createPatient(patient);
  }
}
