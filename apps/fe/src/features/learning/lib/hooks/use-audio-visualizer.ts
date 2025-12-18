import { useEffect, useRef, useState } from 'react';

interface UseAudioVisualizerOptions {
  fftSize?: number; // 2의 거듭제곱 (32 ~ 32768), 기본값 512
  smoothingTimeConstant?: number; // 0 ~ 1, 기본값 0.8
  fps?: number; // 초당 프레임 수, 기본값 60 (제한 없음)
}

const useAudioVisualizer = (
  stream: MediaStream | null,
  options: UseAudioVisualizerOptions = {},
) => {
  const { fftSize = 512, smoothingTimeConstant = 0.8, fps = 60 } = options;

  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(0));
  const [waveformData, setWaveformData] = useState<Uint8Array>(new Uint8Array(0));

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!stream) {
      cleanup();
      return;
    }

    try {
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = fftSize;
      analyser.smoothingTimeConstant = smoothingTimeConstant;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      const bufferLength = analyser.frequencyBinCount;
      const freqDataArray = new Uint8Array(bufferLength);
      const waveDataArray = new Uint8Array(bufferLength);

      const frameInterval = 1000 / fps;

      const updateData = (currentTime: number) => {
        if (!analyserRef.current) return;

        animationFrameRef.current = requestAnimationFrame(updateData);

        const elapsed = currentTime - lastFrameTimeRef.current;
        if (elapsed < frameInterval) return;

        lastFrameTimeRef.current = currentTime - (elapsed % frameInterval);

        analyserRef.current.getByteFrequencyData(freqDataArray);
        setFrequencyData(new Uint8Array(freqDataArray));

        analyserRef.current.getByteTimeDomainData(waveDataArray);
        setWaveformData(new Uint8Array(waveDataArray));
      };

      updateData(performance.now());
    } catch (err) {
      console.error('오디오 시각화 초기화 오류:', err);
      cleanup();
    }

    return () => {
      cleanup();
    };
  }, [stream, fftSize, smoothingTimeConstant, fps]);

  const cleanup = () => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    setFrequencyData(new Uint8Array(0));
    setWaveformData(new Uint8Array(0));
  };

  return {
    frequencyData,
    waveformData,
  };
};

export default useAudioVisualizer;
