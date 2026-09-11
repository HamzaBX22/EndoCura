import React from 'react';
import {
  Sparkles,
  ClipboardPenLine,
  Leaf,
  FileText
} from 'lucide-react';
import { translations } from '../data/translations';

export const Navigation = ({ activeTab, setActiveTab, lang = 'bn' }) => {
  const t = translations[lang] || translations.bn;

  const tabs = [
    { id: 'today', label: t.navToday, icon: Sparkles },
    { id: 'log', label: t.navLog, icon: ClipboardPenLine },
    { id: 'care', label: t.navCare, icon: Leaf },
    { id: 'report', label: t.navReport, icon: FileText }
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
            <Icon size={17} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
