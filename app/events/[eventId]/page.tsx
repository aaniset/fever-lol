"use client";
import { EventHomeDetails } from "@/components/event-home-details";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function EventsPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col mb-10 bg-gradient-to-b from-background to-muted/40">
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "border-b bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 h-16">
          <div className="flex items-center justify-between h-full">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 group hover:opacity-90 transition-all duration-200"
            >
              <div className="relative overflow-hidden rounded-md shadow-lg">
                <Image
                  src="/logo.svg"
                  alt="Fever.lol"
                  width={32}
                  height={32}
                  className="h-8 w-auto bg-primary p-1.5 transform group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 ring-1 ring-primary/20 rounded-md" />
              </div>
              <span className="text-xl font-semibold text-foreground tracking-tight">
                <span className="text-primary">Fever</span>
                <span className="text-secondary">.lol</span>
              </span>
            </Link>
          </div>
        </div>
      </header>
      <EventHomeDetails />
    </div>
  );
}
