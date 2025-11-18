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
  const [topEntry, setTopEntry] = useState<HallOfFameEntry | null>(null);

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
      setTopEntry(hallOfFame[0]);
    } else {
      setTopEntry(null);
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
      setTopEntry(hallOfFame[0]);
    } else {
      setTopEntry(null);
    }
    setDifficulty(null);
    setGameState('start');
  }, []);

  const handleAnswer = useCallback((isCorrect: boolean, timeLeft: number) => {
    if (isCorrect) {
      const bonus = streak * 10;
      // 기본 10점 + 콤보 보너스 + 시간 보너스(남은 시간)
      setScore(prev => prev + 10 + bonus + timeLeft);
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
    // START: 수정된 부분 (레이아웃 변경)
    // 1. 바깥 div: 배경 그라데이션을 적용하고, 화면 전체를 채우도록 변경
    <div className="w-screen h-screen bg-gradient-to-b from-yellow-200 via-green-200 to-blue-300">
      {/* 2. 안쪽 div: 카드 형태(max-w, max-h, bg-white, shadow 등)를 모두 제거하고, 
             w-full, h-full로 부모(배경)를 꽉 채우도록 변경 */}
      <div className="w-full h-full flex flex-col p-6 text-gray-800">
    {/* END: 수정된 부분 */}

        {gameState === 'start' && (
          <StartScreen onStart={handleStartQuiz} topEntry={topEntry} />
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
          // START: 수정된 부분 (onGoHome prop 전달)
          <ResultScreen 
            score={score} 
            onNameSubmit={handleNameSubmit} 
            onGoHome={handlePlayAgain}
          />
          // END: 수정된 부분
        )}
        {gameState === 'hallOfFame' && (
          <HallOfFameScreen onPlayAgain={handlePlayAgain} />
        )}
      </div>
    </div>
  );
};

export default App;
