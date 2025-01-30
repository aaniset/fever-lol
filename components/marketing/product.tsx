"use client";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  PenTool,
  TicketCheck,
  UserCheck,
  BarChart3,
  Settings,
  MessageSquare,
} from "lucide-react";

const Product = () => {
  return (
    <section
      id="product"
      className="flex flex-col items-center w-full py-24 md:py-32 px-6 lg:px-20 gap-20 bg-background"
    >
      {/* Header Section */}
      <div className="max-w-4xl flex flex-col items-center gap-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              type: "spring",
              damping: 40,
              stiffness: 150,
            },
          }}
          viewport={{ once: true }}
          className="bg-secondary px-3 py-2 rounded-xl"
        >
          <span className="text-xs font-semibold tracking-wider uppercase text-secondary-foreground">
            Create Unforgettable Events
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.8 },
          }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-medium tracking-tight"
        >
          Your All-in-One Event Management Platform
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, delay: 0.1 },
          }}
          viewport={{ once: true }}
          className="text-lg text-muted-foreground"
        >
          Host, manage, and sell tickets for your events with powerful tools
          designed to make your life easier and your events more successful.
        </motion.p>
      </div>

      {/* Process Cards */}
      <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="p-8 flex flex-col justify-between">
          <div className="flex items-center justify-center aspect-video rounded-lg bg-secondary mb-6">
            <PenTool className="w-24 h-24 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-medium mb-2">Create Your Event</h3>
            <p className="text-muted-foreground">
              Set up your event in minutes with our intuitive dashboard. Add
              details, upload images, and customize your event page.
            </p>
          </div>
        </Card>

        <Card className="p-8 flex flex-col justify-between">
          <div className="flex items-center justify-center aspect-video rounded-lg bg-secondary mb-6">
            <TicketCheck className="w-24 h-24 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-medium mb-2">Ticket Management</h3>
            <p className="text-muted-foreground">
              Create multiple ticket types, set prices, and manage capacity.
              Handle early bird offers and VIP packages with ease.
            </p>
          </div>
        </Card>

        <Card className="p-8 bg-primary text-primary-foreground">
          <div className="flex items-center justify-center aspect-video rounded-lg bg-primary-foreground/10 mb-6">
            <UserCheck className="w-24 h-24 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-2xl font-medium mb-2">Attendee Management</h3>
            <p className="text-primary-foreground/90">
              Track registrations, communicate with attendees, and manage
              check-ins all from one central dashboard.
            </p>
          </div>
        </Card>

        <Card className="p-8">
          <div className="flex items-center justify-center aspect-video rounded-lg bg-secondary mb-6">
            <BarChart3 className="w-24 h-24 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-medium mb-2">Real-time Analytics</h3>
            <p className="text-muted-foreground">
              Get detailed insights into ticket sales, attendance rates, and
              revenue with our comprehensive analytics tools.
            </p>
          </div>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: <Settings className="w-6 h-6 text-primary" />,
            title: "Seamless Setup",
            description:
              "Create and manage multiple ticket types, handle discounts, and process payments securely through our platform",
          },
          {
            icon: <Calendar className="w-6 h-6 text-primary" />,
            title: "Event Management",
            description:
              "Organize venues, schedules, and staff assignments. Keep track of everything from one central dashboard",
          },
          {
            icon: <MessageSquare className="w-6 h-6 text-primary" />,
            title: "Attendee Engagement",
            description:
              "Provide a smooth registration process, automated communications, and easy check-in for your attendees",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-lg border bg-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                delay: index * 0.1,
                duration: 0.5,
              },
            }}
            viewport={{ once: true }}
          >
            {feature.icon}
            <h3 className="mt-4 font-medium">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Product;
