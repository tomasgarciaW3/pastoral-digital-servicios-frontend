import { Filter, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { serviceTypes, provinces } from "@/data/mockParishes";
import { FilterState } from "@/types/parish";

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const FilterPanel = ({ filters, onFilterChange }: FilterPanelProps) => {
  const handleServiceToggle = (service: string) => {
    const newServices = filters.services.includes(service)
      ? filters.services.filter((s) => s !== service)
      : [...filters.services, service];
    onFilterChange({ ...filters, services: newServices });
  };

  return (
    <div className="bg-card border-b border-border p-4 shadow-soft">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-foreground">Filtros</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Services */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Servicios</Label>
          <div className="grid grid-cols-2 gap-2">
            {serviceTypes.map((service) => (
              <div key={service.value} className="flex items-center space-x-2">
                <Checkbox
                  id={service.value}
                  checked={filters.services.includes(service.value)}
                  onCheckedChange={() => handleServiceToggle(service.value)}
                />
                <label
                  htmlFor={service.value}
                  className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {service.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Province */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Provincia</Label>
          <Select
            value={filters.province}
            onValueChange={(value) => onFilterChange({ ...filters, province: value, city: "" })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent className="z-[1001]">
              <SelectItem value="all">Todas</SelectItem>
              {provinces.map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Day/Time */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Horario</Label>
          <Select
            value={filters.dayTime}
            onValueChange={(value) => onFilterChange({ ...filters, dayTime: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Cualquiera" />
            </SelectTrigger>
            <SelectContent className="z-[1001]">
              <SelectItem value="all">Cualquiera</SelectItem>
              <SelectItem value="morning">Mañana (6:00-12:00)</SelectItem>
              <SelectItem value="afternoon">Tarde (12:00-18:00)</SelectItem>
              <SelectItem value="evening">Noche (18:00-23:00)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Near Me */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Ubicación</Label>
          <Button
            variant={filters.nearMe ? "default" : "outline"}
            className="w-full"
            onClick={() => onFilterChange({ ...filters, nearMe: !filters.nearMe })}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Cerca mío
          </Button>
        </div>
      </div>
    </div>
  );
};
