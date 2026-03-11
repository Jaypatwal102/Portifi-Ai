import { SidebarContent } from "./sidebar-content";

export default function SidebarDesktop() {
  return (
    <aside className="hidden border-r border-bd bg-surface md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
      <SidebarContent />
    </aside>
  );
}
