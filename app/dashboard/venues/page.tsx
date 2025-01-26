import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { VenuesTable } from "@/components/venue-details-table";
const dummyVenues = [
  {
    id: 1,
    name: "Convention Center",
    addressLine1: "123 Main St",
    city: "Los Angeles",
    state: "CA",
    capacity: 5000,
    mapsLink: "https://maps.google.com/?q=Convention+Center",
  },
  {
    id: 2,
    name: "Downtown Hall",
    addressLine1: "456 Elm St",
    city: "San Francisco",
    state: "CA",
    capacity: 3000,
    mapsLink: "https://maps.google.com/?q=Downtown+Hall",
  },
  {
    id: 3,
    name: "Grand Ballroom",
    addressLine1: "789 Oak St",
    city: "San Diego",
    state: "CA",
    capacity: 2000,
    mapsLink: "https://maps.google.com/?q=Grand+Ballroom",
  },
  {
    id: 4,
    name: "City Park Pavilion",
    addressLine1: "101 Pine St",
    city: "Sacramento",
    state: "CA",
    capacity: 1000,
    mapsLink: "https://maps.google.com/?q=City+Park+Pavilion",
  },
  {
    id: 5,
    name: "Tech Conference Center",
    addressLine1: "202 Maple St",
    city: "San Jose",
    state: "CA",
    capacity: 2500,
    mapsLink: "https://maps.google.com/?q=Tech+Conference+Center",
  },
  {
    id: 6,
    name: "Beachside Venue",
    addressLine1: "303 Birch St",
    city: "Santa Monica",
    state: "CA",
    capacity: 1500,
    mapsLink: "https://maps.google.com/?q=Beachside+Venue",
  },
  {
    id: 7,
    name: "Riverside Hall",
    addressLine1: "404 Cedar St",
    city: "Fresno",
    state: "CA",
    capacity: 1200,
    mapsLink: "https://maps.google.com/?q=Riverside+Hall",
  },
  {
    id: 8,
    name: "Mountain View Center",
    addressLine1: "505 Walnut St",
    city: "Palo Alto",
    state: "CA",
    capacity: 1800,
    mapsLink: "https://maps.google.com/?q=Mountain+View+Center",
  },
  {
    id: 9,
    name: "Lakefront Pavilion",
    addressLine1: "606 Cherry St",
    city: "Oakland",
    state: "CA",
    capacity: 2200,
    mapsLink: "https://maps.google.com/?q=Lakefront+Pavilion",
  },
  {
    id: 10,
    name: "Urban Loft Venue",
    addressLine1: "707 Spruce St",
    city: "Berkeley",
    state: "CA",
    capacity: 1300,
    mapsLink: "https://maps.google.com/?q=Urban+Loft+Venue",
  },
];
export default function VenuesPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Venues</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <VenuesTable venues={dummyVenues} />
          {/* Add your events content here */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
