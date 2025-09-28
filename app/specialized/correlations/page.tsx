"use client";
import AppShell from "@/components/layout/app-shell";
import useSWR from "swr";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Bar,
} from "recharts";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CorrelationsPage() {
  const { data } = useSWR("/data/cross_correlation.json", fetcher);
  return (
    <AppShell>
      {/* Correlations Analysis Status Header */}
      <div className="mb-6">
        <Card className="border-purple-500/20 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:to-indigo-950/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded">
                    CORRELATIONS
                  </div>
                  <div className="px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded">
                    WORKING
                  </div>
                </div>
                <h2 className="font-semibold text-purple-900 dark:text-purple-100">
                  Environmental Parameter Correlations
                </h2>
                <div className="space-y-1 text-sm text-purple-800 dark:text-purple-200">
                  <p>
                    Cross-correlation analysis between temperature, salinity,
                    and marine biodiversity.
                  </p>
                  <div className="flex items-center gap-4">
                    <span>• Data Visualization: ✅ Active</span>
                    <span>• Correlation Engine: ✅ Working</span>
                    <span>• Predictive Models: 🔄 In Development</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400">
                Functional
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Temperature vs Salinity vs Species Count</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data || []}>
              <XAxis dataKey="label" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="salinity" fill="var(--chart-2)" />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temperature"
                stroke="var(--chart-1)"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="speciesCount"
                stroke="var(--chart-3)"
                strokeDasharray="4 4"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </AppShell>
  );
}
