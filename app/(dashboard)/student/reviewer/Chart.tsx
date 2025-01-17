"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Dummy Data for ReviewerAttempt
const reviewerAttemptData = [
  {
    date: "2024-04-01",
    score: 85,
    reviewerId: "1",
    userId: "101",
    status: "completed",
    questionAmount: 10,
    timeLimit: 30,
  },
  {
    date: "2024-04-02",
    score: 90,
    reviewerId: "2",
    userId: "102",
    status: "completed",
    questionAmount: 10,
    timeLimit: 30,
  },
  {
    date: "2024-04-03",
    score: 78,
    reviewerId: "3",
    userId: "103",
    status: "completed",
    questionAmount: 10,
    timeLimit: 30,
  },
  {
    date: "2024-04-04",
    score: 88,
    reviewerId: "4",
    userId: "104",
    status: "completed",
    questionAmount: 10,
    timeLimit: 30,
  },
  {
    date: "2024-04-05",
    score: 92,
    reviewerId: "5",
    userId: "105",
    status: "completed",
    questionAmount: 10,
    timeLimit: 30,
  },
  {
    date: "2024-04-06",
    score: 84,
    reviewerId: "6",
    userId: "106",
    status: "completed",
    questionAmount: 10,
    timeLimit: 30,
  },
  {
    date: "2024-04-07",
    score: 75,
    reviewerId: "7",
    userId: "107",
    status: "completed",
    questionAmount: 10,
    timeLimit: 30,
  },
  {
    date: "2024-04-08",
    score: 95,
    reviewerId: "8",
    userId: "108",
    status: "completed",
    questionAmount: 10,
    timeLimit: 30,
  },
  {
    date: "2024-04-09",
    score: 88,
    reviewerId: "9",
    userId: "109",
    status: "completed",
    questionAmount: 10,
    timeLimit: 30,
  },
  {
    date: "2024-04-10",
    score: 79,
    reviewerId: "10",
    userId: "110",
    status: "completed",
    questionAmount: 10,
    timeLimit: 30,
  },
  {
    date: "2024-04-11",
    score: 92,
    reviewerId: "11",
    userId: "111",
    status: "completed",
    questionAmount: 10,
    timeLimit: 30,
  },
  {
    date: "2024-04-12",
    score: 85,
    reviewerId: "12",
    userId: "112",
    status: "completed",
    questionAmount: 10,
    timeLimit: 30,
  },
  // Add more dummy data as needed
];

const passingScoreThreshold = 80; // Define passing score threshold

const chartConfig = {
  views: {
    label: "Passing Rate",
  },
  passingRate: {
    label: "Passing Rate",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function Component() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("passingRate");

  // Calculate the passing rate
  const cumulativePassingRate = React.useMemo(() => {
    let totalScore = 0;
    let passingScore = 0;
    return reviewerAttemptData.map((data) => {
      totalScore += data.score;
      if (data.score >= passingScoreThreshold) {
        passingScore += data.score;
      }
      const rate = (passingScore / totalScore) * 100; // Passing rate as percentage
      return { ...data, passingRate: rate };
    });
  }, []);

  // Calculate total passing rate at the end
  const total = React.useMemo(
    () => ({
      passingRate:
        cumulativePassingRate[cumulativePassingRate.length - 1]?.passingRate ||
        0,
    }),
    [cumulativePassingRate]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Attempts</CardTitle>
          <CardDescription>Showing for the last 2 weeks</CardDescription>
        </div>
        <div className="flex">
          {["passingRate"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[chart as keyof typeof total].toFixed(2)}%
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={cumulativePassingRate}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis tickFormatter={(value) => `${value.toFixed(0)}%`} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="passingRate"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey="passingRate" fill={`var(--color-passingRate)`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
