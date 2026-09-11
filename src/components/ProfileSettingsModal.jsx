import React, { useState, useRef } from 'react';
import {
  User,
  Settings,
  X,
  CheckCircle2,
  Heart,
  Activity,
  Droplets,
  Bell,
  Lock,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Calendar,
  Phone,
  Stethoscope,
  Baby,
  Flame,
  Shield,
  Moon,
  Sun,
  Globe,
  Sparkles
} from 'lucide-react';
import { translations } from '../data/translations';
import {
  saveStoredProfile,
  saveStoredSettings,
  exportAllDataJSON,
  importDataJSON,
  resetToSampleData,
  clearAllData
} from '../utils/storage';

export const ProfileSettingsModal = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  settings,
  onUpdateSettings,
  theme,
  setTheme,
  lang,
  setLang,
  onLockApp
}) => {
  if (!isOpen) return null;

  const t = translations[lang] || translations.bn;
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'settings'

  // Profile Form Local State
  const [formData, setFormData] = useState({
    name: profile.name || 'Anika Rahman',
    age: profile.age || 29,
    bloodGroup: profile.bloodGroup || 'B+',
    heightCm: profile.heightCm || 162,
    weightKg: profile.weightKg || 68,
    pcosType: profile.pcosType || 'Phenotype A (Classic Rotterdam)',
    adenoType: profile.adenoType || 'Diffuse Posterior Myometrial Infiltration',
    thyroidStatus: profile.thyroidStatus || 'Subclinical Hypothyroidism (Hashimoto\'s)',
    cycleLength: profile.cycleLength || 28,
    physicianName: profile.physicianName || 'Dr. Nusrat Chowdhury, FCPS (OB/GYN)',
    clinicName: profile.clinicName || 'Women’s Reproductive & Endocrine Center',
    caregiverName: profile.caregiverName || 'Saif Ahmed (Husband)',
    caregiverPhone: profile.caregiverPhone || '+8801712345678'
  });

  // Settings Local State
  const [localSettings, setLocalSettings] = useState(settings);
  const [saveToast, setSaveToast] = useState(false);
  const [pinInput, setPinInput] = useState(settings?.pinLock?.pin || '1234');
  const fileInputRef = useRef(null);

  // Auto calculate BMI
  const heightM = (Number(formData.heightCm) || 160) / 100;
  const weightKg = Number(formData.weightKg) || 65;
  const calculatedBmi = (weightKg / (heightM * heightM)).toFixed(1);

  const getBmiStatus = (bmiVal) => {
    const num = parseFloat(bmiVal);
    if (num < 18.5) return { label: lang === 'bn' ? 'ওজন কম' : 'Underweight', color: 'var(--accent-amber)' };
    if (num <= 24.9) return { label: lang === 'bn' ? 'স্বাভাবিক ও সুস্থ' : 'Healthy Normal', color: 'var(--accent-teal)' };
    if (num <= 29.9) return { label: lang === 'bn' ? 'হালকা বেশি (ওজন ব্যবস্থাপনা সহায়ক)' : 'Overweight', color: 'var(--accent-amber)' };
    return { label: lang === 'bn' ? 'স্থূলতা (মেটাবলিক ব্যালেন্স জরুরি)' : 'Obese', color: 'var(--accent-rose)' };
  };

  const bmiStatus = getBmiStatus(calculatedBmi);

  // Handle Profile Save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...profile,
      ...formData,
      age: Number(formData.age),
      heightCm: Number(formData.heightCm),
      weightKg: Number(formData.weightKg),
      bmi: parseFloat(calculatedBmi),
      cycleLength: Number(formData.cycleLength)
    };
    saveStoredProfile(updated);
    onUpdateProfile(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // Handle Settings Update
  const handleSettingChange = (key, val) => {
    const next = { ...localSettings, [key]: val };
    setLocalSettings(next);
    saveStoredSettings(next);
    onUpdateSettings(next);
  };

  const handleReminderChange = (reminderKey, val) => {
    const next = {
      ...localSettings,
      reminders: {
        ...localSettings.reminders,
        [reminderKey]: val
      }
    };
    setLocalSettings(next);
    saveStoredSettings(next);
    onUpdateSettings(next);
  };

  const handleTogglePinLock = (enabled) => {
    const next = {
      ...localSettings,
      pinLock: {
        enabled,
        pin: pinInput || '1234'
      }
    };
    setLocalSettings(next);
    saveStoredSettings(next);
    onUpdateSettings(next);
  };

  const handleUpdatePinCode = (newPin) => {
    setPinInput(newPin);
    if (newPin.length === 4) {
      const next = {
        ...localSettings,
        pinLock: {
          ...localSettings.pinLock,
          pin: newPin
        }
      };
      setLocalSettings(next);
      saveStoredSettings(next);
      onUpdateSettings(next);
    }
  };

  // Notification Test
  const handleTestNotification = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification(lang === 'bn' ? 'এন্ডোকিউরা স্বাস্থ্য রিমাইন্ডার' : 'EndoCura Health Reminder', {
          body: lang === 'bn' ? 'সকালের থাইরক্সিন ওষুধ খালি পেটে ১ গ্লাস পানির সাথে গ্রহণ করুন।' : 'Remember to take morning Levothyroxine on an empty stomach with a full glass of water.',
          icon: '/favicon.ico'
        });
      } else {
        alert(lang === 'bn' ? 'ব্রাউজার নোটিফিকেশন অনুমোদিত নয়। অনুগ্রহ করে নোটিফিকেশন পারমিশন অন করুন।' : 'Browser notifications not granted. Please allow notification permissions.');
      }
    } else {
      alert(lang === 'bn' ? 'আপনার ব্রাউজার পুশ নোটিফিকেশন সাপোর্ট করে না।' : 'Your browser does not support web notifications.');
    }
  };

  // JSON Import
  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = importDataJSON(event.target.result);
      if (res.success) {
        alert(lang === 'bn' ? 'ব্যাকআপ সফলভাবে রিস্টোর হয়েছে! পেজ রিলোড হচ্ছে।' : 'Backup restored successfully! Reloading.');
        window.location.reload();
      } else {
        alert(lang === 'bn' ? 'ব্যাকআপ ফাইলটি সঠিক নয়।' : 'Invalid backup file format.');
      }
    };
    reader.readAsText(file);
  };

  // Reset to sample data
  const handleResetData = () => {
    if (window.confirm(lang === 'bn' ? 'আপনি কি ক্লিনিক্যাল নমুনা ডাটা পুনরায় লোড করতে চান?' : 'Reset to sample clinical dataset?')) {
      resetToSampleData();
      window.location.reload();
    }
  };

  // Clear all data
  const handleClearAll = () => {
    if (window.confirm(lang === 'bn' ? 'সতর্কতা: আপনার সকল তথ্য মুছে যাবে। আপনি কি নিশ্চিত?' : 'WARNING: All stored health data will be permanently cleared. Proceed?')) {
      clearAllData();
      window.location.reload();
    }
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
        padding: '1rem',
        animation: 'fadeIn 0.25s ease'
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: '740px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
          background: 'var(--bg-surface)'
        }}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-surface-elevated)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-rose), #ff8ea3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: 'var(--shadow-rose)'
              }}
            >
              {formData.name.charAt(0) || 'A'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
                {t.profileSettings}
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {formData.name} • {formData.age} {lang === 'bn' ? 'বছর' : 'yrs'} ({formData.bloodGroup})
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              borderRadius: '50%',
              background: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '0.5rem 1.75rem',
            gap: '1rem',
            background: 'var(--bg-surface)'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '0.65rem 1rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: activeTab === 'profile' ? 'var(--accent-rose)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'profile' ? '2.5px solid var(--accent-rose)' : '2.5px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'var(--transition)'
            }}
          >
            <User size={16} />
            <span>{t.profileTab}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '0.65rem 1rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: activeTab === 'settings' ? 'var(--accent-rose)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'settings' ? '2.5px solid var(--accent-rose)' : '2.5px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'var(--transition)'
            }}
          >
            <Settings size={16} />
            <span>{t.settingsTab}</span>
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1 }}>
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Section 1: Personal Demographics */}
              <div>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <User size={17} color="var(--accent-rose)" />
                  {t.personalInfo}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {/* Name */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                      {t.patientName}
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-surface-elevated)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                      {t.patientAge}
                    </label>
                    <input
                      type="number"
                      min="12"
                      max="65"
                      value={formData.age}
                      onChange={e => setFormData({ ...formData, age: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-surface-elevated)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  {/* Blood Group */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                      {t.bloodGroup}
                    </label>
                    <select
                      value={formData.bloodGroup}
                      onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-surface-elevated)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem'
                      }}
                    >
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Height, Weight & Calculated BMI */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                      {t.height}
                    </label>
                    <input
                      type="number"
                      min="100"
                      max="220"
                      value={formData.heightCm}
                      onChange={e => setFormData({ ...formData, heightCm: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-surface-elevated)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                      {t.weight}
                    </label>
                    <input
                      type="number"
                      min="30"
                      max="180"
                      value={formData.weightKg}
                      onChange={e => setFormData({ ...formData, weightKg: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-surface-elevated)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                      {t.calculatedBmi}
                    </label>
                    <div
                      style={{
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-surface-soft)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.9rem'
                      }}
                    >
                      <strong>{calculatedBmi}</strong>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: bmiStatus.color }}>
                        {bmiStatus.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Clinical Diagnoses & Triad Profile */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <Activity size={17} color="var(--accent-plum)" />
                  {t.clinicalConditions}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* PCOS Phenotype */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                      {t.pcosPhenotype}
                    </label>
                    <select
                      value={formData.pcosType}
                      onChange={e => setFormData({ ...formData, pcosType: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-surface-elevated)',
                        color: 'var(--text-primary)',
                        fontSize: '0.86rem'
                      }}
                    >
                      <option value="Phenotype A (Classic Rotterdam)">Phenotype A (Classic - High Androgens + Irregular Cycles + Polycystic Ovaries)</option>
                      <option value="Phenotype B (Hyperandrogenic Anovulation)">Phenotype B (High Androgens + Irregular Cycles, normal ovaries)</option>
                      <option value="Phenotype C (Ovulatory PCOS)">Phenotype C (High Androgens + Polycystic Ovaries, regular periods)</option>
                      <option value="Phenotype D (Non-Androgenic PCOS)">Phenotype D (Irregular Cycles + Polycystic Ovaries, normal androgens)</option>
                      <option value="Suspected / Under Diagnosis">Suspected / Under Evaluation</option>
                    </select>
                  </div>

                  {/* Adenomyosis Status */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                      {t.adenoStatus}
                    </label>
                    <input
                      type="text"
                      value={formData.adenoType}
                      onChange={e => setFormData({ ...formData, adenoType: e.target.value })}
                      placeholder="e.g. Diffuse Posterior Myometrial Infiltration"
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-surface-elevated)',
                        color: 'var(--text-primary)',
                        fontSize: '0.86rem'
                      }}
                    />
                  </div>

                  {/* Thyroid Status */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                      {t.thyroidStatus}
                    </label>
                    <input
                      type="text"
                      value={formData.thyroidStatus}
                      onChange={e => setFormData({ ...formData, thyroidStatus: e.target.value })}
                      placeholder="e.g. Subclinical Hypothyroidism / Elevated TSH"
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-surface-elevated)',
                        color: 'var(--text-primary)',
                        fontSize: '0.86rem'
                      }}
                    />
                  </div>

                  {/* Average Cycle Length */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                      {t.cycleLengthLabel}
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <input
                        type="range"
                        min="21"
                        max="45"
                        value={formData.cycleLength}
                        onChange={e => setFormData({ ...formData, cycleLength: Number(e.target.value) })}
                        style={{ flex: 1, accentColor: 'var(--accent-rose)' }}
                      />
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', minWidth: '55px', color: 'var(--accent-rose)' }}>
                        {formData.cycleLength} {lang === 'bn' ? 'দিন' : 'days'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Physician & Caregiver Contacts */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <Stethoscope size={17} color="var(--accent-teal)" />
                  {t.doctorCaregiver}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                      {t.doctorName}
                    </label>
                    <input
                      type="text"
                      value={formData.physicianName}
                      onChange={e => setFormData({ ...formData, physicianName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-surface-elevated)',
                        color: 'var(--text-primary)',
                        fontSize: '0.86rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                      {t.clinicName}
                    </label>
                    <input
                      type="text"
                      value={formData.clinicName}
                      onChange={e => setFormData({ ...formData, clinicName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-surface-elevated)',
                        color: 'var(--text-primary)',
                        fontSize: '0.86rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                      {t.caregiverName}
                    </label>
                    <input
                      type="text"
                      value={formData.caregiverName}
                      onChange={e => setFormData({ ...formData, caregiverName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-surface-elevated)',
                        color: 'var(--text-primary)',
                        fontSize: '0.86rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                      {t.caregiverPhone}
                    </label>
                    <input
                      type="tel"
                      value={formData.caregiverPhone}
                      onChange={e => setFormData({ ...formData, caregiverPhone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-surface-elevated)',
                        color: 'var(--text-primary)',
                        fontSize: '0.86rem'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Save Profile Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    padding: '0.75rem 1.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <CheckCircle2 size={17} />
                  <span>{t.saveProfile}</span>
                </button>

                {saveToast && (
                  <span style={{ color: 'var(--accent-teal)', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle2 size={16} />
                    {t.profileSaved}
                  </span>
                )}
              </div>
            </form>
          )}

          {/* TAB 2: SETTINGS */}
          {activeTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {/* 1. App Tracking Focus Mode */}
              <div>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Sparkles size={17} color="var(--accent-rose)" />
                  {t.trackingFocusTitle}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                  {/* General */}
                  <div
                    onClick={() => handleSettingChange('focusMode', 'general')}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      background: localSettings.focusMode === 'general' ? 'var(--accent-rose-soft)' : 'var(--bg-surface-elevated)',
                      border: `1.5px solid ${localSettings.focusMode === 'general' ? 'var(--accent-rose)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      {t.focusGeneral}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {t.focusGeneralDesc}
                    </p>
                  </div>

                  {/* Fertility */}
                  <div
                    onClick={() => handleSettingChange('focusMode', 'fertility')}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      background: localSettings.focusMode === 'fertility' ? 'var(--accent-amber-soft)' : 'var(--bg-surface-elevated)',
                      border: `1.5px solid ${localSettings.focusMode === 'fertility' ? 'var(--accent-amber)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      {t.focusFertility}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {t.focusFertilityDesc}
                    </p>
                  </div>

                  {/* Pain Focus */}
                  <div
                    onClick={() => handleSettingChange('focusMode', 'pain')}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      background: localSettings.focusMode === 'pain' ? '#ffebee' : 'var(--bg-surface-elevated)',
                      border: `1.5px solid ${localSettings.focusMode === 'pain' ? 'var(--accent-crimson)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      {t.focusPain}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {t.focusPainDesc}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Daily Reminders */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <Bell size={17} color="var(--accent-amber)" />
                  {t.dailyRemindersTitle}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Thyroxin */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t.remindThyroxin}</div>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        {lang === 'bn' ? 'সকাল ৬:৩০ মিনিটে খালি পেটে' : 'Default 06:30 AM before breakfast'}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={localSettings.reminders?.thyroxinMorning ?? true}
                      onChange={e => handleReminderChange('thyroxinMorning', e.target.checked)}
                      style={{ width: '20px', height: '20px', accentColor: 'var(--accent-rose)', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Hydration */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t.remindHydration}</div>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        {lang === 'bn' ? 'প্রতিদিন ৮ গ্লাস (২.০ লিটার) পানি পান নিশ্চিত করুন' : 'Ensures 8 glasses (2.0L) hydration goal'}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={localSettings.reminders?.hydration ?? true}
                      onChange={e => handleReminderChange('hydration', e.target.checked)}
                      style={{ width: '20px', height: '20px', accentColor: 'var(--accent-rose)', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Magnesium */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t.remindMagnesium}</div>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        {lang === 'bn' ? 'রাত ১০:০০ টায় মায়োমেট্রিয়াল রিল্যাক্সেশন' : '10:00 PM for uterine muscle relaxation'}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={localSettings.reminders?.magnesiumNight ?? true}
                      onChange={e => handleReminderChange('magnesiumNight', e.target.checked)}
                      style={{ width: '20px', height: '20px', accentColor: 'var(--accent-rose)', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Notification permission test button */}
                  <div>
                    <button
                      type="button"
                      onClick={handleTestNotification}
                      className="btn-secondary"
                      style={{ fontSize: '0.82rem', padding: '0.5rem 0.9rem' }}
                    >
                      <Bell size={14} />
                      <span>{t.testAlertBtn}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Privacy & PIN Lock */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <Lock size={17} color="var(--accent-rose)" />
                  {t.privacyPinTitle}
                </h3>

                <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t.enablePinLock}</div>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        {lang === 'bn' ? 'অ্যাপ লক থাকলে ৪-ডিজিট পিন ছাড়া ডাটা দেখা যাবে না' : 'Requires 4-digit code to access app'}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={localSettings.pinLock?.enabled || false}
                      onChange={e => handleTogglePinLock(e.target.checked)}
                      style={{ width: '20px', height: '20px', accentColor: 'var(--accent-rose)', cursor: 'pointer' }}
                    />
                  </div>

                  {localSettings.pinLock?.enabled && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {t.enterPinCode}:
                      </label>
                      <input
                        type="password"
                        maxLength="4"
                        value={pinInput}
                        onChange={e => handleUpdatePinCode(e.target.value.replace(/\D/g, ''))}
                        style={{
                          width: '100px',
                          padding: '0.5rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1.5px solid var(--accent-rose)',
                          textAlign: 'center',
                          fontSize: '1.1rem',
                          letterSpacing: '0.3em',
                          fontWeight: 700
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          if (onLockApp) onLockApp();
                        }}
                        className="btn-secondary"
                        style={{ padding: '0.5rem 0.9rem', fontSize: '0.82rem', color: 'var(--accent-rose)' }}
                      >
                        <Lock size={14} />
                        <span>{t.lockNowBtn}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Display & Language Switches */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <Globe size={17} color="var(--accent-teal)" />
                  {lang === 'bn' ? 'ভাষা ও ডিসপ্লে মোড' : 'Language & Display Mode'}
                </h3>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const next = lang === 'bn' ? 'en' : 'bn';
                      setLang(next);
                      localStorage.setItem('endocura_lang_v1', next);
                    }}
                    className="btn-secondary"
                    style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}
                  >
                    <Globe size={16} />
                    <span>{lang === 'bn' ? 'English এ পরিবর্তন করুন' : 'Switch to বাংলা'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const nextTheme = theme === 'dark' ? 'light' : 'dark';
                      setTheme(nextTheme);
                      document.documentElement.setAttribute('data-theme', nextTheme);
                    }}
                    className="btn-secondary"
                    style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}
                  >
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    <span>{theme === 'dark' ? (lang === 'bn' ? 'নরম গোলাপি ডে মোড' : 'Soft Rose Light') : (lang === 'bn' ? 'শান্ত ডার্ক নাইট মোড' : 'Calm Dark Mode')}</span>
                  </button>
                </div>
              </div>

              {/* 5. Data Management & Backup */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <Shield size={17} color="var(--accent-plum)" />
                  {t.dataManagementTitle}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  {/* Export JSON */}
                  <button
                    type="button"
                    onClick={exportAllDataJSON}
                    className="btn-secondary"
                    style={{ padding: '0.7rem 1rem', justifyContent: 'center' }}
                  >
                    <Download size={15} />
                    <span>{t.downloadBackup}</span>
                  </button>

                  {/* Import JSON */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-secondary"
                    style={{ padding: '0.7rem 1rem', justifyContent: 'center' }}
                  >
                    <Upload size={15} />
                    <span>{t.restoreBackup}</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".json"
                    onChange={handleFileImport}
                    style={{ display: 'none' }}
                  />

                  {/* Reset to sample */}
                  <button
                    type="button"
                    onClick={handleResetData}
                    className="btn-secondary"
                    style={{ padding: '0.7rem 1rem', justifyContent: 'center', color: 'var(--accent-amber)' }}
                  >
                    <RefreshCw size={15} />
                    <span>{t.resetSample}</span>
                  </button>

                  {/* Clear all */}
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="btn-secondary"
                    style={{ padding: '0.7rem 1rem', justifyContent: 'center', color: 'var(--accent-crimson)' }}
                  >
                    <Trash2 size={15} />
                    <span>{t.clearAllData}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
