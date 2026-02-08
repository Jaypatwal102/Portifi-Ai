import ProtectedRoutes from "@/components/ProtectedRoutes";
import SidebarDesktop from "@/components/sidebar-desktop";
import SidebarMobile from "@/components/sidebar-mobile";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoutes>
      <div className="min-h-screen">
        {/* Desktop sidebar */}
        <SidebarDesktop />

        {/* Main content */}
        <div className="md:pl-64">
          {/* Mobile header */}
          <header className="flex items-center gap-3 border-b bg-surface px-4 py-3 md:hidden">
            <SidebarMobile />
            <span className="font-semibold text-txt">Portifi AI</span>
          </header>

          <main className="bg-bg min-h-screen p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoutes>
  );
}
