"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  PlusCircle,
  MapPin,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format, parse } from "date-fns";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

export default function EventsComponent() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2024, 0, 20),
    to: addDays(new Date(2025, 0, 20), 20),
  });

  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.post("/api/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const filterEvents = () => {
      const filtered = events.filter((event: any) => {
        const matchesTab =
          selectedTab === "all" || event.status === selectedTab;

        const eventValuesString = Object.values(event)
          .map((value) => value?.toString().toLowerCase())
          .join(" ");

        const matchesSearch = eventValuesString.includes(
          searchQuery.toLowerCase()
        );

        const eventDate = parse(
          event.date,
          "MMMM d, yyyy 'at' h:mm a",
          new Date()
        );

        const matchesDateRange =
          date?.from && date?.to
            ? eventDate >= date.from && eventDate <= date.to
            : true;

        return matchesTab && matchesSearch && matchesDateRange;
      });
      setFilteredEvents(filtered);
    };

    filterEvents();
  }, [events, selectedTab, searchQuery, date]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between mb-6">
          <TabsList className="flex-shrink-0 w-full lg:w-auto overflow-x-auto">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="active">Upcoming Events</TabsTrigger>
            <TabsTrigger value="completed">Past Events</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
          </TabsList>

          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            <Input
              placeholder="Search Events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full lg:w-[250px]"
            />

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full lg:w-[250px]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <TabsContent value={selectedTab} className="mt-4">
          <EventCardTable events={filteredEvents} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const EventCardTable = ({ events }: { events: any[] }) => {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const pageCount = Math.ceil(events.length / pageSize);
  const paginatedEvents = events.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pageCount) {
      setPageIndex(newPage);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <CardTitle>Events</CardTitle>
          <CardDescription>
            Manage your Events and view their sales performance.
          </CardDescription>
        </div>
        <Button
          onClick={() => router.push("/events/create")}
          size="sm"
          className="gap-1"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Add Event
        </Button>
      </CardHeader>

      <CardContent>
        {paginatedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed rounded-lg">
            <h3 className="text-2xl font-bold tracking-tight text-center">
              No Events Found
            </h3>
            <p className="text-sm text-muted-foreground mt-2 text-center px-4">
              You can start selling as soon as you add an Event.
            </p>
            <Button
              onClick={() => router.push("/events/create")}
              className="mt-4"
            >
              Add Event
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {paginatedEvents.map((event, index) => (
              <Card key={index} className="flex flex-col">
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={event.imgUrl || "/placeholder.svg"}
                      alt={event.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold truncate">{event.name}</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/events/${event.id}/edit`)
                              }
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/events/${event.id}/orders`)
                              }
                            >
                              View Orders
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/events/${event.id}/attendees`)
                              }
                            >
                              View Attendees
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center">
                          <CalendarIcon className="mr-1 h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{event.date}</span>
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
                          <span className="truncate">
                            {event.location?.address}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col lg:flex-row items-center justify-between px-6 py-4 gap-4">
        <div className="text-sm text-muted-foreground text-center lg:text-left">
          Showing {pageIndex * pageSize + 1}-
          {Math.min((pageIndex + 1) * pageSize, events.length)} of{" "}
          {events.length}
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPageIndex(0);
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size} rows
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(0)}
              disabled={pageIndex === 0}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(pageIndex - 1)}
              disabled={pageIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm whitespace-nowrap">
              Page {pageIndex + 1} of {pageCount}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(pageIndex + 1)}
              disabled={pageIndex >= pageCount - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(pageCount - 1)}
              disabled={pageIndex >= pageCount - 1}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
