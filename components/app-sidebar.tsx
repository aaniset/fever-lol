"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Calendar,
  TicketIcon,
  Store,
  Settings,
  BarChart3,
  HelpCircle,
  Bell,
  MapPin,
  BadgePercent,
} from "lucide-react";
import { useSession } from "next-auth/react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

// const navigationData = {
//   navMain: [
//     {
//       title: "Dashboard",
//       url: "/dashboard",
//       icon: LayoutDashboard,
//       isActive: true,
//     },
//     {
//       title: "Events",
//       url: "/dashboard/events",
//       icon: Calendar,
//       items: [
//         {
//           title: "All Events",
//           url: "/dashboard/events",
//         },
//         {
//           title: "Create Event",
//           url: "/dashboard/events/create",
//         },
//         {
//           title: "Categories",
//           url: "/dashboard/events/categories",
//         },
//       ],
//     },
//     {
//       title: "Orders",
//       url: "/dashboard/orders",
//       icon: TicketIcon,
//       items: [
//         {
//           title: "All Orders",
//           url: "/dashboard/orders",
//         },
//         {
//           title: "Pending",
//           url: "/dashboard/orders/pending",
//         },
//         {
//           title: "Completed",
//           url: "/dashboard/orders/completed",
//         },
//       ],
//     },
//     {
//       title: "Attendees",
//       url: "/dashboard/attendees",
//       icon: Store,
//       items: [
//         {
//           title: "Quick Sale",
//           url: "/dashboard/attendees/sale",
//         },
//         {
//           title: "Scan Tickets",
//           url: "/dashboard/attendees/scan",
//         },
//       ],
//     },
//     {
//       title: "Analytics",
//       url: "/dashboard/analytics",
//       icon: BarChart3,
//     },
//     {
//       title: "Settings",
//       url: "/dashboard/settings",
//       icon: Settings,
//       items: [
//         {
//           title: "General",
//           url: "/dashboard/settings/general",
//         },
//         {
//           title: "Team",
//           url: "/dashboard/settings/team",
//         },
//         {
//           title: "Billing",
//           url: "/dashboard/settings/billing",
//         },
//         {
//           title: "Integrations",
//           url: "/dashboard/settings/integrations",
//         },
//       ],
//     },
//   ],
//   navSecondary: [
//     {
//       title: "Support",
//       url: "/dashboard/support",
//       icon: HelpCircle,
//     },
//     {
//       title: "Notifications",
//       url: "/dashboard/notifications",
//       icon: Bell,
//     },
//   ],
// };
const navigationData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Events",
      url: "/dashboard/events",
      icon: Calendar,
      items: [
        {
          title: "All Events",
          url: "/dashboard/events",
        },
        {
          title: "Create Event",
          url: "/dashboard/events/create",
        },
        {
          title: "Categories",
          url: "/dashboard/events/categories",
        },
      ],
    },
    {
      title: "Venues",
      url: "/dashboard/venues",
      icon: MapPin,
      items: [
        {
          title: "All Venues",
          url: "/dashboard/venues",
        },
        {
          title: "Add Venue",
          url: "/dashboard/venues/create",
        },
        {
          title: "Venue Settings",
          url: "/dashboard/venues/settings",
        },
      ],
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: TicketIcon,
      items: [
        {
          title: "All Orders",
          url: "/dashboard/orders",
        },
        {
          title: "Pending",
          url: "/dashboard/orders/pending",
        },
        {
          title: "Completed",
          url: "/dashboard/orders/completed",
        },
      ],
    },
    {
      title: "Attendees",
      url: "/dashboard/attendees",
      icon: Store,
      items: [
        {
          title: "Quick Sale",
          url: "/dashboard/attendees/sale",
        },
        {
          title: "Scan Tickets",
          url: "/dashboard/attendees/scan",
        },
      ],
    },
    {
      title: "Discount Codes",
      url: "/dashboard/discounts",
      icon: BadgePercent,
      items: [
        {
          title: "All Discounts",
          url: "/dashboard/discounts",
        },
        {
          title: "Create Discount",
          url: "/dashboard/discounts/create",
        },
        {
          title: "Discount Analytics",
          url: "/dashboard/discounts/analytics",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "/dashboard/settings/general",
        },
        {
          title: "Team",
          url: "/dashboard/settings/team",
        },
        {
          title: "Billing",
          url: "/dashboard/settings/billing",
        },
        {
          title: "Integrations",
          url: "/dashboard/settings/integrations",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/dashboard/support",
      icon: HelpCircle,
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: Bell,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex bg-primary-foreground aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <Image
                    src="/logo.svg"
                    alt="Fever.lol"
                    className="w-full h-full p-1"
                    width={64}
                    height={64}
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Fever.lol</span>
                  <span className="truncate text-xs">Event Management</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData.navMain} />
        <NavSecondary items={navigationData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: session?.user?.name || "",
            email: session?.user?.email || "",
            avatar: session?.user?.image || "/avatars/default.png",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
