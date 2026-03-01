  'use client'

  import { Search, Plus, ArrowUpDown } from 'lucide-react'
  import Link from 'next/link'
  import mockData from '@/lib/mock-data.json'
  import { Button } from '@/components/ui/button'
  import { Card } from '@/components/ui/card'
  import { Badge } from '@/components/ui/badge'
  import MerchantTable from './merchant-table'

  export default function MerchantExposure() {
    const { merchants, portfolioStats } = mockData

    return (
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Merchant Risk Management</h1>
            <p className="text-muted-foreground">Monitor exposure and prevent chargebacks across your portfolio.</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus size={16} className="mr-2" />
            Onboard Merchant
          </Button>
        </div>

        {/* Controls */}
        <Card className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-64 relative">
              <Search size={18} className="absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by Merchant Name or MID..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Risk Status:</span>
                <button className="text-sm px-3 py-2 border border-border rounded-lg hover:bg-muted text-foreground flex items-center gap-2">
                  All
                  <ArrowUpDown size={12} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Industry:</span>
                <button className="text-sm px-3 py-2 border border-border rounded-lg hover:bg-muted text-foreground flex items-center gap-2">
                  All
                  <ArrowUpDown size={12} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort:</span>
                <button className="text-sm px-3 py-2 border border-border rounded-lg hover:bg-muted text-foreground flex items-center gap-2">
                  Highest Chargeback Ratio
                  <ArrowUpDown size={12} />
                </button>
              </div>
            </div>
          </div>
        </Card>
        {/* Table */}
        <Card className="overflow-hidden">
          <MerchantTable merchants={merchants} />
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing 1 to 6 of 24 results</p>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 text-muted-foreground hover:text-foreground disabled:opacity-50">
              &lt;
            </button>
            <button className="px-3 py-1 bg-primary text-primary-foreground rounded">1</button>
            <button className="px-3 py-1 text-muted-foreground hover:text-foreground">2</button>
            <button className="px-3 py-1 text-muted-foreground hover:text-foreground">3</button>
            <button className="px-2 py-1 text-muted-foreground hover:text-foreground">&gt;</button>
          </div>
        </div>
      </div>
    )
  }

  import { AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react'
