'use client';
import { Fragment } from 'react';
import useKanaStore from '@/store/useKanaStore';
import { MousePointerClick, Keyboard, CircleCheck, Circle } from 'lucide-react';
import clsx from 'clsx';
import { useClick } from '@/lib/hooks/useAudio';

const GameModes = () => {
  const { playClick } = useClick();

  const selectedGameModeKana = useKanaStore(state => state.selectedGameModeKana);
  const setSelectedGameModeKana = useKanaStore(state => state.setSelectedGameModeKana);

  const selectedGameMode = selectedGameModeKana;
  const setSelectedGameMode = setSelectedGameModeKana;

  const gameModes = [
    { id: 'Kana to Romaji', name: 'Kana to Romaji' },
    { id: 'Romaji to Kana', name: 'Romaji to Kana' },
    { id: 'Writing', name: 'Writing' }
  ];

  return (
    <fieldset
      className={clsx(
        'rounded-2xl bg-[var(--card-color)]',
        'duration-250 transition-all ease-in-out',
        'flex flex-col md:flex-row w-full'
      )}
    >
      {gameModes.map((gameMode, i) => (
        <Fragment key={gameMode.id}>
          <label
            className={clsx(
              'flex justify-center items-center',
              'text-[var(--secondary-color)]',
              'w-full py-2 hover:cursor-pointer',
              i === 0 && 'rounded-tl-2xl rounded-bl-2xl',
              i === gameModes.length - 1 && 'rounded-tr-2xl rounded-br-2xl',
              'duration-250'
            )}
            onClick={() => playClick()}
          >
            <input type='radio' name='selectedGameMode' onChange={() => setSelectedGameMode(gameMode.id)} className='hidden' />
            <span className='text-lg font-medium py-2 px-1 sm:px-2 text-center flex flex-row justify-center items-center gap-2'>
              {gameMode.id === selectedGameMode ? (
                <CircleCheck className='text-[var(--main-color)]' />
              ) : (
                <Circle className='text-[var(--border-color)]' />
              )}
              <span>{gameMode.name}</span>
              {gameMode.id.toLowerCase() === 'kana to romaji' && (<MousePointerClick size={22} className='text-[var(--main-color)]' />)}
              {gameMode.id.toLowerCase() === 'romaji to kana' && (<MousePointerClick size={22} className=' scale-x-[-1] text-[var(--main-color)]' />)}
              {gameMode.id.toLowerCase() === 'writing' && (<Keyboard size={22} className='text-[var(--main-color)]' />)}
            </span>
          </label>

          {i < gameModes.length - 1 && (
            <div className={clsx('md:border-l-1 md:h-auto md:w-0', 'border-[var(--border-color)]', 'border-t-1 w-full border-[var(--border-color)]')} />
          )}
        </Fragment>
      ))}
    </fieldset>
  );
};

export default GameModes;
