import { Loader2 } from 'lucide-react';

type AnswerRefiningProps = {
  transcript: string;
};

const AnswerRefining = ({ transcript }: AnswerRefiningProps) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
          <h3 className="font-bold text-slate-800 text-lg">나의 답변</h3>
          <span className="flex items-center space-x-1">
            <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
            <span className="text-sm text-purple-600 font-medium">
              더 정확한 음성 인식을 위해 AI가 분석 중입니다
            </span>
          </span>
        </div>
      </div>
      <p className="text-slate-500 leading-relaxed opacity-60 animate-pulse">{transcript}</p>
    </div>
  );
};

export default AnswerRefining;
