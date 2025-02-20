
import { useEffect, useRef, useState } from "react";
import { FrequencyControl } from "./FrequencyControl";
import { Card } from "./ui/card";
import { Info } from "lucide-react";

export const WaveVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [freq1, setFreq1] = useState(1);
  const [freq2, setFreq2] = useState(2);
  const animationFrameRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillator1Ref = useRef<OscillatorNode | null>(null);
  const oscillator2Ref = useRef<OscillatorNode | null>(null);
  const gainNode1Ref = useRef<GainNode | null>(null);
  const gainNode2Ref = useRef<GainNode | null>(null);

  // Initialize Audio Context
  useEffect(() => {
    audioContextRef.current = new AudioContext();
    
    // Create gain nodes (for volume control)
    gainNode1Ref.current = audioContextRef.current.createGain();
    gainNode2Ref.current = audioContextRef.current.createGain();
    
    // Set initial volume
    gainNode1Ref.current.gain.value = 0.1;
    gainNode2Ref.current.gain.value = 0.1;
    
    // Connect gain nodes to output
    gainNode1Ref.current.connect(audioContextRef.current.destination);
    gainNode2Ref.current.connect(audioContextRef.current.destination);

    // Create and start oscillators
    oscillator1Ref.current = audioContextRef.current.createOscillator();
    oscillator2Ref.current = audioContextRef.current.createOscillator();
    
    oscillator1Ref.current.connect(gainNode1Ref.current);
    oscillator2Ref.current.connect(gainNode2Ref.current);
    
    oscillator1Ref.current.start();
    oscillator2Ref.current.start();

    return () => {
      oscillator1Ref.current?.stop();
      oscillator2Ref.current?.stop();
      audioContextRef.current?.close();
    };
  }, []);

  // Update frequencies
  useEffect(() => {
    if (oscillator1Ref.current) {
      oscillator1Ref.current.frequency.setValueAtTime(freq1, audioContextRef.current?.currentTime || 0);
    }
    if (oscillator2Ref.current) {
      oscillator2Ref.current.frequency.setValueAtTime(freq2, audioContextRef.current?.currentTime || 0);
    }
  }, [freq1, freq2]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = performance.now() / 1000;
      
      // Draw first wave
      ctx.beginPath();
      ctx.strokeStyle = "rgba(79, 209, 197, 0.6)";
      ctx.lineWidth = 2;
      
      const wave1Points: number[] = [];
      for (let x = 0; x < canvas.width; x++) {
        const y = Math.sin((x * freq1 / 100) + time) * 50;
        wave1Points[x] = y;
        if (x === 0) {
          ctx.moveTo(x, y + canvas.height / (2 * window.devicePixelRatio));
        } else {
          ctx.lineTo(x, y + canvas.height / (2 * window.devicePixelRatio));
        }
      }
      ctx.stroke();

      // Draw second wave
      ctx.beginPath();
      ctx.strokeStyle = "rgba(246, 135, 179, 0.6)";
      ctx.lineWidth = 2;
      
      const wave2Points: number[] = [];
      for (let x = 0; x < canvas.width; x++) {
        const y = Math.sin((x * freq2 / 100) + time) * 50;
        wave2Points[x] = y;
        if (x === 0) {
          ctx.moveTo(x, y + canvas.height / (2 * window.devicePixelRatio));
        } else {
          ctx.lineTo(x, y + canvas.height / (2 * window.devicePixelRatio));
        }
      }
      ctx.stroke();

      // Draw combined wave
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 2;
      
      for (let x = 0; x < canvas.width; x++) {
        const y = wave1Points[x] + wave2Points[x];
        if (x === 0) {
          ctx.moveTo(x, y + canvas.height / (2 * window.devicePixelRatio));
        } else {
          ctx.lineTo(x, y + canvas.height / (2 * window.devicePixelRatio));
        }
      }
      ctx.stroke();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [freq1, freq2]);

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-slate-800/50 border-slate-700">
        <div className="flex items-center justify-end gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-teal-400/60" />
            <span className="text-sm text-slate-300">Wave 1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-rose-400/60" />
            <span className="text-sm text-slate-300">Wave 2</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-white/40" />
            <span className="text-sm text-slate-300">Combined</span>
          </div>
          <Info className="text-slate-500" size={16} />
        </div>
        <canvas
          ref={canvasRef}
          className="w-full h-[300px] rounded-lg"
          style={{ background: "transparent" }}
        />
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2">
        <FrequencyControl
          value={freq1}
          onChange={setFreq1}
          label="Wave 1 Frequency"
          color="teal"
        />
        <FrequencyControl
          value={freq2}
          onChange={setFreq2}
          label="Wave 2 Frequency"
          color="rose"
        />
      </div>
    </div>
  );
};
