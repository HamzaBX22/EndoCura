import React from 'react';
import { Flame, Moon, Sun, Globe, Heart, Settings, User } from 'lucide-react';
import { translations } from '../data/translations';

export const Header = ({
  lang = 'bn',
  setLang,
  theme,
  setTheme,
  onOpenSOS,
  onOpenProfileSettings,
  profile,
  activeCycleDay = 18,
  cycleLength = 28
}) => {
  const t = translations[lang] || translations.bn;

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'bn' ? 'en' : 'bn';
    setLang(nextLang);
    localStorage.setItem('endocura_lang_v1', nextLang);
  };

  const firstName = profile?.name ? profile.name.split(' ')[0] : (lang === 'bn' ? 'প্রোফাইল' : 'Profile');

  return (
    <header className="header-glass">
      <div className="header-inner">
        {/* Brand Group */}
        <div className="logo-group">
          <div className="logo-badge" title="EndoCura">
            <Heart size={20} fill="white" />
          </div>
          <div>
            <div className="brand-title">
              {t.appTitle}
            </div>
            <div className="brand-subtitle hide-on-mobile">
              {t.activeCycleDay} {activeCycleDay} {t.ofCycle} {cycleLength}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="header-actions">
          {/* Language Switch Pill */}
          <button
            className="btn-secondary header-btn lang-pill-btn"
            onClick={toggleLanguage}
            title={lang === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
            style={{
              flexShrink: 0,
              padding: '0.35rem 0.6rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface-elevated)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Globe size={13} color="var(--accent-rose)" />
            <span>{lang === 'bn' ? 'EN' : 'বাং'}</span>
          </button>

          {/* Pain Flare SOS */}
          <button
            className="btn-sos-glow header-btn"
            onClick={onOpenSOS}
            title="Emergency Pain Flare Relief"
            style={{
              flexShrink: 0,
              padding: '0.35rem 0.65rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              boxShadow: '0 2px 10px rgba(255, 77, 106, 0.35)'
            }}
          >
            <Flame size={14} />
            <span>SOS</span>
          </button>

          {/* Profile & Settings Trigger */}
          <button
            className="header-avatar-btn"
            onClick={onOpenProfileSettings}
            title={t.profileSettings}
            style={{
              flexShrink: 0,
              padding: 0,
              border: 'none',
              background: 'transparent',
              display: 'inline-flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <div
              className="header-avatar-badge"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-rose), #ff859d)',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '2px solid rgba(255, 255, 255, 0.9)',
                boxShadow: '0 2px 8px rgba(255, 101, 132, 0.25)'
              }}
            >
              {profile?.name ? profile.name.charAt(0) : 'A'}
            </div>
          </button>

          {/* Theme Toggle (Desktop Only - Mobile accesses via Profile & Settings) */}
          <button
            className="btn-secondary header-btn hide-on-mobile"
            onClick={toggleTheme}
            style={{ padding: '0.4rem 0.55rem', flexShrink: 0 }}
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
};
