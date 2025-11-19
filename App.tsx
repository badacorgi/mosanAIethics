import React, { useState, useEffect, useCallback } from 'react';
import { Question, GameState, HallOfFameEntry } from './types';
import { ALL_QUESTIONS } from './constants/quizQuestions';
import StartScreen from './components/StartScreen';
import QuestionCard from './components/QuestionCard';
import ResultScreen from './components/ResultScreen';
import HallOfFameScreen from './components/HallOfFameScreen';
import { playBGM, stopBGM } from './utils/sounds';

const TOTAL_QUESTIONS = 10;
// START: 수정된 부분 (명예의 전당 키 분리)
const HALL_OF_FAME_LOW_KEY = 'aiEthicsQuizHallOfFameLow';
const HALL_OF_FAME_HIGH_KEY = 'aiEthicsQuizHallOfFameHigh';
// END: 수정된 부분

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [difficulty, setDifficulty] = useState<'low' | 'high' | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  // START: 수정된 부분 (topEntry를 난이도별로 분리)
  const [topEntries, setTopEntries] = useState<{ low: HallOfFameEntry | null; high: HallOfFameEntry | null }>({ low: null, high: null });
  // END: 수정된 부분

  // START: 수정된 부분 (난이도별 키 사용)
  const getHallOfFame = (key: string): HallOfFameEntry[] => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Could not parse hall of fame data:", error);
      return [];
    }
  };
  // END: 수정된 부분

  useEffect(() => {
    // START: 수정된 부분 (저학년/고학년 최고 기록 모두 가져오기)
    const lowHallOfFame = getHallOfFame(HALL_OF_FAME_LOW_KEY);
    const highHallOfFame = getHallOfFame(HALL_OF_FAME_HIGH_KEY);

    setTopEntries({
      low: lowHallOfFame.length > 0 ? lowHallOfFame[0] : null,
      high: highHallOfFame.length > 0 ? highHallOfFame[0] : null,
    });
    // END: 수정된 부분
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
    // START: 수정된 부분 (최고 기록 갱신)
    const lowHallOfFame = getHallOfFame(HALL_OF_FAME_LOW_KEY);
    const highHallOfFame = getHallOfFame(HALL_OF_FAME_HIGH_KEY);
    setTopEntries({
      low: lowHallOfFame.length > 0 ? lowHallOfFame[0] : null,
      high: highHallOfFame.length > 0 ? highHallOfFame[0] : null,
    });
    // END: 수정된 부분
    setDifficulty(null);
    setGameState('start');
  }, []);

  // START: 수정된 부분 (점수 산정 로직 변경: 기본 10점 -> 50점, 콤보당 10점 -> 20점)
  const handleAnswer = useCallback((isCorrect: boolean, timeLeft: number) => {
    if (isCorrect) {
      const bonus = streak * 20; // 콤보 점수 상향 (10 -> 20)
      setScore(prev => prev + 50 + bonus + timeLeft); // 기본 점수 상향 (10 -> 50)
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  }, [streak]);
  // END: 수정된 부분

  const handleNextQuestion = useCallback(() => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < TOTAL_QUESTIONS) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      stopBGM(); 
      setGameState('finished');
    }
  }, [currentQuestionIndex]);

  // START: 수정된 부분 (명예의 전당 저장 로직: 난이도별 키 사용)
  const handleNameSubmit = useCallback((name: string, grade: number) => {
    if (!difficulty) return; // 난이도 정보가 없으면 저장하지 않음

    const HALL_OF_FAME_KEY = difficulty === 'low' ? HALL_OF_FAME_LOW_KEY : HALL_OF_FAME_HIGH_KEY;

    const newEntry: HallOfFameEntry = {
      name,
      grade,
      score: score,
      date: Date.now(),
    };

    const hallOfFame = getHallOfFame(HALL_OF_FAME_KEY);
    let updatedHallOfFame = [...hallOfFame];

    // 같은 학년, 같은 이름의 기존 기록이 있는지 확인
    const existingEntryIndex = hallOfFame.findIndex(
      entry => entry.name === newEntry.name && entry.grade === newEntry.grade
    );

    if (existingEntryIndex > -1) {
      // 기존 기록이 있을 때
      const existingEntry = hallOfFame[existingEntryIndex];
      if (newEntry.score > existingEntry.score) {
        // 새 점수가 더 높으면 기존 기록을 새 기록으로 교체
        updatedHallOfFame[existingEntryIndex] = newEntry;
      }
      // 새 점수가 더 낮거나 같으면 아무것도 하지 않음 (updatedHallOfFame는 그대로)
    } else {
      // 기존 기록이 없으면 새 기록을 추가
      updatedHallOfFame.push(newEntry);
    }

    // 점수(내림차순), 날짜(오름차순) 순으로 정렬
    updatedHallOfFame.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.date - b.date;
    });

    // 상위 100개만 저장
    localStorage.setItem(HALL_OF_FAME_KEY, JSON.stringify(updatedHallOfFame.slice(0, 100)));
    
    setGameState('hallOfFame');
  }, [score, difficulty]);
  // END: 수정된 부분


  return (
    <div className="w-screen h-screen bg-gradient-to-b from-yellow-200 via-green-200 to-blue-300">
      <div className="w-full h-full flex flex-col p-6 text-gray-800">

        {gameState === 'start' && (
          // START: 수정된 부분 (StartScreen에는 저학년 최고 기록을 전달)
          <StartScreen onStart={handleStartQuiz} topEntry={topEntries.low} />
          // END: 수정된 부분
        )}
        {gameState === 'playing' && questions.length > 0 && (
          <QuestionCard
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={TOTAL_QUESTIONS}
            streak={streak}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
            onQuit={handlePlayAgain}
          />
        )}
        {gameState === 'finished' && (
          <ResultScreen 
            score={score} 
            onNameSubmit={handleNameSubmit} 
            onGoHome={handlePlayAgain}
          />
        )}
        {gameState === 'hallOfFame' && (
          // START: 수정된 부분 (currentDifficulty prop 추가)
          <HallOfFameScreen onPlayAgain={handlePlayAgain} currentDifficulty={difficulty} />
          // END: 수정된 부분
        )}
      </div>
    </div>
  );
};

export default App;
