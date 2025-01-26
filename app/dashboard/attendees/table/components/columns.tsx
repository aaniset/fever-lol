"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { AttendeeInfo } from "@/models/attendees";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export const columns: ColumnDef<AttendeeInfo>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "orderId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Id" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("orderId")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "eventName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Event Name" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate font-medium">
        {row.getValue("eventName") || "N/A"}
      </span>
    ),
    enableSorting: true,
    enableHiding: false,
  },

  {
    accessorKey: "customerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer names" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate font-medium">
        {row.getValue("customerName")}
      </span>
    ),
    enableSorting: true,
    enableHiding: false,
  },

  {
    accessorKey: "ticketType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ticket type" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate font-medium">
        {row.getValue("ticketType")}
      </span>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "checkedIn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">
        {row.getValue("checkedIn") ? (
          <Badge variant="default">Checked in</Badge>
        ) : (
          <Badge variant="outline">Not checked in</Badge>
        )}
      </span>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "checkInNow",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="action" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px]">
        <Button variant="link" className=" ">
          <CheckCircle className="h-3.5" /> Check in now
        </Button>
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "checkedInTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Checked in time" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px]">
        {row.getValue("checkedInTime")
          ? new Date(row.getValue("checkedInTime"))?.toLocaleDateString()
          : "-"}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
];
