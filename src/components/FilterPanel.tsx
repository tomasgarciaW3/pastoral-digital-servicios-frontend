import { Filter, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { serviceTypes, provinces, countries } from "@/data/mockParishes";
import { FilterState, Parish } from "@/types/parish";
import { useState } from "react";

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  parishes: Parish[];
}

export const FilterPanel = ({ filters, onFilterChange, parishes }: FilterPanelProps) => {
  const [open, setOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    filters.search && (
      parish.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      parish.city.toLowerCase().includes(filters.search.toLowerCase())
    )
  );

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-soft">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Filtros</h2>
        </div>
        {isCollapsed ? (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        )}
      </div>

      {!isCollapsed && (
        <div className="flex flex-col gap-6 mt-6">
        {/* Ubicación */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Ubicación</Label>
          
          <div className="space-y-3">
            <Select
              value={filters.country}
              onValueChange={(value) => onFilterChange({ ...filters, country: value, province: "all" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar país" />
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
            
            <Select
              value={filters.province}
              onValueChange={(value) => onFilterChange({ ...filters, province: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar provincia" />
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
        </div>

        {/* Servicios */}
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
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {service.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Parroquias */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Parroquias</Label>
          
          <Popover open={open && filters.search.length > 0} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar parroquia"
                  value={filters.search}
                  onChange={(e) => {
                    onFilterChange({ ...filters, search: e.target.value });
                    setOpen(true);
                  }}
                  className="pl-9"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="start">
              <Command>
                <CommandList>
                  <CommandEmpty>No se encontraron parroquias</CommandEmpty>
                  <CommandGroup>
                    {searchFilteredParishes.map((parish) => (
                      <CommandItem
                        key={parish.id}
                        onSelect={() => {
                          handleParishToggle(parish.id);
                        }}
                        className="flex items-start gap-2"
                      >
                        <Checkbox
                          checked={filters.selectedParishes.includes(parish.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{parish.name}</div>
                          <div className="text-xs text-muted-foreground">{parish.city}, {parish.province}</div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        </div>
      )}
    </div>
  );
};
