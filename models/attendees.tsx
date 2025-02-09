import { z } from "zod";

// export const AttendeesInfoSchema = z.object({
//   attendeeId: z.string(),
//   customerName: z.string(),
//   email: z.string().email(),
//   ticketType: z.string(),
//   numberOfTickets: z.number(),
//   eventId: z.string(),
//   orderId: z.string(),
//   checkedIn: z.boolean(),
//   checkedInTime: z.string().nullable(),
//   _id: z.string(),
// });

// export type AttendeeInfo = z.infer<typeof AttendeesInfoSchema>;
export const AttendeesInfoSchema = z.object({
  _id: z.string(),
  ticketType: z.string(),
  customerName: z.string().default(" "),
  createdAt: z.string().datetime(),
  email: z.string().default(""),
  numberOfTickets: z.number(),
  eventId: z.string(),
  eventName: z.string().default("N/A"),
  attendeeId: z.string(),
  orderId: z.string().default("N/A"),
  checkedIn: z.boolean().default(false),
  checkedInTime: z.string().datetime().nullable().optional(),
});

export type AttendeeInfo = z.infer<typeof AttendeesInfoSchema>;
