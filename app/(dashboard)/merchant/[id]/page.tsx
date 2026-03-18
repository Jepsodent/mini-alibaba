"use client";

import { useParams } from "next/navigation";
import MerchantDetail from "@/components/merchant-detail";

export default function MerchantPage() {
  const params = useParams();

  // Memastikan id terbaca dengan benar dari URL
  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : "";

  // Mencegah blank page saat URL sedang dimuat
  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <p className="text-muted-foreground animate-pulse">
          Loading merchant data...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-background">
      {/* PERBAIKAN: Ubah id={id} menjadi merchantId={id} agar klop dengan komponen aslimu */}
      <MerchantDetail merchantId={id} />
    </div>
  );
}
