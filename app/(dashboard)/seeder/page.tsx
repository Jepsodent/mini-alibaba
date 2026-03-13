'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2, DatabaseZap, Store, Building2, Receipt } from 'lucide-react'

interface Merchant {
  merchant_id: string
  name: string
  industry: string
}

interface Transaction {
  id: string
  merchant_id: string
  amount: number
  status: string
  created_at?: string 
}

export default function SeederPage() {
  const [merchantId, setMerchantId] = useState('')
  const [loading, setLoading] = useState(false)
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [fetchingMerchants, setFetchingMerchants] = useState(true)
  
  // 🔥 NEW STATE: Holds the transactions we JUST injected!
  const [injectedData, setInjectedData] = useState<Transaction[]>([])

  const supabase = createClient()

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const { data, error } = await supabase
          .from('merchant_baselines')
          .select('merchant_id, name, industry')
          .order('name', { ascending: true })
        
        if (error) throw error
        if (data) setMerchants(data)
      } catch (err: any) {
        console.error("Failed to fetch merchants:", err)
        toast.error("Could not load the merchant list.")
      } finally {
        setFetchingMerchants(false)
      }
    }
    fetchMerchants()
  }, [])

  const handleInjectData = async () => {
    if (!merchantId) {
      toast.error("Bro, select a Merchant first!")
      return
    }

    setLoading(true)
    setInjectedData([]) // Clear the old logs when starting a new injection
    
    try {
      const statuses = ['refund', 'chargeback'] // Forcing the anomaly as requested!
      
      const newTransactions = Array.from({ length: 10 }).map(() => {
        // Keeping amounts normal (Rp 50k to 5M)
        const randomAmount = Math.floor(Math.random() * (5000000 - 50000 + 1)) + 50000
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

        return {
          id: crypto.randomUUID(), // Like your Python uuid.uuid4()!
          merchant_id: merchantId,
          amount: randomAmount,
          status: randomStatus,
          // created_at is omitted so it defaults to NULL
        }
      })

      // 🔥 THE SAFE INSERT WITH .select() TO GET THE DATA BACK!
      const { data: returnedData, error: insertError } = await supabase
        .from('raw_transactions')
        .insert(newTransactions)
        .select() // This tells Supabase to return the rows it just created!

      if (insertError) throw insertError

      if (returnedData) {
        setInjectedData(returnedData) // Save to state to display on UI
      }

      toast.success(`BOOM! 10 sketchy transactions permanently injected for ${merchantId}!`)
    } catch (err: any) {
      console.error("Injection failed:", err)
      toast.error(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to format Rupiah
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
      
      {/* LEFT COLUMN: MERCHANTS (Spans 4 columns) */}
      <Card className="shadow-md md:col-span-4 h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="text-primary" />
            Targets
          </CardTitle>
          <CardDescription>Select a merchant to sabotage.</CardDescription>
        </CardHeader>
        <CardContent>
          {fetchingMerchants ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
            </div>
          ) : (
            <ScrollArea className="h-[500px] rounded-md border p-4">
              <div className="space-y-3">
                {merchants.map((merchant: Merchant) => (
                  <div 
                    key={merchant.merchant_id}
                    onClick={() => setMerchantId(merchant.merchant_id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:border-orange-500 hover:bg-orange-500/10 ${
                      merchantId === merchant.merchant_id ? 'border-orange-500 bg-orange-500/20' : 'border-border'
                    }`}
                  >
                    <div className="font-semibold">{merchant.name}</div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Building2 className="w-3 h-3 mr-1" />
                      {merchant.industry}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* RIGHT COLUMN: INJECTOR & LOGS (Spans 8 columns) */}
      <div className="md:col-span-8 space-y-6">
        <Card className="border-destructive/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <DatabaseZap className="text-orange-500" />
              Transaction Injector
            </CardTitle>
            <CardDescription>
              Permanently forces 10 anomalous transactions (Refunds/Chargebacks) into raw_transactions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Target Merchant ID</label>
              <Input 
                readOnly
                placeholder="Click a merchant on the left..." 
                value={merchantId}
                className="font-mono bg-muted/50"
              />
            </div>
            
            <Button 
              onClick={handleInjectData} 
              disabled={loading || !merchantId}
              className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg transition-all"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> EXECUTING INJECTION...</>
              ) : (
                'SABOTAGE MERCHANT (INJECT 10 TX)'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* 🔥 NEW UI: THE LIVE INJECTION LOGS */}
        {injectedData.length > 0 && (
          <Card className="border-green-500/50 shadow-md bg-green-500/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-green-600">
                <Receipt className="w-5 h-5" />
                Successfully Injected Data Log
              </CardTitle>
              <CardDescription>
                These 10 transactions are now permanently in the database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[250px] rounded-md border bg-background p-4">
                <div className="space-y-2">
                  {injectedData.map((tx: Transaction, idx: number) => (
                    <div key={tx.id || idx} className="flex items-center justify-between p-3 border rounded-md text-sm">
                      <div className="flex flex-col gap-1 font-mono">
                        <span className="text-xs text-muted-foreground">ID: {tx.id.split('-')[0]}...</span>
                        <span className="font-semibold">{formatIDR(tx.amount)}</span>
                      </div>
                      <Badge variant={tx.status === 'chargeback' ? 'destructive' : 'secondary'} className="uppercase">
                        {tx.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
      
    </div>
  )
}