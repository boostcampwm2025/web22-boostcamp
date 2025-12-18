import { AlertTriangle, ArrowRight, CheckCircle2, HelpCircle, Sparkles } from 'lucide-react';

type Feedback = {
  summary: string;
  fixSuggestions: Array<string>;
  followupQuestions: Array<string>;
};

type FeedbackCompleteProps = {
  feedback: Feedback;
};

const FeedbackComplete = ({ feedback }: FeedbackCompleteProps) => {
  return (
    <>
      {/* AI 면접관 피드백 */}
      <div className="w-full mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <div className="p-1.5 bg-purple-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">AI 면접관 피드백</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 긍정 피드백 */}
          <div className="bg-white border border-gray-300 rounded-xl p-5">
            <div className="flex items-center mb-3">
              <CheckCircle2 className="w-5 h-5 text-gray-600 mr-2" />
              <span className="font-bold text-gray-800">평가 요약</span>
            </div>
            <p className="text-sm text-gray-800/80">{feedback.summary}</p>
          </div>

          {/* 보완점 피드백 */}
          <div className="bg-[#FFF7ED] border border-[#FFEDD5] rounded-xl p-5">
            <div className="flex items-center mb-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
              <span className="font-bold text-orange-800">수정 제안</span>
            </div>
            <ul className="space-y-2 text-sm text-orange-800/80">
              {feedback.fixSuggestions.map((suggestion) => (
                <li className="flex items-start" key={suggestion}>
                  <span className="mr-2">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 꼬리 질문 (Follow-up) */}
      <div className="w-full bg-pink-50 border border-pink-100 rounded-xl p-5">
        <div className="flex items-center justify-start mb-3">
          <HelpCircle className="w-5 h-5 text-orange-600 mr-2" />
          <h4 className="font-bold text-pink-900">꼬리 질문 (Follow-up)</h4>
        </div>
        <ul className="space-y-2 text-gray-700 font-medium">
          {feedback.followupQuestions.map((question) => (
            <a
              className="px-4 flex justify-between py-3 items-center bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 active:scale-95 transition-all duration-200"
              key={question}
            >
              {question}
              <ArrowRight className="w-5 h-5 mr-2 shrink-0" />
            </a>
          ))}
        </ul>
      </div>
    </>
  );
};

export default FeedbackComplete;
