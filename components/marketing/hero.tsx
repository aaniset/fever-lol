"use client";
import { ChevronRight, Calendar, Ticket, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative bg-background pt-24 pb-16 md:pt-32 md:pb-24">
      <motion.div
        className="container mx-auto px-6 lg:px-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex justify-center">
          <div
            className={cn(
              "inline-flex items-center px-4 py-1.5 bg-primary/10 rounded-full text-sm font-medium text-primary",
              "group"
            )}
          >
            <span>🚀 Launch Special: Zero Platform Fees</span>
            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-8 md:mt-12 text-center"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl mx-auto">
            Turn Up the <span className="text-primary">fever</span> for Your
            Next Event
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            The open-source event platform that puts you in control. Create,
            sell, and manage events with complete freedom. No hidden fees, no
            limitations – just pure event magic.
          </p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="group">
              <Link href="/login">
                Start Creating Free
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="group">
              <Link href="/events">
                Discover Events
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-16 flex justify-center"
        >
          <div className="grid grid-cols-3 md:grid-cols-3 gap-8 md:gap-12">
            <div className="flex flex-col items-center">
              <Calendar className="w-6 h-6 text-primary mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                Open-Source Freedom
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Ticket className="w-6 h-6 text-primary mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                Zero Platform Fees
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Sparkles className="w-6 h-6 text-primary mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                Full Customization
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
