import React from 'react';
import {
  Heart,
  X,
  MessageSquare,
  Coffee,
  CheckCircle2,
  XCircle,
  Sparkles,
  Share2
} from 'lucide-react';

export const PartnerCardModal = ({
  isOpen,
  onClose,
  cycleDay = 18,
  painRating = 3,
  patientName = 'আনিকা',
  lang = 'bn'
}) => {
  if (!isOpen) return null;

  const phaseName = cycleDay <= 5
    ? (lang === 'bn' ? 'পিরিয়ডের ভারী রক্তক্ষরণ পর্ব' : 'Menstrual Phase')
    : cycleDay <= 14
    ? (lang === 'bn' ? 'ফলিকুলার পর্ব (শক্তি বৃদ্ধির সময়)' : 'Follicular Phase')
    : cycleDay <= 16
    ? (lang === 'bn' ? 'ডিম্বস্ফোটন বা ওভুলেশন সময়' : 'Ovulation Window')
    : (lang === 'bn' ? 'লুটিয়াল পর্ব (পিরিয়ডের আগের সংবেদনশীল সময়)' : 'Luteal Phase');

  const partnerMessageBn = `প্রিয়, আজকে আমার সাইকেলের ${cycleDay}তম দিন (${phaseName})। জরায়ুর প্রদাহ ও হরমোনের কারণে তলপেটে ব্যথা ও অস্বস্তি একটু বেশি। আজকে আমার একটু বাড়তি যত্ন ও ভালোবাসার প্রয়োজন। আমাকে এক কাপ গরম আদা চা বানিয়ে দিলে এবং ঘরের ভারী কাজগুলোতে একটু সাহায্য করলে আমি অনেক আরাম পাবো। ❤️`;

  const partnerMessageEn = `Hi love, today is day ${cycleDay} of my cycle (${phaseName}). My uterine cramps and fatigue are a bit higher today due to adenomyosis/PCOS. A warm cup of ginger tea and a little extra rest/support from you would mean the world to me today. ❤️`;

  const finalMsg = lang === 'bn' ? partnerMessageBn : partnerMessageEn;

  const handleShareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(finalMsg)}`;
    window.open(url, '_blank');
  };

  const handleShareSMS = () => {
    window.location.href = `sms:?body=${encodeURIComponent(finalMsg)}`;
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
        padding: '1.25rem'
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: '540px',
          width: '100%',
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 60px rgba(180, 100, 130, 0.25)',
          padding: '2rem 1.75rem',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--accent-rose-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-rose)' }}>
              <Heart size={20} fill="var(--accent-rose)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                {lang === 'bn' ? 'পার্টনার কেয়ার কার্ড' : 'Partner Care Card'}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'স্বামী বা জীবনসঙ্গীকে সহজ ভাষায় পরিস্থিতি জানান' : 'Help your partner understand and support you'}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', padding: '0.4rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Dynamic Context Box */}
        <div style={{ background: 'var(--bg-surface-soft)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', fontWeight: 700, textTransform: 'uppercase' }}>
            {lang === 'bn' ? 'আজকের শারীরিক অবস্থা' : 'Current Status'}
          </span>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginTop: '0.2rem', fontWeight: 600 }}>
            {lang === 'bn'
              ? `সাইকেল দিবস ${cycleDay} • ${phaseName} • ব্যথার মাত্রা: ${painRating}/১০`
              : `Cycle Day ${cycleDay} • ${phaseName} • Pain: ${painRating}/10`}
          </p>
        </div>

        {/* Message Preview */}
        <div style={{ background: '#fff9fb', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1.5px dashed var(--accent-rose)', marginBottom: '1.5rem', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          "{finalMsg}"
        </div>

        {/* Do's and Don'ts for Partner */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--accent-teal-soft)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(46, 196, 182, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-teal)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.35rem' }}>
              <CheckCircle2 size={16} />
              <span>{lang === 'bn' ? 'আজকের করণীয় (Do’s)' : 'Do’s'}</span>
            </div>
            <ul style={{ paddingLeft: '1.1rem', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <li>{lang === 'bn' ? 'গরম আদা চা বানিয়ে দিন' : 'Make warm ginger tea'}</li>
              <li>{lang === 'bn' ? 'হট ওয়াটার ব্যাগ এগিয়ে দিন' : 'Prepare heating pad'}</li>
              <li>{lang === 'bn' ? 'ভারী কাজগুলো নিজে করুন' : 'Help with heavy chores'}</li>
            </ul>
          </div>

          <div style={{ background: 'var(--accent-rose-soft)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 101, 132, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-rose)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.35rem' }}>
              <XCircle size={16} />
              <span>{lang === 'bn' ? 'বর্জনীয় (Don’ts)' : 'Don’ts'}</span>
            </div>
            <ul style={{ paddingLeft: '1.1rem', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <li>{lang === 'bn' ? 'ব্যথাকে খাটো করে না দেখা' : 'Never dismiss her pain'}</li>
              <li>{lang === 'bn' ? 'ঠান্ডা খাবার বা পানীয় না দেওয়া' : 'Avoid cold food/drinks'}</li>
              <li>{lang === 'bn' ? 'অপ্রয়োজনীয় মানসিক চাপ না দেওয়া' : 'Avoid stressful talks'}</li>
            </ul>
          </div>
        </div>

        {/* 1-Click WhatsApp & SMS Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
          <button
            className="btn-primary"
            onClick={handleShareWhatsApp}
            style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', width: '100%', justifyContent: 'center' }}
          >
            <MessageSquare size={17} />
            <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে পার্টনারকে কার্ড পাঠান' : 'Send Care Card via WhatsApp'}</span>
          </button>
          <button
            className="btn-secondary"
            onClick={handleShareSMS}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Share2 size={16} />
            <span>{lang === 'bn' ? 'সাধারণ SMS হিসেবে পাঠান' : 'Send via SMS'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
