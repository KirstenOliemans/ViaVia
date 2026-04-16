import { ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './ProfilePanel.css';

// ── Figma asset URLs (node 211:6118 — refreshed Apr 16 2026) ─────────────────
const AVATAR_ICO   = '/icons/avatar-ico.svg';
const CLOSE_ICO    = '/icons/close-ico.svg';
// Note: Figma chevron asset is 5×10px content inside 24px slot — renders as filled triangle
// at full size; using Lucide ChevronRight matches the thin-arrow style in the Figma screenshot
// Menu icons (leading)
const ICON_PERSON  = '/icons/person-ico.svg';
const ICON_VEHICLE = '/icons/vehicle-ico.svg';
const ICON_AVAIL   = '/icons/avail-ico.svg';
const ICON_FAV     = '/icons/fav-ico.svg';
const ICON_HISTORY = '/icons/history-ico.svg';

// Figma: h-[40px], gap-[12px], items-center, py-[8px]
// Icon items have a 24×24 leading slot; icon-less items start flush with the label
function MenuItem({ icon, label }) {
  return (
    <button className="pp-item">
      {icon && (
        <span className="pp-item-icon-slot">
          <img src={icon} alt="" className="pp-item-icon" />
        </span>
      )}
      <span className="pp-item-label">{label}</span>
      {/* Figma chevron: 5×10px content inside 24px slot — Lucide matches the thin style */}
      <ChevronRight size={14} strokeWidth={1.75} color="rgba(0,0,0,0.35)" style={{ flexShrink: 0 }} />
    </button>
  );
}

export default function ProfilePanel() {
  const { profileOpen, setProfileOpen } = useApp();

  return (
    <>
      <div
        className={`pp-overlay${profileOpen ? ' visible' : ''}`}
        onClick={() => setProfileOpen(false)}
      />

      <aside className={`pp-panel${profileOpen ? ' open' : ''}`}>

        {/* ── Header ─────────────────────────────────────────── */}
        {/* Figma: px-[20px] py-[12px], flex row items-center */}
        <div className="pp-header">
          <div className="pp-header-inner">
            {/* Avatar: rgba(116,116,128,0.08) bg, p-[12px], 32px icon → 56px, rounded-[1222px] */}
            <div className="pp-avatar-wrap">
              <img src={AVATAR_ICO} alt="" className="pp-avatar-img" />
            </div>
            <div className="pp-identity">
              {/* Figma: Roboto SemiBold 16px #000 tracking 0.15px */}
              <p className="pp-name">John Doe</p>
              {/* Figma: Roboto Regular 12px #333 tracking 0.4px */}
              <p className="pp-role">Verified Driver</p>
            </div>
          </div>
          {/* Figma: 20×20px close icon */}
          <button
            className="pp-close"
            onClick={() => setProfileOpen(false)}
            aria-label="Close"
          >
            <img src={CLOSE_ICO} alt="" className="pp-close-img" />
          </button>
        </div>

        {/* ── Body: stats + menu (single container, gap-[16px] p-[20px]) ── */}
        {/* Figma node 211:6348: flex-col gap-[16px] p-[20px] */}
        <div className="pp-body">

          {/* Stats row */}
          <div className="pp-stats">
            <div className="pp-stat">
              <span className="pp-stat-val">Nov 2026</span>
              <span className="pp-stat-lbl">Joined</span>
            </div>
            <div className="pp-stat-sep" />
            <div className="pp-stat">
              <span className="pp-stat-val">12h 32m</span>
              <span className="pp-stat-lbl">Contribution</span>
            </div>
            <div className="pp-stat-sep" />
            <div className="pp-stat">
              <span className="pp-stat-val">10</span>
              <span className="pp-stat-lbl">Rides</span>
            </div>
          </div>

          {/* Separator: h-px w-[300px] rgba(120,120,120,0.2) */}
          <div className="pp-rule" />

          {/* Personal Information (own section, separator below) */}
          <MenuItem icon={ICON_PERSON} label="Personal Information" />
          <div className="pp-rule" />

          {/* Vehicle Information (own section, separator below) */}
          <MenuItem icon={ICON_VEHICLE} label="Vehicle Information" />
          <div className="pp-rule" />

          {/* Grouped section: Availability / Favorite places / Ride History */}
          {/* Figma node 211:6365: flex-col gap-[16px] — items share the parent 16px gap */}
          <div className="pp-group">
            <MenuItem icon={ICON_AVAIL}   label="Availability"    />
            <MenuItem icon={ICON_FAV}     label="Favorite places" />
            <MenuItem icon={ICON_HISTORY} label="Ride History"    />
          </div>
          <div className="pp-rule" />

          {/* Icon-less items: Preferences / Privacy & Policy / Help */}
          {/* Figma: no leading icon slot — label starts flush left */}
          <MenuItem icon={null} label="Preferences"     />
          <MenuItem icon={null} label="Privacy & Policy" />
          <MenuItem icon={null} label="Help"            />

        </div>
      </aside>
    </>
  );
}
