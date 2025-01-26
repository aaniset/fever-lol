"use client";

import { useState } from "react";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@radix-ui/react-dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const paymentFormSchema = z.object({
  accountHolderName: z
    .string()
    .min(2, { message: "Account holder name must be at least 2 characters." }),
  paymentGateway: z
    .string()
    .nonempty({ message: "Please select a payment gateway" }),
  razorpayKeyId: z
    .string()
    .min(20, { message: "Please enter a valid Razorpay Key ID" })
    .optional(),
  razorpayKeySecret: z
    .string()
    .min(20, { message: "Please enter a valid Razorpay Key Secret" })
    .optional(),
  stripePublishableKey: z
    .string()
    .min(20, { message: "Please enter a valid Stripe Publishable Key" })
    .optional(),
  stripeSecretKey: z
    .string()
    .min(20, { message: "Please enter a valid Stripe Secret Key" })
    .optional(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export function PaymentForm() {
  const [gateway, setGateway] = useState<"razorpay" | "stripe" | "">("");
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
  });

  function onSubmit(data: PaymentFormValues) {
    toast.success("Payment gateway configuration saved", {
      description:
        "Your payment gateway settings have been updated successfully.",
      duration: 3000,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Gateway Configuration</CardTitle>
        <CardDescription>
          Configure your payment gateway settings for accepting payments. Make
          sure to keep your API keys secure.
        </CardDescription>
      </CardHeader>
      <Separator />
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
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment gateway" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="razorpay">Razorpay (India)</SelectItem>
                      <SelectItem value="stripe">Stripe (USA)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose your preferred payment gateway based on your region.
                  </FormDescription>
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
                        />
                      </FormControl>
                      <FormDescription>
                        Enter your Razorpay Key ID from your dashboard.
                      </FormDescription>
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
                        <Input
                          type="password"
                          placeholder="Enter your Razorpay Key Secret"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Your Razorpay Key Secret will be encrypted.
                      </FormDescription>
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
                        />
                      </FormControl>
                      <FormDescription>
                        Enter your Stripe Publishable Key from your dashboard.
                      </FormDescription>
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
                        <Input
                          type="password"
                          placeholder="Enter your Stripe Secret Key"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Your Stripe Secret Key will be encrypted.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </form>
        </Form>
      </CardContent>

      <CardFooter className="border-t px-6 py-4">
        <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
          Save Configuration
        </Button>
      </CardFooter>
    </Card>
  );
}
