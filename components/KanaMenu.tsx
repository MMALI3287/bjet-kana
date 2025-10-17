'use client';
import clsx from 'clsx';
import { useState } from 'react';
import GameModes from '@/components/reusable/Menu/GameModes';
import KanaCards from '@/components/Kana/KanaCards';
import Banner from '@/components/reusable/Menu/Banner';
import TopBar from '@/components/reusable/Menu/TopBar';
import Header from '@/components/reusable/Header';

const KanaMenu = () => {
  const [showGameModes, setShowGameModes] = useState(false);

  return (
    <div className='min-h-[100dvh] max-w-[100dvw]'>
      <Header />

      <div
        className={clsx(
          'flex flex-col gap-4',
          'w-full px-4 md:px-8',
          'pb-8 pt-4'
        )}
      >

        <Banner />

        <div className='rounded-2xl bg-[var(--card-color)] p-4'>
          <h2 className='text-2xl mb-2'>Kana Training</h2>
          <p className='text-[var(--secondary-color)]'>
            Select the kana groups you want to practice, choose a game mode, and start training!
          </p>
        </div>

        <TopBar
          showGameModes={showGameModes}
          setShowGameModes={setShowGameModes}
          currentDojo='kana'
        />
        {showGameModes && <GameModes />}

        <KanaCards />
      </div>
    </div>
  );
};

export default KanaMenu;
