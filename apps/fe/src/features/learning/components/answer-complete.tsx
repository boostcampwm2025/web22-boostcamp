type AnswerCompleteProps = {
  transcript: string;
};

const AnswerComplete = ({ transcript }: AnswerCompleteProps) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
          <h3 className="font-bold text-slate-800 text-lg">나의 답변</h3>
        </div>
      </div>
      <p className="text-slate-700 leading-relaxed">{transcript}</p>
    </div>
  );
};

export default AnswerComplete;
