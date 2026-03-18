import { Activity, Lock, ShieldCheck, Zap } from "lucide-react";

export default function Workflow() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            How Aegis Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Three simple steps to secure your payment ecosystem.
          </p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-px bg-border md:-translate-x-1/2 hidden sm:block" />
          <div className="space-y-16">
            {/* Step 1 */}
            <div className="relative flex flex-col md:flex-row items-center group">
              <div className="md:w-1/2 md:pr-16 md:text-right md:order-1 order-2 mt-6 md:mt-0 pl-20 w-full">
                <h3 className="text-2xl font-bold mb-3">
                  1. Connect Your Gateway
                </h3>
                <p className="text-muted-foreground text-lg">
                  Integrate Aegis with Paylabs or your preferred payment gateway
                  using our secure API in minutes.
                </p>
              </div>
              <div className="absolute left-0 top-0 md:top-1/2 md:left-1/2 w-16 h-16 rounded-full bg-background border-4 border-muted flex items-center justify-center md:-translate-x-1/2 md:-translate-y-1/2 z-10 group-hover:border-primary/50 transition-colors duration-300 shadow-sm">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div className="md:w-1/2 md:pl-16 md: order-3 w-full pl-20">
                <div className="h-40 rounded-2xl bg-muted/30 border border-border flex items-center justify-center text-muted-foreground shadow-sm group-hover:border-primary/30 transition-colors">
                  <span className="font-mono text-sm opacity-70">
                    API Syncing • • •
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col md:flex-row items-center group">
              <div className="md:w-1/2 md:pl-16 md:text-left md:order-3 order-2 mt-6 md:mt-0 pl-20 w-full">
                <h3 className="text-2xl font-bold mb-3">
                  2. Real-Time Monitoring
                </h3>
                <p className="text-muted-foreground text-lg">
                  Our AI engine instantly begins analyzing transactions,
                  assigning risk scores, and spotting anomalies.
                </p>
              </div>
              <div className="absolute left-0 top-0 md:top-1/2 md:left-1/2 w-16 h-16 rounded-full bg-background border-4 border-muted flex items-center justify-center md:-translate-x-1/2 md:-translate-y-1/2 z-10 group-hover:border-chart-3/50 transition-colors duration-300 shadow-sm">
                <Activity className="h-6 w-6 text-chart-3" />
              </div>
              <div className="md:w-1/2 md:pr-16 md:order-1 w-full pl-20">
                <div className="h-40 rounded-2xl bg-muted/30 border border-border flex flex-col gap-2 items-center justify-center text-muted-foreground shadow-sm group-hover:border-chart-3/30 transition-colors">
                  <div className="text-3xl font-bold text-foreground">15</div>
                  <span className="text-sm font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                    Low Risk
                  </span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col md:flex-row items-center group">
              <div className="md:w-1/2 md:pr-16 md:text-right md:order-1 order-2 mt-6 md:mt-0 pl-20 w-full">
                <h3 className="text-2xl font-bold mb-3">3. Auto-Prevent</h3>
                <p className="text-muted-foreground text-lg">
                  High-risk transactions automatically trigger reduced
                  settlement percentages, preventing full (100%) settlement and
                  minimizing potential manipulation.{" "}
                </p>
              </div>
              <div className="absolute left-0 top-0 md:top-1/2 md:left-1/2 w-16 h-16 rounded-full bg-background border-4 border-muted flex items-center justify-center md:-translate-x-1/2 md:-translate-y-1/2 z-10 group-hover:border-chart-4/50 transition-colors duration-300 shadow-sm">
                <Lock className="h-6 w-6 text-chart-4" />
              </div>
              <div className="md:w-1/2 md:pl-16 md:order-3 w-full pl-20">
                <div className="h-40 rounded-2xl bg-muted/30 border border-border flex items-center justify-center text-muted-foreground shadow-sm group-hover:border-chart-4/30 transition-colors">
                  <div className="flex items-center gap-2 text-red-500">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="font-medium">Chargeback Blocked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
