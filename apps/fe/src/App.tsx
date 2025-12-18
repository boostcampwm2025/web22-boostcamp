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

  // 브라우저가 지원하는 mimeType 자동 선택
  // 녹음해도 되는지 방어코드!!
  const getSupportedMimeType = () => {
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/ogg;codecs=opus',
      'audio/mp4', // Safari / iOS
    ];

    return candidates.find(
      (type) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type),
    );
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mimeType = getSupportedMimeType();
    if (!mimeType) {
      alert('이 브라우저는 음성 녹음을 지원하지 않습니다.');
      return;
    }

    const mediaRecorder = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => sendAudioToServer(mimeType);

    mediaRecorder.start();
    setStatus(`🎙 녹음 중 (${mimeType})`);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setStatus('⏳ 처리 중...');
  };

  const sendAudioToServer = async (mimeType: string) => {
    const blob = new Blob(chunksRef.current, { type: mimeType });

    // 확장자는 "의미만 전달" 용도 -> filename에 추가해주기 위함
    const ext = mimeType.includes('webm')
      ? 'webm'
      : mimeType.includes('ogg')
        ? 'ogg'
        : mimeType.includes('mp4')
          ? 'm4a'
          : 'dat';

    const form = new FormData();
    form.append('audio', blob, `record.${ext}`);

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
