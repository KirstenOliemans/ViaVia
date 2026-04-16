import React from 'react';
import { Bell, UserCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const TopBar: React.FC = () => {
  const { notifications, setNotificationPanelOpen, setProfilePanelOpen, isNotificationPanelOpen } = useApp();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div
      style={{
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        background: 'white',
        borderBottom: '1px solid #f0f0f0',
        flexShrink: 0,
        zIndex: 30,
        position: 'relative',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#23558B' }}>ViaVia</span>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FEB930', marginLeft: 2, marginBottom: 2, display: 'inline-block' }} />
      </div>

      {/* Right icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={() => setNotificationPanelOpen(!isNotificationPanelOpen)}
          style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
        >
          <Bell size={24} color="#4B5563" />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                width: 8,
                height: 8,
                background: '#EF4444',
                borderRadius: '50%',
                border: '1.5px solid white',
              }}
            />
          )}
        </button>
        <button
          onClick={() => setProfilePanelOpen(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
        >
          <UserCircle size={24} color="#4B5563" />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
