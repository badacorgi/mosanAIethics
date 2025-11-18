import React, { useState } from 'react';

interface ResultScreenProps {
  score: number;
  onNameSubmit: (name: string, grade: number) => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ score, onNameSubmit }) => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState(1);
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    // 한글 또는 영문자가 포함되었는지 확인하는 정규식
    const nameRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/;

    if (trimmedName && nameRegex.test(trimmedName)) {
      setError('');
      onNameSubmit(trimmedName, grade);
    } else {
      setError('이름을 입력해주세요!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center h-full">
      <div className="flex-grow flex flex-col items-center justify-center w-full">
        <h2 className="text-3xl sm:text-4xl font-bold text-green-700 mb-4">퀴즈 완료!</h2>
        
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6 w-full">
          <p className="text-xl font-bold text-gray-600">최종 점수</p>
          <p className="text-6xl font-bold text-green-500 mt-2">{score.toLocaleString()}점</p>
        </div>
        
        <form onSubmit={handleSubmit} className="w-full bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold text-gray-700 mb-4">🏆 명예의 전당에 기록하기</h3>
            <div className="flex items-center space-x-2 mb-2">
                <select 
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
                    className="w-1/3 p-3 border border-gray-300 rounded-lg text-lg"
                >
                    {[1, 2, 3, 4, 5, 6].map(g => <option key={g} value={g}>{g}학년</option>)}
                </select>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름"
                    maxLength={10}
                    className="w-2/3 p-3 border border-gray-300 rounded-lg text-lg"
                />
            </div>
            {error && <p className="text-red-500 text-sm mb-2 h-5">{error}</p>}
             <button
                type="submit"
                className="w-full bg-green-600 text-white font-bold text-2xl py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300 mt-2"
            >
                기록하고 순위 보기
            </button>
        </form>
      </div>
    </div>
  );
};

export default ResultScreen;