import React, { useState } from 'react';
import {
  Target,
  Leaf,
  Activity,
  CheckCircle2,
  Circle,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { triadRemissionPhases, deshiHealingFoods } from '../data/triadData';
import { somaticExercises } from '../data/somaticExercises';
import { translations } from '../data/translations';
import { soundSynth } from '../utils/soundSynthesizer';

export const CareHub = ({ lang = 'bn' }) => {
  const t = translations[lang] || translations.bn;
  const [activeSubTab, setActiveSubTab] = useState('roadmap'); // 'roadmap', 'recipes', 'movement'
  const [activePhase, setActivePhase] = useState(2);
  const [checkedTasks, setCheckedTasks] = useState({});

  // Somatic Stretch Timer
  const [activeExIdx, setActiveExIdx] = useState(0);
  const currentEx = somaticExercises[activeExIdx];
  const [timerSec, setTimerSec] = useState(currentEx.durationSec);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const toggleTask = (key) => {
    setCheckedTasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectEx = (idx) => {
    setActiveExIdx(idx);
    setTimerSec(somaticExercises[idx].durationSec);
    setIsTimerRunning(false);
  };

  React.useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSec > 0) {
      interval = setInterval(() => setTimerSec(prev => prev - 1), 1000);
    } else if (timerSec === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      soundSynth.playGong();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSec]);

  const formatTime = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const selectedPhaseData = triadRemissionPhases.find(p => p.id === activePhase) || triadRemissionPhases[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px', margin: '0 auto' }}>
      {/* Soft Header */}
      <div className="glass-card" style={{ textAlign: 'center', padding: '1.75rem 1.25rem' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
          🌸 {t.careTitle}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          {t.careSub}
        </p>

        {/* 3 Sub-Navigation Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          <button
            className={`tag-btn ${activeSubTab === 'roadmap' ? 'selected' : ''}`}
            onClick={() => setActiveSubTab('roadmap')}
            style={{ padding: '0.6rem 1.15rem', borderRadius: 'var(--radius-full)' }}
          >
            <Target size={15} style={{ display: 'inline', marginRight: '5px' }} />
            {t.tabRoadmap}
          </button>
          <button
            className={`tag-btn ${activeSubTab === 'recipes' ? 'selected' : ''}`}
            onClick={() => setActiveSubTab('recipes')}
            style={{ padding: '0.6rem 1.15rem', borderRadius: 'var(--radius-full)' }}
          >
            <Leaf size={15} style={{ display: 'inline', marginRight: '5px' }} />
            {t.tabRecipes}
          </button>
          <button
            className={`tag-btn ${activeSubTab === 'movement' ? 'selected' : ''}`}
            onClick={() => setActiveSubTab('movement')}
            style={{ padding: '0.6rem 1.15rem', borderRadius: 'var(--radius-full)' }}
          >
            <Activity size={15} style={{ display: 'inline', marginRight: '5px' }} />
            {t.tabMovement}
          </button>
        </div>
      </div>

      {/* =========================================================
          SUB-TAB 1: 4-PHASE REMISSION ROADMAP
         ========================================================= */}
      {activeSubTab === 'roadmap' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* 4 Phase Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.65rem' }}>
            {triadRemissionPhases.map((phase) => {
              const isSelected = activePhase === phase.id;
              return (
                <button
                  key={phase.id}
                  onClick={() => setActivePhase(phase.id)}
                  style={{
                    padding: '0.85rem 0.5rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--accent-rose-soft)' : 'var(--bg-surface)',
                    border: `1.5px solid ${isSelected ? 'var(--accent-rose)' : 'var(--border-subtle)'}`,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  <span style={{ fontSize: '0.72rem', color: isSelected ? 'var(--accent-rose)' : 'var(--text-muted)', fontWeight: 700, display: 'block' }}>
                    {phase.duration}
                  </span>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'block', marginTop: '0.2rem' }}>
                    {lang === 'bn' ? `ধাপ ${phase.id}` : `Phase ${phase.id}`}
                  </strong>
                </button>
              );
            })}
          </div>

          {/* Phase Details Card */}
          <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-rose)' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              {lang === 'bn' ? selectedPhaseData.titleBn : selectedPhaseData.titleEn}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              {lang === 'bn' ? selectedPhaseData.focusBn : selectedPhaseData.focusEn}
            </p>

            <h4 style={{ fontSize: '0.88rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
              {lang === 'bn' ? 'এই ধাপের সহজ রুটিন' : 'Daily Checklist'}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {(lang === 'bn' ? selectedPhaseData.actionChecklistBn : selectedPhaseData.actionChecklistEn).map((item, idx) => {
                const k = `${selectedPhaseData.id}-${idx}`;
                const isDone = checkedTasks[k] || false;
                return (
                  <div
                    key={idx}
                    onClick={() => toggleTask(k)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: isDone ? 'var(--accent-teal-soft)' : 'var(--bg-surface-elevated)',
                      border: `1px solid ${isDone ? 'var(--accent-teal)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    {isDone ? (
                      <CheckCircle2 size={18} color="var(--accent-teal)" />
                    ) : (
                      <Circle size={18} color="var(--text-muted)" />
                    )}
                    <span style={{ fontSize: '0.88rem', color: isDone ? 'var(--text-primary)' : 'var(--text-secondary)', textDecoration: isDone ? 'line-through' : 'none' }}>
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          SUB-TAB 2: DESHI HEALING FOODS
         ========================================================= */}
      {activeSubTab === 'recipes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {deshiHealingFoods.map((food, idx) => (
            <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    {lang === 'bn' ? food.nameBn : food.nameEn}
                  </h4>
                  <span className="status-pill normal" style={{ fontSize: '0.7rem' }}>
                    {food.target}
                  </span>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0.65rem 0' }}>
                  {lang === 'bn' ? food.benefitBn : food.benefitEn}
                </p>
              </div>

              <div style={{ background: 'var(--bg-surface-soft)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--accent-rose)', fontWeight: 600 }}>
                {food.usage}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================
          SUB-TAB 3: GENTLE MOVEMENT & SOMATIC RELAXATION (BENGALI)
         ========================================================= */}
      {activeSubTab === 'movement' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem' }}>
            {/* Active Timer Card */}
            <div className="glass-card" style={{ textAlign: 'center', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span className="status-pill normal" style={{ marginBottom: '0.65rem' }}>
                {lang === 'bn' ? currentEx.difficultyBn : currentEx.difficulty}
              </span>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                {lang === 'bn' ? currentEx.titleBn : currentEx.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '380px', marginBottom: '1.5rem' }}>
                {lang === 'bn' ? currentEx.recommendedWhenBn : currentEx.recommendedWhen}
              </p>

              {/* Circular Timer */}
              <div
                style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  border: '4px solid var(--accent-rose)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--accent-rose-soft)',
                  boxShadow: isTimerRunning ? '0 0 25px rgba(255, 101, 132, 0.3)' : 'none',
                  marginBottom: '1.5rem'
                }}
              >
                <span style={{ fontSize: '2.5rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-rose)' }}>
                  {formatTime(timerSec)}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {isTimerRunning ? (lang === 'bn' ? 'চলছে...' : 'Active') : (lang === 'bn' ? 'প্রস্তুত' : 'Ready')}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  className="btn-primary"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  style={{ minWidth: '110px' }}
                >
                  {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
                  <span>{isTimerRunning ? (lang === 'bn' ? 'থামান' : 'Pause') : (lang === 'bn' ? 'শুরু করুন' : 'Start')}</span>
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSec(currentEx.durationSec);
                  }}
                >
                  <RotateCcw size={16} />
                  <span>{lang === 'bn' ? 'রিসেট' : 'Reset'}</span>
                </button>
              </div>
            </div>

            {/* List of Stretches */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {somaticExercises.map((ex, idx) => (
                <div
                  key={ex.id}
                  onClick={() => handleSelectEx(idx)}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: activeExIdx === idx ? 'var(--accent-rose-soft)' : 'var(--bg-surface)',
                    border: `1.5px solid ${activeExIdx === idx ? 'var(--accent-rose)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block' }}>
                    {lang === 'bn' ? ex.titleBn : ex.title}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {formatTime(ex.durationSec)} • {lang === 'bn' ? ex.focusAreaBn : ex.focusArea}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Exercise Guidance & Clinical Benefit in Bengali */}
          <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-teal)' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.65rem' }}>
              {lang === 'bn' ? 'সহজ ধাপে ধাপে আসন করার নিয়ম' : 'Step-by-Step Guidance'}
            </h4>
            <ol style={{ paddingLeft: '1.25rem', fontSize: '0.86rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.45rem', lineHeight: 1.5 }}>
              {(lang === 'bn' ? currentEx.guidanceBn : currentEx.guidance).map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>

            <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-soft)', fontSize: '0.82rem', color: 'var(--accent-rose)', fontWeight: 600 }}>
              💡 {lang === 'bn' ? 'শারীরিক উপকারিতা:' : 'Clinical Benefit:'}{' '}
              <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>
                {lang === 'bn' ? currentEx.clinicalBenefitBn : currentEx.clinicalBenefit}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
