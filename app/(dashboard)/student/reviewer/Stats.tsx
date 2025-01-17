"use client";

import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Sample performance data for various topics
const chartData = [
  { topic: "Math", score: 85 },
  { topic: "Science", score: 90 },
  { topic: "History", score: 75 },
  { topic: "Literature", score: 88 },
  { topic: "Art", score: 92 },
  { topic: "Physics", score: 80 },
];

const chartConfig = {
  performance: {
    label: "Performance",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function Stats() {
  return (
    <Card className="flex-1">
      <CardHeader className="items-center">
        <CardTitle>Performance - Topics</CardTitle>
        <CardDescription>
          Showing your performance across various topics
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="topic" />
            <PolarGrid />
            <Radar
              dataKey="score"
              fill="var(--color-performance)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Improving by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          Your performance from January to June 2024
        </div>
      </CardFooter>
    </Card>
  );
}
