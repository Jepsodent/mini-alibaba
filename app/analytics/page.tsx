'use client'

import { useEffect, useState } from 'react'
import MerchantDetail from '@/components/merchant-detail'
import { Store, ArrowRight, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AnalyticsPage() {
  const [lastViewedId, setLastViewedId] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Saat halaman dimuat, cek apakah ada histori merchant yang terakhir dibuka
    const savedId = localStorage.getItem('lastViewedMerchantId')
    if (savedId) {
      setLastViewedId(savedId)
    }
    setIsLoaded(true)
  }, [])

  // Tampilan loading singkat saat mengecek localStorage
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground animate-pulse">Memuat data analitik...</p>
      </div>
    )
  }

  // Tampilan JIKA BELUM ADA merchant yang dipilih sama sekali
  if (!lastViewedId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-4">
        <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-2 border border-border">
          <BarChart3 className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-3xl font-bold text-foreground">Belum ada Merchant yang Dianalisis</h2>
        <p className="text-muted-foreground max-w-md text-sm">
          Sistem belum mendeteksi merchant yang sedang Anda pantau. Silakan buka halaman Merchant Exposure dan pilih salah satu merchant untuk melihat analitik dan sinyal risiko detailnya.
        </p>
        <Link href="/exposure">
          <Button className="mt-4 bg-primary text-primary-foreground">
            Buka Halaman Exposure <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    )
  }

  // Tampilan JIKA SUDAH ADA merchant yang dipilih
  return (
    <div className="flex-1 w-full bg-background animate-in fade-in duration-500">
      <MerchantDetail merchantId={lastViewedId} />
    </div>
  )
}