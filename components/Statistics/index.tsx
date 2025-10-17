'use client';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
    Hourglass,
    SquareCheck,
    SquareX,
    ChartSpline,
    Target,
    Timer,
    ClockFading,
    Clover,
    HeartCrack,
    CircleDivide,
    Flame,
    Shapes,
    Sigma,
    Trash2,
    TrendingUp,
} from 'lucide-react';
import useStatsStore from '@/store/useStatsStore';
import { findHighestCounts } from '@/lib/helperFunctions';
import { miniButtonBorderStyles, cardBorderStyles } from '@/static/styles';
import Link from 'next/link';
import { useClick } from '@/lib/hooks/useAudio';
import Header from '@/components/reusable/Header'; const StatisticsView = () => {
    const { playClick } = useClick();
    const [mounted, setMounted] = useState(false);

    const allTimeStats = useStatsStore(state => state.allTimeStats);
    const clearAllTimeStats = useStatsStore(state => state.clearAllTimeStats);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
                <div className="text-2xl text-[var(--secondary-color)]">Loading statistics...</div>
            </div>
        );
    }

    const totalMinutes = Math.floor(allTimeStats.totalTimeMilliseconds / 60000);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    const totalSeconds = Math.floor(allTimeStats.totalTimeMilliseconds / 1000);
    const remainingSeconds = totalSeconds % 60;

    const accuracy =
        allTimeStats.totalCorrectAnswers > 0
            ? (allTimeStats.totalCorrectAnswers /
                (allTimeStats.totalCorrectAnswers + allTimeStats.totalWrongAnswers)) *
            100
            : 0;

    const ciRatio =
        allTimeStats.totalWrongAnswers > 0
            ? allTimeStats.totalCorrectAnswers / allTimeStats.totalWrongAnswers
            : allTimeStats.totalCorrectAnswers > 0
                ? Infinity
                : 0;

    const validAnswerTimes = allTimeStats.allCorrectAnswerTimes.filter(time => time > 0);

    const averageCorrectAnswerTime =
        validAnswerTimes.length > 0
            ? validAnswerTimes.reduce((acc, curr) => acc + curr, 0) / validAnswerTimes.length
            : 0;

    const fastestCorrectAnswer =
        validAnswerTimes.length > 0
            ? Math.min(...validAnswerTimes)
            : 0;

    const slowestCorrectAnswer =
        validAnswerTimes.length > 0
            ? Math.max(...validAnswerTimes)
            : 0;

    const { highestCorrectChars, highestCorrectCharsValue, highestWrongChars, highestWrongCharsValue } =
        findHighestCounts(allTimeStats.allCharacterScores);

    const uniqueCharactersPlayed = Object.keys(allTimeStats.allCharacterScores).length;
    const totalCharactersPlayed = Object.values(allTimeStats.allCharacterScores).reduce(
        (acc, curr) => acc + curr.correct + curr.wrong,
        0
    );

    const statsFields = [
        {
            field: 'total sessions',
            value: `${allTimeStats.totalSessions}`,
            icons: [TrendingUp],
        },
        {
            field: 'total training time',
            value:
                totalHours > 0
                    ? `${totalHours}h ${remainingMinutes}m ${remainingSeconds}s`
                    : totalMinutes > 0
                        ? `${totalMinutes}m ${remainingSeconds}s`
                        : `${totalSeconds}s`,
            icons: [Hourglass],
        },
        {
            field: 'correct answers',
            value: `${allTimeStats.totalCorrectAnswers}`,
            icons: [SquareCheck],
        },
        {
            field: 'wrong answers',
            value: `${allTimeStats.totalWrongAnswers}`,
            icons: [SquareX],
        },
        {
            field: 'accuracy',
            value: `${accuracy > 0 ? accuracy.toFixed(1) + '%' : '~'}`,
            icons: [Target],
        },
        {
            field: 'average time per correct answer',
            value: `${averageCorrectAnswerTime > 0 ? averageCorrectAnswerTime.toFixed(2) + 's' : '~'}`,
            icons: [Timer],
        },
        {
            field: 'fastest correct answer',
            value: `${fastestCorrectAnswer > 0 ? fastestCorrectAnswer.toFixed(2) + 's' : '~'}`,
            icons: [Flame],
        },
        {
            field: 'slowest correct answer',
            value: `${slowestCorrectAnswer > 0 ? slowestCorrectAnswer.toFixed(2) + 's' : '~'}`,
            icons: [ClockFading],
        },
        {
            field: 'correct / incorrect answers ratio',
            value: `${ciRatio === Infinity ? '∞' : ciRatio > 0 ? ciRatio.toFixed(2) : '~'}`,
            icons: [CircleDivide],
        },
        {
            field: 'characters played',
            value: `${totalCharactersPlayed}`,
            icons: [Sigma],
        },
        {
            field: 'unique characters played',
            value: `${uniqueCharactersPlayed}`,
            icons: [Shapes],
        },
        {
            field: 'easiest characters',
            value: `${highestCorrectChars.length >= 1
                ? highestCorrectChars.join(', ') + ' - ' + highestCorrectCharsValue + ' correct'
                : '~'
                }`,
            icons: [Clover],
        },
        {
            field: 'hardest characters',
            value: `${highestWrongChars.length >= 1
                ? highestWrongChars.join(', ') + ' - ' + highestWrongCharsValue + ' wrong'
                : '~'
                }`,
            icons: [HeartCrack],
        },
    ];

    const handleClearStats = () => {
        if (
            window.confirm(
                'Are you sure you want to clear all statistics? This action cannot be undone.'
            )
        ) {
            playClick();
            clearAllTimeStats();
        }
    };

    return (
        <div className='min-h-[100dvh] max-w-[100dvw] flex'>
            <div className={clsx(
                'flex flex-col gap-4',
                'w-full px-4 md:px-8',
                'pb-8 pt-4',
            )}>
                <Header />                <div className="flex flex-col items-center gap-6 w-full">
                    <div className="flex flex-col items-center gap-4 w-full max-w-6xl pt-4">
                        <h1 className="text-4xl md:text-5xl flex flex-row items-center gap-3">
                            <ChartSpline size={40} className="mt-1" />
                            <span>Training Statistics</span>
                        </h1>
                    </div>

                    {allTimeStats.totalSessions === 0 ? (
                        <div className={clsx('flex flex-col items-center gap-4 p-8', cardBorderStyles)}>
                            <p className="text-xl text-[var(--secondary-color)]">
                                No statistics yet. Start training to see your progress!
                            </p>
                            <Link href="/kana" className={clsx('px-6 py-3 text-lg', miniButtonBorderStyles)}>
                                Start Training
                            </Link>
                        </div>
                    ) : (
                        <div className={clsx('flex flex-col items-start w-full max-w-6xl', 'lg:flex-row lg:gap-10')}>
                            <div className={clsx('flex flex-col gap-4 py-4 items-start flex-1')}>
                                <h2 className={clsx('w-full text-2xl md:text-3xl border-b-2 border-[var(--border-color)] pb-2')}>
                                    General
                                </h2>
                                <div className={clsx('flex flex-col gap-4 w-full')}>
                                    {statsFields.slice(0, 5).map((statsField, i) => (
                                        <p
                                            className={clsx(
                                                'flex flex-row items-center justify-start gap-2 text-base md:text-lg',
                                                i < 4 && 'border-b-1 border-[var(--border-color)] pb-4'
                                            )}
                                            key={statsField.field}
                                        >
                                            <span className="text-[var(--secondary-color)] capitalize">
                                                {statsField.field + ': '}
                                            </span>
                                            <span className="font-semibold">{statsField.value}</span>
                                            {statsField.icons.map((Icon, i) => (
                                                <Icon size={24} key={i} className="text-[var(--main-color)]" />
                                            ))}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            <div className={clsx('flex flex-col gap-4 py-4 items-start flex-1')}>
                                <h2 className={clsx('w-full text-2xl md:text-3xl border-b-2 border-[var(--border-color)] pb-2')}>
                                    Answers
                                </h2>
                                <div className={clsx('flex flex-col gap-4 w-full')}>
                                    {statsFields.slice(5, 9).map((statsField, i) => (
                                        <p
                                            className={clsx(
                                                'flex flex-row items-center justify-start gap-2 text-base md:text-lg',
                                                i < 3 && 'border-b-1 border-[var(--border-color)] pb-4'
                                            )}
                                            key={statsField.field}
                                        >
                                            <span className="text-[var(--secondary-color)] capitalize">
                                                {statsField.field + ': '}
                                            </span>
                                            <span className="font-semibold">{statsField.value}</span>
                                            {statsField.icons.map((Icon, i) => (
                                                <Icon size={24} key={i} className="text-[var(--main-color)]" />
                                            ))}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            <div className={clsx('flex flex-col gap-4 py-4 items-start flex-1')}>
                                <h2 className={clsx('w-full text-2xl md:text-3xl border-b-2 border-[var(--border-color)] pb-2')}>
                                    Characters
                                </h2>
                                <div className={clsx('flex flex-col gap-4 w-full')}>
                                    {statsFields.slice(9, 13).map((statsField, i) => (
                                        <p
                                            className={clsx(
                                                'flex flex-row items-center justify-start gap-2 text-base md:text-lg',
                                                i < 3 && 'border-b-1 border-[var(--border-color)] pb-4'
                                            )}
                                            key={statsField.field}
                                        >
                                            <span className="text-[var(--secondary-color)] capitalize">
                                                {statsField.field + ': '}
                                            </span>
                                            <span className="font-semibold">{statsField.value}</span>
                                            {statsField.icons.map((Icon, i) => (
                                                <Icon size={24} key={i} className="text-[var(--main-color)]" />
                                            ))}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Floating Clear Stats Button */}
                    {allTimeStats.totalSessions > 0 && (
                        <button
                            onClick={handleClearStats}
                            className={clsx(
                                'fixed bottom-6 right-6',
                                'px-4 py-3 flex flex-row items-center gap-2',
                                'rounded-2xl shadow-lg',
                                'bg-[var(--card-color)]',
                                'border-2 border-[var(--border-color)]',
                                'hover:border-red-500 hover:bg-red-500/10',
                                'text-[var(--main-color)]',
                                'transition-all duration-200',
                                'z-50'
                            )}
                        >
                            <Trash2 size={20} />
                            <span className="hidden sm:inline">Clear Stats</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatisticsView;
