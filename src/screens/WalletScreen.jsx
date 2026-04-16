import { useState } from 'react';
import './WalletScreen.css';

// ── Figma asset URLs (node 167:7594) ─────────────────────────────
const ARROW_UP      = 'https://www.figma.com/api/mcp/asset/f44df449-a476-4413-ab20-87e7efe91d35';
const ARROW_DOWN    = 'https://www.figma.com/api/mcp/asset/c62d2d66-eb0e-4da0-9375-d7a620b87214';
const ARROW_TX_UP   = 'https://www.figma.com/api/mcp/asset/ea5f693f-2d62-4b5a-a726-90ce6cb83d4d';
const ARROW_TX_DOWN = 'https://www.figma.com/api/mcp/asset/29688fb7-b1bc-4011-98b1-98e1ad89f474';
const CALL_ICON     = 'https://www.figma.com/api/mcp/asset/a15ee280-038e-46d2-b05d-94dec4633474';

// ── Offer images — Unsplash/Picsum for each category ─────────────
const IMG = {
  coffee:    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=120&h=120&fit=crop&auto=format',
  burger:    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&h=120&fit=crop&auto=format',
  sushi:     'https://images.unsplash.com/photo-1553621042-f6e147245754?w=120&h=120&fit=crop&auto=format',
  pizza:     'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&h=120&fit=crop&auto=format',
  tea:       'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=120&h=120&fit=crop&auto=format',
  bakery:    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=120&h=120&fit=crop&auto=format',
  car:       'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&h=120&fit=crop&auto=format',
  bike:      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=120&fit=crop&auto=format',
  grocery:   'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&h=120&fit=crop&auto=format',
  organic:   'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=120&h=120&fit=crop&auto=format',
  market:    'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=120&h=120&fit=crop&auto=format',
};

// ── Deals per category ────────────────────────────────────────────
const DEALS_BY_CATEGORY = {
  All: [
    { id: 1, img: IMG.coffee,  name: 'Coffee Corner',   discount: '20% off on all drinks',      credits: 2, expires: '2d : 3h : 12m' },
    { id: 2, img: IMG.car,     name: 'Shared Ride Pass', discount: 'First shared ride is free',  credits: 5, expires: '0d : 6h : 45m' },
    { id: 3, img: IMG.pizza,   name: 'Pizza Palace',    discount: '15% off on all orders',       credits: 3, expires: '1d : 5h : 30m' },
    { id: 4, img: IMG.grocery, name: 'Albert Heijn',    discount: '5% off your full basket',     credits: 2, expires: '3d : 1h : 0m'  },
  ],
  Rides: [
    { id: 1, img: IMG.car,  name: 'First Ride Free',   discount: 'Free shared ride, on us',         credits: 5, expires: '0d : 6h : 45m' },
    { id: 2, img: IMG.bike, name: 'Weekend Rides',     discount: '10% off all weekend rides',        credits: 2, expires: '3d : 0h : 0m'  },
    { id: 3, img: IMG.car,  name: 'Group Discount',    discount: '€1 off per extra passenger',       credits: 1, expires: '1d : 12h : 0m' },
  ],
  Restaurants: [
    { id: 1, img: IMG.pizza,  name: 'Pizza Palace',   discount: '15% off on all orders',         credits: 3, expires: '1d : 5h : 30m' },
    { id: 2, img: IMG.burger, name: 'Burger Barn',    discount: 'Buy 1 get 1 free on burgers',   credits: 4, expires: '0d : 8h : 45m' },
    { id: 3, img: IMG.sushi,  name: 'Sushi Spot',     discount: '€5 off orders over €30',        credits: 3, expires: '2d : 1h : 0m'  },
  ],
  Cafes: [
    { id: 1, img: IMG.coffee, name: 'Coffee Corner',  discount: '20% off on all drinks',         credits: 2, expires: '2d : 3h : 12m' },
    { id: 2, img: IMG.tea,    name: 'The Tea House',  discount: 'Free pastry with any tea',      credits: 1, expires: '0d : 12h : 0m' },
    { id: 3, img: IMG.bakery, name: 'Daily Bakery',   discount: 'Half price on afternoon pastries', credits: 2, expires: '0d : 3h : 30m' },
  ],
  Groceries: [
    { id: 1, img: IMG.grocery, name: 'Albert Heijn',  discount: '5% off your full basket',       credits: 2, expires: '3d : 6h : 0m'  },
    { id: 2, img: IMG.market,  name: 'Jumbo Market',  discount: 'Free delivery on orders €30+',  credits: 3, expires: '1d : 0h : 30m' },
    { id: 3, img: IMG.organic, name: 'Organic Plus',  discount: '10% off organic products',      credits: 2, expires: '2d : 4h : 15m' },
  ],
};

const CHIPS = ['All', 'Rides', 'Restaurants', 'Cafes', 'Groceries'];

export default function WalletScreen() {
  const [activeChip, setActiveChip] = useState('All');
  const deals = DEALS_BY_CATEGORY[activeChip];

  return (
    <div className="ws-wrapper">
      <div className="ws-root">

        {/* ── Top white hero (rounded bottom) ─────────────────── */}
        <div className="ws-hero">
          {/* Credit balance card */}
          <div className="ws-balance-card">
            <p className="ws-balance-label">Credit Balance</p>
            <div className="ws-balance-amount">
              <span className="ws-vv">Vv</span>
              <span className="ws-amount">12,7</span>
            </div>
            <p className="ws-balance-sub">3h : 42min contribution</p>
          </div>

          {/* Action buttons: Send / Receive / Transactions */}
          <div className="ws-actions">
            <button className="ws-action-btn">
              <div className="ws-action-icon">
                <img src={ARROW_UP} alt="" className="ws-action-img" />
              </div>
              <span className="ws-action-label">Send</span>
            </button>
            <button className="ws-action-btn">
              <div className="ws-action-icon">
                <img src={ARROW_DOWN} alt="" className="ws-action-img" />
              </div>
              <span className="ws-action-label">Receive</span>
            </button>
            <button className="ws-action-btn">
              <div className="ws-action-icon ws-action-icon--tx">
                <img src={ARROW_TX_UP}   alt="" className="ws-action-img" />
                <img src={ARROW_TX_DOWN} alt="" className="ws-action-img" />
              </div>
              <span className="ws-action-label">Transactions</span>
            </button>
          </div>
        </div>

        {/* ── Offers for you ───────────────────────────────────── */}
        <div className="ws-offers">

          {/* Sticky header: title + chips pin to top while cards scroll */}
          <div className="ws-offers-head">
            <p className="ws-offers-title">Offers for you</p>
            <div className="ws-chips-row">
              {CHIPS.map(chip => (
                <button
                  key={chip}
                  className={`ws-chip${activeChip === chip ? ' active' : ''}`}
                  onClick={() => setActiveChip(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <div className="ws-deals">
            {deals.map(deal => (
              <div key={deal.id} className="ws-deal-card">
                {/* Top row */}
                <div className="ws-deal-top">
                  <img src={deal.img} alt={deal.name} className="ws-deal-img" />
                  <div className="ws-deal-info">
                    <div className="ws-deal-header">
                      <span className="ws-deal-name">{deal.name}</span>
                      <span className="ws-deal-time">{deal.expires}</span>
                    </div>
                    <span className="ws-deal-desc">{deal.discount}</span>
                  </div>
                </div>
                {/* Divider */}
                <div className="ws-deal-divider" />
                {/* Footer */}
                <div className="ws-deal-footer">
                  <span className="ws-deal-credits">{deal.credits} Credits</span>
                  <button className="ws-redeem-btn">Redeem</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAB: Figma bottom-[20px] right-[20px] ────────────── */}
      <button className="ws-fab" aria-label="Call support">
        <img src={CALL_ICON} alt="" className="ws-fab-icon" />
      </button>
    </div>
  );
}
