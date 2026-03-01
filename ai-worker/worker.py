import os
import joblib
import pandas as pd
import numpy as np
from datetime import datetime, timedelta, timezone
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path

# =========================
# 1. SETUP PATH & ENV (SMART & ROBUST)
# =========================
base_path = Path(__file__).parent
env_path = base_path.parent / ".env.local"

# Cek apakah file .env.local ada. 
# DI LOKAL: Akan memuat variabel.
# DI GITHUB: Akan dilewati saja tanpa memicu error merah.
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
    print(f"✅ Konfigurasi dimuat dari {env_path}")
else:
    print("☁️ Menjalankan di lingkungan Cloud/GitHub (Menggunakan Secrets)")

# Ambil variabel dengan logika fallback (OR)
SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY")

# Pastikan variabel sudah ada sebelum lanjut
if not SUPABASE_URL or not SUPABASE_KEY:
    print(f"❌ Error: Variabel Supabase tidak ditemukan!")
    exit(1) # Keluar dengan kode error hanya jika benar-benar tidak ada data sama sekali

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

NOW = datetime.now(timezone.utc)
cutoff_6h = NOW - timedelta(hours=6)
cutoff_24h = NOW - timedelta(hours=24)

# =========================
# 2. LOAD MODEL (Path yang Benar)
# =========================
# Sekarang Python akan mencari model.pkl tepat di folder yang sama dengan script ini
model_path = base_path / "model.pkl" 
print(f"🧠 Memuat Model AI dari: {model_path}")
model = joblib.load(model_path)

# =========================
# FETCH RAW TRANSACTIONS
# =========================
# ... (lanjutkan dengan kode bagian bawahmu dari raw_tx = supabase.table(...) )

# =========================
# FETCH RAW TRANSACTIONS
# =========================
# =========================
# FETCH RAW TRANSACTIONS (DENGAN ANTI-ERROR JARINGAN)
# =========================
try:
    print("📥 Mengambil data transaksi dari database...")
    raw_tx = supabase.table("raw_transactions").select("*").execute()
    df = pd.DataFrame(raw_tx.data)

    print("📥 Mengambil data baselines...")
    baselines_data = supabase.table("merchant_baselines").select("*").execute()
    baselines_df = pd.DataFrame(baselines_data.data)

except Exception as e:
    print(f"❌ Error Jaringan/Koneksi Supabase: {e}")
    print("💡 Tips: Coba jalankan ulang script. Ini hanya gangguan koneksi internet sementara.")
    exit()

if df.empty:
    print("No transactions found.")
    exit()

df['created_at'] = pd.to_datetime(df['created_at'])

# =========================
# PROCESS PER MERCHANT
# =========================
merchant_ids = df['merchant_id'].unique()

for merchant_id in merchant_ids:

    m_data = df[df['merchant_id'] == merchant_id]
    total_tx = len(m_data)

    if total_tx == 0:
        continue

    # -------------------------
    # BASELINES
    # -------------------------
    total_vol_30d = m_data['amount'].sum()
    avg_daily_vol = total_vol_30d / 30

    total_refunds = len(m_data[m_data['status'] == 'refund'])
    avg_refund_6h = total_refunds / (30 * 4)

    # Update baseline table
    supabase.table("merchant_baselines").upsert({
        "merchant_id": merchant_id,
        "avg_daily_vol": avg_daily_vol,
        "avg_refund_6h": avg_refund_6h,
        "last_updated": NOW.isoformat()
    }).execute()

    # -------------------------
    # LIVE FEATURES
    # -------------------------
    cb_count = len(m_data[m_data['status'] == 'chargeback'])
    cbr_30d = cb_count / total_tx

    data_6h = m_data[m_data['created_at'] >= cutoff_6h]
    refund_count_6h = len(data_6h[data_6h['status'] == 'refund'])

    refund_vel_6h = (
        refund_count_6h / avg_refund_6h
        if avg_refund_6h > 0 else 0.0
    )

    vol_24h = m_data[m_data['created_at'] >= cutoff_24h]['amount'].sum()
    vol_spike_24h = (
        vol_24h / avg_daily_vol
        if avg_daily_vol > 0 else 0.0
    )

    crc_index = (
        cb_count / total_refunds
        if total_refunds > 0 else 0.0
    )

    baseline_row = baselines_df[baselines_df["merchant_id"] == merchant_id]

    if not baseline_row.empty:
        mcc_risk_score = float(baseline_row["mcc_risk_weight"].values[0])
    else:
        mcc_risk_score = 0.003  # fallback default

    # -------------------------
    # PREDICT
    # -------------------------
    X_live = pd.DataFrame([{
        "CBR_30d": cbr_30d,
        "Refund_Velocity_6h": refund_vel_6h,
        "Volume_Spike_Ratio": vol_spike_24h,
        "MCC_Risk_Score": mcc_risk_score,  # bisa fetch dari baseline
        "CRC_Index": crc_index
    }])

    risk_prob = float(model.predict_proba(X_live)[0][1])
    risk_score = round(risk_prob * 100, 2)

    # -------------------------
    # SETTLEMENT HOLD LOGIC
    # -------------------------
    if risk_score <= 30:
        tier = "Low"
        hold_percent = 0

    elif risk_score <= 60:
        tier = "Medium"
        hold_percent = 10 + ((risk_score - 31) / 29) * 10

    elif risk_score <= 80:
        tier = "High"
        hold_percent = 21 + ((risk_score - 61) / 19) * 19

    else:
        tier = "Critical"
        hold_percent = 41 + ((risk_score - 81) / 19) * 29

    hold_percent = round(hold_percent, 2)

    # -------------------------
    # UPDATE AEGIS FEATURE
    # -------------------------
# -------------------------
    # UPDATE AEGIS FEATURE
    # -------------------------
    supabase.table("aegis_ai_features").upsert({
        "merchant_id": merchant_id,
        "cbr_30d": cbr_30d,
        "refund_vel_6h": refund_vel_6h,
        "vol_spike_24h": vol_spike_24h,
        "crc_index": crc_index,
        "risk_prob": risk_prob,
        "current_action": hold_percent,
        "updated_at": NOW.isoformat()
    }, on_conflict="merchant_id").execute() 

print("Risk engine job completed.")