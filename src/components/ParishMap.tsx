import { useEffect, useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { Parish } from "@/types/parish";
import { countryData } from "@/data/mockParishes";
import { getParishMarkers, ParishMarker } from "@/services/parishService";

interface ParishMapProps {
  parishes: Parish[];
  selectedParish: Parish | null;
  onParishSelect: (parish: Parish) => void;
  country: string;
  province: string;
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

export const ParishMap = ({ parishes, selectedParish, onParishSelect, country, province }: ParishMapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeMarker, setActiveMarker] = useState<string | number | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [markers, setMarkers] = useState<ParishMarker[]>([]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

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

  const locationBounds = getLocationBounds();
  const center = { lat: locationBounds.lat, lng: locationBounds.lng };
  const zoom = locationBounds.zoom;

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    // Configure zoom control position
    map.setOptions({
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM,
      },
    });

    // Set bounds to 5km radius if user location is available
    if (userLocation && !selectedParish && country === "all") {
      const bounds = new google.maps.LatLngBounds();
      // Calculate 5km bounding box (approximately 0.045 degrees latitude/longitude)
      const offset = 0.045; // ~5km
      bounds.extend({
        lat: userLocation.lat + offset,
        lng: userLocation.lng + offset,
      });
      bounds.extend({
        lat: userLocation.lat - offset,
        lng: userLocation.lng - offset,
      });
      map.fitBounds(bounds);
    }
  }, [userLocation, selectedParish, country]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (!map) return;

    if (selectedParish) {
      map.panTo({ lat: selectedParish.location.lat, lng: selectedParish.location.lng });
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
    } else if (userLocation && !selectedParish) {
      // No filters, use user location with 5km radius
      const bounds = new google.maps.LatLngBounds();
      const offset = 0.045; // ~5km
      bounds.extend({
        lat: userLocation.lat + offset,
        lng: userLocation.lng + offset,
      });
      bounds.extend({
        lat: userLocation.lat - offset,
        lng: userLocation.lng - offset,
      });
      map.fitBounds(bounds);
    }
  }, [map, selectedParish, country, province, userLocation]);

  const handleMarkerClick = (parish: Parish) => {
    setActiveMarker(parish.id);
    onParishSelect(parish);
  };

  const handleApiMarkerClick = (marker: ParishMarker) => {
    setActiveMarker(marker.parishId);
    // TODO: Fetch full parish details when needed
  };

  // Fetch markers when map bounds change
  const fetchMarkersInBounds = useCallback(() => {
    if (!map) return;

    const bounds = map.getBounds();
    if (!bounds) return;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    getParishMarkers({
      min_lat: sw.lat(),
      max_lat: ne.lat(),
      min_lon: sw.lng(),
      max_lon: ne.lng(),
    })
      .then((response) => {
        setMarkers(response.markers);
      })
      .catch((error) => {
        console.error("Error fetching markers:", error);
      });
  }, [map]);

  // Fetch markers when map is idle (after panning/zooming)
  useEffect(() => {
    if (!map) return;

    const listener = map.addListener("idle", fetchMarkersInBounds);

    // Initial fetch
    fetchMarkersInBounds();

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map, fetchMarkersInBounds]);

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
        center={center}
        zoom={zoom}
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
          zoomControl: true,
        }}
      >
        {/* Legacy parish markers (if any) */}
        {parishes.map((parish) => (
          <Marker
            key={`parish-${parish.id}`}
            position={{ lat: parish.location.lat, lng: parish.location.lng }}
            onClick={() => handleMarkerClick(parish)}
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
