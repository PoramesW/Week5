import React from 'react';
import { CardItem, DifficultyLevel } from '../types/game';
import { Card } from './Card';
import { LEVEL_CONFIGS } from '../utils/cardDeck';

interface CardGridProps {
  cards: CardItem[];
  level: DifficultyLevel;
  flippedCards: CardItem[];
  isLocked: boolean;
  reducedMotion: boolean;
  onCardClick: (card: CardItem) => void;
}

export const CardGrid: React.FC<CardGridProps> = ({
  cards,
  level,
  flippedCards,
  isLocked,
  reducedMotion,
  onCardClick,
}) => {
  const config = LEVEL_CONFIGS[level];

  return (
    <section
      aria-label="Color Match Cards Board"
      className="w-full max-w-2xl mx-auto px-2 sm:px-4 py-3"
    >
      <div
        className={`grid gap-2.5 sm:gap-4 justify-center items-center ${config.gridColsClass}`}
      >
        {cards.map((card, index) => {
          const isFlipped =
            flippedCards.some((c) => c.id === card.id) || card.isFlipped;
          const isFlippedOrMatched = isFlipped || card.isMatched;

          return (
            <Card
              key={card.id}
              card={card}
              index={index}
              isFlippedOrMatched={isFlippedOrMatched}
              isDisabled={isLocked || card.isMatched || isFlipped}
              reducedMotion={reducedMotion}
              onClick={onCardClick}
            />
          );
        })}
      </div>
    </section>
  );
};
