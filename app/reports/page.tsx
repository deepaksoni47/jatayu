"use client"
import AppShell from "@/components/layout/app-shell"
import useSWR from "swr"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ReportsGovernancePage() {
  const { data } = useSWR("/data/audit.json", fetcher)
  return (
    <AppShell>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Audit Log</CardTitle>
          </CardHeader>
          <CardContent className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left">Timestamp</th>
                  <th className="p-2 text-left">User</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {(data?.events || []).map((e: any, i: number) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{e.time}</td>
                    <td className="p-2">{e.user}</td>
                    <td className="p-2">{e.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-pretty">
              Aligned with FAIR data principles and IIOE-2 Data Policy. Role-based data access workflows are simulated
              in this prototype.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
