'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

interface Merchant {
  id: string
  name: string
  mccId: string
  mcc: string
  industry: string
  riskScore: number
  settlementMcc: string
  settlementStatus: string
  chargebackRatio: string
  chargebackStatus: string
  statusIndicator: string
  refundVelocity: string
  refundVelocityStatus: string
  initials: string
  color: string
}

interface MerchantTableProps {
  merchants: Merchant[]
}

export default function MerchantTable({ merchants }: MerchantTableProps) {
  const getRiskScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-red-100 text-red-700'
    if (score >= 50) return 'bg-orange-100 text-orange-700'
    return 'bg-green-100 text-green-700'
  }

  const getStatusBadgeColor = (status: string) => {
    if (status === 'Critical') return 'bg-red-100 text-red-700'
    if (status === 'Warning') return 'bg-orange-100 text-orange-700'
    return 'bg-green-100 text-green-700'
  }

  const getRatioBadgeColor = (status: string) => {
    if (status === 'Critical') return 'bg-red-50 text-red-700'
    if (status === 'Hold') return 'bg-orange-50 text-orange-700'
    return 'bg-green-50 text-green-700'
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-6 py-3 text-left font-semibold text-foreground text-xs uppercase tracking-wider">Merchant Name</th>
            <th className="px-6 py-3 text-left font-semibold text-foreground text-xs uppercase tracking-wider">Industry (MCC)</th>
            <th className="px-6 py-3 text-left font-semibold text-foreground text-xs uppercase tracking-wider">Risk Score</th>
            <th className="px-6 py-3 text-left font-semibold text-foreground text-xs uppercase tracking-wider">Settlement (MCC)</th>
            <th className="px-6 py-3 text-left font-semibold text-foreground text-xs uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left font-semibold text-foreground text-xs uppercase tracking-wider">CB Rate (30D)</th>
            <th className="px-6 py-3 text-left font-semibold text-foreground text-xs uppercase tracking-wider">Refund Velocity</th>
          </tr>
        </thead>
        <tbody>
          {merchants.map((merchant) => (
            <tr 
              key={merchant.id} 
              className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer"
            >
              <td className="px-6 py-4">
                <Link href={`/merchant/${merchant.id}`} className="flex items-center gap-3 hover:underline">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: merchant.color }}
                  >
                    {merchant.initials}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{merchant.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">MID: {merchant.mccId}</p>
                  </div>
                </Link>
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="text-foreground font-medium">{merchant.industry}</p>
                  <p className="text-xs text-muted-foreground">MCC: {merchant.mcc}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded font-bold ${getRiskScoreBadgeColor(merchant.riskScore)}`}>
                  {merchant.riskScore}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-foreground">{merchant.settlementMcc}</div>
              </td>
              <td className="px-6 py-4">
                <Badge variant="secondary" className={`font-medium ${getStatusBadgeColor(merchant.settlementStatus)}`}>
                  {merchant.settlementStatus === 'Critical' && '✕ '}
                  {merchant.settlementStatus === 'Warning' && '⚠ '}
                  {merchant.settlementStatus === 'Safe' && '✓ '}
                  {merchant.settlementStatus}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <div className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getRatioBadgeColor(merchant.chargebackStatus)}`}>
                  {merchant.chargebackRatio}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-foreground font-medium">{merchant.refundVelocity}</div>
                <p className={`text-xs font-semibold ${
                  merchant.refundVelocityStatus === 'Critical' ? 'text-red-600' :
                  merchant.refundVelocityStatus === 'High' ? 'text-orange-600' :
                  'text-green-600'
                }`}>{merchant.refundVelocityStatus}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
