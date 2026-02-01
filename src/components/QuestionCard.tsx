'use client';

import { useState } from 'react';
import type { Question } from '@/lib/types';

interface QuestionCardProps {
  question: Question;
  index: number;
  colorClasses: {
    textColor: string;
    bgColor: string;
  };
}

export default function QuestionCard({ question, index, colorClasses }: QuestionCardProps) {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <p className="text-gray-800 leading-relaxed">
        <span className={`font-semibold ${colorClasses.textColor} mr-2`}>Q{index + 1}.</span>
        {question.question}
      </p>
      <button
        type="button"
        onClick={() => setShowHint(!showHint)}
        className={`mt-3 text-sm ${colorClasses.textColor} hover:underline`}
      >
        {showHint ? '💡 힌트 숨기기' : '💡 힌트 보기'}
      </button>
      {showHint && (
        <p className={`mt-2 text-sm text-gray-600 ${colorClasses.bgColor} rounded-md p-3`}>
          {question.hint}
        </p>
      )}
    </div>
  );
}
