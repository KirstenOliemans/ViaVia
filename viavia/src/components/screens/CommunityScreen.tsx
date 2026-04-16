import React from 'react';
import { Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import RideRequestCard from '../cards/RideRequestCard';

const CommunityScreen: React.FC = () => {
  const { user, rideRequests, acceptRide, ignoreRide, setScreen } = useApp();

  const isDriver = user?.level === 2;
  const pendingRides = rideRequests.filter(r => r.status === 'pending');
  const otherRides = rideRequests.filter(r => r.status !== 'pending');

  if (!isDriver) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        {/* Blurred mock cards */}
        <div style={{ padding: '16px 16px 0', filter: 'blur(4px)', pointerEvents: 'none' }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                background: 'white',
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
                height: 160,
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              }}
            >
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#23558B' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 12, background: '#E5E7EB', borderRadius: 4, marginBottom: 6, width: '60%' }} />
                      <div style={{ height: 10, background: '#F3F4F6', borderRadius: 4, width: '40%' }} />
                    </div>
                  </div>
                  <div style={{ height: 10, background: '#E5E7EB', borderRadius: 4, marginBottom: 6 }} />
                  <div style={{ height: 10, background: '#F3F4F6', borderRadius: 4, width: '80%', marginBottom: 12 }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ flex: 1, height: 32, background: '#23558B', borderRadius: 99 }} />
                    <div style={{ flex: 1, height: 32, background: '#F3F4F6', borderRadius: 99 }} />
                  </div>
                </div>
                <div style={{ width: 100, height: 100, background: '#F3F4F6', borderRadius: 12 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Lock overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.85)',
            padding: 32,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#F3F4F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <Lock size={28} color="#6B7280" />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px', textAlign: 'center' }}>
            Driver Access Required
          </h3>
          <p style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 1.6, margin: '0 0 24px', maxWidth: 260 }}>
            Complete your driver profile to view and accept community ride requests.
          </p>
          <button
            onClick={() => setScreen('profile-completion')}
            style={{
              padding: '12px 28px',
              borderRadius: 99,
              background: '#FEB930',
              color: '#1a1a1a',
              fontSize: 15,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Upgrade to Driver →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto' }} className="scroll-smooth-inner">
      {/* Header */}
      <div style={{ padding: '16px 16px 4px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>
          Community Rides
        </h2>
        <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>
          {pendingRides.length} {pendingRides.length === 1 ? 'ride' : 'rides'} available near you
        </p>
      </div>

      {/* Pending rides */}
      <div style={{ padding: '8px 16px 0' }}>
        {pendingRides.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF', fontSize: 14 }}>
            No pending rides at the moment.
          </div>
        ) : (
          pendingRides.map(req => (
            <RideRequestCard
              key={req.id}
              request={req}
              onAccept={() => acceptRide(req.id)}
              onIgnore={() => ignoreRide(req.id)}
            />
          ))
        )}
      </div>

      {/* Past rides */}
      {otherRides.length > 0 && (
        <div style={{ padding: '0 16px 16px' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#9CA3AF', margin: '8px 0 8px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Responded
          </p>
          {otherRides.map(req => (
            <RideRequestCard
              key={req.id}
              request={req}
              onAccept={() => {}}
              onIgnore={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityScreen;
