import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AgeGroup, GenerateRequest, GenerateResponse } from '@/lib/types';

const AGE_CONTEXT: Record<AgeGroup, string> = {
  'elementary-low': '초등학교 1~3학년 수준의 쉬운 어휘와 짧은 문장을 사용하세요. 구체적인 예시를 들어주세요.',
  'elementary-high': '초등학교 4~6학년 수준의 어휘를 사용하세요. 약간의 추상적 개념을 포함할 수 있습니다.',
  'middle': '중학생 수준의 어휘와 논리적 사고를 요구하세요. 사회적 맥락을 연결해주세요.',
  'high': '고등학생 수준의 심화된 어휘와 비판적 분석을 요구하세요. 다양한 관점에서 생각하도록 유도하세요.',
};

export async function generateHavrutaQuestions(
  req: GenerateRequest
): Promise<GenerateResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `당신은 교육 전문가이자 하브루타(Havruta) 대화법 전문가입니다.
아래 뉴스 기사를 읽고, 부모와 아이가 함께 나눌 수 있는 하브루타 대화 가이드를 만들어주세요.

대상 연령: ${AGE_CONTEXT[req.ageGroup]}

[뉴스 기사]
${req.article}

반드시 아래 JSON 형식으로만 응답하세요. JSON 외의 텍스트는 포함하지 마세요.

{
  "analysis": {
    "coreEvent": "기사의 핵심 사건을 1~2문장으로 요약",
    "socialBackground": "이 사건의 사회적 배경이나 맥락을 1~2문장으로 설명",
    "thinkAbout": ["생각해볼 점 1", "생각해볼 점 2", "생각해볼 점 3"]
  },
  "questions": {
    "factCheck": [
      {"question": "기사에서 확인할 수 있는 사실에 대한 질문", "hint": "질문에 대한 힌트"},
      {"question": "두 번째 사실 확인 질문", "hint": "힌트"}
    ],
    "criticalThinking": [
      {"question": "비판적으로 생각해볼 질문", "hint": "힌트"},
      {"question": "두 번째 비판적 사고 질문", "hint": "힌트"}
    ],
    "valueConnection": [
      {"question": "자신의 가치관과 연결하는 질문", "hint": "힌트"},
      {"question": "두 번째 가치관 연결 질문", "hint": "힌트"}
    ]
  },
  "activities": {
    "conversationStarters": ["대화를 시작하는 문장 1", "대화를 시작하는 문장 2"],
    "activities": ["함께 해볼 활동 1", "함께 해볼 활동 2"]
  }
}

각 단계별 질문은 2~3개씩 생성하세요.
모든 내용은 한국어로 작성하세요.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('PARSE_FAILED');
  }

  const parsed: GenerateResponse = JSON.parse(jsonMatch[0]);
  return parsed;
}
