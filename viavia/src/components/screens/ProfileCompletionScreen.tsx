import React, { useState, useRef } from 'react';
import { ArrowLeft, CheckCircle, UploadCloud } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ProfileCompletionScreen: React.FC = () => {
  const { setScreen, setActiveTab, upgradeToDriver } = useApp();
  const [carModel, setCarModel] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [insurancePolicy, setInsurancePolicy] = useState('');
  const [licenseFile, setLicenseFile] = useState<string | null>(null);
  const [insuranceFile, setInsuranceFile] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const licenseInputRef = useRef<HTMLInputElement>(null);
  const insuranceInputRef = useRef<HTMLInputElement>(null);

  const inputStyle: React.CSSProperties = {
    border: '1px solid #E5E7EB',
    borderRadius: 12,
    padding: '12px 16px',
    fontSize: 14,
    width: '100%',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    color: '#1a1a1a',
    background: 'white',
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!carModel.trim()) newErrors.carModel = 'Car make & model is required';
    if (!licensePlate.trim()) newErrors.licensePlate = 'License plate is required';
    if (!driverLicense.trim()) newErrors.driverLicense = 'Driver\'s license number is required';
    if (!insurancePolicy.trim()) newErrors.insurancePolicy = 'Insurance policy number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    upgradeToDriver();
    setSubmitted(true);
  };

  const handleBackToHome = () => {
    setActiveTab('community');
    setScreen('home');
  };

  if (submitted) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 32px',
          gap: 16,
        }}
        className="animate-fade-in"
      >
        <CheckCircle size={64} color="#16a34a" />
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', margin: 0, textAlign: 'center' }}>
          Profile Submitted!
        </h2>
        <p style={{ fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 1.6, margin: 0, maxWidth: 260 }}>
          You'll be notified once your profile is verified. You can now access community rides!
        </p>
        <button
          onClick={handleBackToHome}
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
            marginTop: 8,
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  const UploadField: React.FC<{
    label: string;
    filename: string | null;
    onUpload: (name: string) => void;
    inputRef: React.RefObject<HTMLInputElement | null>;
  }> = ({ label, filename, onUpload, inputRef }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        style={{
          border: '2px dashed #D1D5DB',
          borderRadius: 12,
          padding: 20,
          textAlign: 'center',
          background: '#F9FAFB',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <UploadCloud size={24} color="#23558B" />
        {filename ? (
          <p style={{ fontSize: 13, color: '#23558B', fontWeight: 500, margin: 0 }}>{filename}</p>
        ) : (
          <>
            <p style={{ fontSize: 14, color: '#23558B', fontWeight: 500, margin: 0 }}>Tap to upload</p>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>JPG, PNG or PDF</p>
          </>
        )}
        <input
          type="file"
          ref={inputRef}
          accept=".jpg,.jpeg,.png,.pdf"
          style={{ display: 'none' }}
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) onUpload(file.name);
          }}
        />
      </div>
    </div>
  );

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
          borderBottom: '1px solid #F3F4F6',
        }}
      >
        <button
          onClick={() => setScreen('home')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
        >
          <ArrowLeft size={24} color="#1a1a1a" />
        </button>
        <div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', display: 'block' }}>Driver Profile</span>
        </div>
      </div>

      <div
        style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 32px' }}
        className="scroll-smooth-inner"
      >
        <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6, margin: '0 0 24px' }}>
          Complete your profile to start accepting rides and earning credits.
        </p>

        {/* Car Make & Model */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
            Car Make & Model
          </label>
          <input
            type="text"
            placeholder="e.g. Toyota Camry 2022"
            value={carModel}
            onChange={e => setCarModel(e.target.value)}
            style={{ ...inputStyle, borderColor: errors.carModel ? '#EF4444' : '#E5E7EB' }}
          />
          {errors.carModel && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{errors.carModel}</p>}
        </div>

        {/* License Plate */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
            License Plate
          </label>
          <input
            type="text"
            placeholder="e.g. ABC-1234"
            value={licensePlate}
            onChange={e => setLicensePlate(e.target.value)}
            style={{ ...inputStyle, borderColor: errors.licensePlate ? '#EF4444' : '#E5E7EB' }}
          />
          {errors.licensePlate && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{errors.licensePlate}</p>}
        </div>

        {/* Driver's License Number */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
            Driver's License Number
          </label>
          <input
            type="text"
            placeholder="Enter your license number"
            value={driverLicense}
            onChange={e => setDriverLicense(e.target.value)}
            style={{ ...inputStyle, borderColor: errors.driverLicense ? '#EF4444' : '#E5E7EB' }}
          />
          {errors.driverLicense && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{errors.driverLicense}</p>}
        </div>

        {/* Insurance Policy Number */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
            Insurance Policy Number
          </label>
          <input
            type="text"
            placeholder="Enter your policy number"
            value={insurancePolicy}
            onChange={e => setInsurancePolicy(e.target.value)}
            style={{ ...inputStyle, borderColor: errors.insurancePolicy ? '#EF4444' : '#E5E7EB' }}
          />
          {errors.insurancePolicy && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{errors.insurancePolicy}</p>}
        </div>

        {/* Upload fields */}
        <UploadField
          label="Driver's License Photo"
          filename={licenseFile}
          onUpload={setLicenseFile}
          inputRef={licenseInputRef}
        />
        <UploadField
          label="Insurance Document"
          filename={insuranceFile}
          onUpload={setInsuranceFile}
          inputRef={insuranceInputRef}
        />

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
          }}
        >
          Submit for Verification
        </button>
      </div>
    </div>
  );
};

export default ProfileCompletionScreen;
