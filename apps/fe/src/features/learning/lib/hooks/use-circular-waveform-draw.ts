import { useCallback, useRef } from 'react';

interface UseCircularWaveformDrawOptions {
  innerRadius?: number;
  maxBarHeight?: number;
  bars?: number;
  lineWidth?: number;
  activeGradientStart?: string;
  activeGradientEnd?: string;
  idleColor?: string;
}

const useCircularWaveformDraw = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  options: UseCircularWaveformDrawOptions = {},
) => {
  const {
    innerRadius = 60,
    maxBarHeight = 100,
    bars = 64,
    lineWidth = 3,
    activeGradientStart = '#8B5CF6',
    activeGradientEnd = '#EC4899',
    idleColor = '#4B5563',
  } = options;

  const prevValuesRef = useRef<number[]>(new Array(bars).fill(0));

  const draw = useCallback(
    (frequencyData: Uint8Array): void => {
      const canvas = canvasRef.current;
      if (!canvas || frequencyData.length === 0) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      const sliceAngle = (Math.PI * 2) / bars;
      const bufferLength = frequencyData.length;

      const usableStart = Math.floor(bufferLength * 0.05);
      const usableEnd = Math.floor(bufferLength * 0.6);
      const usableRange = usableEnd - usableStart;

      const rawValues: number[] = [];
      for (let i = 0; i < bars; i++) {
        const dataIndex = usableStart + Math.floor((i / bars) * usableRange);
        rawValues.push(frequencyData[dataIndex] ?? 0);
      }

      const smoothedRaw: number[] = [];
      for (let i = 0; i < bars; i++) {
        const prev = rawValues[(i - 1 + bars) % bars] ?? 0;
        const curr = rawValues[i] ?? 0;
        const next = rawValues[(i + 1) % bars] ?? 0;
        smoothedRaw.push(prev * 0.25 + curr * 0.5 + next * 0.25);
      }

      for (let i = 0; i < bars; i++) {
        const targetHeight = ((smoothedRaw[i] ?? 0) / 255) * maxBarHeight + 3;

        const smoothedHeight = (prevValuesRef.current[i] ?? 0) * 0.7 + targetHeight * 0.3;
        prevValuesRef.current[i] = smoothedHeight;

        const angle = i * sliceAngle - Math.PI / 2;

        const x1 = centerX + Math.cos(angle) * innerRadius;
        const y1 = centerY + Math.sin(angle) * innerRadius;
        const x2 = centerX + Math.cos(angle) * (innerRadius + smoothedHeight);
        const y2 = centerY + Math.sin(angle) * (innerRadius + smoothedHeight);

        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, activeGradientStart);
        gradient.addColorStop(1, activeGradientEnd);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    },
    [canvasRef, bars, innerRadius, maxBarHeight, lineWidth, activeGradientStart, activeGradientEnd],
  );

  const drawIdle = useCallback((): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    const sliceAngle = (Math.PI * 2) / bars;

    for (let i = 0; i < bars; i++) {
      const angle = i * sliceAngle - Math.PI / 2;

      const x1 = centerX + Math.cos(angle) * innerRadius;
      const y1 = centerY + Math.sin(angle) * innerRadius;
      const x2 = centerX + Math.cos(angle) * (innerRadius + 3);
      const y2 = centerY + Math.sin(angle) * (innerRadius + 3);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = idleColor;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    prevValuesRef.current = new Array(bars).fill(0);
  }, [canvasRef, bars, innerRadius, lineWidth, idleColor]);

  return {
    draw,
    drawIdle,
  };
};

export default useCircularWaveformDraw;
