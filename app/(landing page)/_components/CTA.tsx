import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-24 overflow-hidden relative border-t border-border/40">
      <div className="absolute inset-0 bg-primary/5 -z-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto rounded-3xl bg-primary text-primary-foreground p-10 md:p-16 text-center shadow-xl overflow-hidden relative border border-primary/20">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-black/10 blur-3xl pointer-events-none"></div>

          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 relative z-10 tracking-tight">
            Ready to secure your revenue?
          </h2>
          <p className="text-primary-foreground/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto relative z-10 font-medium">
            Join modern businesses integrating with Aegis to prevent chargebacks
            and manage risk effectively.
          </p>
          <Link href="/dashboard" className="relative z-10 inline-block">
            <Button
              size="lg"
              variant="secondary"
              className="h-14 px-10 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              Start Protecting Revenue Today
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
