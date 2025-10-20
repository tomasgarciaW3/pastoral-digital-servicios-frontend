import { useEffect, useState, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { Parish } from "@/types/parish";
import { countryData } from "@/data/mockParishes";
import { getParishMarkers, getParishDetails, ParishMarker } from "@/services/parishService";

interface ParishMapProps {
  parishes: Parish[];
  selectedParish: Parish | null;
  onParishSelect: (parish: Parish) => void;
  country: string;
  province: string;
  services: string[];
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: -34.6037,
  lng: -58.3816,
};

// Replace with your Google Maps API key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

export const ParishMap = ({ parishes, selectedParish, onParishSelect, country, province, services }: ParishMapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeMarker, setActiveMarker] = useState<string | number | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [markers, setMarkers] = useState<ParishMarker[]>([]);
  const previousFiltersRef = useRef({ country, province, parishId: selectedParish?.id });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // Custom marker icons - only create after Google Maps is loaded
  const customIcon = isLoaded ? {
    url: "/marker.png",
    scaledSize: new google.maps.Size(37.5, 52.5), // Pin shape: 25% smaller
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(18.75, 52.5), // Anchor at the tip of the pin (bottom center)
  } : undefined;

  const greyIcon = isLoaded ? {
    url: "/marker-grey.png",
    scaledSize: new google.maps.Size(37.5, 52.5), // Pin shape: 25% smaller
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(18.75, 52.5), // Anchor at the tip of the pin (bottom center)
  } : undefined;

  // Function to get the appropriate icon based on subscription status
  const getMarkerIcon = (hasSubscription: boolean) => {
    return hasSubscription ? customIcon : greyIcon;
  };

  // Request user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Geolocation error:", error.message);
          // Use default location if user denies or error occurs
        }
      );
    }
  }, []);

  // Get bounding box based on selected filters
  const getLocationBounds = () => {
    if (selectedParish) {
      return { lat: selectedParish.coordinates.lat, lng: selectedParish.coordinates.lng, zoom: 14 };
    }

    // Check for province/state selection
    if (country !== "all" && province !== "all") {
      const selectedCountry = countryData[country as keyof typeof countryData];
      const selectedProvince = selectedCountry?.provinces.find(p => p.name === province);
      if (selectedProvince) {
        return selectedProvince.bounds;
      }
    }

    // Check for country selection
    if (country !== "all") {
      const selectedCountry = countryData[country as keyof typeof countryData];
      if (selectedCountry) {
        return selectedCountry.bounds;
      }
    }

    // Use user location or default
    return userLocation ? { ...userLocation, zoom: 12 } : { ...defaultCenter, zoom: 6 };
  };

  // Only calculate initial bounds once
  const [initialBounds] = useState(() => {
    const bounds = getLocationBounds();
    return { lat: bounds.lat, lng: bounds.lng, zoom: bounds.zoom };
  });

  const [hasInitialized, setHasInitialized] = useState(false);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);

    // Set initial center and zoom programmatically
    map.setCenter({ lat: initialBounds.lat, lng: initialBounds.lng });
    map.setZoom(initialBounds.zoom);

    // Configure zoom control position
    map.setOptions({
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM,
      },
    });

    setHasInitialized(true);
  }, [initialBounds]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (!map) {
      return;
    }

    // Check if filters actually changed using ref
    const currentFilters = { country, province, parishId: selectedParish?.id };
    const previousFilters = previousFiltersRef.current;

    const filtersChanged =
      previousFilters.country !== currentFilters.country ||
      previousFilters.province !== currentFilters.province ||
      previousFilters.parishId !== currentFilters.parishId;

    if (!filtersChanged) {
      return;
    }

    // Update previous filters ref
    previousFiltersRef.current = currentFilters;

    if (selectedParish) {
      map.panTo({ lat: selectedParish.coordinates.lat, lng: selectedParish.coordinates.lng });
      map.setZoom(14);
    } else if (country !== "all" && province !== "all") {
      // Province/state selected
      const selectedCountry = countryData[country as keyof typeof countryData];
      const selectedProvince = selectedCountry?.provinces.find(p => p.name === province);
      if (selectedProvince) {
        map.panTo({ lat: selectedProvince.bounds.lat, lng: selectedProvince.bounds.lng });
        map.setZoom(selectedProvince.bounds.zoom);
      }
    } else if (country !== "all") {
      // Country selected
      const selectedCountry = countryData[country as keyof typeof countryData];
      if (selectedCountry) {
        map.panTo({ lat: selectedCountry.bounds.lat, lng: selectedCountry.bounds.lng });
        map.setZoom(selectedCountry.bounds.zoom);
      }
    }
  }, [map, selectedParish, country, province]);

  const handleMarkerClick = (parish: Parish) => {
    setActiveMarker(parish.id);
    onParishSelect(parish);
  };

  const handleApiMarkerClick = async (marker: ParishMarker) => {
    setActiveMarker(marker.parishId);

    // Find the corresponding parish from the parishes prop
    const correspondingParish = parishes.find(parish => parish.id === marker.parishId);

    if (correspondingParish) {
      // If we have the full parish data, use it
      onParishSelect(correspondingParish);
    } else {
      // Fetch full parish details from the API
      try {
        const parishDetails = await getParishDetails(marker.parishId);

        if (parishDetails) {
          // API now returns a complete Parish object
          onParishSelect(parishDetails as Parish);
        } else {
          // Fallback: create a basic parish object from marker data
          const basicParish: Parish = {
            id: marker.parishId,
            name: marker.title,
            address: marker.location,
            coordinates: {
              lat: marker.coordinates.lat,
              lng: marker.coordinates.long
            },
            priest: "Información no disponible",
            phone: "",
            email: "",
            country: "all",
            province: "all",
            city: "",
            services: []
          };

          onParishSelect(basicParish);
        }
      } catch (error) {
        console.error("Error fetching parish details:", error);

        // Fallback: create a basic parish object from marker data
        const basicParish: Parish = {
          id: marker.parishId,
          name: marker.title,
          address: marker.location,
          coordinates: {
            lat: marker.coordinates.lat,
            lng: marker.coordinates.long
          },
          priest: "Información no disponible",
          phone: "",
          email: "",
          country: "all",
          province: "all",
          city: "",
          services: []
        };

        onParishSelect(basicParish);
      }
    }
  };

  // Fetch markers when map bounds change - using ref to track bounds across renders
  const lastBoundsRef = useRef<string | null>(null);

  const handleBoundsChanged = useCallback(() => {
    if (!map) return;

    const bounds = map.getBounds();
    if (!bounds) {
      return;
    }

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    // Create a string representation of bounds to detect actual changes
    const boundsKey = `${sw.lat().toFixed(4)},${sw.lng().toFixed(4)},${ne.lat().toFixed(4)},${ne.lng().toFixed(4)}`;

    // Skip if bounds haven't actually changed (within 4 decimal places)
    if (boundsKey === lastBoundsRef.current) {
      return;
    }

    lastBoundsRef.current = boundsKey;

    // Convert country name to ID
    let countryId: number | undefined = undefined;
    if (country !== "all") {
      const COUNTRY_IDS: Record<string, number> = {
        Argentina: 1,
        Uruguay: 2,
        Paraguay: 3,
        Chile: 4,
        "República Dominicana": 5,
        Perú: 6,
      };
      countryId = COUNTRY_IDS[country];
    }

    getParishMarkers({
      min_lat: sw.lat(),
      max_lat: ne.lat(),
      min_lon: sw.lng(),
      max_lon: ne.lng(),
      countryId,
    })
      .then((response) => {
        setMarkers(response.markers);
      })
      .catch((error) => {
        console.error("❌ Error fetching markers:", error);
      });
  }, [map, country, services]);


  // Set up bounds listener only once
  useEffect(() => {

    if (!map) {
      return;
    }

    const listener = map.addListener("bounds_changed", handleBoundsChanged);

    // Initial fetch immediately
    handleBoundsChanged();

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map, handleBoundsChanged]);

  if (!isLoaded) {
    return (
      <div className="h-full w-full rounded-lg overflow-hidden shadow-elevated relative z-0 flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">Cargando mapa...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-elevated relative z-0">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          scaleControl: false,
          rotateControl: false,
          keyboardShortcuts: false,
          panControl: false,
          disableDefaultUI: true,
          clickableIcons: false,
        }}
      >
        {/* Legacy parish markers (if any) */}
        {parishes.map((parish) => (
          <Marker
            key={`parish-${parish.id}`}
            position={{ lat: parish.coordinates.lat, lng: parish.coordinates.lng }}
            onClick={() => handleMarkerClick(parish)}
            icon={customIcon}
          >
            {activeMarker === parish.id && (
              <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                <div className="text-sm">
                  <h3 className="font-semibold">{parish.name}</h3>
                  <p className="text-xs text-muted-foreground">{parish.address}</p>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}

        {/* API markers */}
        {markers.map((marker) => (
          <Marker
            key={`marker-${marker.parishId}`}
            position={{ lat: marker.coordinates.lat, lng: marker.coordinates.long }}
            onClick={() => handleApiMarkerClick(marker)}
            icon={getMarkerIcon(marker.hasSubscription)}
          >
            {activeMarker === marker.parishId && (
              <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                <div className="text-sm">
                  <h3 className="font-semibold">{marker.title}</h3>
                  <p className="text-xs text-muted-foreground">{marker.location}</p>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </div>
  );
};
