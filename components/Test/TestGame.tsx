'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import useTestStore from '@/store/useTestStore';
import { kana } from '@/static/kana';
import { useStopwatch } from 'react-timer-hook';
import Pick from '@/components/Kana/Game/Pick';
import Input from '@/components/Kana/Game/Input';
import useKanaStore from '@/store/useKanaStore';
import { X, Clock, CheckCircle2, XCircle } from 'lucide-react';
import useStatsStore from '@/store/useStatsStore';
import Header from '@/components/reusable/Header';
import { Random } from 'random-js';

const random = new Random();

type GameMode = 'Kana to Romaji' | 'Romaji to Kana' | 'Writing';

const TestGame = () => {
  const router = useRouter();
  const {
    isTestActive,
    totalQuestions,
    resetTest,
  } = useTestStore();

  const [ready, setReady] = useState(false);
  const [currentGameMode, setCurrentGameMode] = useState<GameMode>('Kana to Romaji');
  const [testStarted, setTestStarted] = useState(false);
  const totalTimeStopwatch = useStopwatch({ autoStart: false });
  const previousAnswerCount = useRef(0);

  // Training store states
  const setKanaGroupIndices = useKanaStore(state => state.setKanaGroupIndices);
  const resetStats = useStatsStore(state => state.resetStats);
  const numCorrectAnswers = useStatsStore(state => state.numCorrectAnswers);
  const numWrongAnswers = useStatsStore(state => state.numWrongAnswers);

  // Redirect if test is not active
  useEffect(() => {
    if (!isTestActive) {
      router.push('/test');
    }
  }, [isTestActive, router]);

  // Initialize all kana characters for test - only once
  useEffect(() => {
    if (isTestActive && !ready) {
      // Select all kana groups (indices 0 to 59)
      const allIndices = kana.map((_, index) => index);
      setKanaGroupIndices(allIndices);
      resetStats();

      // Reset previous answer count
      previousAnswerCount.current = 0;

      // Set initial random game mode
      const gameModes: GameMode[] = ['Kana to Romaji', 'Romaji to Kana', 'Writing'];
      const randomMode = gameModes[random.integer(0, gameModes.length - 1)];
      setCurrentGameMode(randomMode);

      // Mark as ready and start timer
      setTimeout(() => {
        setReady(true);
        setTestStarted(true);
        totalTimeStopwatch.start();
      }, 100);
    }
  }, [isTestActive, ready, setKanaGroupIndices, resetStats, totalTimeStopwatch]);  // Monitor answers and handle test completion
  useEffect(() => {
    if (!ready || !testStarted) return;

    const currentAnswerCount = numCorrectAnswers + numWrongAnswers;

    // Check if a new answer was submitted (must be greater than 0 and greater than previous)
    if (currentAnswerCount > previousAnswerCount.current && currentAnswerCount > 0) {
      previousAnswerCount.current = currentAnswerCount;

      // Check if test is complete
      if (currentAnswerCount >= totalQuestions) {
        totalTimeStopwatch.pause();

        // Get the current stats at this moment
        const statsState = useStatsStore.getState();
        const currentCharHistory = statsState.characterHistory;
        const currentCharScores = statsState.characterScores;
        const currentAnswerTimes = statsState.correctAnswerTimes;
        const currentGameModeHistory = statsState.gameModeHistory;
        const currentUserAnswerHistory = statsState.userAnswerHistory;

        // Build question details from stats
        const questions = currentCharHistory.slice(0, totalQuestions).map((char, index) => {
          const gameMode = index < currentGameModeHistory.length ? currentGameModeHistory[index] : 'kana to romaji';

          // For romaji to kana, char is romaji; for others, char is kana
          const charData = kana.flatMap(group =>
            group.kana.map((k, i) => ({ kana: k, romaji: group.romanji[i] }))
          ).find(item => gameMode === 'romaji to kana' ? item.romaji === char : item.kana === char);

          const isCorrect = currentCharScores[char] ?
            (currentCharScores[char].correct > currentCharScores[char].wrong) :
            true;

          const timeSpent = index < currentAnswerTimes.length ? currentAnswerTimes[index] : 0;
          const userAnswer = index < currentUserAnswerHistory.length ? currentUserAnswerHistory[index] : '';

          return {
            kana: gameMode === 'romaji to kana' ? (charData?.kana || '') : char,
            romaji: gameMode === 'romaji to kana' ? char : (charData?.romaji || ''),
            gameMode: gameMode as 'kana to romaji' | 'romaji to kana' | 'writing',
            userAnswer,
            isCorrect,
            timeSpent
          };
        });

        // Save the test with actual stats
        const testStoreState = useTestStore.getState();
        const endTime = Date.now();
        const totalTime = (endTime - testStoreState.startTime) / 1000;
        const score = totalQuestions > 0 ? Math.round((numCorrectAnswers / totalQuestions) * 100) : 0;

        const result = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          totalQuestions: totalQuestions,
          correctAnswers: numCorrectAnswers,
          wrongAnswers: numWrongAnswers,
          totalTime,
          score,
          questions
        };

        // Manually save to test store
        useTestStore.setState(state => ({
          isTestActive: false,
          testResults: [...state.testResults, result]
        }));

        setTimeout(() => {
          const latestResult = useTestStore.getState().testResults[useTestStore.getState().testResults.length - 1];
          if (latestResult) {
            router.push(`/test/results/${latestResult.id}`);
          } else {
            router.push('/test/results');
          }
        }, 500);
      } else {
        // Change game mode for next question
        const gameModes: GameMode[] = ['Kana to Romaji', 'Romaji to Kana', 'Writing'];
        const randomMode = gameModes[random.integer(0, gameModes.length - 1)];
        setCurrentGameMode(randomMode);
      }
    }
  }, [numCorrectAnswers, numWrongAnswers, totalQuestions, ready, testStarted, totalTimeStopwatch, router]);

  const handleQuit = () => {
    if (confirm('Are you sure you want to quit? Your progress will not be saved.')) {
      totalTimeStopwatch.pause();
      resetTest();
      resetStats();
      router.push('/test');
    }
  };

  if (!isTestActive || !ready) {
    return null;
  }

  const correctCount = numCorrectAnswers;
  const wrongCount = numWrongAnswers;
  const totalAnswered = correctCount + wrongCount;
  const progress = Math.min((totalAnswered / totalQuestions) * 100, 100);

  return (
    <div className='min-h-[100dvh] max-w-[100dvw] flex flex-col'>
      <Header />

      {/* Test Progress */}
      <div className={clsx(
        'sticky top-0 z-40',
        'bg-[var(--background-color)]',
        'border-b-2 border-[var(--border-color)]'
      )}>
        <div className='flex justify-between items-center px-4 md:px-8 py-4'>
          <h1 className='text-2xl font-bold text-[var(--main-color)]'>
            Test Mode
          </h1>
          <button
            onClick={handleQuit}
            className={clsx(
              'p-2 rounded-lg',
              'text-red-500 hover:bg-red-500/10',
              'transition-colors duration-200'
            )}
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className='px-4 md:px-8 pb-3'>
          <div className='flex justify-between items-center mb-2 text-sm'>
            <span className='font-semibold'>
              Question {Math.min(totalAnswered + 1, totalQuestions)} / {totalQuestions}
            </span>
            <div className='flex items-center gap-1'>
              <Clock size={16} className='text-[var(--main-color)]' />
              <span className='font-mono font-semibold'>
                {String(totalTimeStopwatch.minutes).padStart(2, '0')}:
                {String(totalTimeStopwatch.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
          <div className='w-full h-2 bg-gray-200 rounded-full overflow-hidden'>
            <div
              className='h-full bg-[var(--main-color)] transition-all duration-300'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className='flex justify-center gap-8 px-4 md:px-8 pb-3'>
          <div className='flex items-center gap-2'>
            <CheckCircle2 size={20} className='text-green-500' />
            <span className='font-semibold'>{correctCount}</span>
          </div>
          <div className='flex items-center gap-2'>
            <XCircle size={20} className='text-red-500' />
            <span className='font-semibold'>{wrongCount}</span>
          </div>
        </div>
      </div>

      {/* Game Content - Reuse training components */}
      <div className='flex-1'>
        <div className='flex flex-col gap-6 md:gap-10 items-center min-h-full px-4 pt-6'>
          {currentGameMode === 'Kana to Romaji' && (
            <Pick isHidden={false} isReverse={false} isTestMode={true} />
          )}
          {currentGameMode === 'Romaji to Kana' && (
            <Pick isHidden={false} isReverse={true} isTestMode={true} />
          )}
          {currentGameMode === 'Writing' && (
            <Input isHidden={false} isReverse={false} isTestMode={true} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TestGame;
