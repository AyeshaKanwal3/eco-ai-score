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
            <Sparkles className="w-8 h-8 text-primary animate-pulse-slow" />
            <h1 className="text-5xl font-bold glow-text">
              ReimagineWeb
            </h1>
            <Sparkles className="w-8 h-8 text-secondary animate-pulse-slow" />
          </div>
          <p className="text-xl text-muted-foreground">
            AI EcoRank Studio 🌿
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Analyze SEO, AI Visibility, Eco Impact & UX Quality
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
      <footer className="relative z-10 py-6 text-center text-sm text-muted-foreground">
        <p>
          Powered by{" "}
          <a 
            href="https://reimagineweb.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-secondary transition-colors"
          >
            ReimagineWeb.dev
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Index;
