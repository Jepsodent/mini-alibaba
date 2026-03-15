import Sidebar from "@/components/sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background w-full overflow-hidden">
        <Sidebar />
        <SidebarInset className="flex-1 overflow-auto flex flex-col">
          <SidebarTrigger />
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
