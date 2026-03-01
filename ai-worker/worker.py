import os
import pandas as pd
import joblib
from supabase import create_client, Client
from dotenv import load_dotenv

# 1. Load Environment Variables (untuk lokal)
load_dotenv()

def main():
    print("🚀 Memulai AI Fraud Analyzer Worker dengan Model Asli...")

    # 2. Koneksi ke Supabase
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_SERVICE_KEY")
    
    if not url or not key:
        print("❌ Error: SUPABASE_URL atau SUPABASE_SERVICE_KEY tidak ditemukan!")
        return

    supabase: Client = create_client(url, key)

    try:
        # 3. Load Model AI Asli (aegis_ai_engine.pkl)
        print("🧠 Memuat Model AI XGBoost...")
        model_path = os.path.join(os.path.dirname(__file__), 'aegis_ai_engine.pkl')
        model = joblib.load(model_path)

        # 4. Tarik data merchant dari Supabase
        print("📥 Mengambil data dari Supabase...")
        response = supabase.table("merchant_baselines").select("*").execute()
        merchants = response.data

        if not merchants:
            print("ℹ️ Tidak ada data merchant untuk dianalisis.")
            return

        # Konversi ke DataFrame untuk diproses AI
        df = pd.DataFrame(merchants)

        print(f"📊 Menganalisis {len(df)} merchant...")

        # 5. Proses Prediksi dengan Model
        # Catatan: Pastikan kolom di df sesuai dengan yang diharapkan model (misal: volume, chargeback_rate, dll)
        # Di sini kita ambil fitur yang diperlukan (contoh saja, sesuaikan dengan fitur modelmu)
        features = df[['avg_daily_vol', 'avg_ticket_size', 'chargeback_rate']] 
        
        # Prediksi Probabilitas Fraud
        # model.predict_proba biasanya mengembalikan [aman, fraud]
        predictions_proba = model.predict_proba(features)[:, 1] 

        results_to_save = []

        for i, row in df.iterrows():
            risk_score = float(predictions_proba[i] * 100) # Ubah ke skala 0-100
            
            # Tentukan status berdasarkan skor
            status = "Low Risk"
            action = "Monitor"
            if risk_score > 80:
                status = "High Risk"
                action = "Hold Payout"
            elif risk_score > 50:
                status = "Medium Risk"
                action = "Review Manually"

            results_to_save.append({
                "merchant_id": row['merchant_id'],
                "risk_score": risk_score,
                "risk_status": status,
                "recommended_action": action,
                "last_analysis": "now()" # Supabase akan mengisi waktu otomatis
            })

        # 6. Simpan/Update Hasil ke Tabel AI Features
        print("📤 Menyimpan hasil prediksi ke Supabase...")
        supabase.table("aegis_ai_features").upsert(results_to_save).execute()

        print("✅ Semua proses AI selesai dengan sukses!")

    except Exception as e:
        print(f"❌ Terjadi kesalahan: {str(e)}")

if __name__ == "__main__":
    main()