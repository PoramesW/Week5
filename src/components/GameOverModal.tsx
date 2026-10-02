import React, { useEffect, useRef } from 'react';
import { GameStatus, DifficultyLevel, LoseReason } from '../types/game';
import { Trophy, Clock, RotateCcw, AlertTriangle, ArrowRight, Shuffle } from 'lucide-react';

interface GameOverModalProps {
  status: GameStatus;
  loseReason: LoseReason;
  stage: number;
  score: number;
  matchedPairs: number;
  totalPairs: number;
  timeLeft: number;
  moves: number;
  maxMoves: number;
  level: DifficultyLevel;
  onRestart: () => void;
  onNextStage: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  status,
  loseReason,
  stage,
  score,
  matchedPairs,
  totalPairs,
  timeLeft,
  moves,
  maxMoves,
  level,
  onRestart,
  onNextStage,
}) => {
  const primaryButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (status === 'win' || status === 'lose') {
      primaryButtonRef.current?.focus();
    }
  }, [status]);

  if (status === 'playing') return null;

  const isWin = status === 'win';
  const isMovesExhausted = loseReason === 'moves_exhausted';

  const levelTitle =
    level === 'easy' ? 'Easy' : level === 'medium' ? 'Medium' : 'Hard';

  // Title and subtitle depending on win or specific lose cause
  const modalTitle = isWin
    ? `Stage ${stage} Cleared!`
    : isMovesExhausted
    ? 'Out of Moves!'
    : "Time's Up!";

  const modalSubtitle = isWin
    ? `Awesome! You solved Stage ${stage} on ${levelTitle} mode. Ready for the next stage?`
    : isMovesExhausted
    ? `You ran out of card flip attempts (${maxMoves} rounds) on ${levelTitle} · Stage ${stage}.`
    : `Time ran out on ${levelTitle} · Stage ${stage}.`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-result-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-300"
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center flex flex-col items-center">
        {/* Status Icon */}
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${
            isWin
              ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 ring-4 ring-amber-100 dark:ring-amber-950/60'
              : 'bg-gradient-to-tr from-rose-500 to-red-400 text-white ring-4 ring-rose-100 dark:ring-rose-950/60'
          }`}
        >
          {isWin ? (
            <Trophy className="w-9 h-9 sm:w-11 sm:h-11 animate-bounce" />
          ) : isMovesExhausted ? (
            <AlertTriangle className="w-9 h-9 sm:w-11 sm:h-11" />
          ) : (
            <Clock className="w-9 h-9 sm:w-11 sm:h-11" />
          )}
        </div>

        {/* Title */}
        <h2
          id="game-result-title"
          className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white"
        >
          {modalTitle}
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {modalSubtitle}
        </p>

        {/* Primary Score & Stage Stats Display */}
        <div className="my-5 w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            <span>Score</span>
            <span className="text-indigo-600 dark:text-indigo-400">
              {levelTitle} · Stage {stage}
            </span>
          </div>
          <div className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums text-indigo-600 dark:text-indigo-400 my-1">
            {score}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Pairs</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {matchedPairs} / {totalPairs}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Time Left</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {timeLeft}s
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Moves Used</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {moves} / {maxMoves}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
          {isWin ? (
            <>
              <button
                ref={primaryButtonRef}
                type="button"
                onClick={onNextStage}
                className="w-full py-3 px-5 text-sm sm:text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
              >
                <span>Next Stage</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                type="button"
                onClick={onRestart}
                className="w-full py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart {levelTitle}</span>
              </button>
            </>
          ) : (
            <button
              ref={primaryButtonRef}
              type="button"
              onClick={onRestart}
              className="w-full py-3 px-5 text-sm sm:text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Try Again (Restart Level)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
