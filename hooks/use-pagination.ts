import { useState, useMemo, useCallback } from "react";
import { DEFAULT_PAGE_SIZE } from "@/constant/merchant-constant";

interface UsePaginationReturn {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageSize: (size: number) => void;
  resetPage: () => void;
  pageRange: (number | "ellipsis")[];
}


export function usePagination(
  totalItems: number,
  initialPageSize = DEFAULT_PAGE_SIZE,
): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize],
  );

  // Clamp page if totalPages shrinks (e.g. after filtering)
  const safePage = useMemo(
    () => Math.min(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  // ── Navigation helpers ──

  const setPage = useCallback(
    (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages))),
    [totalPages],
  );

  const nextPage = useCallback(
    () => setCurrentPage((p) => Math.min(p + 1, totalPages)),
    [totalPages],
  );

  const prevPage = useCallback(
    () => setCurrentPage((p) => Math.max(p - 1, 1)),
    [],
  );

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setCurrentPage(1);
  }, []);

  const resetPage = useCallback(() => setCurrentPage(1), []);

  // ── Smart page range (max 7 slots) ──
  const pageRange = useMemo((): (number | "ellipsis")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [1];

    if (safePage > 3) pages.push("ellipsis");

    const start = Math.max(2, safePage - 1);
    const end = Math.min(totalPages - 1, safePage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (safePage < totalPages - 2) pages.push("ellipsis");

    pages.push(totalPages);
    return pages;
  }, [safePage, totalPages]);

  return {
    currentPage: safePage,
    pageSize,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    setPage,
    nextPage,
    prevPage,
    setPageSize,
    resetPage,
    pageRange,
  };
}
