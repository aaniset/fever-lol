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

export const OrderSchema = z.object({
  _id: z.string(),
  orderId: z.string(),
  orderDate: z.string().datetime(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  eventName: z.string(),
  eventId: z.string(),
  organizerId: z.string(),
  subtotal: z.number().nonnegative(),
  totalAmountPaid: z.number().nonnegative(),
  paymentStatus: z.enum(["failed", "success", "pending", "completed"]),
  orderStatus: z.enum(["confirmed", "cancelled", "pending"]),
  payoutStatus: z.enum(["pending", "completed", "failed"]),
  payoutAmount: z.number().nonnegative(),
  event: EventInfoSchema,
  ticketDetails: z.array(TicketDetailSchema),
  platformFee: z.number().nonnegative(),
  paymentGatewayFee: z.number().nonnegative(),
  discounts: z.number().nonnegative(),
});

// Export the Zod schema
export const OrderSchemaZod = OrderSchema;

// Export the inferred type
export type OrderType = z.infer<typeof OrderSchema>;
