import { countryData } from "@/data/mockParishes";

interface LocationResult {
  country: string;
  province: string;
}

/**
 * Reverse geocode coordinates to determine country and province
 * Uses bounding box proximity to determine the closest match
 */
export const reverseGeocode = (lat: number, lng: number): LocationResult | null => {
  let closestCountry: string | null = null;
  let closestProvince: string | null = null;
  let minDistance = Infinity;

  // Check each country and its provinces
  for (const [countryName, countryInfo] of Object.entries(countryData)) {
    // Check if coordinates are roughly in country bounds (with some buffer)
    const countryBounds = countryInfo.bounds;

    // Check each province in this country
    for (const province of countryInfo.provinces) {
      const provinceBounds = province.bounds;

      // Calculate distance from point to province center
      const distance = calculateDistance(
        lat,
        lng,
        provinceBounds.lat,
        provinceBounds.lng
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestCountry = countryName;
        closestProvince = province.name;
      }
    }
  }

  if (closestCountry && closestProvince) {
    return {
      country: closestCountry,
      province: closestProvince,
    };
  }

  return null;
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
