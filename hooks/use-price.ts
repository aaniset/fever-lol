// hooks/usePrice.ts
import { useMemo } from "react";
import { useCurrency } from "@/contexts/currency-context";

export function usePrice() {
  const { currency } = useCurrency();

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }),
    [currency]
  );
  const formatPrice = (amount: number | string) => {
    if (typeof amount === "string" && (amount === null || amount === "")) {
      return formatter.format(0);
    }
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;
    return formatter.format(numericAmount);
  };

  return { formatPrice, currency };
}
