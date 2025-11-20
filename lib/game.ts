import db from './db';

export interface GameScenario {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  scenario_type: string;
  is_ending: number;
  created_at: string;
}

export interface GameChoice {
  id: number;
  scenario_id: number;
  choice_text: string;
  next_scenario_id: number | null;
  score: number;
  feedback: string | null;
}

export function getScenario(id: number): GameScenario | undefined {
  const scenario = db.prepare('SELECT * FROM game_scenarios WHERE id = ?').get(id) as GameScenario | undefined;
  return scenario;
}

export function getChoicesForScenario(scenarioId: number): GameChoice[] {
  const choices = db.prepare('SELECT * FROM game_choices WHERE scenario_id = ?').all(scenarioId) as GameChoice[];
  return choices;
}

export function getAllScenarios(): GameScenario[] {
  const scenarios = db.prepare('SELECT * FROM game_scenarios ORDER BY id').all() as GameScenario[];
  return scenarios;
}

export function getStartScenario(): GameScenario | undefined {
  // IDが1のシナリオをスタート地点とする
  return getScenario(1);
}
