import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { FilterPanel } from "@/components/FilterPanel";
import { ParishMap } from "@/components/ParishMap";
import { ParishDetail } from "@/components/ParishDetail";
import { ScheduleModal } from "@/components/ScheduleModal";
import { Chatbot } from "@/components/Chatbot";
import { mockParishes } from "@/data/mockParishes";
import { Parish, FilterState } from "@/types/parish";

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
    accessibility: [],
    language: "",
    nearMe: false,
  });

  const filteredParishes = useMemo(() => {
    return mockParishes.filter((parish) => {
      // Filter by selected parishes
      if (filters.selectedParishes.length > 0 && !filters.selectedParishes.includes(parish.id)) {
        return false;
      }

      // Filter by services
      if (filters.services.length > 0) {
        const hasService = filters.services.some((serviceFilter) =>
          parish.services.some((s) => s.type === serviceFilter)
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[320px,1fr,400px] gap-6 h-[calc(100vh-120px)]">
          {/* Filter Panel - Left */}
          <div className="h-full overflow-y-auto">
            <FilterPanel filters={filters} onFilterChange={setFilters} parishes={mockParishes} />
          </div>

          {/* Map Section - Center */}
          <div className="h-full min-h-[500px]">
            <ParishMap
              parishes={filteredParishes}
              selectedParish={selectedParish}
              onParishSelect={setSelectedParish}
              country={filters.country}
            />
          </div>

          {/* Detail Section - Right */}
          <div className="h-full min-h-[500px] bg-card border border-border rounded-lg shadow-soft overflow-hidden">
            <ParishDetail
              parish={selectedParish}
              onSchedule={() => setScheduleModalOpen(true)}
            />
          </div>
        </div>
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
