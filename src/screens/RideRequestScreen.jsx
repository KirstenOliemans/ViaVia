/* ══════════════════════════════════════════════════════════════════
   RideRequestScreen — Figma 207:5213 / 170:8343 / 148:3660
   Three-step ride request flow:
     pickup  → user taps map or quick-pick → auto-advance
     dropoff → user taps map or quick-pick → presses Confirm
     confirmed → summary card → Done → community tab
   ══════════════════════════════════════════════════════════════════ */
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap } from 'react-leaflet';
import { useApp } from '../context/AppContext';
import './RideRequestScreen.css';

// ── Figma assets ─────────────────────────────────────────────────
const ICO_BELL       = '/icons/bell-ride-ico.svg';
const ICO_LOC_FROM   = '/icons/loc-from-ico.svg';
const ICO_CROSSHAIR  = '/icons/crosshair-ico.svg';
const ICO_STAR_FROM  = '/icons/star-from-ico.svg';
const ICO_STAR_TO    = '/icons/star-to-ico.svg';
const ICO_LOC_TO     = '/icons/loc-to-ico.svg';

// ── Live-location blue-dot icon ──────────────────────────────────
const USER_DOT_ICON = L.divIcon({
  className: '',
  html: '<div class="rrs-user-dot"><div class="rrs-user-dot-ring"></div><div class="rrs-user-dot-core"></div></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// ── Custom map-pin icons ─────────────────────────────────────────
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

// ── Default center (Amsterdam) ───────────────────────────────────
const AMSTERDAM = [52.3676, 4.9041];

// ── Quick-pick presets ───────────────────────────────────────────
const QUICK_PICKS = [
  { label: 'Home',     coords: [52.3728, 4.8936], address: 'Jordaan, Amsterdam' },
  { label: 'Hospital', coords: [52.3408, 4.9020], address: 'Hospital, 7388AA, Zeeland' },
  { label: "Mary's",   coords: [52.3600, 4.8850], address: "Mary's, Amsterdam" },
];

// ── Helpers ──────────────────────────────────────────────────────
function midpoint([la1, lo1], [la2, lo2]) {
  return [(la1 + la2) / 2, (lo1 + lo2) / 2];
}

async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    const road = data.address?.road || data.address?.suburb || data.address?.neighbourhood || '';
    const city = data.address?.city || data.address?.town || data.address?.village || '';
    if (road && city) return `${road}, ${city}`;
    if (road) return road;
    return data.display_name?.split(',').slice(0, 2).join(',').trim()
      || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

// ── Sub-components ───────────────────────────────────────────────

/** Fires onMapClick(latlng) when the Leaflet map is tapped */
function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: (e) => onMapClick(e.latlng) });
  return null;
}

/** Programmatically pans the map when `center` changes */
function MapPanner({ center }) {
  const map    = useMap();
  const prevRef = useRef(null);
  useEffect(() => {
    if (!center) return;
    const key = center.join(',');
    if (key === prevRef.current) return;
    prevRef.current = key;
    map.setView(center, Math.max(map.getZoom(), 15), { animate: true });
  }, [center, map]);
  return null;
}

// ── Shared header pill ───────────────────────────────────────────
function HeaderPill({ onBack, absolute = false }) {
  return (
    <div className={`rrs-header${absolute ? ' rrs-header-abs' : ''}`}>
      <div className="rrs-header-pill">
        <div className="rrs-header-left">
          <button className="rrs-back-btn" onClick={onBack} aria-label="Back">
            <ChevronLeft size={18} strokeWidth={2.2} color="#1a1a1a" />
          </button>
        </div>
        <button className="rrs-bell-btn" aria-label="Notifications">
          <img src={ICO_BELL} alt="" className="rrs-bell-ico" />
        </button>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────
export default function RideRequestScreen() {
  const { rideFlowOpen, rideFlowStep, closeRideFlow, setRideFlowResult } = useApp();

  // Internal step — separate from overlay visibility
  const [step, setStep]           = useState('pickup');
  const [pickupLoc, setPickupLoc] = useState({ label: 'Your current location', coords: AMSTERDAM });
  const [dropoffLoc, setDropoffLoc] = useState(null);
  const [activePick, setActivePick] = useState(null); // active quick-pick label (dropoff step)
  const [mapCenter, setMapCenter] = useState(AMSTERDAM);
  const [geocoding, setGeocoding] = useState(false);
  const [userPosition, setUserPosition] = useState(null); // live GPS [lat, lng]

  // Reset internal state every time the overlay opens
  // rideFlowStep tells us whether to start at pickup or jump straight to dropoff
  useEffect(() => {
    if (rideFlowOpen) {
      const startStep = rideFlowStep || 'pickup';
      setStep(startStep);
      setPickupLoc({ label: 'Your current location', coords: AMSTERDAM });
      setDropoffLoc(null);
      setActivePick(null);
      setMapCenter(AMSTERDAM);
      setGeocoding(false);
    } else {
      setUserPosition(null);
    }
  }, [rideFlowOpen]); // intentionally omit rideFlowStep — it's set together with rideFlowOpen

  // Watch user's live location while the overlay is open
  useEffect(() => {
    if (!rideFlowOpen || !navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
      () => {},
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [rideFlowOpen]);

  // ── Handlers ──────────────────────────────────────────────────

  function handleBack() {
    if (step === 'dropoff')   return setStep('pickup');
    if (step === 'confirmed') return setStep('dropoff');
    closeRideFlow();
  }

  /** Finish the dropoff selection — store result and close overlay back to HomeScreen */
  function finishDropoff(newDropoffLoc) {
    setRideFlowResult({ pickupLoc, dropoffLoc: newDropoffLoc });
    closeRideFlow();
  }

  /** User tapped the Leaflet map */
  async function handleMapClick(latlng) {
    const coords = [latlng.lat, latlng.lng];
    setMapCenter(coords);
    setActivePick(null);
    setGeocoding(true);
    const label = await reverseGeocode(latlng.lat, latlng.lng);
    setGeocoding(false);
    if (step === 'pickup') {
      setPickupLoc({ label, coords });
      // Auto-advance to dropoff step
      setTimeout(() => setStep('dropoff'), 350);
    } else {
      const loc = { label, coords };
      setDropoffLoc(loc);
      // Auto-close back to HomeScreen after dropoff is tapped
      setTimeout(() => finishDropoff(loc), 350);
    }
  }

  /** User tapped a quick-pick chip */
  function handleQuickPick(pick) {
    if (step === 'pickup') {
      setPickupLoc({ label: pick.address, coords: pick.coords });
      setMapCenter(pick.coords);
      // Auto-advance to dropoff step
      setTimeout(() => setStep('dropoff'), 350);
    } else {
      const loc = { label: pick.address, coords: pick.coords };
      setActivePick(pick.label);
      setDropoffLoc(loc);
      setMapCenter(pick.coords);
      // Auto-close back to HomeScreen
      setTimeout(() => finishDropoff(loc), 350);
    }
  }

  /** User tapped the crosshair / locate-me button */
  function handleLocate() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setMapCenter(coords);
        setActivePick(null);
        setGeocoding(true);
        const label = await reverseGeocode(coords[0], coords[1]);
        setGeocoding(false);
        if (step === 'pickup') {
          setPickupLoc({ label, coords });
          setTimeout(() => setStep('dropoff'), 350);
        } else {
          const loc = { label, coords };
          setDropoffLoc(loc);
          setTimeout(() => finishDropoff(loc), 350);
        }
      },
      () => {} // silently ignore permission errors
    );
  }

  /** Pickup confirm button — just advance to dropoff step */
  function handlePickupConfirm() {
    setStep('dropoff');
  }

  /** Dropoff confirm button — close with whatever location is selected */
  function handleDropoffConfirm() {
    if (!dropoffLoc) return;
    finishDropoff(dropoffLoc);
  }

  // ── Derived values ─────────────────────────────────────────────
  const isPickupStep  = step === 'pickup';
  const isDropoffStep = step === 'dropoff';

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className={`rrs-overlay${rideFlowOpen ? ' open' : ''}`}>

      {/* ══ MAP STEPS: Pickup & Dropoff ══ */}
      <div className="rrs-map-step">

        {/* Leaflet interactive map — only mount when overlay is open to prevent
            Leaflet's init (focus, tile loads, DOM mutations) from causing scroll
            side-effects on the main content while the overlay is hidden. */}
        <div className="rrs-map-container">
          {rideFlowOpen && (
            <MapContainer
              center={AMSTERDAM}
              zoom={15}
              zoomControl={false}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              />
              <MapClickHandler onMapClick={handleMapClick} />
              <MapPanner center={mapCenter} />

              {/* Live user-location blue dot */}
              {userPosition && (
                <Marker position={userPosition} icon={USER_DOT_ICON} />
              )}

              {/* Always show pickup pin */}
              <Marker position={pickupLoc.coords} icon={PICKUP_ICON} />

              {/* On dropoff step: also show dropoff pin + dashed route line */}
              {isDropoffStep && dropoffLoc && (
                <>
                  <Marker position={dropoffLoc.coords} icon={DROPOFF_ICON} />
                  <Polyline
                    positions={[pickupLoc.coords, dropoffLoc.coords]}
                    pathOptions={{ color: '#ff6038', weight: 2.5, dashArray: '8 6', opacity: 0.9 }}
                  />
                </>
              )}
            </MapContainer>
          )}
        </div>

        {/* Geocoding spinner */}
        {geocoding && (
          <div className="rrs-geocoding">Getting location…</div>
        )}

        {/* Header overlaid at top */}
        <HeaderPill onBack={handleBack} absolute />

        {/* Bottom floating panel — key={step} remounts on step change, triggering CSS enter animation */}
        <div className="rrs-bottom-float" key={step}>

          {/* Crosshair / locate-me button */}
          <div className="rrs-crosshair-row">
            <button className="rrs-crosshair-btn" onClick={handleLocate} aria-label="My location">
              <img src={ICO_CROSSHAIR} alt="" className="rrs-crosshair-ico" />
            </button>
          </div>

          {/* Location input card */}
          <div className="rrs-location-card">
            <div className="rrs-loc-icon-wrap">
              <img
                src={isPickupStep ? ICO_LOC_FROM : ICO_LOC_TO}
                alt=""
                className="rrs-loc-icon"
              />
            </div>
            <div className="rrs-input-col">
              <p className="rrs-input-label">
                {isPickupStep ? 'Where are you at?' : 'Where do you want to go?'}
              </p>
              <p className={`rrs-input-value${isDropoffStep && !dropoffLoc ? ' rrs-placeholder' : ''}`}>
                {isPickupStep
                  ? pickupLoc.label
                  : (dropoffLoc?.label || 'Tap the map or choose below')}
              </p>
            </div>
          </div>

          {/* Quick-pick chips: Home / Hospital / Mary's */}
          <div className="rrs-quickpicks">
            {QUICK_PICKS.map(pick => (
              <button
                key={pick.label}
                className={`rrs-pick-btn${
                  isDropoffStep && activePick === pick.label ? ' active' : ''
                }`}
                onClick={() => handleQuickPick(pick)}
              >
                <img
                  src={isPickupStep ? ICO_STAR_FROM : ICO_STAR_TO}
                  alt=""
                  className="rrs-pick-icon"
                />
                <span className="rrs-pick-label">{pick.label}</span>
              </button>
            ))}
          </div>

          {/* Confirm — pickup advances to dropoff; dropoff closes back to HomeScreen */}
          {isPickupStep && (
            <button className="rrs-confirm-btn" onClick={handlePickupConfirm}>
              <span className="rrs-confirm-btn-text">Confirm pickup</span>
            </button>
          )}
          {isDropoffStep && (
            <button
              className="rrs-confirm-btn"
              onClick={handleDropoffConfirm}
              disabled={!dropoffLoc}
            >
              <span className="rrs-confirm-btn-text">Use this location</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
