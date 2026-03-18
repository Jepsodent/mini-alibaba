import { LoginForm } from "@/app/auth/_components/login-form";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Aegis",
  description: "Login to your Aegis merchant dashboard",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 ">
        <div className="absolute top-8 left-8">
          <Link href="/" className="flex items-center gap-2 group">
            <ShieldCheck className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold tracking-tight">Aegis</span>
          </Link>
        </div>
        <div className="w-full">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
