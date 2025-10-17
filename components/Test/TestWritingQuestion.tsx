'use client';
import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { cardBorderStyles } from '@/static/styles';
import { ArrowRight, RotateCcw } from 'lucide-react';

interface TestWritingQuestionProps {
    kana: string;
    romaji: string;
    onAnswer: (userAnswer: string, isCorrect: boolean) => void;
}

const TestWritingQuestion = ({ kana, romaji, onAnswer }: TestWritingQuestionProps) => {
    const [showFeedback, setShowFeedback] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        ctx.scale(2, 2);

        // Set drawing style
        ctx.strokeStyle = 'var(--main-color)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, []);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }; const handleSubmit = () => {
        if (showFeedback) return;

        // For writing mode, we'll auto-mark as correct since we can't verify handwriting
        // In a real app, you'd use OCR or just show the answer for self-assessment
        setShowFeedback(true); setTimeout(() => {
            onAnswer(kana, true);
            clearCanvas();
            setShowFeedback(false);
        }, 1500);
    };

    return (
        <div className='w-full max-w-2xl'>
            <div className={clsx(
                cardBorderStyles,
                'rounded-2xl bg-[var(--card-color)] p-8 mb-6'
            )}>
                <p className='text-center text-sm text-[var(--secondary-color)] mb-2'>
                    Writing Practice
                </p>
                <h2 className='text-6xl font-bold text-center mb-4 text-[var(--main-color)]'>
                    {romaji}
                </h2>
                <p className='text-center text-[var(--secondary-color)]'>
                    Draw the kana character
                </p>
            </div>

            <div className={clsx(
                cardBorderStyles,
                'rounded-2xl bg-white p-4 mb-4',
                'relative'
            )}>
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className='w-full h-64 touch-none cursor-crosshair'
                />
                {showFeedback && (
                    <div className='absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-xl'>
                        <div className='text-8xl font-bold text-green-500 opacity-50'>
                            {kana}
                        </div>
                    </div>
                )}
            </div>

            <div className='flex gap-4'>
                <button
                    onClick={clearCanvas}
                    disabled={showFeedback}
                    className={clsx(
                        'flex-1 py-4 px-6 rounded-xl font-bold text-lg',
                        'border-2 transition-all duration-200',
                        'flex items-center justify-center gap-2',
                        showFeedback
                            ? 'bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-[var(--card-color)] border-[var(--border-color)] text-[var(--main-color)] hover:border-[var(--main-color)] hover:scale-105'
                    )}
                >
                    <RotateCcw size={20} />
                    Clear
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={showFeedback}
                    className={clsx(
                        'flex-1 py-4 px-6 rounded-xl font-bold text-lg',
                        'border-2 transition-all duration-200',
                        'flex items-center justify-center gap-2',
                        showFeedback
                            ? 'bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-[var(--main-color)] border-[var(--main-color)] text-white hover:scale-105'
                    )}
                >
                    Submit <ArrowRight size={20} />
                </button>
            </div>

            <p className='text-center text-sm text-[var(--secondary-color)] mt-4'>
                Note: Writing questions are automatically marked correct
            </p>
        </div>
    );
};

export default TestWritingQuestion;
