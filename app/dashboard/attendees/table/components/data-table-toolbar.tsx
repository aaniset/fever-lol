"use client";

import { QrCode, X } from "lucide-react";

import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { ticketStatuses } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import {
  Select,
  SelectContent,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectEventFilter } from "@/app/dashboard/attendees/table/components/select-event-filter-attendees";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

interface Event {
  id: string;
  name: string;
}
// export function DataTableToolbar<TData>({
//   table,
// }: DataTableToolbarProps<TData>) {
//   const isFiltered = table.getState().columnFilters.length > 0;

//   return (
//     <div className="flex items-center justify-between">
//       <div className="flex flex-1 items-center space-x-2">
//         <Input
//           placeholder="Filter tickets..."
//           value={
//             (table.getColumn("issuedTo")?.getFilterValue() as string) ?? ""
//           }
//           onChange={(event) =>
//             table.getColumn("issuedTo")?.setFilterValue(event.target.value)
//           }
//           className="h-8 w-[150px] lg:w-[250px]"
//         />
//         {table.getColumn("ticketStatus") && (
//           <DataTableFacetedFilter
//             column={table.getColumn("ticketStatus")}
//             title="Ticket Status"
//             options={ticketStatuses}
//           />
//         )}
//         {isFiltered && (
//           <Button
//             variant="ghost"
//             onClick={() => table.resetColumnFilters()}
//             className="h-8 px-2 lg:px-3"
//           >
//             Reset
//             <X className="ml-2 h-4 w-4" />
//           </Button>
//         )}
//       </div>
//       <DataTableViewOptions table={table} />
//     </div>
//   );
// }
// table/components/data-table-toolbar.tsx
export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await axios.post("/api/events/");
        setEvents(fetchedEvents.data);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const options = events.map((event) => ({
    label: event.name,
    value: event.id,
    // label: "",
    // value: "  ",
  }));
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter attendees..."
          value={
            (table.getColumn("customerName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("customerName")?.setFilterValue(event.target.value)
          }
          className="h-8 w-full sm:w-[250px]"
        />
        <SelectEventFilter title="Select event" options={options} />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          className="h-8"
          onClick={() => {
            /* Implement scan functionality */
          }}
        >
          <QrCode className="mr-2 h-4 w-4" />
          Scan Tickets
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
