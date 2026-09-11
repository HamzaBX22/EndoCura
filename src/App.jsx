import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { ClinicalTracker } from './components/ClinicalTracker';
import { CareHub } from './components/CareHub';
import { DoctorDossier } from './components/DoctorDossier';
import { PainSOSModal } from './components/PainSOSModal';
import { PartnerCardModal } from './components/PartnerCardModal';
import { MonthlyPetalCalendar } from './components/MonthlyPetalCalendar';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';
import { PinLockScreen } from './components/PinLockScreen';
import {
  getStoredEntries,
  saveStoredEntries,
  getStoredProfile,
  getStoredSettings,
  saveStoredSettings
} from './utils/storage';
import { Heart } from 'lucide-react';

export function App() {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('endocura_lang_v1') || 'bn';
  });
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('today'); // 'today', 'log', 'care', 'report'
  const [entries, setEntries] = useState([]);
  const [profile, setProfile] = useState(getStoredProfile());
  const [settings, setSettings] = useState(getStoredSettings());
  const [activeDate, setActiveDate] = useState(new Date().toISOString().split('T')[0]);

  // Modal States
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isPartnerOpen, setIsPartnerOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isFertilityMode, setIsFertilityMode] = useState(false);

  useEffect(() => {
    const loaded = getStoredEntries();
    setEntries(loaded);
    const prof = getStoredProfile();
    setProfile(prof);
    const st = getStoredSettings();
    setSettings(st);
    if (st.focusMode === 'fertility') {
      setIsFertilityMode(true);
    }
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const handleSaveEntry = (updatedEntry) => {
    const existingIndex = entries.findIndex(e => e.date === updatedEntry.date);
    let nextEntries = [];
    if (existingIndex >= 0) {
      nextEntries = [...entries];
      nextEntries[existingIndex] = updatedEntry;
    } else {
      nextEntries = [...entries, updatedEntry];
    }
    setEntries(nextEntries);
    saveStoredEntries(nextEntries);
  };

  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
    if (newSettings.focusMode === 'fertility') {
      setIsFertilityMode(true);
    } else if (newSettings.focusMode === 'general') {
      setIsFertilityMode(false);
    }
  };

  const latestEntry = entries[entries.length - 1] || {};
  const activeCycleDay = latestEntry.cycleDay || 18;
  const painRating = latestEntry.pain?.nrsScore || 3;

  return (
    <div className="app-container">
      {/* Feminine Minimalist Header with Profile & Settings Trigger */}
      <Header
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenProfileSettings={() => setIsProfileSettingsOpen(true)}
        profile={profile}
        activeCycleDay={activeCycleDay}
        cycleLength={profile.cycleLength || 28}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Streamlined 4-Tab Navigation */}
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lang={lang}
        />

        {/* 1. Today Dashboard */}
        {activeTab === 'today' && (
          <Dashboard
            profile={profile}
            entries={entries}
            onNavigate={setActiveTab}
            onOpenSOS={() => setIsSOSOpen(true)}
            onOpenCalendar={() => setIsCalendarOpen(true)}
            onOpenPartner={() => setIsPartnerOpen(true)}
            isFertilityMode={isFertilityMode}
            setIsFertilityMode={(val) => {
              setIsFertilityMode(val);
              handleUpdateSettings({
                ...settings,
                focusMode: val ? 'fertility' : 'general'
              });
            }}
            lang={lang}
          />
        )}

        {/* 2. Easy Tap Daily Log with Voice Logging */}
        {activeTab === 'log' && (
          <ClinicalTracker
            entries={entries}
            onSaveEntry={handleSaveEntry}
            activeDate={activeDate}
            setActiveDate={setActiveDate}
            lang={lang}
          />
        )}

        {/* 3. Care & Healing Hub (Roadmap, Deshi Foods, Somatics) */}
        {activeTab === 'care' && (
          <CareHub
            lang={lang}
          />
        )}

        {/* 4. One-Click Doctor Dossier & Medical Vault */}
        {activeTab === 'report' && (
          <DoctorDossier
            profile={profile}
            entries={entries}
            lang={lang}
          />
        )}
      </main>

      {/* Emergency Pain SOS Modal */}
      <PainSOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        lang={lang}
      />

      {/* Feature 1: Partner / Husband Care Card Modal */}
      <PartnerCardModal
        isOpen={isPartnerOpen}
        onClose={() => setIsPartnerOpen(false)}
        cycleDay={activeCycleDay}
        painRating={painRating}
        patientName={profile.name}
        lang={lang}
      />

      {/* Feature 3: Monthly Petal Calendar Modal */}
      <MonthlyPetalCalendar
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        entries={entries}
        activeDate={activeDate}
        onSelectDate={(newDate) => {
          setActiveDate(newDate);
          setActiveTab('log');
        }}
        lang={lang}
      />

      {/* Feature: Profile & Settings Modal */}
      <ProfileSettingsModal
        isOpen={isProfileSettingsOpen}
        onClose={() => setIsProfileSettingsOpen(false)}
        profile={profile}
        onUpdateProfile={(updated) => setProfile(updated)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        theme={theme}
        setTheme={setTheme}
        lang={lang}
        setLang={setLang}
        onLockApp={() => setIsLocked(true)}
      />

      {/* Privacy PIN Lock Screen */}
      {isLocked && (
        <PinLockScreen
          correctPin={settings.pinLock?.pin || '1234'}
          onUnlock={() => setIsLocked(false)}
          onResetPin={() => {
            const updated = {
              ...settings,
              pinLock: { enabled: false, pin: '' }
            };
            handleUpdateSettings(updated);
            setIsLocked(false);
          }}
          lang={lang}
        />
      )}

      {/* Soft Female Health Disclaimer Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }} className="no-print">
        <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-rose)', fontWeight: 700 }}>
            <Heart size={16} fill="var(--accent-rose)" />
            {lang === 'bn' ? 'এন্ডোকিউরা (EndoCura) • সহজ ও নিরাপদ নারী স্বাস্থ্য সঙ্গী' : 'EndoCura • Gentle & Safe Women’s Health Companion'}
          </div>
          <p>
            {lang === 'bn'
              ? 'আপনার ব্যক্তিগত স্বাস্থ্য তথ্য সম্পূর্ণ নিরাপদ ও আপনার ফোনেই সংরক্ষিত থাকে। তীব্র রক্তক্ষরণ বা অসহ্য যন্ত্রণায় নিকটস্থ হাসপাতালে যোগাযোগ করুন।'
              : 'Your health data is 100% private and stays on your device. Seek immediate hospital care for acute hemorrhage or emergency symptoms.'}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
