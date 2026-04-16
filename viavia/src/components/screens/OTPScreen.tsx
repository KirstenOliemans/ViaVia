import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const OTPScreen: React.FC = () => {
  const { setScreen, pendingOtpPhone, pendingUserData, createUser } = useApp();
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = digits.join('');
    if (code.length < 6) return;
    createUser(pendingUserData.name || 'User', pendingOtpPhone, pendingUserData.address || '');
    setScreen('home');
  };

  const handleResend = () => {
    if (!canResend) return;
    setCountdown(30);
    setCanResend(false);
    setDigits(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const displayPhone = pendingOtpPhone ? `+1 ${pendingOtpPhone}` : '+1 (555) 000-0000';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        padding: '56px 24px 40px',
      }}
    >
      {/* Back */}
      <button
        onClick={() => setScreen('signup')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, alignSelf: 'flex-start', marginBottom: 32 }}
      >
        <ArrowLeft size={24} color="#1a1a1a" />
      </button>

      {/* Title */}
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>
        Verify your number
      </h2>
      <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 40px', lineHeight: 1.5 }}>
        We sent a 6-digit code to{' '}
        <span style={{ fontWeight: 600, color: '#23558B' }}>{displayPhone}</span>
      </p>

      {/* OTP inputs */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 40 }}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={el => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            style={{
              width: 48,
              height: 56,
              textAlign: 'center',
              fontSize: 22,
              fontWeight: 600,
              border: `2px solid ${digit ? '#23558B' : '#E5E7EB'}`,
              borderRadius: 12,
              outline: 'none',
              color: '#1a1a1a',
              fontFamily: 'Inter, sans-serif',
              background: digit ? '#F0F6FF' : 'white',
              transition: 'all 200ms ease',
            }}
          />
        ))}
      </div>

      {/* Verify button */}
      <button
        onClick={handleVerify}
        style={{
          width: '100%',
          height: 48,
          borderRadius: 99,
          background: digits.join('').length === 6 ? '#23558B' : '#9CA3AF',
          color: 'white',
          fontSize: 15,
          fontWeight: 600,
          border: 'none',
          cursor: digits.join('').length === 6 ? 'pointer' : 'not-allowed',
          marginBottom: 24,
          transition: 'background 200ms ease',
        }}
      >
        Verify
      </button>

      {/* Resend */}
      <p style={{ textAlign: 'center', fontSize: 14, color: '#6B7280', margin: 0 }}>
        Didn't receive a code?{' '}
        {canResend ? (
          <button
            onClick={handleResend}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#23558B', fontWeight: 600, fontSize: 14, padding: 0 }}
          >
            Resend Code
          </button>
        ) : (
          <span style={{ color: '#9CA3AF' }}>
            Resend in 0:{countdown.toString().padStart(2, '0')}
          </span>
        )}
      </p>
    </div>
  );
};

export default OTPScreen;
