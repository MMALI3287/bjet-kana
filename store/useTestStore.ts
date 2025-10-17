import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface TestQuestion {
    kana: string;
    romaji: string;
    gameMode: 'kana to romaji' | 'romaji to kana' | 'writing';
    userAnswer: string;
    isCorrect: boolean;
    timeSpent: number; // in seconds
}export interface TestResult {
    id: string; // timestamp-based ID
    studentName?: string; // for future admin feature
    date: string;
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    totalTime: number; // in seconds
    score: number; // percentage
    questions: TestQuestion[];
}

interface TestState {
    // Current test session
    isTestActive: boolean;
    totalQuestions: number;
    currentQuestionIndex: number;
    questions: TestQuestion[];
    startTime: number;

    // Test results history
    testResults: TestResult[];

    // Actions
    startTest: (totalQuestions: number) => void;
    addQuestion: (question: TestQuestion) => void;
    endTest: () => void;
    resetTest: () => void;
    clearTestHistory: () => void;
    getTestResult: (id: string) => TestResult | undefined;
}

const useTestStore = create<TestState>()(
    persist(
        (set, get) => ({
            // Initial state
            isTestActive: false,
            totalQuestions: 0,
            currentQuestionIndex: 0,
            questions: [],
            startTime: 0,
            testResults: [],

            // Start a new test
            startTest: (totalQuestions: number) => {
                set({
                    isTestActive: true,
                    totalQuestions,
                    currentQuestionIndex: 0,
                    questions: [],
                    startTime: Date.now(),
                });
            },

            // Add a question result
            addQuestion: (question: TestQuestion) => {
                set(state => ({
                    questions: [...state.questions, question],
                    currentQuestionIndex: state.currentQuestionIndex + 1,
                }));
            },

            // End test and save results
            endTest: () => {
                const state = get();
                const endTime = Date.now();
                const totalTime = (endTime - state.startTime) / 1000; // convert to seconds

                // If questions array is empty, we need to get data from stats store
                let correctAnswers = state.questions.filter(q => q.isCorrect).length;
                let wrongAnswers = state.questions.length - correctAnswers;

                // If no questions recorded, use total questions
                if (state.questions.length === 0) {
                    correctAnswers = 0;
                    wrongAnswers = 0;
                }

                const score = state.totalQuestions > 0
                    ? Math.round((correctAnswers / state.totalQuestions) * 100)
                    : 0;

                const result: TestResult = {
                    id: Date.now().toString(),
                    date: new Date().toISOString(),
                    totalQuestions: state.totalQuestions,
                    correctAnswers,
                    wrongAnswers,
                    totalTime,
                    score,
                    questions: state.questions,
                };

                set(state => ({
                    isTestActive: false,
                    testResults: [...state.testResults, result],
                }));

                return result;
            },

            // Reset current test without saving
            resetTest: () => {
                set({
                    isTestActive: false,
                    totalQuestions: 0,
                    currentQuestionIndex: 0,
                    questions: [],
                    startTime: 0,
                });
            },

            // Clear all test history
            clearTestHistory: () => {
                set({ testResults: [] });
            },

            // Get specific test result
            getTestResult: (id: string) => {
                return get().testResults.find(result => result.id === id);
            },
        }),
        {
            name: 'bjet-test-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                testResults: state.testResults,
            }),
        }
    )
);

export default useTestStore;
