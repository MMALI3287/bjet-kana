'use client';
import Settings from '@/components/Settings';
import { useEffect } from 'react';

export default function PreferencesPage() {
  useEffect(() => {
    document.title = 'B-JET Kana: Preferences';
  }, []);

  return <Settings />;
}
