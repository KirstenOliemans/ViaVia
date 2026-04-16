import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ChevronLeft } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { useApp } from '../context/AppContext';
import './PassengerRideScreen.css';

const ICO_BELL     = '/icons/bell-notif-ico.svg';
const ICO_CAR      = '/icons/car-ride-ico.svg';
const ICO_LOCATION = '/icons/location-marker-ico.svg';
const ICO_FARE     = '/icons/fare-ico.svg';
const ICO_CLOCK    = '/icons/clock-ico.svg';
const ICO_PHONE    = '/icons/phone-ico.svg';
const ICO_PROFILE  = '/icons/profile-ico.svg';
const ICO_VERIFIED = '/icons/verified-ico.svg';

// Mock driver data
const MOCK_DRIVER = {
  name: 'Emma Visser',
  initials: 'EV',
  verified: true,
  car: 'Tesla Model 3',
  color: 'Blue',
  plate: '678-893',
};

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

function StatusBanner({ status }) {
  if (!status || status === 'cancelled' || status === 'completed') return null;
  if (status === 'accepted') {
    return (
      <p className="prs-status-waiting">Waiting for driver to start...</p>
    );
  }
  if (status === 'driver_en_route') {
    return (
      <div className="prs-status-pill prs-status-orange">
        <span>🚗 Driver is on the way</span>
      </div>
    );
  }
  if (status === 'driver_arrived') {
    return (
      <div className="prs-status-pill prs-status-green">
        <span>📍 Driver has arrived!</span>
      </div>
    );
  }
  if (status === 'in_progress') {
    return (
      <div className="prs-status-pill prs-status-green">
        <span>🟢 Trip in progress</span>
      </div>
    );
  }
  return null;
}

export default function PassengerRideScreen() {
  const {
    passengerRideOpen,
    closePassengerRide,
    activeRide,
    rideFlowStatus,
    cancelActiveRide,
    openChat,
  } = useApp();

  const fromCoords = activeRide?.fromCoords || [52.3791, 4.9003];
  const toCoords   = activeRide?.toCoords   || [52.3105, 4.7683];
  const mapCenter  = midpoint(fromCoords, toCoords);
  const mapBounds  = [fromCoords, toCoords];

  const showChatFab = rideFlowStatus && rideFlowStatus !== 'cancelled' && rideFlowStatus !== 'completed';

  return (
    <div className={`prs-overlay${passengerRideOpen ? ' open' : ''}`}>
      {/* HEADER */}
      <div className="prs-header">
        <div className="prs-header-pill">
          <button className="prs-back-btn" onClick={closePassengerRide}>
            <ChevronLeft size={18} strokeWidth={2.2} color="#1a1a1a" />
          </button>
          <span className="prs-header-title">Ride Details</span>
          <button className="prs-bell-btn">
            <img src={ICO_BELL} alt="" className="prs-bell-ico" />
          </button>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="prs-content">

        {/* Driver info card */}
        <div className="prs-card">
          <div className="prs-driver-row">
            <div className="prs-avatar-container">
              <img src={ICO_PROFILE} alt="" className="prs-avatar-ico" />
            </div>
            <div className="prs-driver-info">
              <span className="prs-driver-name">{MOCK_DRIVER.name}</span>
              <div className="prs-verified-row">
                <img src={ICO_VERIFIED} alt="" className="prs-verified-ico" />
                <span className="prs-verified-label">Verified Driver</span>
              </div>
            </div>
          </div>
          <div className="prs-divider" />
          <div className="prs-car-row">
            <img src={ICO_CAR} alt="" className="prs-car-ico" />
            <div className="prs-car-info">
              <span className="prs-car-name">{MOCK_DRIVER.car} · {MOCK_DRIVER.color}</span>
              <span className="prs-car-plate">{MOCK_DRIVER.plate}</span>
            </div>
          </div>
        </div>

        {/* Map card */}
        <div className="prs-card">
          {/* Map */}
          <div className="prs-map-wrap">
            {passengerRideOpen && (
              <MapContainer
                key={activeRide?.id || 'passenger-map'}
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

          {/* Status banner */}
          <StatusBanner status={rideFlowStatus} />

          {/* Trip info */}
          <div className="prs-trip-info">
            <div className="prs-trip-row">
              <img src={ICO_LOCATION} alt="" className="prs-trip-ico" />
              <p className="prs-trip-text">
                <strong>{activeRide?.from || 'Pickup'}</strong>
                {' '}→{' '}
                <strong>{activeRide?.to || 'Dropoff'}</strong>
              </p>
            </div>
            <div className="prs-trip-row">
              <img src={ICO_FARE} alt="" className="prs-trip-ico" />
              <span className="prs-fare-text">{activeRide?.price || '€ 0.00'}</span>
            </div>
            <div className="prs-trip-row">
              <img src={ICO_CLOCK} alt="" className="prs-trip-ico" />
              <span className="prs-time-text">{activeRide?.when || '—'}</span>
            </div>
          </div>
        </div>

        {/* Action row */}
        <div className="prs-action-row">
          <button className="prs-cancel-btn" onClick={cancelActiveRide}>
            Cancel
          </button>
          <button className="prs-call-btn">
            <img src={ICO_PHONE} alt="" className="prs-phone-ico" />
            Call Driver
          </button>
        </div>

      </div>

      {/* Chat FAB */}
      {showChatFab && (
        <button className="prs-chat-fab" onClick={openChat}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}
