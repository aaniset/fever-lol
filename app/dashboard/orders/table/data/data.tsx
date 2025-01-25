import { CheckCircle, XCircle, HelpCircle } from "lucide-react";

export const paymentStatuses = [
  {
    value: "pending",
    label: "Pending",
    icon: HelpCircle,
  },
  {
    value: "completed",
    label: "Completed",
    icon: CheckCircle,
  },
  {
    value: "failed",
    label: "Failed",
    icon: XCircle,
  },
];

export const orderStatuses = [
  {
    value: "confirmed",
    label: "Confirmed",
    icon: CheckCircle,
  },
  {
    value: "pending",
    label: "Pending",
    icon: HelpCircle,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: XCircle,
  },
];
