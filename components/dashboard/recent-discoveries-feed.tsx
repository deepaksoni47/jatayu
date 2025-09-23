"use client";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Dna,
  Brain,
  Waves,
  Fish,
  Microscope,
  MapPin,
  Clock,
  TrendingUp,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface Discovery {
  id: string;
  type: "new_species" | "ai_correlation" | "oceanographic_event";
  title: string;
  description: string;
  location: string;
  coordinates: [number, number];
  timestamp: string;
  source: string;
  confidence: number;
  category: string;
  tags: string[];
  researcher: string;
  institution: string;
  impact_score: number;
}

interface DiscoveryData {
  discoveries: Discovery[];
  stats: {
    total_discoveries: number;
    discoveries_this_week: number;
    discoveries_this_month: number;
    top_category: string;
    average_confidence: number;
    average_impact_score: number;
    active_researchers: number;
    contributing_institutions: number;
  };
  last_updated: string;
}

// Get icon for discovery type
const getDiscoveryIcon = (type: Discovery["type"]) => {
  switch (type) {
    case "new_species":
      return <Dna className="h-4 w-4" />;
    case "ai_correlation":
      return <Brain className="h-4 w-4" />;
    case "oceanographic_event":
      return <Waves className="h-4 w-4" />;
    default:
      return <Microscope className="h-4 w-4" />;
  }
};

// Get discovery type label
const getDiscoveryTypeLabel = (type: Discovery["type"]) => {
  switch (type) {
    case "new_species":
      return "New Species";
    case "ai_correlation":
      return "AI Discovery";
    case "oceanographic_event":
      return "Ocean Event";
    default:
      return "Discovery";
  }
};

// Get color for discovery type
const getDiscoveryColor = (type: Discovery["type"]) => {
  switch (type) {
    case "new_species":
      return "text-green-600 bg-green-50 border-green-200";
    case "ai_correlation":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "oceanographic_event":
      return "text-purple-600 bg-purple-50 border-purple-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

// Get confidence color
const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.9) return "text-green-600";
  if (confidence >= 0.8) return "text-yellow-600";
  return "text-red-600";
};

// Get impact score color
const getImpactColor = (score: number) => {
  if (score >= 9) return "text-emerald-600";
  if (score >= 8) return "text-blue-600";
  if (score >= 7) return "text-yellow-600";
  return "text-gray-600";
};

// Discovery item component
const DiscoveryItem = ({
  discovery,
  isNew,
}: {
  discovery: Discovery;
  isNew?: boolean;
}) => (
  <div
    className={cn(
      "group p-4 rounded-lg border transition-all duration-300 hover:shadow-md",
      "bg-gradient-to-r from-card/50 to-card/80 backdrop-blur-sm",
      isNew && "animate-fade-slide-in border-blue-300 bg-blue-50/50"
    )}
  >
    <div className="flex items-start gap-3">
      <div
        className={cn("p-2 rounded-full", getDiscoveryColor(discovery.type))}
      >
        {getDiscoveryIcon(discovery.type)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-semibold text-sm leading-tight">
            {discovery.title}
          </h4>
          {isNew && (
            <Badge className="bg-blue-100 text-blue-800 text-xs animate-pulse">
              NEW
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {discovery.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{discovery.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              {formatDistanceToNow(new Date(discovery.timestamp), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={cn("text-xs", getDiscoveryColor(discovery.type))}>
              {getDiscoveryTypeLabel(discovery.type)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {discovery.category.replace(/_/g, " ")}
            </Badge>
            <span
              className={cn(
                "text-xs font-medium",
                getConfidenceColor(discovery.confidence)
              )}
            >
              {Math.round(discovery.confidence * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span
              className={cn(
                "text-xs font-medium",
                getImpactColor(discovery.impact_score)
              )}
            >
              {discovery.impact_score}/10
            </span>
          </div>
        </div>

        <div className="mt-2 text-xs text-muted-foreground">
          <span className="font-medium">{discovery.researcher}</span> •{" "}
          {discovery.institution}
        </div>
      </div>
    </div>
  </div>
);

// Main Recent Discoveries Feed component
export const RecentDiscoveriesFeed = ({ data }: { data?: DiscoveryData }) => {
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [newDiscoveries, setNewDiscoveries] = useState<Set<string>>(new Set());

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScroll || !data?.discoveries.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % data.discoveries.length;

        // Scroll to the next item
        if (scrollAreaRef.current) {
          const itemHeight = 180; // Approximate height of each discovery item
          scrollAreaRef.current.scrollTo({
            top: next * itemHeight,
            behavior: "smooth",
          });
        }

        return next;
      });
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoScroll, data?.discoveries.length]);

  // Simulate new discoveries (in real app, this would come from WebSocket or polling)
  useEffect(() => {
    if (!data?.discoveries.length) return;

    const simulateNewDiscovery = () => {
      const randomDiscovery =
        data.discoveries[Math.floor(Math.random() * data.discoveries.length)];
      setNewDiscoveries((prev) => new Set([...prev, randomDiscovery.id]));

      // Remove the "new" indicator after 10 seconds
      setTimeout(() => {
        setNewDiscoveries((prev) => {
          const updated = new Set(prev);
          updated.delete(randomDiscovery.id);
          return updated;
        });
      }, 10000);
    };

    // Simulate a new discovery every 30 seconds
    const interval = setInterval(simulateNewDiscovery, 30000);
    return () => clearInterval(interval);
  }, [data?.discoveries]);

  const handleScrollToTop = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    setCurrentIndex(0);
  };

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fish className="h-5 w-5 text-blue-600" />
            Recent Discoveries Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading discoveries...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Fish className="h-5 w-5 text-blue-600" />
            Recent Discoveries Feed
            {newDiscoveries.size > 0 && (
              <Badge className="bg-blue-100 text-blue-800 animate-pulse">
                {newDiscoveries.size} new
              </Badge>
            )}
          </CardTitle>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAutoScroll(!isAutoScroll)}
              className="h-8 w-8 p-0"
            >
              {isAutoScroll ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleScrollToTop}
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats summary */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                isAutoScroll ? "bg-green-500 animate-pulse" : "bg-gray-400"
              )}
            />
            <span>{isAutoScroll ? "Auto-scrolling" : "Paused"}</span>
          </div>
          <span>•</span>
          <span>{data.stats.discoveries_this_week} this week</span>
          <span>•</span>
          <span>{data.stats.active_researchers} researchers</span>
          <span>•</span>
          <span>
            Avg impact: {data.stats.average_impact_score.toFixed(1)}/10
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea ref={scrollAreaRef} className="h-[600px] px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
            {data.discoveries.map((discovery, index) => (
              <DiscoveryItem
                key={discovery.id}
                discovery={discovery}
                isNew={newDiscoveries.has(discovery.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentDiscoveriesFeed;
