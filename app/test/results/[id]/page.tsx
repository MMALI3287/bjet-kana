import type { Metadata } from 'next';
import TestResultDetail from '@/components/Test/TestResultDetail';

export const metadata: Metadata = {
  title: 'BJET Kana: Test Result',
  description: 'View detailed test result.',
};

export default async function TestResultDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TestResultDetail id={id} />;
}
