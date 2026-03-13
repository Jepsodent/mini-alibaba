import Link from "next/link";
import { Button } from "@/components/ui/button";

import { ShieldCheck, Activity, Zap, Lock } from "lucide-react";
import Navbar from "./_components/Navbar";
import Hero from "./_components/Hero";
import Feature from "./_components/Feature";
import Workflow from "./_components/Workflow";
import CTA from "./_components/CTA";
import Footer from "./_components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      {/* Navbar */}
      <Navbar />

      <main className="flex-1">
        <Hero />
        {/* CONTENT */}
        {/* Features Section */}
        <Feature />
        {/* How it Works */}
        <Workflow />

        {/* CTA Section */}
        <CTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
