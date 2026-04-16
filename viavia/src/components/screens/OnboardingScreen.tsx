import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const slides = [
  {
    title: 'Ride Together',
    subtitle: 'Community-powered rides, always nearby.',
    illustration: (
      <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
        {/* Car body */}
        <rect x="30" y="80" width="140" height="50" rx="10" fill="#23558B" />
        <rect x="50" y="58" width="100" height="40" rx="8" fill="#3B7BC0" />
        {/* Windows */}
        <rect x="58" y="65" width="36" height="26" rx="4" fill="#B8D4F0" opacity="0.8" />
        <rect x="102" y="65" width="36" height="26" rx="4" fill="#B8D4F0" opacity="0.8" />
        {/* Wheels */}
        <circle cx="65" cy="130" r="18" fill="#1a1a1a" />
        <circle cx="65" cy="130" r="10" fill="#555" />
        <circle cx="135" cy="130" r="18" fill="#1a1a1a" />
        <circle cx="135" cy="130" r="10" fill="#555" />
        {/* People */}
        <circle cx="72" cy="72" r="10" fill="#FEB930" />
        <circle cx="116" cy="72" r="10" fill="#FEB930" opacity="0.8" />
        <circle cx="144" cy="72" r="8" fill="#FEB930" opacity="0.6" />
        {/* Road */}
        <rect x="0" y="148" width="200" height="12" rx="4" fill="#E5E7EB" />
        <rect x="80" y="152" width="20" height="4" rx="2" fill="#9CA3AF" />
        <rect x="130" y="152" width="20" height="4" rx="2" fill="#9CA3AF" />
      </svg>
    ),
  },
  {
    title: 'Earn as You Drive',
    subtitle: 'Drive others, earn credits. Use them your way.',
    illustration: (
      <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
        {/* Credits */}
        <circle cx="100" cy="70" r="36" fill="#FEB930" opacity="0.15" />
        <circle cx="100" cy="70" r="26" fill="#FEB930" opacity="0.3" />
        <circle cx="100" cy="70" r="18" fill="#FEB930" />
        <text x="100" y="76" textAnchor="middle" fontSize="18" fontWeight="700" fill="white">$</text>
        {/* Floating coins */}
        <circle cx="48" cy="50" r="12" fill="#FEB930" opacity="0.7" />
        <text x="48" y="55" textAnchor="middle" fontSize="10" fontWeight="700" fill="white">$</text>
        <circle cx="155" cy="45" r="10" fill="#FEB930" opacity="0.5" />
        <text x="155" y="50" textAnchor="middle" fontSize="9" fontWeight="700" fill="white">$</text>
        <circle cx="160" cy="95" r="8" fill="#FEB930" opacity="0.4" />
        <text x="160" y="100" textAnchor="middle" fontSize="8" fontWeight="700" fill="white">$</text>
        {/* Car small */}
        <rect x="60" y="118" width="80" height="30" rx="6" fill="#23558B" />
        <rect x="72" y="108" width="56" height="22" rx="5" fill="#3B7BC0" />
        <circle cx="78" cy="148" r="10" fill="#1a1a1a" />
        <circle cx="122" cy="148" r="10" fill="#1a1a1a" />
        {/* Arrow up */}
        <path d="M28 90 L28 60 M28 60 L20 70 M28 60 L36 70" stroke="#23558B" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Safe & Simple',
    subtitle: 'Verified drivers, real-time tracking, one tap away.',
    illustration: (
      <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
        {/* Shield */}
        <path d="M100 18 L150 38 L150 90 C150 118 128 138 100 148 C72 138 50 118 50 90 L50 38 Z" fill="#23558B" opacity="0.15" />
        <path d="M100 28 L140 44 L140 90 C140 112 124 128 100 138 C76 128 60 112 60 90 L60 44 Z" fill="#23558B" opacity="0.3" />
        <path d="M100 38 L132 52 L132 88 C132 106 118 120 100 128 C82 120 68 106 68 88 L68 52 Z" fill="#23558B" />
        {/* Checkmark */}
        <path d="M82 88 L94 100 L118 74" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Map pin */}
        <circle cx="155" cy="40" r="14" fill="#FEB930" />
        <path d="M155 50 L155 62" stroke="#FEB930" strokeWidth="3" strokeLinecap="round" />
        <circle cx="155" cy="38" r="5" fill="white" />
        {/* Signal dots */}
        <circle cx="40" cy="120" r="4" fill="#23558B" opacity="0.4" />
        <circle cx="56" cy="120" r="4" fill="#23558B" opacity="0.6" />
        <circle cx="72" cy="120" r="4" fill="#23558B" opacity="0.8" />
        <circle cx="88" cy="120" r="4" fill="#23558B" />
      </svg>
    ),
  },
];

const OnboardingScreen: React.FC = () => {
  const { setScreen } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const isLast = currentSlide === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      setScreen('signup');
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const slide = slides[currentSlide];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '60px 24px 40px',
      }}
    >
      {/* Illustration */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
        {slide.illustration}
      </div>

      {/* Text */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#23558B', margin: 0 }}>{slide.title}</h2>
        <p style={{ fontSize: 16, color: '#4B5563', maxWidth: 280, lineHeight: 1.5, margin: 0 }}>
          {slide.subtitle}
        </p>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 8 }}>
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentSlide(i)}
            style={{
              width: i === currentSlide ? 20 : 8,
              height: 8,
              borderRadius: 4,
              background: i === currentSlide ? '#23558B' : '#D1D5DB',
              transition: 'all 300ms ease',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* Button */}
      <button
        onClick={handleNext}
        style={{
          width: '100%',
          height: 48,
          borderRadius: 99,
          background: isLast ? '#FEB930' : '#23558B',
          color: isLast ? '#1a1a1a' : 'white',
          fontSize: 16,
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          transition: 'all 300ms ease',
        }}
      >
        {isLast ? 'Get Started' : 'Next'}
      </button>
    </div>
  );
};

export default OnboardingScreen;
