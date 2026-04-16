import { useApp } from '../context/AppContext';
import './BottomNav.css';

// Fresh Figma assets — sourced from node 173:5665 (Community screen, current session)
const HOME_ICON   = 'https://www.figma.com/api/mcp/asset/69852c79-c351-412a-a47f-27aa166180ca';
const WALLET_ICON = 'https://www.figma.com/api/mcp/asset/77251ffb-f414-470a-972f-9966c646cf6c';
const USERS_ICON  = 'https://www.figma.com/api/mcp/asset/5c342526-246e-4ca7-8135-d931d29fab40';

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
