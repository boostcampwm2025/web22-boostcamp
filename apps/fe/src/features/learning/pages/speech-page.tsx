import { useState } from 'react';

import AnswerComplete from '../components/answer-complete';
import AnswerIdle from '../components/answer-idle';
import AnswerRecording from '../components/answer-recording';
import AnswerRefining from '../components/answer-refining';
import CircularWaveform from '../components/circular-waveform';
import FeedbackComplete from '../components/feedback-complete';
import FeedbackLoading from '../components/feedback-loading';
import useRecord from '../lib/hooks/use-record';
import useSpeechRecognition from '../lib/hooks/use-speech-recognition';
import type { Answer } from '../types/ai-answer';
import type { UIState } from '../types/ui-state';
import { ArrowLeft } from 'lucide-react';

type Feedback = {
  summary: string;
  fixSuggestions: Array<string>;
  followupQuestions: Array<string>;
};

const SpeechPage = () => {
  const [uiState, setUIState] = useState<UIState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const handleSubmit = async (blob: Blob) => {
    setUIState('refining');
    try {
      const data = await sendAudioToServer(blob);

      setTranscript(data.transcript);
      setFeedback({
        summary: data.assessment.evaluation.result.summary,
        fixSuggestions: data.assessment.evaluation.result.fix_suggestions,
        followupQuestions: data.assessment.evaluation.result.followup_questions,
      });
      setUIState('complete');
    } catch (e) {
      if (e instanceof Error) console.warn(e.message);
      else console.warn('서버에서 문제가 발생했습니다.');
      setUIState('idle');
    }
  };

  const { isRecording, stream, startRecording, stopRecording } = useRecord(handleSubmit);
  const { startListening, stopListening, isSupported } = useSpeechRecognition(setTranscript);

  const handleToggleRecording = async () => {
    if (isRecording) {
      stopRecording();
      stopListening();
    } else {
      setUIState('recording');
      setTranscript('');
      setFeedback(null);
      await startRecording();
      startListening();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4 py-6 flex flex-col items-center font-sans">
      {/* 1. 상단 네비게이션 & 헤더 */}
      <header className="w-full max-w-3xl flex items-center justify-between mb-10 text-slate-500">
        <button className="flex items-center hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">네트워크 (Network)</span>
        </button>
        <div className="flex items-center space-x-2">
          <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
            🔥 연속 3일 학습
          </span>
        </div>
      </header>

      <main className="w-full max-w-3xl flex flex-col items-center">
        {/* 2. 질문 섹션 */}
        <div className="text-center mb-8">
          <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-bold mb-4">
            질문 3 / 5
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4 break-keep">
            UDP(User Datagram Protocol)의
            <br />
            특징을 설명해주세요.
          </h1>
          <p className="text-slate-500 text-sm md:text-base break-keep">
            TCP와의 차이점, 비연결성과 비신뢰성의 의미,
            <br />
            그리고 UDP가 적합한 사용 사례를 중심으로 답변해보세요.
          </p>
        </div>

        {/* 3. 마이크 & 시각화 */}
        <div className="mb-10 flex flex-col items-center justify-center">
          <CircularWaveform
            isRecording={isRecording}
            stream={stream}
            onToggle={handleToggleRecording}
          />
        </div>

        {/* 4. 나의 답변 카드 - 상태별 렌더링 */}
        {uiState === 'idle' && <AnswerIdle />}
        {uiState === 'recording' && (
          <AnswerRecording transcript={transcript} isSupported={isSupported} />
        )}
        {uiState === 'refining' && <AnswerRefining transcript={transcript} />}
        {uiState === 'complete' && <AnswerComplete transcript={transcript} />}

        {/* 5. AI 면접관 피드백 - 상태별 렌더링 */}
        {uiState === 'refining' && <FeedbackLoading />}
        {uiState === 'complete' && feedback && <FeedbackComplete feedback={feedback} />}
      </main>
    </div>
  );
};

export default SpeechPage;

const sendAudioToServer = async (blob: Blob) => {
  try {
    const form = new FormData();
    form.append('audio', blob, 'record.wav');

    const res = await fetch('/api/speech/stt', {
      method: 'POST',
      body: form,
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: Answer = await res.json();

    return data;
  } catch (err) {
    const error = err instanceof Error ? err : new Error('음성 인식 처리 중 오류가 발생했습니다.');
    throw error;
  }
};
