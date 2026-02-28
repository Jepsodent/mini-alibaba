'use client'

import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import mockData from '@/lib/mock-data.json'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface MerchantDetailProps {
  merchantId: string
}

// Fungsi untuk men-generate data dinamis berdasarkan ID yang diklik
const getDynamicDetail = (id: string) => {
  // 1. Cari data merchant dari list tabel (jika ada)
  const baseMerchant = mockData.merchants?.find((m: any) => m.id === id)
  
  // 2. Ambil referensi detail dari mockData (kalau ada struktur bawaannya)
  const fallbackDetail = mockData.merchantDetail

  // 3. Buat angka & status dinamis
  const riskScore = baseMerchant?.riskScore || Math.floor(Math.random() * 40) + 40
  const isCritical = riskScore >= 80
  const isElevated = riskScore >= 50 && riskScore < 80
  const cbRatio = baseMerchant?.chargebackRatio || (riskScore / 10).toFixed(1) + '%'
  const refundStatus = baseMerchant?.refundVelocityStatus || (isCritical ? 'Critical' : 'Normal')
  const refundValue = baseMerchant?.refundVelocity || (isCritical ? '+45%' : '+12%')

  return {
    id: id,
    name: baseMerchant?.name || `Merchant Dynamic ${id.split('-')[1] || id}`,
    mcc: baseMerchant?.mcc || fallbackDetail?.mcc || '5814',
    dateAdded: fallbackDetail?.dateAdded || 'Oct 12, 2025',
    interventionNeeded: isCritical,
    interventionReason: isCritical ? 'Critical CB Ratio' : 'Elevated Risk',
    compositeScore: riskScore,
    riskIndicators: [
      {
        label: "Refund Spike",
        status: refundStatus,
        value: refundValue, // Contoh: +45%
        detail: "Compared to previous 7 days"
      },
      {
        label: "Chargeback Rate",
        status: isCritical ? 'Critical' : isElevated ? 'Elevated' : 'Normal',
        value: cbRatio, // Contoh: 2.4%
        detail: "Last 30 days rolling average"
      },
      {
        label: "Txn Volatility", // Saya perbaiki typo menjadi Volatility
        status: isCritical ? "Elevated" : "Normal",
        value: isCritical ? "High (42%)" : "Low (8%)",
        detail: "Daily volume variance"
      },
      {
        label: "Growth Rate",
        status: isCritical ? "Critical" : "Normal",
        value: isCritical ? "+315%" : "+14%", // Pertumbuhan drastis tiba-tiba = sinyal bahaya
        detail: "Month-over-month growth"
      }
    ],
    aiAnalysis: {
      title: isCritical ? "High Risk Alert" : fallbackDetail?.aiAnalysis?.title || "Risk Pattern Detected",
      alert: isCritical 
        ? "High probability of chargeback surge detected in the next 7-14 days based on refund velocity." 
        : fallbackDetail?.aiAnalysis?.alert || "Elevated friendly fraud probability detected based on recent refund patterns.",
      pattern: isCritical
        ? "Identical rapid transactions followed by immediate refunds."
        : fallbackDetail?.aiAnalysis?.pattern || "Multiple identical value transactions from similar BIN ranges.",
      mccCodes: [baseMerchant?.mcc || '5814', '5999'],
      confidence: isCritical ? '94%' : fallbackDetail?.aiAnalysis?.confidence || '87%',
      action: isCritical ? 'Hold Settlement' : fallbackDetail?.aiAnalysis?.action || 'Review Transactions'
    },
    stats: {
      transactions: Math.floor(Math.random() * 4000) + 1000,
      avgTxn: `$${(Math.random() * 200 + 50).toFixed(2)}`,
      disputeRate: cbRatio
    }
  }
}
export default function MerchantDetail({ merchantId }: MerchantDetailProps) {
  // Menggunakan data yang sudah dinamis berdasarkan merchantId
  const detail = getDynamicDetail(merchantId)

  const getIndicatorColor = (status: string) => {
    if (status === 'Critical') return 'bg-red-100 text-red-700'
    if (status === 'Elevated') return 'bg-orange-100 text-orange-700'
    if (status === 'High') return 'bg-orange-100 text-orange-700'
    return 'bg-green-100 text-green-700'
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/exposure">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-foreground">{detail.name}</h1>
              {detail.interventionNeeded && (
                <Badge variant="destructive" className="text-xs">
                  {detail.interventionReason}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              MCC: {detail.mcc} • Onboarded: {detail.dateAdded}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Hold Funds</Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">View Transactions</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Risk Indicators */}
        <div className="col-span-2 space-y-6">
          {/* Risk Indicator Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Indicator Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {detail.riskIndicators.map((indicator, idx) => (
                  <div key={idx} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-foreground">{indicator.label}</p>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${getIndicatorColor(indicator.status)}`}>
                        {indicator.status}
                      </span>
                    </div>
                    <div className="mb-2">
                      <p className="text-2xl font-bold text-foreground">{indicator.value}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{indicator.detail}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <AlertCircle size={16} className="text-primary" />
                </div>
                <CardTitle>{detail.aiAnalysis.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-900 font-medium mb-2">Alert</p>
                <p className="text-sm text-orange-800">{detail.aiAnalysis.alert}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Pattern Analysis</p>
                <p className="text-sm text-muted-foreground">{detail.aiAnalysis.pattern}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">MCC Codes Identified</p>
                  <p className="text-sm font-medium text-foreground">{detail.aiAnalysis.mccCodes[0]}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Confidence Score</p>
                  <p className="text-sm font-medium text-foreground">{detail.aiAnalysis.confidence}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Recommended Action</p>
                  <button className="text-sm text-primary font-medium hover:underline">
                    {detail.aiAnalysis.action}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Composite Score */}
        <div>
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
                    stroke={detail.compositeScore >= 80 ? '#ef4444' : detail.compositeScore >= 50 ? '#FF8C42' : '#22c55e'}
                    strokeWidth="8"
                    strokeDasharray={`${(detail.compositeScore / 100) * 283} 283`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className={`text-3xl font-bold ${detail.compositeScore >= 80 ? 'text-red-500' : detail.compositeScore >= 50 ? 'text-primary' : 'text-green-500'}`}>
                      {detail.compositeScore}
                    </p>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 w-full">
                <p className="text-sm text-muted-foreground mb-3">Risk Assessment</p>
                
                <div className={`border rounded-lg p-3 ${
                  detail.compositeScore >= 80 ? 'bg-red-50 border-red-200' : 
                  detail.compositeScore >= 50 ? 'bg-orange-50 border-orange-200' : 
                  'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    {detail.compositeScore >= 80 ? (
                      <AlertCircle size={14} className="text-red-600" />
                    ) : detail.compositeScore >= 50 ? (
                      <AlertCircle size={14} className="text-orange-600" />
                    ) : (
                      <CheckCircle2 size={14} className="text-green-600" />
                    )}
                    <p className={`text-xs font-semibold ${
                      detail.compositeScore >= 80 ? 'text-red-900' : 
                      detail.compositeScore >= 50 ? 'text-orange-900' : 
                      'text-green-900'
                    }`}>
                      {detail.compositeScore >= 80 ? 'Critical Risk' : detail.compositeScore >= 50 ? 'High Risk' : 'Safe/Normal'}
                    </p>
                  </div>
                  <p className={`text-xs ${
                    detail.compositeScore >= 80 ? 'text-red-700' : 
                    detail.compositeScore >= 50 ? 'text-orange-700' : 
                    'text-green-700'
                  }`}>
                    {detail.compositeScore >= 80 ? 'Immediate action required' : detail.compositeScore >= 50 ? 'Requires scheduled review' : 'No action needed'}
                  </p>
                </div>

                <Button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                  {detail.compositeScore >= 80 ? 'Hold Settlement' : 'Schedule Review'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Transactions (30D)</p>
                <p className="text-lg font-bold text-foreground">{detail.stats.transactions.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Transaction</p>
                <p className="text-lg font-bold text-foreground">{detail.stats.avgTxn}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Dispute Rate</p>
                <p className={`text-lg font-bold ${detail.compositeScore >= 50 ? 'text-red-600' : 'text-green-600'}`}>
                  {detail.stats.disputeRate}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}