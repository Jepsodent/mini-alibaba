import os
import joblib
import pandas as pd
import numpy as np
from datetime import datetime, timedelta, timezone
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path

print("Test")
base_path = Path(__file__).resolve().parent
env_path = base_path / ".env.local"

if env_path.exists():
    load_dotenv(env_path)
    print("✅ Lokal: Memuat konfigurasi dari .env.local")
else:
    print("🚀 Production Mode: Menggunakan GitHub Secrets")

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: Variabel Supabase tidak ditemukan!")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

NOW = datetime.now(timezone.utc)
cutoff_6h = NOW - timedelta(hours=6)
# Jendela demo 24 jam untuk mengatasi zona waktu saat inject manual
cutoff_demo = NOW - timedelta(hours=24) 

model_path = base_path / "model.pkl" 
print(f"🧠 Memuat Model AI dari: {model_path}")
model = joblib.load(model_path)

try:
    print("📥 Mengambil data transaksi dari database...")
    raw_tx = supabase.table("raw_transactions").select("*").execute()
    df = pd.DataFrame(raw_tx.data)

    print("📥 Mengambil data baselines...")
    baselines_data = supabase.table("merchant_baselines").select("*").execute()
    baselines_df = pd.DataFrame(baselines_data.data)

except Exception as e:
    print(f"❌ Error Jaringan/Koneksi Supabase: {e}")
    exit()

if df.empty:
    print("No transactions found.")
    exit()

# PASTIKAN SEMUA WAKTU MENJADI UTC
df['created_at'] = pd.to_datetime(df['created_at'], utc=True)

# ==========================================
# DEMO MODE FILTER
# ==========================================
print(f"🔍 Mencari data DEMO setelah: {cutoff_demo}")
data_live_global = df[df['created_at'] >= cutoff_demo]
print(f"📊 Ditemukan {len(data_live_global)} transaksi dalam jendela demo 24 jam.")

if data_live_global.empty:
    print("⚠️ Peringatan: Tidak ada data dalam 24 jam terakhir. Menggunakan semua data sebagai fallback!")
    data_live_global = df 

# ==========================================
# PROCESS PER MERCHANT
# ==========================================
merchant_ids = df['merchant_id'].unique()

for merchant_id in merchant_ids:
    m_data = df[df['merchant_id'] == merchant_id]
    total_tx = len(m_data)

    if total_tx == 0:
        continue
    
    # --- BASELINES ---
    total_vol_30d = m_data['amount'].sum()
    avg_daily_vol = total_vol_30d / 30 if total_vol_30d > 0 else 1.0

    total_refunds = len(m_data[m_data['status'].isin(['refund', 'refunded'])])
    avg_refund_6h = total_refunds / (30 * 4) if total_refunds > 0 else 0.1

    supabase.table("merchant_baselines").upsert({
        "merchant_id": merchant_id,
        "avg_daily_vol": float(avg_daily_vol),
        "avg_refund_6h": float(avg_refund_6h),
        "last_updated": NOW.isoformat()
    }, on_conflict="merchant_id").execute()

    # --- LIVE FEATURES (Menggunakan Data Demo) ---
    cb_count = len(m_data[m_data['status'] == 'chargeback'])
    cbr_30d = cb_count / total_tx

    # Gunakan data_live_global khusus merchant ini
    data_demo_window = data_live_global[data_live_global['merchant_id'] == merchant_id]
    
    # Tahan typo: cari 'refund' atau 'refunded'
    refund_count_6h = len(data_demo_window[data_demo_window['status'].isin(['refund', 'refunded'])])

    refund_vel_6h = (refund_count_6h / avg_refund_6h) if avg_refund_6h > 0 else 0.0

    vol_24h = data_demo_window['amount'].sum()
    vol_spike_24h = (vol_24h / avg_daily_vol) if avg_daily_vol > 0 else 0.0

    crc_index = (cb_count / total_refunds) if total_refunds > 0 else 0.0

    baseline_row = baselines_df[baselines_df["merchant_id"] == merchant_id]
    mcc_risk_score = float(baseline_row["mcc_risk_weight"].values[0]) if not baseline_row.empty else 0.003

    # --- PREDICT ---
    X_live = pd.DataFrame([{
        "CBR_30d": cbr_30d,
        "Refund_Velocity_6h": refund_vel_6h,
        "Volume_Spike_Ratio": vol_spike_24h,
        "MCC_Risk_Score": mcc_risk_score,
        "CRC_Index": crc_index
    }])

    risk_prob = float(model.predict_proba(X_live)[0][1])
    risk_score = round(risk_prob * 100, 2)

    # --- SETTLEMENT HOLD LOGIC ---
    if risk_score <= 30: tier, hold_percent = "Low", 0
    elif risk_score <= 60: tier, hold_percent = "Medium", 10 + ((risk_score - 31) / 29) * 10
    elif risk_score <= 80: tier, hold_percent = "High", 21 + ((risk_score - 61) / 19) * 19
    else: tier, hold_percent = "Critical", 41 + ((risk_score - 81) / 19) * 29

    hold_percent = round(hold_percent, 2)
    print(f"Merchant {merchant_id[:5]}... | Score: {risk_score} | Hold: {hold_percent}%")

    # --- UPDATE AEGIS FEATURE ---
    try:
        supabase.table("aegis_ai_features").upsert({
            "merchant_id": merchant_id,
            "cbr_30d": cbr_30d,
            "refund_vel_6h": refund_vel_6h,
            "vol_spike_24h": vol_spike_24h,
            "crc_index": crc_index,
            "risk_prob": risk_prob,
            "current_action": f"{hold_percent}",
            "updated_at": NOW.isoformat()
        }, on_conflict="merchant_id").execute() 
    except Exception as e:
        print(f"❌ Gagal update Supabase untuk {merchant_id}: {e}")

print("✅ Risk engine job completed.")