"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// PERBAIKAN 1: Import StatCard sebagai default import (tanpa kurung kurawal)
import StatCard from "@/components/stat-card" 
import AlertsTable  from "@/components/alerts-table"
import { Activity, AlertTriangle, TrendingUp, ShieldAlert } from "lucide-react"
import mockData from "@/lib/mock-data.json"
export default function AnalyticsPage() {
  const alertsData = mockData.recentAlerts || []
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Predictive Chargeback Intelligence</h2>
      </div>

      {/* PERBAIKAN 2: Sesuaikan props dengan interface StatCard kamu */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Exposure Risk" 
          value="$1.24M" 
          change="+14%" 
          icon={AlertTriangle} 
          color="text-red-500" 
        />
        <StatCard 
          title="Predicted CB Surge" 
          value="12 Merchants" 
          change="+3" 
          icon={TrendingUp} 
          color="text-orange-500" 
        />
        <StatCard 
          title="Refund-to-CB Conversion" 
          value="18.4%" 
          change="-2.1%" 
          icon={Activity} 
          color="text-blue-500" 
        />
        <StatCard 
          title="Settlement Auto-Adjusted" 
          value="$450K" 
          change="+12%" 
          icon={ShieldAlert} 
          color="text-green-500" 
        />
      </div>

      {/* Main Content Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        
        {/* Panel Sinyal Prediksi */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>AI-Driven Risk Signals</CardTitle>
            <CardDescription>
              Early warnings detected from refund anomalies and transaction patterns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {/* Signal 1 */}
               <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900">
                 <div>
                   <h4 className="font-semibold text-red-700 dark:text-red-400">Critical: First-Party Fraud Surge</h4>
                   <p className="text-sm text-muted-foreground mt-1">SaaS vertical showing identical &quot;Forgotten Trial&quot; patterns across 3 merchants.</p>
                 </div>
                 <div className="text-right">
                    <span className="block font-bold text-red-600 text-lg">-$125,000</span>
                    <span className="text-xs text-red-500">Est. Exposure</span>
                 </div>
               </div>
               
               {/* Signal 2 */}
               <div className="flex items-center justify-between p-4 border rounded-lg bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-900">
                 <div>
                   <h4 className="font-semibold text-orange-700 dark:text-orange-400">Warning: Refund Spike &gt; 300%</h4>
                   <p className="text-sm text-muted-foreground mt-1">Travel Merchant ID #8922 refund deviation. High CB probability in 14-21 days.</p>
                 </div>
                 <div className="text-right">
                    <span className="block font-bold text-orange-600 text-lg">-$42,500</span>
                    <span className="text-xs text-orange-500">Est. Exposure</span>
                 </div>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabel Alerts */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Actionable Alerts</CardTitle>
            <CardDescription>Dynamic settlement controls triggered.</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertsTable  alerts={alertsData}/>
          </CardContent>
        </Card>
        
      </div>
    </div>
  )
}