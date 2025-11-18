import React, { useState, useEffect, useCallback } from 'react';
import { Question, GameState, HallOfFameEntry } from './types';
import { ALL_QUESTIONS } from './constants/quizQuestions';
import StartScreen from './components/StartScreen';
import QuestionCard from './components/QuestionCard';
import ResultScreen from './components/ResultScreen';
import HallOfFameScreen from './components/HallOfFameScreen';
import { playBGM, stopBGM } from './utils/sounds';

const TOTAL_QUESTIONS = 10;
const HALL_OF_FAME_KEY = 'aiEthicsQuizHallOfFame';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [difficulty, setDifficulty] = useState<'low' | 'high' | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const getHallOfFame = (): HallOfFameEntry[] => {
    try {
      const data = localStorage.getItem(HALL_OF_FAME_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Could not parse hall of fame data:", error);
      return [];
    }
  };

  useEffect(() => {
    const hallOfFame = getHallOfFame();
    if (hallOfFame.length > 0) {
      setHighScore(hallOfFame[0].score);
    }
  }, []);

  const shuffleAndPickQuestions = useCallback((selectedDifficulty: 'low' | 'high') => {
    const filteredQuestions = ALL_QUESTIONS.filter(q => q.difficulty === selectedDifficulty);
    const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, TOTAL_QUESTIONS);
  }, []);

  const handleStartQuiz = useCallback((selectedDifficulty: 'low' | 'high') => {
    setDifficulty(selectedDifficulty);
    setQuestions(shuffleAndPickQuestions(selectedDifficulty));
    setScore(0);
    setStreak(0);
    setCurrentQuestionIndex(0);
    setGameState('playing');
    playBGM();
  }, [shuffleAndPickQuestions]);
  
  const handlePlayAgain = useCallback(() => {
    stopBGM();
    const hallOfFame = getHallOfFame();
    if (hallOfFame.length > 0) {
      setHighScore(hallOfFame[0].score);
    } else {
      setHighScore(0);
    }
    setDifficulty(null);
    setGameState('start');
  }, []);

  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      const bonus = streak * 10;
      setScore(prev => prev + 10 + bonus);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  }, [streak]);

  const handleNextQuestion = useCallback(() => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < TOTAL_QUESTIONS) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      setGameState('finished');
    }
  }, [currentQuestionIndex]);

  const handleNameSubmit = useCallback((name: string, grade: number) => {
    const newEntry: HallOfFameEntry = {
      name,
      grade,
      score: score,
      date: Date.now(),
    };

    const hallOfFame = getHallOfFame();
    const updatedHallOfFame = [...hallOfFame, newEntry];

    updatedHallOfFame.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.date - b.date;
    });

    localStorage.setItem(HALL_OF_FAME_KEY, JSON.stringify(updatedHallOfFame.slice(0, 100)));
    
    setGameState('hallOfFame');
  }, [score]);


  return (
    <div className="w-screen h-screen bg-gradient-to-b from-yellow-200 via-green-200 to-blue-300 flex items-center justify-center p-4">
      <div className="w-full max-w-md h-full max-h-[800px] bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl flex flex-col p-6 text-gray-800">
        {gameState === 'start' && (
          <StartScreen onStart={handleStartQuiz} highScore={highScore} />
        )}
        {gameState === 'playing' && questions.length > 0 && (
          <QuestionCard
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={TOTAL_QUESTIONS}
            streak={streak}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
          />
        )}
        {gameState === 'finished' && (
          <ResultScreen score={score} onNameSubmit={handleNameSubmit} />
        )}
        {gameState === 'hallOfFame' && (
          <HallOfFameScreen onPlayAgain={handlePlayAgain} />
        )}
      </div>
    </div>
  );
};

export default App;
