"use client";

import { useState } from "react";
import { ArrowLeft, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import mockData from "@/lib/mock-data.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

interface MerchantDetailProps {
  merchantId: string;
}

export default function MerchantDetail({ merchantId }: MerchantDetailProps) {
  const supabase = createClient();
  const { data: rawDetail, isLoading } = useQuery({
    queryKey: ["merchant-detail", merchantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("aegis_ai_features")
        .select(`*, merchant_baselines (*)`)
        .eq("merchant_id", merchantId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!merchantId,
  });

  // State untuk AI
  const [liveAiAnalysis, setLiveAiAnalysis] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  if (isLoading || !rawDetail) {
    return (
      <div className="p-8 text-center">Loading Merchant Intelligence...</div>
    );
  }

  const baseline = rawDetail.merchant_baselines;
  const compositeScore = Math.round(rawDetail.risk_prob * 100);
  const isCritical = compositeScore >= 80;

  const detail = {
    name: baseline?.name || "Unknown Merchant",
    mcc: baseline?.mcc_risk_weight || "N/A",
    compositeScore: compositeScore,
    interventionNeeded: isCritical,
    interventionReason: isCritical ? "Critical Alert" : "Elevated Risk",
    stats: {
      disputeRate: (rawDetail.cbr_30d * 100).toFixed(2) + "%",
      transactions: baseline?.avg_daily_vol || 0,
      avgTxn: "Dynamic",
    },
    // Mapping Risk Indicators dari Database
    riskIndicators: [
      {
        label: "Refund Velocity",
        status:
          rawDetail.refund_vel_6h >= 50
            ? "Critical"
            : rawDetail.refund_vel_6h > 30
              ? "Warning"
              : "Normal",
        value: rawDetail.refund_vel_6h.toFixed(1) + "x",
        detail: "6-hour window velocity",
      },
      {
        label: "Chargeback Ratio",
        status: rawDetail.cbr_30d > 0.01 ? "Critical" : "Normal",
        value: (rawDetail.cbr_30d * 100).toFixed(2) + "%",
        detail: "30-day rolling average",
      },
      {
        label: "Volume Spike",
        status: rawDetail.vol_spike_24h > 5 ? "Elevated" : "Normal",
        value: rawDetail.vol_spike_24h.toFixed(1) + "x",
        detail: "24-hour vs baseline",
      },
      {
        label: "CRC Index",
        status: rawDetail.crc_index > 0.7 ? "Warning" : "Normal",
        value: rawDetail.crc_index.toFixed(2),
        detail: "Chargeback-Refund Correlation",
      },
    ],
  };

  // Fungsi memanggil API Route
  const handleGenerateRealAI = async () => {
    setIsLoadingAi(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantName: detail.name,
          riskScore: detail.compositeScore,
          cbRate: detail.stats.disputeRate,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setLiveAiAnalysis(data.aiResponse);
      } else {
        setLiveAiAnalysis("Gagal mendapatkan analisis dari server.");
      }
    } catch (error) {
      setLiveAiAnalysis("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  const getIndicatorColor = (status: string) => {
    if (status === "Critical") return "bg-red-100 text-red-700";
    if (status === "Elevated") return "bg-orange-100 text-orange-700";
    if (status === "High") return "bg-orange-100 text-orange-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/exposure">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-foreground">
                {detail.name}
              </h1>
              {detail.interventionNeeded && (
                <Badge variant="destructive" className="text-xs">
                  {detail.interventionReason}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              MCC: {merchantId} • Weight: {detail.mcc}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Hold Funds</Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            View Transactions
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {/* Risk Indicator Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Indicator Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {detail.riskIndicators.map((indicator, idx) => (
                  <div
                    key={idx}
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-foreground">
                        {indicator.label}
                      </p>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${getIndicatorColor(indicator.status)}`}
                      >
                        {indicator.status}
                      </span>
                    </div>
                    <div className="mb-2">
                      <p className="text-2xl font-bold text-foreground">
                        {indicator.value}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {indicator.detail}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis Component */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-primary" />
                <CardTitle>AI Risk Insights</CardTitle>
              </div>
              <Button
                onClick={handleGenerateRealAI}
                disabled={isLoadingAi}
                size="sm"
                className="bg-blue-600"
              >
                <Sparkles size={14} className="mr-2" />{" "}
                {isLoadingAi ? "Menganalisis..." : "Live Alibaba AI"}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 leading-relaxed">
                  {liveAiAnalysis ||
                    rawDetail.ai_analysis ||
                    "Klik 'Live Alibaba AI' untuk analisis mendalam."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div>
          {/* Composite Score */}
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-base">Composite Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="relative w-32 h-32 mb-4 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={
                      detail.compositeScore >= 80
                        ? "#ef4444"
                        : detail.compositeScore >= 50
                          ? "#FF8C42"
                          : "#22c55e"
                    }
                    strokeWidth="8"
                    strokeDasharray={`${(detail.compositeScore / 100) * 283} 283`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p
                      className={`text-3xl font-bold ${detail.compositeScore >= 80 ? "text-red-500" : detail.compositeScore >= 50 ? "text-primary" : "text-green-500"}`}
                    >
                      {detail.compositeScore}
                    </p>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 w-full">
                <p className="text-sm text-muted-foreground mb-3">
                  Risk Assessment
                </p>
                <div
                  className={`border rounded-lg p-3 ${
                    detail.compositeScore >= 80
                      ? "bg-red-50 border-red-200"
                      : detail.compositeScore >= 50
                        ? "bg-orange-50 border-orange-200"
                        : "bg-green-50 border-green-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {detail.compositeScore >= 80 ? (
                      <AlertCircle size={14} className="text-red-600" />
                    ) : detail.compositeScore >= 50 ? (
                      <AlertCircle size={14} className="text-orange-600" />
                    ) : (
                      <CheckCircle2 size={14} className="text-green-600" />
                    )}
                    <p
                      className={`text-xs font-semibold ${
                        detail.compositeScore >= 80
                          ? "text-red-900"
                          : detail.compositeScore >= 50
                            ? "text-orange-900"
                            : "text-green-900"
                      }`}
                    >
                      {detail.compositeScore >= 80
                        ? "Critical Risk"
                        : detail.compositeScore >= 50
                          ? "High Risk"
                          : "Safe/Normal"}
                    </p>
                  </div>
                  <p
                    className={`text-xs ${
                      detail.compositeScore >= 80
                        ? "text-red-700"
                        : detail.compositeScore >= 50
                          ? "text-orange-700"
                          : "text-green-700"
                    }`}
                  >
                    {detail.compositeScore >= 80
                      ? "Immediate action required"
                      : detail.compositeScore >= 50
                        ? "Requires scheduled review"
                        : "No action needed"}
                  </p>
                </div>

                <Button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                  {detail.compositeScore >= 80
                    ? "Hold Settlement"
                    : "Schedule Review"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  Transactions (30D)
                </p>
                <p className="text-lg font-bold text-foreground">
                  {detail.stats.transactions.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Transaction</p>
                <p className="text-lg font-bold text-foreground">
                  {detail.stats.avgTxn}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Dispute Rate</p>
                <p
                  className={`text-lg font-bold ${detail.compositeScore >= 50 ? "text-red-600" : "text-green-600"}`}
                >
                  {detail.stats.disputeRate}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
