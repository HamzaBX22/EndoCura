import React, { useState, useEffect } from 'react';
import {
  Flame,
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Clock,
  Heart,
  MessageSquare,
  Sparkles,
  Wind,
  ShieldAlert
} from 'lucide-react';
import { soundSynth } from '../utils/soundSynthesizer';
import { getSOSContact, saveSOSContact } from '../utils/storage';

export const PainSOSModal = ({ isOpen, onClose, lang = 'bn' }) => {
  if (!isOpen) return null;

  // Soundscape State
  const [activeSound, setActiveSound] = useState(null);
  const [volume, setVolume] = useState(0.6);

  // 4-7-8 Breathing Orb State
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [breathCount, setBreathCount] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(true);

  // 20-min Heat Pad Timer State
  const [heatTimerSec, setHeatTimerSec] = useState(20 * 60);
  const [isHeatRunning, setIsHeatRunning] = useState(false);

  // SOS Contact State
  const [contact, setContact] = useState(getSOSContact());
  const [showContactEditor, setShowContactEditor] = useState(false);

  const handleToggleSound = (type) => {
    if (activeSound === type) {
      soundSynth.stop();
      setActiveSound(null);
    } else {
      if (type === 'brown') soundSynth.playBrownNoise();
      else if (type === 'rain') soundSynth.playRain();
      else if (type === 'drone') soundSynth.playCalmDrone();
      setActiveSound(type);
    }
  };

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    soundSynth.setVolume(newVol);
  };

  useEffect(() => {
    if (!isBreathingActive) return;

    let timer = null;
    if (breathPhase === 'inhale') {
      if (breathCount > 1) {
        timer = setTimeout(() => setBreathCount(breathCount - 1), 1000);
      } else {
        setBreathPhase('hold');
        setBreathCount(7);
      }
    } else if (breathPhase === 'hold') {
      if (breathCount > 1) {
        timer = setTimeout(() => setBreathCount(breathCount - 1), 1000);
      } else {
        setBreathPhase('exhale');
        setBreathCount(8);
      }
    } else if (breathPhase === 'exhale') {
      if (breathCount > 1) {
        timer = setTimeout(() => setBreathCount(breathCount - 1), 1000);
      } else {
        setBreathPhase('inhale');
        setBreathCount(4);
      }
    }

    return () => clearTimeout(timer);
  }, [isBreathingActive, breathPhase, breathCount]);

  useEffect(() => {
    let interval = null;
    if (isHeatRunning && heatTimerSec > 0) {
      interval = setInterval(() => {
        setHeatTimerSec(prev => prev - 1);
      }, 1000);
    } else if (heatTimerSec === 0 && isHeatRunning) {
      setIsHeatRunning(false);
      soundSynth.playGong();
    }
    return () => clearInterval(interval);
  }, [isHeatRunning, heatTimerSec]);

  useEffect(() => {
    return () => {
      soundSynth.stop();
    };
  }, []);

  const formatHeatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const defaultBnMessage = 'আমার এখন তীব্র অ্যাডিনোমায়োসিসের ব্যথা ও জরায়ু সংকোচন শুরু হয়েছে (ব্যথা ৮/১০)। দয়া করে আমাকে হট ওয়াটার ব্যাগ এবং ব্যথানাশক ওষুধটি এনে দাও।';
  const distressMsg = contact.message || (lang === 'bn' ? defaultBnMessage : 'Having an acute adenomyosis flare-up right now. Please assist with heat pack/pain medication.');

  const handleSendWhatsAppAlert = () => {
    const encoded = encodeURIComponent(distressMsg);
    const url = `https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleSendSMSAlert = () => {
    const encoded = encodeURIComponent(distressMsg);
    window.location.href = `sms:${contact.phone}?body=${encoded}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        background: 'rgba(8, 10, 16, 0.96)',
        backdropFilter: 'blur(25px)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        padding: '1.5rem',
        animation: 'fadeIn 0.3s ease'
      }}
    >
      {/* Top Bar */}
      <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff2a4b, #ff758c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 0 20px rgba(255, 42, 75, 0.6)' }}>
            <Flame size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', letterSpacing: '-0.01em' }}>
              {lang === 'bn' ? 'জরুরি ব্যথানাশক SOS কনসোল' : 'Pain Flare SOS Console'}
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {lang === 'bn' ? 'তীব্র ব্যথার মুহূর্তে স্নায়ু ও জরায়ু শান্ত করার লো-স্টিমুলেশন পরিবেশ' : 'Low-Stimulation Neuro-Somatic Comfort for Acute Crises'}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            soundSynth.stop();
            onClose();
          }}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-active)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.88rem'
          }}
        >
          <X size={18} />
          <span>{lang === 'bn' ? 'এসওএস মোড বন্ধ করুন' : 'Exit SOS Mode'}</span>
        </button>
      </div>

      <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
        {/* Module 1: 4-7-8 Somatic Vagus Breathing Orb */}
        <div className="glass-card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <span className="status-pill normal" style={{ marginBottom: '0.75rem' }}>
            {lang === 'bn' ? 'ভ্যাগাস নার্ভ রিসেট • জরায়ুর রক্তনালীর খিঁচুনি কমায়' : 'Parasympathetic Reset • Lowers Uterine Arterial Spasms'}
          </span>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
            {lang === 'bn' ? '৪-৭-৮ শান্তিদায়ক শ্বাসের ছন্দ' : '4-7-8 Vagus Breathing Rhythm'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
            {lang === 'bn'
              ? 'বৃত্তের সাথে তাল মিলিয়ে শ্বাস নিন। বড় করে মুখ দিয়ে নিঃশ্বাস ছাড়লে শরীরে প্রাকৃতিক ব্যথানাশক এন্ডোরফিন নির্গত হয়।'
              : 'Follow the rhythm. Elongated exhalations release natural endorphins and down-regulate pain signals.'}
          </p>

          <div className="breathing-orb-wrapper">
            <div className={`breathing-circle ${breathPhase}`}>
              <span style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, color: '#fff', marginBottom: '0.2rem' }}>
                {breathPhase === 'inhale' && (lang === 'bn' ? 'নাক দিয়ে শ্বাস নিন (৪ সেকেন্ড)' : 'Inhale (Nose)')}
                {breathPhase === 'hold' && (lang === 'bn' ? 'ধরে রাখুন (৭ সেকেন্ড)' : 'Gently Hold')}
                {breathPhase === 'exhale' && (lang === 'bn' ? 'ধীরে ধীরে ছাড়ুন (৮ সেকেন্ড)' : 'Slow Exhale (Mouth)')}
              </span>
              <span style={{ fontSize: '3.5rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#fff' }}>
                {breathCount}
              </span>
            </div>
          </div>
        </div>

        {/* Module 2: Ambient Web Audio & Heat Pad Timer */}
        <div className="grid-2">
          {/* Soundscape Synthesizer */}
          <div className="glass-card">
            <div className="glass-card-header">
              <div className="card-title-group">
                <div className="card-icon-bubble pcos">
                  <Wind size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem' }}>
                    {lang === 'bn' ? 'প্রাকৃতিক সাউন্ড থেরাপি' : 'Synthesized Sound Therapy'}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {lang === 'bn' ? '১০০% অফলাইন • ব্রেনওয়েভ রিল্যাক্সেশন' : '100% Offline • Pure Brainwave Entrainment'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <button
                onClick={() => handleToggleSound('brown')}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: activeSound === 'brown' ? 'rgba(255, 59, 119, 0.2)' : 'var(--bg-surface-elevated)',
                  border: `1px solid ${activeSound === 'brown' ? 'var(--accent-adeno)' : 'var(--border-subtle)'}`,
                  color: 'var(--text-primary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.9rem', display: 'block' }}>
                    {lang === 'bn' ? 'ডিপ ব্রাউন নয়েজ (Brown Noise)' : 'Deep Brown Noise'}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {lang === 'bn' ? 'স্নায়ুর তীব্র ও সূক্ষ্ম যন্ত্রণা হালকা করতে সহায়ক' : 'Warm acoustic mask for intense nerve pain'}
                  </span>
                </div>
                {activeSound === 'brown' ? <Pause size={18} color="var(--accent-adeno)" /> : <Play size={18} />}
              </button>

              <button
                onClick={() => handleToggleSound('rain')}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: activeSound === 'rain' ? 'rgba(0, 229, 163, 0.2)' : 'var(--bg-surface-elevated)',
                  border: `1px solid ${activeSound === 'rain' ? 'var(--accent-pcos)' : 'var(--border-subtle)'}`,
                  color: 'var(--text-primary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.9rem', display: 'block' }}>
                    {lang === 'bn' ? 'ঝুম বৃষ্টির মৃদু শব্দ (Gentle Rain)' : 'Gentle Rain Soundscape'}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {lang === 'bn' ? 'বৃষ্টির ফ্রিকোয়েন্সি মনকে ব্যথার ভাবনা থেকে সরায়' : 'Filtered acoustic droplets for distraction'}
                  </span>
                </div>
                {activeSound === 'rain' ? <Pause size={18} color="var(--accent-pcos)" /> : <Play size={18} />}
              </button>

              <button
                onClick={() => handleToggleSound('drone')}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: activeSound === 'drone' ? 'rgba(157, 78, 221, 0.2)' : 'var(--bg-surface-elevated)',
                  border: `1px solid ${activeSound === 'drone' ? 'var(--accent-purple)' : 'var(--border-subtle)'}`,
                  color: 'var(--text-primary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.9rem', display: 'block' }}>
                    {lang === 'bn' ? '৪৩২ হার্জ কামিং ডেল্টা সাউন্ড' : '432Hz Calm Delta Drone'}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {lang === 'bn' ? 'মাংসপেশির গভীর টান মুক্ত করার হারমোনিক ওয়েভ' : 'Harmonic binaural frequencies for muscle release'}
                  </span>
                </div>
                {activeSound === 'drone' ? <Pause size={18} color="var(--accent-purple)" /> : <Play size={18} />}
              </button>
            </div>

            {/* Volume */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Volume2 size={18} color="var(--text-muted)" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--accent-adeno)' }}
              />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          {/* Heat Pad Timer */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="glass-card-header">
                <div className="card-title-group">
                  <div className="card-icon-bubble" style={{ background: 'rgba(255, 183, 3, 0.15)', color: 'var(--accent-amber)' }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem' }}>
                      {lang === 'bn' ? 'হট ওয়াটার ব্যাগ ২০-মিনিট টাইমার' : 'Heat Pad 20-Min Timer'}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {lang === 'bn' ? 'ত্বকের ক্ষতি না করে রক্ত সঞ্চালন বাড়ানোর নিরাপদ সময়' : 'Prevents skin burns while increasing blood flow'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <span style={{ fontSize: '3rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-amber)' }}>
                  {formatHeatTime(heatTimerSec)}
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                  {lang === 'bn'
                    ? 'তলপেটে গরম সেক দিলে জরায়ুর রক্তনালী প্রসারিত হয় এবং খিঁচুনি ব্যথা কমে। ২০ মিনিট পূর্ণ হলে মিষ্টি ঘণ্টা বেজে উঠবে।'
                    : 'Heat increases pelvic blood flow, counteracting uterine spasms. A gentle gong will ring when 20 minutes elapse.'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                className="btn-primary"
                onClick={() => setIsHeatRunning(!isHeatRunning)}
                style={{ background: 'linear-gradient(135deg, var(--accent-amber), #f57c00)' }}
              >
                {isHeatRunning ? <Pause size={18} /> : <Play size={18} />}
                <span>{isHeatRunning ? (lang === 'bn' ? 'টাইমার থামান' : 'Pause') : (lang === 'bn' ? 'সেক শুরু করুন' : 'Start Heat Cycle')}</span>
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setIsHeatRunning(false);
                  setHeatTimerSec(20 * 60);
                }}
              >
                {lang === 'bn' ? 'রিসেট' : 'Reset'}
              </button>
            </div>
          </div>
        </div>

        {/* Module 3: Caregiver Distress Alert */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-crimson)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={20} color="var(--accent-crimson)" />
              <h4 style={{ fontSize: '1.05rem' }}>
                {lang === 'bn' ? 'এক-ক্লিকে স্বজনের সাহায্য বার্তা পাঠান' : 'One-Tap Caregiver Distress Dispatch'}
              </h4>
            </div>
            <button
              className="tag-btn"
              onClick={() => setShowContactEditor(!showContactEditor)}
            >
              {showContactEditor ? (lang === 'bn' ? 'লুকান' : 'Hide') : (lang === 'bn' ? 'নম্বর ও বার্তা পরিবর্তন' : 'Edit Contact')}
            </button>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            {lang === 'bn'
              ? 'তীব্র ব্যথায় কথা বলার বা ওঠার শক্তি না থাকলে, এই বাটনে ট্যাপ করলেই স্বজনের কাছে পূর্বনির্ধারিত সাহায্য বার্তা চলে যাবে।'
              : 'When severe pain renders you unable to speak, dispatch an emergency alert to your caregiver with one tap.'}
          </p>

          {showContactEditor && (
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder={lang === 'bn' ? 'স্বজনের নাম' : 'Contact Name'}
                  value={contact.name}
                  onChange={(e) => {
                    const upd = { ...contact, name: e.target.value };
                    setContact(upd);
                    saveSOSContact(upd);
                  }}
                  style={{ padding: '0.55rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', color: '#fff', border: '1px solid var(--border-active)' }}
                />
                <input
                  type="text"
                  placeholder={lang === 'bn' ? 'মোবাইল নম্বর (যেমন: +88017...)' : 'Phone Number'}
                  value={contact.phone}
                  onChange={(e) => {
                    const upd = { ...contact, phone: e.target.value };
                    setContact(upd);
                    saveSOSContact(upd);
                  }}
                  style={{ padding: '0.55rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', color: '#fff', border: '1px solid var(--border-active)' }}
                />
              </div>
              <textarea
                rows="2"
                value={contact.message}
                onChange={(e) => {
                  const upd = { ...contact, message: e.target.value };
                  setContact(upd);
                  saveSOSContact(upd);
                }}
                style={{ padding: '0.55rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', color: '#fff', border: '1px solid var(--border-active)', fontFamily: 'inherit' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleSendWhatsAppAlert}
              className="btn-primary"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
            >
              <MessageSquare size={16} />
              <span>{lang === 'bn' ? `${contact.name}-কে হোয়াটসঅ্যাপে বার্তা পাঠান` : `Send WhatsApp Alert to ${contact.name}`}</span>
            </button>
            <button
              onClick={handleSendSMSAlert}
              className="btn-secondary"
            >
              <span>{lang === 'bn' ? 'সরাসরি মোবাইলে SMS পাঠান' : 'Send via SMS'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
