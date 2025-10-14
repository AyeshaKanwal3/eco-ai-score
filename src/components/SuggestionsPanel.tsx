import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Lightbulb, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Suggestion {
  category: string;
  status: "success" | "warning" | "error";
  message: string;
  reasoning?: string;
  suggestions?: string[];
}

interface SuggestionsPanelProps {
  suggestions: Suggestion[];
}

export const SuggestionsPanel = ({ suggestions }: SuggestionsPanelProps) => {
  const getIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Lightbulb className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      success: "default",
      warning: "secondary",
      error: "destructive"
    };
    return variants[status] || "default";
  };

  return (
    <Card className="glass-card glow-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-primary" />
          AI-Powered Insights & Suggestions
        </CardTitle>
        <CardDescription>
          Actionable recommendations to improve your website's performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="suggestion-card p-4 rounded-lg space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                {getIcon(suggestion.status)}
                <h4 className="font-semibold text-foreground">{suggestion.category}</h4>
              </div>
              <Badge variant={getStatusBadge(suggestion.status)}>
                {suggestion.status.toUpperCase()}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {suggestion.message}
            </p>

            {suggestion.reasoning && (
              <div className="pl-4 border-l-2 border-primary/30">
                <p className="text-xs text-muted-foreground italic">
                  💡 {suggestion.reasoning}
                </p>
              </div>
            )}

            {suggestion.suggestions && suggestion.suggestions.length > 0 && (
              <div className="space-y-1.5 pt-2">
                {suggestion.suggestions.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="text-primary mt-0.5">•</span>
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
