import { Loader2, Sparkles } from 'lucide-react';

const FeedbackLoading = () => {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center space-x-2 mb-3">
        <div className="p-1.5 bg-purple-100 rounded-lg">
          <Sparkles className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="font-bold text-slate-800 text-lg">AI 면접관 피드백</h3>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
          <p className="text-slate-700 font-medium text-lg mb-2">AI가 답변을 분석하고 있습니다</p>
          <p className="text-slate-400 text-sm">잠시만 기다려주세요...</p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackLoading;
