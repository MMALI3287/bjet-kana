'use client';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import useTestStore from '@/store/useTestStore';
import { cardBorderStyles } from '@/static/styles';
import { Calendar, Clock, Award, ArrowLeft, CheckCircle2, XCircle, MousePointerClick, Keyboard } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { TestResult } from '@/store/useTestStore';
import Header from '@/components/reusable/Header';

interface TestResultDetailProps {
    id: string;
}

const TestResultDetail = ({ id }: TestResultDetailProps) => {
    const router = useRouter();
    const getTestResult = useTestStore(state => state.getTestResult);
    const [result, setResult] = useState<TestResult | null>(null);

    useEffect(() => {
        const testResult = getTestResult(id);
        if (testResult) {
            setResult(testResult);
        } else {
            router.push('/test/results');
        }
    }, [id, getTestResult, router]);

    if (!result) {
        return null;
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}m ${secs}s`;
    };

    const getGameModeIcon = (mode: string) => {
        switch (mode.toLowerCase()) {
            case 'kana to romaji':
                return <MousePointerClick size={16} />;
            case 'romaji to kana':
                return <MousePointerClick size={16} className='scale-x-[-1]' />;
            case 'writing':
                return <Keyboard size={16} />;
            default:
                return null;
        }
    }; const getGameModeName = (mode: string) => {
        switch (mode.toLowerCase()) {
            case 'kana to romaji':
                return 'Kana to Romaji';
            case 'romaji to kana':
                return 'Romaji to Kana';
            case 'writing':
                return 'Writing';
            default:
                return mode;
        }
    }; const avgTime = result.questions.length > 0
        ? result.totalTime / result.questions.length
        : 0;

    const fastestQuestion = result.questions.reduce((fastest, q) =>
        q.timeSpent < fastest.timeSpent ? q : fastest
        , result.questions[0]);

    const slowestQuestion = result.questions.reduce((slowest, q) =>
        q.timeSpent > slowest.timeSpent ? q : slowest
        , result.questions[0]);

    return (
        <div className='min-h-[100dvh] max-w-[100dvw]'>
            <Header />

            <div className='flex flex-col gap-6 w-full px-4 md:px-8 pb-8 pt-6 max-w-6xl mx-auto'>
                {/* Back Button */}
                <button
                    onClick={() => router.push('/test/results')}
                    className={clsx(
                        'self-start py-2 px-4 rounded-lg font-semibold',
                        'text-[var(--main-color)]',
                        'hover:bg-[var(--card-color)]',
                        'transition-all duration-200',
                        'flex items-center gap-2'
                    )}
                >
                    <ArrowLeft size={20} />
                    Back to Results
                </button>

                {/* Score Summary */}
                <div className={clsx(
                    cardBorderStyles,
                    'rounded-2xl bg-[var(--card-color)] p-8'
                )}>
                    <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
                        <div className='flex items-center gap-6'>
                            <div className={clsx(
                                'w-32 h-32 rounded-full',
                                'flex items-center justify-center',
                                'font-bold text-4xl',
                                result.score >= 80 ? 'bg-green-500 text-white' :
                                    result.score >= 60 ? 'bg-yellow-500 text-white' :
                                        'bg-red-500 text-white'
                            )}>
                                {result.score}%
                            </div>
                            <div>
                                <h2 className='text-3xl font-bold mb-2'>
                                    {result.score >= 80 ? 'Excellent!' :
                                        result.score >= 60 ? 'Good Job!' :
                                            'Keep Practicing!'}
                                </h2>
                                <div className='flex items-center gap-2 text-[var(--secondary-color)] mb-1'>
                                    <Calendar size={16} />
                                    <span>{formatDate(result.date)}</span>
                                </div>
                                <div className='flex items-center gap-2 text-[var(--secondary-color)]'>
                                    <Clock size={16} />
                                    <span>{formatTime(result.totalTime)}</span>
                                </div>
                            </div>
                        </div>

                        <div className='grid grid-cols-3 gap-6 text-center'>
                            <div>
                                <div className='text-4xl font-bold text-green-500'>
                                    {result.correctAnswers}
                                </div>
                                <div className='text-sm text-[var(--secondary-color)]'>Correct</div>
                            </div>
                            <div>
                                <div className='text-4xl font-bold text-red-500'>
                                    {result.wrongAnswers}
                                </div>
                                <div className='text-sm text-[var(--secondary-color)]'>Wrong</div>
                            </div>
                            <div>
                                <div className='text-4xl font-bold text-[var(--main-color)]'>
                                    {result.totalQuestions}
                                </div>
                                <div className='text-sm text-[var(--secondary-color)]'>Total</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className={clsx(
                        cardBorderStyles,
                        'rounded-xl bg-[var(--card-color)] p-6 text-center'
                    )}>
                        <div className='text-2xl font-bold text-[var(--main-color)] mb-1'>
                            {avgTime.toFixed(1)}s
                        </div>
                        <div className='text-sm text-[var(--secondary-color)]'>Avg Time per Question</div>
                    </div>
                    <div className={clsx(
                        cardBorderStyles,
                        'rounded-xl bg-[var(--card-color)] p-6 text-center'
                    )}>
                        <div className='text-2xl font-bold text-green-500 mb-1'>
                            {fastestQuestion?.timeSpent.toFixed(1)}s
                        </div>
                        <div className='text-sm text-[var(--secondary-color)]'>Fastest Answer</div>
                    </div>
                    <div className={clsx(
                        cardBorderStyles,
                        'rounded-xl bg-[var(--card-color)] p-6 text-center'
                    )}>
                        <div className='text-2xl font-bold text-orange-500 mb-1'>
                            {slowestQuestion?.timeSpent.toFixed(1)}s
                        </div>
                        <div className='text-sm text-[var(--secondary-color)]'>Slowest Answer</div>
                    </div>
                </div>

                {/* Question Details */}
                <div className={clsx(
                    cardBorderStyles,
                    'rounded-2xl bg-[var(--card-color)] p-6'
                )}>
                    <h3 className='text-xl font-bold mb-4 flex items-center gap-2'>
                        <Award size={24} className='text-[var(--main-color)]' />
                        Question Details
                    </h3>
                    <div className='space-y-2'>
                        {result.questions.map((question, index) => (
                            <div
                                key={index}
                                className={clsx(
                                    'flex items-center justify-between p-4 rounded-lg',
                                    'border-2',
                                    question.isCorrect
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-red-50 border-red-200'
                                )}
                            >
                                <div className='flex items-center gap-4'>
                                    <div className={clsx(
                                        'w-8 h-8 rounded-full flex items-center justify-center font-bold',
                                        question.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                    )}>
                                        {question.isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                                    </div>
                                    <div>
                                        <div className='font-bold text-lg'>
                                            {question.gameMode === 'kana to romaji' && `${question.kana} → ${question.romaji}`}
                                            {question.gameMode === 'romaji to kana' && `${question.romaji} → ${question.kana}`}
                                            {question.gameMode === 'writing' && `${question.kana} → ${question.romaji}`}
                                        </div>
                                        {!question.isCorrect && question.userAnswer && (
                                            <div className='text-sm text-red-600'>
                                                Your answer: <span className='font-semibold'>{question.userAnswer}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <div className='flex items-center gap-1 text-sm text-[var(--secondary-color)]'>
                                        {getGameModeIcon(question.gameMode)}
                                        <span>{getGameModeName(question.gameMode)}</span>
                                    </div>
                                    <div className='text-sm font-semibold text-[var(--main-color)]'>
                                        {question.timeSpent.toFixed(1)}s
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='flex gap-4'>
                    <button
                        onClick={() => router.push('/test')}
                        className={clsx(
                            'flex-1 py-4 px-6 rounded-xl font-bold text-lg',
                            'bg-[var(--main-color)] text-white',
                            'hover:scale-105 transition-all duration-200'
                        )}
                    >
                        Take Another Test
                    </button>
                    <button
                        onClick={() => router.push('/test/results')}
                        className={clsx(
                            'flex-1 py-4 px-6 rounded-xl font-bold text-lg',
                            'bg-[var(--card-color)] text-[var(--main-color)]',
                            'border-2 border-[var(--border-color)]',
                            'hover:border-[var(--main-color)] hover:scale-105',
                            'transition-all duration-200'
                        )}
                    >
                        View All Results
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestResultDetail;
