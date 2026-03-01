import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Terima data dari frontend
    const body = await request.json();
    const { merchantName, riskScore, cbRate } = body;

    // 2. Ambil API Key dari .env.local
    const apiKey = process.env.ALIBABA_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key tidak ditemukan di server" }, { status: 500 });
    }

    // 3. Susun perintah (prompt) untuk AI Qwen Alibaba
    const promptText = `Anda adalah sistem AI Anti-Fraud Paylabs. Analisis merchant berikut: 
    Nama: ${merchantName}
    Risk Score: ${riskScore}/100 
    Chargeback Rate: ${cbRate}
    
    Berikan analisis singkat maksimal 3 kalimat mengenai tingkat risiko merchant ini dan sebutkan 1 tindakan rekomendasi (misal: Tahan Dana, Pantau Ketat, atau Aman). Gunakan bahasa profesional yang cocok untuk dashboard analytics.`;

    // 4. Panggil API Alibaba DashScope (Model Qwen)
    const response = await fetch('https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "qwen-turbo", // Model AI yang cepat dan cerdas
        input: {
          messages: [
            { role: "system", content: "You are a professional financial fraud analyst." },
            { role: "user", content: promptText }
          ]
        },
        parameters: {
          result_format: "message"
        }
      })
    });

    const data = await response.json();

    // 5. Cek jika berhasil
    if (data.output && data.output.choices && data.output.choices[0]) {
      const aiMessage = data.output.choices[0].message.content;
      return NextResponse.json({ success: true, aiResponse: aiMessage });
    } else {
      console.error("Respon Alibaba aneh:", data);
      return NextResponse.json({ success: false, error: "Gagal membaca respon AI" }, { status: 500 });
    }

  } catch (error) {
    console.error("Error API:", error);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server" }, { status: 500 });
  }
}