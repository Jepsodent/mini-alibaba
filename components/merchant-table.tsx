'use client'

import { useRouter } from 'next/navigation'
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
  merchants?: Merchant[] // Jadikan opsional agar bisa memakai data dummy jika kosong
}

// Tambahkan Dummy Data persis dengan interface di atas
const dummyMerchants: Merchant[] = [
  {
    id: 'm-1001',
    name: 'TechFlow Solutions',
    mccId: 'MID-882910',
    mcc: '5814',
    industry: 'SaaS / Software',
    riskScore: 85,
    settlementMcc: '5814 - SaaS',
    settlementStatus: 'Critical',
    chargebackRatio: '2.4%',
    chargebackStatus: 'Critical',
    statusIndicator: 'High',
    refundVelocity: '+45%',
    refundVelocityStatus: 'Critical',
    initials: 'TF',
    color: '#ef4444' // red
  },
  {
    id: 'm-1002',
    name: 'Wanderlust Travel Co.',
    mccId: 'MID-773821',
    mcc: '4722',
    industry: 'Travel Agency',
    riskScore: 65,
    settlementMcc: '4722 - Travel',
    settlementStatus: 'Warning',
    chargebackRatio: '1.2%',
    chargebackStatus: 'Hold',
    statusIndicator: 'Medium',
    refundVelocity: '+15%',
    refundVelocityStatus: 'High',
    initials: 'WT',
    color: '#f97316' // orange
  },
  {
    id: 'm-1003',
    name: 'GreenLife Organics',
    mccId: 'MID-992011',
    mcc: '5411',
    industry: 'Grocery',
    riskScore: 12,
    settlementMcc: '5411 - Grocery Stores',
    settlementStatus: 'Safe',
    chargebackRatio: '0.1%',
    chargebackStatus: 'Safe',
    statusIndicator: 'Low',
    refundVelocity: '+2%',
    refundVelocityStatus: 'Normal',
    initials: 'GL',
    color: '#22c55e' // green
  }
]

export default function MerchantTable({ merchants }: MerchantTableProps) {
  const router = useRouter()

  // Gunakan data dari props jika ada, jika kosong gunakan data dummy
  const displayData = merchants && merchants.length > 0 ? merchants : dummyMerchants

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
          {displayData.map((merchant) => (
            <tr 
              key={merchant.id} 
              className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer"
              onClick={() => {
                // 1. Simpan ID ke memory browser 
                localStorage.setItem('lastViewedMerchantId', merchant.id)
                // 2. Lempar ke halaman Analytics
                router.push('/analytics')
              }}
            >
              <td className="px-6 py-4">
                {/* Mengubah elemen <Link> menjadi <div> biasa untuk mencegah error di browser saat seluruh baris bisa diklik */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: merchant.color }}
                  >
                    {merchant.initials}
                  </div>
                  <div>
                    <p className="font-medium text-foreground hover:underline">{merchant.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">MID: {merchant.mccId}</p>
                  </div>
                </div>
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