import React, { useState, useEffect } from 'react';
import { HallOfFameEntry } from '../types';

interface HallOfFameScreenProps {
  onPlayAgain: () => void;
}

const HALL_OF_FAME_KEY = 'aiEthicsQuizHallOfFame';

const HallOfFameScreen: React.FC<HallOfFameScreenProps> = ({ onPlayAgain }) => {
    const [topScores, setTopScores] = useState<HallOfFameEntry[]>([]);

    useEffect(() => {
        const data = localStorage.getItem(HALL_OF_FAME_KEY);
        const hallOfFame = data ? JSON.parse(data) : [];
        setTopScores(hallOfFame.slice(0, 3));
    }, []);

    const rankDetails = [
        { icon: '🥇', color: 'text-yellow-500', bg: 'bg-yellow-100' },
        { icon: '🥈', color: 'text-gray-500', bg: 'bg-gray-200' },
        { icon: '🥉', color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

    return (
    <div className="flex flex-col items-center justify-center text-center h-full">
      <div className="flex-grow flex flex-col items-center justify-center w-full">
        <h2 className="text-3xl sm:text-4xl font-bold text-green-700 mb-6">🏆 명예의 전당 🏆</h2>
        
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
