import { useApp } from '../context/AppContext';
import './Header.css';

// Figma asset URLs (valid 7 days from Apr 16 2026)
const USER_ICON   = 'https://www.figma.com/api/mcp/asset/09bf7ea7-9ff3-402f-bc69-48f34d46e602';
const BELL_ICON   = 'https://www.figma.com/api/mcp/asset/7444be7a-bb09-4257-98fe-fb4956982875';

export default function Header() {
  const { setProfileOpen, setNotificationsOpen, unreadCount } = useApp();

  return (
    <header className="header-pill-wrapper">
      <div className="header-pill">
        {/* Left: avatar + name */}
        <button className="header-left" onClick={() => setProfileOpen(true)}>
          <div className="header-avatar">
            <img src={USER_ICON} alt="User" className="header-avatar-img" />
          </div>
          <div className="header-name-block">
            <p className="header-name">
              Hi, <span className="header-name-bold">John</span>!
            </p>
            <p className="header-role">Verified Driver</p>
          </div>
        </button>

        {/* Right: bell */}
        <button
          className="header-bell"
          onClick={() => setNotificationsOpen(true)}
          aria-label="Notifications"
        >
          {unreadCount > 0 && <span className="header-badge" />}
          <img src={BELL_ICON} alt="Bell" className="header-bell-img" />
        </button>
      </div>
    </header>
  );
}
