import { BookingFlow } from "@/components/public-booking-flow";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book airport parking | CompareMyPrking.co.uk",
};

export default function BookPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <BookingFlow />
    </main>
  );
}
