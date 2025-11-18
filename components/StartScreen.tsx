import React from 'react';

interface StartScreenProps {
  onStart: (difficulty: 'low' | 'high') => void;
  highScore: number;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScore }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full">
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-green-700 mb-2">AI 윤리 퀴즈</h1>
        <p className="text-lg text-gray-600 mb-8">퀴즈를 풀며 AI 윤리박사가 되어보아요!</p>
        
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-yellow-300 w-full">
          <p className="text-xl font-bold text-yellow-600">🏆 명예의 전당 최고 기록 🏆</p>
          <p className="text-5xl font-bold text-yellow-500 mt-2">{highScore.toLocaleString()}점</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-700 mb-4">먼저, 난이도를 골라주세요!</h2>
        <div className="w-full space-y-4">
            <button
                onClick={() => onStart('low')}
                className="w-full bg-blue-500 text-white font-bold text-2xl py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
                저학년 (쉬운 문제)
            </button>
            <button
                onClick={() => onStart('high')}
                className="w-full bg-red-500 text-white font-bold text-2xl py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-300"
            >
                고학년 (생각하는 문제)
            </button>
        </div>
        <p className="text-base text-gray-500 mt-6 px-4">각 난이도별 문제 중 10개가<br/>무작위로 출제됩니다.</p>

      </div>
    </div>
  );
};

export default StartScreen;
