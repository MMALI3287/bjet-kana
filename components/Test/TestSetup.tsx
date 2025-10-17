'use client';
import { useState } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import useTestStore from '@/store/useTestStore';
import { cardBorderStyles } from '@/static/styles';
import { Play } from 'lucide-react';
import Header from '@/components/reusable/Header';

const TestSetup = () => {
  const router = useRouter();
  const [selectedQuestions, setSelectedQuestions] = useState(10);
  const [testStarting, setTestStarting] = useState(false);
  const startTest = useTestStore(state => state.startTest);

  const questionOptions = [10, 20, 30, 50, 100];

  const handleStartTest = () => {
    setTestStarting(true);
    startTest(selectedQuestions);
    router.push('/test/start');
  };

  if (testStarting) {
    return null;
  }

  return (
    <div className='min-h-[100dvh] max-w-[100dvw]'>
      <Header />

      <div className='flex flex-col gap-6 w-full px-4 md:px-8 pb-8 pt-6 max-w-4xl mx-auto'>
        {/* Question Selection */
          <div className={clsx(
            cardBorderStyles,
            'rounded-2xl bg-[var(--card-color)] p-6'
          )}>
            <h3 className='text-xl font-bold mb-4'>Select Number of Questions</h3>
            <div className='grid grid-cols-2 md:grid-cols-5 gap-3'>
              {questionOptions.map(num => (
                <button
                  key={num}
                  onClick={() => setSelectedQuestions(num)}
                  className={clsx(
                    'py-4 px-6 rounded-xl font-bold text-lg',
                    'transition-all duration-200',
                    'border-2',
                    selectedQuestions === num
                      ? 'bg-[var(--main-color)] text-white border-[var(--main-color)] scale-105'
                      : 'bg-[var(--card-color)] text-[var(--main-color)] border-[var(--border-color)] hover:border-[var(--main-color)] hover:scale-105'
                  )}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>}

        <button
          onClick={handleStartTest}
          className={clsx(
            'py-4 px-8 rounded-xl font-bold text-xl',
            'bg-[var(--main-color)] text-white',
            'border-2 border-[var(--main-color)]',
            'hover:scale-105 transition-all duration-200',
            'flex items-center justify-center gap-3',
            'shadow-lg hover:shadow-xl'
          )}
        >
          <Play size={24} />
          Start Test ({selectedQuestions} Questions)
        </button>

        {/* View Past Results */}
        <button
          onClick={() => router.push('/test/results')}
          className={clsx(
            'py-3 px-6 rounded-xl font-semibold',
            'bg-[var(--card-color)] text-[var(--main-color)]',
            'border-2 border-[var(--border-color)]',
            'hover:border-[var(--main-color)] hover:scale-105',
            'transition-all duration-200'
          )}
        >
          View Past Results
        </button>
      </div>
    </div>
  );
};

export default TestSetup;
