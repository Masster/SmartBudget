"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { href: "/", label: "Главная", icon: "📊" },
  { href: "/swipe", label: "Свайп", icon: "👆" },
  { href: "/transactions", label: "Транзакции", icon: "💰" },
  { href: "/budget", label: "Бюджет", icon: "📋" },
  { href: "/accounts", label: "Счета", icon: "🏦" },
  { href: "/analytics", label: "Аналитика", icon: "📈" },
  { href: "/settings", label: "Настройки", icon: "⚙️" },
];

function NavLink({ href, label, icon, active }: { href: string; label: string; icon: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function NavContent() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-xl font-bold">SmartBudget</h1>
        <p className="text-xs text-muted-foreground mt-1">Управление финансами</p>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)}
          />
        ))}
      </nav>
      <div className="p-4 border-t">
        <p className="text-xs text-muted-foreground text-center">SmartBudget v1.0</p>
      </div>
    </div>
  );
}

export function Navigation({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <div className="flex h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r bg-card">
        <NavContent />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="md:hidden flex items-center gap-3 p-4 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="text-lg"
          >
            ☰
          </Button>
          <h1 className="font-semibold">SmartBudget</h1>
        </div>
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
