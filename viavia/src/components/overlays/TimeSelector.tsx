import React, { useState } from 'react';

interface TimeSelectorProps {
  onClose: () => void;
  onConfirm: (time: string) => void;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_HEADER = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const TimeSelector: React.FC<TimeSelectorProps> = ({ onClose, onConfirm }) => {
  const today = new Date();
  const [mode, setMode] = useState<'now' | 'schedule'>('now');
  const [calendarDate, setCalendarDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('PM');

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCalendarDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCalendarDate(new Date(year, month + 1, 1));

  const isPastDay = (day: number) => {
    const d = new Date(year, month, day);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < todayMidnight;
  };

  const isToday = (day: number) => {
    return year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
  };

  const handleConfirm = () => {
    if (mode === 'now') {
      onConfirm('Now');
      return;
    }
    if (!selectedDay) {
      onConfirm('Now');
      return;
    }
    const d = new Date(year, month, selectedDay);
    const isThisYear = d.getFullYear() === today.getFullYear();
    const isThisMonth = d.getMonth() === today.getMonth() && isThisYear;
    const isThisDay = isThisMonth && d.getDate() === today.getDate();

    const minStr = minute.toString().padStart(2, '0');
    const timeStr = `${hour}:${minStr} ${ampm}`;

    if (isThisDay) {
      onConfirm(`Today, ${timeStr}`);
    } else {
      const monthStr = MONTHS[month];
      onConfirm(`${monthStr} ${selectedDay}, ${timeStr}`);
    }
  };

  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {/* Scrim */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: 'relative',
          background: 'white',
          borderRadius: '24px 24px 0 0',
          padding: '8px 20px 32px',
          animation: 'slideUp 300ms ease forwards',
          maxHeight: '80%',
          overflowY: 'auto',
        }}
        className="scroll-smooth-inner"
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: '#E5E7EB' }} />
        </div>

        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px', textAlign: 'center' }}>
          When do you need a ride?
        </h3>

        {/* Mode toggle */}
        <div
          style={{
            display: 'flex',
            background: '#F3F4F6',
            borderRadius: 12,
            padding: 4,
            marginBottom: 20,
          }}
        >
          {(['now', 'schedule'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                height: 36,
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                background: mode === m ? '#23558B' : 'transparent',
                color: mode === m ? 'white' : '#6B7280',
                transition: 'all 200ms ease',
              }}
            >
              {m === 'now' ? 'Now' : 'Schedule Later'}
            </button>
          ))}
        </div>

        {mode === 'now' ? (
          <p style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', margin: '20px 0' }}>
            Your ride will be requested for the current time.
          </p>
        ) : (
          <>
            {/* Calendar */}
            <div style={{ marginBottom: 20 }}>
              {/* Month nav */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, fontSize: 18, color: '#23558B' }}>
                  ‹
                </button>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
                  {MONTHS[month]} {year}
                </span>
                <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, fontSize: 18, color: '#23558B' }}>
                  ›
                </button>
              </div>

              {/* Day headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
                {DAYS_HEADER.map(d => (
                  <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#9CA3AF', padding: '2px 0' }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                {cells.map((day, i) => {
                  if (!day) return <div key={i} />;
                  const past = isPastDay(day);
                  const today_ = isToday(day);
                  const selected = selectedDay === day;
                  return (
                    <button
                      key={i}
                      onClick={() => !past && setSelectedDay(day)}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        borderRadius: '50%',
                        border: 'none',
                        cursor: past ? 'not-allowed' : 'pointer',
                        background: selected ? '#23558B' : 'transparent',
                        color: past ? '#D1D5DB' : selected ? 'white' : '#1a1a1a',
                        fontSize: 13,
                        fontWeight: today_ && !selected ? 700 : 400,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {day}
                      {today_ && !selected && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: 2,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            background: '#FEB930',
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time picker */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              {/* Hour */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <button onClick={() => setHour(h => h === 12 ? 1 : h + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#23558B' }}>▲</button>
                <span style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', width: 44, textAlign: 'center' }}>{hour}</span>
                <button onClick={() => setHour(h => h === 1 ? 12 : h - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#23558B' }}>▼</button>
              </div>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a' }}>:</span>
              {/* Minute */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <button onClick={() => setMinute(m => m === 45 ? 0 : m + 15)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#23558B' }}>▲</button>
                <span style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', width: 44, textAlign: 'center' }}>{minute.toString().padStart(2, '0')}</span>
                <button onClick={() => setMinute(m => m === 0 ? 45 : m - 15)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#23558B' }}>▼</button>
              </div>
              {/* AM/PM */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <button
                  onClick={() => setAmpm('AM')}
                  style={{ padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: ampm === 'AM' ? '#23558B' : '#F3F4F6', color: ampm === 'AM' ? 'white' : '#6B7280', fontSize: 13, fontWeight: 600 }}
                >AM</button>
                <button
                  onClick={() => setAmpm('PM')}
                  style={{ padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: ampm === 'PM' ? '#23558B' : '#F3F4F6', color: ampm === 'PM' ? 'white' : '#6B7280', fontSize: 13, fontWeight: 600 }}
                >PM</button>
              </div>
            </div>
          </>
        )}

        {/* Confirm */}
        <button
          onClick={handleConfirm}
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
          Confirm
        </button>
      </div>
    </div>
  );
};

export default TimeSelector;
