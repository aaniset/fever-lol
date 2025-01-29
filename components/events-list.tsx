// components/events-list.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRightIcon,
  CalendarIcon,
  MapPinIcon,
  MountainIcon,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  isNew?: boolean;
  isPopular?: boolean;
  eventFlyer?: string;
}

interface Organization {
  name: string;
  avatar: string;
  events: Event[];
}

export function EventsList({ slug }: { slug: string }) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // const baseURL =
        //   process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const response = await axios.post(
          `/api/public/events`,
          { slug },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setOrganization(response.data);
      } catch (err) {
        setError("Failed to load organization data");
        console.error("Error fetching organization data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !organization) {
    return <div>{error || "Failed to load organization data"}</div>;
  }

  return (
    <div className="flex flex-col min-h-dvh dark:bg-[url('/pattern.svg')] dark:bg-cover dark:bg-no-repeat dark:bg-center dark:text-foreground">
      <main className="flex-1 py-12 md:py-24 lg:py-32 mx-auto w-full max-w-7xl">
        <div className="container px-4 md:px-6 grid gap-12">
          <div className="grid gap-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Discover Upcoming Events
            </h1>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-muted-foreground">
              Check out the latest events hosted by our community. Discover new
              experiences and connect with like-minded individuals.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Avatar className="w-10 h-10 border">
                <AvatarImage src={organization.avatar} />
                <AvatarFallback>{organization.name[0]}</AvatarFallback>
              </Avatar>
              <div className="font-semibold dark:text-foreground">
                {organization.name}
              </div>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 max-w-3xl mx-auto w-full">
            {/* {organization.events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group grid gap-4 bg-muted dark:bg-card dark:text-card-foreground rounded-lg overflow-hidden hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors"
              >
                <div className="p-4 grid gap-2">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">
                      {event.title}
                      {event.isNew && (
                        <Badge variant="secondary" className="ml-2">
                          New
                        </Badge>
                      )}
                      {event.isPopular && (
                        <Badge className="ml-2">Popular</Badge>
                      )}
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-primary dark:text-primary-foreground" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground">
                    <MapPinIcon className="w-4 h-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground">
                    <CalendarIcon className="w-4 h-4" />
                    {event.date}
                  </div>
                </div>
              </Link>
            ))} */}
            {organization.events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group grid gap-4 bg-muted dark:bg-card dark:text-card-foreground rounded-lg overflow-hidden hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors"
              >
                <div className="p-4 flex items-start gap-4">
                  {/* Event Flyer Image */}
                  <div className="flex-shrink-0">
                    <Avatar className="w-16 h-16 rounded-lg">
                      <AvatarImage
                        src={event.eventFlyer}
                        alt={event.title}
                        className="object-cover"
                      />
                      <AvatarFallback className="rounded-lg">
                        {event.title[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 grid gap-2">
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold">
                        {event.title}
                        {event.isNew && (
                          <Badge variant="secondary" className="ml-2">
                            New
                          </Badge>
                        )}
                        {event.isPopular && (
                          <Badge className="ml-2">Popular</Badge>
                        )}
                      </div>
                      <ArrowRightIcon className="w-5 h-5 text-primary dark:text-primary-foreground" />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground">
                      <MapPinIcon className="w-4 h-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground">
                      <CalendarIcon className="w-4 h-4" />
                      {event.date}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t dark:border-t-muted">
        <p className="text-xs text-muted-foreground dark:text-muted-foreground">
          &copy; 2024 fever.lol. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4 dark:text-muted-foreground"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4 dark:text-muted-foreground"
            prefetch={false}
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
