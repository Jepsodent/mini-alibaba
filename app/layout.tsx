import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import ReactQueryProvider from "@/providers/react-query-provider";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aegis",
  description: "Monitor and manage merchant risk across your portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ReactQueryProvider>
          <div className="min-h-screen">{children}</div>
          <Analytics />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
