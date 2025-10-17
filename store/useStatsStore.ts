import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface IStatsState {
  score: number;
  setScore: (newScore: number) => void;

  showStats: boolean;
  toggleStats: () => void;
  resumeStopwatch: () => void;

  numCorrectAnswers: number;
  numWrongAnswers: number;

  incrementCorrectAnswers: () => void;
  incrementWrongAnswers: () => void;

  correctAnswerTimes: number[];
  addCorrectAnswerTime: (newCorrectAnswerTime: number) => void;

  characterHistory: string[];
  addCharacterToHistory: (character: string) => void;

  gameModeHistory: string[];
  addGameModeToHistory: (gameMode: string) => void;

  userAnswerHistory: string[];
  addUserAnswerToHistory: (userAnswer: string) => void;

  characterScores: {
    [key: string]: {
      correct: number;
      wrong: number;
      accuracy: number;
    };
  };
  incrementCharacterScore: (
    character: string,
    fieldToIncrement: 'correct' | 'wrong'
  ) => void;

  resetStats: () => void;

  totalMilliseconds: number;
  setNewTotalMilliseconds: (newTotalMilliseconds: number) => void;

  stars: number;
  setStars: (newStars: number) => void;

  iconIndices: number[];
  addIconIndex: (newIconIndex: number) => void;

  timedCorrectAnswers: number;
  timedWrongAnswers: number;
  timedStreak: number;

  incrementTimedCorrectAnswers: () => void;
  incrementTimedWrongAnswers: () => void;
  resetTimedStats: () => void;

  // Historical stats
  allTimeStats: {
    totalSessions: number;
    totalCorrectAnswers: number;
    totalWrongAnswers: number;
    totalTimeMilliseconds: number;
    allCorrectAnswerTimes: number[];
    allCharacterScores: {
      [key: string]: {
        correct: number;
        wrong: number;
        accuracy: number;
      };
    };
  };

  saveCurrentSession: () => void;
  clearAllTimeStats: () => void;
}

const useStatsStore = create<IStatsState>()(
  persist(
    set => ({
      score: 0,
      setScore: newScore => {
        set(() => ({
          score: newScore
        }));
      },

      showStats: false,
      toggleStats: () => {
        set(state => ({
          showStats: !state.showStats
        }));
      },

      resumeStopwatch: () => {
        // This will be used to signal the stopwatch to resume
        // The actual resume logic is in GameIntel component
      },

      numCorrectAnswers: 0,
      numWrongAnswers: 0,

      incrementCorrectAnswers: () => {
        set(state => ({
          numCorrectAnswers: state.numCorrectAnswers + 1
        }));
      },
      incrementWrongAnswers: () => {
        set(state => ({
          numWrongAnswers: state.numWrongAnswers + 1
        }));
      },

      correctAnswerTimes: [],
      addCorrectAnswerTime: newCorrectAnswerTime => {
        set(state => ({
          correctAnswerTimes: [...state.correctAnswerTimes, newCorrectAnswerTime]
        }));
      },

      characterHistory: [],
      addCharacterToHistory: character => {
        set(state => ({
          characterHistory: [...state.characterHistory, character]
        }));
      },

      gameModeHistory: [],
      addGameModeToHistory: gameMode => {
        set(state => ({
          gameModeHistory: [...state.gameModeHistory, gameMode]
        }));
      },

      userAnswerHistory: [],
      addUserAnswerToHistory: userAnswer => {
        set(state => ({
          userAnswerHistory: [...state.userAnswerHistory, userAnswer]
        }));
      },

      characterScores: {},
      incrementCharacterScore: (character, fieldToIncrement) => {
        set(state => {
          const characterScoresCopy = structuredClone(state.characterScores);

          // Initialize the character's score object if it doesn't exist
          if (!characterScoresCopy[character]) {
            characterScoresCopy[character] = {
              correct: 0,
              wrong: 0,
              accuracy: 0
            };
          }

          characterScoresCopy[character][fieldToIncrement] += 1;

          characterScoresCopy[character]['accuracy'] =
            characterScoresCopy[character]['correct'] /
            (characterScoresCopy[character]['correct'] +
              characterScoresCopy[character]['wrong']);
          return { characterScores: characterScoresCopy };
        });
      },

      resetStats: () => {
        set(() => ({
          numCorrectAnswers: 0,
          numWrongAnswers: 0,
          characterHistory: [],
          gameModeHistory: [],
          userAnswerHistory: [],
          characterScores: {},
          totalMilliseconds: 0,
          correctAnswerTimes: [],
          score: 0,
          stars: 0,
          iconIndices: []
        }));
      },

      totalMilliseconds: 0,
      setNewTotalMilliseconds: newTotalMilliseconds => {
        set(() => ({
          totalMilliseconds: newTotalMilliseconds
        }));
      },

      stars: 0,
      setStars: newStars =>
        set(() => ({
          stars: newStars
        })),

      iconIndices: [],
      addIconIndex: newIconIndex =>
        set(state => ({
          iconIndices: [...state.iconIndices, newIconIndex]
        })),

      timedCorrectAnswers: 0,
      timedWrongAnswers: 0,
      timedStreak: 0,

      incrementTimedCorrectAnswers: () => {
        set(state => ({
          timedCorrectAnswers: state.timedCorrectAnswers + 1,
          timedStreak: state.timedStreak + 1
        }));
      },

      incrementTimedWrongAnswers: () => {
        set(state => ({
          timedWrongAnswers: state.timedWrongAnswers + 1,
          timedStreak: 0
        }));
      },

      resetTimedStats: () => {
        set(() => ({
          timedCorrectAnswers: 0,
          timedWrongAnswers: 0,
          timedStreak: 0
        }));
      },

      allTimeStats: {
        totalSessions: 0,
        totalCorrectAnswers: 0,
        totalWrongAnswers: 0,
        totalTimeMilliseconds: 0,
        allCorrectAnswerTimes: [],
        allCharacterScores: {}
      },

      saveCurrentSession: () => {
        set(state => {
          // Merge character scores
          const mergedCharacterScores = { ...state.allTimeStats.allCharacterScores };
          Object.keys(state.characterScores).forEach(char => {
            if (!mergedCharacterScores[char]) {
              mergedCharacterScores[char] = {
                correct: 0,
                wrong: 0,
                accuracy: 0
              };
            }
            mergedCharacterScores[char].correct += state.characterScores[char].correct;
            mergedCharacterScores[char].wrong += state.characterScores[char].wrong;
            mergedCharacterScores[char].accuracy =
              mergedCharacterScores[char].correct /
              (mergedCharacterScores[char].correct + mergedCharacterScores[char].wrong);
          });

          return {
            allTimeStats: {
              totalSessions: state.allTimeStats.totalSessions + 1,
              totalCorrectAnswers: state.allTimeStats.totalCorrectAnswers + state.numCorrectAnswers,
              totalWrongAnswers: state.allTimeStats.totalWrongAnswers + state.numWrongAnswers,
              totalTimeMilliseconds: state.allTimeStats.totalTimeMilliseconds + state.totalMilliseconds,
              allCorrectAnswerTimes: [
                ...state.allTimeStats.allCorrectAnswerTimes,
                ...state.correctAnswerTimes
              ],
              allCharacterScores: mergedCharacterScores
            }
          };
        });
      },

      clearAllTimeStats: () => {
        set(() => ({
          allTimeStats: {
            totalSessions: 0,
            totalCorrectAnswers: 0,
            totalWrongAnswers: 0,
            totalTimeMilliseconds: 0,
            allCorrectAnswerTimes: [],
            allCharacterScores: {}
          }
        }));
      }

    }),
    {
      name: 'kana-stats-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ allTimeStats: state.allTimeStats })
    }
  )
);

export default useStatsStore;
