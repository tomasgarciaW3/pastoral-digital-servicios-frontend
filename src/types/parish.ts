export interface ServiceTime {
  startTime: string; // UTC format
  endTime: string;   // UTC format
}

export interface ServiceDay {
  name: string; // e.g., "monday", "tuesday", "saturday", "sunday"
  times?: ServiceTime[]; // Optional times array
}

export interface ParishService {
  id: number;
  name: string;
  days: ServiceDay[];
}

export interface Parish {
  id: number;
  name: string;
  priest: string;
  address: string;
  country: string;
  province: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phone: string;
  email: string;
  website?: string;
  services: ParishService[];
}

export interface FilterState {
  search: string;
  selectedParishes: number[];
  services: string[];
  country: string;
  province: string;
  city: string;
  dayTime: string;
  nearMe: boolean;
}
