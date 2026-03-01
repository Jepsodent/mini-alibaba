import os
import pandas as pd
from supabase import create_client, Client
# import xgboost as xgb # (Aktifkan ini kalau model.pkl kamu sudah siap)

# 1. Koneksi ke Supabase mengambil kunci dari brankas (Environment Variables)
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(url, key)

def main():
    print("🚀 Memulai AI Fraud Analyzer Worker...")

    try:
        # 2. Tarik data merchant dari Supabase
        print("📥 Mengambil data dari Supabase...")
        response = supabase.table("merchant_baselines").select("*").execute()
        merchants = response.data

        if not merchants:
            print("Tidak ada data merchant untuk dianalisis.")
            return

        # 3. Proses Analisis untuk setiap merchant
        for merchant in merchants:
            merchant_id = merchant['merchant_id']
            print(f"🔍 Menganalisis Merchant: {merchant['name']} (ID: {merchant_id})")

            # -- DI SINI KAMU MASUKKAN LOGIKA XGBOOST-MU NANTI --
            # Contoh: model = xgb.Booster(); model.load_model('model.pkl')
            # prediksi_risk = model.predict(...)
            
            # (Untuk sekarang, kita buat data dummy hasil prediksi agar UI-mu bisa jalan)
            dummy_cbr = 2.5
            dummy_risk_prob = 85.0
            dummy_analysis = f"AI mendeteksi anomali pada merchant {merchant['name']} berdasarkan lonjakan volume."
            dummy_action = "Hold Payout"

            # 4. Kirim hasil prediksi AI kembali ke tabel aegis_ai_features
            data_insert = {
                "merchant_id": merchant_id,
                "cbr_30d": dummy_cbr,
                "risk_prob": dummy_risk_prob,
                "ai_analysis": dummy_analysis,
                "current_action": dummy_action
            }

            print(f"📤 Menyimpan hasil AI untuk {merchant['name']} ke database...")
            # Upsert akan menimpa data lama jika merchant_id sudah ada
            supabase.table("aegis_ai_features").upsert(data_insert).execute()

        print("✅ Semua proses AI selesai dengan sukses!")

    except Exception as e:
        print(f"❌ Terjadi kesalahan: {e}")

if __name__ == "__main__":
    main()