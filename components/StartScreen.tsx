import React from 'react';
import { unlockAudio } from '../utils/sounds';
import { HallOfFameEntry } from '../types';

interface StartScreenProps {
  onStart: (difficulty: 'low' | 'high') => void;
  topEntry: HallOfFameEntry | null;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, topEntry }) => {
  const handleStart = (difficulty: 'low' | 'high') => {
    unlockAudio();
    onStart(difficulty);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center h-full">
      {/* START: 수정된 부분
        - w-full max-w-md: 전체 화면이지만 내용은 가운데 정렬 (태블릿에서 너무 넓어지지 않게)
        - justify-center -> justify-around: 상, 중, 하단 요소를 화면에 보기 좋게 배분
      */}
      <div className="flex-grow overflow-y-auto flex flex-col items-center justify-around py-4 w-full max-w-md">
      {/* END: 수정된 부분 */}

        {/* --- 상단 타이틀 --- */}
        <div>
          {/* START: 수정된 부분 (그림자 효과, 텍스트 색상 변경) */}
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-2 drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            모산초 AI 윤리 퀴즈
          </h1>
          <p className="text-lg text-gray-800 font-medium">
            퀴즈를 풀며 AI 윤리박사가 되어보아요!
          </p>
          {/* END: 수정된 부분 */}
        </div>
        
        {/* --- 명예의 전당 --- */}
        {/* START: 수정된 부분 (반투명 유리 효과) */}
        <div className="bg-white/30 backdrop-blur-md p-6 rounded-2xl shadow-xl border-2 border-white/50 w-full">
        {/* END: 수정된 부분 */}
          <p className="text-xl font-bold text-yellow-800">🏆 명예의 전당 최고 기록 🏆</p>
          {topEntry ? (
            <>
              {/* START: 수정된 부분 (그림자 효과) */}
              <p className="text-4xl sm:text-5xl font-bold text-yellow-600 drop-shadow-md mt-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                {topEntry.score.toLocaleString()}점
              </p>
              <p className="text-lg font-semibold text-gray-700 mt-1">
                {topEntry.grade}학년 {topEntry.name}
              </p>
              {/* END: 수정된 부분 */}
            </>
          ) : (
            <p className="text-lg text-gray-700 mt-4">아직 기록이 없어요!</p>
          )}
        </div>

        {/* --- 하단 버튼 --- */}
        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">먼저, 난이도를 골라주세요!</h2>
          <div className="w-full space-y-4">
              {/* START: 수정된 부분 (이모지 추가, 반투명 효과) */}
              <button
                  onClick={() => handleStart('low')}
                  className="w-full bg-blue-500/80 backdrop-blur-md text-white font-bold text-2xl py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 border-2 border-white/50"
              >
                  🧑‍🎓 저학년 (쉬운 문제)
              </button>
              <button
                  onClick={() => handleStart('high')}
                  className="w-full bg-red-500/80 backdrop-blur-md text-white font-bold text-2xl py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-300 border-2 border-white/50"
              >
                  👩‍🔬 고학년 (생각하는 문제)
              </button>
              {/* END: 수정된 부분 */}
          </div>
          <p className="text-base text-gray-700 mt-6 px-4">각 난이도별 문제 중 10개가<br/>무작위로 출제됩니다.</p>
        </div>

      </div>
    </div>
  );
};

export default StartScreen;
