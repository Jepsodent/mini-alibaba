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

export default function PortfolioRiskOverview() {
  const { portfolioStats, chargebackTrend, atRiskIndustries, recentAlerts } =
    mockData;

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
          title="Merchants Monitored"
          value={portfolioStats.merchantsMonitored}
          change={portfolioStats.merchantsMonitoredChange}
          icon={BarChart3}
          color="text-blue-500"
        />
        <StatCard
          title="High Risk"
          value={portfolioStats.highRisk}
          change={portfolioStats.highRiskChange}
          icon={AlertTriangle}
          color="text-red-500"
        />
        <StatCard
          title="Warning"
          value={portfolioStats.warning}
          change={portfolioStats.warningChange}
          icon={TrendingUp}
          color="text-orange-500"
        />
        <StatCard
          title="Healthy"
          value={portfolioStats.healthy}
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
              {atRiskIndustries.map((industry) => (
                <div
                  key={industry.id}
                  className="flex items-center justify-between py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {industry.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {industry.mcc}
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
