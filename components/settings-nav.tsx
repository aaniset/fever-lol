import React from "react";
import Link from "next/link";

interface NavProps {
  activeItem: string;
}

const SettingsNav: React.FC<NavProps> = ({ activeItem }) => {
  const items = [
    { name: "General", href: "/settings" },

    { name: "Payment Account", href: "/settings/payment-account" },
    { name: "Request Feature", href: "/settings/request-feature" },
    { name: "Support", href: "/settings/support" },
  ];

  return (
    <nav className="grid gap-4 text-sm text-muted-foreground">
      {items.map((item) => (
        <Link key={item.name} href={item.href}>
          <div
            className={`${
              item.name === activeItem ? "font-semibold text-primary" : ""
            }`}
          >
            {item.name}
          </div>
        </Link>
      ))}
    </nav>
  );
};

export default SettingsNav;
