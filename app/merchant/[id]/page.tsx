import MerchantDetail from '@/components/merchant-detail'

export default function MerchantDetailPage({ params }: { params: { id: string } }) {
  return <MerchantDetail merchantId={params.id} />
}
