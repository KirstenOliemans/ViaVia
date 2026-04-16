import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ChevronLeft } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { useApp } from '../context/AppContext';
import './RideDetailSheet.css';

// ── Figma asset URLs — refreshed from node 173:5665 (current session) ──
// Using same assets as CommunityScreen for perfect consistency
const ICO_BELL    = '/icons/bell-notif-ico.svg';
const ICO_PICKUP  = '/icons/pickup-arrow-ico.svg';
const ICO_DROPOFF = '/icons/dropoff-arrow-ico.svg';
const ICO_COST    = '/icons/cost-ico.svg';
const ICO_TIME    = '/icons/time-ico.svg';
const VERIFIED_ICO = '/icons/verified-ico.svg';
const CHECK_ICO   = '/icons/check-icon.svg';

// ── Custom map pin icons ─────────────────────────────────────────
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

// ── Helpers ──────────────────────────────────────────────────────
function midpoint([la1, lo1], [la2, lo2]) {
  return [(la1 + la2) / 2, (lo1 + lo2) / 2];
}

// ── Main component ───────────────────────────────────────────────
export default function RideDetailSheet() {
  const {
    selectedRide,
    acceptedRides,
    acceptRide,
    showAcceptToast,
    closeRideDetail,
    openDriverRide,
    openChat,
  } = useApp();

  const isOpen = selectedRide !== null;

  function handleAccept() {
    acceptRide(selectedRide.id);
    showAcceptToast({ name: selectedRide.name.split(' ')[0] });
    // Stay in the sheet — driver now sees "Chat + Start Ride" state
  }

  const isAccepted = selectedRide ? acceptedRides.has(selectedRide.id) : false;

  // Map center / bounds
  const mapCenter = selectedRide?.fromCoords && selectedRide?.toCoords
    ? midpoint(selectedRide.fromCoords, selectedRide.toCoords)
    : selectedRide?.fromCoords || [52.3676, 4.9041];

  const mapBounds = selectedRide?.fromCoords && selectedRide?.toCoords
    ? [selectedRide.fromCoords, selectedRide.toCoords]
    : null;

  return (
    <div className={`rds-overlay${isOpen ? ' open' : ''}`}>
      {selectedRide && (
        <>
          {/* HEADER */}
          <div className="rds-header">
            <div className="rds-header-pill">
              <button className="rds-back-btn" onClick={closeRideDetail}>
                <ChevronLeft size={18} strokeWidth={2.2} color="#1a1a1a" />
              </button>
              <span className="rds-header-title">Ride Details</span>
              <button className="rds-bell-btn">
                <img src={ICO_BELL} alt="" className="rds-bell-ico" />
              </button>
            </div>
          </div>

          {/* MAP */}
          <div className="rds-map-wrap">
            <MapContainer
              key={selectedRide.id}
              {...(mapBounds
                ? { bounds: mapBounds, boundsOptions: { padding: [32, 32] } }
                : { center: mapCenter, zoom: 13 }
              )}
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
              {selectedRide.fromCoords && (
                <Marker position={selectedRide.fromCoords} icon={PICKUP_ICON} />
              )}
              {selectedRide.toCoords && (
                <Marker position={selectedRide.toCoords} icon={DROPOFF_ICON} />
              )}
              {selectedRide.fromCoords && selectedRide.toCoords && (
                <Polyline
                  positions={[selectedRide.fromCoords, selectedRide.toCoords]}
                  pathOptions={{ color: '#ff6038', weight: 2.5, dashArray: '8 6', opacity: 0.9 }}
                />
              )}
            </MapContainer>
          </div>

          {/* SCROLLABLE BODY */}
          <div className="rds-body">

            {/* User card */}
            <div className="rds-user-card">
              {selectedRide.avatar
                ? <img src={selectedRide.avatar} alt={selectedRide.name} className="rds-avatar" />
                : (
                  <div className="rds-avatar rds-avatar-initials">
                    {selectedRide.initials || '?'}
                  </div>
                )
              }
              <div className="rds-user-info">
                <div className="rds-name-row">
                  <span className="rds-name">{selectedRide.name}</span>
                  {/* Don't show match % when viewing own ride (user is the passenger) */}
                  {selectedRide.match && !selectedRide.isOwn && (
                    <span className="rds-match">{selectedRide.match}% match</span>
                  )}
                </div>
                {selectedRide.verified && (
                  <div className="rds-verified-row">
                    <img src={VERIFIED_ICO} alt="" className="rds-verified-ico" />
                    <span className="rds-verified-text">Verified Member</span>
                  </div>
                )}
                {selectedRide.communities && (
                  <span className="rds-communities">{selectedRide.communities} shared communities</span>
                )}
              </div>
            </div>

            {/* Route info card */}
            <div className="rds-info-card">
              {/* Pickup */}
              <div className="rds-info-row">
                <img src={ICO_PICKUP} alt="" className="rds-info-icon" />
                <p className="rds-info-text">
                  <span className="rds-info-bold">Pickup: </span>
                  {selectedRide.pickup}
                </p>
              </div>
              {/* Dropoff */}
              <div className="rds-info-row">
                <img src={ICO_DROPOFF} alt="" className="rds-info-icon" />
                <p className="rds-info-text">
                  <span className="rds-info-bold">Drop-off: </span>
                  {selectedRide.dropoff}
                </p>
              </div>
              {/* Time */}
              <div className="rds-info-row">
                <img src={ICO_TIME} alt="" className="rds-info-icon" />
                <p className="rds-info-text">
                  {selectedRide.time}
                  {selectedRide.duration && (
                    <span className="rds-duration"> ({selectedRide.duration})</span>
                  )}
                </p>
              </div>
              {/* Cost — always shown */}
              <div className="rds-info-row">
                <img src={ICO_COST} alt="" className="rds-info-icon" />
                <p className="rds-info-text">{selectedRide.price || 'Free (community ride)'}</p>
              </div>
              {/* Pickup note */}
              <p className="rds-pickup-note">Exact pickup shared after confirmation</p>
            </div>

            {/* Action button — hidden when viewing own ride */}
            {!selectedRide.isOwn && (
              isAccepted
                ? (
                  <>
                    <button
                      className="rds-chat-btn"
                      onClick={openChat}
                    >
                      💬 Chat with Passenger
                    </button>
                    <button
                      className="rds-start-btn"
                      onClick={() => { openDriverRide(selectedRide); closeRideDetail(); }}
                    >
                      <img src={CHECK_ICO} alt="" className="rds-accepted-check" />
                      <span className="rds-start-btn-text">Start Ride</span>
                    </button>
                  </>
                )
                : (
                  <button className="rds-accept-btn" onClick={handleAccept}>
                    <span className="rds-accept-btn-text">Accept Ride</span>
                  </button>
                )
            )}
          </div>
        </>
      )}
    </div>
  );
}
