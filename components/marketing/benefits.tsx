"use client";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Ticket, Calendar, Zap } from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      icon: <Ticket className="w-12 h-12 text-primary-foreground" />,
      title: "Seamless Ticketing Experience",
      description:
        "Create and manage event tickets effortlessly. Our platform handles everything from QR code generation to real-time ticket validation, making entry management a breeze.",
      delay: 0.2,
    },
    {
      icon: <Calendar className="w-12 h-12 text-primary-foreground" />,
      title: "Event Management Made Simple",
      description:
        "Organize events like a pro with our comprehensive toolkit. From venue selection to attendee communication, we've streamlined every aspect of event planning.",
      delay: 0.4,
    },
    {
      icon: <Zap className="w-12 h-12 text-primary-foreground" />,
      title: "Lightning-Fast Setup",
      description:
        "Launch your event page in minutes, not hours. Our intuitive interface lets you customize everything from ticket types to promotional discounts instantly.",
      delay: 0.6,
    },
  ];

  return (
    <section
      id="benefits"
      className="py-20 lg:py-32 w-full md:py-32 px-6 lg:px-20 container max-w-7xl mx-auto"
    >
      <div className="flex flex-col items-center gap-12 mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.8,
              delay: 0.3,
              ease: [0.44, 0, 0, 1],
            },
          }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-center max-w-3xl"
        >
          Host Events Your Way
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.8,
              delay: 0.4,
              ease: [0.44, 0, 0, 1],
            },
          }}
          viewport={{ once: true }}
          className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl"
        >
          Take control of your events with our powerful, open-source platform.
          Create, manage, and sell tickets with zero hassle and complete
          flexibility.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                type: "spring",
                damping: 40,
                stiffness: 160,
                mass: 1,
                delay: benefit.delay,
              },
            }}
            viewport={{ once: true }}
          >
            <Card className="h-full p-8 bg-primary hover:bg-primary/90 transition-colors group">
              <div className="flex flex-col h-full gap-8">
                <div className="transform transition-transform group-hover:scale-110">
                  {benefit.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-medium tracking-tight text-primary-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-primary-foreground/80 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;
