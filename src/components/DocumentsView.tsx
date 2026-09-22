import React, { useState } from 'react';
import { CaseData, NavTab } from '../types';

interface DocumentsViewProps {
  caseData: CaseData;
  onNavigateTab: (tab: NavTab) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ caseData, onNavigateTab }) => {
  const [activeDocIdx, setActiveDocIdx] = useState(0);
  const [uvMode, setUvMode] = useState(false);

  // Combine standard case documents with crime-scene forensics
  const baseDocs = (caseData.documents && caseData.documents.length > 0)
    ? caseData.documents.map((d) => ({
        id: d.id,
        title: d.title,
        fileCode: d.code,
        date: d.date || `${caseData.date} // ARCHIVE`,
        classification: d.classification || 'RESTRICTED',
        body: d.content,
        uvNote: `SYSTEM ANALYSIS // Forensic checksum verified for ${d.code}. Cross-reference with evidence locker.`,
      }))
    : [];

  const defaultDocs = [
    {
      id: 'doc-autopsy',
      title: 'OFFICIAL CORONER AUTOPSY & TOXICOLOGY REPORT',
      fileCode: `DOC-TOX-0${caseData.number}B`,
      date: `${caseData.date} // 23:15 HRS`,
      classification: 'RESTRICTED MEDICAL EXAMINER',
      body: `CORONER REPORT // VICTIM: ${caseData.victim.name.toUpperCase()}
AGE: ${caseData.victim.age} | GENDER: UNKNOWN/M | EST. TIME OF DEATH: ${caseData.victim.timeOfDeath || caseData.time}
PATHOLOGY: ${caseData.victim.pathology}
LOCATION: ${caseData.victim.location}
CORONER CONCLUSION: Homicide by lethal external intervention. Immediate criminal investigation declared.`,
      uvNote: 'MICRO-TRACE ANOMALY: Traces of synthetic alkaloid compound and foreign fiber residue detected.',
    },
    {
      id: 'doc-access',
      title: 'SECURITY PERIMETER & GATEWAY TELEMETRY AUDIT',
      fileCode: `SEC-LOG-0${caseData.number}-GATEWAY`,
      date: `${caseData.date} // 20:00 - 23:00 HRS`,
      classification: 'FACILITIES INTELLIGENCE',
      body: `LOGGED ACCESS SCANS // ${caseData.title.toUpperCase()}
---------------------------------------------------------------------
- 20:55 - ACCESS GATEWAY #1 (AUTHORIZED RECEPTION TRANSFER)
- 21:05 - BIOMETRIC CORRIDOR SCAN DETECTED
- 21:10 - [ANOMALY] MAINS POWER RELAY DISRUPTED. CCTV BUFFER SUSPENDED.
- 21:21 - SERVICES RE-ESTABLISHED AUTOMATICALLY BY TIMED DAEMON.
- 21:58 - HARDWARE TELEMETRY REGISTER: LOCK ENGAGED BY DELAYED OVERRIDE.`,
      uvNote: 'SERVER ROOM LOG: Terminal session initiated during blackout using backdoor administrative credentials.',
    },
  ];

  const docs = [...baseDocs, ...defaultDocs];
  const currentDoc = docs[activeDocIdx] || docs[0];

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 py-3 pb-28 gap-4">
      {/* Telemetry Header */}
      <div className="flex items-center justify-between p-3 bg-[#0d0e11] rounded-lg border border-[#292a2d]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ffb4ab] text-[18px]">description</span>
          <span className="font-mono text-xs text-[#e3e2e6] font-bold tracking-widest uppercase">
            CLASSIFIED DOCUMENT REPOSITORY
          </span>
        </div>
        <button
          type="button"
          onClick={() => setUvMode(!uvMode)}
          className={`px-3 py-1 rounded font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            uvMode
              ? 'bg-[#9333ea] text-white shadow-[0_0_12px_rgba(147,51,234,0.5)]'
              : 'bg-[#1f1f23] text-[#c084fc] hover:bg-[#292a2d] border border-[#292a2d]'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">lightbulb</span>
          <span>UV DECENSOR {uvMode ? 'ACTIVE' : 'OFF'}</span>
        </button>
      </div>

      {/* Doc Selector Tabs */}
      <div className="flex items-center gap-2 flex-wrap py-1">
        {docs.map((doc, idx) => (
          <button
            key={doc.id}
            type="button"
            onClick={() => setActiveDocIdx(idx)}
            className={`px-3 py-2 rounded-lg font-mono text-xs uppercase tracking-wide whitespace-nowrap transition-colors border ${
              activeDocIdx === idx
                ? 'bg-[#dc2626] text-white border-[#dc2626] font-bold'
                : 'bg-[#1f1f23] text-[#94a3b8] hover:text-[#e3e2e6] border-[#292a2d]'
            }`}
          >
            DOC 0{idx + 1}: {doc.fileCode}
          </button>
        ))}
      </div>

      {/* Document View Sheet */}
      {currentDoc && (
        <div
          className={`p-6 rounded-xl border font-mono text-xs sm:text-sm shadow-xl flex flex-col gap-4 relative transition-colors ${
            uvMode
              ? 'bg-[#120f1e] border-[#9333ea] text-[#e9d5ff]'
              : 'bg-[#1b1b1f] border-[#292a2d] text-[#e3e2e6]'
          }`}
        >
          {/* Classified Stamp */}
          <div className="flex items-center justify-between border-b border-[#343538] pb-3">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#ffb4ab] font-bold tracking-widest uppercase">
                {currentDoc.classification}
              </span>
              <h3 className="font-heading text-base sm:text-lg font-bold text-[#e3e2e6] tracking-tight">
                {currentDoc.title}
              </h3>
            </div>
            <div className="px-3 py-1 rounded border border-[#dc2626] text-[#dc2626] font-bold text-xs uppercase tracking-widest rotate-2">
              CONFIDENTIAL
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#94a3b8]">
            <span>REF: {currentDoc.fileCode}</span>
            <span>TIMESTAMP: {currentDoc.date}</span>
          </div>

          {/* Content */}
          <div className="p-4 bg-[#0d0e11] rounded-lg border border-[#292a2d] whitespace-pre-wrap leading-relaxed select-text font-mono text-xs sm:text-sm text-[#e3e2e6]">
            {currentDoc.body}
          </div>

          {/* UV Note if activated */}
          {uvMode && (
            <div className="p-3 bg-[#2e1065]/60 rounded-lg border border-[#9333ea] text-[#f5d0fe] flex items-start gap-2">
              <span className="material-symbols-outlined text-[#c084fc] text-[18px]">biotech</span>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] font-bold text-[#c084fc] uppercase tracking-wider">
                  FLUORESCENT MARKINGS DETECTED UNDER 365NM UV
                </span>
                <p className="font-sans text-xs mt-0.5 text-[#f5d0fe] leading-relaxed">
                  {currentDoc.uvNote}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-[#343538]">
            <span className="text-[10px] text-[#94a3b8]">ARCHIVED IN FORENSIC DATABASE</span>
            <button
              type="button"
              onClick={() => onNavigateTab('tactical-terminal')}
              className="px-3 py-1.5 bg-[#292a2d] hover:bg-[#343538] text-[#e3e2e6] rounded font-mono text-xs flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">terminal</span>
              CROSS-REFERENCE IN TERMINAL
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
