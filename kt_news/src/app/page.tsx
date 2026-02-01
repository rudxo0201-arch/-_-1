'use client';

import { useState } from 'react';
import type { AgeGroup, GenerateResponse } from '@/lib/types';
import { ERROR_MESSAGES } from '@/constants';
import ArticleInput from '@/components/ArticleInput';
import LoadingSpinner from '@/components/LoadingSpinner';
import AnalysisResult from '@/components/AnalysisResult';
import QuestionSection from '@/components/QuestionSection';
import ActivitySection from '@/components/ActivitySection';

export default function Home() {
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(article: string, ageGroup: AgeGroup) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article, ageGroup }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || ERROR_MESSAGES.GEMINI_FAILED);
        return;
      }

      setResult(data);
    } catch {
      setError(ERROR_MESSAGES.NETWORK_ERROR);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <header className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          뉴스 하브루타 질문 생성기
        </h1>
        <p className="mt-2 text-gray-500 text-sm sm:text-base">
          뉴스 기사를 입력하면 AI가 3단계 하브루타 대화 가이드를 만들어드립니다
        </p>
      </header>

      <div className="space-y-6">
        <ArticleInput onSubmit={handleSubmit} isLoading={isLoading} />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {isLoading && <LoadingSpinner />}

        {result && !isLoading && (
          <div className="space-y-6">
            <AnalysisResult analysis={result.analysis} />
            <QuestionSection step="factCheck" questions={result.questions.factCheck} />
            <QuestionSection step="criticalThinking" questions={result.questions.criticalThinking} />
            <QuestionSection step="valueConnection" questions={result.questions.valueConnection} />
            <ActivitySection activities={result.activities} />
          </div>
        )}
      </div>
    </main>
  );
}
