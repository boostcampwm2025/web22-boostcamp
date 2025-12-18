import { useEffect, useRef } from 'react';

import useAudioVisualizer from '../lib/hooks/use-audio-visualizer';
import useCircularWaveformDraw from '../lib/hooks/use-circular-waveform-draw';
import { Mic, MicOff } from 'lucide-react';

type CircularWaveformProps = {
  isRecording: boolean;
  stream: MediaStream | null;
  onToggle: () => void;
};

const CircularWaveform = ({ isRecording, stream, onToggle }: CircularWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const animationRef = useRef<number | null>(null);

  const { frequencyData } = useAudioVisualizer(stream);
  const { draw, drawIdle } = useCircularWaveformDraw(canvasRef);

  useEffect(() => {
    if (isRecording && frequencyData.length > 0) {
      const animate = () => {
        draw(frequencyData);
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isRecording, frequencyData, draw]);

  useEffect(() => {
    if (!isRecording) {
      drawIdle();
    }
  }, [isRecording, drawIdle]);

  return (
    <div className="relative w-70 h-70">
      <canvas ref={canvasRef} width={280} height={280} className="block" />
      <button
        onClick={onToggle}
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300
            ${
              isRecording
                ? 'bg-linear-to-br from-pink-300 to-purple-500 shadow-lg shadow-purple-500/50'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
      >
        {isRecording ? (
          <MicOff className="w-10 h-10 text-white" />
        ) : (
          <Mic className="w-10 h-10 text-gray-300" />
        )}
      </button>
    </div>
  );
};

export default CircularWaveform;
