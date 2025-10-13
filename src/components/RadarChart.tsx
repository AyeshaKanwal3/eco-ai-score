import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface RadarChartProps {
  scores: Record<string, number>;
}

export const RadarChart = ({ scores }: RadarChartProps) => {
  const data = Object.entries(scores).map(([name, value]) => ({
    metric: name,
    score: value,
  }));

  return (
    <Card className="glass-card glow-border">
      <CardHeader>
        <CardTitle className="text-center">Overall Performance Radar</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsRadar data={data}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis 
              dataKey="metric" 
              tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
            />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar
              name="Score"
              dataKey="score"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
            />
          </RechartsRadar>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
