'use client';

import { useState } from 'react';
import type { Question } from '@/lib/types';
import { QUESTION_STEPS } from '@/constants';
import type { QuestionStepKey } from '@/constants';
import QuestionCard from './QuestionCard';

interface QuestionSectionProps {
  step: QuestionStepKey;
  questions: Question[];
}

export default function QuestionSection({ step, questions }: QuestionSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const config = QUESTION_STEPS[step];

  return (
    <div className={`bg-white/80 backdrop-blur rounded-xl shadow-lg overflow-hidden border ${config.borderColor}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5"
      >
        <h2 className={`text-lg font-bold ${config.textColor}`}>
          {config.icon} {config.label}
        </h2>
        <span className="text-gray-400 text-xl">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 space-y-3">
          {questions.map((q, i) => (
            <QuestionCard
              key={i}
              question={q}
              index={i}
              colorClasses={{
                textColor: config.textColor,
                bgColor: config.bgColor,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
