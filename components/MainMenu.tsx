'use client';
import { Fragment } from 'react';
import Link from 'next/link';
import { Sun, Moon } from 'lucide-react';
import clsx from 'clsx';
import { useClick } from '@/lib/hooks/useAudio';
import useThemeStore from '@/store/useThemeStore';

const MainMenu = () => {
  const theme = useThemeStore(state => state.theme);
  const setTheme = useThemeStore(state => state.setTheme);

  const { playClick } = useClick();

  const links = [
    {
      name_en: 'Start Training',
      name_ja: 'あ',
      href: '/kana'
    },
    {
      name_en: 'Test Mode',
      name_ja: 'テ',
      href: '/test'
    },
    {
      name_en: 'Preferences',
      name_ja: '設',
      href: '/preferences'
    }
  ];

  return (
    <div
      className={clsx(
        'flex flex-row justify-center max-w-[100dvw] min-h-[100dvh]'
      )}
    >
      <div
        className={clsx(
          'max-md:pt-4 pb-16 flex flex-col items-center md:justify-center gap-4 px-4 w-full sm:w-3/4 lg:w-1/2 3xl:w-2/5',
          'opacity-90 z-50'
        )}
      >
        <div className='flex flex-row justify-between items-center w-full px-1 gap-2'>
          <div className='flex flex-col gap-1'>
            <h1 className='text-4xl font-bold'>B-JET Kana</h1>
            <p className='text-[var(--secondary-color)] text-lg'>
              Master Japanese Hiragana & Katakana
            </p>
          </div>
          <div className='flex flex-row justify-end gap-2'>
            {theme === 'dark' ? (
              <Moon
                size={32}
                onClick={() => {
                  playClick();
                  setTheme('light');
                }}
                className={clsx(
                  'hover:cursor-pointer duration-250 hover:scale-120',
                  'active:scale-100 active:duration-225',
                  'text-[var(--secondary-color)] hover:text-[var(--main-color)]'
                )}
              />
            ) : (
              <Sun
                size={32}
                onClick={() => {
                  playClick();
                  setTheme('dark');
                }}
                className={clsx(
                  'hover:cursor-pointer duration-250 hover:scale-120',
                  'active:scale-100 active:duration-225',
                  'text-[var(--secondary-color)] hover:text-[var(--main-color)]'
                )}
              />
            )}
          </div>
        </div>

        <div className='rounded-2xl bg-[var(--card-color)] p-4 w-full'>
          <h2 className='text-2xl mb-4'>Features</h2>
          <ul className='list-disc list-inside space-y-2 text-[var(--secondary-color)]'>
            <li>Complete Hiragana and Katakana coverage</li>
            <li>2 training modes: Kana to Romaji & Romaji to Kana</li>
            <li>Test mode with mixed game types and detailed results</li>
            <li>100+ customizable themes</li>
            <li>28 Japanese fonts</li>
            <li>Detailed statistics and progress tracking</li>
            <li>Audio feedback</li>
          </ul>
        </div>

        <div
          className={clsx(
            'rounded-2xl bg-[var(--card-color)]',
            'duration-250',
            'transition-all ease-in-out',
            'flex flex-col md:flex-row',
            'w-full'
          )}
        >
          {links.map((link, i) => (
            <Fragment key={i}>
              <Link href={link.href} className={clsx('w-full')}>
                <button
                  className={clsx(
                    'flex w-full h-full text-2xl',
                    'justify-center items-center gap-1.5',
                    'py-8',
                    'group',
                    i === 0 && 'rounded-tl-2xl md:rounded-bl-2xl',
                    i === links.length - 1 && 'rounded-tr-2xl md:rounded-br-2xl',
                    'hover:cursor-pointer',
                    'hover:bg-[var(--border-color)]'
                  )}
                  onClick={() => playClick()}
                >
                  <span
                    lang='ja'
                    className='font-normal text-[var(--secondary-color)]'
                  >
                    {link.name_ja}
                  </span>
                  <span lang='en'>{link.name_en}</span>
                </button>
              </Link>

              {i < links.length - 1 && (
                <div
                  className={clsx(
                    'md:border-l-1 md:h-auto md:w-0',
                    'border-[var(--border-color)]',
                    'border-t-1 w-full border-[var(--border-color)]'
                  )}
                />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
