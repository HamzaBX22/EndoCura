import React, { useState, useEffect } from 'react';
import { Lock, Heart, Delete, ShieldCheck, KeyRound } from 'lucide-react';

export const PinLockScreen = ({
  correctPin = '1234',
  onUnlock,
  onResetPin,
  lang = 'bn'
}) => {
  const [enteredPin, setEnteredPin] = useState('');
  const [errorShake, setErrorShake] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleKeyPress = (digit) => {
    if (enteredPin.length < 4) {
      const next = enteredPin + digit;
      setEnteredPin(next);
      setErrorMsg('');

      if (next.length === 4) {
        if (next === correctPin) {
          onUnlock();
        } else {
          setErrorShake(true);
          setErrorMsg(lang === 'bn' ? 'ভুল পিন কোড! পুনরায় চেষ্টা করুন।' : 'Incorrect PIN! Please try again.');
          setTimeout(() => {
            setEnteredPin('');
            setErrorShake(false);
          }, 600);
        }
      }
    }
  };

  const handleDelete = () => {
    setEnteredPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  // Support physical keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['0','1','2','3','4','5','6','7','8','9'].includes(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enteredPin, correctPin]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: 'linear-gradient(180deg, #fff2f5 0%, #ffe6ec 60%, #ffdbe4 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.25s ease'
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: '360px',
          width: '100%',
          textAlign: 'center',
          padding: '2.5rem 1.8rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 50px rgba(255, 101, 132, 0.22)',
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(255, 182, 193, 0.5)'
        }}
      >
        {/* App Icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-rose), #ff859d)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            margin: '0 auto 1.2rem auto',
            boxShadow: 'var(--shadow-rose)'
          }}
        >
          <Lock size={28} />
        </div>

        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          {lang === 'bn' ? 'ব্যক্তিগত স্বাস্থ্য সুরক্ষা' : 'Privacy Locked'}
        </h2>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.4 }}>
          {lang === 'bn'
            ? 'আপনার সংবেদনশীল সাইকেল ও চিকিৎসা ডাটা দেখতে ৪-সংখ্যার পিন দিন'
            : 'Enter your 4-digit security PIN to access your reproductive health data'}
        </p>

        {/* PIN Indicators */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.2rem',
            marginBottom: '1.5rem',
            transform: errorShake ? 'translateX(-8px)' : 'none',
            transition: 'transform 0.1s ease'
          }}
        >
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '2px solid var(--accent-rose)',
                background: i < enteredPin.length ? 'var(--accent-rose)' : 'transparent',
                boxShadow: i < enteredPin.length ? '0 0 10px rgba(255, 101, 132, 0.5)' : 'none',
                transition: 'var(--transition)'
              }}
            />
          ))}
        </div>

        {/* Error message */}
        {errorMsg && (
          <div style={{ color: 'var(--accent-crimson)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1rem' }}>
            {errorMsg}
          </div>
        )}

        {/* Numeric Keypad */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.85rem',
            maxWidth: '260px',
            margin: '0 auto 1.5rem auto'
          }}
        >
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: 'var(--shadow-sm)',
                transition: 'var(--transition)'
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {num}
            </button>
          ))}

          {/* Reset / Empty */}
          <button
            type="button"
            onClick={() => setEnteredPin('')}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
            }}
          >
            Clear
          </button>

          {/* 0 */}
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              fontSize: '1.35rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              boxShadow: 'var(--shadow-sm)',
              transition: 'var(--transition)'
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            0
          </button>

          {/* Backspace */}
          <button
            type="button"
            onClick={handleDelete}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--accent-rose)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              boxShadow: 'var(--shadow-sm)',
              transition: 'var(--transition)'
            }}
          >
            <Delete size={20} />
          </button>
        </div>

        {/* Forgot PIN fallback */}
        {onResetPin && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(lang === 'bn' ? 'আপনি কি পিন লক নিষ্ক্রিয় করতে চান?' : 'Do you want to disable PIN lock?')) {
                onResetPin();
              }
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            {lang === 'bn' ? 'পিন মনে নেই? রিসেট করুন' : 'Forgot PIN? Reset security'}
          </button>
        )}
      </div>
    </div>
  );
};
