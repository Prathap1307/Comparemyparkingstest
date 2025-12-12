import { getItemById, updateItem } from "@/lib/Database/Utils-db";

const TABLE_NAME = process.env.BOOKINGS_TABLE;

export async function GET(_request, { params }) {
  try {
    const booking = await getItemById(TABLE_NAME, params.id);
    if (!booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(booking), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching booking", err);
    return new Response(JSON.stringify({ error: "Failed to fetch booking" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(request, { params }) {
  try {
    const updateData = await request.json();
    const stringId = String(params.id);
    const updated = await updateItem(TABLE_NAME, stringId, {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });
    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error updating booking", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
