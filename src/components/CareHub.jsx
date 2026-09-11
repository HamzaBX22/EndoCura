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
  const [activePhase, setActivePhase] = useState(1);
  const [checkedTasks, setCheckedTasks] = useState({});
  const [recipeCategory, setRecipeCategory] = useState('all'); // 'all', 'tea', 'food', 'seed'

  // Somatic Stretch Timer
  const [activeExIdx, setActiveExIdx] = useState(0);
  const currentEx = somaticExercises[activeExIdx] || somaticExercises[0];
  const [timerSec, setTimerSec] = useState(currentEx.durationSec);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Bulletproof safe haptic tap that never blocks state update
  const playSafeTap = () => {
    try {
      if (soundSynth && typeof soundSynth.playTap === 'function') {
        soundSynth.playTap();
      }
    } catch (e) {
      // Fallback
    }
  };

  const toggleTask = (key) => {
    setCheckedTasks(prev => ({ ...prev, [key]: !prev[key] }));
    playSafeTap();
  };

  const handleSelectEx = (idx) => {
    setActiveExIdx(idx);
    setTimerSec(somaticExercises[idx].durationSec);
    setIsTimerRunning(false);
    playSafeTap();
  };

  React.useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSec > 0) {
      interval = setInterval(() => setTimerSec(prev => prev - 1), 1000);
    } else if (timerSec === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      try { soundSynth?.playGong?.(); } catch (e) {}
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSec]);

  const formatTime = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const selectedPhaseData = triadRemissionPhases.find(p => p.id === activePhase) || triadRemissionPhases[0];

  // Calculate phase checklist completion
  const checklist = lang === 'bn' ? selectedPhaseData.actionChecklistBn : selectedPhaseData.actionChecklistEn;
  const completedCount = checklist.filter((_, idx) => checkedTasks[`${selectedPhaseData.id}-${idx}`]).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  // Filtered recipes
  const filteredFoods = recipeCategory === 'all'
    ? deshiHealingFoods
    : deshiHealingFoods.filter(f => f.category === recipeCategory);

  return (
    <div className="care-hub-container">
      {/* Soothing Header Card */}
      <div className="glass-card care-hero-card">
        <h2 className="care-hero-title">
          🌸 {t.careTitle}
        </h2>
        <p className="care-hero-subtitle">
          {t.careSub}
        </p>

        {/* 3 Prominent Sub-Navigation Option Cards */}
        <div className="care-subnav-row">
          <button
            className={`care-subnav-btn ${activeSubTab === 'roadmap' ? 'active' : ''}`}
            onClick={() => {
              setActiveSubTab('roadmap');
              playSafeTap();
            }}
          >
            <div className="care-subnav-icon">
              <Target size={18} />
            </div>
            <span className="care-subnav-label">{t.tabRoadmap}</span>
          </button>

          <button
            className={`care-subnav-btn ${activeSubTab === 'recipes' ? 'active' : ''}`}
            onClick={() => {
              setActiveSubTab('recipes');
              playSafeTap();
            }}
          >
            <div className="care-subnav-icon">
              <Leaf size={18} />
            </div>
            <span className="care-subnav-label">{t.tabRecipes}</span>
          </button>

          <button
            className={`care-subnav-btn ${activeSubTab === 'movement' ? 'active' : ''}`}
            onClick={() => {
              setActiveSubTab('movement');
              playSafeTap();
            }}
          >
            <div className="care-subnav-icon">
              <Activity size={18} />
            </div>
            <span className="care-subnav-label">{t.tabMovement}</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          SUB-TAB 1: ৪-ধাপের নিরাময় রোডম্যাপ (4-PHASE ROADMAP)
         ========================================================= */}
      {activeSubTab === 'roadmap' && (
        <div className="care-section-fade">
          {/* Phase Selector Grid - 2x2 on mobile, 4 columns on desktop */}
          <div className="care-phase-grid">
            {triadRemissionPhases.map((phase) => {
              const isSelected = activePhase === phase.id;
              return (
                <button
                  key={phase.id}
                  onClick={() => {
                    setActivePhase(phase.id);
                    playSafeTap();
                  }}
                  className={`care-phase-btn ${isSelected ? 'selected' : ''}`}
                >
                  <span className="care-phase-badge">
                    {lang === 'bn' ? `ধাপ ${phase.id}` : `Phase ${phase.id}`}
                  </span>
                  <strong className="care-phase-duration">
                    {phase.duration}
                  </strong>
                  <span className="care-phase-short">
                    {lang === 'bn'
                      ? (phase.id === 1 ? 'রক্তক্ষরণ ও প্রদাহ' : phase.id === 2 ? 'ইনসুলিন ও থাইরয়েড' : phase.id === 3 ? 'ইস্ট্রোজেন ডিটক্স' : 'স্থায়ী সুস্থতা')
                      : (phase.id === 1 ? 'Hemostasis' : phase.id === 2 ? 'Insulin & T3' : phase.id === 3 ? 'Estrogen Detox' : 'Remission')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Phase Details Card */}
          <div className="glass-card care-phase-detail-card">
            {/* Header info */}
            <div className="care-phase-header">
              <div>
                <span className="status-pill normal" style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                  {phaseSummaryTag(selectedPhaseData.id, lang)}
                </span>
                <h3 className="care-phase-title">
                  {lang === 'bn' ? selectedPhaseData.titleBn : selectedPhaseData.titleEn}
                </h3>
              </div>
            </div>

            {/* Target Biomarkers */}
            <div className="care-biomarker-pill">
              <Sparkles size={16} color="var(--accent-teal)" style={{ flexShrink: 0 }} />
              <span>
                <strong>{lang === 'bn' ? 'ক্লিনিক্যাল লক্ষ্য:' : 'Clinical Target:'}</strong> {selectedPhaseData.targetBiomarker}
              </span>
            </div>

            {/* Focus Text */}
            <p className="care-phase-focus">
              {lang === 'bn' ? selectedPhaseData.focusBn : selectedPhaseData.focusEn}
            </p>

            {/* Daily Checklist Progress */}
            <div className="care-checklist-header">
              <div className="care-checklist-progress-text">
                <h4>
                  {lang === 'bn' ? 'এই ধাপের সহজ দৈনন্দিন রুটিন' : 'Daily Phase Checklist'}
                </h4>
                <span className="care-progress-counter">
                  {completedCount}/{checklist.length} {lang === 'bn' ? 'সম্পন্ন' : 'Done'} ({progressPercent}%)
                </span>
              </div>
              <div className="care-progress-track">
                <div
                  className="care-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Interactive Checklist Cards */}
            <div className="care-checklist-items">
              {checklist.map((item, idx) => {
                const k = `${selectedPhaseData.id}-${idx}`;
                const isDone = checkedTasks[k] || false;
                return (
                  <div
                    key={idx}
                    onClick={() => toggleTask(k)}
                    className={`care-task-card ${isDone ? 'done' : ''}`}
                    role="checkbox"
                    aria-checked={isDone}
                    tabIndex={0}
                  >
                    <div className="care-task-checkbox">
                      {isDone ? (
                        <CheckCircle2 size={20} color="var(--accent-teal)" />
                      ) : (
                        <Circle size={20} color="var(--text-muted)" />
                      )}
                    </div>
                    <span className="care-task-label">
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
          SUB-TAB 2: দেশি পুষ্টিকর খাবার ও চা (FOODS & HEALING TEAS)
         ========================================================= */}
      {activeSubTab === 'recipes' && (
        <div className="care-section-fade">
          {/* Category Filter Chips */}
          <div className="care-filter-chips">
            <button
              className={`care-chip ${recipeCategory === 'all' ? 'active' : ''}`}
              onClick={() => {
                setRecipeCategory('all');
                playSafeTap();
              }}
            >
              🌸 {lang === 'bn' ? 'সব খাবার ও চা' : 'All Foods & Teas'}
            </button>
            <button
              className={`care-chip ${recipeCategory === 'tea' ? 'active' : ''}`}
              onClick={() => {
                setRecipeCategory('tea');
                playSafeTap();
              }}
            >
              🍵 {lang === 'bn' ? 'ঔষধি চা ও পানীয়' : 'Medicinal Teas'}
            </button>
            <button
              className={`care-chip ${recipeCategory === 'food' ? 'active' : ''}`}
              onClick={() => {
                setRecipeCategory('food');
                playSafeTap();
              }}
            >
              🍲 {lang === 'bn' ? 'পুষ্টিকর দেশি খাবার' : 'Nourishing Meals'}
            </button>
            <button
              className={`care-chip ${recipeCategory === 'seed' ? 'active' : ''}`}
              onClick={() => {
                setRecipeCategory('seed');
                playSafeTap();
              }}
            >
              🌱 {lang === 'bn' ? 'বীজ ও ভেষজ' : 'Seeds & Herbs'}
            </button>
          </div>

          {/* Foods & Teas Grid (1 col on mobile, 2 col on desktop) */}
          <div className="care-foods-grid">
            {filteredFoods.map((food, idx) => (
              <div key={food.id || idx} className="glass-card care-food-card">
                <div>
                  <div className="care-food-top">
                    <div>
                      <h4 className="care-food-name">
                        {lang === 'bn' ? food.nameBn : food.nameEn}
                      </h4>
                      <div className="care-food-subname">
                        {lang === 'bn' ? food.nameEn : food.nameBn}
                      </div>
                    </div>
                    <span className="status-pill normal care-food-tag">
                      {food.target}
                    </span>
                  </div>

                  <p className="care-food-benefit">
                    {lang === 'bn' ? food.benefitBn : food.benefitEn}
                  </p>
                </div>

                {/* Usage instruction highlight */}
                <div className="care-food-usage">
                  <span className="care-usage-title">
                    💡 {lang === 'bn' ? 'খাওয়ার নিয়ম ও পরিমাণ:' : 'How & When to Consume:'}
                  </span>
                  <div className="care-usage-desc">
                    {food.usage}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          SUB-TAB 3: সহজ রিল্যাক্সিং ব্যায়াম (GENTLE SOMATICS & ZEN TIMER)
         ========================================================= */}
      {activeSubTab === 'movement' && (
        <div className="care-section-fade care-movement-flow">
          {/* Exercise Selector Strip */}
          <div className="care-exercise-selector">
            <span className="care-exercise-hint">
              🧘‍♀️ {lang === 'bn' ? 'যেকোনো একটি আসন বা রিল্যাক্সেশন বেছে নিন:' : 'Select a gentle posture or practice:'}
            </span>
            <div className="care-exercise-pills-row">
              {somaticExercises.map((ex, idx) => {
                const isSelected = activeExIdx === idx;
                const emoji = idx === 0 ? '🦋' : idx === 1 ? '👶' : idx === 2 ? '🦵' : idx === 3 ? '🌸' : '🌬️';
                return (
                  <button
                    key={ex.id}
                    onClick={() => handleSelectEx(idx)}
                    className={`care-exercise-pill-btn ${isSelected ? 'active' : ''}`}
                  >
                    <span className="care-ex-emoji">{emoji}</span>
                    <div className="care-ex-meta">
                      <strong className="care-ex-title">
                        {lang === 'bn' ? ex.titleBn.split('(')[0] : ex.title.split('(')[0]}
                      </strong>
                      <span className="care-ex-time">
                        {formatTime(ex.durationSec)} • {lang === 'bn' ? ex.difficultyBn : ex.difficulty}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Zen Breathing & Stretch Timer Card */}
          <div className="glass-card care-timer-card">
            <span className="status-pill normal" style={{ marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 600 }}>
              {lang === 'bn' ? currentEx.difficultyBn : currentEx.difficulty}
            </span>

            <h3 className="care-active-ex-name">
              {lang === 'bn' ? currentEx.titleBn : currentEx.title}
            </h3>

            <p className="care-active-ex-when">
              {lang === 'bn' ? currentEx.recommendedWhenBn : currentEx.recommendedWhen}
            </p>

            {/* Circular Zen Breath Timer */}
            <div className={`care-zen-ring ${isTimerRunning ? 'pulsing' : ''}`}>
              <span className="care-zen-digits">
                {formatTime(timerSec)}
              </span>
              <span className="care-zen-state">
                {isTimerRunning
                  ? (lang === 'bn' ? 'চলছে • শান্ত শ্বাস নিন' : 'Active • Breathe Gently')
                  : (lang === 'bn' ? 'প্রস্তুত' : 'Ready')}
              </span>
            </div>

            {/* Play/Pause/Reset Controls */}
            <div className="care-timer-actions">
              <button
                className="btn-primary care-play-btn"
                onClick={() => {
                  setIsTimerRunning(!isTimerRunning);
                  playSafeTap();
                }}
              >
                {isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
                <span>
                  {isTimerRunning
                    ? (lang === 'bn' ? 'সাময়িক থামান' : 'Pause')
                    : (lang === 'bn' ? 'অনুশীলন শুরু করুন' : 'Begin Practice')}
                </span>
              </button>

              <button
                className="btn-secondary care-reset-btn"
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSec(currentEx.durationSec);
                  playSafeTap();
                }}
                title="Reset Timer"
              >
                <RotateCcw size={16} />
                <span>{lang === 'bn' ? 'রিসেট' : 'Reset'}</span>
              </button>
            </div>
          </div>

          {/* Step-by-Step Guidance Card */}
          <div className="glass-card care-guidance-card">
            <h4 className="care-guidance-heading">
              📋 {lang === 'bn' ? 'সহজ ধাপে ধাপে আসন করার নিয়ম' : 'Step-by-Step Gentle Guidance'}
            </h4>

            <div className="care-steps-list">
              {(lang === 'bn' ? currentEx.guidanceBn : currentEx.guidance).map((step, idx) => (
                <div key={idx} className="care-step-item">
                  <div className="care-step-number">
                    {lang === 'bn' ? toBengaliNum(idx + 1) : idx + 1}
                  </div>
                  <p className="care-step-text">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* Clinical Benefit Highlight */}
            <div className="care-benefit-box">
              <span className="care-benefit-badge">
                💡 {lang === 'bn' ? 'শারীরিক উপকারিতা:' : 'Clinical Benefit:'}
              </span>
              <p className="care-benefit-desc">
                {lang === 'bn' ? currentEx.clinicalBenefitBn : currentEx.clinicalBenefit}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function for Bengali summary tags
function phaseSummaryTag(phaseId, lang) {
  if (lang === 'bn') {
    switch (phaseId) {
      case 1: return '১ম মাস • রক্তক্ষরণ ও অন্ত্রের সুস্থতা';
      case 2: return 'মাস ২-৩ • ইনসুলিন ও থাইরয়েড গতি';
      case 3: return 'মাস ৩-৬ • ইস্ট্রোজেন ডিটক্স ও ওভুলেশন';
      case 4: return 'মাস ৬+ • স্থায়ী সুস্থতা ও ব্যথাহীন জীবন';
      default: return 'আরোগ্য পর্যায়';
    }
  }
  switch (phaseId) {
    case 1: return 'Month 1 • Bleeding & Gut Healing';
    case 2: return 'Month 2-3 • Insulin & Thyroid Velocity';
    case 3: return 'Month 3-6 • Estrogen Detox & Ovulation';
    case 4: return 'Month 6+ • Sustained Remission';
    default: return 'Care Phase';
  }
}

// Helper to convert numbers to Bengali numerals
function toBengaliNum(n) {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(n).replace(/\d/g, d => bnDigits[Number(d)]);
}
