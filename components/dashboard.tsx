// "use client";

// // types.ts
// interface DashboardData {
//   totalRevenue: {
//     amount: number;
//     percentageChange: number;
//   };
//   salesToday: {
//     amount: number;
//     percentageChange: number;
//   };
//   ticketsSold: {
//     count: number;
//     percentageChange: number;
//   };
//   activeEvents: {
//     count: number;
//     percentageChange: number;
//   };
// }

// import { useEffect, useState } from "react";
// import type { Metadata } from "next";
// import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
// import axios from "axios";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Overview } from "@/components/overview";
// import { RecentSales } from "@/components/recent-sales";

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "Event Ticketing Dashboard",
// };

// export default function DashboardPage() {
//   const [dashboardData, setDashboardData] = useState<DashboardData | null>(
//     null
//   );
//   const [loading, setLoading] = useState(true);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const mockResponse = {
//         totalRevenue: {
//           amount: 45231.89,
//           percentageChange: 20.1,
//         },
//         salesToday: {
//           amount: 45.0,
//           percentageChange: 5,
//         },
//         ticketsSold: {
//           count: 2350,
//           percentageChange: 180.1,
//         },
//         activeEvents: {
//           count: 12,
//           percentageChange: 19,
//         },
//       };

//       await new Promise((resolve) => setTimeout(resolve, 500));
//       setDashboardData(mockResponse);
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   if (loading || !dashboardData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="flex min-h-screen flex-col">
//       <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
//         <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between">
//           <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
//             Dashboard
//           </h2>
//         </div>

//         <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Total Revenue
//               </CardTitle>
//               <DollarSign className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 ${dashboardData.totalRevenue.amount.toFixed(2)}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 +{dashboardData.totalRevenue.percentageChange}% from last month
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Sales Today</CardTitle>
//               <Activity className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 ${dashboardData.salesToday.amount.toFixed(2)}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 +{dashboardData.salesToday.percentageChange}% from yesterday
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Tickets Sold
//               </CardTitle>
//               <Users className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 +{dashboardData.ticketsSold.count}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 +{dashboardData.ticketsSold.percentageChange}% from last month
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Active Events
//               </CardTitle>
//               <CreditCard className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 +{dashboardData.activeEvents.count}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 +{dashboardData.activeEvents.percentageChange}% from last month
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
//           <Card className="lg:col-span-4">
//             <CardHeader>
//               <CardTitle>Overview</CardTitle>
//             </CardHeader>
//             <CardContent className="pl-2">
//               <Overview />
//             </CardContent>
//           </Card>
//           <Card className="lg:col-span-3">
//             <CardHeader>
//               <CardTitle>Recent Sales</CardTitle>
//               <CardDescription>You made 265 sales this month.</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <RecentSales />
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
// types.ts
interface DashboardData {
  totalRevenue: {
    amount: number;
    percentageChange: number;
  };
  salesToday: {
    amount: number;
    percentageChange: number;
  };
  ticketsSold: {
    count: number;
    percentageChange: number;
  };
  activeEvents: {
    count: number;
    percentageChange: number;
  };
  overview: {
    name: string;
    total: number;
  }[];
  recentSales: {
    id: string;
    name: string;
    email: string;
    amount: number;
    avatar: string;
  }[];
}

import { useEffect, useState } from "react";
import type { Metadata } from "next";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Overview } from "@/components/overview";
import { RecentSales } from "@/components/recent-sales";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Event Ticketing Dashboard",
};

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      axios
        .get("/api/analytics")
        .then((response) => {
          setDashboardData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching dashboard data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading || !dashboardData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Dashboard
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${dashboardData.totalRevenue.amount.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                +{dashboardData.totalRevenue.percentageChange}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales Today</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${dashboardData.salesToday.amount.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                +{dashboardData.salesToday.percentageChange}% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tickets Sold
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{dashboardData.ticketsSold.count}
              </div>
              <p className="text-xs text-muted-foreground">
                +{dashboardData.ticketsSold.percentageChange}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Events
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{dashboardData.activeEvents.count}
              </div>
              <p className="text-xs text-muted-foreground">
                +{dashboardData.activeEvents.percentageChange}% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview data={dashboardData.overview} />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>
                You made {dashboardData.recentSales.length} sales this month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales sales={dashboardData.recentSales} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
