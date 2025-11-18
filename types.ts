
export interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: 'low' | 'high';
}

export type GameState = 'start' | 'playing' | 'finished' | 'hallOfFame';

export interface HallOfFameEntry {
  name: string;
  grade: number;
  score: number;
  date: number;
}
