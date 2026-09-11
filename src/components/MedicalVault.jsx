import React, { useState, useEffect } from 'react';
import {
  FolderLock,
  Plus,
  FileText,
  Image as ImageIcon,
  Calendar,
  Trash2,
  Eye,
  Download,
  CheckCircle2,
  X
} from 'lucide-react';

const STORAGE_KEY_VAULT = 'endocura_medical_vault_v1';

export const MedicalVault = ({ lang = 'bn' }) => {
  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VAULT);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'doc-1',
        title: lang === 'bn' ? 'টিভিএস আল্ট্রাসাউন্ড রিপোর্ট (TVS Scan)' : 'Transvaginal Pelvic Ultrasound',
        category: 'Ultrasound',
        date: '2026-06-20',
        doctor: 'Dr. Nusrat Chowdhury',
        summary: 'Globular asymmetric uterus, posterior adenomyoma infiltration, bilateral PCO appearance.',
        fileName: 'TVS_Pelvic_Scan_Report.pdf'
      },
      {
        id: 'doc-2',
        title: lang === 'bn' ? 'থাইরয়েড ও রিপ্রোডাক্টিভ হরমোন টেস্ট' : 'Thyroid & Hormone Panel',
        category: 'Lab Test',
        date: '2026-08-15',
        doctor: 'Popular Diagnostic Center',
        summary: 'Ferritin: 14.2 ng/mL (Low), TSH: 2.1 uIU/mL, LH:FSH: 2.65:1, Fasting Insulin: 18.4.',
        fileName: 'Thyroid_Hormone_Blood_Test.pdf'
      },
      {
        id: 'doc-3',
        title: lang === 'bn' ? 'গাইনিকোলজি প্রেসক্রিপশন ও ওষুধ তালিকা' : 'Gynecology Prescription',
        category: 'Prescription',
        date: '2026-08-20',
        doctor: 'Dr. Nusrat Chowdhury, FCPS',
        summary: 'Prescribed Tranexamic Acid (TXA) for heavy flow, Myo-Inositol 40:1, and Iron Bisglycinate.',
        fileName: 'Prescription_Aug_2026.jpg'
      }
    ];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Ultrasound');
  const [newDoctor, setNewDoctor] = useState('');
  const [newSummary, setNewSummary] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_VAULT, JSON.stringify(documents));
  }, [documents]);

  const handleAddDoc = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEntry = {
      id: `doc-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      date: new Date().toISOString().split('T')[0],
      doctor: newDoctor || (lang === 'bn' ? 'ডাক্তার' : 'Physician'),
      summary: newSummary || (lang === 'bn' ? 'মেডিকেল ডকুমেন্ট সংরক্ষিত।' : 'Medical report saved.'),
      fileName: `${newTitle.replace(/\s+/g, '_')}.pdf`
    };

    setDocuments([newEntry, ...documents]);
    setNewTitle('');
    setNewDoctor('');
    setNewSummary('');
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    if (window.confirm(lang === 'bn' ? 'এই রিপোর্টটি মুছে ফেলতে চান?' : 'Delete this document?')) {
      setDocuments(documents.filter(d => d.id !== id));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '850px', margin: '0 auto' }}>
      {/* Header */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
            <FolderLock size={20} color="var(--accent-rose)" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              {lang === 'bn' ? 'মেডিকেল রিপোর্ট ও প্রেসক্রিপশন ভল্ট' : 'Medical Reports Vault'}
            </h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            {lang === 'bn' ? 'আল্ট্রাসাউন্ড, থাইরয়েড টেস্ট ও প্রেসক্রিপশন নিরাপদে এক ফোল্ডারে রাখুন' : 'Safely organize your ultrasound scans, thyroid labs, and prescriptions'}
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => setIsAdding(!isAdding)}
          style={{ padding: '0.6rem 1.15rem' }}
        >
          <Plus size={16} />
          <span>{lang === 'bn' ? 'নতুন ফাইল যোগ করুন' : 'Add Document'}</span>
        </button>
      </div>

      {/* Upload Form */}
      {isAdding && (
        <form onSubmit={handleAddDoc} className="glass-card" style={{ background: 'var(--bg-surface-soft)', border: '1.5px dashed var(--accent-rose)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
            {lang === 'bn' ? 'নতুন রিপোর্ট যুক্ত করুন' : 'Add New Medical Document'}
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.75rem' }}>
            <input
              type="text"
              placeholder={lang === 'bn' ? 'ফাইলের নাম (যেমন: আল্ট্রাসাউন্ড রিপোর্ট)' : 'Document Title'}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: '#fff' }}
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: '#fff' }}
            >
              <option value="Ultrasound">{lang === 'bn' ? 'আল্ট্রাসাউন্ড (Ultrasound TVS)' : 'Ultrasound TVS'}</option>
              <option value="Lab Test">{lang === 'bn' ? 'রক্তের টেস্ট (Blood/Thyroid)' : 'Blood / Lab Test'}</option>
              <option value="Prescription">{lang === 'bn' ? 'প্রেসক্রিপশন (Prescription)' : 'Prescription'}</option>
            </select>
          </div>

          <input
            type="text"
            placeholder={lang === 'bn' ? 'ডাক্তার বা ডায়াগনস্টিক সেন্টারের নাম' : 'Doctor or Clinic Name'}
            value={newDoctor}
            onChange={(e) => setNewDoctor(e.target.value)}
            style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: '#fff' }}
          />

          <textarea
            rows="2"
            placeholder={lang === 'bn' ? 'রিপোর্টের মূল ফলাফল বা ডাক্তারের পরামর্শ...' : 'Brief summary of findings...'}
            value={newSummary}
            onChange={(e) => setNewSummary(e.target.value)}
            style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: '#fff', resize: 'none' }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsAdding(false)}>
              {lang === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button type="submit" className="btn-primary">
              {lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Document'}
            </button>
          </div>
        </form>
      )}

      {/* Document List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="glass-card"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', flex: 1, minWidth: '260px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--accent-rose-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-rose)', flexShrink: 0 }}>
                <FileText size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <strong style={{ fontSize: '0.98rem', color: 'var(--text-primary)' }}>{doc.title}</strong>
                  <span className="status-pill normal" style={{ fontSize: '0.68rem' }}>{doc.category}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {doc.doctor} • {doc.date}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.4 }}>
                  {doc.summary}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                className="btn-secondary"
                onClick={() => setSelectedDoc(doc)}
                style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }}
              >
                <Eye size={15} />
                <span>{lang === 'bn' ? 'দেখুন' : 'View'}</span>
              </button>
              <button
                onClick={() => handleDelete(doc.id)}
                style={{ color: 'var(--text-muted)', padding: '0.5rem', borderRadius: '50%' }}
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedDoc && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1100,
            background: 'rgba(20, 15, 20, 0.75)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem'
          }}
        >
          <div className="glass-card" style={{ maxWidth: '500px', width: '100%', background: '#fff', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{selectedDoc.title}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedDoc.doctor} • {selectedDoc.date}</span>
              </div>
              <button onClick={() => setSelectedDoc(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: 'var(--bg-surface-soft)', padding: '1.25rem', borderRadius: 'var(--radius-md)', margin: '1rem 0', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                {lang === 'bn' ? 'ক্লিনিক্যাল ফাইন্ডিংস ও নোটস:' : 'Clinical Findings:'}
              </strong>
              {selectedDoc.summary}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button className="btn-primary" onClick={() => setSelectedDoc(null)}>
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
