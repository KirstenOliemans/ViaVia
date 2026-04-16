import React from 'react';
import { Car, Coins, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Notification } from '../../types';

const NotificationPanel: React.FC = () => {
  const { notifications, markAllNotificationsRead, setNotificationPanelOpen } = useApp();

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'ride':
        return { icon: Car, bg: '#EFF6FF', color: '#23558B' };
      case 'credit':
        return { icon: Coins, bg: '#FFFBEB', color: '#D97706' };
      case 'system':
        return { icon: Info, bg: '#F3F4F6', color: '#6B7280' };
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setNotificationPanelOpen(false)}
        style={{ position: 'absolute', inset: 0, zIndex: 90 }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'absolute',
          top: 56,
          right: 8,
          width: 320,
          maxHeight: 400,
          background: 'white',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          zIndex: 100,
          overflowY: 'auto',
          animation: 'slideDown 200ms ease forwards',
        }}
        className="scroll-smooth-inner"
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid #F3F4F6',
            position: 'sticky',
            top: 0,
            background: 'white',
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>Notifications</span>
          <button
            onClick={markAllNotificationsRead}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#23558B', padding: 0, fontWeight: 500 }}
          >
            Mark all read
          </button>
        </div>

        {/* List */}
        {notifications.map(notif => {
          const { icon: Icon, bg, color } = getIcon(notif.type);
          return (
            <div
              key={notif.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: 12,
                borderBottom: '1px solid #F9FAFB',
                background: notif.read ? 'white' : '#F0F6FF',
                borderLeft: notif.read ? 'none' : '3px solid #23558B',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={14} color={color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', margin: '0 0 2px' }}>{notif.title}</p>
                <p
                  style={{
                    fontSize: 12,
                    color: '#6B7280',
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {notif.subtitle}
                </p>
              </div>
              <span style={{ fontSize: 11, color: '#9CA3AF', flexShrink: 0, marginTop: 2 }}>{notif.timestamp}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default NotificationPanel;
