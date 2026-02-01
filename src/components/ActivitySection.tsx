import type { GenerateResponse } from '@/lib/types';

interface ActivitySectionProps {
  activities: GenerateResponse['activities'];
}

export default function ActivitySection({ activities }: ActivitySectionProps) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg p-6 space-y-4">
      <h2 className="text-lg font-bold text-gray-800">🎯 활동 제안</h2>

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">💬 대화 시작 문장</h3>
          <ul className="space-y-2">
            {activities.conversationStarters.map((starter, i) => (
              <li
                key={i}
                className="bg-indigo-50 rounded-lg p-3 text-gray-800 text-sm leading-relaxed"
              >
                &ldquo;{starter}&rdquo;
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">🎯 함께 해볼 활동</h3>
          <ul className="space-y-2">
            {activities.activities.map((activity, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-gray-800 text-sm leading-relaxed"
              >
                <span className="text-indigo-500 mt-0.5">•</span>
                {activity}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
