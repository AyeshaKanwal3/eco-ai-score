import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart as RechartsBar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface BarChartProps {
  scores: Record<string, number>;
}

export const BarChart = ({ scores }: BarChartProps) => {
  const data = Object.entries(scores).map(([name, value]) => ({
    metric: name,
    score: value,
  }));

  const getBarColor = (score: number) => {
    if (score >= 80) return "hsl(var(--primary))";
    if (score >= 60) return "hsl(45 100% 50%)";
    return "hsl(var(--destructive))";
  };

  return (
    <Card className="glass-card glow-border">
      <CardHeader>
        <CardTitle className="text-center">Score Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsBar data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="metric" 
              tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
            />
            <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--foreground))" }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem"
              }}
            />
            <Bar dataKey="score" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
              ))}
            </Bar>
          </RechartsBar>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
