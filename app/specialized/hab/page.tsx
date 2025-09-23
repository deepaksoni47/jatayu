"use client"
import AppShell from "@/components/layout/app-shell"
import useSWR from "swr"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function HABPage() {
  const { data } = useSWR("/data/hab_alerts.json", fetcher)
  const { data: timeline } = useSWR("/data/hab_timeline.json", fetcher)

  return (
    <AppShell>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>HAB Alerts</CardTitle>
          </CardHeader>
          <CardContent className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left">Location</th>
                  <th className="p-2 text-left">Severity</th>
                  <th className="p-2 text-left">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {(data?.alerts || []).map((a: any, i: number) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{a.location}</td>
                    <td className="p-2 text-destructive">{a.severity}</td>
                    <td className="p-2">{a.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mini Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-64 rounded-md border bg-[radial-gradient(circle_at_30%_30%,var(--ocean-2),var(--ocean-1))]">
              {(data?.alerts || []).map((a: any, i: number) => (
                <div
                  key={i}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${a.x}%`, top: `${a.y}%` }}
                  aria-label={`Alert ${a.location}`}
                >
                  <div className="size-3 rounded-full bg-destructive ring-2 ring-background" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Anomalies per Week</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline || []}>
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="alerts" stroke="var(--chart-5)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
