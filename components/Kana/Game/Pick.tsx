'use client';
import clsx from 'clsx';
import { useState, useEffect, useRef, useCallback } from 'react';
import { kana } from '@/static/kana';
import useKanaStore from '@/store/useKanaStore';
import { CircleCheck, CircleX } from 'lucide-react';
import { Random } from 'random-js';
import { useCorrect, useError } from '@/lib/hooks/useAudio';
import GameIntel from '@/components/reusable/Game/GameIntel';
import { buttonBorderStyles } from '@/static/styles';
import { pickGameKeyMappings } from '@/lib/keyMappings';
import { useStopwatch } from 'react-timer-hook';
import useStats from '@/lib/hooks/useStats';
import useStatsStore from '@/store/useStatsStore';
import Stars from '@/components/reusable/Game/Stars';

const random = new Random();

interface PickGameProps {
  isHidden: boolean;
  isReverse?: boolean;
  isTestMode?: boolean;
}

const PickGame = ({ isHidden, isReverse = false, isTestMode = false }: PickGameProps) => {
  const score = useStatsStore(state => state.score);
  const setScore = useStatsStore(state => state.setScore);

  const speedStopwatch = useStopwatch({ autoStart: false });

  const {
    incrementCorrectAnswers,
    incrementWrongAnswers,
    addCharacterToHistory,
    addCorrectAnswerTime,
    incrementCharacterScore,
  } = useStats();

  const addGameModeToHistory = useStatsStore(state => state.addGameModeToHistory);
  const addUserAnswerToHistory = useStatsStore(state => state.addUserAnswerToHistory);

  const { playCorrect } = useCorrect();
  const { playErrorTwice } = useError();

  const kanaGroupIndices = useKanaStore(state => state.kanaGroupIndices);

  const selectedKana = kanaGroupIndices.map(i => kana[i].kana).flat();
  const selectedRomaji = kanaGroupIndices.map(i => kana[i].romanji).flat();

  // For Kana to Romaji mode
  const selectedPairs = Object.fromEntries(
    selectedKana.map((key, i) => [key, selectedRomaji[i]])
  );

  // For Romaji to Kana mode
  const selectedPairs1 = Object.fromEntries(
    selectedRomaji.map((key, i) => [key, selectedKana[i]])
  );
  const selectedPairs2 = Object.fromEntries(
    selectedRomaji
      .map((key, i) => [key, selectedKana[i]])
      .slice()
      .reverse()
  );
  const reversedPairs1 = Object.fromEntries(
    Object.entries(selectedPairs1).map(([key, value]) => [value, key])
  );
  const reversedPairs2 = Object.fromEntries(
    Object.entries(selectedPairs2).map(([key, value]) => [value, key])
  );

  // State for Kana to Romaji mode
  const [correctKanaChar, setCorrectKanaChar] = useState(
    selectedKana[random.integer(0, selectedKana.length - 1)]
  );
  const correctRomajiChar = selectedPairs[correctKanaChar];

  // State for Romaji to Kana mode
  const [correctRomajiCharReverse, setCorrectRomajiCharReverse] = useState(
    selectedRomaji[random.integer(0, selectedRomaji.length - 1)]
  );
  const correctKanaCharReverse = random.bool()
    ? selectedPairs1[correctRomajiCharReverse]
    : selectedPairs2[correctRomajiCharReverse];

  // Get incorrect options based on mode
  const getIncorrectOptions = useCallback(() => {
    if (!isReverse) {
      const { [correctKanaChar]: _, ...incorrectPairs } = selectedPairs;
      void _;
      return [...Object.values(incorrectPairs)]
        .sort(() => random.real(0, 1) - 0.5)
        .slice(0, 2);
    } else {
      const { [correctRomajiCharReverse]: _, ...incorrectPairs } = random.bool()
        ? selectedPairs1
        : selectedPairs2;
      void _;
      return [...Object.values(incorrectPairs)]
        .sort(() => random.real(0, 1) - 0.5)
        .slice(0, 2);
    }
  }, [isReverse, correctKanaChar, selectedPairs, correctRomajiCharReverse, selectedPairs1, selectedPairs2]);

  const [shuffledVariants, setShuffledVariants] = useState(() => {
    const incorrectOptions = !isReverse
      ? (() => {
        const { [correctKanaChar]: _, ...incorrectPairs } = selectedPairs;
        void _;
        return [...Object.values(incorrectPairs)]
          .sort(() => random.real(0, 1) - 0.5)
          .slice(0, 2);
      })()
      : (() => {
        const { [correctRomajiCharReverse]: _, ...incorrectPairs } = random.bool()
          ? selectedPairs1
          : selectedPairs2;
        void _;
        return [...Object.values(incorrectPairs)]
          .sort(() => random.real(0, 1) - 0.5)
          .slice(0, 2);
      })();

    return isReverse
      ? [correctKanaCharReverse, ...incorrectOptions].sort(
        () => random.real(0, 1) - 0.5
      )
      : [correctRomajiChar, ...incorrectOptions].sort(
        () => random.real(0, 1) - 0.5
      );
  });

  const [feedback, setFeedback] = useState(<></>);
  const [wrongSelectedAnswers, setWrongSelectedAnswers] = useState<string[]>([]);

  // Start stopwatch once on mount
  useEffect(() => {
    speedStopwatch.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update shuffled variants when correct character changes
  useEffect(() => {
    const incorrectOptions = getIncorrectOptions();
    setShuffledVariants(
      isReverse
        ? [correctKanaCharReverse, ...incorrectOptions].sort(
          () => random.real(0, 1) - 0.5
        )
        : [correctRomajiChar, ...incorrectOptions].sort(
          () => random.real(0, 1) - 0.5
        )
    );
    // getIncorrectOptions changes on every render, so we only track the actual values
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correctKanaChar, correctRomajiCharReverse]);

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const index = pickGameKeyMappings[event.code];
      if (index !== undefined && index < shuffledVariants.length) {
        buttonRefs.current[index]?.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shuffledVariants.length]);

  useEffect(() => {
    if (isHidden) speedStopwatch.pause();
  }, [isHidden, speedStopwatch]);

  const handleOptionClick = (selectedChar: string) => {
    if (!isReverse) {
      // Kana to Romaji mode logic
      if (selectedChar === correctRomajiChar) {
        handleCorrectAnswer(correctKanaChar);
        let newRandomKana =
          selectedKana[random.integer(0, selectedKana.length - 1)];
        while (newRandomKana === correctKanaChar) {
          newRandomKana =
            selectedKana[random.integer(0, selectedKana.length - 1)];
        }
        setCorrectKanaChar(newRandomKana);
        setFeedback(
          <>
            <span>{`${correctKanaChar} = ${correctRomajiChar} `}</span>
            <CircleCheck className="inline text-[var(--main-color)]" />
          </>
        );
      } else {
        handleWrongAnswer(selectedChar);
        setFeedback(
          <>
            <span>{`${correctKanaChar} ≠ ${selectedChar} `}</span>
            <CircleX className="inline text-[var(--main-color)]" />
          </>
        );
      }
    } else {
      // Romaji to Kana mode logic
      if (
        reversedPairs1[selectedChar] === correctRomajiCharReverse ||
        reversedPairs2[selectedChar] === correctRomajiCharReverse
      ) {
        handleCorrectAnswer(correctRomajiCharReverse);
        let newRandomRomaji =
          selectedRomaji[random.integer(0, selectedRomaji.length - 1)];
        while (newRandomRomaji === correctRomajiCharReverse) {
          newRandomRomaji =
            selectedRomaji[random.integer(0, selectedRomaji.length - 1)];
        }
        setCorrectRomajiCharReverse(newRandomRomaji);
        setFeedback(
          <>
            <span>{`${correctRomajiCharReverse} = ${correctKanaCharReverse} `}</span>
            <CircleCheck className="inline text-[var(--main-color)]" />
          </>
        );
      } else {
        handleWrongAnswer(selectedChar);
        setFeedback(
          <>
            <span>{`${correctRomajiCharReverse} ≠ ${selectedChar} `}</span>
            <CircleX className="inline text-[var(--main-color)]" />
          </>
        );
      }
    }
  };

  const handleCorrectAnswer = (correctChar: string) => {
    speedStopwatch.pause();
    addCorrectAnswerTime(speedStopwatch.totalMilliseconds / 1000);
    speedStopwatch.reset();
    playCorrect();
    addCharacterToHistory(correctChar);
    const gameMode = isReverse ? 'romaji to kana' : 'kana to romaji';
    addGameModeToHistory(gameMode);
    const correctAnswer = isReverse ? (reversedPairs1[correctChar] ? correctChar : correctChar) : selectedPairs[correctChar];
    addUserAnswerToHistory(correctAnswer);
    incrementCharacterScore(correctChar, 'correct');
    incrementCorrectAnswers();
    setScore(score + 1);
    setWrongSelectedAnswers([]);
  };

  const handleWrongAnswer = (selectedChar: string) => {
    setWrongSelectedAnswers([...wrongSelectedAnswers, selectedChar]);
    playErrorTwice();
    const currentChar = isReverse ? correctRomajiCharReverse : correctKanaChar;

    // Track the wrong answer
    addCharacterToHistory(currentChar);
    const gameMode = isReverse ? 'romaji to kana' : 'kana to romaji';
    addGameModeToHistory(gameMode);
    addUserAnswerToHistory(selectedChar);

    incrementCharacterScore(currentChar, 'wrong');
    incrementWrongAnswers();
    if (score - 1 < 0) {
      setScore(0);
    } else {
      setScore(score - 1);
    }

    // In test mode, move to next question immediately after wrong answer
    if (isTestMode) {
      const sourceArray = isReverse ? selectedRomaji : selectedKana;
      let newChar = sourceArray[random.integer(0, sourceArray.length - 1)];
      const correctChar = isReverse ? correctRomajiCharReverse : correctKanaChar;
      while (newChar === correctChar) {
        newChar = sourceArray[random.integer(0, sourceArray.length - 1)];
      }
      if (isReverse) {
        setCorrectRomajiCharReverse(newChar);
      } else {
        setCorrectKanaChar(newChar);
      }
      setWrongSelectedAnswers([]);
      setFeedback(
        <>
          <span>{`${currentChar} ≠ ${selectedChar} `}</span>
          <CircleX className="inline text-[var(--main-color)]" />
        </>
      );
    }
  };

  const displayChar = isReverse ? correctRomajiCharReverse : correctKanaChar;
  const gameMode = isReverse ? 'romaji to kana' : 'kana to romaji';

  return (
    <div
      className={clsx(
        'flex flex-col gap-4 sm:gap-10 items-center w-full sm:w-4/5',
        isHidden ? 'hidden' : ''
      )}
    >
      <GameIntel
        gameMode={gameMode}
        feedback={feedback}
      />
      <p className="text-8xl sm:text-9xl font-medium">{displayChar}</p>
      <div className="flex flex-row w-full gap-5 sm:gap-0 sm:justify-evenly">
        {shuffledVariants.map((variantChar, i) => (
          <button
            ref={elem => {
              buttonRefs.current[i] = elem;
            }}
            key={variantChar + i}
            type="button"
            disabled={wrongSelectedAnswers.includes(variantChar)}
            className={clsx(
              'text-5xl font-semibold pb-6 pt-3 w-full sm:w-1/5 flex flex-row justify-center items-center gap-1',
              buttonBorderStyles,
              wrongSelectedAnswers.includes(variantChar) &&
              'hover:bg-[var(--card-color)] hover:border-[var(--border-color)] text-[var(--border-color)]',
              !wrongSelectedAnswers.includes(variantChar) &&
              'hover:scale-110 text-[var(--main-color)] hover:border-[var(--main-color)]'
            )}
            onClick={() => handleOptionClick(variantChar)}
          >
            <span>{variantChar}</span>
            <span className="hidden lg:inline text-xs rounded-full bg-[var(--border-color)] px-1">
              {i + 1 === 1 ? '1' : i + 1 === 2 ? '2' : '3'}
            </span>
          </button>
        ))}
      </div>
      <Stars />
    </div>
  );
};

export default PickGame;