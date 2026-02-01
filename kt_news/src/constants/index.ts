import type { AgeGroup } from '@/lib/types';

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  'elementary-low': '초등 저학년',
  'elementary-high': '초등 고학년',
  'middle': '중학생',
  'high': '고등학생',
};

export const DEFAULT_AGE_GROUP: AgeGroup = 'elementary-high';

export const MIN_ARTICLE_LENGTH = 50;

export const QUESTION_STEPS = {
  factCheck: {
    label: '1단계: 사실 확인 질문',
    textColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: '🔍',
  },
  criticalThinking: {
    label: '2단계: 비판적 사고 질문',
    textColor: 'text-violet-500',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    icon: '🤔',
  },
  valueConnection: {
    label: '3단계: 가치관 연결 질문',
    textColor: 'text-pink-500',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    icon: '💗',
  },
} as const;

export const ERROR_MESSAGES = {
  EMPTY_ARTICLE: '기사 내용을 입력해주세요',
  SHORT_ARTICLE: '기사 내용이 너무 짧습니다 (최소 50자)',
  API_KEY_MISSING: '서비스 설정 오류입니다. 관리자에게 문의하세요',
  GEMINI_FAILED: 'AI 서비스가 일시적으로 불안정합니다. 잠시 후 다시 시도해주세요',
  PARSE_FAILED: '결과 처리 중 오류가 발생했습니다. 다시 시도해주세요',
  NETWORK_ERROR: '인터넷 연결을 확인해주세요',
  RATE_LIMIT: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요',
  URL_FETCH_FAILED: '기사 URL에서 내용을 가져올 수 없습니다. URL을 확인하거나 기사 내용을 직접 붙여넣어주세요',
  URL_CONTENT_TOO_SHORT: 'URL에서 가져온 기사 내용이 너무 짧습니다. 기사 내용을 직접 붙여넣어주세요',
} as const;

export type QuestionStepKey = keyof typeof QUESTION_STEPS;
