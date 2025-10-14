import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Parish } from "@/types/parish";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface ParishMapProps {
  parishes: Parish[];
  selectedParish: Parish | null;
  onParishSelect: (parish: Parish) => void;
  country: string;
}

const countryBounds: Record<string, [[number, number], [number, number]]> = {
  Argentina: [[-55.0, -73.5], [-21.8, -53.6]],
  Chile: [[-56.0, -75.6], [-17.5, -66.4]],
  Uruguay: [[-35.0, -58.4], [-30.1, -53.1]],
  Paraguay: [[-27.6, -62.6], [-19.3, -54.3]],
  Brasil: [[-33.7, -73.9], [5.3, -34.8]],
};

const MapUpdater = ({ center, bounds }: { center: L.LatLngExpression; bounds?: L.LatLngBoundsExpression }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds);
    } else {
      map.setView(center, map.getZoom());
    }
  }, [center, bounds, map]);
  return null;
};

export const ParishMap = ({ parishes, selectedParish, onParishSelect, country }: ParishMapProps) => {
  const center: L.LatLngExpression = selectedParish
    ? [selectedParish.location.lat, selectedParish.location.lng]
    : [-34.6037, -58.3816];

  const bounds = country !== "all" && countryBounds[country] 
    ? (countryBounds[country] as L.LatLngBoundsExpression)
    : undefined;

  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-elevated relative z-0">
      <MapContainer
        center={center}
        zoom={selectedParish ? 14 : 6}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <MapUpdater center={center} bounds={bounds} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {parishes.map((parish) => (
          <Marker
            key={parish.id}
            position={[parish.location.lat, parish.location.lng] as L.LatLngExpression}
            eventHandlers={{
              click: () => onParishSelect(parish),
            }}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-semibold">{parish.name}</h3>
                <p className="text-xs text-muted-foreground">{parish.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
