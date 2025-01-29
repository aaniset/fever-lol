"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Calendar as CalendarIcon, Clock as ClockIcon } from "lucide-react";
import Head from "next/head";
import { PurchaseSuccessful } from "@/components/purchase-successful";

export function Checkout() {
  const params = useParams();
  const checkoutId = params.checkoutId as string;
  const [checkoutData, setCheckoutData] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const response = await axios.get(`/api/checkout/${checkoutId}`);
        console.log(response.data);
        setCheckoutData(response.data);
      } catch (error) {
        console.error("Error fetching checkout data:", error);
        // You might want to handle specific error cases
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            console.log("Checkout not found");
          } else if (error.response?.status === 403) {
            console.log("Unauthorized access");
          } else {
            console.log("An error occurred while fetching checkout data");
          }
        }
      }
    };

    fetchCheckoutData();
  }, [checkoutId]);
  if (!checkoutData) return <div>Loading...</div>;

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [id]: value }));
  };
  const handlePayment = async (amount) => {
    try {
      // Create order on the server
      const response = await axios.post("/api/create-order", { amount });
      const order = response.data;

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Your Company Name",
        description: "Test Transaction",
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // Verify payment on the server
            const verifyResponse = await axios.post(
              "/api/verify-payment",
              response
            );
            console.log(verifyResponse.data);
            alert("Payment Successful");
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: "John Doe",
          email: "johndoe@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Payment initiation failed");
    }
  };
  const subTotal = checkoutData.cart.reduce((total, ticket) => {
    return total + ticket.quantity * ticket.price;
  }, 0);
  const platformFee = subTotal * 0.05;
  const paymentGatewayFee = (subTotal + platformFee) * 0.03;
  const total = subTotal + platformFee + paymentGatewayFee;

  const handleCompletePurchase = async () => {
    if (typeof window === "undefined" || !window.Razorpay) {
      console.error("Razorpay SDK not loaded");
      return;
    }
    try {
      const amount = total * 100;
      // Create order on the server
      const response = await axios.post("/api/checkout/razorpay/create-order", {
        amount,
      });
      const order = response.data;

      // Initialize Razorpay
      const options = {
        key: process.env.TEST_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Your Company Name",
        description: "Test Transaction",
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // Verify payment on the server
            const verifyResponse = await axios.post(
              "/api/checkout/razorpay/verify-payment",
              response
            );
            console.log(verifyResponse.data);
            alert("Payment Successful");
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: customerInfo.firstName + customerInfo.lastName,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        theme: {
          color: "#3399cc",
        },
        method: {
          netbanking: true,
          card: true,
          upi: true,
          wallet: true,
          emi: true,
          paylater: true,
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Payment initiation failed");
    }
    // Here you would typically send this data to your backend to process the purchase
  };

  const { event, venue, cart } = checkoutData;
  return (
    <div className="relative w-full">
      <div className="absolute top-[-100px] inset-0 z-0 w-full h-full overflow-hidden">
        <img
          src={event.eventFlyer}
          alt="Background"
          className="w-full h-full object-cover object-center opacity-40 blur-[50px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background opacity-100"></div>
      </div>
      <div className="relative z-10 w-full max-w-4xl mx-auto py-12 md:py-16 px-4 md:px-6">
        <div className="grid gap-8 md:gap-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{event.eventName}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    {new Date(event.timings[0].date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>
                    {event.timings[0].startTime} - {event.timings[0].endTime}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {venue.venueName}, {venue.city}
                  </span>
                </div>
              </div>
            </div>
            {cart.map((item, index) => (
              <Card key={index} className="w-full max-w-3xl mx-auto">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="col-span-1 md:col-span-1">
                      <Label className="mb-2 block text-sm font-medium">
                        Ticket Type
                      </Label>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-primary" />
                        <span className="text-base font-medium">
                          {item.type}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="mb-2 block text-sm font-medium">
                        Quantity
                      </Label>
                      <div className="text-2xl font-bold">{item.quantity}</div>
                    </div>
                    <div>
                      <Label className="mb-2 block text-sm font-medium">
                        Price per Ticket
                      </Label>
                      <div className="text-2xl font-bold">${item.price}</div>
                    </div>
                    <div>
                      <Label className="mb-2 block text-sm font-medium">
                        Total Ticket Cost
                      </Label>
                      <div className="text-2xl font-bold text-primary">
                        ${item.quantity * item.price}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter your name"
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="Enter your phone number"
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="items-top flex gap-2">
            <Checkbox id="terms" />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="terms" className="text-sm font-medium">
                I agree to the terms and conditions
              </Label>
              <p className="text-sm text-muted-foreground">
                By checking this box, you agree to our Terms of Service and
                Privacy Policy.
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>Ticket Cost</div>
              <div className="text-2xl font-bold">
                {/* ${calculateTotalCost(checkoutData.cart)} */}$
                {subTotal.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>Platform Fee</div>
              <div className="text-2xl font-bold">
                ${platformFee.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>Payment Gateway Fee</div>
              <div className="text-2xl font-bold">
                ${paymentGatewayFee.toFixed(2)}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Input
                type="text"
                placeholder="Enter coupon code"
                className="w-full sm:w-auto flex-grow"
              />
              <Button variant="outline" className="w-full sm:w-auto">
                Apply
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold">Total</div>
              <div className="text-2xl font-bold">${total.toFixed(2)}</div>
            </div>
          </div>
          <div className="grid gap-4">
            <Button
              size="lg"
              className="w-full"
              onClick={handleCompletePurchase}
            >
              Complete Purchase
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
