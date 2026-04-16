import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import DateTimePicker from '../components/DateTimePicker';
import './HomeScreen.css';

const LOC_FROM_ICON  = '/icons/location-from.svg';
const LOC_TO_ICON    = '/icons/location-to.svg';
const RADIO_ON       = '/icons/radio-on.svg';
const RADIO_OFF      = '/icons/radio-off.svg';
const CALL_ICON      = '/icons/call-icon.svg';
const CHEVRON_ARROW  = '/icons/chevron-arrows.svg';

// ── Helpers ───────────────────────────────────────────────────────────────────
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatDateLabel(d) {
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const prefix = isToday ? 'Today, ' : '';
  return `${prefix}${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatDatePill(d) {
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatTimePill(h, m, ampm) {
  return `${h}:${String(m).padStart(2,'0')} ${ampm}`;
}

function formatDtpValue(d, h, m, ampm) {
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const prefix = isToday ? 'Today' : `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
  return `${prefix}, ${h}:${String(m).padStart(2,'0')} ${ampm}`;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const {
    addRideRequest, setActiveTab, openRideFlow,
    rideFlowResult, clearRideFlowResult,
    showRideToast, setTargetCommunityTab,
  } = useApp();

  // Location state — filled either manually or by the map ride flow
  const [from, setFrom]           = useState('Your current location');
  const [to, setTo]               = useState('');
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords]     = useState(null);

  // Date / time state — initialised to "now" on mount
  const [selDate, setSelDate]   = useState(() => new Date());
  const [selHour, setSelHour]   = useState(() => { const h = new Date().getHours(); return h % 12 || 12; });
  const [selMin,  setSelMin]    = useState(() => new Date().getMinutes());
  const [selAMPM, setSelAMPM]   = useState(() => new Date().getHours() < 12 ? 'AM' : 'PM');
  const [dtpOpen, setDtpOpen]   = useState(false);

  // Consume ride flow result when the map overlay closes
  useEffect(() => {
    if (!rideFlowResult) return;
    setFrom(rideFlowResult.pickupLoc.label);
    setTo(rideFlowResult.dropoffLoc.label);
    setFromCoords(rideFlowResult.pickupLoc.coords);
    setToCoords(rideFlowResult.dropoffLoc.coords);
    clearRideFlowResult();
  }, [rideFlowResult]);

  // Payment state
  const [payment, setPayment] = useState('digital');

  // UI state
  const [loading, setLoading] = useState(false);

  const canConfirm = from.trim() && to.trim();

  // ── DateTimePicker bridge ─────────────────────────────────────────────────
  // The existing DTP returns a formatted string like "Today, 3:30 PM"
  // We parse it back to update our pill states
  function handleDtpConfirm(val) {
    // val is like "Today, 3:30 PM" or "Apr 16, 3:30 PM"
    const match = val.match(/(\d+):(\d+)\s+(AM|PM)/);
    if (match) {
      setSelHour(parseInt(match[1], 10));
      setSelMin(parseInt(match[2], 10));
      setSelAMPM(match[3]);
    }
    setDtpOpen(false);
  }

  // ── Confirm ride ──────────────────────────────────────────────────────────
  function handleConfirm() {
    if (!canConfirm) return;
    setLoading(true);
    setTimeout(() => {
      const rideId = Date.now();
      addRideRequest({
        id: rideId,
        name: 'John Doe',
        avatar: null,
        initials: 'JD',
        communities: 2,
        verified: true,
        match: Math.floor(75 + Math.random() * 20),
        price: '€ 4.50',
        from,
        to,
        when: formatDtpValue(selDate, selHour, selMin, selAMPM),
        duration: '~15 min',
        distance: '—',
        fromCoords: fromCoords || [52.3676, 4.9041],
        toCoords:   toCoords   || [52.3500, 4.9200],
        isOwn: true,
      });
      setLoading(false);
      // Show the app-level ride toast and navigate to My Rides
      showRideToast({ id: rideId, from, to });
      setActiveTab('community');
      setTargetCommunityTab('mine');
    }, 900);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="hs-wrapper">
    <div className="hs-root">

      {/* ── Card 1: Location ──────────────────────────────────── */}
      <p className="hs-section-title">Where can we get you today?</p>

      <div className="hs-card">
        {/* From row — opens map-based ride flow */}
        <div className="hs-loc-row">
          <div className="hs-loc-icon-wrap">
            <img src={LOC_FROM_ICON} alt="" className="hs-loc-icon-img" />
          </div>
          <button className="hs-loc-field" onClick={() => openRideFlow('pickup')}>
            <p className="hs-field-label">Where are you at?</p>
            <p className={`hs-field-value${!from ? ' placeholder' : ''}`}>
              {from || 'Your current location'}
            </p>
          </button>
        </div>

        <div className="hs-divider" />

        {/* To row — opens map-based ride flow, skipping pickup step */}
        <div className="hs-loc-row destination">
          <div className="hs-loc-icon-wrap">
            <img src={LOC_TO_ICON} alt="" className="hs-loc-icon-img" />
          </div>
          <button className="hs-loc-field" onClick={() => openRideFlow('dropoff')}>
            <p className="hs-field-label">Where do you want to go?</p>
            <p className={`hs-field-value${!to ? ' placeholder' : ''}`}>
              {to || '\u200B'}
            </p>
          </button>
        </div>
      </div>

      {/* ── Card 2: Date & Time ───────────────────────────────── */}
      <div className="hs-card hs-dt-card">
        {/* Pill row */}
        <div className="hs-dt-row">
          {/* Date pill */}
          <button className="hs-dt-pill" onClick={() => setDtpOpen(true)}>
            <span className="hs-dt-pill-text">{formatDatePill(selDate)}</span>
            <span className="hs-dt-arrows">
              <img src={CHEVRON_ARROW} alt="" className="hs-arrow-up" />
              <img src={CHEVRON_ARROW} alt="" className="hs-arrow-down" />
            </span>
          </button>

          {/* Time pill */}
          <button className="hs-dt-pill" onClick={() => setDtpOpen(true)}>
            <span className="hs-dt-pill-text">{formatTimePill(selHour, selMin, selAMPM)}</span>
            <span className="hs-dt-arrows">
              <img src={CHEVRON_ARROW} alt="" className="hs-arrow-up" />
              <img src={CHEVRON_ARROW} alt="" className="hs-arrow-down" />
            </span>
          </button>
        </div>

        {/* Label row */}
        <div className="hs-dt-info-row">
          <p className="hs-dt-label">{formatDateLabel(selDate)}</p>
          <p className="hs-dt-est">15 mins [estimated]</p>
        </div>
      </div>

      {/* ── Card 3: Payment ───────────────────────────────────── */}
      <div className="hs-card hs-pay-card">
        {/* Digital */}
        <button className="hs-pay-row" onClick={() => setPayment('digital')}>
          <p className="hs-pay-label">Digital payment</p>
          <img
            src={payment === 'digital' ? RADIO_ON : RADIO_OFF}
            alt={payment === 'digital' ? 'Selected' : 'Unselected'}
            className="hs-radio-img"
          />
        </button>

        <div className="hs-divider" />

        {/* Cash */}
        <button className="hs-pay-row" onClick={() => setPayment('cash')}>
          <p className="hs-pay-label">Cash payment</p>
          <img
            src={payment === 'cash' ? RADIO_ON : RADIO_OFF}
            alt={payment === 'cash' ? 'Selected' : 'Unselected'}
            className="hs-radio-img"
          />
        </button>

        <div className="hs-divider" />

        {/* Credit */}
        <button className="hs-pay-row" onClick={() => setPayment('credit')}>
          <p className="hs-pay-label">Credit  payment</p>
          <img
            src={payment === 'credit' ? RADIO_ON : RADIO_OFF}
            alt={payment === 'credit' ? 'Selected' : 'Unselected'}
            className="hs-radio-img"
          />
        </button>
      </div>

      {/* ── Confirm button ────────────────────────────────────── */}
      <button
        className={`hs-confirm-btn${!canConfirm ? ' disabled' : ''}${loading ? ' loading' : ''}`}
        onClick={handleConfirm}
        disabled={!canConfirm || loading}
      >
        {loading
          ? <span className="hs-spinner" />
          : 'Confirm'
        }
      </button>

      {/* ── Overlays ──────────────────────────────────────────── */}
      <DateTimePicker
        isOpen={dtpOpen}
        onClose={() => setDtpOpen(false)}
        onConfirm={handleDtpConfirm}
        currentValue={formatDtpValue(selDate, selHour, selMin, selAMPM)}
      />
    </div>

    {/* ── FAB lives outside the scroll area so it stays fixed ── */}
    <button className="hs-fab" aria-label="Call support">
      <img src={CALL_ICON} alt="" className="hs-fab-icon" />
    </button>

    </div>
  );
}
