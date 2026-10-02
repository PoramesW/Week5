import React from 'react';
import { DifficultyLevel, GameStatus } from '../types/game';
import { RotateCcw, HelpCircle, Sparkles, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface ControlBarProps {
  currentLevel: DifficultyLevel;
  status: GameStatus;
  statusMessage: string;
  onSelectLevel: (level: DifficultyLevel) => void;
  onRestart: () => void;
  onOpenHowToPlay: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  currentLevel,
  status,
  statusMessage,
  onSelectLevel,
  onRestart,
  onOpenHowToPlay,
}) => {
  // Determine status message icon and color styling
  const getStatusVisuals = () => {
    if (status === 'win' || statusMessage.includes('Win') || statusMessage.includes('Match!')) {
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
        icon: <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
      };
    }
    if (status === 'lose' || statusMessage.includes("Time's Up") || statusMessage.includes('Try again!')) {
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200',
        icon: <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />,
      };
    }
    return {
      bg: 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300',
      icon: <Info className="w-4 h-4 text-indigo-500 shrink-0" />,
    };
  };

  const statusVisual = getStatusVisuals();

  return (
    <section aria-label="Game Controls" className="w-full max-w-3xl mx-auto px-4 py-2 sm:py-3 flex flex-col gap-2.5">
      {/* Dynamic Status Feedback Message Banner */}
      <div
        role="status"
        aria-live="polite"
        className={`w-full py-2.5 px-4 rounded-xl border flex items-center justify-center gap-2 text-center text-sm font-semibold transition-all duration-200 shadow-xs ${statusVisual.bg}`}
      >
        {statusVisual.icon}
        <span className="tracking-wide">{statusMessage}</span>
      </div>

      {/* Action Controls & Difficulty Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 shadow-xs">
        {/* Restart Button */}
        <button
          type="button"
          onClick={onRestart}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Restart</span>
        </button>

        {/* Level Selector: Easy, Medium, Hard */}
        <div
          role="group"
          aria-label="Select Difficulty Level"
          className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg"
        >
          <button
            type="button"
            onClick={() => onSelectLevel('easy')}
            aria-pressed={currentLevel === 'easy'}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-all cursor-pointer ${
              currentLevel === 'easy'
                ? 'bg-indigo-600 text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 font-medium'
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`}
          >
            Easy
          </button>

          <button
            type="button"
            onClick={() => onSelectLevel('medium')}
            aria-pressed={currentLevel === 'medium'}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-all cursor-pointer ${
              currentLevel === 'medium'
                ? 'bg-indigo-600 text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 font-medium'
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`}
          >
            Medium
          </button>

          <button
            type="button"
            onClick={() => onSelectLevel('hard')}
            aria-pressed={currentLevel === 'hard'}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-all cursor-pointer ${
              currentLevel === 'hard'
                ? 'bg-indigo-600 text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 font-medium'
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`}
          >
            Hard
          </button>
        </div>

        {/* How to Play Button */}
        <button
          type="button"
          onClick={onOpenHowToPlay}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600 rounded-lg transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 dark:text-slate-400" />
          <span>How to Play</span>
        </button>
      </div>
    </section>
  );
};
