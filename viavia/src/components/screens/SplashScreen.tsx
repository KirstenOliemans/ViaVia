import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const SplashScreen: React.FC = () => {
  const { setScreen } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => setScreen('onboarding'), 2500);
    return () => clearTimeout(timer);
  }, [setScreen]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#23558B',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
      }}
      className="animate-fade-in"
    >
      {/* Logo mark */}
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <path
          d="M12 12L32 52L52 12"
          stroke="#FEB930"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 12L32 36L44 12"
          stroke="#FEB930"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 36, fontWeight: 700, color: 'white', letterSpacing: -0.5 }}>ViaVia</span>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>
          Community Rides, Reimagined
        </span>
      </div>
    </div>
  );
};

export default SplashScreen;
