import { Filter, Search, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { serviceTypes, countries, countryData, getProvincesForCountry } from "@/data/mockParishes";
import { FilterState, Parish } from "@/types/parish";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { searchParishes, ParishSearchResult } from "@/services/parishService";

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  parishes: Parish[];
}

export const FilterPanel = ({ filters, onFilterChange, parishes }: FilterPanelProps) => {
  const [open, setOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchResults, setSearchResults] = useState<ParishSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search input with 200ms delay
  const debouncedSearch = useDebounce(filters.search, 200);

  const handleServiceToggle = (service: string) => {
    const newServices = filters.services.includes(service)
      ? filters.services.filter((s) => s !== service)
      : [...filters.services, service];
    onFilterChange({ ...filters, services: newServices });
  };

  const handleParishToggle = (parishId: number) => {
    const newParishes = filters.selectedParishes.includes(parishId)
      ? filters.selectedParishes.filter((p) => p !== parishId)
      : [...filters.selectedParishes, parishId];
    onFilterChange({ ...filters, selectedParishes: newParishes });
  };

  // Fetch search results when debounced search changes
  useEffect(() => {
    if (debouncedSearch.trim().length > 0) {
      setIsSearching(true);
      searchParishes(debouncedSearch)
        .then((response) => {
          setSearchResults(response.parishes);
          setIsSearching(false);
        })
        .catch((error) => {
          console.error("Error searching parishes:", error);
          setSearchResults([]);
          setIsSearching(false);
        });
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch]);

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
              disabled={filters.country === "all"}
            >
              <SelectTrigger>
                <SelectValue placeholder={filters.country === "all" ? "Seleccione un país primero" : "Seleccionar provincia/estado"} />
              </SelectTrigger>
              <SelectContent className="z-[1001]">
                <SelectItem value="all">Todas</SelectItem>
                {getProvincesForCountry(filters.country).map((province) => (
                  <SelectItem key={province.name} value={province.name}>
                    {province.name}
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
                {isSearching ? (
                  <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                ) : (
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                )}
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
            <PopoverContent className="w-[280px] p-0 z-[600]" align="start">
              <Command>
                <CommandList>
                  {isSearching ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      Buscando...
                    </div>
                  ) : searchResults.length === 0 ? (
                    <CommandEmpty>No se encontraron parroquias</CommandEmpty>
                  ) : (
                    <CommandGroup>
                      {searchResults.map((parish) => (
                        <CommandItem
                          key={parish.parishId}
                          onSelect={() => {
                            handleParishToggle(parish.parishId);
                          }}
                          className="flex items-start gap-2"
                        >
                          <Checkbox
                            checked={filters.selectedParishes.includes(parish.parishId)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{parish.name}</div>
                            <div className="text-xs text-muted-foreground">{parish.location}</div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
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
