"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { SidebarContent } from "./sidebar-content";

export default function SidebarMobile() {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-64 p-0">
          {/* Accessible title (required by Radix) */}
          <VisuallyHidden>
            <SheetTitle>Sidebar navigation</SheetTitle>
          </VisuallyHidden>

          <SidebarContent />
        </SheetContent>
      </Sheet>
    </div>
  );
}
