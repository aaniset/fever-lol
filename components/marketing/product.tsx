"use client";
import { motion } from "framer-motion";
import { Calendar, Settings, MessageSquare } from "lucide-react";

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
