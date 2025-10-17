import type { Metadata } from 'next';
import KanaMenu from '@/components/KanaMenu';

export const metadata: Metadata = {
  title: 'BJET Kana: Training',
  description: 'Learn and practice Hiragana and Katakana.',
};

export default function KanaPage() {
  return <KanaMenu />;
}
