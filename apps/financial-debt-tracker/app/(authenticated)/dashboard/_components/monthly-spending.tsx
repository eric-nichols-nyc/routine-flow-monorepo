"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@repo/design-system/components/ui/card";
import { ChartContainer } from "@repo/design-system/components/ui/chart";
import { ArrowUpRight } from "lucide-react";
import {
  LineChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Placeholder data simulating cumulative spending throughout the month
const spendingData = [
  { day: 1, actual: 120, budget: 133 },
  { day: 2, actual: 280, budget: 266 },
  { day: 3, actual: 450, budget: 399 },
  { day: 4, actual: 580, budget: 532 },
  { day: 5, actual: 720, budget: 665 },
  { day: 6, actual: 950, budget: 798 },
  { day: 7, actual: 1180, budget: 931 },
  { day: 8, actual: 1420, budget: 1064 },
  { day: 9, actual: 1680, budget: 1197 },
  { day: 10, actual: 1950, budget: 1330 },
  { day: 11, actual: 2180, budget: 1463 },
  { day: 12, actual: 2450, budget: 1596 },
  { day: 13, actual: 2720, budget: 1729 },
  { day: 14, actual: 2980, budget: 1862 },
  { day: 15, actual: 3200, budget: 1995 },
  { day: 16, actual: 3480, budget: 2128 },
  { day: 17, actual: 3720, budget: 2261 },
  { day: 18, actual: 3950, budget: 2394 },
  { day: 19, actual: 4180, budget: 2527 },
  { day: 20, actual: 4420, budget: 2660 },
  { day: 21, actual: 4650, budget: 2793 },
  { day: 22, actual: 4836, budget: 2926 },
];

const BUDGET_TOTAL = 4120;
const CURRENT_SPENT = 4314;
const OVER_BUDGET = CURRENT_SPENT - BUDGET_TOTAL;

const chartConfig = {
  actual: {
    label: "Spent",
    color: "hsl(var(--chart-1))",
  },
  budget: {
    label: "Budget Pace",
    color: "hsl(var(--muted-foreground))",
  },
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: number;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const actual = payload.find((p) => p.dataKey === "actual")?.value ?? 0;
  const budget = payload.find((p) => p.dataKey === "budget")?.value ?? 0;
  const diff = actual - budget;

  if (diff <= 0) return null;

  return (
    <div className="rounded-md bg-red-500 px-2 py-1 text-xs font-semibold text-white shadow-lg">
      ${diff.toLocaleString()} over
    </div>
  );
}

export function MonthlySpending() {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-base font-medium text-slate-100">
          Monthly spending
        </CardTitle>
        <CardAction>
          <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors">
            TRANSACTIONS
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-100">
            ${OVER_BUDGET.toLocaleString()} over
          </div>
          <div className="text-sm text-slate-500">
            ${BUDGET_TOTAL.toLocaleString()} budgeted
          </div>
        </div>

        {/* Chart */}
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart
            data={spendingData}
            margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
          >
            <defs>
              <linearGradient id="spendingGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="25%" stopColor="#84cc16" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="75%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" hide />
            <YAxis hide domain={[0, 5000]} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            {/* Budget pace line (dotted) */}
            <Line
              type="linear"
              dataKey="budget"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="6 6"
              dot={false}
              strokeOpacity={0.4}
            />
            {/* Actual spending line with gradient */}
            <Line
              type="monotone"
              dataKey="actual"
              stroke="url(#spendingGradient)"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                fill: "#ef4444",
                stroke: "#1e293b",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
