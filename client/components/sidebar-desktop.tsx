import { SidebarContent } from "./sidebar-content";

export default function SidebarDesktop() {
  return (
    <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col border-r bg-white">
      <SidebarContent />
    </aside>
  );
}
