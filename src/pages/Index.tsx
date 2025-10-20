import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/Header";
import { FilterPanel } from "@/components/FilterPanel";
import { ParishMap } from "@/components/ParishMap";
import { ParishDetail } from "@/components/ParishDetail";
import { ScheduleModal } from "@/components/ScheduleModal";
import { Chatbot } from "@/components/Chatbot";
import { mockParishes } from "@/data/mockParishes";
import { Parish, FilterState } from "@/types/parish";
import { reverseGeocode } from "@/services/geocodingService";

const Index = () => {
  const [selectedParish, setSelectedParish] = useState<Parish | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    selectedParishes: [],
    services: [],
    country: "all",
    province: "all",
    city: "",
    dayTime: "all",
    nearMe: false,
  });


  // Auto-detect country and province from user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = reverseGeocode(latitude, longitude);

          if (location) {
            setFilters((prev) => ({
              ...prev,
              country: location.country,
              province: location.province,
            }));
          }
        },
        (error) => {
          console.log("Could not get user location:", error.message);
        }
      );
    }
  }, []);

  // Clear selected parish when country or province changes
  useEffect(() => {
    setSelectedParish(null);
  }, [filters.country, filters.province]);

  const filteredParishes = useMemo(() => {
    return mockParishes.filter((parish) => {
      // Filter by selected parishes
      if (filters.selectedParishes.length > 0 && !filters.selectedParishes.includes(parish.id)) {
        return false;
      }

      // Filter by services
      if (filters.services.length > 0) {
        const hasService = filters.services.some((serviceFilter) =>
          parish.services.some((s) => s.name.toLowerCase() === serviceFilter.toLowerCase() ||
                                     s.name.toLowerCase().includes(serviceFilter.toLowerCase()))
        );
        if (!hasService) return false;
      }

      // Filter by country
      if (filters.country !== "all" && parish.country !== filters.country) {
        return false;
      }

      // Filter by province
      if (filters.province !== "all" && parish.province !== filters.province) {
        return false;
      }

      // Add more filter logic here as needed

      return true;
    });
  }, [filters]);

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header />

      {/* Map Section - Fullscreen */}
      <div className="flex-1 relative overflow-hidden">
        <ParishMap
          parishes={filteredParishes}
          selectedParish={selectedParish}
          onParishSelect={setSelectedParish}
          country={filters.country}
          province={filters.province}
          services={filters.services}
        />

        {/* Filter Panel - Overlay on Map */}
        <div className="absolute top-4 left-4 w-80 z-[500]">
          <FilterPanel filters={filters} onFilterChange={setFilters} parishes={mockParishes} />
        </div>

        {/* Detail Section - Overlay on Map */}
        {selectedParish && (
          <div className="absolute top-4 right-4 w-96 h-[calc(100%-2rem)] bg-card border border-border rounded-lg shadow-lg z-[1000] flex flex-col">
            <ParishDetail
              parish={selectedParish}
              onSchedule={() => setScheduleModalOpen(true)}
              onClose={() => setSelectedParish(null)}
            />
          </div>
        )}
      </div>

      <ScheduleModal
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
        parish={selectedParish}
      />

      <Chatbot />
    </div>
  );
};

export default Index;
