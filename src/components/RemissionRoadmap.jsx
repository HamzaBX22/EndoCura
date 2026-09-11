import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  Flame,
  Leaf,
  Target,
  Award,
  Clock,
  HeartHandshake
} from 'lucide-react';
import { triadRemissionPhases, deshiHealingFoods } from '../data/triadData';
import { translations } from '../data/translations';

export const RemissionRoadmap = ({
  lang = 'bn',
  profile,
  currentPhase = 1,
  onPhaseChange
}) => {
  const t = translations[lang] || translations.bn;
  const [activePhaseId, setActivePhaseId] = useState(currentPhase);
  const [completedItems, setCompletedItems] = useState({});

  const toggleCheckItem = (phaseId, idx) => {
    const key = `${phaseId}-${idx}`;
    setCompletedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const selectedPhase = triadRemissionPhases.find(p => p.id === activePhaseId) || triadRemissionPhases[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Remission Roadmap Hero Banner */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(26, 30, 48, 0.95), rgba(30, 50, 40, 0.45))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
              <span className="status-pill normal" style={{ background: 'rgba(0, 229, 163, 0.15)', color: 'var(--accent-pcos)' }}>
                {lang === 'bn' ? 'স্থায়ী নিরাময় রোডম্যাপ' : 'Permanent Remission Engine'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {lang === 'bn' ? '৪-ধাপের ক্লিনিক্যাল প্রোটোকল' : '4-Phase Clinical Triad Protocol'}
              </span>
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>{t.roadmapTitle}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '780px' }}>
              {t.roadmapSubtitle}. {lang === 'bn' ? 'শুধু ওষুধ খেয়ে উপসর্গ চেপে না রেখে, রোগের মূল শিকড় (ইনসুলিন, ইস্ট্রোজেন ডমিন্যান্স ও থাইরয়েড) নিরাময় করুন।' : 'Move beyond symptom suppression to resolve the root hormonal drivers: insulin resistance, estrogen dominance, and low T3 conversion.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-surface-elevated)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-active)' }}>
            <Award size={20} color="var(--accent-pcos)" />
            <span style={{ fontSize: '0.85rem' }}>
              {lang === 'bn' ? 'বর্তমান পর্যায়:' : 'Current Status:'} <strong>{lang === 'bn' ? `ধাপ ${activePhaseId}` : `Phase ${activePhaseId}`}</strong>
            </span>
          </div>
        </div>

        {/* 4 Phase Step Indicators */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginTop: '1.5rem' }}>
          {triadRemissionPhases.map((phase) => {
            const isActive = activePhaseId === phase.id;
            return (
              <button
                key={phase.id}
                onClick={() => setActivePhaseId(phase.id)}
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'rgba(0, 229, 163, 0.15)' : 'var(--bg-surface-elevated)',
                  border: `1px solid ${isActive ? 'var(--accent-pcos)' : 'var(--border-subtle)'}`,
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isActive ? 'var(--accent-pcos)' : 'var(--text-muted)' }}>
                    {phase.duration}
                  </span>
                  {isActive && <CheckCircle2 size={16} color="var(--accent-pcos)" />}
                </div>
                <strong style={{ fontSize: '0.85rem', display: 'block', lineHeight: 1.3 }}>
                  {lang === 'bn' ? phase.titleBn : phase.titleEn}
                </strong>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Phase Deep Dive */}
      <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-pcos)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="status-pill normal" style={{ marginBottom: '0.35rem' }}>
              {selectedPhase.duration}
            </span>
            <h3 style={{ fontSize: '1.3rem', marginTop: '0.2rem' }}>
              {lang === 'bn' ? selectedPhase.titleBn : selectedPhase.titleEn}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.3rem' }}>
              {lang === 'bn' ? selectedPhase.focusBn : selectedPhase.focusEn}
            </p>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
              {lang === 'bn' ? 'টার্গেট বায়োমার্কার' : 'Target Clinical Biomarkers'}
            </span>
            <strong style={{ fontSize: '0.88rem', color: 'var(--accent-pcos)', fontFamily: 'var(--font-mono)' }}>
              {selectedPhase.targetBiomarker}
            </strong>
          </div>
        </div>

        {/* Actionable Daily Checklist */}
        <div style={{ marginTop: '1.25rem' }}>
          <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
            {lang === 'bn' ? 'এই ধাপের সুনির্দিষ্ট অ্যাকশন চেকলিস্ট' : 'Actionable Daily Protocol Checklist'}
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {(lang === 'bn' ? selectedPhase.actionChecklistBn : selectedPhase.actionChecklistEn).map((task, idx) => {
              const isDone = completedItems[`${selectedPhase.id}-${idx}`] || false;
              return (
                <div
                  key={idx}
                  onClick={() => toggleCheckItem(selectedPhase.id, idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: isDone ? 'rgba(0, 229, 163, 0.1)' : 'var(--bg-surface-elevated)',
                    border: `1px solid ${isDone ? 'var(--accent-pcos)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  {isDone ? (
                    <CheckCircle2 size={20} color="var(--accent-pcos)" />
                  ) : (
                    <Circle size={20} color="var(--text-muted)" />
                  )}
                  <span style={{ fontSize: '0.88rem', color: isDone ? 'var(--text-primary)' : 'var(--text-secondary)', textDecoration: isDone ? 'line-through' : 'none' }}>
                    {task}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Deshi Healing Clinical Superfoods Section */}
      <div className="glass-card">
        <div className="glass-card-header">
          <div className="card-title-group">
            <div className="card-icon-bubble pcos">
              <Leaf size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem' }}>
                {lang === 'bn' ? 'দেশীয় সহজলভ্য প্রাকৃতিক আরোগ্য খাবার' : 'Local Deshi Functional Healing Superfoods'}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {lang === 'bn' ? 'বাংলাদেশ ও দক্ষিণ এশিয়ার উপযোগী হরমোন-ব্যালান্সিং খাদ্য' : 'Locally accessible, hormone-balancing functional culinary medicine'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid-2" style={{ marginTop: '0.5rem' }}>
          {deshiHealingFoods.map((food, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-surface-elevated)',
                padding: '1.15rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                    {lang === 'bn' ? food.nameBn : food.nameEn}
                  </h4>
                  <span className="status-pill normal" style={{ fontSize: '0.7rem' }}>
                    {food.target}
                  </span>
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                  {lang === 'bn' ? food.benefitBn : food.benefitEn}
                </p>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--accent-pcos)', borderLeft: '3px solid var(--accent-pcos)' }}>
                <strong>{lang === 'bn' ? 'খাওয়ার সঠিক নিয়ম:' : 'Clinical Usage:'}</strong> {food.usage}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
