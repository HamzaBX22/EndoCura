import React, { useState } from 'react';
import {
  Heart,
  Droplets,
  Smile,
  Thermometer,
  Sparkles,
  ArrowRight,
  Flame,
  Coffee,
  CheckCircle2,
  Calendar,
  Baby,
  Share2
} from 'lucide-react';
import { translations } from '../data/translations';
import { HydrationWidget } from './HydrationWidget';

export const Dashboard = ({
  profile,
  entries = [],
  onNavigate,
  onOpenSOS,
  onOpenCalendar,
  onOpenPartner,
  isFertilityMode = false,
  setIsFertilityMode,
  lang = 'bn'
}) => {
  const t = translations[lang] || translations.bn;
  const latestEntry = entries[entries.length - 1] || {};
  const cycleDay = latestEntry.cycleDay || 18;
  const daysLeft = Math.max(1, 28 - cycleDay);

  const painScore = latestEntry.pain?.nrsScore || 2;
  const flowDesc = lang === 'bn' ? 'আজ স্বাভাবিক প্রবাহ' : 'Normal flow today';
  const comfortDesc = painScore <= 2
    ? (lang === 'bn' ? 'স্বস্তিদায়ক (২/১০)' : 'Comfortable (2/10)')
    : (lang === 'bn' ? `ব্যথা অনুভূত হচ্ছে (${painScore}/১০)` : `Pain felt (${painScore}/10)`);
  const thyroidDesc = lang === 'bn' ? 'মেটাবলিজম সক্রিয় (৩৬.৩°C)' : 'Metabolism Active (36.3°C)';

  return (
    <div className="dashboard-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      {/* Top Friendly Greeting */}
      <div className="dashboard-greeting-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
            🌸 {lang === 'bn' ? `শুভ দিন, ${profile.name ? profile.name.split(' ')[0] : 'প্রিয়'}` : `Hello, ${profile.name ? profile.name.split(' ')[0] : 'Friend'}`}
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {lang === 'bn' ? `সাইকেলের ${cycleDay}তম দিন • লুটিয়াল পর্ব` : `Cycle Day ${cycleDay} • Luteal Phase`}
          </span>
        </div>

        {/* Quick Fertility Mode Switch */}
        <button
          type="button"
          onClick={() => setIsFertilityMode(!isFertilityMode)}
          style={{
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            background: isFertilityMode ? 'var(--accent-amber-soft)' : 'var(--bg-surface-elevated)',
            border: `1.5px solid ${isFertilityMode ? 'var(--accent-amber)' : 'var(--border-subtle)'}`,
            color: isFertilityMode ? 'var(--accent-amber)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <Baby size={14} />
          <span>{isFertilityMode ? (lang === 'bn' ? 'ফার্টিলিটি মোড' : 'Fertility On') : (lang === 'bn' ? 'ফার্টিলিটি মোড' : 'Fertility Mode')}</span>
        </button>
      </div>

      {/* Central Hero Card */}
      <div
        className="glass-card dashboard-hero-card"
        style={{
          textAlign: 'center',
          padding: '1.75rem 1.25rem',
          background: isFertilityMode
            ? 'linear-gradient(180deg, #ffffff 0%, #fffdf0 100%)'
            : 'linear-gradient(180deg, #ffffff 0%, #fff7f9 100%)',
          border: isFertilityMode
            ? '1.5px solid rgba(243, 156, 18, 0.35)'
            : '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        {/* Circular Cycle Ring */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0 1rem 0' }}>
          <div
            className="cycle-ring-petal"
            style={{
              width: '185px',
              height: '185px',
              aspectRatio: '1 / 1',
              flexShrink: 0,
              borderRadius: '50%',
              background: isFertilityMode
                ? 'radial-gradient(circle, #fffef7 0%, #fff7d6 60%, #ffecaa 100%)'
                : 'radial-gradient(circle, #fff0f4 0%, #ffe4ec 60%, #ffd4e0 100%)',
              border: '6px solid #ffffff',
              boxShadow: isFertilityMode
                ? '0 10px 30px rgba(243, 156, 18, 0.22), inset 0 2px 10px rgba(255, 255, 255, 0.8)'
                : '0 10px 30px rgba(255, 101, 132, 0.18), inset 0 2px 10px rgba(255, 255, 255, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.85rem'
            }}
          >
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {t.activeCycleDay}
            </span>
            <span style={{ fontSize: '3.3rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: isFertilityMode ? 'var(--accent-amber)' : 'var(--accent-rose)', lineHeight: 1 }}>
              {cycleDay}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-plum)', fontWeight: 700, marginTop: '0.2rem' }}>
              {isFertilityMode ? (lang === 'bn' ? 'উর্বর উইন্ডো' : 'Ovulatory') : t.phaseLuteal}
            </span>
          </div>
        </div>

        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          {lang === 'bn' ? `পিরিয়ড শুরু হতে প্রায় ${daysLeft} দিন বাকি` : `Approx ${daysLeft} days until next period`}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', maxWidth: '460px', margin: '0 auto 1.25rem auto', lineHeight: 1.45 }}>
          {isFertilityMode
            ? (lang === 'bn'
              ? 'ডিম্বাণুর ইমপ্লান্টেশনের জন্য জরায়ুকে শান্ত ও উষ্ণ রাখুন।'
              : 'Nurturing implantation with gentle rest and progesterone.')
            : (lang === 'bn'
              ? 'লুটিয়াল পর্বে শরীর রিল্যাক্স রাখুন, আদা চা জরায়ুর টানটান ভাব কমাবে।'
              : 'Keep uterine muscles relaxed with warm fluids and restorative rest.')}
        </p>

        {/* Primary Call to Action Button */}
        <div style={{ maxWidth: '340px', margin: '0 auto 1rem auto' }}>
          <button
            className="btn-primary"
            onClick={() => onNavigate('log')}
            style={{
              width: '100%',
              padding: '0.85rem 1.5rem',
              fontSize: '0.96rem',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-rose)'
            }}
          >
            <Heart size={18} />
            <span>{t.logTodayCTA}</span>
          </button>
        </div>

        {/* 3 Quick Utility Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className="btn-secondary"
            onClick={onOpenCalendar}
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
          >
            <Calendar size={14} color="var(--accent-rose)" />
            <span>{lang === 'bn' ? 'ক্যালেন্ডার' : 'Calendar'}</span>
          </button>
          <button
            className="btn-secondary"
            onClick={onOpenPartner}
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
          >
            <Heart size={14} color="var(--accent-rose)" />
            <span>{lang === 'bn' ? 'পার্টনার কেয়ার' : 'Partner Card'}</span>
          </button>
          <button
            className="btn-secondary"
            onClick={onOpenSOS}
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', color: 'var(--accent-crimson)' }}
          >
            <Flame size={14} />
            <span>SOS</span>
          </button>
        </div>
      </div>

      {/* 3 Soft Status Glance Cards */}
      <div className="status-cards-row">
        <div className="glass-card mini-status-card" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.95rem 1.15rem' }}>
          <div className="card-icon-bubble" style={{ background: 'var(--accent-rose-soft)', color: 'var(--accent-rose)', width: '42px', height: '42px', minWidth: '42px', minHeight: '42px', flexShrink: 0, aspectRatio: '1 / 1' }}>
            <Droplets size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>{t.bleedingCardTitle}</span>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>{flowDesc}</div>
          </div>
        </div>

        <div className="glass-card mini-status-card" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.95rem 1.15rem' }}>
          <div className="card-icon-bubble" style={{ background: 'var(--accent-teal-soft)', color: 'var(--accent-teal)', width: '42px', height: '42px', minWidth: '42px', minHeight: '42px', flexShrink: 0, aspectRatio: '1 / 1' }}>
            <Smile size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>{t.painCardTitle}</span>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>{comfortDesc}</div>
          </div>
        </div>

        <div className="glass-card mini-status-card" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.95rem 1.15rem' }}>
          <div className="card-icon-bubble" style={{ background: 'var(--accent-amber-soft)', color: 'var(--accent-amber)', width: '42px', height: '42px', minWidth: '42px', minHeight: '42px', flexShrink: 0, aspectRatio: '1 / 1' }}>
            <Thermometer size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>{t.thyroidCardTitle}</span>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>{thyroidDesc}</div>
          </div>
        </div>
      </div>

      {/* Feature 5: Daily Hydration & Pill Widget */}
      <HydrationWidget lang={lang} />

      {/* Gentle Today's Tip Card */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fff7f9 100%)',
          borderLeft: '4px solid var(--accent-rose)',
          padding: '1.25rem 1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <Sparkles size={18} color="var(--accent-rose)" />
          <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{t.gentleTipTitle}</strong>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {t.gentleTipDesc}
        </p>
      </div>
    </div>
  );
};
