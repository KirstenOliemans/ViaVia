import React from 'react';
import { User, Settings, Shield, HelpCircle, LogOut, ChevronRight, Car, Settings2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ProfilePanel: React.FC = () => {
  const { user, setProfilePanelOpen, setScreen } = useApp();

  const name = user?.name || 'Guest User';
  const level = user?.level || 1;
  const initial = name.charAt(0).toUpperCase();

  const menuItems = [
    { icon: User, label: 'Profile' },
    { icon: Settings, label: 'Preferences' },
    { icon: Settings2, label: 'Settings' },
    { icon: Shield, label: 'Privacy & Policy' },
    { icon: HelpCircle, label: 'Help' },
    ...(level === 1 ? [{ icon: Car, label: 'Become a Driver', action: () => { setProfilePanelOpen(false); setScreen('profile-completion'); } }] : []),
  ];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 200,
        display: 'flex',
      }}
    >
      {/* Panel */}
      <div
        style={{
          width: '75%',
          maxWidth: 295,
          height: '100%',
          background: 'white',
          boxShadow: '4px 0 32px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInLeft 300ms ease forwards',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: '#23558B',
            padding: '48px 20px 32px',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 24, fontWeight: 700, color: '#23558B' }}>{initial}</span>
          </div>
          <p style={{ fontSize: 18, fontWeight: 700, color: 'white', margin: '0 0 8px' }}>{name}</p>
          <span
            style={{
              display: 'inline-block',
              background: '#FEB930',
              color: '#1a1a1a',
              fontSize: 12,
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: 99,
            }}
          >
            {level === 1 ? 'Level 1 – Passenger' : 'Level 2 – Driver'}
          </span>
        </div>

        {/* Menu */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {menuItems.map(({ icon: Icon, label, action }, i) => (
            <button
              key={i}
              onClick={action || (() => {})}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 20px',
                background: 'none',
                border: 'none',
                borderBottom: '1px solid #F5F5F5',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <Icon size={20} color="#23558B" />
              <span style={{ flex: 1, fontSize: 15, color: '#1a1a1a' }}>{label}</span>
              <ChevronRight size={16} color="#9CA3AF" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={() => setProfilePanelOpen(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '20px',
            background: 'none',
            border: 'none',
            borderTop: '1px solid #F5F5F5',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left',
          }}
        >
          <LogOut size={20} color="#EF4444" />
          <span style={{ fontSize: 15, color: '#EF4444', fontWeight: 500 }}>Log Out</span>
        </button>
      </div>

      {/* Scrim */}
      <div
        onClick={() => setProfilePanelOpen(false)}
        style={{
          flex: 1,
          background: 'rgba(0,0,0,0.4)',
        }}
      />
    </div>
  );
};

export default ProfilePanel;
