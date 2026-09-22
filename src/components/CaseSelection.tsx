import React from 'react';
import { CaseId, InvestigationState } from '../types';
import { CASES_DATA } from '../data/cases';

interface CaseSelectionProps {
  unlockedCases: CaseId[];
  casesState: Record<CaseId, InvestigationState>;
  onSelectCase: (caseId: CaseId) => void;
  onOpenHowToPlay: () => void;
  onOpenTerminalRules: () => void;
  onOpenScoringMatrix: () => void;
  onOpenFieldManual: () => void;
  onResetCase: (caseId: CaseId) => void;
}

export const CaseSelection: React.FC<CaseSelectionProps> = ({
  unlockedCases,
  casesState,
  onSelectCase,
  onOpenHowToPlay,
  onOpenTerminalRules,
  onOpenScoringMatrix,
  onOpenFieldManual,
  onResetCase,
}) => {
  const caseList = Object.values(CASES_DATA);

  // Find any in-progress case
  const inProgressCase = caseList.find((c) => casesState[c.id]?.status === 'in_progress');

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 py-4 pb-28 gap-6">
      {/* Classified Hero Section */}
      <section className="relative overflow-hidden rounded-xl bg-[#1b1b1f] p-5 shadow-2xl border border-[#292a2d]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#dc2626]/10 via-transparent to-[#0d0e11] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-[#343538] rounded text-[#e6bdb8]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-pulse"></span>
              <span className="font-mono text-[10px] tracking-widest text-[#ffb4ab] font-bold">
                CLEARANCE: LVL-4
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#45dfa4] tracking-widest">
              LIVE_DB_CONN
            </span>
          </div>

          <div className="flex flex-col gap-1 mt-1">
            <span className="font-mono text-xs text-[#ffb4ab] tracking-widest uppercase font-semibold">
              EVERY MURDER LEAVES A TRACE.
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#e3e2e6] tracking-tight">
              CAN YOU SOLVE THE MURDER?
            </h1>
            <p className="font-sans text-sm text-[#94a3b8] leading-relaxed">
              Five cases. Five killers. One chance to uncover the truth through raw digital forensics and biometric telemetry.
            </p>
          </div>

          {/* Enter or Continue CTA */}
          <div className="mt-2 flex flex-col sm:flex-row gap-2">
            {inProgressCase ? (
              <>
                <button
                  type="button"
                  onClick={() => onSelectCase(inProgressCase.id)}
                  className="flex-1 group flex items-center justify-between px-5 py-3.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-mono text-xs font-bold tracking-widest uppercase rounded shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all active:scale-[0.99]"
                >
                  <span className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                    </span>
                    CONTINUE: {inProgressCase.title.toUpperCase()}
                  </span>
                  <span className="material-symbols-outlined text-[20px]">radar</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectCase('case-01')}
                  className="px-4 py-3.5 bg-[#1f1f23] hover:bg-[#292a2d] text-[#e3e2e6] font-mono text-xs font-semibold tracking-wider uppercase rounded border border-[#343538] transition-colors"
                >
                  NEW BRIEFING
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => onSelectCase('case-01')}
                className="w-full group flex items-center justify-between px-5 py-3.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-mono text-xs font-bold tracking-widest uppercase rounded shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all active:scale-[0.99]"
              >
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                  </span>
                  ENTER INVESTIGATION
                </span>
                <span className="material-symbols-outlined text-[20px]">radar</span>
              </button>
            )}
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            <div className="flex flex-col p-2.5 rounded bg-[#1f1f23] border border-[#292a2d]">
              <span className="font-mono text-[9px] text-[#94a3b8] tracking-wider uppercase">Active Inquiries</span>
              <span className="font-heading text-lg font-bold text-[#ffb4ab] tracking-tight">05 HOMICIDES</span>
            </div>
            <div className="flex flex-col p-2.5 rounded bg-[#1f1f23] border border-[#292a2d]">
              <span className="font-mono text-[9px] text-[#94a3b8] tracking-wider uppercase">Suspect Pool</span>
              <span className="font-heading text-lg font-bold text-[#e3e2e6] tracking-tight">18 PERSONS</span>
            </div>
            <div className="flex flex-col p-2.5 rounded bg-[#1f1f23] border border-[#292a2d]">
              <span className="font-mono text-[9px] text-[#94a3b8] tracking-wider uppercase">Forensic Assets</span>
              <span className="font-heading text-lg font-bold text-[#45dfa4] tracking-tight">42 ARTIFACTS</span>
            </div>
            <div className="flex flex-col p-2.5 rounded bg-[#1f1f23] border border-[#292a2d]">
              <span className="font-mono text-[9px] text-[#94a3b8] tracking-wider uppercase">Resolution Ratio</span>
              <span className="font-heading text-lg font-bold text-[#f9bd22] tracking-tight">
                {caseList.filter((c) => casesState[c.id]?.status === 'solved').length * 20}% CLEAR
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Guide Chips Ribbon */}
      <div className="flex items-center gap-2 flex-wrap pb-1">
        <button
          type="button"
          onClick={onOpenFieldManual}
          className="flex-shrink-0 px-3.5 py-1.5 rounded bg-[#dc2626] hover:bg-[#b91c1c] text-white font-mono text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(220,38,38,0.4)] transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
          FIELD MANUAL (PDF)
        </button>
        <button
          type="button"
          onClick={onOpenHowToPlay}
          className="flex-shrink-0 px-3.5 py-1.5 rounded bg-[#292a2d] hover:bg-[#343538] text-[#e3e2e6] font-mono text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px] text-[#ffb4ab]">rule</span>
          HOW TO PLAY
        </button>
        <button
          type="button"
          onClick={onOpenTerminalRules}
          className="flex-shrink-0 px-3.5 py-1.5 rounded bg-[#1f1f23] hover:bg-[#292a2d] text-[#94a3b8] hover:text-[#e3e2e6] font-mono text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-colors border border-[#292a2d]"
        >
          <span className="material-symbols-outlined text-[16px] text-[#45dfa4]">terminal</span>
          TERMINAL RULES
        </button>
        <button
          type="button"
          onClick={onOpenScoringMatrix}
          className="flex-shrink-0 px-3.5 py-1.5 rounded bg-[#1f1f23] hover:bg-[#292a2d] text-[#94a3b8] hover:text-[#e3e2e6] font-mono text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-colors border border-[#292a2d]"
        >
          <span className="material-symbols-outlined text-[16px] text-[#f9bd22]">analytics</span>
          SCORING MATRIX
        </button>
      </div>

      {/* Dossiers Grid Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#ffb4ab]">folder_managed</span>
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-[#e3e2e6]">
              Case Dossiers
            </h2>
          </div>
          <span className="font-mono text-[10px] text-[#94a3b8] uppercase tracking-widest">
            SEC_INDEX // 01-05
          </span>
        </div>

        {caseList.map((caseItem) => {
          const isUnlocked = unlockedCases.includes(caseItem.id);
          const state = casesState[caseItem.id];
          const isSolved = state?.status === 'solved';
          const isInProgress = state?.status === 'in_progress';

          return (
            <article
              key={caseItem.id}
              className={`flex flex-col rounded-xl overflow-hidden bg-[#1f1f23] border border-[#292a2d] shadow-lg transition-all ${
                !isUnlocked ? 'opacity-75' : 'hover:border-[#384259]'
              }`}
            >
              {/* Header Image Frame */}
              <div
                className={`relative h-44 w-full bg-cover bg-center ${
                  !isUnlocked ? 'filter grayscale contrast-125' : ''
                }`}
                style={{ backgroundImage: `url('${caseItem.headerImage}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#1f1f23] via-[#1f1f23]/60 to-transparent"></div>

                {/* Badge Top Left */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  {isSolved ? (
                    <span className="px-2 py-0.5 rounded bg-[#45dfa4]/20 text-[#45dfa4] font-mono text-[10px] font-bold tracking-widest uppercase border border-[#45dfa4]/40">
                      ✓ CASE CLOSED ({state.rank || 'SOLVED'})
                    </span>
                  ) : isInProgress ? (
                    <span className="px-2 py-0.5 rounded bg-[#dc2626] text-white font-mono text-[10px] font-bold tracking-widest uppercase shadow">
                      ACTIVE INVESTIGATION
                    </span>
                  ) : isUnlocked ? (
                    <span className="px-2 py-0.5 rounded bg-[#292a2d] text-[#e3e2e6] font-mono text-[10px] font-bold tracking-widest uppercase">
                      UNLOCKED DOSSIER
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-[#0d0e11]/90 text-[#94a3b8] font-mono text-[10px] font-bold tracking-widest uppercase flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">lock</span>
                      LOCKED FILE
                    </span>
                  )}
                </div>

                {/* Top Right ID */}
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-[#0d0e11]/90 font-mono text-[10px] text-[#ffb4ab] font-bold tracking-widest">
                  ID: CASE-{caseItem.number}
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-end justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-[#45dfa4] font-bold tracking-widest uppercase">
                      {caseItem.date} // {caseItem.time}
                    </span>
                    <h3 className="font-heading text-lg font-bold text-[#e3e2e6] tracking-wide uppercase">
                      {caseItem.title}
                    </h3>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex text-[#f9bd22] text-xs">
                    {'★'.repeat(caseItem.stars)}
                    <span className="text-[#343538]">{'★'.repeat(5 - caseItem.stars)}</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col gap-3">
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[#94a3b8] font-mono text-xs">
                  <span>
                    <strong className="text-[#e3e2e6]">VICTIM:</strong> {caseItem.victim.name} ({caseItem.victim.age},{' '}
                    {caseItem.victim.title})
                  </span>
                  <span>
                    <strong className="text-[#e3e2e6]">LOC:</strong> {caseItem.victim.location}
                  </span>
                </div>

                <p className="font-sans text-sm text-[#94a3b8] leading-relaxed">
                  {caseItem.synopsis}
                </p>

                {/* Forensic Decryption Vector */}
                <div className="flex flex-col gap-1.5 p-2 rounded bg-[#1b1b1f] border border-[#292a2d]">
                  <span className="font-mono text-[10px] text-[#45dfa4] font-bold uppercase tracking-wider">
                    FORENSIC DECRYPTION VECTOR
                  </span>
                  <div className="flex flex-wrap items-center gap-1 font-mono text-[10px] text-[#e3e2e6]">
                    {caseItem.decryptionVector.map((vec, idx) => (
                      <React.Fragment key={vec}>
                        <span className="px-1.5 py-0.5 rounded bg-[#343538]">{vec}</span>
                        {idx < caseItem.decryptionVector.length - 1 && (
                          <span className="text-[#94a3b8]">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-1 flex items-center gap-2">
                  {isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => onSelectCase(caseItem.id)}
                      className="flex-1 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-mono text-xs font-bold tracking-widest uppercase rounded flex items-center justify-center gap-2 shadow transition-all active:scale-[0.99]"
                    >
                      <span className="material-symbols-outlined text-[16px]">folder_open</span>
                      {isInProgress ? 'CONTINUE INVESTIGATION' : isSolved ? 'REVIEW ARCHIVES' : 'INVESTIGATE DOSSIER'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelectCase(caseItem.id)}
                      className="flex-1 py-2.5 bg-[#292a2d] hover:bg-[#343538] text-[#e3e2e6] font-mono text-xs font-bold tracking-widest uppercase rounded flex items-center justify-center gap-2 border border-[#343538] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">lock_open</span>
                      INSPECT DOSSIER BRIEFING
                    </button>
                  )}

                  {isInProgress && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Reset investigation for ${caseItem.title}? Score and progress will reset.`)) {
                          onResetCase(caseItem.id);
                        }
                      }}
                      className="px-3 py-2.5 bg-[#1b1b1f] hover:bg-[#292a2d] text-[#94a3b8] hover:text-[#ffb4ab] rounded font-mono text-xs border border-[#292a2d]"
                      title="Reset investigation"
                    >
                      <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Operative Dossier Footer */}
      <section className="flex flex-col p-4 rounded-xl bg-[#1b1b1f] border border-[#292a2d] gap-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#45dfa4]">verified_user</span>
            <span className="font-mono font-bold uppercase tracking-wider text-[#e3e2e6]">
              Operative Dossier
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#1f1f23] font-mono text-[10px] text-[#45dfa4] font-bold tracking-widest border border-[#292a2d]">
            RANK: DETECTIVE_II
          </span>
        </div>
        <p className="text-[#94a3b8] leading-relaxed">
          Terminal sessions are monitored in real-time. Every false accusation penalizes your forensic integrity rating (-200 pts) and incorrect cipher entries deduct score (-100 pts). Hints cost -50 pts each.
        </p>
        <div className="flex items-center justify-between pt-1 font-mono text-[10px] text-[#94a3b8]">
          <span>SERVER: US-EAST-FORENSIC-09</span>
          <span className="text-[#ffb4ab] font-bold">SESSION ID // 994-DA-01</span>
        </div>
      </section>
    </div>
  );
};
