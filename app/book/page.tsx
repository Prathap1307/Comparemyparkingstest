import { BookingFlow } from "@/components/public-booking-flow";
import { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Book airport parking | CompareMyParking.co.uk",
  description: "Secure meet & greet and shuttle parking with premium checkout experience.",
};

export default function BookPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Checkout</p>
          <h1 className="text-3xl font-semibold text-slate-900">Reserve your parking</h1>
          <p className="text-sm text-slate-600">Three quick steps with live flight tracking and secure payment.</p>
        </div>
        <span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 md:inline-flex">
          <ShieldCheck className="h-4 w-4" /> Protected by CompareMyParking
        </span>
      </div>
      <BookingFlow />
    </main>
  );
}
