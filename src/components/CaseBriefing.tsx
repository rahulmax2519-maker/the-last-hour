import React, { useState } from 'react';
import { CaseData, InvestigationState } from '../types';

interface CaseBriefingProps {
  caseData: CaseData;
  investigationState: InvestigationState;
  onStartInvestigation: () => void;
  onOpenSchematics: () => void;
  onOpenWitnessAudio: () => void;
  onQuickInspectArtifact: (type: string) => void;
}

export const CaseBriefing: React.FC<CaseBriefingProps> = ({
  caseData,
  investigationState,
  onStartInvestigation,
  onOpenSchematics,
  onOpenWitnessAudio,
  onQuickInspectArtifact,
}) => {
  const [artifactStatus, setArtifactStatus] = useState<Record<string, string>>({});
  const isInProgress = investigationState.status === 'in_progress';

  const handleArtifactAction = (key: string, result: string) => {
    setArtifactStatus((prev) => ({ ...prev, [key]: result }));
    onQuickInspectArtifact(key);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 py-3 pb-36 gap-5">
      {/* Top Classified Header */}
      <div className="px-3 py-2 bg-[#0d0e11] rounded border border-[#292a2d] flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[#dc2626] text-[15px] flex-shrink-0 animate-pulse">
            lock
          </span>
          <span className="font-mono text-xs text-[#ffb4ab] tracking-widest uppercase truncate">
            CASE FILE: {caseData.number} // SEC-CLEARANCE OMEGA
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 bg-[#292a2d] px-2 py-0.5 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] animate-ping"></span>
          <span className="font-mono text-[10px] text-[#ffb4ab] font-bold uppercase">
            {isInProgress ? 'ACTIVE' : 'BRIEFING'}
          </span>
        </div>
      </div>

      {/* Hero Crime Scene Banner */}
      <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden bg-[#1b1b1f] border border-[#292a2d] shadow-xl">
        <img
          src={caseData.victim.image}
          alt={caseData.victim.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e11] via-[#0d0e11]/60 to-transparent"></div>

        <div className="absolute top-2.5 right-2.5 bg-[#dc2626]/90 px-2 py-0.5 rounded flex items-center gap-1 shadow backdrop-blur-sm">
          <span className="font-mono text-[10px] text-[#fff6f5] font-bold tracking-wider">
            EVID-A0{caseData.number} CLASSIFIED
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex flex-col">
          <div className="flex items-center gap-1.5 text-[#45dfa4]">
            <span className="material-symbols-outlined text-[16px]">fingerprint</span>
            <span className="font-mono text-[10px] tracking-wider uppercase font-semibold">
              DECEASED PERSON OF INTEREST
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-heading text-xl sm:text-2xl font-bold text-[#e3e2e6] tracking-tight">
              {caseData.victim.name}
            </span>
            <span className="font-mono text-xs text-[#94a3b8] font-semibold">
              AGE {caseData.victim.age}
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#ac8884] tracking-wide">
            {caseData.victim.title}, {caseData.victim.company}
          </span>
        </div>
      </div>

      {/* Telemetry Parameter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#1b1b1f] p-3 rounded-lg border border-[#292a2d] shadow-sm">
        <div className="flex flex-col p-2.5 bg-[#1f1f23] rounded border border-[#292a2d]">
          <span className="font-mono text-[10px] text-[#ac8884] tracking-wider uppercase">SCENE LOCATION</span>
          <span className="font-heading text-sm text-[#e3e2e6] font-semibold truncate mt-0.5">
            {caseData.victim.location}
          </span>
          <span className="font-mono text-[10px] text-[#94a3b8]">Verified by Forensic Unit</span>
        </div>

        <div className="flex flex-col p-2.5 bg-[#1f1f23] rounded border border-[#292a2d]">
          <span className="font-mono text-[10px] text-[#ac8884] tracking-wider uppercase">INCIDENT TIME</span>
          <span className="font-mono text-sm text-[#ffb4ab] font-bold truncate mt-0.5">
            {caseData.date} · {caseData.time}
          </span>
          <span className="font-mono text-[10px] text-[#94a3b8]">T-Zero to Expiry logged</span>
        </div>

        <div className="sm:col-span-2 flex flex-col p-2.5 bg-[#1f1f23] rounded border border-[#292a2d]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#ffb4ab] tracking-wider uppercase font-semibold">
              LETHAL PATHOLOGY
            </span>
            <span className="material-symbols-outlined text-[#ffb4ab] text-[16px]">warning</span>
          </div>
          <p className="font-sans text-xs text-[#e3e2e6] mt-1 leading-relaxed">
            {caseData.victim.pathology}
          </p>
        </div>
      </div>

      {/* Incident Report Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#dc2626] rounded-full"></span>
            <h2 className="font-heading text-base font-bold text-[#e3e2e6] uppercase tracking-tight">
              INCIDENT REPORT
            </h2>
          </div>
          <span className="font-mono text-[10px] text-[#45dfa4] bg-[#00452e]/50 px-2 py-0.5 rounded border border-[#00bd85]/40">
            CHAIN: VERIFIED
          </span>
        </div>

        <div className="bg-[#1b1b1f] p-4 rounded-lg border border-[#292a2d] shadow-sm flex flex-col gap-3">
          {caseData.incidentLogs.map((log, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold tracking-wide text-[#ffb4ab]">
                  {log.tag}
                </span>
                <span
                  className={`font-mono text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                    log.level === 'critical'
                      ? 'bg-[#93000a]/50 text-[#ffb4ab]'
                      : log.level === 'warn'
                      ? 'bg-[#916c00]/50 text-[#f9bd22]'
                      : 'bg-[#292a2d] text-[#ac8884]'
                  }`}
                >
                  {log.title}
                </span>
              </div>
              <p className="font-sans text-xs text-[#e3e2e6] leading-relaxed">
                {log.text}
              </p>
              {idx < caseData.incidentLogs.length - 1 && (
                <div className="w-full h-px bg-[#292a2d] my-1"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Suspect Profiles Preview */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#f9bd22] rounded-full"></span>
            <h2 className="font-heading text-base font-bold text-[#e3e2e6] uppercase tracking-tight">
              SUSPECT PROFILES
            </h2>
          </div>
          <span className="font-mono text-[10px] text-[#94a3b8]">
            {caseData.suspects.length} CLEARED ENTITIES
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {caseData.suspects.map((suspect) => (
            <div
              key={suspect.id}
              className="bg-[#1b1b1f] rounded-lg p-3 border border-[#292a2d] shadow-sm flex flex-col gap-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-[#0d0e11] border border-[#292a2d]">
                  <img
                    src={suspect.avatar}
                    alt={suspect.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-xs font-bold text-[#e3e2e6] truncate">
                      {suspect.name} ({suspect.age})
                    </span>
                    <span className="font-mono text-[9px] text-[#ffb4ab] bg-[#93000a]/30 px-1.5 py-0.2 rounded font-bold">
                      {suspect.suspicionScore}%
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#ac8884] uppercase truncate">
                    {suspect.occupation}
                  </span>
                  <div className="mt-0.5">
                    <span className="font-mono text-[9px] text-[#f9bd22] bg-[#1f1f23] px-1 py-0.2 rounded">
                      {suspect.relationship}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1f1f23] p-2 rounded border border-[#292a2d] flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-[#ac8884] uppercase">STATED ALIBI</span>
                  <span
                    className={`font-mono text-[9px] font-bold tracking-wider ${
                      suspect.alibi.status === 'COMPROMISED' || suspect.alibi.status === 'CONFLICTING'
                        ? 'text-[#ffb4ab]'
                        : 'text-[#45dfa4]'
                    }`}
                  >
                    {suspect.alibi.status}
                  </span>
                </div>
                <p className="font-sans text-[11px] text-[#94a3b8] line-clamp-2">
                  {suspect.alibi.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Forensic Artifacts Quick Row */}
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] text-[#ac8884] uppercase tracking-wider">
          FORENSIC ARTIFACTS IN REPOSITORY
        </span>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#1b1b1f] p-2.5 rounded-lg border border-[#292a2d] flex flex-col gap-1 shadow-sm">
            <span className="material-symbols-outlined text-[#dc2626] text-[20px]">coffee</span>
            <span className="font-mono text-xs text-[#e3e2e6] font-bold truncate">ESPRESSO CUP</span>
            <span className="font-mono text-[9px] text-[#ac8884]">Synthetic Alkaloid</span>
            <button
              type="button"
              onClick={() => handleArtifactAction('vial', 'SCANNED')}
              className="mt-1 py-1 text-center bg-[#1f1f23] hover:bg-[#292a2d] rounded font-mono text-[10px] text-[#ffb4ab] border border-[#343538] transition-colors"
            >
              {artifactStatus['vial'] || 'SCAN VIAL'}
            </button>
          </div>

          <div className="bg-[#1b1b1f] p-2.5 rounded-lg border border-[#292a2d] flex flex-col gap-1 shadow-sm">
            <span className="material-symbols-outlined text-[#45dfa4] text-[20px]">memory</span>
            <span className="font-mono text-xs text-[#e3e2e6] font-bold truncate">MICRO-SD CARD</span>
            <span className="font-mono text-[9px] text-[#ac8884]">Encrypted Memo</span>
            <button
              type="button"
              onClick={() => handleArtifactAction('hash', 'LOADED')}
              className="mt-1 py-1 text-center bg-[#1f1f23] hover:bg-[#292a2d] rounded font-mono text-[10px] text-[#45dfa4] border border-[#343538] transition-colors"
            >
              {artifactStatus['hash'] || 'CRACK HASH'}
            </button>
          </div>

          <div className="bg-[#1b1b1f] p-2.5 rounded-lg border border-[#292a2d] flex flex-col gap-1 shadow-sm">
            <span className="material-symbols-outlined text-[#f9bd22] text-[20px]">videocam_off</span>
            <span className="font-mono text-xs text-[#e3e2e6] font-bold truncate">CCTV FEED</span>
            <span className="font-mono text-[9px] text-[#ac8884]">11-Min Drop</span>
            <button
              type="button"
              onClick={() => handleArtifactAction('cctv', 'SYNCED')}
              className="mt-1 py-1 text-center bg-[#1f1f23] hover:bg-[#292a2d] rounded font-mono text-[10px] text-[#f9bd22] border border-[#343538] transition-colors"
            >
              {artifactStatus['cctv'] || 'RECOVER'}
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Operational Dock */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0d0e11]/95 backdrop-blur-md p-3 border-t border-[#292a2d] shadow-[0_-8px_24px_rgba(0,0,0,0.7)] flex flex-col gap-2 pb-safe">
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-2">
          <button
            type="button"
            onClick={onStartInvestigation}
            className="w-full py-3.5 px-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.45)] transition-all active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[20px] animate-pulse">radar</span>
            <span className="font-mono text-xs sm:text-sm font-bold tracking-wider uppercase">
              {isInProgress ? 'RESUME INVESTIGATION WORKSTATION' : 'START INVESTIGATION WORKSTATION'}
            </span>
            <span className="font-mono text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white">
              OM-0{caseData.number}
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onOpenSchematics}
              className="py-2 px-2 bg-[#1f1f23] hover:bg-[#292a2d] text-[#e3e2e6] rounded border border-[#292a2d] flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-[#ac8884]">floor</span>
              <span className="font-mono text-xs font-semibold truncate uppercase">CRIME SCHEMATICS</span>
            </button>
            <button
              type="button"
              onClick={onOpenWitnessAudio}
              className="py-2 px-2 bg-[#1f1f23] hover:bg-[#292a2d] text-[#e3e2e6] rounded border border-[#292a2d] flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-[#ac8884]">record_voice_over</span>
              <span className="font-mono text-xs font-semibold truncate uppercase">WITNESS AUDIO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
