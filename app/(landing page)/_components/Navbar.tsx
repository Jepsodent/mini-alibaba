"use client";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/use-logout";
import { useAuthStore } from "@/stores/auth-store";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const user = useAuthStore((state) => state.User);
  const handleLogout = useLogout();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight">Aegis</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            How it works
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {user.id ? (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-sm"
            >
              Log out
            </Button>
          ) : (
            <Link href="/auth/login" className="hidden sm:block">
              <Button variant="outline" className="text-sm">
                Log in
              </Button>
            </Link>
          )}

          <Link href="/dashboard">
            <Button size="sm" className="hidden sm:flex">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
