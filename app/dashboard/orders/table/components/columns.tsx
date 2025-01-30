"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import {  orderStatuses, paymentStatuses,  } from "../data/data";
// import { Order as Task } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { OrderType } from "@/models/orders";

export const columns: ColumnDef<OrderType>[] = [
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

      <DataTableColumnHeader column={column} title="Order ID" />

    ),

    cell: ({ row }) => (

      <div className="w-[80px]">{row.getValue("orderId")}</div>

    ),

    enableSorting: true,

    enableHiding: false,

  },

  {

    accessorKey: "orderDate",

    header: ({ column }) => (

      <DataTableColumnHeader column={column} title="Order Date" />

    ),

    cell: ({ row }) => (

      <div className="w-[100px]">

        {new Date(row.getValue("orderDate")).toLocaleDateString()}

      </div>

    ),

    enableSorting: true,

    enableHiding: false,

  },

  {

    accessorKey: "customerName",

    header: ({ column }) => (

      <DataTableColumnHeader column={column} title="Customer Name" />

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

    accessorKey: "eventName",

    header: ({ column }) => (

      <DataTableColumnHeader column={column} title="Event Name" />

    ),

    cell: ({ row }) => {

      // const event = events.find(

      //   (event) => event.value === row.original.eventName

      // );

      return (

        <span className="max-w-[200px] truncate font-medium">

          { row.getValue("eventName")}

        </span>

      );

    },

    enableSorting: true,

    enableHiding: false,

  },

  {

    accessorKey: "totalAmountPaid",

    header: ({ column }) => (

      <DataTableColumnHeader column={column} title="Total Amount Paid" />

    ),

    cell: ({ row }) => (

      <span className="font-medium">${row.getValue("totalAmountPaid")}</span>

    ),

    enableSorting: true,

    enableHiding: false,

  },
  {
    accessorKey: "paymentStatus",

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Status" />
    ),
    cell: ({ row }) => {
      const status = paymentStatuses.find(
        (status) => status.value === row.getValue("paymentStatus")
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "orderStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Status" />
    ),
    cell: ({ row }) => {
      const priority = orderStatuses.find(
        (priority) => priority.value === row.getValue("orderStatus")
      );

      if (!priority) {
        return null;
      }

      return (
        <div className="flex items-center">
          {priority.icon && (
            <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{priority.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
