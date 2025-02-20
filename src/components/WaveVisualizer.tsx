
import { useEffect, useRef, useState } from "react";
import { FrequencyControl } from "./FrequencyControl";
import { Card } from "./ui/card";

export const WaveVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [freq1, setFreq1] = useState(1);
  const [freq2, setFreq2] = useState(2);
  const animationFrameRef = useRef<number>();

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
      
      for (let x = 0; x < canvas.width; x++) {
        const y = Math.sin((x * freq1 / 100) + time) * 50 + canvas.height / (2 * window.devicePixelRatio);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw second wave
      ctx.beginPath();
      ctx.strokeStyle = "rgba(246, 135, 179, 0.6)";
      ctx.lineWidth = 2;
      
      for (let x = 0; x < canvas.width; x++) {
        const y = Math.sin((x * freq2 / 100) + time) * 50 + canvas.height / (2 * window.devicePixelRatio);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
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
