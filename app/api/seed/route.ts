import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const userId = "6681971d54bbd146fcee3741";

    const client = await db;
    const ordersCollection = client.db().collection("orders");
    const eventsCollection = client.db().collection("events");

    // Clear existing data
    await ordersCollection.deleteMany({
      organizerId: new ObjectId("6681971d54bbd146fcee3741"),
    });
    await eventsCollection.deleteMany({
      organizerId: new ObjectId("6681971d54bbd146fcee3741"),
    });

    // Generate sample events
    const events = Array.from({ length: 15 }, (_, index) => ({
      _id: new ObjectId(),
      organizerId: userId,
      name: `Event ${index + 1}`,
      date: new Date(
        2025,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28)
      ),
      status: "active",
    }));

    await eventsCollection.insertMany(events);

    // Generate sample orders across different months
    const orders = [];
    const customerNames = [
      "John Doe",
      "Jane Smith",
      "Alice Johnson",
      "Bob Wilson",
      "Carol Brown",
    ];
    const customerEmails = [
      "john@example.com",
      "jane@example.com",
      "alice@example.com",
      "bob@example.com",
      "carol@example.com",
    ];

    for (let month = 0; month < 12; month++) {
      const ordersPerMonth = Math.floor(Math.random() * 20) + 10;

      for (let i = 0; i < ordersPerMonth; i++) {
        const randomCustomerIndex = Math.floor(
          Math.random() * customerNames.length
        );
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        const randomAmount = Math.floor(Math.random() * 200) + 50;

        orders.push({
          _id: new ObjectId(),
          orderId: `ORD${Math.random()
            .toString(36)
            .substring(7)
            .toUpperCase()}`,
          orderDate: new Date(2025, month, Math.floor(Math.random() * 28)),
          customerName: customerNames[randomCustomerIndex],
          customerEmail: customerEmails[randomCustomerIndex],
          eventName: randomEvent.name,
          eventId: randomEvent._id,
          organizerId: userId,
          totalAmountPaid: randomAmount,
          orderStatus: "confirmed",
          ticketDetails: [
            {
              type: "General Entry",
              quantity: Math.floor(Math.random() * 4) + 1,
              price: randomAmount / 2,
            },
          ],
        });
      }
    }

    // Add some orders for today and yesterday
    const todayOrders = Array.from({ length: 5 }, () => {
      const randomCustomerIndex = Math.floor(
        Math.random() * customerNames.length
      );
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      const randomAmount = Math.floor(Math.random() * 200) + 50;

      return {
        _id: new ObjectId(),
        orderId: `ORD${Math.random().toString(36).substring(7).toUpperCase()}`,
        orderDate: new Date(),
        customerName: customerNames[randomCustomerIndex],
        customerEmail: customerEmails[randomCustomerIndex],
        eventName: randomEvent.name,
        eventId: randomEvent._id,
        organizerId: userId,
        totalAmountPaid: randomAmount,
        orderStatus: "confirmed",
        ticketDetails: [
          {
            type: "General Entry",
            quantity: Math.floor(Math.random() * 4) + 1,
            price: randomAmount / 2,
          },
        ],
      };
    });

    orders.push(...todayOrders);
    await ordersCollection.insertMany(orders);

    return new Response(
      JSON.stringify({
        message: "Seed data created successfully",
        totalOrders: orders.length,
        totalEvents: events.length,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error seeding data:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
