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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Central Visual Cycle Petal Hero */}
      <div
        className="glass-card"
        style={{
          textAlign: 'center',
          padding: '2.5rem 1.5rem',
          background: isFertilityMode
            ? 'linear-gradient(180deg, #ffffff 0%, #fffdf0 100%)'
            : 'linear-gradient(180deg, #ffffff 0%, #fff7f9 100%)',
          border: isFertilityMode
            ? '1.5px solid rgba(243, 156, 18, 0.35)'
            : '1px solid var(--border-subtle)'
        }}
      >
        {/* Mode Toggle Pills & Quick Modals */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          {/* Fertility Mode Switch */}
          <button
            type="button"
            onClick={() => setIsFertilityMode(!isFertilityMode)}
            style={{
              padding: '0.45rem 0.95rem',
              borderRadius: 'var(--radius-full)',
              background: isFertilityMode ? 'var(--accent-amber-soft)' : 'var(--bg-surface-elevated)',
              border: `1.5px solid ${isFertilityMode ? 'var(--accent-amber)' : 'var(--border-subtle)'}`,
              color: isFertilityMode ? 'var(--accent-amber)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <Baby size={15} />
            <span>{isFertilityMode ? (lang === 'bn' ? '👶 গর্ভধারণ প্রস্তুতি মোড সক্রিয়' : 'Fertility Mode Active') : (lang === 'bn' ? '🌸 সাধারণ মোড (গর্ভধারণ প্রস্তুতিতে সুইচ করুন)' : 'Switch to Fertility Mode')}</span>
          </button>

          {/* Quick Hub Buttons: Calendar & Partner */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn-secondary"
              onClick={onOpenCalendar}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
            >
              <Calendar size={15} color="var(--accent-rose)" />
              <span>{lang === 'bn' ? 'ক্যালেন্ডার' : 'Calendar'}</span>
            </button>
            <button
              className="btn-secondary"
              onClick={onOpenPartner}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
            >
              <Heart size={15} color="var(--accent-rose)" />
              <span>{lang === 'bn' ? 'পার্টনার কেয়ার' : 'Partner Card'}</span>
            </button>
          </div>
        </div>

        {/* Circular Cycle Ring */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1.25rem 0' }}>
          <div
            className="cycle-ring-petal"
            style={{
              width: 'clamp(180px, 48vw, 210px)',
              height: 'clamp(180px, 48vw, 210px)',
              aspectRatio: '1 / 1',
              flexShrink: 0,
              borderRadius: '50%',
              background: isFertilityMode
                ? 'radial-gradient(circle, #fffef7 0%, #fff7d6 60%, #ffecaa 100%)'
                : 'radial-gradient(circle, #fff0f4 0%, #ffe4ec 60%, #ffd4e0 100%)',
              border: '6px solid #ffffff',
              boxShadow: isFertilityMode
                ? '0 10px 30px rgba(243, 156, 18, 0.25), inset 0 2px 10px rgba(255, 255, 255, 0.8)'
                : '0 10px 30px rgba(255, 101, 132, 0.2), inset 0 2px 10px rgba(255, 255, 255, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {t.activeCycleDay}
            </span>
            <span style={{ fontSize: '3.4rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: isFertilityMode ? 'var(--accent-amber)' : 'var(--accent-rose)', lineHeight: 1 }}>
              {cycleDay}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-plum)', fontWeight: 700, marginTop: '0.2rem' }}>
              {isFertilityMode ? (lang === 'bn' ? 'উর্বর উইন্ডো সম্পন্ন' : 'Post-Ovulatory') : t.phaseLuteal}
            </span>
          </div>
        </div>

        <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
          {lang === 'bn' ? `পিরিয়ড শুরু হতে প্রায় ${daysLeft} দিন বাকি` : `Approx ${daysLeft} days until next period`}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '520px', margin: '0 auto 1.5rem auto' }}>
          {isFertilityMode
            ? (lang === 'bn'
              ? 'গর্ভধারণের জন্য ডিম্বাশয়ে প্রাকৃতিক প্রোজেস্টেরন তৈরি জরুরি। গরম পানি ও হালকা বিশ্রাম ডিম্বাণুর ইমপ্লান্টেশনে সাহায্য করে।'
              : 'Nurturing implantation window with optimal progesterone and gentle somatic pelvic blood flow.')
            : (lang === 'bn'
              ? 'শরীর এখন প্রজেস্টেরন হরমোন তৈরি করছে। এই সময়ে পর্যাপ্ত বিশ্রাম ও শান্তিদায়ক খাবার জরায়ুকে সুস্থ রাখে।'
              : 'Your body is nurturing the luteal phase. Gentle nutrition and rest will keep your uterine muscles relaxed.')}
        </p>

        {/* 2 Big Friendly Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <button
            className="btn-primary"
            onClick={() => onNavigate('log')}
            style={{ padding: '0.85rem 1.8rem', fontSize: '0.95rem' }}
          >
            <Heart size={17} />
            <span>{t.logTodayCTA}</span>
          </button>
          <button
            className="btn-secondary"
            onClick={onOpenSOS}
            style={{ padding: '0.85rem 1.4rem' }}
          >
            <Flame size={17} color="var(--accent-rose)" />
            <span>{t.quickSOSCTA}</span>
          </button>
        </div>
      </div>

      {/* 3 Soft Status Cards */}
      <div className="grid-3">
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.15rem' }}>
          <div className="card-icon-bubble" style={{ background: 'var(--accent-rose-soft)', color: 'var(--accent-rose)', width: '46px', height: '46px', minWidth: '46px', minHeight: '46px', flexShrink: 0, aspectRatio: '1 / 1' }}>
            <Droplets size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.bleedingCardTitle}</span>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{flowDesc}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.15rem' }}>
          <div className="card-icon-bubble" style={{ background: 'var(--accent-teal-soft)', color: 'var(--accent-teal)', width: '46px', height: '46px', minWidth: '46px', minHeight: '46px', flexShrink: 0, aspectRatio: '1 / 1' }}>
            <Smile size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.painCardTitle}</span>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{comfortDesc}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.15rem' }}>
          <div className="card-icon-bubble" style={{ background: 'var(--accent-amber-soft)', color: 'var(--accent-amber)', width: '46px', height: '46px', minWidth: '46px', minHeight: '46px', flexShrink: 0, aspectRatio: '1 / 1' }}>
            <Thermometer size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.thyroidCardTitle}</span>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{thyroidDesc}</div>
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
