import { Button } from "@/components/ui/button";
import { RotateCcw, Share2 } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { RadarChart } from "./RadarChart";
import { BarChart } from "./BarChart";
import { toast } from "sonner";
import type { AnalysisResult } from "@/pages/Index";

interface DashboardProps {
  results: AnalysisResult;
  onReset: () => void;
}

export const Dashboard = ({ results, onReset }: DashboardProps) => {
  const scores = {
    SEO: results.seo.score,
    "AI GEO": results.geo.score,
    Compatibility: results.compatibility.score,
    Eco: results.eco.score,
    UX: results.ux.score,
  };

  const avgScore = Math.round(
    Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length
  );

  const hasLowScores = Object.values(scores).some((s) => s < 70);

  const handleShare = () => {
    const text = `My AI EcoRank Score 🌿 ${avgScore}% - Analyzed with ReimagineWeb`;
    navigator.clipboard.writeText(text);
    toast.success("Result copied to clipboard!");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="glass-card glow-border rounded-2xl p-6 text-center">
        <h2 className="text-3xl font-bold glow-text mb-2">
          Analysis Complete for {results.name}
        </h2>
        <p className="text-muted-foreground">{results.url}</p>
        <div className="mt-4 flex justify-center gap-4">
          <Button onClick={onReset} variant="outline" className="border-primary">
            <RotateCcw className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
          <Button onClick={handleShare} className="bg-secondary hover:bg-secondary/90">
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard title="SEO" score={scores.SEO} details={results.seo.details} />
        <MetricCard title="AI GEO" score={scores["AI GEO"]} details={results.geo.details} />
        <MetricCard title="Compatibility" score={scores.Compatibility} details={results.compatibility.details} />
        <MetricCard title="Eco" score={scores.Eco} details={results.eco.details} />
        <MetricCard title="UX" score={scores.UX} details={results.ux.details} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RadarChart scores={scores} />
        <BarChart scores={scores} />
      </div>

      {/* Recommendation */}
      {hasLowScores && (
        <div className="glass-card glow-border rounded-2xl p-8 text-center animate-glow">
          <h3 className="text-2xl font-bold text-primary mb-4">
            🚀 Ready to Improve Your Website?
          </h3>
          <p className="text-muted-foreground mb-6">
            We detected some areas that need improvement. Let us help you reimagine your website!
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <a href="https://reimagineweb.dev" target="_blank" rel="noopener noreferrer">
              Reimagine It at ReimagineWeb.dev 🚀
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};
