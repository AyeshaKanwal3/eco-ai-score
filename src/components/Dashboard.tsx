import { Button } from "@/components/ui/button";
import { RotateCcw, Share2, Download, Sparkles } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { RadarChart } from "./RadarChart";
import { BarChart } from "./BarChart";
import { SuggestionsPanel } from "./SuggestionsPanel";
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
    const text = `My AI EcoRank Score 🌿 ${avgScore}% - Analyzed with The AI EcoRank Studio by Rank AI ⚡`;
    const url = window.location.href;
    navigator.clipboard.writeText(`${text}\n${url}`);
    toast.success("Result copied to clipboard!");
  };

  const handleDownloadReport = () => {
    toast.info("PDF report generation coming soon!");
  };

  // Generate AI suggestions based on analysis results
  const generateSuggestions = () => {
    const suggestions: any[] = [];

    // SEO Suggestions
    if (results.seo.details.issues) {
      results.seo.details.issues.forEach((issue: string) => {
        suggestions.push({
          category: "SEO",
          status: "error",
          message: issue,
          suggestions: results.seo.details.suggestions || []
        });
      });
    }
    if (results.seo.score >= 80) {
      suggestions.push({
        category: "SEO",
        status: "success",
        message: "✅ Strong SEO foundation detected",
        reasoning: "Your metadata and structure follow best practices"
      });
    }

    // AI GEO Suggestions
    if (results.geo.score < 70) {
      suggestions.push({
        category: "AI Visibility",
        status: "warning",
        message: "Your website may not be optimally visible to AI models",
        reasoning: "AI models prefer structured content and semantic HTML",
        suggestions: [
          "Add structured data (JSON-LD) for better AI understanding",
          "Use semantic HTML5 elements (article, section, header)",
          "Include Open Graph tags for social sharing"
        ]
      });
    }

    // UX Suggestions
    if (results.ux.details.issues && results.ux.details.issues.length > 0) {
      suggestions.push({
        category: "UX Quality",
        status: "warning",
        message: results.ux.details.issues[0],
        suggestions: results.ux.details.suggestions || []
      });
    }

    // Eco Suggestions
    if (results.eco.score < 70) {
      suggestions.push({
        category: "Eco Impact",
        status: "error",
        message: `❌ High page weight detected (${results.eco.details.pageSize?.toFixed(2)} KB)`,
        reasoning: "Larger pages consume more energy and have higher CO₂ emissions",
        suggestions: results.eco.details.suggestions || []
      });
    } else {
      suggestions.push({
        category: "Eco Impact",
        status: "success",
        message: `✅ Efficient page weight (${results.eco.details.pageSize?.toFixed(2)} KB)`,
        reasoning: `Estimated CO₂: ${results.eco.details.co2Estimate}g per visit`
      });
    }

    // Call-to-Action Suggestions
    suggestions.push({
      category: "Call-to-Action",
      status: hasLowScores ? "warning" : "success",
      message: hasLowScores 
        ? "❌ Missing anxiety-reducing microcopy on CTAs" 
        : "✅ Action-oriented messaging detected",
      reasoning: hasLowScores 
        ? "Users need reassurance before taking action"
        : "Clear value propositions encourage conversions",
      suggestions: hasLowScores ? [
        "Add microcopy like 'Free • No signup required • Takes <60s'",
        "Consider CTA text: 'Start My Free Analysis' or 'Generate My Report'",
        "Use trust signals near buttons"
      ] : []
    });

    return suggestions;
  };

  const suggestions = generateSuggestions();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="glass-card glow-border rounded-2xl p-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="text-4xl font-bold glow-text">
            Analysis Complete
          </h2>
          <Sparkles className="w-6 h-6 text-accent" />
        </div>
        <p className="text-xl font-semibold text-foreground mb-1">{results.name}</p>
        <p className="text-muted-foreground mb-2">{results.url}</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mt-2">
          <span className="text-3xl font-bold glow-text">{avgScore}%</span>
          <span className="text-sm text-muted-foreground">Overall Score</span>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={onReset} variant="outline" className="border-primary hover:bg-primary/10">
            <RotateCcw className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
          <Button onClick={handleShare} className="bg-secondary hover:bg-secondary/90">
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button>
          <Button onClick={handleDownloadReport} className="bg-accent hover:bg-accent/90">
            <Download className="w-4 h-4 mr-2" />
            Download Report (PDF)
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

      {/* Charts and Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <RadarChart scores={scores} />
          <BarChart scores={scores} />
        </div>
        <div className="lg:row-span-2">
          <SuggestionsPanel suggestions={suggestions} />
        </div>
      </div>

      {/* Recommendation */}
      {hasLowScores && (
        <div className="glass-card glow-border rounded-2xl p-10 text-center animate-glow">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h3 className="text-3xl font-bold glow-text">
              Ready to Improve Your Website?
            </h3>
            <Sparkles className="w-8 h-8 text-accent" />
          </div>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            We detected areas that need improvement. Try enhancing with our eco-friendly design model for better rankings and sustainability.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold text-lg h-14 px-8 glow-border"
          >
            <a href="https://reimagineweb.dev" target="_blank" rel="noopener noreferrer">
              Reimagine It Now 🌍
            </a>
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Powered by Rank AI • Sustainable • Future-Ready
          </p>
        </div>
      )}
    </div>
  );
};
