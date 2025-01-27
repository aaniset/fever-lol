import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const url = new URL(req.url);
    const orgUrl = url.searchParams.get("orgUrl");

    if (!orgUrl) {
      return new Response("Organization URL is required", { status: 400 });
    }

    const client = await db;
    const collection = client.db().collection("users");
    const existingUrl = await collection.findOne({ orgUrl });

    return new Response(JSON.stringify({ available: !existingUrl }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error checking URL availability:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
