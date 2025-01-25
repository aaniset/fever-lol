// pages/api/events/[userId].ts

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";

interface EventResponse {
  id: string;
  name: string;
  status: string;
  date: string;
  location: string;
  imgUrl: string;
}

export async function POST(req: Request, res: Response) {
  try {
    const session = await auth()
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }
    console.log("Success");

    // const json = await req.json();
    // const reqBody = VenueSchema.parse(req.body);
    const userId = session.user.id;

    if (!userId || typeof userId !== "string") {
      return new Response("Invalid UserId", { status: 400 });
    }

    const client = await db;
    const collection = client.db().collection("events");

    // const events = await collection
    //   .find({
    //     userId: new ObjectId(userId),
    //   })
    //   .toArray();

    // const formattedEvents: EventResponse[] = events.map((event) => ({
    //   id: event._id.toString(),
    //   name: event.eventName,
    //   status: event.status,
    //   date: formatDate(event.timings[0].date),
    //   location: event.venueId ? event.venueId.toString() : "N/A", // You might want to fetch venue details separately
    //   imgUrl: event.eventFlyer || "./placeholder.svg",
    // }));
    const events = await collection
      .aggregate([
        {
          $match: {
            userId: new ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "venues", // Assuming 'venues' is the name of your venues collection
            localField: "venueId",
            foreignField: "_id",
            as: "venue",
          },
        },
        {
          $unwind: {
            path: "$venue",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray();

    const formattedEvents = events.map((event) => ({
      id: event._id.toString(),
      name: event.eventName,
      status: event.status,
      date: formatDate(event.timings[0].date),
      location: event.venue
        ? {
            id: event.venue._id.toString(),
            name: event.venue.venueName,
            address: event.venue.address,
            // Add other venue fields as needed
          }
        : "N/A",
      imgUrl: event.eventFlyer || "./placeholder.svg",
    }));
    return new Response(JSON.stringify(formattedEvents), { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return new Response("Internal server error", { status: 500 });
  }
}

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return new Date(date).toLocaleString("en-US", options);
}
