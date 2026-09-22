import React, { useState } from 'react';
import { CaseData, InvestigationState, Suspect, NavTab } from '../types';

interface SuspectMatrixProps {
  caseData: CaseData;
  investigationState: InvestigationState;
  onCrossExamine: (suspect: Suspect) => void;
  onNavigateTab: (tab: NavTab) => void;
  onUnlockAttachmentClue: (suspect: Suspect) => void;
}

export const SuspectMatrix: React.FC<SuspectMatrixProps> = ({
  caseData,
  investigationState,
  onCrossExamine,
  onNavigateTab,
  onUnlockAttachmentClue,
}) => {
  const [filter, setFilter] = useState<'all' | 'high-suspicion' | 'conflicting' | 'unlocked'>('all');

  const filteredSuspects = caseData.suspects.filter((s) => {
    if (filter === 'all') return true;
    if (filter === 'high-suspicion') return s.suspicionScore >= 70;
    if (filter === 'conflicting')
      return s.alibi.status === 'CONFLICTING' || s.alibi.status === 'COMPROMISED';
    if (filter === 'unlocked')
      return s.hiddenIntelKey && investigationState.unlockedIntelKeys.includes(s.hiddenIntelKey);
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 py-3 pb-28 gap-5">
      {/* Telemetry Header */}
      <section className="flex flex-col gap-2 p-3 bg-[#0d0e11] rounded-lg border border-[#292a2d]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#dc2626] animate-ping"></span>
            <span className="font-mono text-xs text-[#ffb4ab] font-bold tracking-widest uppercase">
              CASE {caseData.number} // SUSPECT MATRIX
            </span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 bg-[#292a2d] rounded text-[#45dfa4] font-mono text-[10px]">
            <span className="material-symbols-outlined text-[13px]">groups</span>
            <span>{caseData.suspects.length} PERSONS OF INTEREST</span>
          </div>
        </div>

        {/* Filter Matrix Chips */}
        <div className="flex items-center gap-2 flex-wrap py-1">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded font-mono text-xs tracking-wide uppercase transition-colors whitespace-nowrap ${
              filter === 'all'
                ? 'bg-[#dc2626] text-white font-bold'
                : 'bg-[#292a2d] text-[#94a3b8] hover:text-[#e3e2e6]'
            }`}
          >
            ALL ({caseData.suspects.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('high-suspicion')}
            className={`px-3 py-1.5 rounded font-mono text-xs tracking-wide uppercase transition-colors whitespace-nowrap ${
              filter === 'high-suspicion'
                ? 'bg-[#dc2626] text-white font-bold'
                : 'bg-[#292a2d] text-[#94a3b8] hover:text-[#e3e2e6]'
            }`}
          >
            HIGH SUSPICION ({caseData.suspects.filter((s) => s.suspicionScore >= 70).length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('conflicting')}
            className={`px-3 py-1.5 rounded font-mono text-xs tracking-wide uppercase transition-colors whitespace-nowrap ${
              filter === 'conflicting'
                ? 'bg-[#dc2626] text-white font-bold'
                : 'bg-[#292a2d] text-[#94a3b8] hover:text-[#e3e2e6]'
            }`}
          >
            CONFLICTING ALIBI (
            {
              caseData.suspects.filter(
                (s) => s.alibi.status === 'CONFLICTING' || s.alibi.status === 'COMPROMISED'
              ).length
            }
            )
          </button>
          <button
            type="button"
            onClick={() => setFilter('unlocked')}
            className={`px-3 py-1.5 rounded font-mono text-xs tracking-wide uppercase transition-colors whitespace-nowrap ${
              filter === 'unlocked'
                ? 'bg-[#dc2626] text-white font-bold'
                : 'bg-[#292a2d] text-[#94a3b8] hover:text-[#e3e2e6]'
            }`}
          >
            UNLOCKED INTEL ({investigationState.unlockedIntelKeys.length})
          </button>
        </div>
      </section>

      {/* Directive Warning */}
      <section className="p-3 bg-[#1b1b1f] rounded-lg border border-[#292a2d] flex items-start gap-3 shadow-sm">
        <span className="material-symbols-outlined text-[#f9bd22] text-[20px] mt-0.5 shrink-0">
          psychology_alt
        </span>
        <div className="flex flex-col min-w-0">
          <span className="font-mono text-[10px] font-bold text-[#f9bd22] uppercase tracking-wider">
            INVESTIGATIVE DIRECTIVE // CLUE BIAS
          </span>
          <p className="font-sans text-xs text-[#94a3b8] mt-0.5 leading-relaxed">
            Evaluate discrepancies carefully. Innocent persons may harbor unrelated corporate guilt, personal secrets, or falsified presence. Cross-reference alibi timestamps with verified CCTV records.
          </p>
        </div>
      </section>

      {/* Suspects Card Stack */}
      <section className="flex flex-col gap-4">
        {filteredSuspects.map((suspect, idx) => {
          const isIntelUnlocked =
            suspect.hiddenIntelKey &&
            investigationState.unlockedIntelKeys.includes(suspect.hiddenIntelKey);

          return (
            <article
              key={suspect.id}
              className="flex flex-col bg-[#1f1f23] rounded-xl border border-[#292a2d] overflow-hidden shadow-md"
            >
              {/* Top Meta Banner */}
              <div className="flex items-center justify-between px-4 py-2 bg-[#292a2d]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#ffb4ab] font-bold tracking-widest">
                    POI-882{idx + 1}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#5c403c]"></span>
                  <span className="font-mono text-[10px] text-[#94a3b8] uppercase">
                    {suspect.relationship}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold tracking-wider uppercase ${
                    suspect.statusCategory === 'conflicting'
                      ? 'bg-[#93000a] text-[#ffb4ab]'
                      : suspect.statusCategory === 'high-suspicion'
                      ? 'bg-[#dc2626] text-white'
                      : 'bg-[#00452e] text-[#45dfa4]'
                  }`}
                >
                  {suspect.statusTag}
                </span>
              </div>

              {/* Identity Header Block */}
              <div className="p-4 flex gap-4 items-start">
                <div className="relative shrink-0 w-20 h-24 bg-[#0d0e11] rounded overflow-hidden shadow-inner border border-[#343538]">
                  <img
                    src={suspect.avatar}
                    alt={suspect.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-[#0d0e11]/85 text-center py-0.5">
                    <span className="font-mono text-[8px] text-[#45dfa4] tracking-widest uppercase">
                      {suspect.clearance}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-1">
                    <h2 className="font-heading text-lg font-bold text-[#e3e2e6] tracking-tight truncate">
                      {suspect.name}
                    </h2>
                    <span className="font-mono text-[10px] text-[#ffb4ab] bg-[#93000a]/30 px-1.5 py-0.5 rounded font-bold">
                      {suspect.suspicionScore}% SUSP
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[#f9bd22] uppercase tracking-wide">
                    {suspect.occupation}
                  </span>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 font-mono text-[11px] text-[#94a3b8]">
                    <span>
                      AGE: <strong className="text-[#e3e2e6]">{suspect.age}</strong>
                    </span>
                    <span>
                      STATUS: <strong className="text-[#ffb4ab]">{suspect.alibi.status}</strong>
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-[#ffdad6] bg-[#1b1b1f] p-1.5 rounded border border-[#292a2d]">
                    <strong className="text-[#ffb4ab]">MOTIVE:</strong> {suspect.motive}
                  </div>
                </div>
              </div>

              {/* Evidence & Contradiction Body */}
              <div className="px-4 pb-4 flex flex-col gap-2.5">
                {/* Initial Statement */}
                <div className="p-2.5 bg-[#0d0e11] rounded border border-[#292a2d]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-[#94a3b8] uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">record_voice_over</span>
                      INITIAL STATEMENT [{suspect.initialStatement.time}]
                    </span>
                    <span className="font-mono text-[9px] text-[#f9bd22] tracking-widest">
                      {suspect.initialStatement.label || 'ARCHIVED'}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-[#e3e2e6] italic leading-relaxed">
                    {suspect.initialStatement.text}
                  </p>
                </div>

                {/* Contradiction Box */}
                <div className="p-2.5 bg-[#292a2d] rounded border border-[#384259] flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#ffb4ab]">
                    <span className="material-symbols-outlined text-[16px]">
                      {suspect.contradiction.icon || 'warning'}
                    </span>
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
                      {suspect.contradiction.title}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-[#e3e2e6] leading-relaxed">
                    {suspect.contradiction.text}
                  </p>
                </div>

                {/* Restricted Attachment Intel Payload */}
                {suspect.hiddenAttachmentName && (
                  <div className="p-2.5 bg-[#1b1b1f] rounded border border-[#292a2d] flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded bg-[#343538] flex items-center justify-center shrink-0 text-[#ac8884]">
                        <span className="material-symbols-outlined text-[18px]">
                          {isIntelUnlocked ? 'lock_open' : 'lock'}
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-mono text-[11px] font-bold text-[#e3e2e6] tracking-wider uppercase truncate">
                          {suspect.hiddenAttachmentName}
                        </span>
                        <span
                          className={`font-mono text-[9px] tracking-widest ${
                            isIntelUnlocked ? 'text-[#45dfa4]' : 'text-[#ffb4ab]'
                          }`}
                        >
                          {isIntelUnlocked ? 'INTEL DECRYPTED & VERIFIED' : 'REQ: CRYPTOGRAPHIC CLEARANCE'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onUnlockAttachmentClue(suspect)}
                      className={`px-3 py-1 rounded font-mono text-xs flex items-center gap-1 transition-colors ${
                        isIntelUnlocked
                          ? 'bg-[#00452e] text-[#45dfa4] border border-[#00bd85]/40'
                          : 'bg-[#292a2d] hover:bg-[#384259] text-[#e3e2e6] border border-[#343538]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[13px]">
                        {isIntelUnlocked ? 'visibility' : 'key'}
                      </span>
                      <span>{isIntelUnlocked ? 'INSPECT' : 'DECRYPT'}</span>
                    </button>
                  </div>
                )}

                {/* Cross-Examine Action */}
                <button
                  type="button"
                  onClick={() => onCrossExamine(suspect)}
                  className="w-full mt-1 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-mono text-xs font-bold tracking-widest uppercase rounded flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]">gavel</span>
                  <span>CROSS-EXAMINE TESTIMONY</span>
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {/* Correlation Nexus Footer Nav */}
      <section className="flex flex-col gap-2 pt-2">
        <span className="font-mono text-[10px] text-[#94a3b8] uppercase tracking-widest">
          CORRELATION NEXUS
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onNavigateTab('timeline')}
            className="p-3 bg-[#1f1f23] hover:bg-[#292a2d] rounded-lg border border-[#292a2d] flex flex-col justify-between gap-2 text-left transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-[#45dfa4] text-[22px]">timeline</span>
              <span className="font-mono text-[10px] text-[#94a3b8] font-bold">GRID SYNC</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs font-bold text-[#e3e2e6]">TIMELINE</span>
              <span className="font-sans text-[11px] text-[#94a3b8]">Synchronize event sequence</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('evidence-locker')}
            className="p-3 bg-[#1f1f23] hover:bg-[#292a2d] rounded-lg border border-[#292a2d] flex flex-col justify-between gap-2 text-left transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-[#f9bd22] text-[22px]">inventory_2</span>
              <span className="font-mono text-[10px] text-[#f9bd22] font-bold">
                {investigationState.unlockedEvidenceIds.length} ITEMS
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs font-bold text-[#e3e2e6]">EVIDENCE ROOM</span>
              <span className="font-sans text-[11px] text-[#94a3b8]">Inspect physical logs & vials</span>
            </div>
          </button>
        </div>

        {/* Indictment Shortcut */}
        <button
          type="button"
          onClick={() => onNavigateTab('final-accusation')}
          className="p-3 bg-[#0d0e11] hover:bg-[#1b1b1f] rounded-lg border border-[#292a2d] flex items-center justify-between transition-colors shadow-inner"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#dc2626]/20 text-[#ffb4ab] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">crisis_alert</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-mono text-xs font-bold text-[#ffb4ab] tracking-wider uppercase">
                READY TO INDICT?
              </span>
              <span className="font-sans text-[11px] text-[#94a3b8]">
                Formal charges require concrete evidence chain
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#ffb4ab] text-[20px]">chevron_right</span>
        </button>
      </section>
    </div>
  );
};
