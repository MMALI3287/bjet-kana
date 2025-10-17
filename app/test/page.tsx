import type { Metadata } from 'next';
import TestSetup from '@/components/Test/TestSetup';

export const metadata: Metadata = {
    title: 'BJET Kana: Test Mode',
    description: 'Test your Hiragana and Katakana knowledge.',
};

export default function TestPage() {
    return <TestSetup />;
}
