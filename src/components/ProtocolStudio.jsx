import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Activity,
  Pill,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Check,
  Flame,
  Info,
  ChevronRight
} from 'lucide-react';
import { recipesData } from '../data/recipesData';
import { somaticExercises } from '../data/somaticExercises';
import { supplementsData } from '../data/supplementsData';
import { soundSynth } from '../utils/soundSynthesizer';

export const ProtocolStudio = () => {
  const [activeSection, setActiveSection] = useState('nutrition'); // 'nutrition', 'movement', 'supplements'
  const [selectedRecipeCategory, setSelectedRecipeCategory] = useState('All');

  // Interactive Somatic Timer State
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const currentExercise = somaticExercises[activeExerciseIndex];
  const [timerSeconds, setTimerSeconds] = useState(currentExercise.durationSec);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Supplements adherence state
  const [adherence, setAdherence] = useState({
    'supp-1': true,
    'supp-2': true,
    'supp-3': true,
    'supp-4': false,
    'supp-5': true,
    'supp-6': false
  });

  // Switch exercise and reset timer
  const handleSelectExercise = (idx) => {
    setActiveExerciseIndex(idx);
    setTimerSeconds(somaticExercises[idx].durationSec);
    setIsTimerRunning(false);
  };

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      soundSynth.playGong(); // Play completion sound
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const toggleAdherence = (id) => {
    setAdherence(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredRecipes = selectedRecipeCategory === 'All'
    ? recipesData
    : recipesData.filter(r => r.category.toLowerCase().includes(selectedRecipeCategory.toLowerCase()));

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Sub-Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.65rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        <button
          className={`nav-tab-btn ${activeSection === 'nutrition' ? 'active' : ''}`}
          onClick={() => setActiveSection('nutrition')}
        >
          <Utensils size={16} />
          Anti-Inflammatory Nutrition (Low-GI)
        </button>
        <button
          className={`nav-tab-btn ${activeSection === 'movement' ? 'active' : ''}`}
          onClick={() => setActiveSection('movement')}
        >
          <Activity size={16} />
          Somatic Movement & Pelvic Decompression
        </button>
        <button
          className={`nav-tab-btn ${activeSection === 'supplements' ? 'active' : ''}`}
          onClick={() => setActiveSection('supplements')}
        >
          <Pill size={16} />
          Evidence-Based Supplement Stack
        </button>
      </div>

      {/* =========================================================
          SECTION 1: NUTRITION & DUAL-CONDITION RECIPES
         ========================================================= */}
      {activeSection === 'nutrition' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(26, 30, 48, 0.95), rgba(40, 20, 30, 0.4))' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>Dual-Condition Culinary Medicine</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '750px' }}>
                  Standard healthy diets often fail because high-fiber raw crucifers cause adenomyosis pelvic bloating, while sweet fruit smoothies spike PCOS insulin. Every recipe here balances <strong>ultra-low glycemic index</strong> with <strong>prostaglandin-suppressing nutrients</strong>.
                </p>
              </div>

              {/* Filter Pills */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {['All', 'Breakfast', 'Lunch', 'Dinner', 'Elixir'].map(cat => (
                  <button
                    key={cat}
                    className={`tag-btn ${selectedRecipeCategory === cat ? 'selected' : ''}`}
                    onClick={() => setSelectedRecipeCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid-2">
            {filteredRecipes.map(recipe => (
              <div key={recipe.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <span className="status-pill normal" style={{ marginBottom: '0.4rem' }}>{recipe.category} • {recipe.time}</span>
                      <h4 style={{ fontSize: '1.15rem', marginTop: '0.3rem' }}>{recipe.title}</h4>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'rgba(0, 229, 163, 0.15)', color: 'var(--accent-pcos)' }}>
                      {recipe.giRating}
                    </span>
                  </div>

                  {/* Hormone Target */}
                  <div style={{ background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', padding: '0.75rem', marginBottom: '1rem', borderLeft: '3px solid var(--accent-purple)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>Hormonal & Uterine Target:</strong>
                    {recipe.hormoneTarget}
                  </div>

                  {/* Ingredients */}
                  <div style={{ marginBottom: '1rem' }}>
                    <h5 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>Key Functional Ingredients</h5>
                    <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {recipe.ingredients.map((ing, idx) => (
                        <li key={idx}>{ing}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h5 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>Preparation Guidance</h5>
                    <ol style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {recipe.instructions.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  <strong>Clinical Pearl:</strong> {recipe.clinicalNote}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          SECTION 2: SOMATIC MOVEMENT & PELVIC DECOMPRESSION
         ========================================================= */}
      {activeSection === 'movement' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>Pelvic Floor De-gripping & Somatic Vagus Reset</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '800px' }}>
              High-intensity workouts can spike cortisol (worsening PCOS insulin resistance) and trigger pelvic spasm guarding (amplifying adenomyosis pain). These restorative somatic movements release levator ani tone and facilitate venous drainage.
            </p>
          </div>

          <div className="grid-2">
            {/* Interactive Timer & Active Exercise */}
            <div className="glass-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span className="status-pill normal" style={{ marginBottom: '0.75rem' }}>
                {currentExercise.difficulty} • {currentExercise.focusArea}
              </span>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{currentExercise.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '450px', marginBottom: '1.5rem' }}>
                {currentExercise.recommendedWhen}
              </p>

              {/* Circular Digital Countdown */}
              <div
                style={{
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  border: '4px solid var(--accent-pcos)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  background: 'rgba(0, 229, 163, 0.06)',
                  boxShadow: isTimerRunning ? '0 0 35px rgba(0, 229, 163, 0.3)' : 'none',
                  transition: 'var(--transition)'
                }}
              >
                <span style={{ fontSize: '2.8rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-pcos)' }}>
                  {formatTime(timerSeconds)}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {isTimerRunning ? 'Active Release' : 'Ready'}
                </span>
              </div>

              {/* Timer Controls */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  className="btn-primary"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  style={{ minWidth: '120px' }}
                >
                  {isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
                  <span>{isTimerRunning ? 'Pause' : 'Begin'}</span>
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(currentExercise.durationSec);
                  }}
                >
                  <RotateCcw size={18} />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Exercise Details & Selection List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="glass-card">
                <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
                  Step-by-Step Somatic Guidance
                </h4>
                <ol style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {currentExercise.guidance.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>

                <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', borderLeft: '3px solid var(--accent-pcos)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>Clinical Biomechanics:</strong>
                  {currentExercise.clinicalBenefit}
                </div>
              </div>

              {/* Select Other Somatics */}
              <div className="glass-card">
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
                  Movement Library
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {somaticExercises.map((ex, idx) => (
                    <button
                      key={ex.id}
                      onClick={() => handleSelectExercise(idx)}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: activeExerciseIndex === idx ? 'rgba(0, 229, 163, 0.15)' : 'var(--bg-surface-elevated)',
                        border: `1px solid ${activeExerciseIndex === idx ? 'var(--accent-pcos)' : 'var(--border-subtle)'}`,
                        color: 'var(--text-primary)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        textAlign: 'left'
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '0.88rem', display: 'block' }}>{ex.title}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatTime(ex.durationSec)} • {ex.focusArea}</span>
                      </div>
                      <ChevronRight size={16} color={activeExerciseIndex === idx ? 'var(--accent-pcos)' : 'var(--text-muted)'} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          SECTION 3: SUPPLEMENT & RX ADHERENCE STACK
         ========================================================= */}
      {activeSection === 'supplements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>Targeted Clinical Nutraceutical & Rx Stack</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Nutraceuticals verified by randomized controlled trials to modulate androgen receptor sensitivity, support follicular maturation, and suppress endometrial myometrial prostaglandins.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {supplementsData.map(supp => {
              const isTaken = adherence[supp.id] || false;
              return (
                <div
                  key={supp.id}
                  className="glass-card"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1.25rem',
                    flexWrap: 'wrap',
                    padding: '1.15rem 1.5rem',
                    borderLeft: `4px solid ${supp.targetCondition.includes('PCOS') ? 'var(--accent-pcos)' : 'var(--accent-adeno)'}`
                  }}
                >
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                      <span className={`status-pill ${supp.targetCondition.includes('PCOS') ? 'normal' : 'heavy'}`}>
                        {supp.targetCondition}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{supp.evidenceGrade}</span>
                    </div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>{supp.name}</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      {supp.mechanism}
                    </p>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <strong>Dosage & Timing:</strong> {supp.clinicalDosage} • {supp.timing}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                      onClick={() => toggleAdherence(supp.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.65rem 1.25rem',
                        borderRadius: 'var(--radius-full)',
                        background: isTaken ? 'rgba(0, 229, 163, 0.2)' : 'var(--bg-surface-elevated)',
                        border: `1px solid ${isTaken ? 'var(--accent-pcos)' : 'var(--border-active)'}`,
                        color: isTaken ? 'var(--accent-pcos)' : 'var(--text-secondary)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        transition: 'var(--transition)'
                      }}
                    >
                      {isTaken ? <Check size={16} /> : null}
                      <span>{isTaken ? 'Taken Today' : 'Mark Taken'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
