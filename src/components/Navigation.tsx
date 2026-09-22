import React, { useRef, useState, useEffect, useCallback } from 'react';
import { NavTab } from '../types';

interface NavigationProps {
  activeTab: NavTab;
  onNavigateTab: (tab: NavTab) => void;
  suspectCount: number;
  unlockedEvidenceCount: number;
  totalEvidenceCount: number;
  unsolvedPuzzlesCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onNavigateTab,
  suspectCount,
  unlockedEvidenceCount,
  totalEvidenceCount,
  unsolvedPuzzlesCount,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll]);

  const scrollBy = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <>
      {/* Top Navigation Ribbon (Desktop, Tablet & Mobile) */}
      <div className="sticky top-[73px] sm:top-[77px] z-40 bg-[#121316]/95 backdrop-blur-xl border-b border-[#292a2d] shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 flex items-center justify-between gap-2">
          {/* Scroll Left Button if overflow exists */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollBy(-180)}
              aria-label="Scroll left topics"
              className="flex-shrink-0 w-7 h-7 rounded bg-[#1f1f23] hover:bg-[#292a2d] border border-[#ffb4ab]/30 text-[#ffb4ab] flex items-center justify-center transition-colors shadow"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
          )}

          {/* Topics Slider Container */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex items-center gap-1.5 overflow-x-auto sm:flex-wrap no-scrollbar py-0.5 scroll-smooth min-w-0 flex-1"
          >
            <button
              type="button"
              onClick={() => onNavigateTab('case-overview')}
              className={`flex-shrink-0 px-2.5 sm:px-3 py-1.5 rounded font-mono text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5 ${
                activeTab === 'case-overview'
                  ? 'bg-[#dc2626] text-[#fff6f5] font-bold shadow-[0_0_8px_rgba(220,38,38,0.4)]'
                  : 'bg-[#1b1b1f] text-[#94a3b8] hover:text-[#e3e2e6] hover:bg-[#292a2d] border border-transparent hover:border-[#343538]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">folder_open</span>
              <span>Case Overview</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('suspect-matrix')}
              className={`flex-shrink-0 px-2.5 sm:px-3 py-1.5 rounded font-mono text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5 relative ${
                activeTab === 'suspect-matrix'
                  ? 'bg-[#dc2626] text-[#fff6f5] font-bold shadow-[0_0_8px_rgba(220,38,38,0.4)]'
                  : 'bg-[#1b1b1f] text-[#94a3b8] hover:text-[#e3e2e6] hover:bg-[#292a2d] border border-transparent hover:border-[#343538]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">badge</span>
              <span>Suspects</span>
              <span className="px-1.5 py-0.2 bg-[#343538] text-[#45dfa4] text-[9px] rounded font-mono font-semibold">
                0{suspectCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('evidence-locker')}
              className={`flex-shrink-0 px-2.5 sm:px-3 py-1.5 rounded font-mono text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5 relative ${
                activeTab === 'evidence-locker'
                  ? 'bg-[#dc2626] text-[#fff6f5] font-bold shadow-[0_0_8px_rgba(220,38,38,0.4)]'
                  : 'bg-[#1b1b1f] text-[#94a3b8] hover:text-[#e3e2e6] hover:bg-[#292a2d] border border-transparent hover:border-[#343538]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">inventory_2</span>
              <span>Evidence</span>
              <span className="px-1.5 py-0.2 bg-[#343538] text-[#f9bd22] text-[9px] rounded font-mono font-semibold">
                {unlockedEvidenceCount}/{totalEvidenceCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('timeline')}
              className={`flex-shrink-0 px-2.5 sm:px-3 py-1.5 rounded font-mono text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5 ${
                activeTab === 'timeline'
                  ? 'bg-[#dc2626] text-[#fff6f5] font-bold shadow-[0_0_8px_rgba(220,38,38,0.4)]'
                  : 'bg-[#1b1b1f] text-[#94a3b8] hover:text-[#e3e2e6] hover:bg-[#292a2d] border border-transparent hover:border-[#343538]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">timeline</span>
              <span>Timeline</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('tactical-terminal')}
              className={`flex-shrink-0 px-2.5 sm:px-3 py-1.5 rounded font-mono text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5 ${
                activeTab === 'tactical-terminal'
                  ? 'bg-[#dc2626] text-[#fff6f5] font-bold shadow-[0_0_8px_rgba(220,38,38,0.4)]'
                  : 'bg-[#1b1b1f] text-[#94a3b8] hover:text-[#e3e2e6] hover:bg-[#292a2d] border border-transparent hover:border-[#343538]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">terminal</span>
              <span>Terminal</span>
              {unsolvedPuzzlesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#f9bd22] animate-pulse"></span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('documents')}
              className={`flex-shrink-0 px-2.5 sm:px-3 py-1.5 rounded font-mono text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5 ${
                activeTab === 'documents'
                  ? 'bg-[#dc2626] text-[#fff6f5] font-bold shadow-[0_0_8px_rgba(220,38,38,0.4)]'
                  : 'bg-[#1b1b1f] text-[#94a3b8] hover:text-[#e3e2e6] hover:bg-[#292a2d] border border-transparent hover:border-[#343538]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">description</span>
              <span>Documents</span>
            </button>
          </div>

          {/* Scroll Right Button if overflow exists */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollBy(180)}
              aria-label="Scroll right topics"
              className="flex-shrink-0 w-7 h-7 rounded bg-[#1f1f23] hover:bg-[#292a2d] border border-[#ffb4ab]/30 text-[#ffb4ab] flex items-center justify-center transition-colors shadow"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          )}

          {/* Action: Accuse / Indict Killer */}
          <button
            type="button"
            onClick={() => onNavigateTab('final-accusation')}
            className={`flex-shrink-0 px-3 sm:px-4 py-1.5 rounded font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              activeTab === 'final-accusation'
                ? 'bg-[#b91c1c] text-white ring-2 ring-[#ffb4ab]'
                : 'bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">crisis_alert</span>
            <span className="hidden xs:inline sm:inline">Indict Killer</span>
            <span className="xs:hidden sm:hidden">Indict</span>
          </button>
        </div>
      </div>

      {/* Mobile Sticky Bottom Dock - Full 7 Topics Accessible */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#121316]/95 backdrop-blur-xl border-t border-[#292a2d] shadow-[0_-2px_12px_rgba(0,0,0,0.7)] pb-safe">
        <div className="grid grid-cols-7 h-14 px-1 items-center">
          <button
            type="button"
            onClick={() => onNavigateTab('case-overview')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'case-overview'
                ? 'text-[#dc2626] font-bold'
                : 'text-[#94a3b8] hover:text-[#e3e2e6]'
            }`}
            title="Case Overview"
          >
            <span className="material-symbols-outlined text-[18px]">folder_open</span>
            <span className="font-mono text-[8px] tracking-wider uppercase">Case</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('suspect-matrix')}
            className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
              activeTab === 'suspect-matrix'
                ? 'text-[#dc2626] font-bold'
                : 'text-[#94a3b8] hover:text-[#e3e2e6]'
            }`}
            title="Suspect Matrix"
          >
            <span className="material-symbols-outlined text-[18px]">badge</span>
            <span className="font-mono text-[8px] tracking-wider uppercase">Suspects</span>
            <span className="absolute top-1 right-1 px-1 bg-[#343538] text-[#45dfa4] font-mono text-[7px] rounded-full">
              {suspectCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('evidence-locker')}
            className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
              activeTab === 'evidence-locker'
                ? 'text-[#dc2626] font-bold'
                : 'text-[#94a3b8] hover:text-[#e3e2e6]'
            }`}
            title="Evidence Locker"
          >
            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            <span className="font-mono text-[8px] tracking-wider uppercase">Evidence</span>
            <span className="w-1.5 h-1.5 bg-[#f9bd22] rounded-full absolute top-1 right-2"></span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('timeline')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'timeline'
                ? 'text-[#dc2626] font-bold'
                : 'text-[#94a3b8] hover:text-[#e3e2e6]'
            }`}
            title="Chronology Nexus"
          >
            <span className="material-symbols-outlined text-[18px]">timeline</span>
            <span className="font-mono text-[8px] tracking-wider uppercase">Timeline</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('tactical-terminal')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'tactical-terminal'
                ? 'text-[#dc2626] font-bold'
                : 'text-[#94a3b8] hover:text-[#e3e2e6]'
            }`}
            title="Tactical Terminal"
          >
            <span className="material-symbols-outlined text-[18px]">terminal</span>
            <span className="font-mono text-[8px] tracking-wider uppercase">Terminal</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('documents')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'documents'
                ? 'text-[#dc2626] font-bold'
                : 'text-[#94a3b8] hover:text-[#e3e2e6]'
            }`}
            title="Documents"
          >
            <span className="material-symbols-outlined text-[18px]">description</span>
            <span className="font-mono text-[8px] tracking-wider uppercase">Docs</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('final-accusation')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'final-accusation'
                ? 'text-[#dc2626] font-bold'
                : 'text-[#ffb4ab] hover:text-[#dc2626]'
            }`}
            title="Final Accusation"
          >
            <span className="material-symbols-outlined text-[18px] text-[#dc2626]">crisis_alert</span>
            <span className="font-mono text-[8px] tracking-wider uppercase font-bold text-[#ffb4ab]">Accuse</span>
          </button>
        </div>
      </nav>
    </>
  );
};
