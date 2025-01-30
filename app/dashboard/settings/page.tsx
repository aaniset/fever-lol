import { AccountForm } from "@/components/account-form";
import { PaymentForm } from "@/components/payment-account-form";

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <AccountForm />
      <PaymentForm />
    </div>
  );
}
