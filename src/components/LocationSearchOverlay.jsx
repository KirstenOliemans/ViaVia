import { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { ArrowLeft, Search, MapPin, Clock, Home, Briefcase, X } from 'lucide-react';
import L from 'leaflet';
import './LocationSearchOverlay.css';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MOCK_RESULTS = [
  { id: 1, name: 'Amsterdam Centraal', address: 'Stationsplein, 1012 AB Amsterdam', distance: '0.3 km' },
  { id: 2, name: 'Schiphol Airport', address: 'Evert van de Beekstraat 202, 1118 CP Schiphol', distance: '18 km' },
  { id: 3, name: 'Vondelpark', address: 'Vondelpark 3, 1071 AA Amsterdam', distance: '2.1 km' },
  { id: 4, name: 'Rijksmuseum', address: 'Museumstraat 1, 1071 XX Amsterdam', distance: '2.8 km' },
  { id: 5, name: 'RAI Amsterdam', address: 'Europaplein 22, 1078 GZ Amsterdam', distance: '5.4 km' },
  { id: 6, name: 'Amsterdam Zuid', address: 'Strawinskylaan, 1077 XZ Amsterdam', distance: '3.9 km' },
  { id: 7, name: 'De Pijp', address: 'Albert Cuypstraat, 1072 CT Amsterdam', distance: '1.8 km' },
];

const SAVED_PLACES = [
  { id: 'home', icon: Home, label: 'Home', address: 'Keizersgracht 123, Amsterdam' },
  { id: 'work', icon: Briefcase, label: 'Work', address: 'Zuidas, Amsterdam' },
];

const RECENT = [
  { id: 'r1', name: 'Schiphol Airport', address: 'Evert van de Beekstraat 202' },
  { id: 'r2', name: 'Rijksmuseum', address: 'Museumstraat 1, Amsterdam' },
];

// Center pin marker that follows map center
function CenterMarker({ onCenterChange }) {
  useMapEvents({
    moveend(e) {
      const c = e.target.getCenter();
      onCenterChange([c.lat, c.lng]);
    },
  });
  return null;
}

export default function LocationSearchOverlay({ isOpen, onClose, title, onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [mapCenter, setMapCenter] = useState([52.3676, 4.9041]);
  const [confirmedAddress, setConfirmedAddress] = useState('');
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setShowMap(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const filtered = MOCK_RESULTS.filter(r =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.address.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query]);

  const handleCenterChange = useCallback((coords) => {
    setMapCenter(coords);
    // Mock reverse geocode
    setConfirmedAddress(`${coords[0].toFixed(4)}, ${coords[1].toFixed(4)} — Drop pin location`);
  }, []);

  const handleSelect = (name) => {
    onSelect(name);
    onClose();
  };

  const handleConfirmPin = () => {
    onSelect(confirmedAddress || 'Selected location');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="location-overlay">
      <div className="location-header">
        <button className="back-btn" onClick={onClose}>
          <ArrowLeft size={20} strokeWidth={2} />
        </button>
        <span className="location-title">{title}</span>
        <div style={{ width: 36 }} />
      </div>

      <div className="location-search-bar">
        <Search size={18} strokeWidth={2} className="search-icon" />
        <input
          autoFocus
          className="location-input"
          placeholder="Search for a location..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {query && (
          <button onClick={() => setQuery('')} className="clear-btn">
            <X size={16} strokeWidth={2} />
          </button>
        )}
      </div>

      <div className="location-body">
        {/* Results */}
        {results.length > 0 && (
          <div className="results-list">
            {results.map(r => (
              <button key={r.id} className="result-item" onClick={() => handleSelect(r.name)}>
                <div className="result-icon"><MapPin size={16} strokeWidth={2} /></div>
                <div className="result-text">
                  <span className="result-name">{r.name}</span>
                  <span className="result-addr">{r.address}</span>
                </div>
                <span className="result-dist">{r.distance}</span>
              </button>
            ))}
          </div>
        )}

        {!query && (
          <>
            <div className="section-label">Saved places</div>
            {SAVED_PLACES.map(({ id, icon: Icon, label, address }) => (
              <button key={id} className="result-item" onClick={() => handleSelect(label)}>
                <div className="result-icon saved"><Icon size={16} strokeWidth={2} /></div>
                <div className="result-text">
                  <span className="result-name">{label}</span>
                  <span className="result-addr">{address}</span>
                </div>
              </button>
            ))}

            <div className="section-label">Recent</div>
            {RECENT.map(r => (
              <button key={r.id} className="result-item" onClick={() => handleSelect(r.name)}>
                <div className="result-icon recent"><Clock size={16} strokeWidth={2} /></div>
                <div className="result-text">
                  <span className="result-name">{r.name}</span>
                  <span className="result-addr">{r.address}</span>
                </div>
              </button>
            ))}

            <button className="map-toggle-btn" onClick={() => setShowMap(v => !v)}>
              <MapPin size={16} strokeWidth={2} />
              {showMap ? 'Hide map' : 'Drop a pin on the map'}
            </button>
          </>
        )}

        {showMap && !query && (
          <div className="map-wrapper">
            <MapContainer
              center={mapCenter}
              zoom={13}
              zoomControl={false}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <CenterMarker onCenterChange={handleCenterChange} />
            </MapContainer>
            <div className="center-pin">
              <MapPin size={32} strokeWidth={2} fill="#ff6038" color="white" />
            </div>
            {confirmedAddress && (
              <div className="map-address-preview">{confirmedAddress}</div>
            )}
            <button className="confirm-pin-btn" onClick={handleConfirmPin}>
              Confirm location
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
