import React from 'react';
import { Banknote, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const WalletScreen: React.FC = () => {
  const { credits, offers, transactions } = useApp();

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto', background: '#F7F9F8' }} className="scroll-smooth-inner">
      {/* Credit balance card */}
      <div style={{ margin: 16 }}>
        <div
          style={{
            background: '#23558B',
            borderRadius: 20,
            padding: 24,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background pattern */}
          <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', bottom: -30, right: 30, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0, fontWeight: 500 }}>
                Available Credits
              </p>
              <Banknote size={24} color="rgba(255,255,255,0.4)" />
            </div>
            <p style={{ fontSize: 36, fontWeight: 700, color: 'white', margin: '8px 0 4px' }}>
              {credits.toLocaleString()}
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
              Earned from completed driver rides
            </p>
          </div>
        </div>
      </div>

      {/* Use your credits */}
      <div style={{ marginBottom: 8 }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', padding: '0 16px 8px', margin: 0 }}>
          Use Your Credits
        </p>
        <div
          style={{
            display: 'flex',
            gap: 12,
            padding: '4px 16px 16px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
          className="scroll-smooth-inner"
        >
          {offers.map(offer => (
            <div
              key={offer.id}
              style={{
                background: 'white',
                borderRadius: 16,
                padding: 16,
                minWidth: 160,
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              }}
            >
              <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>{offer.title}</p>
              <p style={{ fontSize: 12, color: '#23558B', fontWeight: 600, margin: '0 0 6px' }}>{offer.cost} credits</p>
              <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 12px', lineHeight: 1.4 }}>{offer.description}</p>
              <button
                style={{
                  width: '100%',
                  height: 36,
                  borderRadius: 99,
                  background: '#FEB930',
                  color: '#1a1a1a',
                  fontSize: 12,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Redeem
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', padding: '0 16px 8px', margin: 0 }}>
          History
        </p>
        <div style={{ background: 'white', borderRadius: 16, margin: '0 16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          {transactions.map((tx, i) => (
            <div
              key={tx.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderBottom: i < transactions.length - 1 ? '1px solid #F5F5F5' : 'none',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: tx.type === 'earned' ? '#F0FDF4' : '#FEF2F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {tx.type === 'earned' ? (
                  <ArrowUpRight size={16} color="#16a34a" />
                ) : (
                  <ArrowDownLeft size={16} color="#DC2626" />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, color: '#1a1a1a', margin: '0 0 2px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {tx.description}
                </p>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>{tx.date}</p>
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: tx.type === 'earned' ? '#16a34a' : '#DC2626',
                  flexShrink: 0,
                }}
              >
                {tx.type === 'earned' ? '+' : ''}{tx.amount}
              </span>
            </div>
          ))}
        </div>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
};

export default WalletScreen;
