"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MerchantTable from "./merchant-table";
import useDebounce from "@/hooks/use-debounce";
import { useMerchants } from "@/hooks/use-merchants";
import {
  RISK_STATUS_OPTIONS,
  INDUSTRY_OPTIONS,
  SORT_OPTIONS,
  DEFAULT_MERCHANT_FILTERS,
  type RiskStatusValue,
  type IndustryValue,
  type SortValue,
} from "@/constant/merchant-constant";

export default function MerchantExposure() {
  // ── Local filter state ──
  const [search, setSearch] = useState(DEFAULT_MERCHANT_FILTERS.search);
  const [debouncedSearch, setDebouncedSearch] = useState(
    DEFAULT_MERCHANT_FILTERS.search,
  );
  const [riskStatus, setRiskStatus] = useState<RiskStatusValue>(
    DEFAULT_MERCHANT_FILTERS.riskStatus,
  );
  const [industry, setIndustry] = useState<IndustryValue>(
    DEFAULT_MERCHANT_FILTERS.industry,
  );
  const [sort, setSort] = useState<SortValue>(DEFAULT_MERCHANT_FILTERS.sort);

  const debounce = useDebounce();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    debounce(() => setDebouncedSearch(value), 500);
  };

  // ── Data fetching (hook handles Supabase + filter/sort) ──
  const { data: merchants, isLoading } = useMerchants({
    search: debouncedSearch,
    riskStatus,
    industry,
    sort,
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Merchant Risk Management
          </h1>
          <p className="text-muted-foreground">
            Monitor exposure and prevent chargebacks across your portfolio.
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus size={16} className="mr-2" />
          Onboard Merchant
        </Button>
      </div>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-64 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              type="text"
              placeholder="Search by Merchant Name or MID..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Risk Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Risk Status:
              </span>
              <Select
                value={riskStatus}
                onValueChange={(v) => setRiskStatus(v as RiskStatusValue)}
              >
                <SelectTrigger className="min-w-[110px]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  {RISK_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Industry Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Industry:
              </span>
              <Select
                value={industry}
                onValueChange={(v) => setIndustry(v as IndustryValue)}
              >
                <SelectTrigger className="min-w-[130px]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Sort:
              </span>
              <Select
                value={sort}
                onValueChange={(v) => setSort(v as SortValue)}
              >
                <SelectTrigger className="min-w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">
                Loading merchants…
              </p>
            </div>
          </div>
        ) : merchants && merchants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search size={40} className="text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground font-medium">
              No merchants found
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <MerchantTable merchants={merchants} />
        )}
      </Card>
    </div>
  );
}
