import Link from "next/link";
import { ReactNode } from "react";
import { CommandPalette } from "./command-palette";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/pricing", label: "Pricing" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-6 md:block">
        <div className="mb-8">
          <Link href="/admin" className="text-lg font-semibold text-brand-700">
            CompareMyPrking Admin
          </Link>
          <p className="text-xs text-slate-500">ParkFlow-inspired control center</p>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-brand-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-brand-600">CompareMyPrking</p>
            <h1 className="text-xl font-semibold text-slate-900">Operations cockpit</h1>
          </div>
          <CommandPalette />
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
