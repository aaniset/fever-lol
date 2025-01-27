// import { auth } from "@/auth";
// import { db } from "@/lib/db";
// import { ObjectId } from "mongodb";

// export async function GET(req: Request) {
//   try {
//     const session = await auth();
//     if (!session) {
//       return new Response("Unauthorized", { status: 403 });
//     }

//     const client = await db;
//     const collection = client.db().collection("venues");
//     const venues = await collection.find({}).toArray();

//     return new Response(JSON.stringify(venues), {
//       status: 200,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching venues:", error);
//     return new Response("Internal server error", { status: 500 });
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const session = await auth();
//     if (!session) {
//       return new Response("Unauthorized", { status: 403 });
//     }

//     const venueData = await req.json();

//     const client = await db;
//     const collection = client.db().collection("venues");
//     const result = await collection.insertOne({
//       ...venueData,
//       createdAt: new Date(),
//       userId: session.user.id,
//     });

//     const newVenue = await collection.findOne({ _id: result.insertedId });

//     return new Response(JSON.stringify(newVenue), {
//       status: 201,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (error) {
//     console.error("Error creating venue:", error);
//     return new Response("Internal server error", { status: 500 });
//   }
// }

// export async function PATCH(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await auth();
//     if (!session) {
//       return new Response("Unauthorized", { status: 403 });
//     }

//     const body = await req.json();
//     const venueId = params.id;

//     const client = await db;
//     const collection = client.db().collection("venues");

//     const result = await collection.updateOne(
//       { _id: new ObjectId(venueId) },
//       {
//         $set: {
//           ...body,
//           updatedAt: new Date(),
//         },
//       }
//     );

//     if (result.matchedCount === 0) {
//       return new Response("Venue not found", { status: 404 });
//     }

//     return new Response(JSON.stringify(result), { status: 200 });
//   } catch (error) {
//     console.error("Error updating venue:", error);
//     return new Response("Internal server error", { status: 500 });
//   }
// }

// export async function DELETE(
//   req: Request,
//   { params }: { params: { venueId: string } }
// ) {
//   try {
//     const session = await auth();
//     if (!session) {
//       return new Response("Unauthorized", { status: 403 });
//     }

//     const venueId = params.venueId;
//     if (!venueId) {
//       return new Response("Venue ID is required", { status: 400 });
//     }

//     const client = await db;
//     const collection = client.db().collection("venues");

//     const result = await collection.deleteOne({
//       _id: new ObjectId(venueId),
//       userId: session.user.id,
//     });

//     if (result.deletedCount === 0) {
//       return new Response("Venue not found", { status: 404 });
//     }

//     return new Response(null, { status: 204 });
//   } catch (error) {
//     console.error("Error deleting venue:", error);
//     return new Response("Internal server error", { status: 500 });
//   }
// }
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
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
    const collection = client.db().collection("venues");
    const venues = await collection.find({ userId: userId }).toArray();

    return new Response(JSON.stringify(venues), { status: 200 });
  } catch (error) {
    console.error("Error fetching venues:", error);
    return new Response("Internal server error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const userId = session.user.id;
    const body = await req.json();

    const client = await db;
    const collection = client.db().collection("venues");

    const venue = {
      ...body,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(venue);
    const newVenue = await collection.findOne({ _id: result.insertedId });

    return new Response(JSON.stringify(newVenue), { status: 201 });
  } catch (error) {
    console.error("Error creating venue:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
