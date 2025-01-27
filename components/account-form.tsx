"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useDebouncedCallback } from "use-debounce";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Simplified validation schema
// const accountFormSchema = z.object({
//   firstName: z.string().min(2, "First name must be at least 2 characters"),
//   lastName: z.string().min(2, "Last name must be at least 2 characters"),
//   email: z.string().email("Please enter a valid email address"),
//   phone: z
//     .string()
//     .regex(/^\d{10,15}$/, "Phone number must be between 10-15 digits")
//     .optional()
//     .or(z.literal("")),
//   orgName: z.string().min(1, "Organization name is required"),
//   orgDescription: z.string().min(1, "Organization description is required"),
//   orgUrl: z
//     .string()
//     .min(1, "Organization URL is required")
//     .regex(
//       /^[a-zA-Z0-9-]+$/,
//       "URL can only contain letters, numbers, and hyphens"
//     ),
//   ctaUrl: z.string().url("Please enter a valid URL"),
// });
// Modified validation schema to make all fields optional
const accountFormSchema = z.object({
  firstName: z.string().optional().or(z.literal("")),
  lastName: z.string().optional().or(z.literal("")),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^\d{10,15}$/, "Phone number must be between 10-15 digits")
    .optional()
    .or(z.literal("")),
  orgName: z.string().optional().or(z.literal("")),
  orgDescription: z.string().optional().or(z.literal("")),
  orgUrl: z
    .string()
    .regex(
      /^[a-zA-Z0-9-]+$/,
      "URL can only contain letters, numbers, and hyphens"
    )
    .optional()
    .or(z.literal("")),
  ctaUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountForm() {
  const [urlAvailable, setUrlAvailable] = useState<boolean | null>(null);
  const [checkingUrl, setCheckingUrl] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialOrgUrl, setInitialOrgUrl] = useState<string>("");

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      orgName: "",
      orgDescription: "",
      orgUrl: "",
      ctaUrl: "",
    },
  });

  const checkUrlAvailability = useDebouncedCallback(async (url: string) => {
    if (!url || url === initialOrgUrl) {
      setUrlAvailable(null);
      return;
    }

    setCheckingUrl(true);
    try {
      const response = await axios.get(
        `/api/check-url?orgUrl=${encodeURIComponent(url)}`
      );
      setUrlAvailable(response.data.available);
    } catch (error) {
      console.error("Error checking URL availability:", error);
      setUrlAvailable(null);
    } finally {
      setCheckingUrl(false);
    }
  }, 500);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/profile");
        if (response.data) {
          form.reset(response.data);
          setInitialOrgUrl(response.data.orgUrl || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data. Please try again later.");
      }
    };

    fetchUserData();
  }, [form]);

  const onSubmit = async (data: AccountFormValues) => {
    const orgUrlChanged = data.orgUrl !== initialOrgUrl;
    if (orgUrlChanged && !urlAvailable && data.orgUrl) {
      toast.error("Please choose a different organization URL");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post("/api/profile", data);
      if (response.status === 200) {
        toast.success("Profile updated successfully");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Details</CardTitle>
        <CardDescription>Update your account details below.</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-2xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="orgName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Organization name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="orgDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your organization"
                      className="resize-none h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="orgUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization URL</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="event-url"
                        className={`${
                          field.value !== initialOrgUrl && urlAvailable === true
                            ? "border-green-500"
                            : field.value !== initialOrgUrl && urlAvailable === false
                            ? "border-red-500"
                            : ""
                        }`}
                        onChange={(e) => {
                          field.onChange(e);
                          checkUrlAvailability(e.target.value);
                        }}
                      />
                      {checkingUrl && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  {field.value !== initialOrgUrl && urlAvailable === false && (
                    <p className="text-sm text-red-500">
                      This URL is already taken
                    </p>
                  )}
                  {field.value !== initialOrgUrl && urlAvailable === true && (
                    <p className="text-sm text-green-500">URL is available</p>
                  )}
                  <FormDescription>
                    Preview: www.fever.lol/orgs/{field.value}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ctaUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Call to Action URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://www.instagram.com/your_account"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a URL for visitors to follow your organization
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting || (form.getValues("orgUrl") !== initialOrgUrl && urlAvailable === false)}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
                  Saving...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
