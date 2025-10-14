import { useState } from "react";
import { AnalysisForm } from "@/components/AnalysisForm";
import { Dashboard } from "@/components/Dashboard";
import { Sparkles } from "lucide-react";

export interface AnalysisResult {
  name: string;
  url: string;
  seo: { score: number; details: any };
  geo: { score: number; details: any };
  compatibility: { score: number; details: any };
  eco: { score: number; details: any };
  ux: { score: number; details: any };
}

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 radial-glow pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-primary animate-pulse-slow" />
            <h1 className="text-6xl font-bold glow-text">
              The AI EcoRank Studio
            </h1>
            <Sparkles className="w-10 h-10 text-accent animate-pulse-slow" />
          </div>
          <p className="text-2xl font-semibold mb-2" style={{
            background: 'linear-gradient(135deg, hsl(160 85% 65%), hsl(200 90% 60%))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Where SEO meets Sustainability 🌿
          </p>
          <p className="text-base text-muted-foreground mt-3 max-w-2xl mx-auto">
            Analyze. Reimagine. Rank Green. — Comprehensive AI-powered analysis of SEO, AI Visibility, Eco Impact, UX Quality & Compatibility
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {!results ? (
            <AnalysisForm 
              onAnalyze={setResults}
              isAnalyzing={isAnalyzing}
              setIsAnalyzing={setIsAnalyzing}
            />
          ) : (
            <Dashboard 
              results={results} 
              onReset={() => setResults(null)}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-sm">
        <p className="text-muted-foreground mb-2">
          Powered by{" "}
          <span className="text-primary font-semibold">Rank AI</span> ⚡
        </p>
        <p className="text-xs text-muted-foreground/70">
          Built with sustainability in mind • Carbon-conscious analysis • Future-ready insights
        </p>
      </footer>
    </div>
  );
};

export default Index;
