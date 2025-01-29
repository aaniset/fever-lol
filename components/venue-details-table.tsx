"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { VenueCard } from "@/components/venue-card";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">Venues</CardTitle>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-[150px] lg:w-[250px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-4">
            <VenueCard venues={filteredVenues} setVenues={setVenues} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
