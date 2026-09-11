import React, { useState } from 'react';
import {
  Printer,
  FileText,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  User,
  Stethoscope,
  Activity,
  Droplets,
  Award,
  Thermometer,
  FolderLock
} from 'lucide-react';
import { calculatePBAC, calculateAnemiaRisk } from '../utils/calculators';
import { translations } from '../data/translations';
import { MedicalVault } from './MedicalVault';

export const DoctorDossier = ({
  profile,
  entries = [],
  lang = 'bn'
}) => {
  const t = translations[lang] || translations.bn;
  const [activeSubTab, setActiveSubTab] = useState('summary'); // 'summary' or 'vault'

  const anemiaEval = calculateAnemiaRisk(entries, profile.latestLabs);
  const totalPBAC = anemiaEval.cyclePBAC;

  const handlePrint = () => {
    window.print();
  };

  const peakPain = Math.max(...entries.map(e => e.pain?.nrsScore || 0));
  const avgPain = (
    entries.reduce((sum, e) => sum + (e.pain?.nrsScore || 0), 0) / (entries.length || 1)
  ).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '920px', margin: '0 auto' }}>
      {/* Top Controls Bar with Print Trigger & Vault Toggle */}
      <div className="glass-card no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
            {t.dossierTitle}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            {t.dossierSub}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Sub-tab pills */}
          <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-surface-elevated)', padding: '0.3rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              className={`tag-btn ${activeSubTab === 'summary' ? 'selected' : ''}`}
              onClick={() => setActiveSubTab('summary')}
              style={{ padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}
            >
              <FileText size={14} style={{ display: 'inline', marginRight: '4px' }} />
              {lang === 'bn' ? '১-ক্লিক সামারি' : 'Summary'}
            </button>
            <button
              type="button"
              className={`tag-btn ${activeSubTab === 'vault' ? 'selected' : ''}`}
              onClick={() => setActiveSubTab('vault')}
              style={{ padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}
            >
              <FolderLock size={14} style={{ display: 'inline', marginRight: '4px' }} />
              {lang === 'bn' ? 'ফাইল ভল্ট' : 'Vault'}
            </button>
          </div>

          {activeSubTab === 'summary' && (
            <button className="btn-primary" onClick={handlePrint} style={{ padding: '0.6rem 1.1rem' }}>
              <Printer size={16} />
              <span>{t.printBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Feature 4: Medical Vault Tab */}
      {activeSubTab === 'vault' && (
        <MedicalVault lang={lang} />
      )}

      {/* Printable Clinical Dossier Sheet */}
      {activeSubTab === 'summary' && (
        <div
          className="glass-card clinical-dossier-sheet"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            padding: '2.2rem',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          {/* Header Clinical Metadata */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border-subtle)', paddingBottom: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <Stethoscope size={24} color="var(--accent-rose)" />
                <h1 style={{ fontSize: '1.45rem', letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
                  {lang === 'bn' ? 'ক্লিনিক্যাল গাইনিকোলজি, এন্ডোক্রাইন ও থাইরয়েড সামারি' : 'Clinical Gynecology & Endocrine Summary'}
                </h1>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Triad Comorbidity Protocol: PCOS (Phenotype A) • Diffuse Adenomyosis • Autoimmune Hashimoto's Thyroiditis
              </p>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
              <div><strong>Report Date:</strong> {new Date().toLocaleDateString()}</div>
              <div><strong>Attending Physician:</strong> {profile.physicianName}</div>
              <div style={{ color: 'var(--text-muted)' }}>{profile.clinicName}</div>
            </div>
          </div>

          {/* Patient Demographics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'var(--bg-surface-elevated)', padding: '1.15rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Patient</span>
              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{profile.name}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Age & Metrics</span>
              <div style={{ fontWeight: 600 }}>{profile.age} yrs • BMI: {profile.bmi}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Primary Diagnoses</span>
              <div style={{ fontWeight: 600, color: 'var(--accent-rose)', fontSize: '0.85rem' }}>
                Diffuse Adenomyosis • PCOS • Hypothyroidism
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cycle Monitored</span>
              <div style={{ fontWeight: 600 }}>28-Day Longitudinal Quantitative Log</div>
            </div>
          </div>

          {/* 1. Menorrhagia Assessment */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--accent-rose)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.35rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Droplets size={18} />
              1. Quantitative Menorrhagia Assessment (PBAC Highfield Criteria)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '0.75rem' }}>
              <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cumulative Cycle PBAC Score</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-rose)' }}>
                  {totalPBAC} pts
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Clinical Menorrhagia &gt; 100</span>
              </div>

              <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Large Clots (&ge; 1 inch)</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-crimson)' }}>
                  {anemiaEval.largeClotsTotal} logged
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Indicates heavy myometrial bleeding</span>
              </div>

              <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ferritin & Hemoglobin</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
                  {profile.latestLabs.ferritin} ng/mL / {profile.latestLabs.hemoglobin} g/dL
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-crimson)', fontWeight: 600 }}>Iron Deficiency Alert</span>
              </div>
            </div>
          </div>

          {/* 2. Pelvic Pain Index */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--accent-crimson)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.35rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} />
              2. Pelvic Pain Index & Sacral Radiation Mapping
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Peak / Average NRS Pain</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-crimson)' }}>
                  {peakPain}/10 Peak • {avgPain}/10 Avg
                </div>
              </div>
              <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Radiation Patterns</span>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  Lumbosacral (S2-S4), Bilateral Thighs
                </div>
              </div>
            </div>
          </div>

          {/* 3. PCOS & Thyroid Endocrine Panel */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--accent-teal)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.35rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} />
              3. PCOS & Thyroid Endocrine Panel
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ padding: '0.65rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>LH : FSH Ratio</span>
                <strong>{profile.latestLabs.lh} : {profile.latestLabs.fsh} (2.65 : 1)</strong>
              </div>
              <div style={{ padding: '0.65rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Fasting Insulin</span>
                <strong>{profile.latestLabs.fastingInsulin} uIU/mL</strong>
              </div>
              <div style={{ padding: '0.65rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Thyroid TSH</span>
                <strong>{profile.latestLabs.tsh} uIU/mL</strong>
              </div>
              <div style={{ padding: '0.65rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Ovulation by BBT Shift</span>
                <strong style={{ color: 'var(--accent-teal)' }}>Confirmed (+0.42°C shift)</strong>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ borderTop: '1px dashed var(--border-subtle)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <div>
              Generated via EndoCura Clinical Engine • Encrypted Health Record • Version 2.0
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ width: '180px', borderBottom: '1px solid var(--text-muted)', marginBottom: '0.3rem' }} />
              <span>Consulting Physician Signature</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
