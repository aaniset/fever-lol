// Backend: /api/create-checkout.ts
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: Request) {
  //     if (req.method !== 'POST') {
  //     return res.status(405).json({ message: 'Method Not Allowed' });
  //   }

  try {
    const session = await auth();
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    // Validate the request body
    // const cartData = CartSchema.parse(req.body);
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

    // Schedule deletion of the checkout document after 10 minutes
    // setTimeout(async () => {
    //   const client = await MongoClient.connect(
    //     process.env.MONGODB_URI as string
    //   );
    //   const db = client.db("your_database_name");
    //   const checkouts = db.collection("checkouts");
    //   await checkouts.deleteOne({ _id: result.insertedId });
    //   await client.close();
    // }, 10 * 60 * 1000);

    // Return the checkoutId
    // res.status(200).json({ checkoutId: result.insertedId.toString() });
    return new Response(
      JSON.stringify({ checkoutId: result.insertedId.toString() }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Checkout creation error:", error);
    return new Response("Internal server error", { status: 422 });
  }
}
