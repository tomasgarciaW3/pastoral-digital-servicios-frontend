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

  // Custom marker icon - only create after Google Maps is loaded
  const customIcon = isLoaded ? {
    url: "/marker.png",
    scaledSize: new google.maps.Size(37.5, 52.5), // Pin shape: 25% smaller
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(18.75, 52.5), // Anchor at the tip of the pin (bottom center)
  } : undefined;

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
      return { lat: selectedParish.location.lat, lng: selectedParish.location.lng, zoom: 14 };
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
    console.log("🗺️ Map onLoad called - setting initial position");
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
    console.log("✅ Map initialized with center:", initialBounds);
  }, [initialBounds]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    console.log("🗺️ Map pan useEffect triggered");
    if (!map) {
      console.log("❌ No map instance yet");
      return;
    }

    // Check if filters actually changed using ref
    const currentFilters = { country, province, parishId: selectedParish?.id };
    const previousFilters = previousFiltersRef.current;

    const filtersChanged =
      previousFilters.country !== currentFilters.country ||
      previousFilters.province !== currentFilters.province ||
      previousFilters.parishId !== currentFilters.parishId;

    console.log("📊 Filter comparison:", {
      previous: previousFilters,
      current: currentFilters,
      changed: filtersChanged
    });

    if (!filtersChanged) {
      console.log("✅ Filters haven't changed - skipping pan");
      return;
    }

    // Update previous filters ref
    previousFiltersRef.current = currentFilters;
    console.log("🔄 Filters changed - panning map");

    if (selectedParish) {
      console.log("📍 Panning to selected parish:", selectedParish.name);
      map.panTo({ lat: selectedParish.location.lat, lng: selectedParish.location.lng });
      map.setZoom(14);
    } else if (country !== "all" && province !== "all") {
      // Province/state selected
      console.log("🏛️ Panning to province:", province);
      const selectedCountry = countryData[country as keyof typeof countryData];
      const selectedProvince = selectedCountry?.provinces.find(p => p.name === province);
      if (selectedProvince) {
        map.panTo({ lat: selectedProvince.bounds.lat, lng: selectedProvince.bounds.lng });
        map.setZoom(selectedProvince.bounds.zoom);
      }
    } else if (country !== "all") {
      // Country selected
      console.log("🌍 Panning to country:", country);
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
    const correspondingParish = parishes.find(parish => parish.id === marker.parishId.toString());

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
            id: marker.parishId.toString(),
            name: marker.title,
            address: marker.location,
            location: {
              lat: marker.coordinates.lat,
              lng: marker.coordinates.long
            },
            pastor: "Información no disponible",
            contact: {
              phone: "",
              email: ""
            },
            country: "all",
            province: "all",
            city: "",
            services: [],
            accessibility: {},
            languages: []
          };

          onParishSelect(basicParish);
        }
      } catch (error) {
        console.error("Error fetching parish details:", error);

        // Fallback: create a basic parish object from marker data
        const basicParish: Parish = {
          id: marker.parishId.toString(),
          name: marker.title,
          address: marker.location,
          location: {
            lat: marker.coordinates.lat,
            lng: marker.coordinates.long
          },
          pastor: "Información no disponible",
          contact: {
            phone: "",
            email: ""
          },
          country: "all",
          province: "all",
          city: "",
          services: [],
          accessibility: {},
          languages: []
        };

        onParishSelect(basicParish);
      }
    }
  };

  // Fetch markers when map bounds change - using ref to track bounds across renders
  const lastBoundsRef = useRef<string | null>(null);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleBoundsChanged = useCallback(() => {
    console.log("🔄 Bounds changed callback called - map exists:", !!map);
    if (!map) return;

    const currentBounds = map.getBounds();
    if (!currentBounds) {
      console.log("❌ No bounds available yet");
      return;
    }

    const ne = currentBounds.getNorthEast();
    const sw = currentBounds.getSouthWest();
    const boundsKey = `${sw.lat().toFixed(4)},${sw.lng().toFixed(4)},${ne.lat().toFixed(4)},${ne.lng().toFixed(4)}`;

    console.log("📍 Current bounds key:", boundsKey);
    console.log("📍 Last bounds key:", lastBoundsRef.current);

    // Clear existing timeout
    if (fetchTimeoutRef.current) {
      console.log("⏱️ Clearing existing timeout");
      clearTimeout(fetchTimeoutRef.current);
    }

    console.log("⏰ Scheduling fetch in 1 second...");

    // Schedule fetch after debounce
    fetchTimeoutRef.current = setTimeout(() => {
      console.log("🎬 Debounce completed - executing fetch");

      const bounds = map.getBounds();
      if (!bounds) {
        console.log("❌ Bounds disappeared during debounce");
        return;
      }

      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      // Create a string representation of bounds to detect actual changes
      const boundsKey = `${sw.lat().toFixed(4)},${sw.lng().toFixed(4)},${ne.lat().toFixed(4)},${ne.lng().toFixed(4)}`;

      console.log("🔎 Checking bounds - Current:", boundsKey, "Last:", lastBoundsRef.current);

      // Skip if bounds haven't actually changed (within 4 decimal places)
      if (boundsKey === lastBoundsRef.current) {
        console.log("⏭️ Bounds unchanged, skipping fetch");
        return;
      }

      lastBoundsRef.current = boundsKey;

      console.log("🔍 Fetching markers for new bounds");
      console.log("📦 Bounds:", {
        ne: { lat: ne.lat(), lng: ne.lng() },
        sw: { lat: sw.lat(), lng: sw.lng() }
      });

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

      // Convert service names to IDs
      let serviceIds: number[] | undefined = undefined;
      if (services.length > 0) {
        const SERVICE_IDS: Record<string, number> = {
          misa: 1,
          confesiones: 2,
          bautismo: 3,
          matrimonio: 4,
          catequesis: 5,
          adoracion: 6,
          caritas: 7,
          retiros: 8,
        };
        serviceIds = services
          .map((service) => SERVICE_IDS[service])
          .filter((id) => id !== undefined);
      }

      getParishMarkers({
        min_lat: sw.lat(),
        max_lat: ne.lat(),
        min_lon: sw.lng(),
        max_lon: ne.lng(),
        countryId,
        serviceIds,
      })
        .then((response) => {
          console.log("✅ Fetched markers:", response.markers.length);
          console.log("🎨 Calling setMarkers - this might trigger re-render");
          setMarkers(response.markers);
          console.log("✨ setMarkers completed");
        })
        .catch((error) => {
          console.error("❌ Error fetching markers:", error);
        });
    }, 1000); // Wait 1 second after bounds stop changing
  }, [map, country, services]);

  console.log("🔄 Component render - handleBoundsChanged callback reference:", handleBoundsChanged);

  // Set up bounds listener only once
  useEffect(() => {
    console.log("🎯 useEffect for bounds listener triggered - map exists:", !!map);
    console.log("🎯 handleBoundsChanged reference:", handleBoundsChanged);

    if (!map) {
      console.log("⚠️ No map yet, skipping listener setup");
      return;
    }

    console.log("✅ Setting up bounds_changed listener NOW");
    const listener = map.addListener("bounds_changed", handleBoundsChanged);
    console.log("✅ Listener attached:", listener);

    // Initial fetch after a short delay
    console.log("⏰ Scheduling initial fetch in 500ms");
    const initialTimeout = setTimeout(() => {
      console.log("🚀 Executing initial marker fetch");
      handleBoundsChanged();
    }, 500);

    return () => {
      console.log("🧹 ===== CLEANUP FUNCTION CALLED =====");
      if (fetchTimeoutRef.current) {
        console.log("🧹 Clearing fetch timeout");
        clearTimeout(fetchTimeoutRef.current);
      }
      console.log("🧹 Clearing initial timeout");
      clearTimeout(initialTimeout);
      console.log("🧹 Removing bounds_changed listener");
      google.maps.event.removeListener(listener);
      console.log("🧹 ===== CLEANUP COMPLETE =====");
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
        }}
      >
        {/* Legacy parish markers (if any) */}
        {parishes.map((parish) => (
          <Marker
            key={`parish-${parish.id}`}
            position={{ lat: parish.location.lat, lng: parish.location.lng }}
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
            icon={customIcon}
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
