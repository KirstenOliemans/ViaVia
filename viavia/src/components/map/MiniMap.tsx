import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Location } from '../../types';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const createSmallIcon = (color: string) => {
  return L.divIcon({
    html: `<div style="width:8px;height:8px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>`,
    className: '',
    iconAnchor: [4, 4],
  });
};

interface FitBoundsProps {
  from: Location;
  to: Location;
}

const FitBounds: React.FC<FitBoundsProps> = ({ from, to }) => {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (!fitted.current) {
      const bounds = L.latLngBounds(
        [from.lat, from.lng],
        [to.lat, to.lng]
      );
      map.fitBounds(bounds, { padding: [15, 15] });
      fitted.current = true;
    }
  }, [from, to, map]);

  return null;
};

interface MiniMapProps {
  from: Location;
  to: Location;
  width?: number;
  height?: number;
}

const MiniMap: React.FC<MiniMapProps> = ({ from, to, width = 100, height = 100 }) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 12,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <MapContainer
        center={[from.lat, from.lng]}
        zoom={12}
        style={{ width: '100%', height: '100%' }}
        dragging={false}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        attributionControl={false}
        keyboard={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds from={from} to={to} />
        <Marker
          position={[from.lat, from.lng]}
          icon={createSmallIcon('#23558B')}
        />
        <Marker
          position={[to.lat, to.lng]}
          icon={createSmallIcon('#FEB930')}
        />
        <Polyline
          positions={[
            [from.lat, from.lng],
            [to.lat, to.lng],
          ]}
          color="#23558B"
          weight={2}
          opacity={0.8}
        />
      </MapContainer>
    </div>
  );
};

export default MiniMap;
