"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DataTable } from "./table/components/data-table";
import { AttendeesInfoSchema } from "@/models/attendees";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AttendeeInfo } from "@/models/attendees";
import { columns } from "./table/components/columns";
import { z } from "zod";
import axios from "axios";
export default function AttendeesPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [attendees, setAttendees] = useState<AttendeeInfo[]>([]);
  // const fetchAttendees = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await axios.post(`/api/attendees`, { eventId });
  //     const allAttendees = response.data;
  //     const cleanedAttendees = z.array(AttendeesInfoSchema).parse(allAttendees);
  //     setAttendees(cleanedAttendees);
  //   } catch (error) {
  //     console.error("Error fetching attendees:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (eventId) {
  //     fetchAttendees();
  //   }
  // }, [eventId]);

  useEffect(() => {
    axios
      .post(`/api/attendees`, { eventId })
      .then((response) => {
        const allOrders = response.data;
        const cleanedOrder = z.array(AttendeesInfoSchema).parse(allOrders);
        setAttendees(cleanedOrder);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
        setIsLoading(false);
      });
  }, [eventId]);
  console.log("orders cleaned", attendees);
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
                  <BreadcrumbPage>Attendees</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4">
            <CardContent className="p-0">
              <DataTable
                data={attendees}
                columns={columns}
                isLoading={isLoading}
              />
            </CardContent>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
