import React, { useState, useEffect } from 'react';
import {
  Heart,
  Droplets,
  Smile,
  Meh,
  Frown,
  AlertCircle,
  CheckCircle2,
  Save,
  Sparkles,
  Mic,
  MicOff,
  Volume2
} from 'lucide-react';
import { translations } from '../data/translations';
import { VoiceLogger } from '../utils/voiceParser';

export const ClinicalTracker = ({
  entries = [],
  onSaveEntry,
  activeDate,
  setActiveDate,
  lang = 'bn'
}) => {
  const t = translations[lang] || translations.bn;
  const currentDateStr = activeDate || new Date().toISOString().split('T')[0];
  const existing = entries.find(e => e.date === currentDateStr) || {};

  // Form State
  const [flowLevel, setFlowLevel] = useState(() => {
    const pbac = (existing.bleeding?.padsSaturated || 0) * 20 + (existing.bleeding?.padsModerate || 0) * 5;
    if (existing.bleeding?.clotsLarge > 0 || existing.bleeding?.floodingEpisodes > 0) return 'clots';
    if (pbac >= 40) return 'heavy';
    if (pbac >= 15) return 'medium';
    return 'light';
  });

  const [painRating, setPainRating] = useState(existing.pain?.nrsScore || 2);
  const [coldHands, setColdHands] = useState(existing.coldExtremities || false);
  const [morningFatigue, setMorningFatigue] = useState(existing.thyroidFatigue || false);
  const [sugarCraving, setSugarCraving] = useState(existing.sugarCrash || false);
  const [tookMeds, setTookMeds] = useState(existing.supplementsTaken !== undefined ? existing.supplementsTaken : true);
  const [notes, setNotes] = useState(existing.notes || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Voice Logging State
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(true);

  const [voiceLogger, setVoiceLogger] = useState(null);

  useEffect(() => {
    const logger = new VoiceLogger(
      (transcript, parsed) => {
        setIsListening(false);
        setVoiceTranscript(transcript);
        setNotes(prev => prev ? `${prev} | ${transcript}` : transcript);

        // Apply recognized symptoms
        if (parsed.flowLevel) setFlowLevel(parsed.flowLevel);
        if (parsed.painRating !== null) setPainRating(parsed.painRating);
        if (parsed.coldHands) setColdHands(true);
        if (parsed.morningFatigue) setMorningFatigue(true);
        if (parsed.sugarCraving) setSugarCraving(true);
        if (parsed.tookMeds) setTookMeds(true);
      },
      (err) => {
        setIsListening(false);
        console.warn('Voice error:', err);
      }
    );
    setVoiceSupported(logger.supported);
    setVoiceLogger(logger);
  }, []);

  const toggleVoice = () => {
    if (!voiceLogger) return;
    if (isListening) {
      voiceLogger.stopListening();
      setIsListening(false);
    } else {
      setVoiceTranscript('');
      setIsListening(true);
      voiceLogger.startListening(lang);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    let bleeding = {
      padsLight: 0,
      padsModerate: 0,
      padsSaturated: 0,
      tamponsLight: 0,
      tamponsModerate: 0,
      tamponsSaturated: 0,
      clotsSmall: 0,
      clotsLarge: 0,
      floodingEpisodes: 0
    };

    if (flowLevel === 'light') {
      bleeding.padsLight = 2;
    } else if (flowLevel === 'medium') {
      bleeding.padsModerate = 3;
    } else if (flowLevel === 'heavy') {
      bleeding.padsModerate = 2;
      bleeding.padsSaturated = 2;
    } else if (flowLevel === 'clots') {
      bleeding.padsSaturated = 3;
      bleeding.clotsLarge = 2;
      bleeding.floodingEpisodes = 1;
    }

    const payload = {
      date: currentDateStr,
      cycleDay: existing.cycleDay || 18,
      bleeding,
      pain: {
        nrsScore: painRating,
        quality: painRating > 5 ? ['Severe Cramping', 'Dragging Heaviness'] : ['Mild Discomfort'],
        radiation: painRating > 5 ? ['lowerBack', 'innerThighs'] : [],
        dyspareunia: false,
        dyschezia: flowLevel === 'clots',
        triggers: []
      },
      morningTemp: coldHands ? 36.1 : 36.4,
      bbt: painRating > 5 ? 36.75 : 36.35,
      cervicalMucus: flowLevel !== 'none' ? 'bleeding' : 'creamy',
      coldExtremities: coldHands,
      thyroidFatigue: morningFatigue,
      tookThyroxin: tookMeds,
      sugarCrash: sugarCraving,
      supplementsTaken: tookMeds,
      notes
    };

    onSaveEntry(payload);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '780px', margin: '0 auto' }}>
      {/* Friendly Header & Voice Microphone Banner */}
      <div className="glass-card" style={{ textAlign: 'center', padding: '1.75rem 1.25rem' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
          🌸 {t.trackerHeading}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          {t.trackerSub}
        </p>

        {/* Bangla Voice Logging Button */}
        {voiceSupported && (
          <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={toggleVoice}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.75rem 1.4rem',
                borderRadius: 'var(--radius-full)',
                background: isListening ? 'linear-gradient(135deg, #ff2a4b, #ff758c)' : 'var(--accent-rose-soft)',
                border: `1.5px solid ${isListening ? '#ff2a4b' : 'var(--accent-rose)'}`,
                color: isListening ? '#ffffff' : 'var(--accent-rose)',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                boxShadow: isListening ? '0 0 20px rgba(255, 42, 75, 0.4)' : 'none',
                transition: 'var(--transition)'
              }}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              <span>
                {isListening
                  ? (lang === 'bn' ? 'শুনছি... মুখে বলুন (Listening...)' : 'Listening...')
                  : (lang === 'bn' ? 'বাংলায় মুখে বলে অটো-লগ করুন 🎙️' : 'Voice Log Symptoms 🎙️')}
              </span>
            </button>

            {isListening && (
              <span style={{ fontSize: '0.78rem', color: 'var(--accent-rose)', fontStyle: 'italic', animation: 'pulse 1.5s infinite' }}>
                {lang === 'bn' ? 'উদাহরণ: "আজ পেটে খুব ব্যথা আর হাত-পা ঠান্ডা"' : 'e.g. "I have severe cramps and cold hands today"'}
              </span>
            )}

            {voiceTranscript && (
              <div style={{ fontSize: '0.82rem', color: 'var(--accent-teal)', background: 'var(--accent-teal-soft)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(46, 196, 182, 0.3)' }}>
                <strong>{lang === 'bn' ? 'শনাক্ত হয়েছে:' : 'Detected:'}</strong> "{voiceTranscript}"
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', background: 'var(--bg-surface-soft)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-rose)' }}>{t.trackingDate}</span>
          <input
            type="date"
            value={currentDateStr}
            onChange={(e) => setActiveDate(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              fontFamily: 'inherit',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>

      {/* 1. Bleeding Flow Cards */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          🩸 {t.flowSectionTitle}
        </h3>

        <div className="flow-card-grid">
          <div
            className={`flow-tap-card ${flowLevel === 'light' ? 'selected' : ''}`}
            onClick={() => setFlowLevel('light')}
          >
            <span style={{ fontSize: '1.6rem' }}>💧</span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{t.flowLight}</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.flowLightDesc}</span>
          </div>

          <div
            className={`flow-tap-card ${flowLevel === 'medium' ? 'selected' : ''}`}
            onClick={() => setFlowLevel('medium')}
          >
            <span style={{ fontSize: '1.6rem' }}>🩸</span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{t.flowMedium}</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.flowMediumDesc}</span>
          </div>

          <div
            className={`flow-tap-card ${flowLevel === 'heavy' ? 'selected' : ''}`}
            onClick={() => setFlowLevel('heavy')}
          >
            <span style={{ fontSize: '1.6rem' }}>🚨</span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--accent-rose)' }}>{t.flowHeavy}</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.flowHeavyDesc}</span>
          </div>

          <div
            className={`flow-tap-card ${flowLevel === 'clots' ? 'selected' : ''}`}
            onClick={() => setFlowLevel('clots')}
          >
            <span style={{ fontSize: '1.6rem' }}>⚠️</span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--accent-crimson)' }}>{t.flowClots}</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.flowClotsDesc}</span>
          </div>
        </div>
      </div>

      {/* 2. Pelvic Pain Level */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
            🌸 {t.painSectionTitle}
          </h3>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)' }}>
            {painRating} / 10
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.65rem' }}>
          {[
            { level: 0, label: t.pain0, icon: '😊' },
            { level: 3, label: t.pain3, icon: '😐' },
            { level: 6, label: t.pain6, icon: '😣' },
            { level: 9, label: t.pain9, icon: '😭' }
          ].map((item) => (
            <button
              key={item.level}
              type="button"
              onClick={() => setPainRating(item.level)}
              style={{
                padding: '0.75rem 0.5rem',
                borderRadius: 'var(--radius-md)',
                background: painRating === item.level ? 'var(--accent-rose-soft)' : 'var(--bg-surface-elevated)',
                border: `2px solid ${painRating === item.level ? 'var(--accent-rose)' : 'var(--border-subtle)'}`,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'var(--transition)'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{item.icon}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Quick Body Check-in Chips */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          ✨ {t.bodySectionTitle}
        </h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={() => setColdHands(!coldHands)}
            style={{
              padding: '0.65rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              background: coldHands ? 'var(--accent-teal-soft)' : 'var(--bg-surface)',
              border: `1.5px solid ${coldHands ? 'var(--accent-teal)' : 'var(--border-subtle)'}`,
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            {t.coldHands}
          </button>

          <button
            type="button"
            onClick={() => setMorningFatigue(!morningFatigue)}
            style={{
              padding: '0.65rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              background: morningFatigue ? 'var(--accent-amber-soft)' : 'var(--bg-surface)',
              border: `1.5px solid ${morningFatigue ? 'var(--accent-amber)' : 'var(--border-subtle)'}`,
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            {t.morningFatigue}
          </button>

          <button
            type="button"
            onClick={() => setSugarCraving(!sugarCraving)}
            style={{
              padding: '0.65rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              background: sugarCraving ? 'var(--accent-rose-soft)' : 'var(--bg-surface)',
              border: `1.5px solid ${sugarCraving ? 'var(--accent-rose)' : 'var(--border-subtle)'}`,
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            {t.sugarCraving}
          </button>

          <button
            type="button"
            onClick={() => setTookMeds(!tookMeds)}
            style={{
              padding: '0.65rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              background: tookMeds ? 'var(--accent-teal-soft)' : 'var(--bg-surface)',
              border: `1.5px solid ${tookMeds ? 'var(--accent-teal)' : 'var(--border-subtle)'}`,
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            {t.tookMeds}
          </button>
        </div>

        {/* Short Note */}
        <div style={{ marginTop: '1.25rem' }}>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t.notesPlaceholder}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface-elevated)',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              fontSize: '0.88rem',
              resize: 'none'
            }}
          />
        </div>
      </div>

      {/* Save Button */}
      <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
        {savedSuccess && (
          <div style={{ color: 'var(--accent-teal)', marginBottom: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={18} />
            <span>{t.saveSuccessMsg}</span>
          </div>
        )}
        <button
          type="submit"
          className="btn-primary"
          style={{ width: '100%', maxWidth: '320px', padding: '0.95rem', fontSize: '1.05rem', margin: '0 auto' }}
        >
          <Heart size={18} fill="white" />
          <span>{t.saveLogBtn}</span>
        </button>
      </div>
    </form>
  );
};
