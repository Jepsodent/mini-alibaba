"use client";

import {
  BarChart3,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import mockData from "@/lib/mock-data.json";
import StatCard from "./stat-card";
import ChargebackChart from "./chargeback-chart";
import AlertsTable from "./alerts-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export default function PortfolioRiskOverview() {
  const { portfolioStats, chargebackTrend, atRiskIndustries, recentAlerts } =
    mockData;
  const supabase = createClient();
  const {
    data: merchantData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["merchants_stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("aegis_ai_features")
        .select("risk_prob, merchant_baselines(industry)");

      const stats = data?.reduce(
        (acc, m) => {
          acc.merchantsMonitored++;
          const prob = m.risk_prob * 100;

          if (prob <= 30)
            acc.health++; // normal / sehat
          else if (prob <= 60)
            acc.warning++; // warning
          else acc.high++; // high + critical digabung

          return acc;
        },
        { merchantsMonitored: 0, high: 0, warning: 0, health: 0 },
      );
      const industries = Array.from(
        new Set(
          data
            ?.map(
              (m) =>
                (m.merchant_baselines as unknown as { industry: string })
                  .industry,
            )
            .filter((i): i is string => typeof i === "string"), // pastikan tipe string
        ),
      );
      // per-industry stats
      const industryStats = data?.reduce(
        (acc, m) => {
          const industry = (
            m.merchant_baselines as unknown as { industry: string }
          ).industry;
          const prob = m.risk_prob;

          if (!acc[industry]) {
            acc[industry] = { totalRisk: 0, count: 0 };
          }

          acc[industry].totalRisk += prob;
          acc[industry].count += 1;

          return acc;
        },
        {} as Record<string, { totalRisk: number; count: number }>,
      );
      const industryAverages = Object.entries(industryStats ?? {}).map(
        ([industry, { totalRisk, count }]) => ({
          industry,
          avgRisk: totalRisk / count,
        }),
      );
      console.log(industryAverages);

      console.log(data, stats);
      return { stats, industryAverages };
    },
  });

  const sortedIndustries = merchantData?.industryAverages
    .map((ind) => ({
      ...ind,
      // 2. Tentukan risk level
      riskLevel:
        ind.avgRisk >= 0.6
          ? "High Risk"
          : ind.avgRisk >= 0.3
            ? "Med Risk"
            : "Low Risk",
    }))
    .sort((a, b) => b.avgRisk - a.avgRisk);
  console.log(sortedIndustries);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Portfolio Risk Overview
          </h1>
          <p className="text-muted-foreground">
            Real-time chargeback prediction and exposure metrics.
          </p>
        </div>
        <Button variant="outline" size="sm">
          📅 Last 30 Days
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          title="Merchants "
          value={merchantData?.stats?.merchantsMonitored?.toString() || ""}
          change={portfolioStats.merchantsMonitoredChange}
          icon={BarChart3}
          color="text-blue-500"
        />
        <StatCard
          title="High Risk"
          value={merchantData?.stats?.high?.toString() || ""}
          change={portfolioStats.highRiskChange}
          icon={AlertTriangle}
          color="text-red-500"
        />
        <StatCard
          title="Warning"
          value={merchantData?.stats?.warning?.toString() || ""}
          change={portfolioStats.warningChange}
          icon={TrendingUp}
          color="text-orange-500"
        />
        <StatCard
          title="Healthy"
          value={merchantData?.stats?.health?.toString() || ""}
          change={portfolioStats.healthyChange}
          icon={CheckCircle}
          color="text-green-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Chargeback Trend */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Chargeback Trend</CardTitle>
            <div className="text-xs text-muted-foreground mt-1">
              Risk Index Status:{" "}
              <span className="text-orange-500 font-medium">
                Moderate Warning
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <ChargebackChart data={chargebackTrend} />
          </CardContent>
        </Card>

        {/* At-Risk Industries */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Top At-Risk Industries</CardTitle>
            <button className="text-muted-foreground hover:text-foreground">
              <MoreHorizontal size={16} />
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedIndustries?.map((industry, i) => (
                <div
                  key={i++}
                  className="flex items-center justify-between py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {industry.industry}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      industry.riskLevel === "High Risk"
                        ? "bg-red-100 text-red-700"
                        : industry.riskLevel === "Med Risk"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {industry.riskLevel}
                  </span>
                </div>
              ))}
            </div>
            <button className="text-xs text-primary font-medium mt-3 hover:underline flex items-center gap-1">
              View All Categories
              <ChevronRight size={12} />
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Critical Alerts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base">Recent Critical Alerts</CardTitle>
          <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
            View All Logs
            <ChevronRight size={14} />
          </button>
        </CardHeader>
        <CardContent>
          <AlertsTable alerts={recentAlerts} />
        </CardContent>
      </Card>
    </div>
  );
}
