import React, { useState } from 'react';
import { CaseData, Evidence, InvestigationState } from '../types';

interface EvidenceLockerProps {
  caseData: CaseData;
  investigationState: InvestigationState;
  onInspectEvidence: (item: Evidence) => void;
  onOpenTerminalForPuzzle: (puzzleId: string) => void;
}

export const EvidenceLocker: React.FC<EvidenceLockerProps> = ({
  caseData,
  investigationState,
  onInspectEvidence,
  onOpenTerminalForPuzzle,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [uvActiveMap, setUvActiveMap] = useState<Record<string, boolean>>({});
  const [scanningMap, setScanningMap] = useState<Record<string, boolean>>({});

  const toggleUv = (id: string) => {
    setUvActiveMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const triggerSpectralScan = (id: string) => {
    setScanningMap((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setScanningMap((prev) => ({ ...prev, [id]: false }));
    }, 1800);
  };

  const filteredEvidence = caseData.evidence.filter((item) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'DIGITAL') return item.type === 'DIGITAL';
    if (activeFilter === 'PHOTO') return item.type === 'PHOTO';
    if (activeFilter === 'FORENSIC') return item.type === 'FORENSIC';
    if (activeFilter === 'DOCUMENTS') return item.type === 'DOCUMENTS';
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 py-3 pb-28 gap-5">
      {/* Telemetry Bar */}
      <section className="flex flex-col gap-2 p-3 bg-[#0d0e11] rounded-lg border border-[#292a2d]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f9bd22] text-[18px]">inventory_2</span>
            <span className="font-mono text-xs text-[#ffb4ab] font-bold tracking-widest uppercase">
              CASE {caseData.number} // EVIDENCE REPOSITORY
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="text-[#94a3b8]">LOGGED:</span>
            <span className="text-[#45dfa4] font-bold">
              {investigationState.unlockedEvidenceIds.length} / {caseData.evidence.length} UNLOCKED
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap py-1">
          {[
            { id: 'ALL', label: 'ALL ARTIFACTS' },
            { id: 'DIGITAL', label: 'DIGITAL LOGS' },
            { id: 'PHOTO', label: 'PHOTO / CCTV' },
            { id: 'FORENSIC', label: 'FORENSIC / TOX' },
            { id: 'DOCUMENTS', label: 'DOCUMENTS' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded font-mono text-xs uppercase tracking-wide whitespace-nowrap transition-colors ${
                activeFilter === tab.id
                  ? 'bg-[#dc2626] text-white font-bold'
                  : 'bg-[#292a2d] text-[#94a3b8] hover:text-[#e3e2e6]'
              }`}
            >
              [{tab.label}]
            </button>
          ))}
        </div>
      </section>

      {/* Evidence Cards Stack */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvidence.map((item) => {
          const isUnlocked = investigationState.unlockedEvidenceIds.includes(item.id);
          const isUvOn = uvActiveMap[item.id] || false;
          const isScanning = scanningMap[item.id] || false;

          return (
            <article
              key={item.id}
              className={`flex flex-col rounded-xl overflow-hidden bg-[#1f1f23] border border-[#292a2d] shadow-lg transition-all ${
                !isUnlocked ? 'opacity-85 border-dashed border-[#5c403c]' : 'hover:border-[#384259]'
              }`}
            >
              {/* Media Display Window */}
              <div className="relative h-48 w-full bg-[#0d0e11] overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      !isUnlocked ? 'filter blur-sm brightness-50 contrast-125' : ''
                    }`}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#121316] font-mono text-xs text-[#45dfa4]">
                    <span className="material-symbols-outlined text-[32px] text-[#94a3b8] mb-1">
                      terminal
                    </span>
                    <span>LOG FILE: {item.title}</span>
                  </div>
                )}

                {/* Scanline Sweep animation when scanning */}
                {isScanning && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#45dfa4]/30 to-transparent animate-[scanline_1.8s_ease-in-out_infinite] pointer-events-none border-b-2 border-[#45dfa4]"></div>
                )}

                {/* CCTV Overlays if code or title relates to CCTV */}
                {(item.code.includes('CCTV') || item.title.includes('CCTV')) && (
                  <div className="absolute inset-0 pointer-events-none p-2 flex flex-col justify-between font-mono text-[9px] text-[#45dfa4]">
                    <div className="flex justify-between items-center bg-[#0d0e11]/60 px-2 py-0.5 rounded">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#dc2626] animate-pulse"></span>
                        REC [CCTV-OPTIC-STREAM]
                      </span>
                      <span>FPS: 29.97 // 1080P</span>
                    </div>
                    {/* Targeting HUD crosshair */}
                    <div className="self-center w-16 h-16 border border-[#45dfa4]/60 rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-[#45dfa4] rounded-full"></div>
                    </div>
                    <div className="flex justify-between bg-[#0d0e11]/60 px-2 py-0.5 rounded">
                      <span>TIMESTAMP: {item.timestamp || '21:18:42'}</span>
                      <span>OPTICAL ZOOM: 2.8X</span>
                    </div>
                  </div>
                )}

                {/* Classification Tag Top Right */}
                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded bg-[#0d0e11]/85 text-[#ffb4ab] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#292a2d]">
                    {item.type}
                  </span>
                </div>

                {/* Item Number Badge Top Left */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#dc2626] text-white font-mono text-[10px] font-bold tracking-widest uppercase shadow">
                  {item.code}
                </div>

                {/* Lock Overlay if locked */}
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-[#0d0e11]/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center gap-2">
                    <span className="material-symbols-outlined text-[#dc2626] text-[36px] animate-pulse">
                      lock
                    </span>
                    <span className="font-mono text-xs text-[#ffb4ab] font-bold tracking-widest uppercase">
                      ENCRYPTED FORENSIC PAYLOAD
                    </span>
                    <p className="font-mono text-[11px] text-[#94a3b8] max-w-xs">
                      Requires cryptographic resolution in terminal.
                    </p>
                    {item.requiresPuzzleId && (
                      <button
                        type="button"
                        onClick={() => onOpenTerminalForPuzzle(item.requiresPuzzleId!)}
                        className="mt-1 px-3 py-1.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow"
                      >
                        <span className="material-symbols-outlined text-[14px]">terminal</span>
                        DECRYPT IN TERMINAL
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col gap-2.5 flex-1 justify-between">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-heading text-base font-bold text-[#e3e2e6] tracking-tight">
                      {item.title}
                    </h3>
                    <span className="font-mono text-[10px] text-[#45dfa4] uppercase font-semibold">
                      {item.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-[#94a3b8]">
                    <span>LOC: {item.location || 'CRIME SCENE'}</span>
                    <span>TIME: {item.timestamp || 'OCT 24'}</span>
                  </div>

                  {/* Analysis Content */}
                  <div
                    className={`p-2.5 rounded border transition-colors ${
                      isUvOn
                        ? 'bg-[#1b172b] border-[#9333ea] text-[#e9d5ff]'
                        : 'bg-[#1b1b1f] border-[#292a2d] text-[#e3e2e6]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] uppercase font-bold text-[#f9bd22] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">biotech</span>
                        FORENSIC ANALYSIS
                      </span>
                      {isUvOn && (
                        <span className="font-mono text-[9px] text-[#c084fc] font-bold animate-pulse">
                          UV LAMP ACTIVE // 365NM
                        </span>
                      )}
                    </div>
                    <div className="font-sans text-xs leading-relaxed">
                      {isUnlocked ? (
                        item.isRedacted && item.redactedData ? (
                          isUvOn ? (
                            <span>
                              {item.redactedData.before}
                              <strong className="text-[#45dfa4] bg-[#00452e] px-1 rounded">
                                {item.redactedData.revealed1}
                              </strong>
                              {item.redactedData.mid}
                              <strong className="text-[#45dfa4] bg-[#00452e] px-1 rounded">
                                {item.redactedData.revealed2}
                              </strong>
                              {item.redactedData.after}
                            </span>
                          ) : (
                            <span>
                              {item.redactedData.before}
                              <span className="bg-black text-black px-2 py-0.5 rounded select-none">
                                REDACTED
                              </span>
                              {item.redactedData.mid}
                              <span className="bg-black text-black px-2 py-0.5 rounded select-none">
                                REDACTED
                              </span>
                              {item.redactedData.after}
                            </span>
                          )
                        ) : (
                          item.description
                        )
                      ) : (
                        'ENCRYPTED HASH / ACCESS RESTRICTED UNTIL SECURITY PROTOCOL CRACKED.'
                      )}
                    </div>
                  </div>

                  {/* Terminal Log or Diagnostic Fields if available */}
                  {isUnlocked && item.terminalLog && (
                    <div className="p-2 bg-[#090a0d] rounded border border-[#292a2d] font-mono text-[10px] text-[#45dfa4] space-y-0.5">
                      {item.terminalLog.map((log, lIdx) => (
                        <div key={lIdx}>{log}</div>
                      ))}
                    </div>
                  )}

                  {isUnlocked && item.diagnosticFields && (
                    <div className="grid grid-cols-2 gap-1.5 p-2 bg-[#090a0d] rounded border border-[#292a2d]">
                      {item.diagnosticFields.map((field, fIdx) => (
                        <div key={fIdx} className="flex flex-col text-[10px]">
                          <span className="text-[#94a3b8]">{field.label}:</span>
                          <span
                            className={`font-mono font-bold ${
                              field.highlight ? 'text-[#ffb4ab]' : 'text-[#45dfa4]'
                            }`}
                          >
                            {field.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#292a2d]">
                  <button
                    type="button"
                    onClick={() => onInspectEvidence(item)}
                    className="flex-1 py-1.5 bg-[#292a2d] hover:bg-[#343538] text-[#e3e2e6] rounded font-mono text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">zoom_in</span>
                    3.2X MAGNIFY
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerSpectralScan(item.id)}
                    className="px-2.5 py-1.5 bg-[#1b1b1f] hover:bg-[#292a2d] text-[#45dfa4] rounded font-mono text-xs font-semibold border border-[#292a2d] flex items-center gap-1 transition-colors"
                    title="Run Spectral Frequency Analysis"
                  >
                    <span className="material-symbols-outlined text-[15px]">sensors</span>
                    <span className="hidden sm:inline">SCAN</span>
                  </button>

                  {item.isRedacted && isUnlocked && (
                    <button
                      type="button"
                      onClick={() => toggleUv(item.id)}
                      className={`px-2.5 py-1.5 rounded font-mono text-xs font-semibold flex items-center gap-1 transition-colors ${
                        isUvOn
                          ? 'bg-[#9333ea] text-white shadow-[0_0_12px_rgba(147,51,234,0.5)]'
                          : 'bg-[#1b1b1f] hover:bg-[#292a2d] text-[#c084fc] border border-[#292a2d]'
                      }`}
                      title="Toggle UV De-censor light"
                    >
                      <span className="material-symbols-outlined text-[15px]">lightbulb</span>
                      <span>UV</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
};
