"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, TrendingUp, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Merchant Exposure",
    href: "/exposure",
    icon: BarChart3,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: TrendingUp,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-48 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-1">
          <Link href="/">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                A
              </span>
            </div>
          </Link>
          <div>
            <h1 className="text-sm font-bold text-sidebar-foreground">Aegis</h1>
            <p className="text-xs text-muted-foreground">Admin Console</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50",
              )}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <Settings size={18} />
          <span>Settings</span>
        </Link>

        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-sidebar-foreground truncate">
              Alex Morgan
            </p>
            <p className="text-xs text-muted-foreground truncate">
              Lead Analyst
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
