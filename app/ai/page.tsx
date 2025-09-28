"use client";
import AppShell from "@/components/layout/app-shell";
import useSWR from "swr";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const [isProcessing, setIsProcessing] = useState(false);

  const startProcessing = () => {
    setIsProcessing(true);
    setJob(0);
    const id = setInterval(() => {
      setJob((p) => {
        if (p >= 100) {
          clearInterval(id);
          setIsProcessing(false);
          return 100;
        }
        return p + 5;
      });
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Species–Age Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.age_distribution || []}>
              <XAxis dataKey="common_name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="var(--chart-1)" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                AI Otolith Analysis
                <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded dark:text-amber-400 dark:bg-amber-950/30">
                  SIMULATED
                </span>
              </div>
              <Button
                size="sm"
                onClick={startProcessing}
                disabled={isProcessing}
                variant={isProcessing ? "secondary" : "default"}
              >
                {isProcessing ? "Simulating..." : "Demo Analysis"}
              </Button>
            </div>
            <Progress value={job} />
            {job > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                {isProcessing
                  ? `Simulating: ${job}%`
                  : job === 100
                  ? "Demo Complete"
                  : "Ready for demo"}
              </div>
            )}
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
              {(data?.growth_predictions || []).map((r: any, i: number) => (
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
            {(data?.detection_boxes || []).map((b: any, i: number) => (
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
            <RadarChart data={data?.taxonomic_confidence_scores || []}>
              <PolarGrid />
              <PolarAngleAxis dataKey="level" />
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
            {(data?.classification_heatmap || []).map(
              (row: number[], rIdx: number) =>
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
            <LineChart data={data?.species_richness_timeline || []}>
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
            <BarChart data={data?.site_abundance || []}>
              <XAxis dataKey="location" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="abundance_index" fill="var(--chart-4)" />
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
                {(data?.rare_species_detections || []).map(
                  (r: any, i: number) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{r.common_name}</td>
                      <td className="p-2">{r.confidence}%</td>
                    </tr>
                  )
                )}
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
      {/* AI Features Honest Status Header */}
      <div className="mb-6">
        <Card className="border-orange-500/20 bg-gradient-to-r from-orange-50/50 to-red-50/50 dark:from-orange-950/20 dark:to-red-950/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-orange-600 text-white text-xs font-semibold rounded">
                    AI MODULE
                  </div>
                  <div className="px-2 py-1 bg-amber-600 text-white text-xs font-semibold rounded">
                    DEMONSTRATION ONLY
                  </div>
                </div>
                <h2 className="font-semibold text-orange-900 dark:text-orange-100">
                  Marine AI Analytics - Proof of Concept
                </h2>
                <div className="space-y-1 text-sm text-orange-800 dark:text-orange-200">
                  <p>
                    This section demonstrates the intended AI workflow and
                    interface design.
                  </p>
                  <div className="flex items-center gap-4">
                    <span>• UI/UX: Fully implemented</span>
                    <span>• Data Processing: Simulated</span>
                    <span>• ML Models: Planned for production</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-orange-600 dark:text-orange-400">
                Demo Build
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
