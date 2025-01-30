// accordion.tsx
"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "Is there a free trial available?",
    answer: "Yes, we offer a 14-day free trial before committing.",
  },
  {
    question: "Can I integrate claimify with our existing systems?",
    answer:
      "Absolutely. claimify is designed to integrate seamlessly with most major healthcare management systems.",
  },
  {
    question: "What kind of support do you provide?",
    answer:
      "We offer 24/7 customer support, regular training sessions, and a comprehensive knowledge base to ensure you get the most out of claimify.",
  },
  {
    question: "Still have more questions?",
    answer: "Contact our help center.",
  },
];

export function AccordionFAQ() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqData.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-lg font-medium">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
