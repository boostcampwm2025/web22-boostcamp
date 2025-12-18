/*const App = () => {
  return 'hello world';
};

export default App;
*/
import { useRef, useState } from 'react';

const App = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [status, setStatus] = useState('대기 중');
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [followupQuestions, setFollowupQuestions] = useState('');

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = sendAudioToServer;

    mediaRecorder.start();
    setStatus('🎙 녹음 중...');
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setStatus('⏳ 처리 중...');
  };

  const sendAudioToServer = async () => {
    const blob = new Blob(chunksRef.current, {
      type: 'audio/wav',
    });

    const form = new FormData();
    form.append('audio', blob, 'record.wav');

    const res = await fetch('/speech/stt', {
      method: 'POST',
      body: form,
    });

    const data = await res.json();
    console.log('STT 결과:', data);

    setTranscript(data.transcript ?? '(인식 결과 없음)');
    // data.assessment.evaluation에서 summary, fix_suggestions, followup_questions 등을 추출하여 표시
    setSummary(
      data.assessment
        ? JSON.stringify(data.assessment?.evaluation.result.summary, null, 2)
        : '(평가 요약 없음)',
    );
    setSuggestions(
      data.assessment
        ? JSON.stringify(data.assessment?.evaluation.result.fix_suggestions, null, 2)
        : '(수정 제안 없음)',
    );
    setFollowupQuestions(
      data.assessment
        ? JSON.stringify(data.assessment.evaluation.result.followup_questions, null, 2)
        : '(후속 질문 없음)',
    );
    setStatus('완료');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>STT 테스트</h2>

      <p>
        <strong>상태:</strong> {status}
      </p>

      <button onClick={startRecording}>🎙 녹음 시작</button>
      <button onClick={stopRecording}>⏹ 녹음 종료</button>

      <hr />

      <h3>인식 결과</h3>
      <pre
        style={{
          background: '#f5f5f5',
          padding: 12,
          minHeight: 80,
          whiteSpace: 'pre-wrap',
        }}
      >
        {transcript}
      </pre>
      <h3>평가 요약</h3>
      <pre
        style={{
          background: '#f5f5f5',
          padding: 12,
          minHeight: 80,
          whiteSpace: 'pre-wrap',
        }}
      >
        {summary}
      </pre>
      <h3>수정 제안</h3>
      <pre
        style={{
          background: '#f5f5f5',
          padding: 12,
          minHeight: 80,
          whiteSpace: 'pre-wrap',
        }}
      >
        {suggestions}
      </pre>
      <h3>후속 질문</h3>
      <pre
        style={{
          background: '#f5f5f5',
          padding: 12,
          minHeight: 80,
          whiteSpace: 'pre-wrap',
        }}
      >
        {followupQuestions}
      </pre>
    </div>
  );
};

export default App;
