import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const json = await req.json();
    const { eventId } = json;
    const userId = session.user.id;

    if (!userId) {
      return new Response("userId not found", { status: 403 });
    }

    const client = await db;
    const ordersCollection = client.db().collection("orders");

    let matchStage: any = { organizerId: new ObjectId(userId) };
    if (eventId) matchStage.eventId = new ObjectId(eventId as string);

    const pipeline = [
      { $match: matchStage },
      { $sort: { orderDate: -1 } },
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $lookup: {
          from: "venues",
          localField: "event.venueId",
          foreignField: "_id",
          as: "venue",
        },
      },
      { $unwind: "$venue" },
      {
        $addFields: {
          "event.address": {
            $concat: [
              "$venue.address",
              ", ",
              "$venue.city",
              ", ",
              "$venue.state",
            ],
          },
          "event.mapLink": "$venue.mapsUrl",

          ticketDetails: {
            $map: {
              input: "$tickets",
              as: "ticket",
              in: {
                $mergeObjects: [
                  "$$ticket",
                  {
                    price: {
                      $let: {
                        vars: {
                          ticketType: {
                            $arrayElemAt: [
                              {
                                $filter: {
                                  input: "$event.ticketVariants",
                                  as: "variant",
                                  cond: {
                                    $eq: ["$$variant.type", "$$ticket.type"],
                                  },
                                },
                              },
                              0,
                            ],
                          },
                        },
                        in: { $ifNull: ["$$ticketType.price", 0] },
                      },
                    },
                  },
                ],
              },
            },
          },
          // Use the platformFee from the order object
          platformFee: "$platformFee",
          // Use the paymentGatewayFee from the order object
          paymentGatewayFee: "$paymentGatewayFee",
          discounts: { $ifNull: ["$discounts", 0] },
        },
      },
      {
        $project: {
          _id: 1,
          orderId: 1,
          orderDate: 1,
          customerName: 1,
          customerEmail: 1,
          eventName: 1,
          eventId: 1,
          organizerId: 1,
          subtotal: 1,
          platformFee: 1,
          paymentGatewayFee: 1,
          totalAmountPaid: 1,
          paymentStatus: 1,
          orderStatus: 1,
          payoutStatus: 1,
          payoutAmount: 1,
          event: {
            name: "$event.eventName",
            date: { $arrayElemAt: ["$event.timings.date", 0] },
            startTime: { $arrayElemAt: ["$event.timings.startTime", 0] },
            venue: "$venue.venueName",
            address: "$event.address",
            mapLink: "$event.mapLink",
            platformFee: "$event.platformFee",
            paymentGatewayFee: "$event.paymentGatewayFee",
          },
          ticketDetails: 1,
          discounts: 1,
        },
      },
    ];
    const orderDetails = await ordersCollection.aggregate(pipeline).toArray();

    return new Response(JSON.stringify(orderDetails), { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
