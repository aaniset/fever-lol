"use client";
import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { signOut, useSession } from "next-auth/react";
import { useDebouncedCallback } from "use-debounce";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  orgName: string;
  orgUrl: string;
}

export function OnboardingForm() {
  const session = useSession();
  const user = session.data?.user;
  const router = useRouter();
  const [urlAvailable, setUrlAvailable] = useState<boolean | null>(null);
  const [checkingUrl, setCheckingUrl] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    orgName: "",
    orgUrl: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const [firstName = "", lastName = ""] = (user.name || "").split(" ");

        try {
          const response = await axios.get("/api/onboarding");
          const userData = response.data;

          setFormData({
            firstName: firstName,
            lastName: lastName,
            email: user.email || "",
            orgName: userData.orgName || "",
            orgUrl: userData.orgUrl || "",
          });
        } catch (error) {
          // If API fails, still set the session data
          setFormData((prev) => ({
            ...prev,
            firstName,
            lastName,
            email: user.email || "",
          }));
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "orgUrl") {
      checkUrlAvailability(value);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("/api/onboarding", formData);
      toast.success("Profile completed successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkUrlAvailability = useDebouncedCallback(async (url: string) => {
    if (!url) {
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16">
          <div className="flex items-center justify-between h-full">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Fever.lol"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="text-xl font-semibold">Fever.lol</span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.image ?? ""}
                      alt={user?.name ?? "Profile picture"}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-pink-500">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    signOut({
                      callbackUrl: `${window.location.origin}/login`,
                    })
                  }
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <Card className="mx-auto max-w-lg">
            <CardHeader>
              <CardTitle className="text-xl">Welcome to Fever.lol!</CardTitle>
              <CardDescription>
                Please complete your profile to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Max"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Robinson"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    name="orgName"
                    placeholder="Fever.lol Inc."
                    value={formData.orgName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {/* <div className="grid gap-2">
                  <Label htmlFor="orgUrl">Organization URL</Label>
                  <Input
                    id="orgUrl"
                    name="orgUrl"
                    placeholder="event-url"
                    value={formData.orgUrl}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="text-sm text-muted-foreground">
                    Preview: www.fever.lol/orgs/{formData.orgUrl}
                  </div>
                </div> */}
                <div className="grid gap-2">
                  <Label htmlFor="orgUrl">Organization URL</Label>
                  <div className="relative">
                    <Input
                      id="orgUrl"
                      name="orgUrl"
                      placeholder="event-url"
                      value={formData.orgUrl}
                      onChange={handleInputChange}
                      required
                      className={`${
                        urlAvailable === true
                          ? "border-green-500"
                          : urlAvailable === false
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {checkingUrl && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent" />
                      </div>
                    )}
                  </div>
                  <div className="text-sm">
                    {urlAvailable === false && (
                      <p className="text-red-500">This URL is already taken</p>
                    )}
                    {urlAvailable === true && (
                      <p className="text-green-500">URL is available</p>
                    )}
                    <p className="text-muted-foreground">
                      Preview: www.fever.lol/orgs/{formData.orgUrl}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || urlAvailable === false}
                >
                  {isLoading ? "Saving..." : "Complete Profile"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/dashboard")}
                  disabled={isLoading}
                >
                  Skip for now
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}
