import { Filter, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { serviceTypes, provinces, countries } from "@/data/mockParishes";
import { FilterState, Parish } from "@/types/parish";

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  parishes: Parish[];
}

export const FilterPanel = ({ filters, onFilterChange, parishes }: FilterPanelProps) => {
  const handleServiceToggle = (service: string) => {
    const newServices = filters.services.includes(service)
      ? filters.services.filter((s) => s !== service)
      : [...filters.services, service];
    onFilterChange({ ...filters, services: newServices });
  };

  const handleParishToggle = (parishId: string) => {
    const newParishes = filters.selectedParishes.includes(parishId)
      ? filters.selectedParishes.filter((p) => p !== parishId)
      : [...filters.selectedParishes, parishId];
    onFilterChange({ ...filters, selectedParishes: newParishes });
  };

  const searchFilteredParishes = parishes.filter((parish) =>
    parish.name.toLowerCase().includes(filters.search.toLowerCase()) ||
    parish.city.toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <div className="bg-card border-b border-border p-4 shadow-soft">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-foreground">Filtros</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Listado de parroquias */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Listado de parroquias</Label>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar parroquias"
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="pl-9"
            />
          </div>

          <div className="border rounded-md p-3 max-h-[300px] overflow-y-auto space-y-2">
            {searchFilteredParishes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No se encontraron parroquias
              </p>
            ) : (
              searchFilteredParishes.map((parish) => (
                <div key={parish.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`parish-${parish.id}`}
                    checked={filters.selectedParishes.includes(parish.id)}
                    onCheckedChange={() => handleParishToggle(parish.id)}
                  />
                  <label
                    htmlFor={`parish-${parish.id}`}
                    className="text-xs leading-tight cursor-pointer flex-1"
                  >
                    <div className="font-medium">{parish.name}</div>
                    <div className="text-muted-foreground">{parish.city}, {parish.province}</div>
                  </label>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Servicios */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Servicios</Label>
          <div className="space-y-2">
            {serviceTypes.map((service) => (
              <div key={service.value} className="flex items-center space-x-2">
                <Checkbox
                  id={service.value}
                  checked={filters.services.includes(service.value)}
                  onCheckedChange={() => handleServiceToggle(service.value)}
                />
                <label
                  htmlFor={service.value}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {service.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Ubicación */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Ubicación</Label>
          
          <div className="space-y-3">
            {/* Country */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">País</Label>
              <Select
                value={filters.country}
                onValueChange={(value) => onFilterChange({ ...filters, country: value, province: "all", city: "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="z-[1001]">
                  <SelectItem value="all">Todos</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Province */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Provincia</Label>
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
              <Label className="text-xs text-muted-foreground">Horario</Label>
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
      </div>
    </div>
  );
};
