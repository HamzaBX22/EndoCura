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
            <Heart size={22} fill="white" />
          </div>
          <div>
            <div className="brand-title">
              {t.appTitle}
            </div>
            <div className="brand-subtitle">
              {t.activeCycleDay} {activeCycleDay} {t.ofCycle} {cycleLength}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="header-actions">
          {/* Profile & Settings Trigger */}
          <button
            className="btn-secondary header-btn"
            onClick={onOpenProfileSettings}
            title={t.profileSettings}
            style={{
              padding: '0.35rem 0.65rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              border: '1.5px solid var(--border-active)',
              background: 'var(--bg-surface-elevated)',
              flexShrink: 0
            }}
          >
            <div
              className="header-avatar-badge"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-rose), #ff859d)',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                aspectRatio: '1 / 1'
              }}
            >
              {profile?.name ? profile.name.charAt(0) : 'A'}
            </div>
            <span className="hide-on-mobile" style={{ fontSize: '0.82rem', fontWeight: 600, maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {firstName}
            </span>
            <Settings size={14} color="var(--text-muted)" className="hide-on-mobile" />
          </button>

          {/* Language Switch */}
          <button
            className="btn-secondary header-btn"
            onClick={toggleLanguage}
            title="Switch Language"
            style={{ flexShrink: 0, padding: '0.45rem 0.65rem' }}
          >
            <Globe size={15} />
            <span className="hide-on-mobile">{t.langToggle}</span>
          </button>

          {/* Pain SOS */}
          <button
            className="btn-sos-glow header-btn"
            onClick={onOpenSOS}
            title="Emergency Pain Flare Relief"
            style={{ flexShrink: 0, padding: '0.45rem 0.75rem' }}
          >
            <Flame size={15} />
            <span>SOS</span>
          </button>

          {/* Theme Toggle */}
          <button
            className="btn-secondary header-btn"
            onClick={toggleTheme}
            style={{ padding: '0.45rem 0.65rem', flexShrink: 0 }}
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
};
