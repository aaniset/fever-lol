"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin, Mail, Shield } from "lucide-react";

const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="text-muted-foreground hover:text-primary transition-colors"
  >
    {children}
  </Link>
);

const SocialIcon = ({ href, icon: Icon }: { href: string; icon: any }) => (
  <Link
    href={href}
    target="_blank"
    className="text-muted-foreground hover:text-primary transition-colors"
  >
    <Icon className="h-5 w-5" />
  </Link>
);

const Footer = () => {
  const productLinks = [
    { label: "Host Events", href: "/events/create" },
    { label: "Pricing", href: "/pricing" },
    { label: "Venues", href: "/venues" },
    { label: "Success Stories", href: "/testimonials" },
  ];

  const companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Support", href: "/support" },
    { label: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="px-6 lg:px-20 pt-12 pb-8 bg-background border-t">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.svg"
                width={40}
                height={40}
                alt="Fever.lol"
                className="h-10 w-auto"
              />
              <h2 className="text-xl font-medium text-foreground">Fever.lol</h2>
            </Link>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Proudly Open Source</span> - Your
              event management and ticketing platform. Create, manage, and sell
              tickets for your events with ease.
            </p>
            <div className="flex items-center gap-4">
              <SocialIcon href="https://twitter.com/feverlol" icon={Twitter} />
              <SocialIcon
                href="https://linkedin.com/company/feverlol"
                icon={Linkedin}
              />
              <SocialIcon href="https://github.com/feverlol" icon={Github} />
              <SocialIcon href="mailto:hello@fever.lol" icon={Mail} />
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Platform</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Column */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">
              Ready to host your event?
            </h3>
            <p className="text-sm text-muted-foreground">
              Join thousands of event organizers who trust Fever.lol for their
              ticketing and event management needs.
            </p>
            <Button asChild className="w-full">
              <Link href="/events/create">Create Your Event</Link>
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Secure Payment Processing</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Fever.lol. All rights reserved.</p>
            <p className="hidden sm:block">•</p>
            <p>
              Developed by{" "}
              <Link
                href="https://www.techwithdeep.com"
                target="_blank"
                className="text-primary hover:underline"
              >
                Anudeep
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <FooterLink href="/terms">Terms</FooterLink>
            <FooterLink href="/privacy">Privacy</FooterLink>
            <FooterLink href="/cookies">Cookies</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
