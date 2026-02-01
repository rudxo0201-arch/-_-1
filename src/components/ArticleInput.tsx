'use client';

import { useState } from 'react';
import type { AgeGroup } from '@/lib/types';
import { AGE_GROUP_LABELS, DEFAULT_AGE_GROUP, MIN_ARTICLE_LENGTH, ERROR_MESSAGES } from '@/constants';

function isUrl(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

interface ArticleInputProps {
  onSubmit: (article: string, ageGroup: AgeGroup) => void;
  isLoading: boolean;
}

export default function ArticleInput({ onSubmit, isLoading }: ArticleInputProps) {
  const [article, setArticle] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(DEFAULT_AGE_GROUP);
  const [error, setError] = useState<string | null>(null);

  const inputIsUrl = isUrl(article.trim());

  function validate(): boolean {
    if (!article.trim()) {
      setError(ERROR_MESSAGES.EMPTY_ARTICLE);
      return false;
    }
    if (!inputIsUrl && article.trim().length < MIN_ARTICLE_LENGTH) {
      setError(ERROR_MESSAGES.SHORT_ARTICLE);
      return false;
    }
    setError(null);
    return true;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit(article.trim(), ageGroup);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg p-6 space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          연령대 선택
        </label>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(AGE_GROUP_LABELS) as [AgeGroup, string][]).map(
            ([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setAgeGroup(value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  ageGroup === value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          뉴스 기사 내용 또는 링크
        </label>
        <textarea
          value={article}
          onChange={(e) => {
            setArticle(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder={"기사 내용을 붙여넣거나 뉴스 링크를 입력하세요...\n\n예: https://news.example.com/article/12345"}
          rows={inputIsUrl ? 3 : 8}
          className="w-full rounded-lg border border-gray-300 p-4 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none resize-y transition-colors"
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-400">
            Ctrl+Enter로 제출할 수 있습니다
          </p>
          {inputIsUrl ? (
            <p className="text-xs text-indigo-500 font-medium">🔗 링크 감지됨</p>
          ) : (
            <p className="text-xs text-gray-400">
              {article.trim().length}자
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? '분석 중...' : '질문 생성하기'}
      </button>
    </div>
  );
}
