"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canTransitionStatus, userHasPermission } from "@/lib/rbac";
import { z } from "zod";

const bookingSchema = z.object({
  customerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  vehicleReg: z.string().min(3),
  makeModel: z.string().optional(),
  color: z.string().optional(),
  parkingZone: z.string().optional(),
  terminal: z.string().min(2),
  arrivalAt: z.string(),
  returnAt: z.string(),
  serviceType: z.enum(["meet&greet", "shuttle", "valet"]),
  price: z.number().nonnegative(),
  paidAmount: z.number().nonnegative().default(0),
  paymentStatus: z.enum(["paid", "unpaid", "partial"]),
  sourceChannel: z.string().default("direct"),
  notes: z.string().optional(),
});

export async function createBookingAction(values: z.infer<typeof bookingSchema>) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || !(await userHasPermission(user.id, "bookings:write"))) throw new Error("Forbidden");

  const parsed = bookingSchema.parse(values);
  const bookingRef = `CMP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const booking = await prisma.booking.create({
    data: {
      ...parsed,
      arrivalAt: new Date(parsed.arrivalAt),
      returnAt: new Date(parsed.returnAt),
      bookingRef,
      status: "new",
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "booking.created",
      userId: user.id,
      meta: { bookingId: booking.id },
    },
  });

  return booking;
}

export async function updateBookingStatusAction(bookingId: string, nextStatus: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || !(await userHasPermission(user.id, "bookings:write"))) throw new Error("Forbidden");

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new Error("Booking not found");
  if (!canTransitionStatus(booking.status, nextStatus)) throw new Error("Invalid transition");

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: nextStatus },
  });

  await prisma.auditLog.create({
    data: { action: "booking.status", userId: user.id, meta: { bookingId, from: booking.status, to: nextStatus } },
  });

  return updated;
}
