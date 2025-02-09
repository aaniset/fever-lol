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

// export const OrderSchema = z.object({
//   _id: z.string(),
//   orderId: z.string(),
//   orderDate: z.string().datetime(),
//   customerName: z.string(),
//   customerEmail: z.string().email(),
//   eventName: z.string(),
//   eventId: z.string(),
//   organizerId: z.string(),
//   subtotal: z.number().nonnegative(),
//   totalAmountPaid: z.number().nonnegative(),
//   paymentStatus: z.enum(["failed", "success", "pending", "completed"]),
//   orderStatus: z.enum(["confirmed", "cancelled", "pending"]),
//   payoutStatus: z.enum(["pending", "completed", "failed"]),
//   payoutAmount: z.number().nonnegative(),
//   event: EventInfoSchema,
//   ticketDetails: z.array(TicketDetailSchema),
//   platformFee: z.number().nonnegative(),
//   paymentGatewayFee: z.number().nonnegative(),
//   discounts: z.number().nonnegative(),
// });
export const OrderSchema = z.object({
  orderId: z.string(),
  orderDate: z.string().datetime(),
  customerName: z.string().nullable(), // Allow null/empty values
  customerEmail: z.string().nullable(), // Allow null values
  eventName: z.string(),
  eventId: z.string(),
  organizerId: z.string(),
  subtotal: z.number().nullable(), // Allow null values
  totalAmountPaid: z.number(),
  paymentStatus: z.enum(["failed", "success", "pending", "completed"]),
  orderStatus: z.enum(["confirmed", "cancelled", "pending"]),
  payoutStatus: z.enum(["pending", "completed", "failed"]),
  payoutAmount: z.number(),
  event: z.object({
    name: z.string(),
    date: z.string(),
    startTime: z.string(),
    venue: z.string(),
    address: z.string().nullable(),
    mapLink: z.string().nullable(),
    platformFee: z.string(),
    paymentGatewayFee: z.string(),
  }),
  ticketDetails: z.array(
    z.object({
      type: z.string(),
      quantity: z.number(),
      price: z.number(),
    })
  ),
  platformFee: z.number(),
  paymentGatewayFee: z.number(),
  discounts: z.number(),
  paymentId: z.string(),
  razorpayOrderId: z.string(),
});

// Export the Zod schema
export const OrderSchemaZod = OrderSchema;

// Export the inferred type
export type OrderType = z.infer<typeof OrderSchema>;

// {
//   "_id": "668722ba7728615009d46836",
//   "orderId": "ORDVTFRW",
//   "orderDate": "2025-02-17T03:29:39.545Z",
//   "customerName": "Trevor Price-Erdman",
//   "customerEmail": "Vernice.McKenzie@gmail.com",
//   "eventName": "Proactive maximized encryption",
//   "eventId": "668722ba7728615009d46417",
//   "organizerId": "6681971d54bbd146fcee3741",
//   "subtotal": 66,
//   "platformFee": 3.3,
//   "paymentGatewayFee": 1.32,
//   "totalAmountPaid": 67.32,
//   "paymentStatus": "pending",
//   "orderStatus": "confirmed",
//   "payoutStatus": "pending",
//   "payoutAmount": 62.7,
//   "event": {
//       "name": "Proactive maximized encryption",
//       "date": "2025-03-28T03:05:35.762Z",
//       "startTime": "00:00",
//       "venue": "Franecki, Walter and Crooks",
//       "address": "3120 Reynolds Isle, Greenfelderberg, Connecticut",
//       "mapLink": "https://maps.google.com",
//       "platformFee": "organizer",
//       "paymentGatewayFee": "user"
//   },
//   "ticketDetails": [
//       {
//           "type": "General Entry",
//           "quantity": 3,
//           "price": 22
//       }
//   ],
//   "discounts": 0
// }
