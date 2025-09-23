"use client"
import AppShell from "@/components/layout/app-shell"
import useSWR from "swr"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function SettingsPage() {
  const { data } = useSWR("/data/users.json", fetcher)
  const orgs = ["INCOIS", "CMLRE", "Fisheries Dept."]
  return (
    <AppShell>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data?.users || []).map((u: any, i: number) => (
              <div key={i} className="flex items-center gap-3 border rounded-md p-2">
                <div className="flex-1">
                  <div className="text-sm font-medium">{u.name}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </div>
                <div className="min-w-40">
                  <Label className="sr-only">Role</Label>
                  <Select defaultValue={u.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scientist">Scientist</SelectItem>
                      <SelectItem value="Policymaker">Policymaker</SelectItem>
                      <SelectItem value="Fisheries Manager">Fisheries Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">Set your organization context.</div>
            <div className="min-w-56">
              <Label className="sr-only">Organization</Label>
              <Select defaultValue={orgs[0]}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {orgs.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
