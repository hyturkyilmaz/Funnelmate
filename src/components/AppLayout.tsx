import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
export function AppLayout() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}