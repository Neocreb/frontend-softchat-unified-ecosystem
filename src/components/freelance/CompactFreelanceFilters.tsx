import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CompactFreelanceFiltersProps {
  initialFilters?: Partial<CompactFilters>;
  onFiltersChange?: (filters: CompactFilters) => void;
}

export interface CompactFilters {
  searchQuery: string;
  urgent: "any" | "urgent";
  clientType: "any" | "verified" | "unverified";
  jobType: "any" | "fixed" | "hourly";
  budget: "any" | "0-500" | "500-2000" | "2000+";
  sortBy: "relevance" | "newest" | "budget" | "rating";
  timePosted: "any" | "24h" | "7d" | "30d";
  location: "any" | "remote" | "on-site";
  ai: "any" | "recommended";
  category: "any" | "web" | "mobile" | "design" | "writing" | "data";
}

const defaultFilters: CompactFilters = {
  searchQuery: "",
  urgent: "any",
  clientType: "any",
  jobType: "any",
  budget: "any",
  sortBy: "relevance",
  timePosted: "any",
  location: "any",
  ai: "any",
  category: "any",
};

const CompactFreelanceFilters: React.FC<CompactFreelanceFiltersProps> = ({ initialFilters, onFiltersChange }) => {
  const [filters, setFilters] = useState<CompactFilters>({ ...defaultFilters, ...(initialFilters || {}) });

  useEffect(() => {
    onFiltersChange?.(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const update = <K extends keyof CompactFilters>(key: K, value: CompactFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col gap-3">
          {/* Top row: Search + Sort */}
          <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center">
            <Input
              placeholder="Search jobs..."
              value={filters.searchQuery}
              onChange={(e) => update("searchQuery", e.target.value)}
              className="md:max-w-sm"
            />
            <div className="flex gap-2 flex-1 justify-end">
              <Select value={filters.sortBy} onValueChange={(v: any) => update("sortBy", v)}>
                <SelectTrigger className="w-[170px]"><SelectValue placeholder="Sort" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Sort: relevance</SelectItem>
                  <SelectItem value="newest">Sort: newest</SelectItem>
                  <SelectItem value="budget">Sort: budget</SelectItem>
                  <SelectItem value="rating">Sort: rating</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.timePosted} onValueChange={(v: any) => update("timePosted", v)}>
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="Time posted" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any time</SelectItem>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filter row */}
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-8 gap-2">
            <Select value={filters.urgent} onValueChange={(v: any) => update("urgent", v)}>
              <SelectTrigger><SelectValue placeholder="Urgent" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Urgent: Any</SelectItem>
                <SelectItem value="urgent">Urgent only</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.clientType} onValueChange={(v: any) => update("clientType", v)}>
              <SelectTrigger><SelectValue placeholder="Clients" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Clients: Any</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.jobType} onValueChange={(v: any) => update("jobType", v)}>
              <SelectTrigger><SelectValue placeholder="Job type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Job: Any</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.budget} onValueChange={(v: any) => update("budget", v)}>
              <SelectTrigger><SelectValue placeholder="Budget" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Budget: Any</SelectItem>
                <SelectItem value="0-500">$0 - $500</SelectItem>
                <SelectItem value="500-2000">$500 - $2000</SelectItem>
                <SelectItem value="2000+">$2000+</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.location} onValueChange={(v: any) => update("location", v)}>
              <SelectTrigger><SelectValue placeholder="Location" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Location: Any</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="on-site">On-site</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.ai} onValueChange={(v: any) => update("ai", v)}>
              <SelectTrigger><SelectValue placeholder="AI" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">AI: Any</SelectItem>
                <SelectItem value="recommended">AI Recommended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.category} onValueChange={(v: any) => update("category", v)}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Category: Any</SelectItem>
                <SelectItem value="web">Web Dev</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="writing">Writing</SelectItem>
                <SelectItem value="data">Data</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactFreelanceFilters;
