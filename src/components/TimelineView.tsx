import React from 'react';
import { CaseData, InvestigationState, NavTab } from '../types';

interface TimelineViewProps {
  caseData: CaseData;
  investigationState: InvestigationState;
  onNavigateTab: (tab: NavTab) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  caseData,
  investigationState,
  onNavigateTab,
}) => {
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 py-3 pb-28 gap-5">
      {/* Telemetry Header */}
      <section className="flex flex-col gap-2 p-3 bg-[#0d0e11] rounded-lg border border-[#292a2d]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#45dfa4] text-[18px]">timeline</span>
            <span className="font-mono text-xs text-[#ffb4ab] font-bold tracking-widest uppercase">
              CHRONOLOGY NEXUS // {caseData.title.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#45dfa4]">
            <span className="w-2 h-2 rounded-full bg-[#45dfa4]"></span>
            <span>TIMELINE SYNCHRONIZED</span>
          </div>
        </div>
        <p className="font-sans text-xs text-[#94a3b8] leading-relaxed">
          Reconstruct the sequence of critical events leading up to the murder. Verify discrepancies between stated witness alibis and physical telemetry logs.
        </p>
      </section>

      {/* Timeline Stream */}
      <section className="relative flex flex-col gap-4 pl-6 border-l-2 border-[#292a2d] ml-3 mt-2">
        {caseData.timeline.map((event) => {
          const isVerified =
            Boolean((event as any).verified) ||
            Boolean(event.isVerifiedDefault) ||
            investigationState.timelineVerifiedIds.includes(event.id) ||
            Boolean(
              event.requiresEvidenceId &&
                investigationState.unlockedEvidenceIds.includes(event.requiresEvidenceId)
            );

          return (
            <div key={event.id} className="relative flex flex-col gap-1.5">
              {/* Timeline Pin Node */}
              <div
                className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  isVerified
                    ? 'bg-[#0d0e11] border-[#45dfa4]'
                    : 'bg-[#1b1b1f] border-[#dc2626]'
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isVerified ? 'bg-[#45dfa4]' : 'bg-[#dc2626] animate-pulse'
                  }`}
                ></div>
              </div>

              {/* Event Card */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  isVerified
                    ? 'bg-[#1f1f23] border-[#292a2d] shadow-md'
                    : 'bg-[#1b1b1f]/80 border-dashed border-[#5c403c]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[#ffb4ab] tracking-wider">
                    {event.time}
                  </span>
                  <span
                    className={`font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isVerified
                        ? 'bg-[#00452e] text-[#45dfa4] border border-[#00bd85]/40'
                        : 'bg-[#93000a] text-[#ffb4ab]'
                    }`}
                  >
                    {isVerified ? 'VERIFIED BY TELEMETRY' : 'UNCONFIRMED ALIBI'}
                  </span>
                </div>

                <h4 className="font-heading text-sm font-bold text-[#e3e2e6] mt-1">
                  {event.title}
                </h4>

                <div className="flex items-center gap-3 font-mono text-[10px] text-[#94a3b8] mt-0.5">
                  <span>ACTOR: <strong className="text-[#e3e2e6]">{event.actor || event.suspectId || 'UNKNOWN'}</strong></span>
                  <span>LOC: <strong className="text-[#e3e2e6]">{event.location}</strong></span>
                </div>

                <p className="font-sans text-xs text-[#94a3b8] mt-1.5 leading-relaxed">
                  {event.description}
                </p>

                {(event.requiresEvidenceId || event.associatedEvidenceId) && (
                  <div className="mt-2 pt-2 border-t border-[#292a2d] flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#f9bd22] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">link</span>
                      CORROBORATING ASSET: {(event.requiresEvidenceId || event.associatedEvidenceId || '').toUpperCase()}
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('evidence-locker')}
                      className="px-2 py-0.5 bg-[#292a2d] hover:bg-[#343538] text-[#e3e2e6] rounded font-mono text-[10px] transition-colors"
                    >
                      VIEW ASSET
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};
