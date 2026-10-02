export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type GameStatus = 'playing' | 'win' | 'lose';

export type LoseReason = 'timeout' | 'moves_exhausted' | null;

export interface CardColorDef {
  id: string;
  name: string;
  symbol: string;
  symbolLabel: string;
  // Complete full Tailwind class names - NO string concatenation!
  bgClass: string;
  borderClass: string;
  textClass: string;
  hoverRingClass: string;
}

export interface CardItem {
  id: string;           // unique card id e.g. "card-0", "card-1"
  pairId: string;       // matched if pairId is identical
  color: CardColorDef;  // predefined static color object
  isFlipped: boolean;   // currently face up
  isMatched: boolean;   // successfully matched
}

export interface LevelConfig {
  name: DifficultyLevel;
  label: string;
  pairs: number;
  totalCards: number;
  timeLimitSeconds: number;
  maxMoves: number;
  gridColsClass: string;
}

export interface GameStats {
  stage: number;
  score: number;
  moves: number;
  maxMoves: number;
  matchedPairs: number;
  totalPairs: number;
  timeLeft: number;
  streak: number;
  status: GameStatus;
  statusMessage: string;
  loseReason: LoseReason;
}
