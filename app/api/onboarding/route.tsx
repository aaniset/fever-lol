import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const userId = session.user.id;
    if (!userId || typeof userId !== "string") {
      return new Response("Invalid UserId", { status: 400 });
    }

    const body = await req.json();
    const { firstName, lastName, email, orgName, orgUrl } = body;

    const client = await db;
    const collection = client.db().collection("users");

    const existingUser = await collection.findOne({ orgUrl });
    if (existingUser) {
      return new Response("Organization URL already taken", { status: 400 });
    }

    await collection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          firstName,
          lastName,
          email,
          orgName,
          orgUrl,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return new Response("Profile updated successfully", { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return new Response("Internal server error", { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const userId = session.user.id;
    if (!userId || typeof userId !== "string") {
      return new Response("Invalid UserId", { status: 400 });
    }

    const client = await db;
    const collection = client.db().collection("users");
    const user = await collection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
