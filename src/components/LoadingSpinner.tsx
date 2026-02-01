export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">AI가 기사를 분석하고 있습니다...</p>
    </div>
  );
}
