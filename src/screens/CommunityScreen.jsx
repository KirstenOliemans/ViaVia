import { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './CommunityScreen.css';

const VERIFIED_ICO = '/icons/verified-badge.svg';
const PICKUP_ICO   = '/icons/pickup-icon.svg';
const DROPOFF_ICO  = '/icons/dropoff-icon.svg';
const CLOCK_ICO    = '/icons/schedule-icon.svg';
const DOT_GREEN    = '/icons/dot-green.svg';
const DOT_ORANGE   = '/icons/dot-orange.svg';
const LOC_ON_ICO   = '/icons/loc-on.svg';
const CHECK_ICO    = '/icons/check-icon.svg';

// ── Adapter: normalize AppContext ride request → card shape ──────
function toCardShape(req) {
  return {
    id: req.id,
    name: req.name || 'Anonymous',
    initials: req.initials || (req.name ? req.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() : '?'),
    avatar: req.avatar || null,
    verified: req.verified ?? false,
    price: req.price || null,
    pickup: req.from || req.pickup || '—',
    dropoff: req.to || req.dropoff || '—',
    time: req.when || req.time || '—',
    dotPickup: req.dotPickup || 'green',
    dotDropoff: req.dotDropoff || 'orange',
    dotTime: req.dotTime || 'green',
    duration: req.duration || null,
    match: req.match || null,
    communities: req.communities || null,
    fromCoords: req.fromCoords || null,
    toCoords: req.toCoords || null,
    isOwn: req.isOwn ?? false,
  };
}

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const {
    rideRequests,
    acceptedRides, acceptRide,
    dismissedRides, dismissRide,
    acceptToast, showAcceptToast, clearAcceptToast,
    openRideDetail,
    openPassengerRide,
    targetCommunityTab, setTargetCommunityTab,
  } = useApp();

  // Dismiss timer refs — persist without re-rendering
  const scheduledTimers = useRef(new Set());
  const [fadingOutIds, setFadingOutIds] = useState(new Set());

  // Map all requests to card shape
  const allCards = rideRequests.map(toCardShape);

  // All Rides: exclude dismissed
  const allRidesCards = allCards.filter(c => !dismissedRides.has(c.id));

  // My Rides sections
  const gettingRideCards = allCards.filter(c => c.isOwn);
  const drivingCards = allCards.filter(c => acceptedRides.has(c.id) && !c.isOwn);

  // Auto-dismiss accepted rides after 5s (with fade-out at 4.2s)
  useEffect(() => {
    acceptedRides.forEach(id => {
      if (!scheduledTimers.current.has(id)) {
        scheduledTimers.current.add(id);
        // Start CSS fade-out at 4.2s
        setTimeout(() => setFadingOutIds(prev => new Set([...prev, id])), 4200);
        // Remove from list at 5s
        setTimeout(() => dismissRide(id), 5000);
      }
    });
  }, [acceptedRides, dismissRide]);

  // Switch local tab when HomeScreen signals via targetCommunityTab
  useEffect(() => {
    if (!targetCommunityTab) return;
    setActiveTab(targetCommunityTab);
    setTargetCommunityTab(null);
  }, [targetCommunityTab, setTargetCommunityTab]);

  // Auto-dismiss accept toast after 4s
  useEffect(() => {
    if (!acceptToast) return;
    const id = setTimeout(clearAcceptToast, 4000);
    return () => clearTimeout(id);
  }, [acceptToast, clearAcceptToast]);

  function handleAccept(req) {
    acceptRide(req.id);
    showAcceptToast({ name: req.name.split(' ')[0] });
  }

  function handleMyRides() {
    clearAcceptToast();
    setActiveTab('mine');
  }

  return (
    <div className="cs-wrapper">
      <div className="cs-root">

        {/* ── Tab bar: All Rides / My Rides ───────────────────── */}
        <div className="cs-tabbar">
          <button
            className={`cs-tab${activeTab === 'all' ? ' active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Rides
          </button>
          <button
            className={`cs-tab${activeTab === 'mine' ? ' active' : ''}`}
            onClick={() => setActiveTab('mine')}
          >
            My Rides
          </button>
        </div>

        {/* ── Nearby indicator ────────────────────────────────── */}
        <div className="cs-nearby">
          <img src={LOC_ON_ICO} alt="" className="cs-nearby-icon" />
          <p className="cs-nearby-text">6 people nearby looking for rides</p>
        </div>

        {/* ── All Rides tab ────────────────────────────────────── */}
        {activeTab === 'all' && (
          <div className="cs-cards">
            {allRidesCards.length === 0 && (
              <p className="cs-empty">No ride requests yet.</p>
            )}
            {allRidesCards.map(req => (
              <div
                key={req.id}
                className={`cs-card${fadingOutIds.has(req.id) ? ' cs-card--fading' : ''}`}
              >
                {/* Avatar + name + price row */}
                <div className="cs-card-header">
                  {req.avatar
                    ? <img src={req.avatar} alt={req.name} className="cs-avatar" />
                    : (
                      <div className="cs-avatar cs-avatar-initials">
                        {req.initials}
                      </div>
                    )
                  }
                  <div className="cs-card-identity">
                    <p className="cs-card-name">{req.name}</p>
                    {req.verified && (
                      <div className="cs-verified-row">
                        <img src={VERIFIED_ICO} alt="" className="cs-verified-icon" />
                        <span className="cs-verified-text">Verified Member</span>
                      </div>
                    )}
                  </div>
                  {req.price && <p className="cs-price">{req.price}</p>}
                </div>

                {/* Route info */}
                <div className="cs-route">
                  {/* Pickup */}
                  <div className="cs-route-row">
                    <img src={PICKUP_ICO} alt="" className="cs-route-icon" />
                    <p className="cs-route-text">
                      <strong>Pickup:</strong>{` ${req.pickup}`}
                    </p>
                    <img src={req.dotPickup === 'green' ? DOT_GREEN : DOT_ORANGE} alt="" className="cs-dot" />
                  </div>
                  {/* Drop-off */}
                  <div className="cs-route-row">
                    <img src={DROPOFF_ICO} alt="" className="cs-route-icon" />
                    <p className="cs-route-text">
                      <strong>Drop-off:</strong>{` ${req.dropoff}`}
                    </p>
                    <img src={req.dotDropoff === 'green' ? DOT_GREEN : DOT_ORANGE} alt="" className="cs-dot" />
                  </div>
                  {/* Time */}
                  <div className="cs-route-row">
                    <img src={CLOCK_ICO} alt="" className="cs-route-icon" />
                    <div className="cs-route-time">
                      <span className="cs-route-text cs-route-text--regular">{req.time}</span>
                      {req.duration && (
                        <span className="cs-route-duration">(In {req.duration})</span>
                      )}
                    </div>
                    <img src={req.dotTime === 'green' ? DOT_GREEN : DOT_ORANGE} alt="" className="cs-dot" />
                  </div>
                  {/* Disclaimer — only when not yet accepted */}
                  {!acceptedRides.has(req.id) && (
                    <p className="cs-disclaimer">Exact pickup shared after conformation</p>
                  )}
                </div>

                {/* Action buttons — toggle on accept */}
                {acceptedRides.has(req.id) ? (
                  <div className="cs-accepted-btn">
                    <img src={CHECK_ICO} alt="" className="cs-accepted-check" />
                    <span className="cs-accepted-text">Accepted</span>
                  </div>
                ) : (
                  <div className="cs-action-btns">
                    <button className="cs-accept-btn" onClick={() => handleAccept(req)}>Accept</button>
                    <button className="cs-more-info-btn" onClick={() => openRideDetail(req)}>More Info</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── My Rides tab ─────────────────────────────────────── */}
        {activeTab === 'mine' && (
          <div className="cs-my-rides">

            {/* Section: I'm Getting Ride */}
            <div className="cs-section">
              <div className="cs-section-header">
                <h2 className="cs-section-title">I'm Getting Ride</h2>
                <button className="cs-section-see-all">
                  See all
                  <ChevronRight size={16} strokeWidth={2.5} color="#ff6038" />
                </button>
              </div>
              <div className="cs-cards-h">
                {gettingRideCards.length === 0 && (
                  <p className="cs-empty-h">No ride requests yet.</p>
                )}
                {gettingRideCards.map(req => (
                  <div key={req.id} className="cs-card-h">
                    {/* Header: avatar + name + verified */}
                    <div className="cs-card-header">
                      {req.avatar
                        ? <img src={req.avatar} alt={req.name} className="cs-avatar" />
                        : (
                          <div className="cs-avatar cs-avatar-initials">
                            {req.initials}
                          </div>
                        )
                      }
                      <div className="cs-card-identity">
                        <p className="cs-card-name">{req.name}</p>
                        {req.verified && (
                          <div className="cs-verified-row">
                            <img src={VERIFIED_ICO} alt="" className="cs-verified-icon" />
                            <span className="cs-verified-text">Verified Member</span>
                          </div>
                        )}
                      </div>
                      {req.price && <p className="cs-price">{req.price}</p>}
                    </div>

                    {/* Route rows — NO status dots */}
                    <div className="cs-route">
                      <div className="cs-route-row">
                        <img src={PICKUP_ICO} alt="" className="cs-route-icon" />
                        <p className="cs-route-text">
                          <strong>Pickup:</strong>{` ${req.pickup}`}
                        </p>
                      </div>
                      <div className="cs-route-row">
                        <img src={DROPOFF_ICO} alt="" className="cs-route-icon" />
                        <p className="cs-route-text">
                          <strong>Drop-off:</strong>{` ${req.dropoff}`}
                        </p>
                      </div>
                      <div className="cs-route-row">
                        <img src={CLOCK_ICO} alt="" className="cs-route-icon" />
                        <div className="cs-route-time">
                          <span className="cs-route-text cs-route-text--regular">{req.time}</span>
                          {req.duration && (
                            <span className="cs-route-duration">(In {req.duration})</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* More Info button */}
                    <button className="cs-moreinfo-btn" onClick={() => openPassengerRide(req)}>More Info</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: I'm Driving */}
            <div className="cs-section">
              <div className="cs-section-header">
                <h2 className="cs-section-title">I'm Driving</h2>
                <button className="cs-section-see-all">
                  See all
                  <ChevronRight size={16} strokeWidth={2.5} color="#ff6038" />
                </button>
              </div>
              <div className="cs-cards-h">
                {drivingCards.length === 0 && (
                  <p className="cs-empty-h">No accepted rides yet.</p>
                )}
                {drivingCards.map(req => (
                  <div key={req.id} className="cs-card-h">
                    {/* Header: avatar + name + verified */}
                    <div className="cs-card-header">
                      {req.avatar
                        ? <img src={req.avatar} alt={req.name} className="cs-avatar" />
                        : (
                          <div className="cs-avatar cs-avatar-initials">
                            {req.initials}
                          </div>
                        )
                      }
                      <div className="cs-card-identity">
                        <p className="cs-card-name">{req.name}</p>
                        {req.verified && (
                          <div className="cs-verified-row">
                            <img src={VERIFIED_ICO} alt="" className="cs-verified-icon" />
                            <span className="cs-verified-text">Verified Member</span>
                          </div>
                        )}
                      </div>
                      {req.price && <p className="cs-price">{req.price}</p>}
                    </div>

                    {/* Route rows — WITH status dots */}
                    <div className="cs-route">
                      <div className="cs-route-row">
                        <img src={PICKUP_ICO} alt="" className="cs-route-icon" />
                        <p className="cs-route-text">
                          <strong>Pickup:</strong>{` ${req.pickup}`}
                        </p>
                        <img src={req.dotPickup === 'green' ? DOT_GREEN : DOT_ORANGE} alt="" className="cs-dot" />
                      </div>
                      <div className="cs-route-row">
                        <img src={DROPOFF_ICO} alt="" className="cs-route-icon" />
                        <p className="cs-route-text">
                          <strong>Drop-off:</strong>{` ${req.dropoff}`}
                        </p>
                        <img src={req.dotDropoff === 'green' ? DOT_GREEN : DOT_ORANGE} alt="" className="cs-dot" />
                      </div>
                      <div className="cs-route-row">
                        <img src={CLOCK_ICO} alt="" className="cs-route-icon" />
                        <div className="cs-route-time">
                          <span className="cs-route-text cs-route-text--regular">{req.time}</span>
                          {req.duration && (
                            <span className="cs-route-duration">(In {req.duration})</span>
                          )}
                        </div>
                        <img src={req.dotTime === 'green' ? DOT_GREEN : DOT_ORANGE} alt="" className="cs-dot" />
                      </div>
                    </div>

                    {/* More Info button */}
                    <button className="cs-moreinfo-btn" onClick={() => openRideDetail(req)}>More Info</button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ── Accept glass toast ───────────────────────────────── */}
      {acceptToast && (
        <div className="cs-accept-toast">
          <div className="cs-accept-toast-body">
            <p className="cs-accept-toast-title">Ride accepted!</p>
            <p className="cs-accept-toast-desc">
              You accepted a ride from {acceptToast.name}, visit your ride in{' '}
              <button className="cs-accept-toast-link" onClick={handleMyRides}>
                "My Rides"
              </button>{' '}
              section.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
