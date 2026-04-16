import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Location } from '../../types';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const createCustomIcon = (color: string, type: 'circle' | 'pin') => {
  return L.divIcon({
    html: type === 'circle'
      ? `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`
      : `<div style="width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:20px solid ${color};filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))"></div>`,
    className: '',
    iconAnchor: type === 'circle' ? [7, 7] : [8, 20],
  });
};

interface MapClickHandlerProps {
  onPinDrop?: (lat: number, lng: number) => void;
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onPinDrop }) => {
  useMapEvents({
    click(e) {
      if (onPinDrop) {
        onPinDrop(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

interface FitBoundsProps {
  from?: Location;
  to?: Location;
}

const FitBounds: React.FC<FitBoundsProps> = ({ from, to }) => {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (from && to) {
      const bounds = L.latLngBounds(
        [from.lat, from.lng],
        [to.lat, to.lng]
      );
      map.fitBounds(bounds, { padding: [60, 60] });
      fitted.current = true;
    } else if (!from && !to && fitted.current) {
      map.setView([40.7580, -73.9855], 13);
      fitted.current = false;
    }
  }, [from, to, map]);

  return null;
};

interface MainMapProps {
  fromLocation?: Location;
  toLocation?: Location;
  isPinMode?: boolean;
  onPinDrop?: (lat: number, lng: number) => void;
}

const MainMap: React.FC<MainMapProps> = ({ fromLocation, toLocation, isPinMode, onPinDrop }) => {
  return (
    <div style={{ width: '100%', height: '100%', cursor: isPinMode ? 'crosshair' : 'grab' }}>
      <MapContainer
        center={[40.7580, -73.9855]}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <FitBounds from={fromLocation} to={toLocation} />
        {isPinMode && <MapClickHandler onPinDrop={onPinDrop} />}
        {fromLocation && (
          <Marker
            position={[fromLocation.lat, fromLocation.lng]}
            icon={createCustomIcon('#23558B', 'circle')}
          />
        )}
        {toLocation && (
          <Marker
            position={[toLocation.lat, toLocation.lng]}
            icon={createCustomIcon('#FEB930', 'pin')}
          />
        )}
        {fromLocation && toLocation && (
          <Polyline
            positions={[
              [fromLocation.lat, fromLocation.lng],
              [toLocation.lat, toLocation.lng],
            ]}
            color="#23558B"
            weight={3}
            opacity={0.7}
            dashArray="6, 4"
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MainMap;
