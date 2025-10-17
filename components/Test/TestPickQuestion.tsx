'use client';
import { useState } from 'react';
import clsx from 'clsx';
import { cardBorderStyles } from '@/static/styles';

interface TestPickQuestionProps {
    kana: string;
    romaji: string;
    onAnswer: (userAnswer: string, isCorrect: boolean) => void;
    allKanaPairs: { kana: string; romaji: string }[];
}

const TestPickQuestion = ({ kana, romaji, onAnswer, allKanaPairs }: TestPickQuestionProps) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    // Generate 3 wrong options + 1 correct option
    const getOptions = () => {
        const wrongOptions: string[] = [];
        const usedIndices = new Set<number>();

        while (wrongOptions.length < 3) {
            const randomIndex = Math.floor(Math.random() * allKanaPairs.length);
            if (!usedIndices.has(randomIndex) && allKanaPairs[randomIndex].romaji !== romaji) {
                wrongOptions.push(allKanaPairs[randomIndex].romaji);
                usedIndices.add(randomIndex);
            }
        }

        return [...wrongOptions, romaji].sort(() => Math.random() - 0.5);
    };

    const [options] = useState(() => getOptions());

    const handleSelect = (option: string) => {
        if (showFeedback) return;

        setSelectedAnswer(option);
        setShowFeedback(true);

        const isCorrect = option === romaji;

        setTimeout(() => {
            onAnswer(option, isCorrect);
            setShowFeedback(false);
            setSelectedAnswer(null);
        }, 1000);
    };

    return (
        <div className='w-full max-w-2xl'>
            <div className={clsx(
                cardBorderStyles,
                'rounded-2xl bg-[var(--card-color)] p-8 mb-6'
            )}>
                <p className='text-center text-sm text-[var(--secondary-color)] mb-2'>
                    Multiple Choice
                </p>
                <h2 className='text-8xl font-bold text-center mb-4 text-[var(--main-color)]'>
                    {kana}
                </h2>
                <p className='text-center text-[var(--secondary-color)]'>
                    Select the correct romaji
                </p>
            </div>

            <div className='grid grid-cols-2 gap-4'>
                {options.map((option, index) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrect = option === romaji;

                    let buttonClass = 'bg-[var(--card-color)] border-[var(--border-color)] hover:border-[var(--main-color)]';

                    if (showFeedback) {
                        if (isSelected && isCorrect) {
                            buttonClass = 'bg-green-500 border-green-500 text-white';
                        } else if (isSelected && !isCorrect) {
                            buttonClass = 'bg-red-500 border-red-500 text-white';
                        } else if (isCorrect) {
                            buttonClass = 'bg-green-500 border-green-500 text-white';
                        }
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => handleSelect(option)}
                            disabled={showFeedback}
                            className={clsx(
                                'py-6 px-8 rounded-xl font-bold text-2xl',
                                'border-2 transition-all duration-200',
                                buttonClass,
                                !showFeedback && 'hover:scale-105',
                                showFeedback && 'cursor-not-allowed'
                            )}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default TestPickQuestion;
