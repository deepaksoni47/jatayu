"use client";
import AppShell from "@/components/layout/app-shell";
import useSWR from "swr";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
} from "recharts";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function Otolith() {
  const { data } = useSWR("/data/otolith_results.json", fetcher, {
    revalidateOnFocus: false,
  });
  const [job, setJob] = useState(0);
  useEffect(() => {
    // Reduce update frequency from 500ms to 1000ms to improve performance
    const id = setInterval(() => setJob((p) => (p >= 100 ? 100 : p + 5)), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Species–Age Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.ageDistribution || []}>
              <XAxis dataKey="species" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="var(--chart-1)" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4">
            <div className="text-sm text-muted-foreground mb-1">
              AI Job Progress
            </div>
            <Progress value={job} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Predicted Age Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-2">Species</th>
                <th className="text-left p-2">Age Group</th>
                <th className="text-left p-2">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {(data?.predictions || []).map((r: any, i: number) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{r.species}</td>
                  <td className="p-2">{r.group}</td>
                  <td className="p-2">{r.accuracy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 relative">
            <img
              src="/images/otolith.jpg"
              alt="Otolith sample"
              className="w-full rounded-md border"
            />
            {(data?.boxes || []).map((b: any, i: number) => (
              <div
                key={i}
                className="absolute border-2 border-accent"
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  width: `${b.w}%`,
                  height: `${b.h}%`,
                }}
                aria-hidden
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Taxonomy() {
  const { data } = useSWR("/data/taxonomy_results.json", fetcher);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Classification Confidence</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data?.confidence || []}>
              <PolarGrid />
              <PolarAngleAxis dataKey="label" />
              <PolarRadiusAxis />
              <Radar
                dataKey="score"
                stroke="var(--chart-2)"
                fill="var(--chart-2)"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Morphology Correlation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-1">
            {(data?.heatmap || []).map((row: number[], rIdx: number) =>
              row.map((v: number, cIdx: number) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className="aspect-square rounded-sm"
                  style={{
                    backgroundColor: `oklch(${60 + v * 30}% ${
                      0.06 + v * 0.1
                    } 200)`,
                  }}
                  aria-label={`Cell ${rIdx},${cIdx} value ${v.toFixed(2)}`}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EDNA() {
  const { data } = useSWR("/data/edna_results.json", fetcher);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Species Richness over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.richness || []}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="richness"
                stroke="var(--chart-3)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Species Abundance by Location</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.abundance || []}>
              <XAxis dataKey="location" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="abundance" fill="var(--chart-4)" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left">Species</th>
                  <th className="p-2 text-left">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {(data?.rare || []).map((r: any, i: number) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{r.species}</td>
                    <td className="p-2">{r.confidence}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AIPage() {
  return (
    <AppShell>
      <Tabs defaultValue="otolith" className="w-full">
        <TabsList>
          <TabsTrigger value="otolith">Otolith Analysis</TabsTrigger>
          <TabsTrigger value="taxonomy">Taxonomy & Morphology</TabsTrigger>
          <TabsTrigger value="edna">eDNA Insights</TabsTrigger>
          <TabsTrigger value="explain">Explainability</TabsTrigger>
        </TabsList>
        <TabsContent value="otolith">
          <Otolith />
        </TabsContent>
        <TabsContent value="taxonomy">
          <Taxonomy />
        </TabsContent>
        <TabsContent value="edna">
          <EDNA />
        </TabsContent>
        <TabsContent value="explain">
          <Card>
            <CardHeader>
              <CardTitle>Explainability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-pretty">
                AI derived insights using convolutional networks + transfer
                learning on reference databases. Models are calibrated with
                domain-specific priors and uncertainty estimates for robust
                marine insights.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
