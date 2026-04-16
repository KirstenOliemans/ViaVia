import { useApp } from '../context/AppContext';
import './BottomNav.css';

const HOME_ICON   = '/icons/home-icon.svg';
const WALLET_ICON = '/icons/wallet-icon.svg';
const USERS_ICON  = '/icons/users-icon.svg';

const TABS = [
  { id: 'home',      icon: HOME_ICON,   label: 'Home',      cls: 'nav-home-btn' },
  { id: 'wallet',    icon: WALLET_ICON, label: 'Wallet',    cls: 'nav-icon-btn' },
  { id: 'community', icon: USERS_ICON,  label: 'Community', cls: 'nav-icon-btn' },
];

export default function BottomNav() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav className="bottom-nav-blur">
      <div className="bottom-nav-wrapper">
        <div className="bottom-nav-pill">
          {TABS.map(({ id, icon, label, cls }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                className={`${cls}${active ? ' active' : ''}`}
                onClick={() => setActiveTab(id)}
                aria-label={label}
              >
                <img src={icon} alt="" className="nav-btn-icon" />
                {/* Always rendered — CSS animates opacity + width so it slides in smoothly */}
                <span className="nav-label">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="home-indicator" />
    </nav>
  );
}
