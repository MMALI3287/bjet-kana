'use client';
import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { useClick } from '@/lib/hooks/useAudio';
import { useStopwatch } from 'react-timer-hook';
import { X } from 'lucide-react';
import ProgressBar from './ProgressBar';
import useStatsStore from '@/store/useStatsStore';

const Return = ({ isHidden, href }: { isHidden: boolean; href: string }) => {
  const totalTimeStopwatch = useStopwatch({ autoStart: false });
  const saveCurrentSession = useStatsStore(state => state.saveCurrentSession);
  const setNewTotalMilliseconds = useStatsStore(state => state.setNewTotalMilliseconds);
  const numCorrectAnswers = useStatsStore(state => state.numCorrectAnswers);
  const numWrongAnswers = useStatsStore(state => state.numWrongAnswers);

  const { playClick } = useClick();

  useEffect(() => {
    if (!isHidden) totalTimeStopwatch.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHidden]);

  const buttonRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        buttonRef.current?.click();
      } else if (event.code === 'Space' || event.key === ' ') {
        // event.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      className={clsx(
        'mt-4 md:mt-10',
        'w-full md:w-1/2 flex flex-row gap-4 items-center justify-between',
        'md:gap-6',
        isHidden ? 'hidden' : ''
      )}
    >
      <Link
        href={href}
        className=""
        ref={buttonRef}
        onClick={() => {
          playClick();
          // Save session stats when leaving the game (only if there's activity)
          if (numCorrectAnswers > 0 || numWrongAnswers > 0) {
            // Capture the total time from the stopwatch
            totalTimeStopwatch.pause();
            setNewTotalMilliseconds(totalTimeStopwatch.totalMilliseconds);
            saveCurrentSession();
          }
        }}
      >
        <X
          size={32}
          className={clsx(
            'hover:cursor-pointer duration-250 hover:scale-125 text-[var(--secondary-color)] hover:text-[var(--main-color)]'
          )}
        />
      </Link>
      <ProgressBar />
    </div>
  );
};

export default Return;
