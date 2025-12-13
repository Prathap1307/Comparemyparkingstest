import { prisma } from "./prisma";

export async function getDashboardMetrics() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const [arrivalsToday, returnsToday, revenue7d, unpaid, cancellations, occupancy] = await Promise.all([
    prisma.booking.count({ where: { arrivalAt: { gte: startOfDay, lt: endOfDay } } }),
    prisma.booking.count({ where: { returnAt: { gte: startOfDay, lt: endOfDay } } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }).then((r) => r._sum.amount ?? 0),
    prisma.booking.aggregate({ _sum: { price: true }, where: { paymentStatus: "unpaid" } }).then((r) => r._sum.price ?? 0),
    prisma.booking.count({ where: { status: "cancelled" } }),
    prisma.capacity.findFirst().then((c) => (c ? Math.min(100, Math.round(((c.occupied ?? 0) / c.totalSpaces) * 100)) : 0)),
  ]);

  return {
    arrivalsToday,
    returnsToday,
    occupancy,
    revenue7d,
    unpaid,
    cancellations,
  };
}
