import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import ReactQueryProvider from "@/providers/react-query-provider";
import { Toaster } from "sonner";
import { cookies } from "next/headers";
import AuthStoreProvider from "@/providers/auth-store-provider";
import { INITIAL_USER } from "@/constant/auth-constant";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aegis",
  description: "Monitor and manage merchant risk across your portfolio",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  const userCookie = cookieStore.get("user")?.value;
  const user = (() => {
    if (!userCookie) {
      return INITIAL_USER;
    }
    try {
      return JSON.parse(userCookie);
    } catch (error) {
      return INITIAL_USER;
    }
  })();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <AuthStoreProvider user={user}>
          <ReactQueryProvider>
            <div className="min-h-screen">{children}</div>
            <Analytics />
            <Toaster />
          </ReactQueryProvider>
        </AuthStoreProvider>
      </body>
    </html>
  );
}
