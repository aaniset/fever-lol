// app/api/orders/create/route.ts

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { z } from "zod";

const TicketDetailSchema = z.object({
  type: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
});

const EventInfoSchema = z.object({
  name: z.string(),
  date: z.string().datetime(),
  startTime: z.string(),
  venue: z.string(),
  address: z.string(),
  mapLink: z.string().url(),
  platformFee: z.enum(["organizer", "user"]),
  paymentGatewayFee: z.enum(["organizer", "user"]),
});

export async function POST(req: Request) {
  try {
    // const session = await auth();
    // if (!session) {
    //   return new Response("Unauthorized", { status: 403 });
    // }

    const body = await req.json();
    const {
      checkoutId,
      paymentId,
      orderId: razorpayOrderId,
      customerInfo,
      cart,
      event,
      venue,
      subtotal,
      paymentGatewayFee,
      discountAmount,
      totalAmount,
    } = body;

    const client = await db;
    const ordersCollection = client.db().collection("orders");
    const ticketsCollection = client.db().collection("tickets");
    const eventsCollection = client.db().collection("events");

    // Fetch complete event details
    const eventDetails = await eventsCollection.findOne({
      _id: new ObjectId(event._id),
    });

    if (!eventDetails) {
      return new Response("Event not found", { status: 404 });
    }

    // Create order document
    const orderData = {
      _id: new ObjectId(),
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      orderDate: new Date().toISOString(),
      customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
      customerEmail: customerInfo.email,
      eventName: event.eventName,
      eventId: event._id,
      organizerId: eventDetails.userId,
      subtotal,
      totalAmountPaid: totalAmount,
      paymentStatus: "completed",
      orderStatus: "confirmed",
      payoutStatus: "pending",
      payoutAmount: totalAmount - paymentGatewayFee,
      event: {
        name: event.eventName,
        date: event.timings[0].date,
        startTime: event.timings[0].startTime,
        venue: venue.venueName,
        address: venue.address,
        mapLink: venue.mapLink || "",
        platformFee: eventDetails.platformFee || "user",
        paymentGatewayFee: eventDetails.paymentGatewayFee || "user",
      },
      ticketDetails: cart.map((item: any) => ({
        type: item.type,
        quantity: item.quantity,
        price: item.price,
      })),
      platformFee: 0, // Set according to your business logic
      paymentGatewayFee,
      discounts: discountAmount,
      paymentId,
      razorpayOrderId,
    };

    // Insert order
    await ordersCollection.insertOne(orderData);

    // Create tickets
    const tickets = cart.flatMap((item: any) => {
      return Array.from({ length: item.quantity }, () => ({
        _id: new ObjectId(),
        orderId: orderData.orderId,
        eventId: event._id,
        ticketType: item.type,
        price: item.price,
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        status: "active",
        qrCode: `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    });

    // Insert tickets
    if (tickets.length > 0) {
      await ticketsCollection.insertMany(tickets);
    }

    // Update event ticket inventory
    await eventsCollection.updateOne(
      { _id: new ObjectId(event._id) },
      {
        $inc: {
          ticketsSold: tickets.length,
          revenue: totalAmount,
        },
      }
    );

    return new Response(
      JSON.stringify({
        success: true,
        orderId: orderData.orderId,
        tickets: tickets.map((t: any) => t.qrCode),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
