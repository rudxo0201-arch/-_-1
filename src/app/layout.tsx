import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '뉴스 하브루타 질문 생성기',
  description: '뉴스 기사를 입력하면 AI가 아이와 부모가 나눌 수 있는 3단계 하브루타 대화 가이드를 자동 생성합니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
