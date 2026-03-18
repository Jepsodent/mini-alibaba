"use client";

import { useState, useEffect } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import MerchantTable from "./merchant-table";
import useDebounce from "@/hooks/use-debounce";
import { useMerchants } from "@/hooks/use-merchants";
import { usePagination } from "@/hooks/use-pagination";
import {
  RISK_STATUS_OPTIONS,
  INDUSTRY_OPTIONS,
  SORT_OPTIONS,
  PAGE_SIZE_OPTIONS,
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

  // ── Pagination ──
  const {
    currentPage,
    pageSize,
    totalPages,
    startIndex,
    endIndex,
    setPage,
    nextPage,
    prevPage,
    setPageSize,
    resetPage,
    pageRange,
  } = usePagination(merchants?.length ?? 0);

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    resetPage();
  }, [debouncedSearch, riskStatus, industry, sort, resetPage]);

  // Slice the data for the current page
  const paginatedMerchants = merchants?.slice(startIndex, endIndex);
  const totalItems = merchants?.length ?? 0;

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
          <MerchantTable merchants={paginatedMerchants} />
        )}
      </Card>

      {/* Pagination */}
      {!isLoading && totalItems > 0 && (
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Left: results text + rows-per-page */}
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">{endIndex}</span>{" "}
              of{" "}
              <span className="font-medium text-foreground">{totalItems}</span>{" "}
              results
            </p>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Rows per page:
              </span>
              <Select
                value={String(pageSize)}
                onValueChange={(v) => setPageSize(Number(v))}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right: page navigation */}
          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={prevPage}
                  aria-disabled={currentPage <= 1}
                  className={
                    currentPage <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {pageRange.map((page, idx) =>
                page === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => setPage(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={nextPage}
                  aria-disabled={currentPage >= totalPages}
                  className={
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
