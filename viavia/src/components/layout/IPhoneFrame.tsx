import React, { useEffect, useState } from 'react';

interface IPhoneFrameProps {
  children: React.ReactNode;
}

const DEVICE_W = 393;
const DEVICE_H = 852;

const IPhoneFrame: React.FC<IPhoneFrameProps> = ({ children }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const compute = () => {
      const scaleX = (window.innerWidth - 32) / DEVICE_W;
      const scaleY = (window.innerHeight - 32) / DEVICE_H;
      setScale(Math.min(1, scaleX, scaleY));
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  // When scaled down, compensate so the element doesn't take up extra layout space
  const scaledW = DEVICE_W * scale;
  const scaledH = DEVICE_H * scale;
  const marginX = (scaledW - DEVICE_W) / 2;
  const marginY = (scaledH - DEVICE_H) / 2;

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#E5E7EB',
        overflow: 'hidden',
      }}
    >
      {/* Scale wrapper — negative margins collapse the extra space caused by transform */}
      <div
        style={{
          width: DEVICE_W,
          height: DEVICE_H,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          flexShrink: 0,
          marginLeft: marginX,
          marginRight: marginX,
          marginTop: marginY,
          marginBottom: marginY,
        }}
      >
        {/* Device bezel */}
        <div
          style={{
            width: DEVICE_W,
            height: DEVICE_H,
            background: '#000',
            borderRadius: 50,
            position: 'relative',
            boxShadow: `
              0 0 0 2px #C0C0C0,
              0 0 0 4px #888,
              0 20px 60px rgba(0,0,0,0.5),
              0 4px 20px rgba(0,0,0,0.3),
              inset 0 0 0 2px #333
            `,
            overflow: 'hidden',
          }}
        >
          {/* Dynamic Island */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 120,
              height: 34,
              background: '#000',
              borderRadius: 20,
              zIndex: 1000,
            }}
          />

          {/* Screen */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#F7F9F8',
              overflow: 'hidden',
              borderRadius: 48,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPhoneFrame;
