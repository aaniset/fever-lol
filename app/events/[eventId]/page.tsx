"use client";
import { EventHomeDetails } from "@/components/event-home-details";
import Link from "next/link";
import Image from "next/image";
export default function EventsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="border-b  bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
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
          </div>
        </div>
      </header>
      <EventHomeDetails />
    </div>
  );
}
