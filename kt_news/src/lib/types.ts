export type AgeGroup = 'elementary-low' | 'elementary-high' | 'middle' | 'high';

export interface Question {
  question: string;
  hint: string;
}

export interface GenerateRequest {
  article: string;
  ageGroup: AgeGroup;
}

export interface GenerateResponse {
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
