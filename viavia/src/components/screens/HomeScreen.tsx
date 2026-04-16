import React, { useState, useCallback } from 'react';
import { CircleDot, MapPin, Clock, ChevronRight } from 'lucide-react';
import MainMap from '../map/MainMap';
import LocationSearchOverlay from '../overlays/LocationSearchOverlay';
import TimeSelector from '../overlays/TimeSelector';
import type { Location, RideRequest } from '../../types';
import { useApp } from '../../context/AppContext';

const HomeScreen: React.FC = () => {
  const { user, addRideRequest } = useApp();
  const [fromLocation, setFromLocation] = useState<Location | undefined>(undefined);
  const [toLocation, setToLocation] = useState<Location | undefined>(undefined);
  const [searchOverlay, setSearchOverlay] = useState<'from' | 'to' | null>(null);
  const [showTimeSelector, setShowTimeSelector] = useState(false);
  const [rideTime, setRideTime] = useState('Now');
  const [isPinMode, setIsPinMode] = useState(false);
  const [pinType, setPinType] = useState<'from' | 'to'>('from');
  const [toast, setToast] = useState<{ message: string; key: number } | null>(null);

  const showToast = (message: string) => {
    setToast({ message, key: Date.now() });
    setTimeout(() => setToast(null), 3200);
  };

  const handlePinDrop = useCallback((lat: number, lng: number) => {
    const loc: Location = {
      name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      subtitle: 'Pinned location',
      lat,
      lng,
    };
    if (pinType === 'from') {
      setFromLocation(loc);
    } else {
      setToLocation(loc);
    }
    setIsPinMode(false);
  }, [pinType]);

  const handleRequestRide = () => {
    if (!fromLocation || !toLocation) {
      showToast('Please fill in your pickup and destination');
      return;
    }

    const name = user?.name || 'You';
    const initial = name.charAt(0).toUpperCase();

    const newRequest: RideRequest = {
      id: Date.now().toString(),
      riderName: name,
      riderInitial: initial,
      from: fromLocation,
      to: toLocation,
      when: rideTime,
      whenDate: new Date(),
      isVerified: user?.level === 2,
      status: 'pending',
    };

    addRideRequest(newRequest);
    showToast('Ride request posted!');
    setFromLocation(undefined);
    setToLocation(undefined);
    setRideTime('Now');
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#F7F9F8' }}>
      {/* Map */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <MainMap
          fromLocation={fromLocation}
          toLocation={toLocation}
          isPinMode={isPinMode}
          onPinDrop={handlePinDrop}
        />
      </div>

      {/* Pin mode banner */}
      {isPinMode && (
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 20,
            right: 20,
            background: 'rgba(35,85,139,0.95)',
            color: 'white',
            padding: '10px 16px',
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 500,
            textAlign: 'center',
            zIndex: 20,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          }}
        >
          Tap anywhere on the map to pin your location
          <button
            onClick={() => setIsPinMode(false)}
            style={{ marginLeft: 12, color: '#FEB930', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Bottom sheet */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
          padding: '12px 20px 8px',
          zIndex: 10,
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: '#E5E7EB' }} />
        </div>

        {/* From field */}
        <button
          onClick={() => setSearchOverlay('from')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 0',
            background: 'none',
            border: 'none',
            borderBottom: '1px solid #F0F0F0',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <CircleDot size={20} color="#23558B" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 15, color: fromLocation ? '#1a1a1a' : '#9CA3AF', fontWeight: fromLocation ? 500 : 400 }}>
            {fromLocation ? fromLocation.name : 'Where are you now?'}
          </span>
        </button>

        {/* To field */}
        <button
          onClick={() => setSearchOverlay('to')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 0',
            background: 'none',
            border: 'none',
            borderBottom: '1px solid #F0F0F0',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <MapPin size={20} color="#23558B" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 15, color: toLocation ? '#1a1a1a' : '#9CA3AF', fontWeight: toLocation ? 500 : 400 }}>
            {toLocation ? toLocation.name : 'Where are you going?'}
          </span>
        </button>

        {/* Time field */}
        <button
          onClick={() => setShowTimeSelector(true)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 0',
            background: 'none',
            border: 'none',
            borderBottom: '1px solid #F0F0F0',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <Clock size={20} color="#9CA3AF" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 15, color: '#6B7280', flex: 1 }}>{rideTime}</span>
          <ChevronRight size={16} color="#9CA3AF" />
        </button>

        {/* Request button */}
        <button
          onClick={handleRequestRide}
          style={{
            width: '100%',
            height: 48,
            borderRadius: 99,
            background: '#FEB930',
            color: '#1a1a1a',
            fontSize: 16,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            marginTop: 16,
            marginBottom: 8,
          }}
        >
          Request Ride →
        </button>
      </div>

      {/* Location search overlay */}
      {searchOverlay && (
        <LocationSearchOverlay
          type={searchOverlay}
          onClose={() => setSearchOverlay(null)}
          onSelect={(loc) => {
            if (searchOverlay === 'from') setFromLocation(loc);
            else setToLocation(loc);
          }}
          onPinModeStart={() => {
            setPinType(searchOverlay);
            setSearchOverlay(null);
            setIsPinMode(true);
          }}
        />
      )}

      {/* Time selector */}
      {showTimeSelector && (
        <TimeSelector
          onClose={() => setShowTimeSelector(false)}
          onConfirm={(time) => {
            setRideTime(time);
            setShowTimeSelector(false);
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          key={toast.key}
          style={{
            position: 'absolute',
            bottom: 360,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1a1a1a',
            color: 'white',
            padding: '10px 20px',
            borderRadius: 99,
            fontSize: 13,
            fontWeight: 500,
            whiteSpace: 'nowrap',
            zIndex: 80,
          }}
          className="animate-toast"
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
