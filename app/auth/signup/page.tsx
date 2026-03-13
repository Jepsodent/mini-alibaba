import { SignUpForm } from "@/app/auth/_components/signup-form";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Aegis",
  description: "Create an Aegis account to protect your revenue",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex flex-row-reverse">
      {/* Right side: Form (Reversed layout for signup) */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 xl:w-5/12 bg-background">
        <div className="absolute top-8 right-8 lg:right-auto lg:left-8">
          <Link href="/" className="flex items-center gap-2 group">
            <ShieldCheck className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold tracking-tight">Aegis</span>
          </Link>
        </div>
        <div className="w-full max-w-md mx-auto py-12 mt-12 lg:mt-0">
          <SignUpForm />
        </div>
      </div>

      <div className="hidden lg:block relative flex-1 w-0">
        <div className="absolute inset-0 h-full w-full bg-muted/20 overflow-hidden border-r border-border/50">
          <div className="absolute inset-0 bg-linear-to-tr from-chart-3/20 via-background to-chart-4/20 opacity-80" />

          <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-175 h-175 bg-chart-3/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-125 h-125 bg-primary/10 rounded-full blur-[80px]" />

          <div className="absolute inset-0 flex flex-col justify-center items-center p-12 text-center">
            <div className="glass-panel p-8 rounded-2xl max-w-lg backdrop-blur-md bg-background/40 border border-white/10 shadow-2xl relative overflow-hidden group hover:bg-background/50 transition-colors">
              <div className="absolute top-0 left-0 w-2 h-full bg-chart-3"></div>
              <h2 className="text-3xl font-bold mb-4 tracking-tight">
                Join thousands of protected merchants.
              </h2>
              <div className="space-y-4 text-left mt-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    1
                  </div>
                  <p className="font-medium text-foreground">
                    Create your Aegis account
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                    2
                  </div>
                  <p className="text-muted-foreground">
                    Connect Paylabs instantly
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                    3
                  </div>
                  <p className="text-muted-foreground">
                    Prevent chargebacks automatically
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
