import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import type { Location } from '../../types';
import { mockLocations } from '../../data/mockData';

interface LocationSearchOverlayProps {
  type: 'from' | 'to';
  onClose: () => void;
  onSelect: (location: Location) => void;
  onPinModeStart: () => void;
}

const LocationSearchOverlay: React.FC<LocationSearchOverlayProps> = ({
  type,
  onClose,
  onSelect,
  onPinModeStart,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = mockLocations.filter(loc => {
    if (!query) return true;
    const q = query.toLowerCase();
    return loc.name.toLowerCase().includes(q) || loc.subtitle.toLowerCase().includes(q);
  });

  const handleSelect = (loc: Location) => {
    onSelect(loc);
    onClose();
  };

  const handlePinMode = () => {
    onPinModeStart();
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,0.98)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideUp 300ms ease forwards',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '56px 16px 12px',
          borderBottom: '1px solid #F3F4F6',
          flexShrink: 0,
        }}
      >
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
        >
          <ArrowLeft size={22} color="#1a1a1a" />
        </button>
        <input
          ref={inputRef}
          type="text"
          placeholder={type === 'from' ? 'Search pickup location...' : 'Search destination...'}
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            flex: 1,
            border: '1.5px solid #E5E7EB',
            borderRadius: 12,
            padding: '10px 14px',
            fontSize: 14,
            outline: 'none',
            fontFamily: 'Inter, sans-serif',
            color: '#1a1a1a',
            background: '#F9FAFB',
          }}
        />
      </div>

      {/* Results */}
      <div style={{ flex: 1, overflowY: 'auto' }} className="scroll-smooth-inner">
        {filtered.map((loc, i) => (
          <button
            key={i}
            onClick={() => handleSelect(loc)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 20px',
              background: 'none',
              border: 'none',
              borderBottom: '1px solid #F9FAFB',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <MapPin size={18} color="#9CA3AF" style={{ flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', margin: 0 }}>{loc.name}</p>
              <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{loc.subtitle}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Pin on Map button */}
      <div style={{ padding: '12px 20px 32px', borderTop: '1px solid #F3F4F6', flexShrink: 0 }}>
        <button
          onClick={handlePinMode}
          style={{
            width: '100%',
            height: 44,
            borderRadius: 12,
            border: '2px solid #23558B',
            background: 'none',
            color: '#23558B',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <MapPin size={16} color="#23558B" />
          Pin on Map
        </button>
      </div>
    </div>
  );
};

export default LocationSearchOverlay;
