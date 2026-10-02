import React from 'react';
import { CardItem } from '../types/game';
import { Check } from 'lucide-react';

interface CardProps {
  card: CardItem;
  index: number;
  isFlippedOrMatched: boolean;
  isDisabled: boolean;
  reducedMotion: boolean;
  onClick: (card: CardItem) => void;
}

export const Card: React.FC<CardProps> = ({
  card,
  index,
  isFlippedOrMatched,
  isDisabled,
  reducedMotion,
  onClick,
}) => {
  const handleClick = () => {
    if (!isDisabled && !isFlippedOrMatched) {
      onClick(card);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const accessibilityLabel = card.isMatched
    ? `Card ${index + 1}: Matched ${card.color.name} ${card.color.symbolLabel}`
    : isFlippedOrMatched
    ? `Card ${index + 1}: Revealed ${card.color.name} ${card.color.symbolLabel}`
    : `Card ${index + 1}: Hidden`;

  return (
    <div className="perspective-1000 w-full aspect-[4/5] sm:aspect-square">
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={isDisabled || card.isMatched}
        aria-label={accessibilityLabel}
        aria-pressed={isFlippedOrMatched}
        className={`w-full h-full relative cursor-pointer select-none rounded-xl sm:rounded-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
          card.isMatched ? 'cursor-default' : 'hover:scale-[1.02] active:scale-[0.98]'
        } ${reducedMotion ? '' : 'transform-style-3d'} ${
          isFlippedOrMatched && !reducedMotion ? 'rotate-y-180' : ''
        }`}
      >
        {/* If reduced motion is active, do instant switch instead of 3D rotation */}
        {reducedMotion ? (
          isFlippedOrMatched ? (
            /* Face Up (Reduced Motion) */
            <div
              className={`w-full h-full rounded-xl sm:rounded-2xl border-2 flex flex-col items-center justify-center p-2 sm:p-4 shadow-md forced-colors-border ${card.color.bgClass} ${card.color.borderClass} ${card.color.textClass}`}
            >
              {card.isMatched && (
                <div className="absolute top-2 right-2 bg-white/90 text-slate-900 rounded-full p-1 shadow-sm">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                </div>
              )}
              <span className="text-3xl sm:text-5xl font-bold mb-1" aria-hidden="true">
                {card.color.symbol}
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase">
                {card.color.name}
              </span>
              {card.isMatched && (
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-90 mt-1">
                  Matched
                </span>
              )}
            </div>
          ) : (
            /* Face Down (Reduced Motion) */
            <div className="w-full h-full rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-3 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-colors forced-colors-border">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center text-slate-400 dark:text-slate-400 font-bold text-lg sm:text-xl">
                ?
              </div>
            </div>
          )
        ) : (
          /* Normal 3D Flip Rendering */
          <>
            {/* FRONT FACE (Card Back / Hidden state) */}
            <div
              className={`absolute inset-0 w-full h-full backface-hidden rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700/80 flex flex-col items-center justify-center p-2 sm:p-3 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-colors forced-colors-border ${
                isFlippedOrMatched ? 'pointer-events-none' : ''
              }`}
            >
              {/* Geometric pattern on back of card */}
              <div className="w-full h-full rounded-lg sm:rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/30">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-400 font-bold text-sm sm:text-base border border-slate-200/60 dark:border-slate-700/60">
                  ?
                </div>
              </div>
            </div>

            {/* BACK FACE (Color Revealed state) */}
            <div
              className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl sm:rounded-2xl border-2 flex flex-col items-center justify-center p-2 sm:p-3 shadow-md forced-colors-border ${card.color.bgClass} ${card.color.borderClass} ${card.color.textClass}`}
            >
              {card.isMatched && (
                <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-white/95 text-slate-900 rounded-full p-0.5 sm:p-1 shadow-sm">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 stroke-[3]" />
                </div>
              )}
              <span className="text-2xl sm:text-4xl md:text-5xl font-bold leading-none mb-1" aria-hidden="true">
                {card.color.symbol}
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase">
                {card.color.name}
              </span>
              {card.isMatched && (
                <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase opacity-90 mt-0.5">
                  ✓ Matched
                </span>
              )}
            </div>
          </>
        )}
      </button>
    </div>
  );
};
