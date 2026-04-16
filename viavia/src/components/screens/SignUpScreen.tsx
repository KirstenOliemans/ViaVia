import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const SignUpScreen: React.FC = () => {
  const { setScreen, setPendingOtpPhone, setPendingUserData } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const inputStyle: React.CSSProperties = {
    border: '1px solid #E5E7EB',
    borderRadius: 12,
    padding: '12px 16px',
    fontSize: 14,
    width: '100%',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    color: '#1a1a1a',
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!address.trim()) newErrors.address = 'Home address is required';
    if (!password) newErrors.password = 'Password is required';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setPendingOtpPhone(phone);
    setPendingUserData({ name, address });
    setScreen('otp');
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '56px 16px 16px',
          gap: 12,
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setScreen('onboarding')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
        >
          <ArrowLeft size={24} color="#1a1a1a" />
        </button>
        <span style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>Create Account</span>
      </div>

      {/* Scrollable form */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 24px 24px',
        }}
        className="scroll-smooth-inner"
      >
        {/* Name */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ ...inputStyle, borderColor: errors.name ? '#EF4444' : '#E5E7EB' }}
          />
          {errors.name && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{errors.name}</p>}
        </div>

        {/* Phone */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
            Phone Number
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <span
              style={{
                padding: '12px 14px',
                background: '#F3F4F6',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 500,
                color: '#374151',
                flexShrink: 0,
                border: '1px solid #E5E7EB',
              }}
            >
              +1
            </span>
            <input
              type="tel"
              placeholder="(555) 000-0000"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={{ ...inputStyle, flex: 1, borderColor: errors.phone ? '#EF4444' : '#E5E7EB' }}
            />
          </div>
          {errors.phone && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{errors.phone}</p>}
        </div>

        {/* Address */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
            Home Address
          </label>
          <input
            type="text"
            placeholder="Enter your home address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            style={{ ...inputStyle, borderColor: errors.address ? '#EF4444' : '#E5E7EB' }}
          />
          {errors.address && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{errors.address}</p>}
        </div>

        {/* Password */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: 44, borderColor: errors.password ? '#EF4444' : '#E5E7EB' }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
              }}
            >
              {showPassword ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
            </button>
          </div>
          {errors.password && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
            Confirm Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: 44, borderColor: errors.confirmPassword ? '#EF4444' : '#E5E7EB' }}
            />
            <button
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
              }}
            >
              {showConfirmPassword ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            height: 48,
            borderRadius: 99,
            background: '#23558B',
            color: 'white',
            fontSize: 15,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            marginBottom: 20,
          }}
        >
          Create Account
        </button>

        {/* Login link */}
        <p style={{ textAlign: 'center', fontSize: 14, color: '#6B7280', margin: 0 }}>
          Already have an account?{' '}
          <button
            onClick={() => setScreen('otp')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#23558B', fontWeight: 600, fontSize: 14, padding: 0 }}
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpScreen;
