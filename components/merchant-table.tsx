"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getRiskStatus } from "@/utils/risk-helper";

export interface MerchantBaseline {
  name: string;
  industry: string;
  merchant_id: string;
  avg_daily_vol: number;
  mcc_risk_weight: number;
}

export interface AegisMerchant {
  // id: string; // ID dari tabel aegis_ai_features
  risk_prob: number;
  cbr_30d: number;
  refund_vel_6h: number;
  merchant_baselines: MerchantBaseline;
  current_action?: string;
  ai_analysis?: string;
  updated_at?: string;
}

interface MerchantTableProps {
  merchants?: AegisMerchant[];
}

export default function MerchantTable({ merchants }: MerchantTableProps) {
  const router = useRouter();
  const colors = ["#f97316", "#22c55e", "#ef4444"];
  const getColorFromName = (name = "") => {
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Gunakan data dari props jika ada, jika kosong gunakan data dummy
  const displayData = merchants && merchants.length > 0 ? merchants : [];
  console.log(displayData);
  const getRatioBadgeColor = (data: number) => {
    if (data >= 80) return "bg-red-50 text-red-700";
    if (data >= 30) return "bg-orange-50 text-orange-700";
    return "bg-green-50 text-green-700";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-6 py-3 text-left font-semibold text-foreground text-xs uppercase tracking-wider">
              Merchant Name
            </th>
            <th className="px-6 py-3 text-left font-semibold text-foreground text-xs uppercase tracking-wider">
              Industry (MCC)
            </th>
            <th className="px-6 py-3 text-left font-semibold text-foreground text-xs uppercase tracking-wider">
              Risk Score
            </th>

            <th className="px-6 py-3 text-left font-semibold text-foreground text-xs uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left font-semibold text-foreground text-xs uppercase tracking-wider">
              CB Rate (30D)
            </th>
            <th className="px-6 py-3 text-left font-semibold text-foreground text-xs uppercase tracking-wider">
              Refund Velocity
            </th>
            <th className="px-6 py-3 text-left font-semibold text-foreground text-xs uppercase tracking-wider">
              Current Hold
            </th>
          </tr>
        </thead>
        <tbody>
          {displayData.map((merchant) => {
            const riskValue = merchant.risk_prob * 100;
            const risk = getRiskStatus(riskValue);
            console.log(merchant);
            return (
              <tr
                key={merchant.merchant_baselines.merchant_id}
                className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer"
                onClick={() => {
                  // 1. Simpan ID ke memory browser
                  localStorage.setItem(
                    "lastViewedMerchantId",
                    merchant.merchant_baselines.merchant_id,
                  );
                  // 2. Lempar ke halaman Analytics
                  router.push("/analytics");
                }}
              >
                <td className="px-6 py-4">
                  {/* Mengubah elemen <Link> menjadi <div> biasa untuk mencegah error di browser saat seluruh baris bisa diklik */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{
                        backgroundColor: getColorFromName(
                          merchant.merchant_baselines.name,
                        ),
                      }}
                    >
                      {merchant.merchant_baselines.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-foreground hover:underline">
                        {merchant.merchant_baselines.name}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        MID: {merchant.merchant_baselines.merchant_id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-foreground font-medium">
                      {merchant.merchant_baselines.industry}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded font-bold ${risk.color}`}
                  >
                    {riskValue.toFixed(0)} %
                  </div>
                </td>

                <td className="px-6 py-4">
                  <Badge
                    variant="secondary"
                    className={`font-medium ${risk.color}`}
                  >
                    {risk.label === "Critical" && "✕ "}
                    {risk.label === "Warning" && "⚠ "}
                    {risk.label === "Safe" && "✓ "}
                    {risk.label}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getRatioBadgeColor(merchant.cbr_30d * 100)}`}
                  >
                    {(merchant.cbr_30d * 100).toFixed(1)} %
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-foreground font-medium">
                    {merchant.refund_vel_6h} %
                  </div>
                  <p
                    className={`text-xs font-semibold ${
                      merchant.refund_vel_6h >= 50
                        ? "text-red-600"
                        : merchant.refund_vel_6h > 30
                          ? "text-orange-600"
                          : "text-green-600"
                    }`}
                  >
                    {merchant.refund_vel_6h >= 50
                      ? "Critical"
                      : merchant.refund_vel_6h > 30
                        ? "Warning"
                        : "Normal"}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="text-foreground font-medium">
                    {merchant.current_action}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
