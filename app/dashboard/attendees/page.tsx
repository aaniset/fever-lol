"use client";
import { CardContent } from "@/components/ui/card";
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
    <main className="flex-1 overflow-auto">
      <div className="container mx-auto p-4">
        <CardContent className="p-0">
          <DataTable data={attendees} columns={columns} isLoading={isLoading} />
        </CardContent>
      </div>
    </main>
  );
}
