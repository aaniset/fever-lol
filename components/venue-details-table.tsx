"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { PlusCircle, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function VenuesTable({ venues }: any) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter venues based on selected tab and search query
  const filteredVenues = venues.filter((venue: any) => {
    const matchesTab = selectedTab === "all" || venue.status === selectedTab;

    const venueValuesString = Object.values(venue)
      .map((value) => value?.toString().toLowerCase())
      .join(" ");

    const matchesSearch = venueValuesString.includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Handle tab trigger click
  const handleTabClick = (tabValue: string) => {
    setSelectedTab(tabValue);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* <Tabs value={selectedTab} onValueChange={handleTabClick}>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>

            <TabsTrigger value="draft">Draft</TabsTrigger>
          </TabsList>
          <Input
            placeholder="Filter Venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 mx-4 w-[150px] lg:w-[250px]"
          />
        </div>
        <TabsContent value="all">
          <VenueCard venues={filteredVenues} />
        </TabsContent>
        <TabsContent value="active">
          <VenueCard venues={filteredVenues} />
        </TabsContent>
        <TabsContent value="draft">
          <VenueCard venues={filteredVenues} />
        </TabsContent>
        <TabsContent value="archived">
          <VenueCard venues={filteredVenues} />
        </TabsContent>
      </Tabs> */}
      <div className="flex items-center">
        {/* <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>

          <TabsTrigger value="draft">Draft</TabsTrigger>
        </TabsList> */}
        <Input
          placeholder="Filter Venues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 mx-4 w-[150px] lg:w-[250px]"
        />
      </div>
      <VenueCard venues={filteredVenues} />
    </div>
  );
}

const VenueCard = ({ venues }: { venues: any[] }) => {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const pageCount = Math.ceil(venues.length / pageSize);
  const paginatedVenues = venues.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pageCount) {
      setPageIndex(newPage);
    }
  };

  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Venues</CardTitle>
          <CardDescription>
            Manage your venues and view their details.
          </CardDescription>
        </div>

        <Button size="sm" className="ml-auto gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Venue
          </span>
        </Button>
      </CardHeader>
      <CardContent>
        {venues.length === 0 ? (
          <div className="flex flex-1 pt-32 pb-32 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                You have no Venues
              </h3>
              <p className="text-sm text-muted-foreground">
                You can start managing venues as soon as you add one.
              </p>
              <Button className="mt-4">Add Venue</Button>
            </div>
          </div>
        ) : (
          <div className="max-h-screen overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky top-0 bg-white">Name</TableHead>
                  <TableHead className="sticky top-0 bg-white">
                    1st Line Address
                  </TableHead>
                  <TableHead className="sticky top-0 bg-white">City</TableHead>
                  <TableHead className="sticky top-0 bg-white">State</TableHead>
                  <TableHead className="sticky top-0 bg-white">
                    Capacity
                  </TableHead>
                  <TableHead className="sticky top-0 bg-white">
                    <span className="sr-only">Maps Link</span>
                  </TableHead>
                  <TableHead className="sticky top-0 bg-white">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedVenues.map((venue: any) => (
                  <TableRow key={venue.id}>
                    <TableCell
                      onClick={() => {
                        router.push(`/venue/${venue.id}`);
                      }}
                      className="font-medium"
                    >
                      {venue.name}
                    </TableCell>
                    <TableCell>{venue.addressLine1}</TableCell>
                    <TableCell>{venue.city}</TableCell>
                    <TableCell>{venue.state}</TableCell>
                    <TableCell>{venue.capacity}</TableCell>
                    <TableCell>
                      <a
                        href={venue.mapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on Maps
                      </a>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Showing{" "}
            <strong>
              {pageIndex * pageSize + 1}-
              {Math.min((pageIndex + 1) * pageSize, venues.length)}
            </strong>{" "}
            of <strong>{venues.length}</strong>
          </div>
          <div className="flex px-4 items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${pageSize}`}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setPageIndex(0);
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {pageIndex + 1} of {pageCount}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => handlePageChange(0)}
                disabled={pageIndex === 0}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(pageIndex - 1)}
                disabled={pageIndex === 0}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(pageIndex + 1)}
                disabled={pageIndex >= pageCount - 1}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => handlePageChange(pageCount - 1)}
                disabled={pageIndex >= pageCount - 1}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
