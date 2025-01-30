"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronRight } from "lucide-react";

const faqItems = [
  {
    question: "How does fever.lol help event organizers?",
    answer:
      "fever.lol provides a comprehensive platform for event creation, ticket management, and attendee engagement. Our platform streamlines everything from venue selection to real-time analytics, making event management effortless.",
  },
  {
    question: "What types of events can I host on fever.lol?",
    answer:
      "You can host any type of event - from conferences and workshops to concerts and social gatherings. Our platform is flexible enough to accommodate both small meetups and large-scale events.",
  },
  {
    question: "How does the ticketing system work?",
    answer:
      "Our ticketing system offers seamless ticket creation, customizable pricing tiers, and automatic QR code generation. Attendees can easily purchase and store their tickets digitally, while organizers get real-time sales tracking.",
  },
  {
    question: "Is the platform secure for payments?",
    answer:
      "Yes, we implement industry-standard security measures for all transactions. Our payment processing is fully encrypted and compliant with global security standards to protect both organizers and attendees.",
  },
  {
    question: "What analytics and insights do you provide?",
    answer:
      "Get comprehensive insights including ticket sales trends, attendance rates, revenue analytics, and attendee demographics. These real-time metrics help you make data-driven decisions for your events.",
  },
  {
    question: "What support do you offer to organizers?",
    answer:
      "We provide 24/7 technical support, detailed documentation, and dedicated account managers for large events. Our team is always ready to help you create successful events.",
  },
];

const Faqs = () => {
  return (
    <section
      id="faqs"
      className="flex flex-col items-center w-full py-16 md:py-20 px-6 md:px-8 xl:px-16 gap-16 md:gap-20 relative bg-background"
    >
      <div className="w-full flex flex-col items-center gap-3 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              type: "spring",
              damping: 40,
              stiffness: 150,
              mass: 1,
              delay: 0.2,
            },
          }}
          viewport={{ once: true }}
        >
          <Badge variant="secondary" className="font-mono uppercase">
            Event Planning Made Simple
          </Badge>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              type: "spring",
              damping: 40,
              stiffness: 150,
              mass: 1,
              delay: 0.3,
            },
          }}
          viewport={{ once: true }}
          className="text-center space-y-2"
        >
          <h3 className="text-4xl md:text-5xl font-medium text-muted-foreground">
            Questions about
          </h3>
          <h3 className="text-4xl md:text-5xl font-medium">
            hosting your event?
          </h3>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{
          opacity: 1,
          transition: { duration: 0.8, delay: 0.3 },
        }}
        viewport={{ once: true }}
        className="w-full max-w-3xl"
      >
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            damping: 40,
            stiffness: 160,
            mass: 1,
            delay: 0.1,
          },
        }}
        viewport={{ once: true }}
        className="w-full max-w-7xl bg-primary rounded-3xl overflow-hidden"
      >
        <div className="flex flex-col xl:flex-row">
          <div className="flex flex-col gap-12 p-10 md:p-16">
            <h2 className="text-4xl md:text-5xl font-medium text-primary-foreground max-w-xl">
              Proudly open-source, <br className="hidden sm:block" />
              built for extraordinary events
            </h2>

            <Button
              size="lg"
              variant="outline"
              className="w-full md:w-fit group hover:bg-white/90"
              asChild
            >
              <Link href="/login">
                Start Hosting Events
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
          <Image
            src="/product/image.png"
            alt="Event management dashboard preview"
            width={800}
            height={600}
            className="h-[400px] xl:h-auto xl:w-1/2 object-cover"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Faqs;
