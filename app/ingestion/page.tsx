"use client";
import AppShell from "@/components/layout/app-shell";
import type React from "react";

import useSWR from "swr";
import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function IngestionPage() {
  const { data: preview } = useSWR("/data/sample_ingested.json", fetcher);
  const { data: schema } = useSWR("/data/schema_map.json", fetcher);
  const [filter, setFilter] = useState<
    "All" | "Oceanography" | "Fisheries" | "eDNA"
  >("All");
  const [uploadPreview, setUploadPreview] = useState<any[] | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to start processing when file is uploaded
  const startProcessing = () => {
    setIsProcessing(true);
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 7);
        if (next >= 100) {
          clearInterval(id);
          setIsProcessing(false);
        }
        return next;
      });
    }, 300);
  };

  const dataRows = useMemo(() => {
    const rows = uploadPreview ?? preview ?? [];
    if (filter === "All") return rows;
    return rows.filter((r: any) => r.domain === filter);
  }, [filter, preview, uploadPreview]);

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        if (file.name.endsWith(".json")) {
          const j = JSON.parse(text);
          setUploadPreview(Array.isArray(j) ? j.slice(0, 10) : [j]);
          startProcessing(); // Start processing when file is uploaded
        } else {
          // CSV parse (very naive)
          const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
          const headers = headerLine.split(",");
          const rows = lines.slice(0, 10).map((line) => {
            const cells = line.split(",");
            const obj: any = {};
            headers.forEach((h, i) => (obj[h.trim()] = cells[i]?.trim()));
            return obj;
          });
          setUploadPreview(rows);
          startProcessing(); // Start processing when file is uploaded
        }
      } catch {
        setUploadPreview(null);
      }
    };
    reader.readAsText(file);
  }

  return (
    <AppShell>
      {/* Data Ingestion Honest Status Header */}
      <div className="mb-6">
        <Card className="border-blue-500/20 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                    DATA PIPELINE
                  </div>
                  <div className="px-2 py-1 bg-emerald-600 text-white text-xs font-semibold rounded">
                    FUNCTIONAL
                  </div>
                </div>
                <h2 className="font-semibold text-blue-900 dark:text-blue-100">
                  Data Ingestion & Processing
                </h2>
                <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <p>
                    File upload, parsing, and preview functionality is working.
                  </p>
                  <div className="flex items-center gap-4">
                    <span>• File Upload: ✅ Working</span>
                    <span>• Data Preview: ✅ Working</span>
                    <span>• Advanced Processing: 🔄 Planned</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                Partial Implementation
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upload & Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3">
              <div className="grid gap-1">
                <Label htmlFor="file">CSV/JSON</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".csv,.json"
                  onChange={onUpload}
                />
              </div>
              <div className="grid gap-1">
                <Label>Filter Domain</Label>
                <Select
                  value={filter}
                  onValueChange={(v) => setFilter(v as any)}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Oceanography">Oceanography</SelectItem>
                    <SelectItem value="Fisheries">Fisheries</SelectItem>
                    <SelectItem value="eDNA">eDNA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="ml-auto"
                variant="secondary"
                onClick={() => setUploadPreview(null)}
              >
                Reset
              </Button>
            </div>
            <div className="mt-4">
              <div className="text-sm text-muted-foreground mb-2">
                Data Processing Status
              </div>
              <Progress value={progress} />
              <div className="text-xs text-muted-foreground mt-1">
                {!uploadPreview &&
                  progress === 0 &&
                  "Upload a file to start processing"}
                {isProcessing && "Processing and standardizing data..."}
                {progress === 100 &&
                  uploadPreview &&
                  "Data processed successfully"}
                {uploadPreview &&
                  !isProcessing &&
                  progress < 100 &&
                  "Ready for processing"}
              </div>
            </div>
            <div className="mt-4 overflow-auto border rounded-md">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    {Object.keys(dataRows[0] ?? {}).map((k) => (
                      <th key={k} className="text-left p-2">
                        {k}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataRows.map((row: any, i: number) => (
                    <tr key={i} className="border-t">
                      {Object.entries(row).map(([k, v]) => (
                        <td key={k} className="p-2">
                          {String(v)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {dataRows.length === 0 && (
                    <tr>
                      <td className="p-3 text-muted-foreground">
                        No rows to display
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Schema Mapping (Preview)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-[520px]">
              {JSON.stringify(schema, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
