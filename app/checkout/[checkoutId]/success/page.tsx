// "use client";
// import { useState, useEffect, useMemo } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Separator } from "@/components/ui/separator";
// import { Card, CardContent } from "@/components/ui/card";
// import { MapPin } from "lucide-react";
// import { Calendar as CalendarIcon, Clock as ClockIcon } from "lucide-react";
// import Head from "next/head";
// import { PurchaseSuccessful } from "@/components/purchase-successful";

// export default function CheckoutSuccess() {
//   const params = useParams();
//   const checkoutId = params.checkoutId as string;
//   const [checkoutData, setCheckoutData] = useState(null);
//   const [customerInfo, setCustomerInfo] = useState({
//     firstName: "",
//     lastName: "",
//     phone: "",
//     email: "",
//   });

//   useEffect(() => {
//     const fetchCheckoutData = async () => {
//       try {
//         const response = await axios.get(`/api/checkout/${checkoutId}`);
//         console.log(response.data);
//         setCheckoutData(response.data);
//       } catch (error) {
//         console.error("Error fetching checkout data:", error);
//         // You might want to handle specific error cases
//         if (axios.isAxiosError(error)) {
//           if (error.response?.status === 404) {
//             console.log("Checkout not found");
//           } else if (error.response?.status === 403) {
//             console.log("Unauthorized access");
//           } else {
//             console.log("An error occurred while fetching checkout data");
//           }
//         }
//       }
//     };

//     fetchCheckoutData();
//   }, [checkoutId]);
//   if (!checkoutData) return <div>Loading...</div>;

//   return <PurchaseSuccessful />;
// }
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
