import type { GenerateResponse } from '@/lib/types';

interface AnalysisResultProps {
  analysis: GenerateResponse['analysis'];
}

export default function AnalysisResult({ analysis }: AnalysisResultProps) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg p-6 space-y-4">
      <h2 className="text-lg font-bold text-gray-800">📋 기사 분석</h2>

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-1">📰 핵심 사건</h3>
          <p className="text-gray-800 leading-relaxed">{analysis.coreEvent}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-1">🌍 사회적 배경</h3>
          <p className="text-gray-800 leading-relaxed">{analysis.socialBackground}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-1">💡 생각해볼 점</h3>
          <ul className="list-disc list-inside space-y-1">
            {analysis.thinkAbout.map((item, i) => (
              <li key={i} className="text-gray-800 leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
