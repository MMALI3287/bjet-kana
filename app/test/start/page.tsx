import type { Metadata } from 'next';
import TestGame from '@/components/Test/TestGame';

export const metadata: Metadata = {
    title: 'BJET Kana: Test in Progress',
    description: 'Complete your Kana test.',
};

export default function TestStartPage() {
    return <TestGame />;
}
