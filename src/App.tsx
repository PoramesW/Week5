import { useState, useEffect, useRef, useCallback } from 'react';
import { DifficultyLevel, GameStatus, CardItem, LoseReason } from './types/game';
import { LEVEL_CONFIGS, createShuffledDeck } from './utils/cardDeck';
import { sound } from './utils/audio';
import { Header } from './components/Header';
import { CardGrid } from './components/CardGrid';
import { ControlBar } from './components/ControlBar';
import { HowToPlayModal } from './components/HowToPlayModal';
import { GameOverModal } from './components/GameOverModal';

export default function App() {
  // Game Setup & Level (Standalone independent difficulty levels)
  const [level, setLevel] = useState<DifficultyLevel>('easy');
  const [stage, setStage] = useState<number>(1);
  const [cards, setCards] = useState<CardItem[]>(() => createShuffledDeck('easy'));

  // Turn, Moves & Matching State
  const [flippedCards, setFlippedCards] = useState<CardItem[]>([]);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [loseReason, setLoseReason] = useState<LoseReason>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Choose two cards');

  // Timer State
  const [timeLeft, setTimeLeft] = useState<number>(LEVEL_CONFIGS.easy.timeLimitSeconds);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Modals & User Settings
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('colormatch_theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('colormatch_motion') === 'reduced' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    }
    return false;
  });

  // Sync Dark Mode class with <html>, <body> and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('colormatch_theme', 'dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('colormatch_theme', 'light');
    }
  }, [isDarkMode]);

  // Sync Reduced Motion class with <html> and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (reducedMotion) {
      root.classList.add('reduced-motion');
      localStorage.setItem('colormatch_motion', 'reduced');
    } else {
      root.classList.remove('reduced-motion');
      localStorage.setItem('colormatch_motion', 'normal');
    }
  }, [reducedMotion]);

  // Handle Settings
  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    sound.setMuted(newMuted);
  };

  const handleSetTheme = (dark: boolean) => {
    setIsDarkMode(dark);
  };

  const toggleReducedMotion = () => {
    setReducedMotion((prev) => !prev);
  };

  // Reset & Start New Game for a Level (Starts at Stage 1)
  const resetGame = useCallback(
    (newLevel: DifficultyLevel = level, targetStage: number = 1, resetScore: boolean = true) => {
      // Clear existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const config = LEVEL_CONFIGS[newLevel];
      const newDeck = createShuffledDeck(newLevel);

      setLevel(newLevel);
      setStage(targetStage);
      setCards(newDeck);
      setFlippedCards([]);
      setIsLocked(false);
      setMatchedPairs(0);
      if (resetScore) {
        setScore(0);
      }
      setMoves(0);
      setStreak(0);
      setTimeLeft(config.timeLimitSeconds);
      setStatus('playing');
      setLoseReason(null);
      setStatusMessage('Choose two cards');
    },
    [level]
  );

  // Advance to Next Stage in the CURRENT difficulty level (Randomizes colors and card positions)
  const handleNextStage = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const config = LEVEL_CONFIGS[level];
    const newDeck = createShuffledDeck(level);

    setStage((prev) => prev + 1);
    setCards(newDeck);
    setFlippedCards([]);
    setIsLocked(false);
    setMatchedPairs(0);
    setMoves(0);
    setStreak(0);
    setTimeLeft(config.timeLimitSeconds);
    setStatus('playing');
    setLoseReason(null);
    setStatusMessage('Choose two cards');
  }, [level]);

  // Level Selection handler (Independent separate levels, always starts at Stage 1)
  const handleSelectLevel = (newLevel: DifficultyLevel) => {
    resetGame(newLevel, 1, true);
  };

  // Countdown Timer Hook
  useEffect(() => {
    if (status !== 'playing') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          // Time expired -> Lose
          setStatus('lose');
          setLoseReason('timeout');
          setStatusMessage("Time's Up!");
          sound.playLose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status]);

  // Card Click Interaction & Move Management
  const handleCardClick = (clickedCard: CardItem) => {
    // Prevent interaction if locked, game over, or card already matched/flipped
    if (
      isLocked ||
      status !== 'playing' ||
      clickedCard.isMatched ||
      clickedCard.isFlipped ||
      flippedCards.some((c) => c.id === clickedCard.id)
    ) {
      return;
    }

    sound.playFlip();

    // 1st Card Flipped
    if (flippedCards.length === 0) {
      setFlippedCards([clickedCard]);
      setStatusMessage('Choose two cards');
      return;
    }

    // 2nd Card Flipped -> Counts as 1 move/attempt!
    if (flippedCards.length === 1) {
      const firstCard = flippedCards[0];
      setFlippedCards([firstCard, clickedCard]);
      const currentMoveCount = moves + 1;
      setMoves(currentMoveCount);
      setIsLocked(true); // Lock further clicks while evaluating match

      const config = LEVEL_CONFIGS[level];
      const isMatch = firstCard.pairId === clickedCard.pairId;

      if (isMatch) {
        // MATCHED!
        sound.playMatch();
        setStatusMessage('Match!');

        const newStreak = streak + 1;
        setStreak(newStreak);
        const earnedScore = 100 + newStreak * 25;
        setScore((prev) => prev + earnedScore);

        // Mark cards as matched
        setCards((prevCards) =>
          prevCards.map((c) =>
            c.id === firstCard.id || c.id === clickedCard.id
              ? { ...c, isMatched: true, isFlipped: true }
              : c
          )
        );

        const newMatchedCount = matchedPairs + 1;
        setMatchedPairs(newMatchedCount);
        setFlippedCards([]);
        setIsLocked(false);

        // Check Victory for this Stage
        if (newMatchedCount === config.pairs) {
          // Stop timer immediately
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }

          // Calculate time bonus: +10 pts per second remaining
          const timeBonus = timeLeft * 10;
          setScore((prev) => prev + timeBonus);

          setStatus('win');
          setStatusMessage(`Stage ${stage} Cleared!`);
          sound.playWin();
        }
      } else {
        // MISMATCH!
        sound.playMismatch();
        setStreak(0); // Reset combo streak

        // Check if out of moves
        const isOutOfMoves = currentMoveCount >= config.maxMoves;

        if (isOutOfMoves) {
          setStatusMessage('Out of Moves!');
        } else {
          setStatusMessage('Try again!');
        }

        // Delay so user can memorize the two cards
        const delayTime = reducedMotion ? 350 : 800;
        setTimeout(() => {
          setFlippedCards([]);
          setIsLocked(false);

          if (isOutOfMoves) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            setStatus('lose');
            setLoseReason('moves_exhausted');
            setStatusMessage('Out of Moves!');
            sound.playLose();
          } else {
            setStatusMessage('Choose two cards');
          }
        }, delayTime);
      }
    }
  };

  const currentConfig = LEVEL_CONFIGS[level];
  const totalPairs = currentConfig.pairs;
  const maxMoves = currentConfig.maxMoves;

  return (
    <div
      data-theme={isDarkMode ? 'dark' : 'light'}
      className={`min-h-screen flex flex-col justify-start antialiased py-3 sm:py-5 transition-colors duration-200 ${
        isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* 1. Top Header & Stats HUD */}
      <Header
        level={level}
        stage={stage}
        score={score}
        matchedPairs={matchedPairs}
        totalPairs={totalPairs}
        timeLeft={timeLeft}
        moves={moves}
        maxMoves={maxMoves}
        isMuted={isMuted}
        isDarkMode={isDarkMode}
        reducedMotion={reducedMotion}
        onSetTheme={handleSetTheme}
        onToggleMute={toggleMute}
        onToggleReducedMotion={toggleReducedMotion}
      />

      {/* 2. Control Bar (Above the game board) */}
      <ControlBar
        currentLevel={level}
        status={status}
        statusMessage={statusMessage}
        onSelectLevel={handleSelectLevel}
        onRestart={() => resetGame(level, 1, true)}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
      />

      {/* 3. Main Card Arena */}
      <main className="flex-1 flex items-center justify-center w-full my-auto py-2">
        <CardGrid
          cards={cards}
          level={level}
          flippedCards={flippedCards}
          isLocked={isLocked || status !== 'playing'}
          reducedMotion={reducedMotion}
          onCardClick={handleCardClick}
        />
      </main>

      {/* How to Play Dialog */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      {/* Win & Lose Modal (Generates next random stage within the same chosen level) */}
      <GameOverModal
        status={status}
        loseReason={loseReason}
        stage={stage}
        score={score}
        matchedPairs={matchedPairs}
        totalPairs={totalPairs}
        timeLeft={timeLeft}
        moves={moves}
        maxMoves={maxMoves}
        level={level}
        onRestart={() => resetGame(level, 1, true)}
        onNextStage={handleNextStage}
      />
    </div>
  );
}
