'use client';
import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import useKanaStore from '@/store/useKanaStore';
import useThemeStore from '@/store/useThemeStore';
import { useClick } from '@/lib/hooks/useAudio';
import { ChevronUp, Play } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { MousePointerClick, Keyboard } from 'lucide-react';

interface ITopBarProps {
  showGameModes: boolean;
  setShowGameModes: React.Dispatch<React.SetStateAction<boolean>>;
  currentDojo: string;
}

const TopBar: React.FC<ITopBarProps> = ({
  showGameModes,
  setShowGameModes
}) => {
  const hotkeysOn = useThemeStore(state => state.hotkeysOn);

  const pathname = usePathname();

  const { playClick } = useClick();

  const selectedGameModeKana = useKanaStore(
    state => state.selectedGameModeKana
  );
  const kanaGroupIndices = useKanaStore(state => state.kanaGroupIndices);

  const selectedGameMode = selectedGameModeKana;
  const isFilled = kanaGroupIndices.length !== 0;

  // Map game mode IDs to display names
  const getGameModeName = (mode: string) => {
    const modeMap: Record<string, string> = {
      'Kana to Romaji': 'Kana to Romaji',
      'Romaji to Kana': 'Romaji to Kana',
      'Writing': 'Writing'
    };
    return modeMap[mode] || mode;
  };

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [focus, setFocus] = useState('');

  useEffect(() => {
    if (!hotkeysOn) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        buttonRef.current?.click();
      } else if (event.code === 'Space' || event.key === ' ') {
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hotkeysOn]);

  return (
    <div
      className={clsx(
        'flex flex-row',
        'rounded-2xl bg-[var(--card-color)]',
        'duration-250',
        'transition-all ease-in-out',
        'w-full'
      )}
    >
      <button
        className={clsx(
          'text-2xl w-1/2 p-2 flex flex-row justify-center items-center gap-2',
          'h-full',
          'hover:cursor-pointer',
          selectedGameMode
            ? 'text-[var(--main-color)]'
            : 'text-[var(--secondary-color)]',
          'hover:bg-[var(--border-color)] rounded-tl-2xl rounded-bl-2xl',
          'duration-250'
        )}
        onClick={e => {
          playClick();
          e.currentTarget.blur();
          setShowGameModes(showGameModes => !showGameModes);
        }}
        onMouseEnter={() => setFocus('gameModes')}
        onMouseLeave={() => setFocus('')}
      >
        <ChevronUp
          className={clsx(
            'duration-250',
            focus === 'gameModes'
              ? 'text-[var(--secondary-color)]'
              : 'text-[var(--border-color)]',
            !showGameModes && 'rotate-180'
          )}
          size={24}
        />
        {selectedGameMode ? getGameModeName(selectedGameMode) : 'not set'}
        {selectedGameMode.toLowerCase() === 'kana to romaji' && (
          <MousePointerClick
            size={22}
            className='text-[var(--main-color)]'
          />
        )}
        {selectedGameMode.toLowerCase() === 'romaji to kana' && (
          <MousePointerClick
            size={22}
            className='scale-x-[-1] text-[var(--main-color)]'
          />
        )}
        {selectedGameMode.toLowerCase() === 'writing' && (
          <Keyboard size={22} className='text-[var(--main-color)]' />
        )}
      </button>      <div
        className={clsx(
          'border-l-1 h-auto w-0',
          'border-[var(--border-color)]'
        )}
      />

      <Link
        href={`${pathname}/train/${selectedGameMode}`}
        className='w-1/2 group'
      >
        <button
          disabled={!selectedGameMode || !isFilled}
          ref={buttonRef}
          className={clsx(
            'w-full h-full text-2xl px-2 flex flex-row justify-center items-center gap-1 py-4',
            'text-[var(--border-color)]',
            selectedGameMode &&
            isFilled &&
            'text-[var(--main-color)] hover:bg-[var(--border-color)] hover:cursor-pointer',
            'text-[var(--border-color)]',
            'rounded-tr-2xl rounded-br-2xl',
            'duration-250'
          )}
          onClick={e => {
            e.currentTarget.blur();
            playClick();
          }}
        >
          {/* <span className='group-hover:underline'>Go!</span> */}
          <Play
            // className={clsx(selectedGameMode && isFilled && 'animate-pulse')}
            size={32}
          />
        </button>
      </Link>
    </div>
  );
};

export default TopBar;
