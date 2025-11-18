import React, { useState, useEffect } from 'react';
import { HallOfFameEntry } from '../types';

interface HallOfFameScreenProps {
  onPlayAgain: () => void;
}

const HALL_OF_FAME_KEY = 'aiEthicsQuizHallOfFame';

const HallOfFameScreen: React.FC<HallOfFameScreenProps> = ({ onPlayAgain }) => {
    const [topScores, setTopScores] = useState<HallOfFameEntry[]>([]);
    
    // START: 수정된 부분 (전체 데이터를 저장할 state 추가)
    const [fullHallOfFame, setFullHallOfFame] = useState<HallOfFameEntry[]>([]);
    // END: 수정된 부분

    useEffect(() => {
        const data = localStorage.getItem(HALL_OF_FAME_KEY);
        const hallOfFame = data ? JSON.parse(data) : [];
        
        // START: 수정된 부분 (전체 데이터와 상위 3개 데이터를 분리하여 저장)
        setFullHallOfFame(hallOfFame); // 전체 데이터 저장
        setTopScores(hallOfFame.slice(0, 3)); // 상위 3개만 화면 표시에 사용
        // END: 수정된 부분
    }, []);

    // START: 수정된 부분 (JSON 다운로드 핸들러 함수 추가)
    const handleDownload = () => {
        if (fullHallOfFame.length === 0) {
            alert("저장할 기록이 없습니다.");
            return;
        }

        // 데이터를 JSON 문자열로 변환 (null, 2는 예쁘게 들여쓰기)
        const dataStr = JSON.stringify(fullHallOfFame, null, 2);
        
        // Blob 객체 생성
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // 다운로드를 위한 임시 URL 생성
        const url = URL.createObjectURL(dataBlob);
        
        // 임시 <a> 태그 생성
        const link = document.createElement('a');
        link.href = url;
        link.download = 'ai-ethics-quiz-hall-of-fame.json'; // 다운로드될 파일 이름
        
        // 링크를 body에 추가하고 클릭 이벤트 실행
        document.body.appendChild(link);
        link.click();
        
        // 임시 링크와 URL 제거
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    // END: 수정된 부분

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
      
      {/* START: 수정된 부분 (다운로드 버튼 추가) */}
      <button
        onClick={handleDownload}
        className="w-full bg-blue-600 text-white font-bold text-lg py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 mb-4"
      >
        기록 내려받기 (JSON)
      </button>
      {/* END: 수정된 부분 */}

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
