// LocalStorage & Data Management Utility for EndoCura

import { createSampleCycleData, samplePatientProfile } from '../data/initialData';

const STORAGE_KEYS = {
  CYCLE_ENTRIES: 'endocura_cycle_entries_v1',
  PATIENT_PROFILE: 'endocura_patient_profile_v1',
  JOURNAL_ENTRIES: 'endocura_journal_v1',
  ACTIVE_THEME: 'endocura_theme_v1',
  SOS_CONTACT: 'endocura_sos_contact_v1',
  APP_SETTINGS: 'endocura_settings_v1'
};

export const defaultSettings = {
  focusMode: 'general', // 'general', 'fertility', 'pain'
  reminders: {
    thyroxinMorning: true,
    thyroxinTime: '06:30',
    hydration: true,
    hydrationIntervalHours: 2,
    magnesiumNight: true,
    magnesiumTime: '22:00'
  },
  pinLock: {
    enabled: false,
    pin: ''
  }
};

export const getStoredSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...defaultSettings,
        ...parsed,
        reminders: { ...defaultSettings.reminders, ...(parsed.reminders || {}) },
        pinLock: { ...defaultSettings.pinLock, ...(parsed.pinLock || {}) }
      };
    }
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  return defaultSettings;
};

export const saveStoredSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
};

export const getStoredEntries = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CYCLE_ENTRIES);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load stored cycle entries', err);
  }
  // Default to pre-populated clinical sample data
  const sample = createSampleCycleData();
  saveStoredEntries(sample);
  return sample;
};

export const saveStoredEntries = (entries) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CYCLE_ENTRIES, JSON.stringify(entries));
  } catch (err) {
    console.error('Failed to save cycle entries', err);
  }
};

export const getStoredProfile = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PATIENT_PROFILE);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...samplePatientProfile,
        ...parsed,
        bloodGroup: parsed.bloodGroup || 'B+',
        cycleLength: parsed.cycleLength || 28,
        pcosType: parsed.pcosType || 'Phenotype A (Classic Rotterdam)',
        adenoType: parsed.adenoType || 'Diffuse Posterior Myometrial Infiltration',
        thyroidStatus: parsed.thyroidStatus || 'Subclinical Hypothyroidism (Hashimoto\'s)',
        caregiverName: parsed.caregiverName || 'Saif Ahmed (Husband)',
        caregiverPhone: parsed.caregiverPhone || '+8801712345678'
      };
    }
  } catch (err) {
    console.error('Failed to load stored profile', err);
  }
  saveStoredProfile(samplePatientProfile);
  return samplePatientProfile;
};

export const saveStoredProfile = (profile) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PATIENT_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile', err);
  }
};

export const getStoredJournal = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  const defaultJournal = [
    {
      id: 'j-1',
      date: '2026-08-20',
      title: 'Dealing with the "It is just bad period pain" comment',
      emotion: 'Heard & Validated',
      content: 'A coworker casually said today: "Have you tried drinking ginger tea? I had cramps once and it went away." It took everything in me not to cry. Adenomyosis isn\'t normal cramps. It is endometrial tissue invading the muscular wall of my uterus. Today my bleeding score was 75, passing quarter-sized clots. I have to remind myself: my pain is not in my head. It is documented on my ultrasound, and I deserve gentle grace.',
      tags: ['Medical Gaslighting', 'Self-Compassion', 'Adenomyosis Truth']
    },
    {
      id: 'j-2',
      date: '2026-08-14',
      title: 'First confirmed ovulatory rise in 4 months',
      emotion: 'Hopeful',
      content: 'My BBT shifted from 36.3 to 36.75 and stayed up for 4 days straight! After 3 months of taking 40:1 Myo/D-chiro inositol and keeping my breakfast low-GI, my ovaries actually ovulated on their own. Small wins matter so much when dealing with PCOS.',
      tags: ['Ovulation Win', 'PCOS Progress', 'Inositol']
    }
  ];
  localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(defaultJournal));
  return defaultJournal;
};

export const saveStoredJournal = (journal) => {
  try {
    localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(journal));
  } catch (e) {
    console.error(e);
  }
};

export const getSOSContact = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SOS_CONTACT);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return {
    name: 'Partner / Caregiver',
    phone: '+8801700000000',
    message: 'Hello, I am having an acute Adenomyosis flare-up right now. The pelvic cramps and uterine heaviness are severe (NRS 8/10). Could you please bring me my heating pad and help with my prescribed pain medicine?'
  };
};

export const saveSOSContact = (contact) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SOS_CONTACT, JSON.stringify(contact));
  } catch (e) {
    console.error(e);
  }
};

export const exportAllDataJSON = () => {
  const data = {
    profile: getStoredProfile(),
    entries: getStoredEntries(),
    journal: getStoredJournal(),
    sosContact: getSOSContact(),
    settings: getStoredSettings(),
    exportedAt: new Date().toISOString(),
    version: '1.2'
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `EndoCura_Health_Backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importDataJSON = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (data.profile) saveStoredProfile(data.profile);
    if (data.entries && Array.isArray(data.entries)) saveStoredEntries(data.entries);
    if (data.journal) saveStoredJournal(data.journal);
    if (data.sosContact) saveSOSContact(data.sosContact);
    if (data.settings) saveStoredSettings(data.settings);
    return { success: true, data };
  } catch (err) {
    console.error('Import failed', err);
    return { success: false, error: err.message };
  }
};

export const resetToSampleData = () => {
  const sampleEntries = createSampleCycleData();
  saveStoredEntries(sampleEntries);
  saveStoredProfile(samplePatientProfile);
  saveStoredSettings(defaultSettings);
  return { entries: sampleEntries, profile: samplePatientProfile, settings: defaultSettings };
};

export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.CYCLE_ENTRIES);
  localStorage.removeItem(STORAGE_KEYS.PATIENT_PROFILE);
  localStorage.removeItem(STORAGE_KEYS.JOURNAL_ENTRIES);
  localStorage.removeItem(STORAGE_KEYS.SOS_CONTACT);
  localStorage.removeItem(STORAGE_KEYS.APP_SETTINGS);
};
