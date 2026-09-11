import React, { useState } from 'react';
import {
  HeartHandshake,
  ShieldAlert,
  Sparkles,
  BookOpen,
  Plus,
  Save,
  CheckCircle,
  Tag
} from 'lucide-react';
import { getStoredJournal, saveStoredJournal } from '../utils/storage';

export const ValidationJournal = () => {
  const [journalEntries, setJournalEntries] = useState(getStoredJournal());
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newEmotion, setNewEmotion] = useState('Heard & Validated');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const entry = {
      id: `j-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: newTitle,
      emotion: newEmotion,
      content: newContent,
      tags: ['Personal Journey', 'Self-Compassion']
    };

    const updated = [entry, ...journalEntries];
    setJournalEntries(updated);
    saveStoredJournal(updated);
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  const validationFacts = [
    {
      myth: '“Every woman has cramps, you just have low pain tolerance.”',
      truth: 'Physiological menstrual cramping involves mild uterine contractions. Adenomyosis involves ectopic endometrial glands growing deeply into the muscular myometrium, causing severe ischemia, muscle hypertrophy, and neurogenic inflammatory pain that can rival labor contractions.',
      source: 'International Journal of Gynecology & Obstetrics'
    },
    {
      myth: '“PCOS is your fault—you just need to eat less and exercise more.”',
      truth: 'PCOS is a complex metabolic and neuroendocrine disorder. Cellular insulin resistance impairs glucose transport into muscle and liver cells regardless of willpower, and hyperinsulinemia directly stimulates ovarian theca cells to overproduce androgens.',
      source: 'Endocrine Society Clinical Practice Guidelines'
    },
    {
      myth: '“Passing large blood clots and soaking through pads is standard.”',
      truth: 'Passing clots larger than a coin (1 inch) or soaking through a menstrual pad in under 1-2 hours is clinical menorrhagia. In adenomyosis, the enlarged, boggy uterus fails to contract symmetrically around open spiral arterioles.',
      source: 'American College of Obstetricians and Gynecologists (ACOG)'
    },
    {
      myth: '“You are too young to have a serious uterine condition.”',
      truth: 'Adenomyosis is increasingly diagnosed in women in their 20s and early 30s thanks to modern high-resolution Transvaginal Sonography (TVS) and MRI. Age does not invalidate cellular pathology.',
      source: 'Human Reproduction Update'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Validation Header */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(26, 30, 48, 0.95), rgba(45, 20, 50, 0.4))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
          <div className="card-icon-bubble purple">
            <HeartHandshake size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Medical Reality-Check & Mind Space</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Overcoming Medical Gaslighting & Honoring Chronic Reproductive Illness
            </span>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '800px', marginTop: '0.5rem' }}>
          Living with invisible chronic illnesses like PCOS and Adenomyosis often comes with dismissive comments from friends, family, and even healthcare professionals. This space exists to validate your lived experience with evidence-based medicine.
        </p>
      </div>

      {/* Myth vs Reality Grid */}
      <div>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={18} color="var(--accent-amber)" />
          What You’ve Been Told vs. The Clinical Reality
        </h3>
        <div className="grid-2">
          {validationFacts.map((fact, idx) => (
            <div key={idx} className="glass-card" style={{ borderLeft: '4px solid var(--accent-purple)' }}>
              <div style={{ marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-crimson)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                  Dismissive Remark
                </span>
                <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                  {fact.myth}
                </h4>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-pcos)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                  The Biological Truth
                </span>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {fact.truth}
                </p>
              </div>

              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Reference: {fact.source}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Trauma-Informed Journaling */}
      <div className="glass-card">
        <div className="glass-card-header">
          <div className="card-title-group">
            <div className="card-icon-bubble pcos">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Trauma-Informed Reflection Journal</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Private reflections, triumphs, and emotional release
              </span>
            </div>
          </div>

          {!isAdding && (
            <button className="btn-primary" onClick={() => setIsAdding(true)} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <Plus size={16} />
              Write Reflection
            </button>
          )}
        </div>

        {isAdding && (
          <form onSubmit={handleAddEntry} style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Title of this reflection..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-active)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit'
                }}
                required
              />

              <select
                value={newEmotion}
                onChange={(e) => setNewEmotion(e.target.value)}
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-active)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit'
                }}
              >
                <option value="Heard & Validated">Heard & Validated</option>
                <option value="Hopeful & Empowered">Hopeful & Empowered</option>
                <option value="Exhausted / Low Energy">Exhausted / Low Energy</option>
                <option value="Grieving Chronic Pain">Grieving Chronic Pain</option>
                <option value="Triumphant & Grateful">Triumphant & Grateful</option>
              </select>
            </div>

            <textarea
              rows="4"
              placeholder="What did your body or heart experience today? Honor your feelings without judgment..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-active)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              required
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
              <button type="button" className="btn-secondary" onClick={() => setIsAdding(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Save size={16} />
                Save Reflection
              </button>
            </div>
          </form>
        )}

        {/* Existing Journal Entries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {journalEntries.map(entry => (
            <div
              key={entry.id}
              style={{
                background: 'var(--bg-surface-elevated)',
                padding: '1.15rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{entry.title}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.75rem' }}>{entry.date}</span>
                </div>
                <span className="status-pill normal" style={{ background: 'rgba(157, 78, 221, 0.15)', color: 'var(--accent-purple)', border: '1px solid rgba(157, 78, 221, 0.3)' }}>
                  {entry.emotion}
                </span>
              </div>

              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '0.75rem' }}>
                {entry.content}
              </p>

              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {entry.tags?.map((t, idx) => (
                  <span key={idx} style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'var(--bg-surface)', padding: '2px 8px', borderRadius: '4px' }}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
