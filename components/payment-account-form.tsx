"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const paymentFormSchema = z.object({
  paymentGateway: z
    .string()
    .nonempty({ message: "Please select a payment gateway" }),
  razorpayKeyId: z
    .string()
    .min(20, { message: "Please enter a valid Razorpay Key ID" })
    .optional()
    .nullable(),
  razorpayKeySecret: z
    .string()
    .min(20, { message: "Please enter a valid Razorpay Key Secret" })
    .optional()
    .nullable(),
  stripePublishableKey: z
    .string()
    .min(20, { message: "Please enter a valid Stripe Publishable Key" })
    .optional()
    .nullable(),
  stripeSecretKey: z
    .string()
    .min(20, { message: "Please enter a valid Stripe Secret Key" })
    .optional()
    .nullable(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export function PaymentForm() {
  const [gateway, setGateway] = useState<"razorpay" | "stripe" | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showRazorpaySecret, setShowRazorpaySecret] = useState(false);
  const [showStripeSecret, setShowStripeSecret] = useState(false);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentGateway: "",
      razorpayKeyId: null,
      razorpayKeySecret: null,
      stripePublishableKey: null,
      stripeSecretKey: null,
    },
  });

  useEffect(() => {
    const fetchPaymentConfig = async () => {
      try {
        const response = await fetch("/api/payment-config");
        if (!response.ok) throw new Error("Failed to fetch configuration");

        const data = await response.json();
        if (data) {
          // Transform empty strings to null
          const formattedData = {
            ...data,
            razorpayKeyId: data.razorpayKeyId || null,
            razorpayKeySecret: data.razorpayKeySecret || null,
            stripePublishableKey: data.stripePublishableKey || null,
            stripeSecretKey: data.stripeSecretKey || null,
          };
          form.reset(formattedData);
          setGateway(data.paymentGateway || "");
        }
      } catch (error) {
        toast.error("Failed to load configuration");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentConfig();
  }, [form]);

  const onSubmit = async (data: PaymentFormValues) => {
    setIsSubmitting(true);
    try {
      // Filter out null values and prepare the payload
      const payload = {
        paymentGateway: data.paymentGateway,
        ...(data.paymentGateway === "razorpay" && {
          razorpayKeyId: data.razorpayKeyId || "",
          razorpayKeySecret: data.razorpayKeySecret || "",
        }),
        ...(data.paymentGateway === "stripe" && {
          stripePublishableKey: data.stripePublishableKey || "",
          stripeSecretKey: data.stripeSecretKey || "",
        }),
      };

      const response = await fetch("/api/payment-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save configuration");
      }

      toast.success("Payment gateway configuration saved successfully");
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save configuration"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Gateway Configuration</CardTitle>
        <CardDescription>
          Configure your payment gateway settings for accepting payments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="paymentGateway"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Payment Gateway
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      setGateway(value as "razorpay" | "stripe");
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment gateway" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="razorpay">Razorpay (India)</SelectItem>
                      <SelectItem value="stripe">Stripe (USA)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {gateway === "razorpay" && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="razorpayKeyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Razorpay Key ID
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="rzp_live_xxxxxxxxxxxxxx"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(e.target.value || null)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="razorpayKeySecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Razorpay Key Secret
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showRazorpaySecret ? "text" : "password"}
                            placeholder="Enter your Razorpay Key Secret"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(e.target.value || null)
                            }
                          />
                          <button
                            type="button"
                            onClick={() => setShowRazorpaySecret(!showRazorpaySecret)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            {showRazorpaySecret ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {gateway === "stripe" && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="stripePublishableKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Stripe Publishable Key
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="pk_live_xxxxxxxxxxxxxx"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(e.target.value || null)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stripeSecretKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Stripe Secret Key
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showStripeSecret ? "text" : "password"}
                            placeholder="Enter your Stripe Secret Key"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(e.target.value || null)
                            }
                          />
                          <button
                            type="button"
                            onClick={() => setShowStripeSecret(!showStripeSecret)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            {showStripeSecret ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
                  Saving...
                </>
              ) : (
                "Save Configuration"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
