"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Twitter, Instagram, Mail, ExternalLink } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const href = e.currentTarget.href;
    const targetId = href.replace(/.*#/, "");
    const elem = document.getElementById(targetId);
    elem?.scrollIntoView({
      behavior: "smooth",
    });
    setOpen(false);
  };

  const NavLink = ({
    href,
    children,
    external,
  }: {
    href: string;
    children: React.ReactNode;
    external?: boolean;
  }) => (
    <Link
      href={href}
      onClick={external ? undefined : handleScroll}
      target={external ? "_blank" : undefined}
      className="flex items-center justify-between text-base font-medium text-foreground hover:text-primary transition-colors"
    >
      {children}
      {external && <ExternalLink className="h-4 w-4 ml-1" />}
    </Link>
  );

  const SocialLink = ({
    href,
    icon: Icon,
    label,
  }: {
    href: string;
    icon: any;
    label: string;
  }) => (
    <Link
      href={href}
      target="_blank"
      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
    >
      <Icon className="h-5 w-5" />
      <span className="text-sm">{label}</span>
    </Link>
  );

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      whileInView={{
        opacity: 1,
        transition: {
          duration: 1,
          ease: [0.44, 0, 0, 1],
        },
      }}
      viewport={{
        amount: "all",
        once: true,
      }}
      className="px-6 lg:px-20 py-6 flex items-center justify-between w-full fixed top-0 left-0 bg-background/80 backdrop-blur-sm z-50"
    >
      <Link href="/" className="flex items-center gap-2.5">
        <Image
          src="/logo.svg"
          width={40}
          height={40}
          alt="fever.lol"
          className="h-10 w-auto"
        />
        <h2 className="text-xl font-medium text-foreground">fever.lol</h2>
      </Link>

      <div className="hidden md:flex items-center space-x-8">
        <NavLink href="#benefits">Benefits</NavLink>
        <NavLink href="#product">Product</NavLink>
        <NavLink href="#faqs">FAQs</NavLink>
      </div>

      <Button asChild className="hidden md:inline-flex">
        <Link href="/login">Create Event</Link>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
            >
              <path
                d="M3 5h18M3 12h18M3 19h18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[300px] sm:w-[400px] flex flex-col overflow-y-auto"
        >
          <div className="flex-1">
            <nav className="flex flex-col space-y-4 mt-8">
              <NavLink href="#benefits">Benefits</NavLink>
              <NavLink href="#product">Product</NavLink>
              <NavLink href="#faqs">FAQs</NavLink>
            </nav>
            <Button asChild className="mt-8 w-full">
              <Link href="/login">Create Event</Link>
            </Button>

            <div className="mt-8">
              <Separator className="my-4" />
              <h3 className="font-medium mb-4">Quick Links</h3>
              <div className="space-y-3">
                <NavLink href="/login" external>
                  Browse Events
                </NavLink>
                <NavLink href="/login" external>
                  Venues
                </NavLink>
                <NavLink href="/login" external>
                  Dashboard
                </NavLink>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="mt-auto pt-4">
            <Separator className="my-4" />
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <SocialLink
                  href="https://twitter.com/feverlol"
                  icon={Twitter}
                  label="Follow on Twitter"
                />
                <SocialLink
                  href="https://instagram.com/fever.lol"
                  icon={Instagram}
                  label="Follow on Instagram"
                />
                <SocialLink
                  href="mailto:hello@fever.lol"
                  icon={Mail}
                  label="Contact Support"
                />
              </div>
              <p className="text-xs text-muted-foreground pt-4">
                © {new Date().getFullYear()} fever.lol. All rights reserved.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </motion.nav>
  );
};

export default Navbar;
