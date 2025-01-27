"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { VenueCard } from "@/components/venue-card";
import { Input } from "@/components/ui/input";

export interface Venue {
  _id: string;
  venueName: string;
  address: string;
  city: string;
  state: string;
  capacity: number;
  mapsUrl: string;
  status?: string;
  country: string;
  timeZone: string;
  userId: string;
}

export const fetchVenues = async () => {
  try {
    const response = await axios.get<Venue[]>("/api/venues");
    return response.data;
  } catch (error) {
    console.error("Error fetching venues:", error);
    return [];
  }
};

export function VenuesTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVenues = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchVenues();
        setVenues(data);
      } catch (err) {
        setError("Failed to load venues");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadVenues();
  }, []);

  const filteredVenues = venues
    ? venues.filter((venue) => {
        const venueValuesString = Object.values(venue)
          .filter((value) => value !== undefined && value !== null)
          .map((value) => value.toString().toLowerCase())
          .join(" ");
        const matchesSearch = venueValuesString.includes(
          searchQuery.toLowerCase()
        );
        return matchesSearch;
      })
    : [];

  if (error) {
    return (
      <div className="flex justify-center items-center p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <p>Loading venues...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <Input
          placeholder="Filter Venues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 mx-4 w-[150px] lg:w-[250px]"
        />
      </div>
      <VenueCard venues={filteredVenues} setVenues={setVenues} />
    </div>
  );
}
