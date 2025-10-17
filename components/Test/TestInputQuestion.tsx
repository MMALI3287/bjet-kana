'use client';
import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { cardBorderStyles } from '@/static/styles';
import { ArrowRight } from 'lucide-react';

interface TestInputQuestionProps {
  kana: string;
  romaji: string;
  onAnswer: (userAnswer: string, isCorrect: boolean) => void;
}

const TestInputQuestion = ({ kana, romaji, onAnswer }: TestInputQuestionProps) => {
  const [inputValue, setInputValue] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || showFeedback) return;

    const correct = inputValue.trim().toLowerCase() === romaji.toLowerCase();
    setIsCorrect(correct);
    setShowFeedback(true);

    setTimeout(() => {
      onAnswer(inputValue.trim(), correct);
      setInputValue('');
      setShowFeedback(false);
    }, 1000);
  };

  return (
    <div className='w-full max-w-2xl'>
      <div className={clsx(
        cardBorderStyles,
        'rounded-2xl bg-[var(--card-color)] p-8 mb-6'
      )}>
        <p className='text-center text-sm text-[var(--secondary-color)] mb-2'>
          Type the Answer
        </p>
        <h2 className='text-8xl font-bold text-center mb-4 text-[var(--main-color)]'>
          {kana}
        </h2>
        <p className='text-center text-[var(--secondary-color)]'>
          Type the romaji for this character
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          ref={inputRef}
          type='text'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={showFeedback}
          className={clsx(
            'w-full py-4 px-6 rounded-xl text-2xl font-bold text-center',
            'border-2 transition-all duration-200',
            'bg-[var(--card-color)]',
            showFeedback
              ? isCorrect
                ? 'border-green-500 text-green-500'
                : 'border-red-500 text-red-500'
              : 'border-[var(--border-color)] focus:border-[var(--main-color)] focus:outline-none'
          )}
          placeholder='Type romaji...'
        />
        <button
          type='submit'
          disabled={!inputValue.trim() || showFeedback}
          className={clsx(
            'w-full py-4 px-6 rounded-xl font-bold text-xl',
            'border-2 transition-all duration-200',
            'flex items-center justify-center gap-2',
            !inputValue.trim() || showFeedback
              ? 'bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[var(--main-color)] border-[var(--main-color)] text-white hover:scale-105'
          )}
        >
          Submit <ArrowRight size={20} />
        </button>
      </form>

      {showFeedback && !isCorrect && (
        <div className='mt-4 p-4 bg-red-500/10 border-2 border-red-500 rounded-xl text-center'>
          <p className='text-red-500 font-semibold'>
            Correct answer: <span className='font-bold'>{romaji}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default TestInputQuestion;
