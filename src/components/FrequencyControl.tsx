
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

interface FrequencyControlProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  color: "teal" | "rose";
  onMute: (isMuted: boolean) => void;
}

export const FrequencyControl = ({
  value,
  onChange,
  label,
  color,
  onMute,
}: FrequencyControlProps) => {
  const [isMuted, setIsMuted] = useState(false);
  
  const colorClasses = {
    teal: "text-teal-400",
    rose: "text-rose-400",
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    onMute(!isMuted);
  };

  return (
    <Card className="p-4 bg-slate-800/50 border-slate-700">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Label className="text-slate-200">{label}</Label>
            <button
              onClick={handleMuteToggle}
              className="p-1 rounded-md hover:bg-slate-700/50 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className={`h-4 w-4 ${colorClasses[color]}`} />
              ) : (
                <Volume2 className={`h-4 w-4 ${colorClasses[color]}`} />
              )}
            </button>
          </div>
          <span className={`font-mono ${colorClasses[color]}`}>{value.toFixed(1)} Hz</span>
        </div>
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          min={0.1}
          max={1000}
          step={0.1}
          className={`${color === "teal" ? "[&_[role=slider]]:bg-teal-400" : "[&_[role=slider]]:bg-rose-400"}`}
        />
      </div>
    </Card>
  );
};
