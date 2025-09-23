"use client"
import AppShell from "@/components/layout/app-shell"
import useSWR from "swr"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Legend, Line, Bar } from "recharts"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function CorrelationsPage() {
  const { data } = useSWR("/data/cross_correlation.json", fetcher)
  return (
    <AppShell>
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
              <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="var(--chart-1)" strokeWidth={2} />
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
  )
}
