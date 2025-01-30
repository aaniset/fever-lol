"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";
import { Calendar as CalendarIcon, Clock as ClockIcon } from "lucide-react";

interface Timing {
  date: string;
  startTime: string;
  endTime: string;
}

interface Event {
  eventName: string;
  eventFlyer: string;
  timings: Timing[];
  _id: string;
}

interface Venue {
  venueName: string;
  city: string;
}

interface CartItem {
  type: string;
  quantity: number;
  price: number;
}

interface CheckoutData {
  event: Event;
  venue: Venue;
  cart: CartItem[];
  paymentGateway?: {
    currency: string;
    // other payment gateway fields
  };
}
interface PromoResponse {
  success: boolean;
  message: string;
  couponDetails?: {
    code: string;
    discountType: string;
    discountValue: number;
  };
  calculation?: {
    originalAmount: number;
    discountAmount: number;
    finalAmount: number;
  };
}
interface CustomerInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export function Checkout() {
  const params = useParams();
  const router = useRouter();
  const checkoutId = params.checkoutId as string;
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const response = await axios.get(`/api/checkout/${checkoutId}`);
        setCheckoutData(response.data);
      } catch (error) {
        console.error("Error fetching checkout data:", error);
      }
    };

    fetchCheckoutData();
  }, [checkoutId]);

  if (!checkoutData) return <div>Loading...</div>;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    setCouponMessage(null);

    try {
      const response = await axios.post<PromoResponse>(
        `/api/checkout/${checkoutId}/validate-coupon`,
        {
          eventId: checkoutData?.event._id,
          couponCode: couponCode.trim(),
        }
      );

      const data = response.data;
      if (data.success) {
        setCouponMessage({
          type: "success",
          message: data.message,
        });
        // Store the USD discount amount
        const usdDiscountAmount = data.calculation?.discountAmount || 0;
        setDiscountAmount(usdDiscountAmount);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to apply coupon";
      setCouponMessage({
        type: "error",
        message: errorMessage,
      });
      setDiscountAmount(0);
    } finally {
      setIsApplyingCoupon(false);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [id]: value }));
  };

  const subTotal = checkoutData.cart.reduce((total, ticket) => {
    return total + ticket.quantity * ticket.price;
  }, 0);

  const paymentGatewayFee = subTotal * 0.03;

  const total = subTotal + paymentGatewayFee - discountAmount;
  const handlePaymentSuccess = async (paymentResponse: any) => {
    try {
      // First verify the payment
      await axios.post("/api/checkout/razorpay/verify-payment", {
        ...paymentResponse,
        checkoutId,
      });

      // Then create order and tickets
      const orderData = {
        checkoutId,
        paymentId: paymentResponse.razorpay_payment_id,
        orderId: paymentResponse.razorpay_order_id,
        customerInfo,
        cart: checkoutData.cart,
        event: checkoutData.event,
        venue: checkoutData.venue,
        subTotal,
        paymentGatewayFee,
        discountAmount,
        totalAmount: total,
      };

      const response = await axios.post("/api/orders/create", orderData);

      // Redirect to success page with order ID
      router.push(
        `/checkout/${checkoutId}/success?orderId=${response.data.orderId}`
      );
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Payment successful but order creation failed");
    }
  };
  const handleCompletePurchase = async () => {
    if (typeof window === "undefined" || !window.Razorpay) {
      console.error("Razorpay SDK not loaded");
      return;
    }

    setIsLoading(true);
    try {
      // Convert to INR if payment gateway currency is INR
      const conversionRate =
        checkoutData.paymentGateway?.currency === "INR" ? 86 : 1;
      const finalAmount = total * conversionRate;
      const amount = Math.round(finalAmount); // Razorpay expects amount in paise/cents

      const response = await axios.post("/api/checkout/razorpay/create-order", {
        amount,
        checkoutId,
        customerInfo,
        currency: checkoutData.paymentGateway?.currency || "USD",
      });
      const order = response.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: checkoutData.paymentGateway?.currency || "USD",
        name: checkoutData.event.eventName,
        description: `Tickets for ${checkoutData.event.eventName}`,
        order_id: order.id,
        // handler: async (response: any) => {
        //   try {
        //     await axios.post("/api/checkout/razorpay/verify-payment", {
        //       ...response,
        //       checkoutId,
        //     });
        //     router.push(`/checkout/${checkoutId}/success`);
        //   } catch (error) {
        //     console.error("Payment verification failed:", error);
        //     alert("Payment verification failed");
        //   }
        // },
        handler: handlePaymentSuccess,
        prefill: {
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          email: customerInfo.email,
          contact: customerInfo.phone,
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
    } finally {
      setIsLoading(false);
    }
  };
  const formatPrice = (amount: number) => {
    const currency = checkoutData.paymentGateway?.currency;
    const conversionRate = currency === "INR" ? 86 : 1;
    const convertedAmount = amount * conversionRate;
    const symbol = currency === "INR" ? "₹" : "$";
    return `${symbol}${convertedAmount.toFixed(2)}`;
  };
  const { event, venue, cart } = checkoutData;
  return (
    <div className="relative w-full">
      <div className="absolute top-[-100px] inset-0 z-0 w-full h-full overflow-hidden">
        <img
          src={event.eventFlyer}
          alt="Background"
          className="w-full h-full object-cover object-center opacity-40 blur-[20px]"
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
                      <div className="text-2xl font-bold">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                    <div>
                      <Label className="mb-2 block text-sm font-medium">
                        Total Ticket Cost
                      </Label>
                      <div className="text-2xl font-bold text-primary">
                        <div className="text-2xl font-bold">
                          {formatPrice(total)}
                        </div>
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
              <div className="text-2xl font-bold">{formatPrice(subTotal)}</div>
            </div>
            <div className="flex items-center justify-between">
              <div>Payment Gateway Fee</div>
              <div className="text-2xl font-bold">
                <div className="text-2xl font-bold">
                  {formatPrice(paymentGatewayFee)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <Input
                  type="text"
                  placeholder="Enter coupon code"
                  className="w-full sm:w-auto flex-grow"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon}
                >
                  {isApplyingCoupon ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>

              {couponMessage && (
                <div
                  className={`text-sm ${
                    couponMessage.type === "success"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {couponMessage.message}
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-green-500">
                  <div>Discount Applied</div>
                  <div className="text-2xl font-bold">
                    -{formatPrice(discountAmount)}
                  </div>
                </div>
              )}
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold">Total</div>
              <div className="text-2xl font-bold">{formatPrice(total)}</div>
            </div>
          </div>
          <div className="grid gap-4">
            <Button
              size="lg"
              className="w-full"
              onClick={handleCompletePurchase}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Complete Purchase"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
