import { useCallback, useEffect, useRef, useState } from 'react';

const useSpeechRecognition = (onTranscriptChange: (transcript: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // 브라우저 지원 여부 확인
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.lang = 'ko-KR';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result) {
            if (result.isFinal) {
              finalTranscript += result[0]?.transcript || '';
            } else {
              interimTranscript += result[0]?.transcript || '';
            }
          }
        }

        const fullTranscript = finalTranscript + interimTranscript;
        onTranscriptChange(fullTranscript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscriptChange]);

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      return;
    }

    try {
      onTranscriptChange('');
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
    }
  }, [isSupported, onTranscriptChange]);

  const stopListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      return;
    }

    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (err) {
      console.error('Failed to stop speech recognition:', err);
    }
  }, [isSupported]);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
  };
};

export default useSpeechRecognition;
