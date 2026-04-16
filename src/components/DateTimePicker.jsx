import { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import './DateTimePicker.css';

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

function formatDisplay(date, hour, minute) {
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const h = hour % 12 || 12;
  const m = minute.toString().padStart(2, '0');
  const ampm = hour < 12 ? 'AM' : 'PM';
  const dayLabel = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${dayLabel}, ${h}:${m} ${ampm}`;
}

export default function DateTimePicker({ isOpen, onClose, onConfirm, currentValue }) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(now);
  const [selectedHour, setSelectedHour] = useState(now.getHours());
  const [selectedMinute, setSelectedMinute] = useState(Math.ceil(now.getMinutes() / 15) * 15 % 60);
  const [tab, setTab] = useState('date'); // 'date' | 'time'

  if (!isOpen) return null;

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const cells = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  const isPast = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return d < t;
  };

  const isSelected = (day) => {
    return selectedDate.getDate() === day &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getFullYear() === viewYear;
  };

  const selectDay = (day) => {
    if (!day || isPast(day)) return;
    setSelectedDate(new Date(viewYear, viewMonth, day));
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const handleNow = () => {
    const n = new Date();
    setSelectedDate(n);
    setViewYear(n.getFullYear());
    setViewMonth(n.getMonth());
    setSelectedHour(n.getHours());
    setSelectedMinute(Math.ceil(n.getMinutes() / 15) * 15 % 60);
  };

  const handleConfirm = () => {
    onConfirm(formatDisplay(selectedDate, selectedHour, selectedMinute));
    onClose();
  };

  return (
    <div className="dtp-backdrop" onClick={onClose}>
      <div className="dtp-modal" onClick={e => e.stopPropagation()}>
        <div className="dtp-header">
          <span className="dtp-title">Schedule Ride</span>
          <button className="dtp-close" onClick={onClose}><X size={18} strokeWidth={2} /></button>
        </div>

        <div className="dtp-now-row">
          <button className="dtp-now-btn" onClick={handleNow}>
            <Clock size={14} strokeWidth={2} /> Now
          </button>
          <div className="dtp-tabs">
            <button className={`dtp-tab${tab === 'date' ? ' active' : ''}`} onClick={() => setTab('date')}>
              <Calendar size={14} strokeWidth={2} /> Date
            </button>
            <button className={`dtp-tab${tab === 'time' ? ' active' : ''}`} onClick={() => setTab('time')}>
              <Clock size={14} strokeWidth={2} /> Time
            </button>
          </div>
        </div>

        {tab === 'date' && (
          <div className="dtp-calendar">
            <div className="cal-nav">
              <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
              <span className="cal-month">{MONTHS[viewMonth]} {viewYear}</span>
              <button className="cal-nav-btn" onClick={nextMonth}>›</button>
            </div>
            <div className="cal-grid">
              {DAYS.map(d => <div key={d} className="cal-day-label">{d}</div>)}
              {cells.map((day, i) => (
                <button
                  key={i}
                  className={`cal-cell${!day ? ' empty' : ''}${day && isPast(day) ? ' past' : ''}${day && isSelected(day) ? ' selected' : ''}`}
                  onClick={() => selectDay(day)}
                  disabled={!day || isPast(day)}
                >
                  {day || ''}
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 'time' && (
          <div className="dtp-time">
            <div className="time-col">
              <span className="time-col-label">Hour</span>
              <div className="time-scroll">
                {HOURS.map(h => (
                  <button
                    key={h}
                    className={`time-chip${selectedHour === h ? ' selected' : ''}`}
                    onClick={() => setSelectedHour(h)}
                  >
                    {h.toString().padStart(2, '0')}:00
                  </button>
                ))}
              </div>
            </div>
            <div className="time-col">
              <span className="time-col-label">Minute</span>
              <div className="time-scroll">
                {MINUTES.map(m => (
                  <button
                    key={m}
                    className={`time-chip${selectedMinute === m ? ' selected' : ''}`}
                    onClick={() => setSelectedMinute(m)}
                  >
                    :{m.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="dtp-preview">
          {formatDisplay(selectedDate, selectedHour, selectedMinute)}
        </div>

        <button className="dtp-confirm-btn" onClick={handleConfirm}>
          Schedule
        </button>
      </div>
    </div>
  );
}
