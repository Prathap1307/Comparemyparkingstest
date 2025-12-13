"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const shortcuts = [
  { label: "Bookings", href: "/admin/bookings" },
  { label: "New booking", href: "/admin/bookings?new=1" },
  { label: "Pricing", href: "/admin/pricing" },
  { label: "Reports", href: "/admin/reports" },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = shortcuts.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
      >
        ⌘K Command
      </button>
      {open ? (
        <div className="absolute right-0 mt-2 w-72 rounded-lg border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 px-3 py-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search actions"
              className="w-full border-none text-sm focus:outline-none"
            />
          </div>
          <ul className="max-h-64 overflow-y-auto p-2 text-sm">
            {filtered.map((item) => (
              <li key={item.href}>
                <button
                  type="button"
                  className="w-full rounded-md px-3 py-2 text-left hover:bg-brand-50"
                  onClick={() => {
                    router.push(item.href);
                    setOpen(false);
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
            {filtered.length === 0 ? <li className="px-3 py-2 text-slate-500">No matches</li> : null}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
