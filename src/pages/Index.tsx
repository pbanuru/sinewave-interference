
import { WaveVisualizer } from "@/components/WaveVisualizer";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <div className="p-6">
          <h1 className="text-3xl font-light text-slate-100 mb-2 text-center">Wave Visualizer</h1>
          <p className="text-slate-400 text-center mb-6">Interact with dual sine waves</p>
          <WaveVisualizer />
        </div>
      </Card>
    </div>
  );
};

export default Index;
