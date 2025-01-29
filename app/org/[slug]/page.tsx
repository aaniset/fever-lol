// import { EventsList } from "@/components/events-list";
// import { notFound } from "next/navigation";
// import axios from "axios";

// interface OrganizationData {
//   id: string;
//   name: string;
// }

// async function getOrganizationData(slug: string) {
//   try {
//     const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
//     const response = await axios.post(
//       `${baseURL}/api/public/events`,
//       {
//         slug: slug,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching organization data:", error);
//     return null;
//   }
// }

// interface PageProps {
//   params: {
//     slug: string;
//   };
// }

// export default async function OrganizationPage({ params }: PageProps) {
//   const { slug } = params;

//   if (!slug) {
//     notFound();
//   }
//   console.log("data", slug);

//   const data = await getOrganizationData(slug);
//   if (!data) {
//     notFound();
//   }

//   return <EventsList organization={data} />;
// }
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
