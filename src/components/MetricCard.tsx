import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface MetricCardProps {
  title: string;
  score: number;
  details: any;
}

export const MetricCard = ({ title, score, details }: MetricCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-primary";
    if (score >= 60) return "text-yellow-500";
    return "text-destructive";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="w-6 h-6 text-primary" />;
    if (score >= 60) return <AlertCircle className="w-6 h-6 text-yellow-500" />;
    return <XCircle className="w-6 h-6 text-destructive" />;
  };

  return (
    <Card className="glass-card glow-border hover:scale-105 transition-transform">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {getScoreIcon(score)}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-4xl font-bold ${getScoreColor(score)} mb-2`}>
          {score}
        </div>
        <CardDescription className="text-xs line-clamp-3">
          {details.summary || "Analysis complete"}
        </CardDescription>
      </CardContent>
    </Card>
  );
};
