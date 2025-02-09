"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type CurrencyContextType = {
  currency: string;
  setCurrency: (currency: string) => void;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [currency, setCurrency] = useState<string>(
    (session?.user?.currency as string) || "USD"
  );

  useEffect(() => {
    if (session?.user?.currency) {
      setCurrency(session.user.currency as string);
    }
  }, [session]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
