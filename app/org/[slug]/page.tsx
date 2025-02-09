// app/org/[slug]/page.tsx
import { EventsList } from "@/components/events-list";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    slug: string;
  };
}

export default function OrganizationPage({ params }: PageProps) {
  const { slug } = params;
  console.log("slug", slug);
  if (!slug) {
    notFound();
  }

  return <EventsList slug={slug} />;
}
