import { CheckCircle, XCircle, HelpCircle } from "lucide-react";

export const ticketStatuses = [
  {
    value: "Active",
    label: "Active",
    icon: HelpCircle,
  },
  {
    value: "Used",
    label: "Used",
    icon: CheckCircle,
  },
  {
    value: "Cancelled",
    label: "Cancelled",
    icon: XCircle,
  },
  {
    value: "Refunded",
    label: "Refunded",
    icon: XCircle,
  },
];
// export const orderStatuses = [
//   {
//     value: "confirmed",
//     label: "Confirmed",
//     icon: CheckCircle,
//   },
//   {
//     value: "pending",
//     label: "Pending",
//     icon: HelpCircle,
//   },
//   {
//     value: "cancelled",
//     label: "Cancelled",
//     icon: XCircle,
//   },
// ];
