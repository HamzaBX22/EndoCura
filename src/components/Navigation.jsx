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
    {
      id: 'today',
      label: lang === 'bn' ? 'আজকের দিন' : 'Today',
      shortLabel: lang === 'bn' ? 'আজকের দিন' : 'Today',
      icon: Sparkles
    },
    {
      id: 'log',
      label: lang === 'bn' ? 'সহজ ট্র্যাকার' : 'Easy Tracker',
      shortLabel: lang === 'bn' ? 'সহজ ট্র্যাকার' : 'Tracker',
      icon: ClipboardPenLine
    },
    {
      id: 'care',
      label: lang === 'bn' ? 'নিরাময় ও খাবার' : 'Care & Diet',
      shortLabel: lang === 'bn' ? 'নিরাময় ও খাবার' : 'Care & Diet',
      icon: Leaf
    },
    {
      id: 'report',
      label: lang === 'bn' ? 'ডাক্তারের রিপোর্ট' : 'Doctor Report',
      shortLabel: lang === 'bn' ? 'ডাক্তারের রিপোর্ট' : 'Dossier',
      icon: FileText
    }
  ];

  return (
    <nav className="nav-tab-bar" aria-label="Main Application Navigation">
      <div className="nav-tab-inner">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="nav-icon-wrapper">
                <Icon size={20} />
              </div>
              <span className="nav-tab-text">{tab.label}</span>
              {isActive && <div className="nav-active-indicator" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
