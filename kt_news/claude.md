# kt_news - 뉴스 하브루타 질문 생성기

뉴스 기사를 입력하면 AI(Gemini)가 아이와 부모가 나눌 수 있는 3단계 하브루타 대화 가이드를 자동 생성하는 교육 도구
- **PRD**: `docs/PRD.md`
- **Reference**: https://test-one1.vercel.app/

---

## MVP 범위

### IN scope
- 단일 페이지 SPA (기사 입력 → 결과 표시)
- 연령대 선택 (4단계: elementary-low / elementary-high / middle / high)
- `POST /api/generate` API Route (유일한 엔드포인트)
- 기사 분석 (핵심 사건 + 사회적 배경 + 생각해볼 점)
- 3단계 하브루타 질문 (factCheck → criticalThinking → valueConnection)
- 활동 제안 (대화 시작 문장 + 함께 해볼 활동)
- 질문별 힌트 토글 ("힌트 보기/숨기기")
- 로딩 스피너 + 버튼 비활성화 (중복 요청 방지)
- 반응형 디자인 (320px ~ 2560px)
- Cmd/Ctrl+Enter 단축키 제출
- 클라이언트 입력 검증 + 서버 에러 처리
- Vercel 배포

### OUT of scope (구현 금지)
- 인증/회원가입, DB, URL 크롤링, 히스토리/저장
- PDF 내보내기, 공유, 다국어, 교사 모드
- 상태관리 라이브러리 (Zustand, Redux 등)
- 데이터 페칭 라이브러리 (SWR, React Query, Axios 등)
- 테스트 프레임워크 (Jest, Vitest 등)
- 분석/모니터링 (GA, Sentry 등)
- UI 컴포넌트 라이브러리 (shadcn, Radix, MUI 등)

---

## 기술 스택 (고정 - 추가 금지)

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.4+ |
| AI SDK | @google/generative-ai | latest |
| AI Model | gemini-2.0-flash | - |
| Hosting | Vercel | - |
| Pkg Manager | pnpm | - |

---

## 프로젝트 구조

```
kt_news/
├── docs/PRD.md
├── public/favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx          # RootLayout, 메타데이터, 폰트
│   │   ├── page.tsx            # 메인 페이지 (유일한 페이지)
│   │   ├── globals.css         # Tailwind directives + 전역 스타일
│   │   └── api/generate/
│   │       └── route.ts        # POST /api/generate (유일한 API)
│   ├── components/             # 최대 6개 파일
│   │   ├── ArticleInput.tsx    # 기사 입력 + 연령대 선택 + 제출 버튼
│   │   ├── AnalysisResult.tsx  # 기사 분석 결과 (핵심사건, 배경, 생각할점)
│   │   ├── QuestionSection.tsx # 질문 단계별 섹션 (1~3단계 래퍼)
│   │   ├── QuestionCard.tsx    # 개별 질문 카드 + 힌트 토글
│   │   ├── ActivitySection.tsx # 대화 시작 문장 + 활동 제안
│   │   └── LoadingSpinner.tsx  # 로딩 스피너
│   ├── lib/
│   │   ├── gemini.ts           # Gemini API 클라이언트 + 프롬프트
│   │   └── types.ts            # TypeScript 타입 정의
│   └── constants/
│       └── index.ts            # 연령대 라벨, 에러 메시지, 상수
├── .env.local                  # GEMINI_API_KEY
├── claude.md                   # 이 파일
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

**제한**: 위 구조 외 파일/폴더 추가 금지. 컴포넌트는 6개를 초과할 수 없음.

---

## 도메인 규칙

### 연령대 (AgeGroup)

| 값 | 레이블 | 기본값 |
|----|--------|--------|
| `elementary-low` | 초등 저학년 (1-3학년) | |
| `elementary-high` | 초등 고학년 (4-6학년) | **기본값** |
| `middle` | 중학생 | |
| `high` | 고등학생 | |

### 3단계 질문 구조

| 단계 | 키 | 명칭 | 색상 | Bloom's |
|------|-----|------|------|---------|
| 1단계 | `factCheck` | 사실 확인 질문 | 파란색 (blue-500) | 기억/이해 |
| 2단계 | `criticalThinking` | 비판적 사고 질문 | 보라색 (violet-500) | 분석/평가 |
| 3단계 | `valueConnection` | 가치관 연결 질문 | 분홍색 (pink-500) | 창조/적용 |

### API 스키마

**Request** (`POST /api/generate`):
```typescript
interface GenerateRequest {
  article: string;      // 필수, 최소 50자
  ageGroup: AgeGroup;   // 필수
}
```

**Response**:
```typescript
interface GenerateResponse {
  analysis: {
    coreEvent: string;
    socialBackground: string;
    thinkAbout: string[];
  };
  questions: {
    factCheck: Question[];
    criticalThinking: Question[];
    valueConnection: Question[];
  };
  activities: {
    conversationStarters: string[];
    activities: string[];
  };
}

interface Question {
  question: string;
  hint: string;
}
```

### Gemini 프롬프트 전략
1. **역할 설정**: 교육 전문가 + 하브루타 전문가
2. **연령대 컨텍스트**: 선택된 학년에 맞는 어휘/깊이 지시
3. **출력 구조**: JSON 형식 강제 (위 Response 스키마 준수)
4. **3단계 질문 체계**: 사실 → 비판적 사고 → 가치관
5. **한국어 응답 지시**

---

## 디자인 토큰 (Tailwind 클래스)

| 용도 | Tailwind 클래스 | 참고 HEX |
|------|----------------|----------|
| 배경 | `bg-gray-50` | #F9FAFB |
| 카드 배경 | `bg-white/80` | - |
| 1단계 (사실) | `blue-500` | #3B82F6 |
| 2단계 (사고) | `violet-500` | #8B5CF6 |
| 3단계 (가치) | `pink-500` | #EC4899 |
| 주요 버튼 | `indigo-600` | #4F46E5 |
| 카드 스타일 | `rounded-xl shadow-lg` | - |

---

## 코딩 컨벤션

| 항목 | 규칙 |
|------|------|
| 컴포넌트 | PascalCase `.tsx`, 함수 컴포넌트만, `export default` 사용 |
| 상태 관리 | `useState`만 사용 (외부 라이브러리 금지) |
| API 호출 | `fetch`만 사용 (Axios, SWR 등 금지) |
| 스타일링 | Tailwind 유틸리티 클래스만 (CSS-in-JS, CSS 모듈 금지) |
| 타입 | `interface` 우선, `lib/types.ts`에 집중 정의 |
| 상수 | `constants/index.ts`에 집중 관리 |
| 파일명 | 컴포넌트: PascalCase, 그 외: camelCase |

---

## 환경변수

```bash
# .env.local (1개만)
GEMINI_API_KEY=your_api_key_here
```

서버사이드 전용. 클라이언트 노출 금지 (`NEXT_PUBLIC_` 접두사 사용 금지).

---

## 개발 명령어

```bash
pnpm dev        # 개발 서버 (localhost:3000)
pnpm build      # 프로덕션 빌드
pnpm start      # 프로덕션 서버
```

---

## 에러 처리

| 시나리오 | HTTP | 처리 위치 | 사용자 메시지 |
|----------|------|----------|---------------|
| 빈 기사 입력 | - | 클라이언트 | "기사 내용을 입력해주세요" |
| 기사 너무 짧음 (<50자) | - | 클라이언트 | "기사 내용이 너무 짧습니다 (최소 50자)" |
| API 키 미설정 | 500 | 서버 | "서비스 설정 오류입니다. 관리자에게 문의하세요" |
| Gemini API 실패 | 502 | 서버 | "AI 서비스가 일시적으로 불안정합니다. 잠시 후 다시 시도해주세요" |
| 응답 파싱 실패 | 500 | 서버 | "결과 처리 중 오류가 발생했습니다. 다시 시도해주세요" |
| 네트워크 오류 | - | 클라이언트 | "인터넷 연결을 확인해주세요" |
| Rate Limit | 429 | 서버 | "요청이 너무 많습니다. 잠시 후 다시 시도해주세요" |

---

## 금지 사항 (Anti-patterns)

- **컴포넌트 6개 초과** 금지
- **추가 페이지** 생성 금지 (`page.tsx`는 루트 1개만)
- **추가 API Route** 생성 금지 (`/api/generate` 1개만)
- **라이브러리 추가** 금지 (기술 스택 표에 없는 패키지 설치 불가)
- **`NEXT_PUBLIC_`** 환경변수 금지
- **CSS 파일 추가** 금지 (`globals.css` 1개만)
- **`useEffect`로 데이터 페칭** 금지 (이벤트 핸들러에서 직접 `fetch`)
- **`any` 타입** 사용 금지

---

## 커밋 컨벤션

```
<type>(<scope>): <subject>

<body>

Co-Authored-By: PCJ <pcj@ascendmedia.co.kr>
```

**type**: feat, fix, refactor, docs, chore, style
**scope**: ui, api, prompt, config

---

## 배포

Vercel git push 자동 배포. 별도 CI/CD 설정 불필요.
