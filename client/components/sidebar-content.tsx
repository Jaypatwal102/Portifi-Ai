"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Layers,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { removeToken } from "@/lib/auth/auth";
import { useRouter } from "next/navigation";

const menu = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Portfolio", href: "/portfolio", icon: Briefcase },
  { name: "Templates", href: "/templates", icon: Layers },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function SidebarContent({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    router.replace("/login");
  };

  return (
    <div className="flex h-full flex-col bg-surface">
      {/* Logo */}
      <div className="px-6 py-4 text-xl font-bold text-prime">Portifi AI</div>

      {/* Avatar */}
      <div className="px-4 py-4 flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>AS</AvatarFallback>
        </Avatar>

        <div className="leading-tight">
          <p className="text-sm font-semibold text-txt">Alex Smith</p>
          <p className="text-xs text-txt/70">alex@portifi.ai</p>
        </div>
      </div>

      <Separator className="bg-bd" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-1">
        {menu.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClick}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-acnt/60 text-prime"
                  : "text-prime/70 hover:bg-acnt/30 hover:text-prime",
              )}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-500 hover:bg-acnt/30"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
