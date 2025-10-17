import type { Metadata } from 'next';
import TestResults from '@/components/Test/TestResults';

export const metadata: Metadata = {
    title: 'BJET Kana: Test Results',
    description: 'View your test results history.',
};

export default function TestResultsPage() {
    return <TestResults />;
}
