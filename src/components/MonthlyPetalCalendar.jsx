import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Droplets,
  Heart,
  X
} from 'lucide-react';
import { calculatePBAC } from '../utils/calculators';

export const MonthlyPetalCalendar = ({
  isOpen,
  onClose,
  entries = [],
  activeDate,
  onSelectDate,
  lang = 'bn'
}) => {
  if (!isOpen) return null;

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNamesBn = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthName = lang === 'bn' ? monthNamesBn[month] : monthNamesEn[month];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Days array for calendar grid
  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const weekHeadersBn = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];
  const weekHeadersEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekHeaders = lang === 'bn' ? weekHeadersBn : weekHeadersEn;

  // Helper to check day status
  const getDayStatus = (dayNum) => {
    if (!dayNum) return null;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const entry = entries.find(e => e.date === dateStr);

    if (entry) {
      const pbac = calculatePBAC(entry).totalScore;
      if (pbac >= 15) return { type: 'flow', pbac };
      if (entry.bbt >= 36.7) return { type: 'luteal' };
      if (entry.cycleDay >= 14 && entry.cycleDay <= 16) return { type: 'fertile' };
    }

    // Fallback simulation for cycle visualization
    if (dayNum >= 1 && dayNum <= 5) return { type: 'flow', pbac: 45 };
    if (dayNum >= 14 && dayNum <= 16) return { type: 'fertile' };
    if (dayNum >= 27 && dayNum <= 30) return { type: 'predicted' };

    return null;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        background: 'rgba(30, 20, 25, 0.65)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem'
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: '520px',
          width: '100%',
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 60px rgba(180, 100, 130, 0.25)',
          padding: '2rem 1.75rem'
        }}
      >
        {/* Header with Month Switcher */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={handlePrevMonth} className="btn-secondary" style={{ padding: '0.4rem 0.6rem' }}>
              <ChevronLeft size={16} />
            </button>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', minWidth: '150px', textAlign: 'center' }}>
              {monthName} {year}
            </h3>
            <button onClick={handleNextMonth} className="btn-secondary" style={{ padding: '0.4rem 0.6rem' }}>
              <ChevronRight size={16} />
            </button>
          </div>

          <button onClick={onClose} style={{ color: 'var(--text-muted)', padding: '0.4rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Weekday Headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          {weekHeaders.map((w, idx) => (
            <div key={idx}>{w}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.45rem', textAlign: 'center' }}>
          {days.map((dayNum, idx) => {
            if (!dayNum) {
              return <div key={`empty-${idx}`} style={{ height: '44px' }} />;
            }

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isSelected = activeDate === dateStr;
            const status = getDayStatus(dayNum);

            return (
              <div
                key={`day-${dayNum}`}
                onClick={() => {
                  if (onSelectDate) onSelectDate(dateStr);
                  onClose();
                }}
                style={{
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  background: isSelected ? 'var(--accent-rose-soft)' : status?.type === 'flow' ? '#fff0f4' : status?.type === 'fertile' ? '#fff9e6' : 'transparent',
                  border: isSelected ? '2px solid var(--accent-rose)' : status?.type === 'predicted' ? '1.5px dashed var(--accent-rose)' : '1px solid transparent',
                  transition: 'var(--transition)'
                }}
              >
                <span style={{ fontSize: '0.88rem', fontWeight: isSelected || status ? 700 : 500, color: status?.type === 'flow' ? 'var(--accent-rose)' : 'var(--text-primary)' }}>
                  {dayNum}
                </span>

                {/* Status Petal Dots */}
                {status?.type === 'flow' && (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-rose)', marginTop: '2px' }} />
                )}
                {status?.type === 'fertile' && (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-amber)', marginTop: '2px' }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-rose)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-rose)' }} />
            {lang === 'bn' ? 'পিরিয়ডের দিন' : 'Period Days'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-amber)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-amber)' }} />
            {lang === 'bn' ? 'ওভুলেশন / উর্বর দিন' : 'Fertile Window'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1.5px dashed var(--accent-rose)' }} />
            {lang === 'bn' ? 'সম্ভাব্য পিরিয়ড' : 'Predicted'}
          </span>
        </div>
      </div>
    </div>
  );
};
