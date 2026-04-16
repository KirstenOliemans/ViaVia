import { useApp } from '../context/AppContext';
import './NotificationsPanel.css';

// ── Figma asset URLs (node 211:5902) ─────────────────────────────
// Close X icon — Figma: size-[11.667px], sits next to "Mark all read" with gap-[20px]
const CLOSE_ICO = '/icons/close-notif-ico.svg';
// Ride notification icon (directions_car) — shown in #f7e3de circle
const CAR_ICO   = '/icons/car-ico.svg';
// Wallet notification icon (credit_card) — shown in rgba(52,199,89,0.12) circle
const CARD_ICO  = '/icons/card-ico.svg';

// Figma: ride → #f7e3de (primary/10), wallet → rgba(52,199,89,0.12) green tint
const TYPE_META = {
  ride:   { src: CAR_ICO,  bg: '#f7e3de'              },
  wallet: { src: CARD_ICO, bg: 'rgba(52,199,89,0.12)' },
  system: { src: CAR_ICO,  bg: '#f5f5f5'              },
};

export default function NotificationsPanel() {
  const { notificationsOpen, setNotificationsOpen, notifications, markAllRead } = useApp();

  return (
    <>
      <div
        className={`np-overlay${notificationsOpen ? ' visible' : ''}`}
        onClick={() => setNotificationsOpen(false)}
      />

      <aside className={`np-panel${notificationsOpen ? ' open' : ''}`}>

        {/* ── Header ──────────────────────────────────────── */}
        {/* Figma: px-[20px] py-[22px], flex row: title + [mark-read + X icon gap-20px] */}
        <div className="np-header">
          <p className="np-title">Notifications</p>
          {/* Figma: gap-[20px] between "Mark all read" text and the X close icon */}
          <div className="np-header-right">
            <button className="np-mark-read" onClick={markAllRead}>
              Mark all read
            </button>
            {/* Figma: close icon size-[11.667px] */}
            <button
              className="np-close"
              onClick={() => setNotificationsOpen(false)}
              aria-label="Close"
            >
              <img src={CLOSE_ICO} alt="" className="np-close-img" />
            </button>
          </div>
        </div>

        {/* Figma: 1px divider rgba(120,120,120,0.2) */}
        <div className="np-divider" />

        {/* ── List ────────────────────────────────────────── */}
        <div className="np-list">
          {notifications.length === 0 ? (
            <p className="np-empty">No notifications yet</p>
          ) : (
            notifications.map(n => {
              const meta = TYPE_META[n.type] ?? TYPE_META.system;
              return (
                <div key={n.id} className={`np-item${!n.read ? ' np-item--unread' : ''}`}>
                  {/* Icon circle — Figma: 48px, p-[12px], rounded-[122px] */}
                  <div className="np-icon-wrap" style={{ background: meta.bg }}>
                    <img src={meta.src} alt="" className="np-icon-img" />
                  </div>

                  {/* Content */}
                  <div className="np-body">
                    <div className="np-body-row">
                      <p className="np-item-title">{n.title}</p>
                      <p className="np-item-time">{n.time}</p>
                    </div>
                    <p className="np-item-desc">{n.desc}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </aside>
    </>
  );
}
