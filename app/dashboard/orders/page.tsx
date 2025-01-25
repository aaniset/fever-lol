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
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect } from "react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { OrderSchema } from "@/models/orders";
import { OrderType } from "@/models/orders";
import axios from "axios";
import { CardContent } from "@/components/ui/card";
import { DataTable } from "./table/components/data-table";
import { columns } from "./table/components/columns";

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<OrderType[]>([]);
  useEffect(() => {
    axios
      .post(`/api/orders`, { eventId })
      .then((response) => {
        const allOrders = response.data;

        const cleanedOrder = z.array(OrderSchema).parse(allOrders);
        setOrders(cleanedOrder);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
        setIsLoading(false);
      });
  }, [eventId]);
  return (
    // <SidebarProvider>
    //   <AppSidebar />
    //   <SidebarInset>
    //     <header className="flex h-16 shrink-0 items-center gap-2">
    //       <div className="flex items-center gap-2 px-4">
    //         <SidebarTrigger className="-ml-1" />
    //         <Separator orientation="vertical" className="mr-2 h-4" />
    //         <Breadcrumb>
    //           <BreadcrumbList>
    //             <BreadcrumbItem>
    //               <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
    //             </BreadcrumbItem>
    //             <BreadcrumbSeparator />
    //             <BreadcrumbItem>
    //               <BreadcrumbPage>Orders</BreadcrumbPage>
    //             </BreadcrumbItem>
    //           </BreadcrumbList>
    //         </Breadcrumb>
    //       </div>
    //     </header>
    //     <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
    //       <CardContent>
    //         <DataTable data={orders} columns={columns} isLoading={isLoading} />
    //       </CardContent>
    //     </div>
    //   </SidebarInset>
    // </SidebarProvider>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 sticky top-0 bg-background z-10">
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
                  <BreadcrumbPage>Orders</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4">
            <CardContent className="p-0">
              <DataTable
                data={orders}
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
