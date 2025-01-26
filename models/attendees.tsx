import { z } from "zod";

export const AttendeesInfoSchema = z.object({
  attendeeId: z.string(),
  customerName: z.string(),
  email: z.string().email(),
  ticketType: z.string(),
  numberOfTickets: z.number(),
  eventId: z.string(),
  orderId: z.string(),
  checkedIn: z.boolean(),
  checkedInTime: z.string().nullable(),
  _id: z.string(),
});

export type AttendeeInfo = z.infer<typeof AttendeesInfoSchema>;
// {
//   "_id": "668722ba7728615009d46677",
//   "customerName": "Doreen Dickinson",
//   "ticketType": "VIP Access",
//   "checkedIn": false,
//   "checkedInTime": null,
//   "email": "Maci35@hotmail.com",
//   "numberOfTickets": 5,
//   "eventId": "668722ba7728615009d46415",
//   "attendeeId": "668722ba7728615009d46677",
//   "orderId": "ORDJLF7C"
// }