import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Rocket } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { AnalysisResult } from "@/pages/Index";

interface AnalysisFormProps {
  onAnalyze: (results: AnalysisResult) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (val: boolean) => void;
}

export const AnalysisForm = ({ onAnalyze, isAnalyzing, setIsAnalyzing }: AnalysisFormProps) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [track, setTrack] = useState("all");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !url) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsAnalyzing(true);
    toast.info("Starting analysis...");

    try {
      const { data, error } = await supabase.functions.invoke("analyze-website", {
        body: { url, track, name }
      });

      if (error) throw error;

      onAnalyze(data);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze website. Please try again.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="glass-card glow-border rounded-2xl p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="bg-input/50 border-border"
              disabled={isAnalyzing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url" className="text-foreground">Website URL</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="bg-input/50 border-border"
              disabled={isAnalyzing}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Analysis Track</Label>
            <RadioGroup value={track} onValueChange={setTrack} disabled={isAnalyzing}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="cursor-pointer">Analyze All</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="seo" id="seo" />
                <Label htmlFor="seo" className="cursor-pointer">SEO Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="geo" id="geo" />
                <Label htmlFor="geo" className="cursor-pointer">AI GEO Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compatibility" id="compatibility" />
                <Label htmlFor="compatibility" className="cursor-pointer">Compatibility Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="eco" id="eco" />
                <Label htmlFor="eco" className="cursor-pointer">Eco Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ux" id="ux" />
                <Label htmlFor="ux" className="cursor-pointer">UX Only</Label>
              </div>
            </RadioGroup>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-border"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4 mr-2" />
                Start Analysis
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
