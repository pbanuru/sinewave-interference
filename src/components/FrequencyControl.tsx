
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";

interface FrequencyControlProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  color: "teal" | "rose";
}

export const FrequencyControl = ({
  value,
  onChange,
  label,
  color,
}: FrequencyControlProps) => {
  const colorClasses = {
    teal: "text-teal-400",
    rose: "text-rose-400",
  };

  return (
    <Card className="p-4 bg-slate-800/50 border-slate-700">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-slate-200">{label}</Label>
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
