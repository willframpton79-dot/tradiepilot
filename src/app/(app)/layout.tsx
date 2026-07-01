import Sidebar from "@/components/Sidebar";
import AskTradiePilot from "@/components/dashboard/AskTradiePilot";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 max-w-full overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden pt-14 lg:pt-0">
        {children}
      </main>
      <AskTradiePilot />
    </div>
  );
}
