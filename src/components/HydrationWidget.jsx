import React, { useState } from 'react';
import {
  Droplets,
  Pill,
  CheckCircle2,
  Circle,
  Sparkles,
  Award
} from 'lucide-react';

export const HydrationWidget = ({ lang = 'bn' }) => {
  const [glasses, setGlasses] = useState(5); // 5 out of 8 drank
  const [medsCheck, setMedsCheck] = useState({
    thyrox: true,
    inositol: true,
    magnesium: false
  });

  const toggleGlass = (idx) => {
    if (idx < glasses) {
      setGlasses(idx);
    } else {
      setGlasses(idx + 1);
    }
  };

  const toggleMed = (key) => {
    setMedsCheck(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalGoal = 8;
  const percentage = Math.round((glasses / totalGoal) * 100);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem' }}>
      {/* 1. Water Tracker */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="card-icon-bubble" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                <Droplets size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                  {lang === 'bn' ? 'দৈনিক পানি পান (Hydration)' : 'Daily Hydration'}
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {lang === 'bn' ? 'দৈনিক লক্ষ্য: ৮ গ্লাস (২.০ লিটার)' : 'Goal: 8 glasses (2.0 Liters)'}
                </span>
              </div>
            </div>

            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0284c7', fontFamily: 'var(--font-mono)' }}>
              {glasses} / 8
            </span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.4 }}>
            {lang === 'bn'
              ? 'পর্যাপ্ত পানি পানে জরায়ুর রক্ত চলাচল স্বাভাবিক থাকে এবং পেলভিক ফোলাভাব কমে।'
              : 'Hydration thins mucosal inflammation and relieves uterine pelvic congestion.'}
          </p>

          {/* 8 Tap-to-Fill Glass Icons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.4rem', margin: '0.75rem 0' }}>
            {Array.from({ length: totalGoal }).map((_, i) => {
              const isDrank = i < glasses;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleGlass(i)}
                  style={{
                    flex: 1,
                    height: '48px',
                    borderRadius: 'var(--radius-sm)',
                    background: isDrank ? '#bae6fd' : 'var(--bg-surface-elevated)',
                    border: `1.5px solid ${isDrank ? '#0284c7' : 'var(--border-subtle)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                  title={`Glass ${i + 1}`}
                >
                  <Droplets size={18} color={isDrank ? '#0284c7' : 'var(--text-muted)'} fill={isDrank ? '#0284c7' : 'none'} />
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface-soft)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <span>{lang === 'bn' ? 'আজকের অগ্রগতি:' : 'Progress:'} <strong>{percentage}%</strong></span>
          <span style={{ color: 'var(--accent-teal)', fontWeight: 700 }}>
            {glasses >= 8 ? (lang === 'bn' ? '🎉 লক্ষ্য অর্জিত!' : 'Goal Met!') : (lang === 'bn' ? 'আরেকটু বাকি' : 'Keep going')}
          </span>
        </div>
      </div>

      {/* 2. Daily Medication & Supplement Checklist */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <div className="card-icon-bubble" style={{ background: 'var(--accent-plum-soft)', color: 'var(--accent-plum)' }}>
              <Pill size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                {lang === 'bn' ? 'আজকের ওষুধ চেকলিস্ট' : 'Daily Pill Check'}
              </h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'থাইরয়েড ও হরমোন ব্যালান্স' : 'Thyroid & Hormone adherence'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {/* Thyrox */}
            <div
              onClick={() => toggleMed('thyrox')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: medsCheck.thyrox ? 'var(--accent-teal-soft)' : 'var(--bg-surface-elevated)',
                border: `1px solid ${medsCheck.thyrox ? 'var(--accent-teal)' : 'var(--border-subtle)'}`,
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              {medsCheck.thyrox ? <CheckCircle2 size={18} color="var(--accent-teal)" /> : <Circle size={18} color="var(--text-muted)" />}
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'block' }}>
                  {lang === 'bn' ? 'থাইরক্সিন (সকালে খালি পেটে)' : 'Levothyroxine (Morning Fasting)'}
                </strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {lang === 'bn' ? 'নাস্তার ১ ঘণ্টা আগে' : '1 hr before breakfast'}
                </span>
              </div>
            </div>

            {/* Inositol */}
            <div
              onClick={() => toggleMed('inositol')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: medsCheck.inositol ? 'var(--accent-teal-soft)' : 'var(--bg-surface-elevated)',
                border: `1px solid ${medsCheck.inositol ? 'var(--accent-teal)' : 'var(--border-subtle)'}`,
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              {medsCheck.inositol ? <CheckCircle2 size={18} color="var(--accent-teal)" /> : <Circle size={18} color="var(--text-muted)" />}
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'block' }}>
                  {lang === 'bn' ? 'মায়ো-ইনোসিটল ৪০:১ (দুপুরে)' : 'Myo-Inositol 40:1 (Lunch)'}
                </strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {lang === 'bn' ? 'ইনসুলিন ও ওভুলেশন সাপোর্ট' : 'Insulin & ovulation'}
                </span>
              </div>
            </div>

            {/* Magnesium */}
            <div
              onClick={() => toggleMed('magnesium')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: medsCheck.magnesium ? 'var(--accent-teal-soft)' : 'var(--bg-surface-elevated)',
                border: `1px solid ${medsCheck.magnesium ? 'var(--accent-teal)' : 'var(--border-subtle)'}`,
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              {medsCheck.magnesium ? <CheckCircle2 size={18} color="var(--accent-teal)" /> : <Circle size={18} color="var(--text-muted)" />}
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'block' }}>
                  {lang === 'bn' ? 'ম্যাগনেসিয়াম গ্লাইসিনেট (রাতে)' : 'Magnesium Bisglycinate (Night)'}
                </strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {lang === 'bn' ? 'জরায়ু রিল্যাক্সেশন ও ঘুম' : 'Pelvic muscle relaxation'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--accent-rose)', fontWeight: 600 }}>
          🌸 {lang === 'bn' ? '৪ দিনের দারুণ ধারাবাহিকতা!' : '4-day adherence streak!'}
        </div>
      </div>
    </div>
  );
};
