import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types';
import { playCorrectSound, playIncorrectSound } from '../utils/sounds';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  streak: number;
  onAnswer: (isCorrect: boolean, timeLeft: number) => void;
  onNext: () => void;
  onQuit: () => void; // START: 수정된 부분
}

const TIME_LIMIT = 20;

const QuestionCard: React.FC<QuestionCardProps> = ({ question, questionNumber, totalQuestions, streak, onAnswer, onNext, onQuit }) => { // START: 수정된 부분
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(TIME_LIMIT);
  };
  
  useEffect(() => {
    setSelectedAnswerIndex(null);
    setIsAnswered(false);
    resetTimer();
  }, [question]);

  useEffect(() => {
    if (isAnswered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAnswered]);

  useEffect(() => {
    if (timeLeft <= 0 && !isAnswered) {
        setIsAnswered(true);
        onAnswer(false, 0);
        playIncorrectSound();
    }
  }, [timeLeft, isAnswered, onAnswer]);


  const handleAnswerClick = (index: number) => {
    if (isAnswered) return;
    
    setIsAnswered(true);
    setSelectedAnswerIndex(index);
    const isCorrect = index === question.correctAnswerIndex;
    
    onAnswer(isCorrect, timeLeft);

    if (isCorrect) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }
  };

  const getButtonClass = (index: number) => {
    if (!isAnswered) {
      return 'bg-white hover:bg-green-100';
    }
    if (index === question.correctAnswerIndex) {
      return 'bg-green-500 text-white animate-pulse';
    }
    if (index === selectedAnswerIndex) {
      return 'bg-red-500 text-white';
    }
    return 'bg-white opacity-60';
  };
  
  const isCorrect = selectedAnswerIndex === question.correctAnswerIndex;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Non-scrolling Header (flex-shrink: 0) */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex justify-between items-center">
            <p className="text-green-600 font-bold text-xl">문제 {questionNumber}/{totalQuestions}</p>
            
            {/* START: 수정된 부분 (포기하기 버튼 / 콤보) */}
            { streak > 0 && isAnswered && isCorrect && (
              <span className="text-orange-500 font-bold animate-bounce">🔥 {streak} COMBO!</span>
            )}
            {!isAnswered && (
              <button 
                onClick={onQuit} 
                className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded-full hover:bg-red-200 hover:text-red-700 transition-colors"
              >
                포기하기
              </button>
            )}
            {/* END: 수정된 부분 */}

        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mt-1 border-2 border-gray-300 overflow-hidden">
          <div 
            className="bg-yellow-400 h-full rounded-full transition-all duration-1000 linear" 
            style={{ width: `${(timeLeft / TIME_LIMIT) * 100}%` }}>
          </div>
        </div>
      </div>
      
      {/* Scrollable Main Content (flex-grow) */}
      <div className="flex-grow overflow-y-auto pr-2 -mr-2 min-h-0 pb-4">
        
        {/* 문제 박스 (개별 스크롤 적용됨) */}
        <div className="bg-green-50 p-6 rounded-2xl mb-4 min-h-[120px] max-h-48 overflow-y-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center leading-relaxed">{question.question}</h2>
        </div>

        {/* 선택지 박스 */}
        <div className="space-y-3 mb-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(index)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-xl text-lg text-left font-semibold shadow-md transition-all duration-300 ${getButtonClass(index)}`}
            >
              {index + 1}. {option}
            </button>
          ))}
        </div>

        {/* 해설 박스 (정답을 선택했을 때만 보임) */}
        {isAnswered && (
          <div className="animate-fade-in mt-2">
              {/* 해설 (개별 스크롤 적용됨) */}
              <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-lg max-h-36 overflow-y-auto">
                  <p className="font-bold">
                      {timeLeft <= 0 ? '시간 초과! ⏰' : (isCorrect ? '정답이에요! 🎉' : '아쉬워요! 🙁')}
                  </p>
                  
                  {isCorrect && (
                    <p className="font-bold text-orange-500 text-sm mt-1">
                      + {10 + (streak * 10) + timeLeft} 점! 
                      <span className="text-xs text-orange-400 ml-1">
                        (기본 +10{streak > 0 ? `, 콤보 +${streak*10}` : ''}, 시간 +{timeLeft})
                      </span>
                    </p>
                  )}

                  <p className="mt-1 text-sm">{question.explanation}</p>
              </div>
          </div>
        )}
      </div>

      {/* Non-scrolling Footer (flex-shrink: 0) */}
      {isAnswered && (
        <div className="flex-shrink-0 mt-4 px-1">
          <button
              onClick={onNext}
              className="w-full bg-green-600 text-white font-bold text-2xl py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300"
          >
              {questionNumber === totalQuestions ? '결과 확인 및 기록하기' : '다음 문제'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
