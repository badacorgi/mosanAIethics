import React, { useState } from 'react'; // useState 추가
import { unlockAudio, setBGMVolume, getBGMVolume } from '../utils/sounds'; // setBGMVolume, getBGMVolume 추가
import { HallOfFameEntry } from '../types';

interface StartScreenProps {
  onStart: (difficulty: 'low' | 'high') => void;
  topEntry: HallOfFameEntry | null;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, topEntry }) => {
  const [volume, setVolume] = useState(() => getBGMVolume());

  // START: 수정된 부분 (async / await 추가)
  const handleStart = async (difficulty: 'low' | 'high') => {
    try {
      await unlockAudio(); // unlockAudio가 완료될 때까지 기다림
      onStart(difficulty); // 오디오가 준비된 후 퀴즈 시작
    } catch (error) {
      console.error("Audio unlock failed:", error);
      // 오디오 잠금에 실패해도 퀴즈는 시작 (소리가 안 날 수 있음)
      onStart(difficulty);
    }
  };
  // END: 수정된 부분

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setBGMVolume(newVolume);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center h-full">
      <div className="flex-grow overflow-y-auto flex flex-col items-center justify-around py-4 w-full max-w-md">

        {/* --- 상단 타이틀 --- */}
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-2 drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            모산 AI 윤리 퀴즈
          </h1>
          <p className="text-lg text-gray-800 font-medium">
            퀴즈를 풀며 AI 윤리박사가 되어보아요!
          </p>
        </div>
        
        {/* --- 명예의 전당 --- */}
        <div className="bg-white/30 backdrop-blur-md p-6 rounded-2xl shadow-xl border-2 border-white/50 w-full">
          <p className="text-xl font-bold text-yellow-800">🏆 명예의 전당 최고 기록 🏆</p>
          {topEntry ? (
            <>
              <p className="text-4xl sm:text-5xl font-bold text-yellow-600 drop-shadow-md mt-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                {topEntry.score.toLocaleString()}점
              </p>
              <p className="text-lg font-semibold text-gray-700 mt-1">
                {topEntry.grade}학년 {topEntry.name}
              </p>
            </>
          ) : (
            <p className="text-lg text-gray-700 mt-4">아직 기록이 없어요!</p>
          )}
        </div>

        {/* --- 하단 버튼 --- */}
        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">먼저, 난이도를 골라주세요!</h2>
          <div className="w-full space-y-4">
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
          </div>
          <p className="text-base text-gray-700 mt-6 px-4">각 난이도별 문제 중 10개가<br/>무작위로 출제됩니다.</p>
          
          {/* 볼륨 슬라이더 */}
          <div className="w-full mt-8">
            <label htmlFor="volumeSlider" className="text-sm font-medium text-gray-700 flex items-center justify-center">
              <span className="mr-2">🔉</span> 배경음악 볼륨
            </label>
            <input
              id="volumeSlider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-white/50 rounded-lg appearance-none cursor-pointer backdrop-blur-sm mt-2"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default StartScreen;
