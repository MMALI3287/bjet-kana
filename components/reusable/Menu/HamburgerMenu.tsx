'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu, X, Sparkles, ChartSpline, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { useClick } from '@/lib/hooks/useAudio';
import { usePathname } from 'next/navigation';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { playClick } = useClick();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    playClick();
    setIsOpen(!isOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div ref={menuRef} className="relative z-50">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className={clsx(
          'p-3 rounded-xl',
          'bg-[var(--card-color)]',
          'hover:bg-[var(--border-color)]',
          'transition-all duration-250',
          'text-[var(--main-color)]'
        )}
        aria-label="Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={clsx(
            'absolute top-full right-0 mt-2',
            'bg-[var(--card-color)]',
            'border-2 border-[var(--border-color)]',
            'rounded-xl',
            'shadow-lg',
            'min-w-[200px]',
            'overflow-hidden',
            'animate-in fade-in slide-in-from-top-2 duration-200'
          )}
        >
          <Link
            href="/preferences"
            className={clsx(
              'flex items-center gap-3 px-4 py-3',
              'text-[var(--main-color)]',
              'hover:bg-[var(--border-color)]',
              'transition-all duration-150',
              'border-b-2 border-[var(--border-color)]',
              pathname === '/preferences' && 'bg-[var(--border-color)]'
            )}
            onClick={playClick}
          >
            <Sparkles size={20} className={clsx(pathname !== '/preferences' && 'motion-safe:animate-bounce')} />
            <span className="text-lg">Preferences</span>
          </Link>
          <Link
            href="/statistics"
            className={clsx(
              'flex items-center gap-3 px-4 py-3',
              'text-[var(--main-color)]',
              'hover:bg-[var(--border-color)]',
              'transition-all duration-150',
              'border-b-2 border-[var(--border-color)]',
              pathname === '/statistics' && 'bg-[var(--border-color)]'
            )}
            onClick={playClick}
          >
            <ChartSpline size={20} />
            <span className="text-lg">Statistics</span>
          </Link>
          <Link
            href="/test"
            className={clsx(
              'flex items-center gap-3 px-4 py-3',
              'text-[var(--main-color)]',
              'hover:bg-[var(--border-color)]',
              'transition-all duration-150',
              pathname?.startsWith('/test') && 'bg-[var(--border-color)]'
            )}
            onClick={playClick}
          >
            <ClipboardList size={20} />
            <span className="text-lg">Test Mode</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
