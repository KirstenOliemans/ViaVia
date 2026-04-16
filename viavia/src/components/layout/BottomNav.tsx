import React from 'react';
import { Home, Users, CreditCard } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, rideRequests } = useApp();

  const pendingCount = rideRequests.filter(r => r.status === 'pending').length;

  const tabs = [
    { id: 'home' as const, label: 'Home', Icon: Home },
    { id: 'community' as const, label: 'Community', Icon: Users },
    { id: 'wallet' as const, label: 'Wallet', Icon: CreditCard },
  ];

  return (
    <div
      style={{
        height: 60,
        background: 'white',
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
      }}
    >
      {tabs.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 0',
              position: 'relative',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon
                size={22}
                color={isActive ? '#23558B' : '#9CA3AF'}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              {id === 'community' && pendingCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -8,
                    background: '#FEB930',
                    color: '#1a1a1a',
                    fontSize: 9,
                    fontWeight: 700,
                    borderRadius: 99,
                    minWidth: 16,
                    height: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                  }}
                >
                  {pendingCount}
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#23558B' : '#9CA3AF',
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
