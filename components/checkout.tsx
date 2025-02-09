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
import Image from "next/image";

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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!customerInfo.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!customerInfo.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!customerInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!customerInfo.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!termsAccepted) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleCompletePurchase = async () => {
    if (!validateForm()) {
      return;
    }

    if (typeof window === "undefined" || !window.Razorpay) {
      console.error("Razorpay SDK not loaded");
      return;
    }

    setIsLoading(true);
    try {
      const inrAmount = total * 86; // Convert to INR only for final payment
      const amount = Math.round(inrAmount);

      const response = await axios.post("/api/checkout/razorpay/create-order", {
        amount,
        checkoutId,
        customerInfo,
        currency: "INR", // Always use INR for Razorpay
      });
      const order = response.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: checkoutData.event.eventName,
        description: `Tickets for ${checkoutData.event.eventName}`,
        order_id: order.id,
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

  const formatPrice = (amount: number, forceINR: boolean = false) => {
    if (forceINR) {
      const inrAmount = amount * 86; // Convert to INR only when forced
      return `₹${inrAmount.toFixed(2)}`;
    }
    return `$${amount}`;
  };
  const { event, venue, cart } = checkoutData;
  return (
    <div className="relative w-full min-h-screen">
      <div className="fixed top-0 left-0 right-0 bottom-0 z-0">
        <Image
          src={event.eventFlyer}
          alt="Background"
          fill
          className="object-cover object-center opacity-30 blur-[50px]"
          quality={10}
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto py-12 md:py-16 px-4 md:px-6">
        <div className="grid gap-8 md:gap-12">
          {/* Event Header Section */}
          <div className="space-y-6 bg-card/30 p-6 rounded-lg backdrop-blur-sm">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {event.eventName}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  <span className="text-foreground">
                    {new Date(event.timings[0].date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
                  <ClockIcon className="w-4 h-4 text-primary" />
                  <span className="text-foreground">
                    {event.timings[0].startTime} - {event.timings[0].endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-foreground">
                    {venue.venueName}, {venue.city}
                  </span>
                </div>
              </div>
            </div>

            {/* Ticket Cards */}
            {cart.map((item, index) => (
              <Card
                key={index}
                className="w-full max-w-3xl mx-auto border-primary/20 bg-card/50 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="col-span-1 md:col-span-1">
                      <Label className="mb-2 block text-sm font-medium text-primary">
                        Ticket Type
                      </Label>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-primary/80" />
                        <span className="text-base font-medium">
                          {item.type}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="mb-2 block text-sm font-medium text-primary">
                        Quantity
                      </Label>
                      <div className="text-2xl font-bold">{item.quantity}</div>
                    </div>
                    <div>
                      <Label className="mb-2 block text-sm font-medium text-primary">
                        Price per Ticket
                      </Label>
                      <div className="text-2xl font-bold">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                    <div>
                      <Label className="mb-2 block text-sm font-medium text-primary">
                        Total Cost
                      </Label>
                      <div className="text-2xl font-bold text-secondary">
                        {formatPrice(total)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Form Section */}
          <div className="grid gap-4 bg-card/30 p-6 rounded-lg backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName" className="text-primary">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  placeholder="Enter your name"
                  className={`bg-background/50 border-primary/20 focus:border-primary ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                  onChange={handleInputChange}
                  value={customerInfo.firstName}
                  required
                />
                {errors.firstName && (
                  <span className="text-sm text-red-500">
                    {errors.firstName}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName" className="text-primary">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  className={`bg-background/50 border-primary/20 focus:border-primary ${
                    errors.lastName ? "border-red-500" : ""
                  }`}
                  onChange={handleInputChange}
                  value={customerInfo.lastName}
                  required
                />
                {errors.lastName && (
                  <span className="text-sm text-red-500">
                    {errors.lastName}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-primary">
                  Phone *
                </Label>
                <Input
                  id="phone"
                  placeholder="Enter your phone number"
                  className={`bg-background/50 border-primary/20 focus:border-primary ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                  onChange={handleInputChange}
                  value={customerInfo.phone}
                  required
                />
                {errors.phone && (
                  <span className="text-sm text-red-500">{errors.phone}</span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-primary">
                  Email *
                </Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  className={`bg-background/50 border-primary/20 focus:border-primary ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  onChange={handleInputChange}
                  value={customerInfo.email}
                  type="email"
                  required
                />
                {errors.email && (
                  <span className="text-sm text-red-500">{errors.email}</span>
                )}
              </div>
            </div>
          </div>

          {/* Terms Section */}
          <div className="items-top flex gap-2 bg-card/30 p-4 rounded-lg">
            <Checkbox
              id="terms"
              className={`border-primary ${
                errors.terms ? "border-red-500" : ""
              }`}
              checked={termsAccepted}
              onCheckedChange={(checked) =>
                setTermsAccepted(checked as boolean)
              }
              required
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="terms"
                className="text-sm font-medium text-primary"
              >
                I agree to the terms and conditions *
              </Label>
              {errors.terms && (
                <span className="text-sm text-red-500">{errors.terms}</span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between text-xl">
            <div className="font-bold text-primary">Total</div>
            <div className="text-right">
              <div className="text-2xl font-bold text-secondary">
                {formatPrice(total)}
              </div>
              <div className="text-sm text-muted-foreground">
                (Approx. {formatPrice(total, true)} at checkout)
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          {/* Payment Summary */}
          <div className="grid gap-4 bg-card/30 p-6 rounded-lg backdrop-blur-sm">
            <div className="flex items-center justify-between text-lg">
              <div className="text-muted-foreground">Ticket Cost</div>
              <div className="font-bold">{formatPrice(subTotal)}</div>
            </div>
            <div className="flex items-center justify-between text-lg">
              <div className="text-muted-foreground">Payment Gateway Fee</div>
              <div className="font-bold">{formatPrice(paymentGatewayFee)}</div>
            </div>

            {/* Coupon Section */}
            <div className="space-y-4 py-4">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <Input
                  type="text"
                  placeholder="Enter coupon code"
                  className="bg-background/50 border-primary/20 focus:border-primary"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-primary hover:bg-primary hover:text-primary-foreground"
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
                      : "text-destructive"
                  }`}
                >
                  {couponMessage.message}
                </div>
              )}
            </div>

            {discountAmount > 0 && (
              <div className="flex items-center justify-between text-lg">
                <div className="text-green-500">Discount Applied</div>
                <div className="font-bold text-green-500">
                  -{formatPrice(discountAmount)}
                </div>
              </div>
            )}

            <Separator className="bg-primary/20" />

            <div className="flex items-center justify-between text-xl">
              <div className="font-bold text-primary">Total</div>
              <div className="text-right">
                <div className="text-2xl font-bold text-secondary">
                  {formatPrice(total)}
                </div>
                <div className="text-sm text-muted-foreground">
                  (Approx. {formatPrice(total, true)} at checkout)
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Button */}
          <Button
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold"
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
  );
}
