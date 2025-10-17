'use client';
import clsx from 'clsx';
import { useEffect } from 'react';
import Return from '@/components/reusable/Game/ReturnFromGame';
import Pick from './Pick';
import Input from './Input';
import useKanaStore from '@/store/useKanaStore';
import useStatsStore from '@/store/useStatsStore';
import Stats from '@/components/reusable/Game/Stats';
import Header from '@/components/reusable/Header';

const Game = () => {
  const showStats = useStatsStore(state => state.showStats);

  const resetStats = useStatsStore(state => state.resetStats);

  const gameMode = useKanaStore(state => state.selectedGameModeKana);

  useEffect(() => {
    resetStats();
  }, [resetStats]);

  return (
    <>
      <Header />
      <div
        className={clsx(
          'flex flex-col gap-6 md:gap-10 items-center min-h-[100dvh] max-w-[100dvw] px-4'
        )}
      >
        {showStats && <Stats />}
        <Return isHidden={showStats} href='/kana' />
        {gameMode.toLowerCase() === 'kana to romaji' ? (
          <Pick isHidden={showStats} />
        ) : gameMode.toLowerCase() === 'romaji to kana' ? (
          <Pick isHidden={showStats} isReverse={true} />
        ) : gameMode.toLowerCase() === 'writing' ? (
          <Input isHidden={showStats} />
        ) : null}
      </div>
    </>
  );
};

export default Game;
