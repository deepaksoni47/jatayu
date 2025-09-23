"use client"
import AppShell from "@/components/layout/app-shell"
import useSWR from "swr"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function PolicyReportsPage() {
  const { data } = useSWR("/data/reports.json", fetcher)

  function generateReport() {
    const content = `Jatayu Policy Report\nGenerated: ${new Date().toISOString()}\n\nSummary: Mock PDF placeholder content.`
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "jatayu-policy-report.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AppShell>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Create a static placeholder report for EIA/Policy review.
            </p>
            <Button onClick={generateReport}>Generate Report</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Last Generated Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(data?.reports || []).map((r: any, i: number) => (
                <li key={i} className="rounded-md border p-2">
                  <div className="text-sm font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.date}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
