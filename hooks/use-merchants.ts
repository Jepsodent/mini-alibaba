"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getRiskStatus } from "@/utils/risk-helper";
import type { AegisMerchant } from "@/components/merchant-table";
import type { MerchantFilters } from "@/constant/merchant-constant";


export function useMerchants(filters: MerchantFilters) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["merchants", filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("aegis_ai_features")
        .select(
          `
          risk_prob, cbr_30d, refund_vel_6h, current_action,
          merchant_baselines (
            name,
            industry,
            merchant_id,
            avg_daily_vol,
            mcc_risk_weight
          )
        `,
        );

      if (error) throw new Error(error.message);

      const mapped: AegisMerchant[] =
        data
          ?.map((m: any) => ({
            risk_prob: m.risk_prob ?? 0,
            cbr_30d: m.cbr_30d ?? 0,
            refund_vel_6h: m.refund_vel_6h ?? 0,
            current_action: m.current_action ?? "Normal",
            ai_analysis: m.ai_analysis ?? "",
            updated_at: m.updated_at,
            merchant_baselines: Array.isArray(m.merchant_baselines)
              ? m.merchant_baselines[0]
              : m.merchant_baselines,
          }))
          .filter((m) => m.merchant_baselines) || [];

      return applyFiltersAndSort(mapped, filters);
    },
  });
}


function applyFiltersAndSort(
  merchants: AegisMerchant[],
  filters: MerchantFilters,
): AegisMerchant[] {
  let result = [...merchants];

  // ── Search (name OR merchant_id) ──
  if (filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (m) =>
        m.merchant_baselines.name.toLowerCase().includes(q) ||
        m.merchant_baselines.merchant_id.toLowerCase().includes(q),
    );
  }

  // ── Risk Status ──
  if (filters.riskStatus !== "all") {
    result = result.filter((m) => {
      const riskValue = m.risk_prob * 100;
      const { label } = getRiskStatus(riskValue);
      return label === filters.riskStatus;
    });
  }

  // ── Industry ──
  if (filters.industry !== "all") {
    result = result.filter(
      (m) =>
        m.merchant_baselines.industry.toLowerCase() ===
        filters.industry.toLowerCase(),
    );
  }

  // ── Sort ──
  result.sort((a, b) => {
    switch (filters.sort) {
      case "cbr_desc":
        return b.cbr_30d - a.cbr_30d;
      case "cbr_asc":
        return a.cbr_30d - b.cbr_30d;
      case "risk_desc":
        return b.risk_prob - a.risk_prob;
      case "risk_asc":
        return a.risk_prob - b.risk_prob;
      case "name_asc":
        return a.merchant_baselines.name.localeCompare(
          b.merchant_baselines.name,
        );
      case "name_desc":
        return b.merchant_baselines.name.localeCompare(
          a.merchant_baselines.name,
        );
      default:
        return 0;
    }
  });

  return result;
}
