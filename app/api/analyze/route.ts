import { NextResponse } from 'next/server';
import {GoogleGenAI} from '@google/genai'

export async function POST(request: Request) {
  try {
    // 1. Terima data dari frontend
    const body = await request.json();
    const { merchantName, riskScore, cbRate } = body;

    // 2. Ambil API Key dari .env.local
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key tidak ditemukan di server" }, { status: 500 });
    }

    // 3. Susun perintah (prompt) untuk AI Gemini
    const promptText = `Anda adalah sistem AI Anti-Fraud Paylabs. Analisis merchant berikut: 
    Nama: ${merchantName}
    Risk Score: ${riskScore}/100 
    Chargeback Rate: ${cbRate}
    
    Berikan analisis singkat maksimal 3 kalimat mengenai tingkat risiko merchant ini dan sebutkan 1 tindakan rekomendasi (misal: Tahan Dana, Pantau Ketat, atau Aman). Gunakan bahasa profesional yang cocok untuk dashboard analytics.`;

    const  ai = new GoogleGenAI({
    apiKey: process.env['GEMINI_API_KEY'],
    });
    const model = 'gemini-3.1-flash-lite'; 
    const contents = [ 
      {role: 'system', parts: [ {text: "You are a professional financial fraud analyst."}] }, 
      {role: 'user', parts: [ {text: promptText }] }
    ]
    const config = { temperature: 0.8 , topP: 0.95, maxOutputTokens:100}
  
    
    const response = await ai.models.generateContent({model,config,  contents})

    const data = await response.text

    if (data) {
      return NextResponse.json({ success: true, aiResponse: data });
    } else {
      console.error("Respon LLM aneh:", data);
      return NextResponse.json({ success: false, error: "Gagal membaca respon AI" }, { status: 500 });
    }

  } catch (error) {
    console.error("Error API:", error);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server" }, { status: 500 });
  }
}