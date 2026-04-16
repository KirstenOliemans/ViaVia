import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';

const CallFAB: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        right: 16,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 8,
      }}
    >
      {showTooltip && (
        <div
          style={{
            background: 'white',
            padding: '6px 12px',
            borderRadius: 99,
            fontSize: 12,
            fontWeight: 500,
            color: '#1a1a1a',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            animation: 'fadeIn 300ms ease forwards',
            whiteSpace: 'nowrap',
          }}
        >
          Need help? Call us
        </div>
      )}
      <button
        onClick={() => { window.location.href = 'tel:+18001234567'; }}
        title="Need help? Call ViaVia Support"
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#FEB930',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(254,185,48,0.4)',
        }}
      >
        <Phone size={22} color="white" />
      </button>
    </div>
  );
};

export default CallFAB;
