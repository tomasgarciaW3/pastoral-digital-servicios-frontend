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
