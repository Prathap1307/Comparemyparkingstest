import { prisma } from "@/lib/prisma";

export default async function ReportsPage() {
  const revenueByDay = await prisma.payment.groupBy({
    by: ["createdAt"],
    _sum: { amount: true },
  });
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Reports</h1>
        <p className="text-sm text-slate-600">Revenue by day with CSV-ready table.</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left font-semibold text-slate-600">
            <tr>
              <th className="px-4 py-3">Day</th>
              <th className="px-4 py-3">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {revenueByDay.map((row) => (
              <tr key={row.createdAt.toISOString()}>
                <td className="px-4 py-3">{row.createdAt.toDateString()}</td>
                <td className="px-4 py-3">£{row._sum.amount ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
