import { ObjectId } from "mongodb";
import { db } from "@/lib/db";
// import { auth } from "@/auth";

export async function GET(
  req: Request,
  { params }: { params: { checkoutId: string } }
) {
  try {
    // const session = await auth();
    // if (!session) {
    //   return new Response("Unauthorized", { status: 403 });
    // }

    const checkoutId = params.checkoutId;
    if (!checkoutId || typeof checkoutId !== "string") {
      return new Response("Invalid checkout ID", { status: 400 });
    }

    const client = await db;
    const checkouts = client.db().collection("checkouts");
    const checkout = await checkouts.findOne({
      _id: new ObjectId(checkoutId),
    });

    if (!checkout) {
      return new Response("Checkout not found", { status: 404 });
    }

    const events = client.db().collection("events");
    const event = await events.findOne({
      _id: new ObjectId(checkout?.eventId as string),
    });

    if (!event) {
      console.log("event not found");
      return new Response("Event not found", { status: 404 });
    }

    // Fetch venue data
    const venues = client.db().collection("venues");
    const venue = await venues.findOne({
      _id: new ObjectId(event.venueId as string),
    });

    if (!venue) {
      console.log("venue not found");
      return new Response("Venue not found", { status: 404 });
    }

    // Fetch payment gateway configuration
    const paymentConfigs = client.db().collection("payment_configs");
    const paymentGateway = await paymentConfigs.findOne({
      userId: event.userId, // Assuming userId is stored in the event object
    });

    if (!paymentGateway) {
      console.log("payment gateway configuration not found");
      return new Response("Payment gateway configuration not found", {
        status: 404,
      });
    }

    // Construct the response with all event details
    const response = {
      cart: checkout?.cart,
      event: {
        _id: event._id,
        eventName: event.eventName,
        eventFlyer: event.eventFlyer,
        timings: event.timings,
        description: event.description,
        status: event.status,
        // Include any other event fields you have
      },
      venue: {
        _id: venue._id,
        venueName: venue.venueName,
        city: venue.city,
        // Include any other venue fields you have
      },
      paymentGateway: {
        _id: paymentGateway._id,
        paymentGateway: paymentGateway.paymentGateway,
        currency: paymentGateway.paymentGateway === "razorpay" ? "INR" : "USD",
        // Exclude sensitive information like API keys
      },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching checkout:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
