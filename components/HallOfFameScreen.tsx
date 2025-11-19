import React, { useState, useEffect } from 'react';
import { HallOfFameEntry } from '../types';

interface HallOfFameScreenProps {
  onPlayAgain: () => void;
  // START: 수정된 부분 (currentDifficulty prop 추가)
  currentDifficulty: 'low' | 'high' | null;
  // END: 수정된 부분
}

// START: 수정된 부분 (난이도별 키 정의)
const HALL_OF_FAME_LOW_KEY = 'aiEthicsQuizHallOfFameLow';
const HALL_OF_FAME_HIGH_KEY = 'aiEthicsQuizHallOfFameHigh';
// END: 수정된 부분

// START: 수정된 부분 (컴포넌트 로직 변경)
const HallOfFameScreen: React.FC<HallOfFameScreenProps> = ({ onPlayAgain, currentDifficulty }) => {
    // 퀴즈를 푼 난이도를 기본 뷰로 설정하거나, 없으면 'low'로 설정
    // --- 에러 수정: currentDifficulty가 null일 수 있으므로 명시적으로 'low' 또는 'high'로 변환 ---
    const initialDifficulty = currentDifficulty === 'low' || currentDifficulty === 'high' 
        ? currentDifficulty 
        : 'low';

    const [difficultyView, setDifficultyView] = useState<'low' | 'high'>(initialDifficulty);
    // --- 에러 수정 끝 ---
    const [topScores, setTopScores] = useState<HallOfFameEntry[]>([]);

    useEffect(() => {
        const key = difficultyView === 'low' ? HALL_OF_FAME_LOW_KEY : HALL_OF_FAME_HIGH_KEY;
        
        const data = localStorage.getItem(key);
        // 상위 3개만 보여주므로 slice(0, 3) 유지
        const hallOfFame = data ? JSON.parse(data) : [];
        setTopScores(hallOfFame.slice(0, 3)); 
    }, [difficultyView]);

    const rankDetails = [
        { icon: '🥇', color: 'text-yellow-500', bg: 'bg-yellow-100' },
        { icon: '🥈', color: 'text-gray-500', bg: 'bg-gray-200' },
        { icon: '🥉', color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

    return (
    <div className="flex flex-col items-center justify-center text-center h-full">
      <div className="flex-grow flex flex-col items-center justify-center w-full">
        <h2 className="text-3xl sm:text-4xl font-bold text-green-700 mb-4">🏆 명예의 전당 🏆</h2>
        
        {/* 난이도 선택 버튼 */}
        <div className="flex w-full mb-6 max-w-sm">
            <button 
                onClick={() => setDifficultyView('low')}
                className={`flex-1 py-2 font-bold rounded-l-2xl transition-colors ${
                    difficultyView === 'low' ? 'bg-blue-500 text-white shadow-lg' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
            >
                🧑‍🎓 저학년 기록
            </button>
            <button 
                onClick={() => setDifficultyView('high')}
                className={`flex-1 py-2 font-bold rounded-r-2xl transition-colors ${
                    difficultyView === 'high' ? 'bg-red-500 text-white shadow-lg' : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
            >
                👩‍🔬 고학년 기록
            </button>
        </div>
        
        <p className="text-xl font-bold text-gray-700 mb-4">{difficultyView === 'low' ? '저학년' : '고학년'} 최고 기록 (Top 3)</p>
        
        <div className="w-full space-y-4">
            {topScores.length > 0 ? (
                topScores.map((entry, index) => (
                    <div key={index} className={`p-4 rounded-xl shadow-md w-full flex items-center ${rankDetails[index]?.bg || 'bg-gray-100'}`}>
                        <span className={`text-4xl mr-4 ${rankDetails[index]?.color || 'text-gray-800'}`}>{rankDetails[index]?.icon || `${index + 1}.`}</span>
                        <div className="text-left flex-grow">
                            <p className="font-bold text-xl">{entry.name}</p>
                            <p className="text-sm text-gray-600">{entry.grade}학년</p>
                        </div>
                        <p className={`font-bold text-2xl ${rankDetails[index]?.color || 'text-gray-800'}`}>{entry.score.toLocaleString()}점</p>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">아직 기록이 없어요.<br/>첫 번째 1등에 도전해보세요!</p>
            )}
        </div>
      </div>
      
      <button
        onClick={onPlayAgain}
        className="w-full bg-green-600 text-white font-bold text-2xl py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300"
      >
        다시하기
      </button>
    </div>
  );
};

export default HallOfFameScreen;
// END: 수정된 부분
