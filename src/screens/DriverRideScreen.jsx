import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ChevronLeft } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { useApp } from '../context/AppContext';
import './DriverRideScreen.css';

const ICO_BELL     = 'https://www.figma.com/api/mcp/asset/59948073-7e06-4ba2-a680-5f416f59ded3';
const ICO_LOCATION = 'https://www.figma.com/api/mcp/asset/dda2a857-50bd-4f19-a578-c6c5dbc1cdc4';
const ICO_FARE     = 'https://www.figma.com/api/mcp/asset/677ef771-20ca-4de6-a237-65ee0ed4a167';
const ICO_CLOCK    = 'https://www.figma.com/api/mcp/asset/af30fb73-0d03-4d4e-a15a-0799391019db';
const ICO_PHONE    = 'https://www.figma.com/api/mcp/asset/d55fd7be-baf6-4ff7-9282-8ab1ac8e6b7a';
const ICO_PROFILE  = 'https://www.figma.com/api/mcp/asset/b077ac77-cfbb-4762-bf28-081ec92c18ce';
const ICO_VERIFIED = 'https://www.figma.com/api/mcp/asset/d36eaba8-d17f-4096-b214-819269c26718';

// Map pin icons
const makePinIcon = (color) => L.divIcon({
  className: '',
  html: `<svg width="28" height="38" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 0C6.268 0 0 6.268 0 14c0 5.437 3.087 10.165 7.622 12.596L14 38l6.378-11.404C24.913 24.165 28 19.437 28 14C28 6.268 21.732 0 14 0z" fill="${color}"/>
    <circle cx="14" cy="14" r="6" fill="white"/>
  </svg>`,
  iconSize: [28, 38],
  iconAnchor: [14, 38],
});
const PICKUP_ICON  = makePinIcon('#ff6038');
const DROPOFF_ICON = makePinIcon('#2e3b3b');

function midpoint([la1, lo1], [la2, lo2]) {
  return [(la1 + la2) / 2, (lo1 + lo2) / 2];
}

function getActionButton(status, onStart, onArrive, onBeginTrip, onEnd) {
  if (status === 'accepted') {
    return (
      <button className="drs-action-status-btn drs-btn-orange" onClick={onStart}>
        Start the ride
      </button>
    );
  }
  if (status === 'driver_en_route') {
    return (
      <button className="drs-action-status-btn drs-btn-dark" onClick={onArrive}>
        I've Arrived
      </button>
    );
  }
  if (status === 'driver_arrived') {
    return (
      <button className="drs-action-status-btn drs-btn-orange" onClick={onBeginTrip}>
        Begin Trip
      </button>
    );
  }
  if (status === 'in_progress') {
    return (
      <button className="drs-action-status-btn drs-btn-dark" onClick={onEnd}>
        End Trip
      </button>
    );
  }
  return null;
}

export default function DriverRideScreen() {
  const {
    driverRideOpen,
    closeDriverRide,
    activeRide,
    rideFlowStatus,
    startRideFlow,
    driverArrive,
    beginTrip,
    cancelActiveRide,
    completeRide,
    openChat,
  } = useApp();

  const fromCoords = activeRide?.fromCoords || [52.3791, 4.9003];
  const toCoords   = activeRide?.toCoords   || [52.3105, 4.7683];
  const mapCenter  = midpoint(fromCoords, toCoords);
  const mapBounds  = [fromCoords, toCoords];

  const passengerName      = activeRide?.name || 'Passenger';
  const passengerInitials  = activeRide?.initials || passengerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const passengerVerified  = activeRide?.verified ?? false;

  const showChatFab = rideFlowStatus && rideFlowStatus !== 'cancelled' && rideFlowStatus !== 'completed';

  return (
    <div className={`drs-overlay${driverRideOpen ? ' open' : ''}`}>
      {/* HEADER */}
      <div className="drs-header">
        <div className="drs-header-pill">
          <button className="drs-back-btn" onClick={closeDriverRide}>
            <ChevronLeft size={18} strokeWidth={2.2} color="#1a1a1a" />
          </button>
          <span className="drs-header-title">Ride Details</span>
          <button className="drs-bell-btn">
            <img src={ICO_BELL} alt="" className="drs-bell-ico" />
          </button>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="drs-content">

        {/* Passenger info card */}
        <div className="drs-card">
          <div className="drs-passenger-row">
            <div className="drs-avatar-container">
              <img src={ICO_PROFILE} alt="" className="drs-avatar-ico" />
            </div>
            <div className="drs-passenger-info">
              <span className="drs-passenger-name">{passengerName}</span>
              <div className="drs-verified-row">
                <img src={ICO_VERIFIED} alt="" className="drs-verified-ico" />
                <span className="drs-verified-label">Verified Passenger</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map card */}
        <div className="drs-card">
          {/* Map */}
          <div className="drs-map-wrap">
            {driverRideOpen && (
              <MapContainer
                key={activeRide?.id || 'driver-map'}
                bounds={mapBounds}
                boundsOptions={{ padding: [32, 32] }}
                zoomControl={false}
                dragging={false}
                scrollWheelZoom={false}
                touchZoom={false}
                doubleClickZoom={false}
                keyboard={false}
                style={{ width: '100%', height: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                />
                <Marker position={fromCoords} icon={PICKUP_ICON} />
                <Marker position={toCoords} icon={DROPOFF_ICON} />
                <Polyline
                  positions={[fromCoords, toCoords]}
                  pathOptions={{ color: '#ff6038', weight: 2.5, dashArray: '8 6', opacity: 0.9 }}
                />
              </MapContainer>
            )}
          </div>

          {/* Trip info */}
          <div className="drs-trip-info">
            <div className="drs-trip-row">
              <img src={ICO_LOCATION} alt="" className="drs-trip-ico" />
              <p className="drs-trip-text">
                <strong>{activeRide?.from || 'Pickup'}</strong>
                {' '}→{' '}
                <strong>{activeRide?.to || 'Dropoff'}</strong>
              </p>
            </div>
            <div className="drs-trip-row">
              <img src={ICO_FARE} alt="" className="drs-trip-ico" />
              <span className="drs-fare-text">{activeRide?.price || '€ 0.00'}</span>
            </div>
            <div className="drs-trip-row">
              <img src={ICO_CLOCK} alt="" className="drs-trip-ico" />
              <span className="drs-time-text">{activeRide?.when || '—'}</span>
            </div>
          </div>

          {/* Status action button */}
          {getActionButton(
            rideFlowStatus,
            startRideFlow,
            driverArrive,
            beginTrip,
            completeRide,
          )}
        </div>

        {/* Action row */}
        <div className="drs-action-row">
          <button className="drs-cancel-btn" onClick={cancelActiveRide}>
            Cancel
          </button>
          <button className="drs-call-btn">
            <img src={ICO_PHONE} alt="" className="drs-phone-ico" />
            Call Passenger
          </button>
        </div>

      </div>

      {/* Chat FAB */}
      {showChatFab && (
        <button className="drs-chat-fab" onClick={openChat}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}
