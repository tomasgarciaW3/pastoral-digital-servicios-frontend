import { useEffect, useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { Parish } from "@/types/parish";

interface ParishMapProps {
  parishes: Parish[];
  selectedParish: Parish | null;
  onParishSelect: (parish: Parish) => void;
  country: string;
}

const countryBounds: Record<string, { lat: number; lng: number; zoom: number }> = {
  Argentina: { lat: -38.4161, lng: -63.6167, zoom: 5 },
  Chile: { lat: -35.6751, lng: -71.543, zoom: 5 },
  Uruguay: { lat: -32.5228, lng: -55.7658, zoom: 7 },
  Paraguay: { lat: -23.4425, lng: -58.4438, zoom: 6 },
  Brasil: { lat: -14.235, lng: -51.9253, zoom: 4 },
};

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

export const ParishMap = ({ parishes, selectedParish, onParishSelect, country }: ParishMapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

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

  const center = selectedParish
    ? { lat: selectedParish.location.lat, lng: selectedParish.location.lng }
    : country !== "all" && countryBounds[country]
    ? countryBounds[country]
    : userLocation || defaultCenter;

  const zoom = selectedParish ? 14 : country !== "all" && countryBounds[country] ? countryBounds[country].zoom : userLocation ? 12 : 6;

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
    if (map && selectedParish) {
      map.panTo({ lat: selectedParish.location.lat, lng: selectedParish.location.lng });
      map.setZoom(14);
    } else if (map && country !== "all" && countryBounds[country]) {
      const bounds = countryBounds[country];
      map.panTo({ lat: bounds.lat, lng: bounds.lng });
      map.setZoom(bounds.zoom);
    } else if (map && userLocation && country === "all" && !selectedParish) {
      // Set bounds to 5km radius around user location
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
  }, [map, selectedParish, country, userLocation]);

  const handleMarkerClick = (parish: Parish) => {
    setActiveMarker(parish.id);
    onParishSelect(parish);
  };

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
        {parishes.map((parish) => (
          <Marker
            key={parish.id}
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
      </GoogleMap>
    </div>
  );
};
