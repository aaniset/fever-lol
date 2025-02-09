"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { PurchaseSuccessful } from "@/components/purchase-successful";

export default function CheckoutSuccess() {
  const params = useParams();
  const checkoutId = params.checkoutId as string;
  const [checkoutData, setCheckoutData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const response = await axios.get(`/api/checkout/${checkoutId}`);
        setCheckoutData(response.data);
      } catch (error) {
        setError("Failed to load ticket information");
        console.error("Error fetching checkout data:", error);
      }
    };

    fetchCheckoutData();
  }, [checkoutId]);

  if (error) return <div className="text-center p-4">{error}</div>;
  if (!checkoutData) return <div className="text-center p-4">Loading...</div>;

  return <PurchaseSuccessful checkoutData={checkoutData} />;
}
