import { AdminShell } from "@/components/admin-shell";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
