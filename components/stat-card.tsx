import { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: LucideIcon;
  color: string;
}

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
  color,
}: StatCardProps) {
  const isPositive = change.startsWith("+");

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className={cn("p-2 rounded-lg bg-opacity-10", color)}>
          <Icon size={20} className={color} />
        </div>
        <div
          className={`text-xs font-medium flex items-center gap-0.5 ${isPositive ? "text-green-600" : "text-red-600"}`}
        >
          <TrendingUp size={12} />
          {change}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}
