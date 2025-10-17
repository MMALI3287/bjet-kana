'use client';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import useTestStore from '@/store/useTestStore';
import { cardBorderStyles } from '@/static/styles';
import { Calendar, Clock, Award, Trash2, Eye, ArrowLeft } from 'lucide-react';
import Header from '@/components/reusable/Header';

const TestResults = () => {
    const router = useRouter();
    const { testResults, clearTestHistory } = useTestStore();

    const handleClearHistory = () => {
        if (confirm('Are you sure you want to delete all test results? This cannot be undone.')) {
            clearTestHistory();
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${String(secs).padStart(2, '0')}`;
    };

    const sortedResults = [...testResults].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className='min-h-[100dvh] max-w-[100dvw]'>
            <Header />

            <div className='flex flex-col gap-6 w-full px-4 md:px-8 pb-8 pt-6 max-w-6xl mx-auto'>
                {/* Back Button */}
                <button
                    onClick={() => router.push('/test')}
                    className={clsx(
                        'self-start py-2 px-4 rounded-lg font-semibold',
                        'text-[var(--main-color)]',
                        'hover:bg-[var(--card-color)]',
                        'transition-all duration-200',
                        'flex items-center gap-2'
                    )}
                >
                    <ArrowLeft size={20} />
                    Back to Test Setup
                </button>

                {sortedResults.length === 0 ? (
                    <div className={clsx(
                        cardBorderStyles,
                        'rounded-2xl bg-[var(--card-color)] p-12 text-center'
                    )}>
                        <Award size={64} className='mx-auto mb-4 text-gray-400' />
                        <h2 className='text-2xl font-bold mb-2 text-gray-600'>No Test Results Yet</h2>
                        <p className='text-[var(--secondary-color)] mb-6'>
                            Complete a test to see your results here
                        </p>
                        <button
                            onClick={() => router.push('/test')}
                            className={clsx(
                                'py-3 px-6 rounded-xl font-bold',
                                'bg-[var(--main-color)] text-white',
                                'hover:scale-105 transition-all duration-200'
                            )}
                        >
                            Take a Test
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Results List */}
                        <div className='space-y-4'>
                            {sortedResults.map((result) => (
                                <div
                                    key={result.id}
                                    className={clsx(
                                        cardBorderStyles,
                                        'rounded-2xl bg-[var(--card-color)] p-6',
                                        'hover:shadow-lg transition-all duration-200'
                                    )}
                                >
                                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                        {/* Left: Score and Date */}
                                        <div className='flex items-center gap-6'>
                                            <div className={clsx(
                                                'w-20 h-20 rounded-full',
                                                'flex items-center justify-center',
                                                'font-bold text-2xl',
                                                result.score >= 80 ? 'bg-green-500 text-white' :
                                                    result.score >= 60 ? 'bg-yellow-500 text-white' :
                                                        'bg-red-500 text-white'
                                            )}>
                                                {result.score}%
                                            </div>
                                            <div>
                                                <div className='flex items-center gap-2 text-[var(--secondary-color)] mb-1'>
                                                    <Calendar size={16} />
                                                    <span className='text-sm'>{formatDate(result.date)}</span>
                                                </div>
                                                <div className='flex items-center gap-2 text-[var(--secondary-color)]'>
                                                    <Clock size={16} />
                                                    <span className='text-sm'>{formatTime(result.totalTime)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Middle: Stats */}
                                        <div className='flex gap-6 text-center'>
                                            <div>
                                                <div className='text-2xl font-bold text-green-500'>
                                                    {result.correctAnswers}
                                                </div>
                                                <div className='text-sm text-[var(--secondary-color)]'>Correct</div>
                                            </div>
                                            <div>
                                                <div className='text-2xl font-bold text-red-500'>
                                                    {result.wrongAnswers}
                                                </div>
                                                <div className='text-sm text-[var(--secondary-color)]'>Wrong</div>
                                            </div>
                                            <div>
                                                <div className='text-2xl font-bold text-[var(--main-color)]'>
                                                    {result.totalQuestions}
                                                </div>
                                                <div className='text-sm text-[var(--secondary-color)]'>Total</div>
                                            </div>
                                        </div>

                                        {/* Right: View Details Button */}
                                        <button
                                            onClick={() => router.push(`/test/results/${result.id}`)}
                                            className={clsx(
                                                'py-3 px-6 rounded-xl font-semibold',
                                                'bg-[var(--main-color)] text-white',
                                                'hover:scale-105 transition-all duration-200',
                                                'flex items-center gap-2'
                                            )}
                                        >
                                            <Eye size={20} />
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Clear History Button */}
                        <button
                            onClick={handleClearHistory}
                            className={clsx(
                                'self-end py-3 px-6 rounded-xl font-semibold',
                                'bg-red-500 text-white',
                                'hover:bg-red-600 transition-all duration-200',
                                'flex items-center gap-2'
                            )}
                        >
                            <Trash2 size={20} />
                            Clear All Results
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default TestResults;
