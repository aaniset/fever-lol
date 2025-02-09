// Backend: /api/create-checkout.ts
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const cartData = await req.json();
    // Connect to MongoDB
    const client = await db;
    const checkouts = client.db().collection("checkouts");

    // Create a new checkout document
    const result = await checkouts.insertOne({
      cart: cartData.cart,
      eventId: cartData.eventId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    });

    return new Response(
      JSON.stringify({ checkoutId: result.insertedId.toString() }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Checkout creation error:", error);
    return new Response("Internal server error", { status: 422 });
  }
}
