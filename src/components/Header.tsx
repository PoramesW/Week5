import React from 'react';
import { DifficultyLevel } from '../types/game';
import { Clock, Trophy, CheckCircle2, Volume2, VolumeX, Moon, Sun, Eye, RotateCw } from 'lucide-react';

interface HeaderProps {
  level: DifficultyLevel;
  stage: number;
  score: number;
  matchedPairs: number;
  totalPairs: number;
  timeLeft: number;
  moves: number;
  maxMoves: number;
  isMuted: boolean;
  isDarkMode: boolean;
  reducedMotion: boolean;
  onSetTheme: (dark: boolean) => void;
  onToggleMute: () => void;
  onToggleReducedMotion: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  level,
  stage,
  score,
  matchedPairs,
  totalPairs,
  timeLeft,
  moves,
  maxMoves,
  isMuted,
  isDarkMode,
  reducedMotion,
  onSetTheme,
  onToggleMute,
  onToggleReducedMotion,
}) => {
  const isTimeCritical = timeLeft <= 10 && timeLeft > 0;
  const movesRemaining = Math.max(0, maxMoves - moves);
  const isMovesCritical = movesRemaining <= 3;

  // Format seconds as MM:SS or SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const levelLabel =
    level === 'easy' ? 'Easy' : level === 'medium' ? 'Medium' : 'Hard';

  return (
    <header className="w-full max-w-3xl mx-auto px-4 pt-3 sm:pt-5 pb-1">
      {/* Top Brand & Utility Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        {/* Brand: Clean single-line title with no subtitle tagline */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Color Match
            </span>
          </h1>
        </div>

        {/* Utilities: Explicit Light / Dark mode toggle + Sound + Reduced Motion */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Explicit Light / Dark Mode Toggle */}
          <div
            role="group"
            aria-label="Color Theme Selection"
            className="flex items-center bg-slate-200 dark:bg-slate-800 p-1 rounded-lg border border-slate-300 dark:border-slate-700 shadow-xs"
          >
            <button
              type="button"
              onClick={() => onSetTheme(false)}
              aria-pressed={!isDarkMode}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition-all cursor-pointer ${
                !isDarkMode
                  ? 'bg-white text-amber-600 font-bold shadow-xs ring-1 ring-amber-400/50'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => onSetTheme(true)}
              aria-pressed={isDarkMode}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-950 text-indigo-400 font-bold shadow-xs ring-1 ring-indigo-500/50'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            title={isMuted ? 'Unmute sound' : 'Mute sound'}
            aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
            className="p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          {/* Motion Toggle */}
          <button
            type="button"
            onClick={onToggleReducedMotion}
            title={reducedMotion ? 'Enable animations' : 'Reduce motion'}
            aria-label={reducedMotion ? 'Enable animations' : 'Reduce motion'}
            className={`p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer ${
              reducedMotion ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-indigo-300' : ''
            }`}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary HUD Stats Grid: Level, Score, Pairs, Moves Left, Timer */}
      <section
        aria-label="Game Status Indicators"
        className="grid grid-cols-5 gap-1.5 sm:gap-2.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-xs"
      >
        {/* 1. Level & Stage */}
        <div className="flex flex-col items-center justify-center text-center px-0.5">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {levelLabel}
          </span>
          <span className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 whitespace-nowrap">
            Stage {stage}
          </span>
        </div>

        {/* 2. Score */}
        <div className="flex flex-col items-center justify-center text-center px-0.5 border-l border-slate-200 dark:border-slate-800">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Trophy className="w-3 h-3 text-amber-500 hidden sm:inline" />
            Score
          </span>
          <span className="text-sm sm:text-lg font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400 mt-0.5">
            {score}
          </span>
        </div>

        {/* 3. Matched Pairs */}
        <div className="flex flex-col items-center justify-center text-center px-0.5 border-l border-slate-200 dark:border-slate-800">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500 hidden sm:inline" />
            Pairs
          </span>
          <span className="text-sm sm:text-lg font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">
            {matchedPairs} <span className="text-slate-400 font-normal text-[10px] sm:text-xs">/{totalPairs}</span>
          </span>
        </div>

        {/* 4. Rounds / Moves Limit */}
        <div className="flex flex-col items-center justify-center text-center px-0.5 border-l border-slate-200 dark:border-slate-800">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <RotateCw className={`w-3 h-3 hidden sm:inline ${isMovesCritical ? 'text-amber-500' : 'text-slate-400'}`} />
            Moves
          </span>
          <span
            className={`text-sm sm:text-lg font-bold font-mono tabular-nums mt-0.5 ${
              isMovesCritical
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {moves} <span className="text-slate-400 font-normal text-[10px] sm:text-xs">/{maxMoves}</span>
          </span>
        </div>

        {/* 5. Countdown Timer */}
        <div className="flex flex-col items-center justify-center text-center px-0.5 border-l border-slate-200 dark:border-slate-800">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Clock className={`w-3 h-3 hidden sm:inline ${isTimeCritical ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
            Time
          </span>
          <span
            className={`text-sm sm:text-lg font-bold font-mono tabular-nums mt-0.5 ${
              isTimeCritical
                ? 'text-red-600 dark:text-red-400 animate-pulse'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
      </section>
    </header>
  );
};
