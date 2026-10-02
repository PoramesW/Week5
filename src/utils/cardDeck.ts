import { CardColorDef, CardItem, DifficultyLevel, LevelConfig } from '../types/game';

// 12 carefully chosen distinct colors with static, COMPLETE Tailwind classes
// Strictly NO dynamic string interpolation (Requirement 6)
export const AVAILABLE_COLORS: CardColorDef[] = [
  {
    id: 'red',
    name: 'Red',
    symbol: '★',
    symbolLabel: 'Star',
    bgClass: 'bg-red-500',
    borderClass: 'border-red-600',
    textClass: 'text-white',
    hoverRingClass: 'focus-visible:ring-red-400',
  },
  {
    id: 'blue',
    name: 'Blue',
    symbol: '◆',
    symbolLabel: 'Diamond',
    bgClass: 'bg-blue-600',
    borderClass: 'border-blue-700',
    textClass: 'text-white',
    hoverRingClass: 'focus-visible:ring-blue-400',
  },
  {
    id: 'emerald',
    name: 'Green',
    symbol: '▲',
    symbolLabel: 'Triangle',
    bgClass: 'bg-emerald-500',
    borderClass: 'border-emerald-600',
    textClass: 'text-white',
    hoverRingClass: 'focus-visible:ring-emerald-400',
  },
  {
    id: 'amber',
    name: 'Yellow',
    symbol: '●',
    symbolLabel: 'Circle',
    bgClass: 'bg-amber-400',
    borderClass: 'border-amber-500',
    textClass: 'text-slate-950',
    hoverRingClass: 'focus-visible:ring-amber-400',
  },
  {
    id: 'purple',
    name: 'Purple',
    symbol: '■',
    symbolLabel: 'Square',
    bgClass: 'bg-purple-600',
    borderClass: 'border-purple-700',
    textClass: 'text-white',
    hoverRingClass: 'focus-visible:ring-purple-400',
  },
  {
    id: 'orange',
    name: 'Orange',
    symbol: '⬟',
    symbolLabel: 'Pentagon',
    bgClass: 'bg-orange-500',
    borderClass: 'border-orange-600',
    textClass: 'text-white',
    hoverRingClass: 'focus-visible:ring-orange-400',
  },
  {
    id: 'pink',
    name: 'Pink',
    symbol: '♥',
    symbolLabel: 'Heart',
    bgClass: 'bg-pink-500',
    borderClass: 'border-pink-600',
    textClass: 'text-white',
    hoverRingClass: 'focus-visible:ring-pink-400',
  },
  {
    id: 'cyan',
    name: 'Cyan',
    symbol: '☼',
    symbolLabel: 'Sun',
    bgClass: 'bg-cyan-500',
    borderClass: 'border-cyan-600',
    textClass: 'text-slate-950',
    hoverRingClass: 'focus-visible:ring-cyan-400',
  },
  {
    id: 'indigo',
    name: 'Indigo',
    symbol: '☽',
    symbolLabel: 'Moon',
    bgClass: 'bg-indigo-600',
    borderClass: 'border-indigo-700',
    textClass: 'text-white',
    hoverRingClass: 'focus-visible:ring-indigo-400',
  },
  {
    id: 'teal',
    name: 'Teal',
    symbol: '✚',
    symbolLabel: 'Cross',
    bgClass: 'bg-teal-500',
    borderClass: 'border-teal-600',
    textClass: 'text-white',
    hoverRingClass: 'focus-visible:ring-teal-400',
  },
  {
    id: 'lime',
    name: 'Lime',
    symbol: '✿',
    symbolLabel: 'Flower',
    bgClass: 'bg-lime-500',
    borderClass: 'border-lime-600',
    textClass: 'text-slate-950',
    hoverRingClass: 'focus-visible:ring-lime-400',
  },
  {
    id: 'rose',
    name: 'Rose',
    symbol: '♣',
    symbolLabel: 'Clover',
    bgClass: 'bg-rose-600',
    borderClass: 'border-rose-700',
    textClass: 'text-white',
    hoverRingClass: 'focus-visible:ring-rose-400',
  },
];

export const LEVEL_CONFIGS: Record<DifficultyLevel, LevelConfig> = {
  easy: {
    name: 'easy',
    label: 'Easy',
    pairs: 4,
    totalCards: 8,
    timeLimitSeconds: 60,
    maxMoves: 10,
    gridColsClass: 'grid-cols-2 sm:grid-cols-4',
  },
  medium: {
    name: 'medium',
    label: 'Medium',
    pairs: 6,
    totalCards: 12,
    timeLimitSeconds: 50,
    maxMoves: 15,
    gridColsClass: 'grid-cols-3 sm:grid-cols-4',
  },
  hard: {
    name: 'hard',
    label: 'Hard',
    pairs: 8,
    totalCards: 16,
    timeLimitSeconds: 45,
    maxMoves: 20,
    gridColsClass: 'grid-cols-4',
  },
};

/**
 * Fisher-Yates shuffle algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generates and shuffles a new deck based on difficulty level.
 * Randomly picks different colors from the 12-color pool each stage!
 */
export function createShuffledDeck(level: DifficultyLevel): CardItem[] {
  const config = LEVEL_CONFIGS[level];

  // Randomly select N distinct colors from the pool for this stage
  const randomizedColorPool = shuffleArray(AVAILABLE_COLORS);
  const selectedColors = randomizedColorPool.slice(0, config.pairs);

  const rawCards: CardItem[] = [];

  selectedColors.forEach((color) => {
    // Each color produces exactly 2 matching cards
    rawCards.push({
      id: `${color.id}-a-${Math.random().toString(36).substring(2, 7)}`,
      pairId: color.id,
      color,
      isFlipped: false,
      isMatched: false,
    });
    rawCards.push({
      id: `${color.id}-b-${Math.random().toString(36).substring(2, 7)}`,
      pairId: color.id,
      color,
      isFlipped: false,
      isMatched: false,
    });
  });

  return shuffleArray(rawCards);
}
