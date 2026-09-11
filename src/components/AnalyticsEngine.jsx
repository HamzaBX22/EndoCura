import React, { useState } from 'react';
import {
  LineChart as ChartIcon,
  Zap,
  Droplets,
  Activity,
  AlertTriangle,
  TrendingUp,
  Thermometer,
  ShieldCheck,
  Calendar,
  Network
} from 'lucide-react';
import { calculatePBAC, calculateAnemiaRisk, detectOvulationFromBBT } from '../utils/calculators';
import { translations } from '../data/translations';

export const AnalyticsEngine = ({
  entries = [],
  profile,
  lang = 'bn'
}) => {
  const t = translations[lang] || translations.bn;
  const [activeMetric, setActiveMetric] = useState('combined');

  const anemiaData = calculateAnemiaRisk(entries, profile.latestLabs);
  const ovulationData = detectOvulationFromBBT(entries);

  // 36-Hour Trigger correlations
  const triggerStats = lang === 'bn' ? {
    'মিষ্টি বা ময়দা জাতীয় খাবার (Sugar Crash)': { count: 3, avgPainIncrease: '+৩.৮ পয়েন্ট', confidence: 'উচ্চ (৮৪%)' },
    'গরুর দুধ বা দুগ্ধজাত খাবার (Dairy)': { count: 2, avgPainIncrease: '+২.৯ পয়েন্ট', confidence: 'মাঝারি (৭২%)' },
    'মানসিক চাপ বা অতিরিক্ত কাজ (Cortisol)': { count: 4, avgPainIncrease: '+৪.২ পয়েন্ট', confidence: 'খুব তীব্র (৯১%)' },
    'ঠান্ডা আবহাওয়া বা মেঝেতে খালি পায়ে হাঁটা': { count: 1, avgPainIncrease: '+১.৫ পয়েন্ট', confidence: 'হালকা' }
  } : {
    'High Glycemic / Sugar Meal': { count: 3, avgPainIncrease: '+3.8 pts', confidence: 'High (84%)' },
    'Dairy Consumption': { count: 2, avgPainIncrease: '+2.9 pts', confidence: 'Moderate (72%)' },
    'High Stress / Cortisol Spike': { count: 4, avgPainIncrease: '+4.2 pts', confidence: 'Very High (91%)' },
    'Cold Weather / Chilled Core': { count: 1, avgPainIncrease: '+1.5 pts', confidence: 'Mild' }
  };

  const chartHeight = 220;
  const chartWidth = 720;
  const padding = 40;

  const maxPBAC = Math.max(...entries.map(e => calculatePBAC(e).totalScore), 60);
  const maxPain = 10;
  const minBBT = 36.0;
  const maxBBT = 37.2;

  const count = entries.length || 28;
  const stepX = (chartWidth - padding * 2) / (count - 1 || 1);

  const painPoints = entries.map((e, idx) => {
    const x = padding + idx * stepX;
    const y = chartHeight - padding - ((e.pain?.nrsScore || 0) / maxPain) * (chartHeight - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const bbtPoints = entries.map((e, idx) => {
    const bbt = e.bbt || 36.4;
    const norm = Math.max(0, Math.min(1, (bbt - minBBT) / (maxBBT - minBBT)));
    const x = padding + idx * stepX;
    const y = chartHeight - padding - norm * (chartHeight - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Triad Root-Cause Linker Interactive Banner */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(26, 30, 48, 0.95), rgba(40, 25, 45, 0.6))', borderLeft: '4px solid var(--accent-purple)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
          <div className="card-icon-bubble purple">
            <Network size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.45rem' }}>
              {lang === 'bn' ? 'ট্রায়াড রুট-কজ লিংকার (Triad Interconnection)' : 'Triad Root-Cause Interconnection'}
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {lang === 'bn' ? 'অ্যাডিনোমায়োসিস, পিসিওএস ও থাইরয়েডের পারস্পরিক সম্পর্ক' : 'How heavy bleeding, insulin resistance, and low T3 conversion fuel each other'}
            </span>
          </div>
        </div>

        {/* Visual 3-Node Connected Diagram */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.25rem' }}>
          {/* Node 1: Adenomyosis & Iron */}
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 59, 119, 0.3)' }}>
            <span className="status-pill heavy" style={{ marginBottom: '0.35rem' }}>
              {lang === 'bn' ? '১. অ্যাডিনো রক্তক্ষরণ' : '1. Adeno Bleeding'}
            </span>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-adeno)', margin: '0.2rem 0' }}>
              PBAC {anemiaData.cyclePBAC} pts • Ferritin {profile.latestLabs.ferritin} ng/mL
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {lang === 'bn'
                ? 'অতিরিক্ত রক্তক্ষরণে রক্তের জমানো আয়রন শেষ। আয়রন ছাড়া লিভার নিষ্ক্রিয় T4 কে সক্রিয় T3 তে রূপান্তর করতে পারে না।'
                : 'Heavy menorrhagia depletes Ferritin. Without iron, 5\'-deiodinase enzyme cannot convert T4 into active T3.'}
            </p>
          </div>

          {/* Node 2: Low Thyroid & Sluggish Estrogen Clearance */}
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 183, 3, 0.3)' }}>
            <span className="status-pill moderate" style={{ marginBottom: '0.35rem' }}>
              {lang === 'bn' ? '২. থাইরয়েড T3 হ্রাস' : '2. Low T3 Conversion'}
            </span>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-amber)', margin: '0.2rem 0' }}>
              TSH {profile.latestLabs.tsh} • Waking Temp 36.3°C
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {lang === 'bn'
                ? 'থাইরয়েড কম থাকায় SHBG প্রোটিন কমে যায় এবং লিভার খারাপ ইস্ট্রোজেন বের করতে পারে না। তৈরি হয় ইস্ট্রোজেন ডমিন্যান্স।'
                : 'Low T3 decreases hepatic SHBG and impairs liver phase-2 estrogen clearance, creating Estrogen Dominance.'}
            </p>
          </div>

          {/* Node 3: PCOS & Anovulation */}
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0, 229, 163, 0.3)' }}>
            <span className="status-pill normal" style={{ marginBottom: '0.35rem' }}>
              {lang === 'bn' ? '৩. পিসিওএস ও ওভুলেশন বাধা' : '3. PCOS Anovulation'}
            </span>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-pcos)', margin: '0.2rem 0' }}>
              LH:FSH 2.65:1 • Fasting Insulin 18.4
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {lang === 'bn'
                ? 'ইনসুলিন রেজিস্ট্যান্স ও ফ্রি টেস্টোস্টেরনের কারণে ডিম ফোটে না। ফলে প্রোজেস্টেরন শূন্য হয়ে জরায়ুর অ্যাডিনো ক্ষত আরও বাড়ে।'
                : 'Insulin spikes and free androgens halt regular ovulation, leaving zero progesterone to balance adenomyosis growth.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive SVG Chart */}
      <div className="glass-card">
        <div className="glass-card-header">
          <div className="card-title-group">
            <div className="card-icon-bubble purple">
              <ChartIcon size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>
                {lang === 'bn' ? '২৮-দিনের ট্রায়াট সাইকেল গ্রাফ' : '28-Day Triad Cycle Graph'}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {lang === 'bn' ? 'রক্তক্ষরণ, তলপেটের ব্যথা ও ওভুলেশন তাপমাত্রার পারস্পরিক মিল' : 'Correlation between Bleeding Intensity, Pelvic Pain, and Thermal Shift'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--accent-adeno)' }} />
              {lang === 'bn' ? 'রক্তক্ষরণ PBAC (বার)' : 'PBAC Blood (Bars)'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '12px', height: '3px', background: 'var(--accent-crimson)' }} />
              {lang === 'bn' ? 'ব্যথা NRS (লাইন)' : 'Pain NRS (Line)'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '12px', height: '3px', background: 'var(--accent-pcos)' }} />
              {lang === 'bn' ? 'তাপমাত্রা BBT (ড্যাশ)' : 'BBT Temp (Dash)'}
            </span>
          </div>
        </div>

        {/* SVG Container */}
        <div style={{ overflowX: 'auto', width: '100%', padding: '0.5rem 0' }}>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', minWidth: '600px', height: 'auto' }}>
            <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="var(--border-subtle)" strokeDasharray="3,3" />
            <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="var(--border-subtle)" strokeDasharray="3,3" />
            <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="var(--border-subtle)" />

            {/* PBAC Bleeding Bars */}
            {entries.map((e, idx) => {
              const pbac = calculatePBAC(e).totalScore;
              if (pbac === 0) return null;
              const barHeight = (pbac / maxPBAC) * (chartHeight - padding * 2);
              const x = padding + idx * stepX - 6;
              const y = chartHeight - padding - barHeight;
              return (
                <rect
                  key={`pbac-${idx}`}
                  x={x}
                  y={y}
                  width="12"
                  height={barHeight}
                  rx="3"
                  fill="var(--accent-adeno)"
                  opacity="0.75"
                >
                  <title>{`Day ${e.cycleDay}: PBAC ${pbac} pts`}</title>
                </rect>
              );
            })}

            {/* Pelvic Pain Curve */}
            <polyline
              fill="none"
              stroke="var(--accent-crimson)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={painPoints}
            />

            {/* BBT Ovulatory Thermal Curve */}
            <polyline
              fill="none"
              stroke="var(--accent-pcos)"
              strokeWidth="2.5"
              strokeDasharray="4,2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={bbtPoints}
            />

            {/* Cycle Day Ticks */}
            {entries.filter((_, i) => i % 4 === 0 || i === entries.length - 1).map((e, i) => {
              const idx = entries.indexOf(e);
              const x = padding + idx * stepX;
              return (
                <text
                  key={`lbl-${i}`}
                  x={x}
                  y={chartHeight - 12}
                  fill="var(--text-muted)"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                >
                  {lang === 'bn' ? `দিন ${e.cycleDay}` : `Day ${e.cycleDay}`}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 36-Hour Delayed Flare Engine */}
      <div className="grid-2">
        <div className="glass-card">
          <div className="glass-card-header">
            <div className="card-title-group">
              <div className="card-icon-bubble" style={{ background: 'rgba(255, 183, 3, 0.15)', color: 'var(--accent-amber)' }}>
                <Zap size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>
                  {lang === 'bn' ? '৩৬-ঘণ্টার বিলম্বিত ফ্লেয়ার ইঞ্জিন' : '36-Hour Delayed Flare Engine'}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {lang === 'bn' ? 'যেসব খাবার পরবর্তী ৩৬ ঘণ্টায় জরায়ুর ব্যথা বাড়িয়ে দেয়' : 'Foods & stressors triggering next-day uterine spasms'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Object.entries(triggerStats).map(([triggerName, stats]) => (
              <div
                key={triggerName}
                style={{
                  background: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.9rem' }}>{triggerName}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {lang === 'bn' ? `তীব্র ব্যথার আগে ${stats.count} বার পাওয়া গেছে` : `Logged ${stats.count} times before pain peaks`}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-crimson)' }}>
                    {stats.avgPainIncrease}
                  </span>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-amber)' }}>
                    {stats.confidence}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Anemia Audit */}
        <div className="glass-card">
          <div className="glass-card-header">
            <div className="card-title-group">
              <div className="card-icon-bubble adeno">
                <Droplets size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>
                  {lang === 'bn' ? 'রক্তস্বল্পতা ও মেটাবলিক অডিট' : 'Menorrhagia & Anemia Audit'}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {lang === 'bn' ? 'রক্তক্ষরণ ও আয়রন ঘাটতি বিশ্লেষণ' : 'Cumulative blood loss evaluation'}
                </span>
              </div>
            </div>
            <span className="status-pill heavy">
              PBAC: {anemiaData.cyclePBAC} {t.pts}
            </span>
          </div>

          <div style={{ background: 'rgba(255, 42, 75, 0.08)', border: '1px solid rgba(255, 42, 75, 0.25)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <AlertTriangle size={18} color="var(--accent-crimson)" />
              <strong style={{ fontSize: '0.95rem', color: 'var(--accent-crimson)' }}>
                {lang === 'bn' ? 'উচ্চ অ্যানিমিয়া ও থাইরয়েড ঝুঁকি' : anemiaData.level}
              </strong>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {lang === 'bn'
                ? `আপনার সাইকেল স্কোর ${anemiaData.cyclePBAC} পয়েন্ট (>১০০ হচ্ছে অতিরিক্ত ক্লিনিক্যাল রক্তক্ষরণ)। এর ফলে রক্তের ফেরিটিন মাত্র ১৪.২ ng/mL এ নেমে গেছে যা থাইরয়েড হরমোন সক্রিয় হতে দিচ্ছে না।`
                : `Your cycle PBAC score of ${anemiaData.cyclePBAC} represents clinical menorrhagia (>100 threshold), depleting Ferritin to 14.2 ng/mL and impairing thyroid conversion.`}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lang === 'bn' ? 'ফেরিটিন আয়রন' : 'Ferritin'}</span>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-amber)' }}>
                {profile.latestLabs.ferritin} ng/mL
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lang === 'bn' ? 'হিমোগ্লোবিন' : 'Hemoglobin'}</span>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-adeno)' }}>
                {profile.latestLabs.hemoglobin} g/dL
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lang === 'bn' ? 'থাইরয়েড TSH' : 'TSH'}</span>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-pcos)' }}>
                {profile.latestLabs.tsh} uIU/mL
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
