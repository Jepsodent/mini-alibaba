import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, BarChart3, Globe } from "lucide-react";

export default function Feature() {
  return (
    <section
      id="features"
      className="py-24 bg-muted/30 border-y border-border/50"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything you need to manage risk
          </h2>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Powerful tools designed specifically to protect your merchant
            portfolio from fraud and chargebacks.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <Card className="bg-background/60 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors duration-300 shadow-sm hover:shadow-md">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Real-Time Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Track transaction anomalies instantly. Our system flags
                suspicious activity before it turns into a chargeback.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="bg-background/60 backdrop-blur-sm border-border/50 hover:border-chart-3/50 transition-colors duration-300 shadow-sm hover:shadow-md">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-chart-3/10 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-chart-3" />
              </div>
              <CardTitle className="text-xl">Paylabs Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Seamless 1-click connection to your Paylabs account. Sync
                merchant data and transaction history automatically.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="bg-background/60 backdrop-blur-sm border-border/50 hover:border-chart-4/50 transition-colors duration-300 shadow-sm hover:shadow-md md:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-chart-4/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-chart-4" />
              </div>
              <CardTitle className="text-xl">Smart Risk Scoring</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                AI models tailored to detect chargeback patterns across
                different merchant categories and regions.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
