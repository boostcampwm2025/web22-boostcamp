type AnswerRecordingProps = {
  transcript: string;
  isSupported: boolean;
};

const AnswerRecording = ({ transcript, isSupported }: AnswerRecordingProps) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
          <h3 className="font-bold text-slate-800 text-lg">나의 답변</h3>
          <span className="flex items-center space-x-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-sm text-red-500 font-medium">녹음 중</span>
          </span>
        </div>
      </div>
      {isSupported && transcript ? (
        <p className="text-slate-700 leading-relaxed min-h-[60px]">{transcript}</p>
      ) : (
        <div className="text-slate-400 text-sm min-h-[60px] flex items-center">
          {isSupported
            ? '음성 인식 중입니다...'
            : '녹음이 진행 중입니다. 완료 후 텍스트가 표시됩니다.'}
        </div>
      )}
    </div>
  );
};

export default AnswerRecording;
