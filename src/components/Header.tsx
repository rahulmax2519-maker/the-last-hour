import React, { useState } from 'react';
import { CaseId, NavTab } from '../types';
import { CASES_DATA } from '../data/cases';
import { formatTimer } from '../utils/storage';

interface HeaderProps {
  currentCaseId: CaseId | null;
  activeTab: NavTab;
  onNavigateTab: (tab: NavTab) => void;
  onReturnToCases: () => void;
  onOpenGuide: () => void;
  elapsedSeconds: number;
  score: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentCaseId,
  activeTab,
  onNavigateTab,
  onReturnToCases,
  onOpenGuide,
  elapsedSeconds,
  score,
}) => {
  const [ambientActive, setAmbientActive] = useState(false);

  const toggleAmbientScanner = () => {
    setAmbientActive(!ambientActive);
    // Web Audio synthesizer tone for tactical feedback
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(ambientActive ? 220 : 440, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  const currentCase = currentCaseId ? CASES_DATA[currentCaseId] : null;

  const getTabTitle = () => {
    if (!currentCaseId) return 'Case Dossier';
    switch (activeTab) {
      case 'case-overview':
        return 'Incident Dossier';
      case 'suspect-matrix':
        return 'Suspect Matrix';
      case 'evidence-locker':
        return 'Evidence Locker';
      case 'tactical-terminal':
        return 'Tactical Terminal';
      case 'timeline':
        return 'Timeline Nexus';
      case 'documents':
        return 'Case Documents';
      case 'final-accusation':
        return 'Final Accusation';
      default:
        return 'Case Dossier';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#121316]/95 backdrop-blur-xl border-b border-[#292a2d] shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col gap-1.5">
        {/* Upper Telemetry Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#343538]/80 rounded">
              <span className="w-2 h-2 rounded-full bg-[#dc2626] animate-pulse"></span>
              <span className="font-mono text-[10px] tracking-widest text-[#ffb4ab] font-bold">
                SYS.ACTIVE // SEC_LVL-4
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#e6bdb8] hidden sm:inline">
              {currentCase ? `CASE-${currentCase.number} // ${currentCase.id.toUpperCase()}` : 'TLH-CENTRAL'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {currentCaseId && (
              <button
                type="button"
                onClick={onReturnToCases}
                className="text-[11px] font-mono px-2.5 py-1 bg-[#1f1f23] hover:bg-[#292a2d] text-[#e3e2e6] rounded border border-[#343538] flex items-center gap-1.5 transition-colors"
                title="Return to main case dossiers"
              >
                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                <span className="hidden sm:inline">CASE FILES</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenGuide}
              className="text-[11px] font-mono px-2.5 py-1 bg-[#292a2d] hover:bg-[#343538] text-[#ffb4ab] rounded border border-[#ffb4ab]/30 flex items-center gap-1.5 transition-colors"
              title="Open Investigator Field Manual & PDF Export"
            >
              <span className="material-symbols-outlined text-[14px] text-[#dc2626]">menu_book</span>
              <span className="hidden sm:inline font-bold">MANUAL / PDF</span>
            </button>

            <button
              type="button"
              onClick={toggleAmbientScanner}
              aria-label="Ambiance Scanner"
              className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                ambientActive ? 'bg-[#45dfa4]/20 text-[#45dfa4]' : 'bg-[#1b1b1f] text-[#94a3b8] hover:text-[#e3e2e6]'
              }`}
              title="Toggle Ambiance Telemetry"
            >
              <span className="material-symbols-outlined text-[16px]">graphic_eq</span>
            </button>

            {/* Score Pill */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#1b1b1f] border border-[#292a2d]">
              <span className="material-symbols-outlined text-[13px] text-[#f9bd22]">shield</span>
              <span className="font-mono text-[11px] font-bold text-[#f9bd22]">{score} PTS</span>
            </div>

            <div className="w-7 h-7 rounded-full bg-[#ffb4ab] flex items-center justify-center text-[#690005]">
              <span className="material-symbols-outlined text-[16px]">person</span>
            </div>
          </div>
        </div>

        {/* Lower Title & Timer Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-heading text-lg font-bold tracking-wider text-[#e3e2e6] uppercase truncate">
              {getTabTitle()}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#1f1f23] font-mono text-[10px] text-[#45dfa4] font-semibold">
              {currentCaseId ? 'INVESTIGATION' : 'LIVE_GRID'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0d0e11] px-2.5 py-1 rounded border border-[#292a2d]">
            <span className="material-symbols-outlined text-[14px] text-[#dc2626]">timer</span>
            <span className="font-mono text-xs font-bold text-[#ffb4ab] tracking-widest">
              {formatTimer(elapsedSeconds)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
