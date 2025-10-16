// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://pastoral.com";

// Types
export interface ParishSearchResult {
  id: number;
  name: string;
  location: string;
  coordinates: {
    lat: number;
    long: number;
  };
}

export interface ParishSearchResponse {
  parishes: ParishSearchResult[];
}

export interface ParishMarker {
  parishId: number;
  coordinates: {
    lat: number;
    long: number;
  };
  title: string;
  location: string;
}

export interface ParishMarkersResponse {
  markers: ParishMarker[];
}

export interface BoundsParams {
  min_lon: number;
  min_lat: number;
  max_lon: number;
  max_lat: number;
}

// Mock marker data - comprehensive list with at least 2 markers per state/province
const mockMarkers: ParishMarker[] = [
  // Argentina - Buenos Aires
  { parishId: 1, coordinates: { lat: -34.6037, long: -58.3816 }, title: "Catedral Metropolitana", location: "San Martín 27, CABA" },
  { parishId: 2, coordinates: { lat: -34.6158, long: -58.3701 }, title: "Basílica de Santo Domingo", location: "Defensa 422, San Telmo, CABA" },
  { parishId: 3, coordinates: { lat: -34.5708, long: -59.1156 }, title: "Basílica de Luján", location: "San Martín 51, Luján" },
  { parishId: 4, coordinates: { lat: -34.7281, long: -58.2617 }, title: "Parroquia San José", location: "Av. Mitre 2650, Avellaneda" },

  // Argentina - Córdoba
  { parishId: 5, coordinates: { lat: -31.4201, long: -64.1888 }, title: "Catedral de Córdoba", location: "Independencia 80, Córdoba" },
  { parishId: 6, coordinates: { lat: -31.3953, long: -64.2619 }, title: "Parroquia del Sagrado Corazón", location: "Humberto Primo 600, Córdoba" },

  // Argentina - Santa Fe
  { parishId: 7, coordinates: { lat: -32.9442, long: -60.6505 }, title: "Catedral de Rosario", location: "Buenos Aires 339, Rosario" },
  { parishId: 8, coordinates: { lat: -31.6107, long: -60.6973 }, title: "Catedral de Santa Fe", location: "San Martín 2802, Santa Fe" },

  // Argentina - Mendoza
  { parishId: 9, coordinates: { lat: -32.8895, long: -68.8458 }, title: "Parroquia Cristo Rey", location: "Las Heras 567, Mendoza" },
  { parishId: 10, coordinates: { lat: -32.9042, long: -68.8272 }, title: "Basílica San Francisco", location: "Ituzaingó 297, Mendoza" },

  // Argentina - Tucumán
  { parishId: 11, coordinates: { lat: -26.8083, long: -65.2176 }, title: "Catedral de Tucumán", location: "Congreso 71, San Miguel de Tucumán" },
  { parishId: 12, coordinates: { lat: -26.8241, long: -65.2226 }, title: "Parroquia San Francisco", location: "25 de Mayo 258, Tucumán" },

  // Argentina - Salta
  { parishId: 13, coordinates: { lat: -24.7859, long: -65.4117 }, title: "Catedral de Salta", location: "España 596, Salta" },
  { parishId: 14, coordinates: { lat: -24.7895, long: -65.4103 }, title: "Iglesia San Francisco", location: "Caseros 187, Salta" },

  // Uruguay - Montevideo
  { parishId: 15, coordinates: { lat: -34.9011, long: -56.1645 }, title: "Catedral Metropolitana", location: "Sarandí 487, Montevideo" },
  { parishId: 16, coordinates: { lat: -34.9042, long: -56.1881 }, title: "Iglesia del Sagrado Corazón", location: "18 de Julio 1645, Montevideo" },

  // Uruguay - Canelones
  { parishId: 17, coordinates: { lat: -34.5228, long: -55.9317 }, title: "Parroquia Santa Rosa", location: "Artigas 1234, Canelones" },
  { parishId: 18, coordinates: { lat: -34.7500, long: -56.0167 }, title: "Parroquia San Luis", location: "Ruta 5 km 23, Canelones" },

  // Uruguay - Maldonado
  { parishId: 19, coordinates: { lat: -34.9000, long: -54.9500 }, title: "Catedral de Maldonado", location: "Sarandí 701, Maldonado" },
  { parishId: 20, coordinates: { lat: -34.9667, long: -54.9500 }, title: "Iglesia de Punta del Este", location: "Av. Gorlero 890, Punta del Este" },

  // Paraguay - Asunción
  { parishId: 21, coordinates: { lat: -25.2637, long: -57.5759 }, title: "Catedral Metropolitana", location: "Palma 382, Asunción" },
  { parishId: 22, coordinates: { lat: -25.2824, long: -57.5572 }, title: "Parroquia Santa Lucía", location: "Av. Santísima Trinidad, Asunción" },

  // Paraguay - Central
  { parishId: 23, coordinates: { lat: -25.3667, long: -57.5167 }, title: "Parroquia San Lorenzo", location: "General Santos, San Lorenzo" },
  { parishId: 24, coordinates: { lat: -25.2900, long: -57.6400 }, title: "Parroquia Luque", location: "14 de Mayo, Luque" },

  // Chile - Región Metropolitana
  { parishId: 25, coordinates: { lat: -33.4489, long: -70.6693 }, title: "Catedral Metropolitana", location: "Plaza de Armas, Santiago" },
  { parishId: 26, coordinates: { lat: -33.4372, long: -70.6506 }, title: "Iglesia San Francisco", location: "Londres 4, Santiago" },

  // Chile - Valparaíso
  { parishId: 27, coordinates: { lat: -33.0472, long: -71.6127 }, title: "Catedral de Valparaíso", location: "Condell 1396, Valparaíso" },
  { parishId: 28, coordinates: { lat: -33.0367, long: -71.6276 }, title: "Iglesia La Matriz", location: "Plaza Echaurren, Valparaíso" },

  // Chile - Concepción (Biobío)
  { parishId: 29, coordinates: { lat: -36.8270, long: -73.0498 }, title: "Catedral de Concepción", location: "Caupolicán 441, Concepción" },
  { parishId: 30, coordinates: { lat: -36.8201, long: -73.0444 }, title: "Parroquia del Sagrario", location: "O'Higgins 570, Concepción" },

  // República Dominicana - Distrito Nacional
  { parishId: 31, coordinates: { lat: 18.4861, long: -69.9312 }, title: "Catedral Primada de América", location: "Calle Arzobispo Meriño, Santo Domingo" },
  { parishId: 32, coordinates: { lat: 18.4765, long: -69.8933 }, title: "Basílica de Nuestra Señora de la Altagracia", location: "Av. Máximo Gómez, Santo Domingo" },

  // República Dominicana - Santiago
  { parishId: 33, coordinates: { lat: 19.4517, long: -70.6970 }, title: "Catedral de Santiago", location: "Calle del Sol, Santiago" },
  { parishId: 34, coordinates: { lat: 19.4580, long: -70.6865 }, title: "Parroquia Santa Ana", location: "Av. 27 de Febrero, Santiago" },

  // República Dominicana - La Vega
  { parishId: 35, coordinates: { lat: 19.2222, long: -70.5298 }, title: "Catedral de La Vega", location: "Calle Independencia, La Vega" },
  { parishId: 36, coordinates: { lat: 19.2333, long: -70.5222 }, title: "Parroquia San Sebastián", location: "Calle Duarte, La Vega" },

  // Perú - Lima
  { parishId: 37, coordinates: { lat: -12.0464, long: -77.0428 }, title: "Catedral de Lima", location: "Jirón Carabaya, Lima" },
  { parishId: 38, coordinates: { lat: -12.0545, long: -77.0317 }, title: "Basílica San Francisco", location: "Jirón Lampa 248, Lima" },

  // Perú - Arequipa
  { parishId: 39, coordinates: { lat: -16.4090, long: -71.5375 }, title: "Catedral de Arequipa", location: "Plaza de Armas, Arequipa" },
  { parishId: 40, coordinates: { lat: -16.3988, long: -71.5369 }, title: "Monasterio Santa Catalina", location: "Santa Catalina 301, Arequipa" },

  // Perú - Cusco
  { parishId: 41, coordinates: { lat: -13.5319, long: -71.9675 }, title: "Catedral del Cusco", location: "Plaza de Armas, Cusco" },
  { parishId: 42, coordinates: { lat: -13.5167, long: -71.9786 }, title: "Iglesia de la Compañía", location: "Plaza de Armas, Cusco" },

  // Additional markers for other states (at least 2 per state)
  // Argentina - Entre Ríos
  { parishId: 43, coordinates: { lat: -31.7333, long: -60.5289 }, title: "Catedral de Paraná", location: "San Martín 65, Paraná" },
  { parishId: 44, coordinates: { lat: -32.4800, long: -58.2350 }, title: "Parroquia Gualeguaychú", location: "San Martín 520, Gualeguaychú" },

  // Argentina - Misiones
  { parishId: 45, coordinates: { lat: -27.3621, long: -55.9007 }, title: "Catedral de Posadas", location: "Bolívar 1951, Posadas" },
  { parishId: 46, coordinates: { lat: -25.6947, long: -54.4367 }, title: "Parroquia Puerto Iguazú", location: "Av. Victoria Aguirre, Puerto Iguazú" },

  // Uruguay - Paysandú
  { parishId: 47, coordinates: { lat: -32.3167, long: -57.0833 }, title: "Catedral de Paysandú", location: "18 de Julio 1034, Paysandú" },
  { parishId: 48, coordinates: { lat: -32.3200, long: -57.0900 }, title: "Parroquia Nuestra Señora del Rosario", location: "Montevideo 1156, Paysandú" },

  // Uruguay - Salto
  { parishId: 49, coordinates: { lat: -31.3833, long: -57.9667 }, title: "Catedral de Salto", location: "Uruguay 725, Salto" },
  { parishId: 50, coordinates: { lat: -31.3900, long: -57.9600 }, title: "Parroquia San José", location: "Artigas 456, Salto" },

  // Paraguay - Alto Paraná
  { parishId: 51, coordinates: { lat: -25.5000, long: -54.6167 }, title: "Catedral de Ciudad del Este", location: "Av. San Blas, Ciudad del Este" },
  { parishId: 52, coordinates: { lat: -25.5095, long: -54.6116 }, title: "Parroquia Cristo Rey", location: "Av. Pioneros del Este, Ciudad del Este" },

  // Chile - Araucanía
  { parishId: 53, coordinates: { lat: -38.7359, long: -72.5904 }, title: "Catedral de Temuco", location: "Manuel Bulnes 847, Temuco" },
  { parishId: 54, coordinates: { lat: -38.7400, long: -72.5950 }, title: "Parroquia Santa Rosa", location: "Prat 567, Temuco" },

  // Chile - Los Lagos
  { parishId: 55, coordinates: { lat: -41.4693, long: -72.9396 }, title: "Catedral de Puerto Montt", location: "Benavente 441, Puerto Montt" },
  { parishId: 56, coordinates: { lat: -41.4750, long: -72.9450 }, title: "Parroquia del Carmen", location: "Urmeneta 570, Puerto Montt" },
];

/**
 * Search for parishes by name or location
 * @param query - Search query (name or location)
 * @returns Promise with parish search results
 */
export const searchParishes = async (query: string): Promise<ParishSearchResponse> => {
  // TODO: Replace with actual API call when backend is ready
  // const response = await fetch(`${API_BASE_URL}/public/parish?name-or-location=${encodeURIComponent(query)}`);
  // if (!response.ok) {
  //   throw new Error('Failed to fetch parishes');
  // }
  // return response.json();

  // Hardcoded mock response for now
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock data - simulate API response
      const mockParishes: ParishSearchResult[] = [
        {
          id: 12,
          name: "Parroquia Santa Lucía",
          location: "Mercedes, Buenos Aires, Argentina",
          coordinates: { lat: -34.6515, long: -59.4307 },
        },
        {
          id: 23,
          name: "Parroquia Santa Lucía de Asunción",
          location: "Asunción, Paraguay",
          coordinates: { lat: -25.2824914, long: -57.557286 },
        },
        {
          id: 45,
          name: "Iglesia Santa Lucía",
          location: "Montevideo, Uruguay",
          coordinates: { lat: -34.9011, long: -56.1645 },
        },
      ];

      // Filter based on query
      const filtered = mockParishes.filter(
        (parish) =>
          parish.name.toLowerCase().includes(query.toLowerCase()) ||
          parish.location.toLowerCase().includes(query.toLowerCase())
      );

      resolve({
        parishes: filtered,
      });
    }, 300); // Simulate network delay
  });
};

/**
 * Get parish markers within map bounds
 * @param bounds - Map bounding box (min/max lat/lon)
 * @returns Promise with parish markers in the specified bounds
 */
export const getParishMarkers = async (bounds: BoundsParams): Promise<ParishMarkersResponse> => {
  // TODO: Replace with actual API call when backend is ready
  // const queryParams = new URLSearchParams({
  //   min_lon: bounds.min_lon.toString(),
  //   min_lat: bounds.min_lat.toString(),
  //   max_lon: bounds.max_lon.toString(),
  //   max_lat: bounds.max_lat.toString(),
  // });
  // const response = await fetch(`${API_BASE_URL}/public/parish/markers?${queryParams}`);
  // if (!response.ok) {
  //   throw new Error('Failed to fetch parish markers');
  // }
  // return response.json();

  // Hardcoded mock response for now
  return new Promise((resolve) => {
    // Filter markers within the specified bounds
    const filteredMarkers = mockMarkers.filter(
      (marker) =>
        marker.coordinates.lat >= bounds.min_lat &&
        marker.coordinates.lat <= bounds.max_lat &&
        marker.coordinates.long >= bounds.min_lon &&
        marker.coordinates.long <= bounds.max_lon
    );

    resolve({
      markers: filteredMarkers,
    });
  });
};
