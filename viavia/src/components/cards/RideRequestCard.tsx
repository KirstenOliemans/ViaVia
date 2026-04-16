import React from 'react';
import { Clock } from 'lucide-react';
import type { RideRequest } from '../../types';
import MiniMap from '../map/MiniMap';

interface RideRequestCardProps {
  request: RideRequest;
  onAccept: () => void;
  onIgnore: () => void;
}

const RideRequestCard: React.FC<RideRequestCardProps> = ({ request, onAccept, onIgnore }) => {
  const isAccepted = request.status === 'accepted';
  const isIgnored = request.status === 'ignored';

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        marginBottom: 12,
        padding: 16,
        position: 'relative',
        overflow: 'hidden',
        opacity: isIgnored ? 0.5 : 1,
      }}
    >
      {/* Accepted banner */}
      {isAccepted && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(220,252,231,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            borderRadius: 16,
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 700, color: '#16a34a' }}>Accepted ✓</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        {/* Left column */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Avatar + name row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#23558B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{request.riderInitial}</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {request.riderName}
            </span>
            {request.isVerified && (
              <span
                style={{
                  background: '#FFFBEB',
                  color: '#D97706',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: 99,
                  flexShrink: 0,
                  border: '1px solid #FEF3C7',
                }}
              >
                ✓ Verified
              </span>
            )}
          </div>

          {/* From/to */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid #23558B', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#1a1a1a', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {request.from.name}
              </span>
            </div>
            <div style={{ width: 2, height: 10, background: '#E5E7EB', marginLeft: 4, marginBottom: 3 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '10px solid #23558B', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#1a1a1a', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {request.to.name}
              </span>
            </div>
          </div>

          {/* Time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 12 }}>
            <Clock size={12} color="#9CA3AF" />
            <span style={{ fontSize: 12, color: '#6B7280' }}>{request.when}</span>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onAccept}
              disabled={isAccepted || isIgnored}
              style={{
                flex: 1,
                height: 32,
                borderRadius: 99,
                background: '#23558B',
                color: 'white',
                fontSize: 12,
                fontWeight: 600,
                border: 'none',
                cursor: isAccepted || isIgnored ? 'not-allowed' : 'pointer',
                opacity: isAccepted || isIgnored ? 0.5 : 1,
              }}
            >
              Accept
            </button>
            <button
              onClick={onIgnore}
              disabled={isAccepted || isIgnored}
              style={{
                flex: 1,
                height: 32,
                borderRadius: 99,
                background: 'none',
                color: '#6B7280',
                fontSize: 12,
                fontWeight: 600,
                border: '1.5px solid #E5E7EB',
                cursor: isAccepted || isIgnored ? 'not-allowed' : 'pointer',
                opacity: isAccepted || isIgnored ? 0.5 : 1,
              }}
            >
              Ignore
            </button>
          </div>
        </div>

        {/* Mini map */}
        <div style={{ flexShrink: 0 }}>
          <MiniMap
            from={request.from}
            to={request.to}
            width={100}
            height={100}
          />
        </div>
      </div>
    </div>
  );
};

export default RideRequestCard;
