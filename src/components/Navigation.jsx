import React from 'react';
import {
  Sparkles,
  ClipboardPenLine,
  Leaf,
  FileText
} from 'lucide-react';
import { translations } from '../data/translations';

export const Navigation = ({ activeTab, setActiveTab, lang = 'bn' }) => {
  const tabs = [
    { id: 'today', label: lang === 'bn' ? 'আজ' : 'Today', icon: Sparkles },
    { id: 'log', label: lang === 'bn' ? 'লগ' : 'Daily Log', icon: ClipboardPenLine },
    { id: 'care', label: lang === 'bn' ? 'নিরাময়' : 'Care Hub', icon: Leaf },
    { id: 'report', label: lang === 'bn' ? 'রিপোর্ট' : 'Doctor Dossier', icon: FileText }
  ];

  return (
    <nav className="nav-tab-bar" aria-label="Main Application Navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`nav-tab-btn ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon size={19} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
