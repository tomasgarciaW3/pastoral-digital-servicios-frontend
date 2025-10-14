export interface ParishSchedule {
  sunday?: string[];
  monday?: string[];
  tuesday?: string[];
  wednesday?: string[];
  thursday?: string[];
  friday?: string[];
  saturday?: string[];
}

export interface ParishService {
  type: 'misa' | 'bautismo' | 'confesiones' | 'catequesis' | 'caritas' | 'retiros' | 'matrimonio';
  schedule: ParishSchedule;
}

export interface Parish {
  id: string;
  name: string;
  pastor: string;
  address: string;
  country: string;
  province: string;
  city: string;
  location: {
    lat: number;
    lng: number;
  };
  contact: {
    phone: string;
    email: string;
  };
  services: ParishService[];
  links?: {
    website?: string;
    facebook?: string;
    instagram?: string;
  };
  photos?: string[];
  accessibility?: {
    ramp?: boolean;
    parking?: boolean;
    restroom?: boolean;
  };
  languages?: string[];
}

export interface FilterState {
  search: string;
  selectedParishes: string[];
  services: string[];
  country: string;
  province: string;
  city: string;
  dayTime: string;
  accessibility: string[];
  language: string;
  nearMe: boolean;
}
