"use client";
import { SetStateAction, useState } from "react";
import Link from "next/link";

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

export function OnboardingForm() {
  const [orgUrl, setOrgUrl] = useState("");

  const handleOrgUrlChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setOrgUrl(e.target.value);
  };

  return (
    <Card className="mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Welcome to Beat Fever!</CardTitle>
        <CardDescription>
          Please complete your profile to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" placeholder="Max" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" placeholder="Robinson" required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="org-name">Organization Name</Label>
            <Input id="org-name" placeholder="Beat Fever Inc." required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="org-url">Organization URL</Label>
            <Input
              id="org-url"
              placeholder="event-url"
              value={orgUrl}
              onChange={handleOrgUrlChange}
              required
            />
            <div className="text-sm text-muted-foreground">
              Preview: www.beatfever.ai/events/{orgUrl}
            </div>
          </div>
          <Button type="submit" className="w-full">
            Complete Profile
          </Button>
          <Button variant="outline" className="w-full">
            Skip for now
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Need help?{" "}
          <Link href="#" className="underline">
            Contact Support
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
