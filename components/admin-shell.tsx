import Link from "next/link";
import { ReactNode } from "react";
import {
  Bell,
  CalendarClock,
  CheckSquare,
  ChevronRight,
  CreditCard,
  Gauge,
  Menu,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { CommandPalette } from "./command-palette";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: string;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <Gauge className="h-4 w-4" /> },
  { href: "/admin/bookings", label: "Bookings", icon: <CalendarClock className="h-4 w-4" />, badge: "live" },
  { href: "/admin/pricing", label: "Pricing", icon: <CreditCard className="h-4 w-4" /> },
  { href: "/admin/users", label: "Users", icon: <Users className="h-4 w-4" /> },
  { href: "/admin/reports", label: "Reports", icon: <CheckSquare className="h-4 w-4" /> },
  { href: "/admin/settings", label: "Settings", icon: <ShieldCheck className="h-4 w-4" /> },
];

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 hidden w-72 border-r border-slate-200 bg-white/80 px-5 py-6 backdrop-blur md:flex md:flex-col">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="font-semibold text-slate-900">
            CompareMyParking
          </Link>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Ops</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">Live control for Heathrow & Gatwick fleets</p>
        <nav className="mt-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <span className="rounded-lg bg-slate-100 p-2 text-slate-700 group-hover:bg-slate-200">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold uppercase text-amber-700">
                  {item.badge}
                </span>
              ) : null}
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-xl bg-slate-900 p-4 text-white shadow-lg">
          <p className="text-sm font-semibold">Priority ops</p>
          <p className="mt-1 text-xs text-slate-200">Secure access enforced. Multi-factor enabled for admins.</p>
          <Link
            href="/admin/settings"
            className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-emerald-200 hover:text-white"
          >
            View access controls
          </Link>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col md:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm md:hidden">
                <Menu className="h-5 w-5" />
              </button>
              <div className="relative hidden items-center rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm md:flex">
                <Search className="mr-2 h-4 w-4 text-slate-400" />
                <input
                  className="w-64 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  placeholder="Search bookings, customers"
                />
              </div>
              <CommandPalette />
            </div>
            <div className="flex items-center gap-3">
              <button className="relative rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </button>
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 shadow-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-slate-700 text-white">CJ</span>
                <div>
                  <p>Control</p>
                  <p className="text-xs font-normal text-slate-500">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 bg-slate-50 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
