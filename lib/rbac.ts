import { prisma } from "./prisma";

export type PermissionKey =
  | "bookings:read"
  | "bookings:write"
  | "bookings:delete"
  | "pricing:read"
  | "pricing:write"
  | "users:read"
  | "users:write"
  | "reports:read"
  | "settings:read"
  | "settings:write";

export async function userHasPermission(userId: string, permission: PermissionKey): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: { include: { permissions: true } },
      permissions: true,
    },
  });
  if (!user) return false;
  const direct = user.permissions.some((p) => p.key === permission);
  const viaRole = user.role?.permissions.some((p) => p.key === permission) ?? false;
  return direct || viaRole;
}

export function canTransitionStatus(current: string, next: string): boolean {
  const order = ["new", "confirmed", "checked_in", "parked", "returned", "completed"];
  if (["cancelled", "no_show"].includes(next)) return true;
  const currentIndex = order.indexOf(current);
  const nextIndex = order.indexOf(next);
  return currentIndex > -1 && nextIndex > -1 && nextIndex >= currentIndex;
}
