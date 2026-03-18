import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32 flex flex-col items-center justify-center">
      {/* Background Glow */}
      <div className="absolute top-0 -translate-y-12 isolate blur-3xl opacity-20 pointer-events-none">
        <div
          className="aspect-1155/678 w-288.75 bg-linear-to-tr from-primary to-chart-3"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="container mx-auto px-4 text-center z-10 flex flex-col items-center">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Zap className="mr-2 h-4 w-4" />
          <span className="font-medium">Built for Paylabs Integration</span>
        </div>

        <h1 className="max-w-4xl mx-auto text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Stop Chargebacks <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-chart-3">
            Before They Happen
          </span>
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Aegis provides real-time merchant risk management and AI-driven fraud
          prevention tailored for modern payment gateways.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 w-full sm:w-auto">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="h-12 px-8 text-base w-full">
              Start Protecting Revenue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/contact" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm w-full"
            >
              Book a Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
