import React, { useState } from 'react';
import { CaseData, InvestigationState, AccusationPayload } from '../types';
import { formatTimer, calculateRank } from '../utils/storage';

interface FinalAccusationProps {
  caseData: CaseData;
  investigationState: InvestigationState;
  onSubmitAccusation: (payload: AccusationPayload) => { success: boolean; message: string };
  onSelectNextCase: () => void;
  onReturnToCases: () => void;
}

export const FinalAccusation: React.FC<FinalAccusationProps> = ({
  caseData,
  investigationState,
  onSubmitAccusation,
  onSelectNextCase,
  onReturnToCases,
}) => {
  const [suspectId, setSuspectId] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [method, setMethod] = useState<string>('');
  const [motive, setMotive] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSolved = investigationState.status === 'solved';

  const timeOptions = [
    '20:30 - 21:00 (Pre-incident preparation)',
    '21:10 - 21:21 (During the 11-minute CCTV blackout)',
    '21:45 - 22:00 (Post-discovery cleanup)',
    '22:15 - 22:30 (Arrival of security detail)',
  ];

  const locationOptions = [
    caseData.victim.location,
    'Executive Server Room 44-B',
    'Private Office Balcony & Ventilation Duct',
    'Service Freight Elevator & Basement Relay',
  ];

  const methodOptions = [
    'Administering synthetic digitalis alkaloid into personal espresso thermos during system blackout',
    'Mechanical blunt trauma with concealed executive award statue',
    'Remote atmospheric oxygen venting via HVAC firmware backdoor',
    'Staged suicide with digital override of internal deadbolts',
  ];

  const motiveOptions = [
    'Concealing offshore embezzlement of $14.2M prior to impending federal regulatory audit',
    'Corporate acquisition dispute and hostile takeover clause',
    'Personal revenge over intellectual property patent theft',
    'Blackmail regarding illicit server backdoor sales',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspectId || !time || !location || !method || !motive) {
      setErrorMessage('CRITICAL: All indictment fields must be specified before presenting charges.');
      return;
    }

    const res = onSubmitAccusation({
      suspectId,
      time,
      location,
      method,
      motive,
      notes,
    });

    if (!res.success) {
      setErrorMessage(res.message);
    } else {
      setErrorMessage(null);
    }
  };

  // If case is solved, render the Victory Dossier
  if (isSolved) {
    const finalRank = calculateRank(investigationState.score);

    return (
      <div className="flex flex-col w-full max-w-4xl mx-auto px-4 py-4 pb-32 gap-6 animate-fadeIn">
        {/* Victory Banner */}
        <section className="relative overflow-hidden rounded-xl bg-[#00452e] p-6 border-2 border-[#00bd85] shadow-[0_0_30px_rgba(0,189,133,0.3)]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#45dfa4] text-[24px]">verified</span>
              <span className="font-mono text-xs text-[#45dfa4] font-bold tracking-widest uppercase">
                CASE CLOSED // HOMICIDE CLEARED
              </span>
            </div>
            <div className="px-3 py-1 rounded bg-[#0d0e11] font-mono text-sm text-[#45dfa4] font-bold tracking-wider border border-[#00bd85]/40">
              {finalRank}
            </div>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
            THE TRUTH HAS BEEN UNCOVERED
          </h1>
          <p className="font-sans text-sm text-[#b4f0d6] mt-1 leading-relaxed">
            Your indictment stood up to strict forensic cross-examination. The perpetrator has been remanded into federal custody.
          </p>
        </section>

        {/* Telemetry Performance Grid */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#1b1b1f] p-4 rounded-xl border border-[#292a2d]">
          <div className="flex flex-col p-3 rounded bg-[#1f1f23] border border-[#292a2d]">
            <span className="font-mono text-[10px] text-[#94a3b8] uppercase">Time Elapsed</span>
            <span className="font-mono text-base font-bold text-[#ffb4ab]">
              {formatTimer(investigationState.elapsedSeconds)}
            </span>
          </div>

          <div className="flex flex-col p-3 rounded bg-[#1f1f23] border border-[#292a2d]">
            <span className="font-mono text-[10px] text-[#94a3b8] uppercase">Final Score</span>
            <span className="font-mono text-base font-bold text-[#f9bd22]">
              {investigationState.score} PTS
            </span>
          </div>

          <div className="flex flex-col p-3 rounded bg-[#1f1f23] border border-[#292a2d]">
            <span className="font-mono text-[10px] text-[#94a3b8] uppercase">Puzzles Solved</span>
            <span className="font-mono text-base font-bold text-[#45dfa4]">
              {investigationState.solvedPuzzleIds.length} / {caseData.puzzles.length}
            </span>
          </div>

          <div className="flex flex-col p-3 rounded bg-[#1f1f23] border border-[#292a2d]">
            <span className="font-mono text-[10px] text-[#94a3b8] uppercase">Wrong Accusations</span>
            <span className="font-mono text-base font-bold text-[#ffb4ab]">
              {investigationState.wrongAccusationsCount}
            </span>
          </div>
        </section>

        {/* Perpetrator Dossier Card */}
        <section className="flex flex-col bg-[#1f1f23] rounded-xl border border-[#292a2d] overflow-hidden shadow-lg p-5 gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
            <h2 className="font-heading text-lg font-bold text-[#e3e2e6] uppercase tracking-wide">
              CONVICTED PERPETRATOR: {(caseData.solution.murdererName || caseData.solution.killerName || '').toUpperCase()}
            </h2>
          </div>

          <div className="p-4 bg-[#0d0e11] rounded-lg border border-[#292a2d] flex flex-col gap-2 font-mono text-xs">
            <div className="text-[#ffb4ab]">
              <strong>TIMING:</strong> {caseData.solution.time || caseData.solution.timeOfMurder}
            </div>
            <div className="text-[#ffb4ab]">
              <strong>LOCATION:</strong> {caseData.solution.location}
            </div>
            <div className="text-[#e3e2e6]">
              <strong>METHOD:</strong> {caseData.solution.method}
            </div>
            <div className="text-[#f9bd22]">
              <strong>MOTIVE:</strong> {caseData.solution.motive}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-[11px] text-[#45dfa4] uppercase font-bold tracking-wider">
              FULL CASE RECONSTRUCTION
            </span>
            <p className="font-sans text-sm text-[#94a3b8] leading-relaxed whitespace-pre-line">
              {caseData.solution.summary || caseData.solution.fullNarrative}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onSelectNextCase}
              className="flex-1 py-3.5 px-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">folder_special</span>
              <span>INVESTIGATE NEXT CASE</span>
            </button>

            <button
              type="button"
              onClick={onReturnToCases}
              className="py-3.5 px-4 bg-[#292a2d] hover:bg-[#343538] text-[#e3e2e6] rounded font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 border border-[#343538] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>ALL CASE FILES</span>
            </button>
          </div>
        </section>
      </div>
    );
  }

  // Active Accusation Form
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 py-3 pb-32 gap-5">
      {/* Warning Telemetry Header */}
      <section className="p-4 bg-[#93000a]/30 rounded-xl border border-[#ff5449]/40 flex items-start gap-3 shadow-md">
        <span className="material-symbols-outlined text-[#ffb4ab] text-[24px] shrink-0 mt-0.5 animate-pulse">
          crisis_alert
        </span>
        <div className="flex flex-col">
          <span className="font-mono text-xs font-bold text-[#ffb4ab] tracking-widest uppercase">
            HIGH-STAKES INDICTMENT PROTOCOL
          </span>
          <p className="font-sans text-xs text-[#ffdad6] mt-0.5 leading-relaxed">
            Submitting a false accusation carries a severe penalty of <strong>-200 PTS</strong> and compromises case integrity. Ensure every element of your accusation is corroborated by verified physical and digital evidence.
          </p>
        </div>
      </section>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-[#93000a] text-[#ffdad6] rounded-xl border border-[#ff5449] font-mono text-xs flex items-start gap-2 animate-shake">
          <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
          <div>
            <strong className="block text-white font-bold uppercase mb-0.5">INDICTMENT REJECTED:</strong>
            {errorMessage}
          </div>
        </div>
      )}

      {/* Indictment Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-[#1b1b1f] p-5 rounded-xl border border-[#292a2d] shadow-xl">
        {/* 1. Who Did It? */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs font-bold text-[#e3e2e6] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
            1. PRIME SUSPECT // WHO COMMITTED THE HOMICIDE?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {caseData.suspects.map((suspect) => (
              <button
                key={suspect.id}
                type="button"
                onClick={() => setSuspectId(suspect.id)}
                className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-all ${
                  suspectId === suspect.id
                    ? 'bg-[#292a2d] border-[#dc2626] text-white ring-1 ring-[#dc2626]'
                    : 'bg-[#1f1f23] border-[#292a2d] text-[#94a3b8] hover:text-[#e3e2e6] hover:bg-[#292a2d]'
                }`}
              >
                <img
                  src={suspect.avatar}
                  alt={suspect.name}
                  className="w-10 h-10 rounded object-cover border border-[#343538]"
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-mono text-xs font-bold text-[#e3e2e6] truncate">
                    {suspect.name}
                  </span>
                  <span className="font-mono text-[10px] text-[#ffb4ab] truncate">
                    {suspect.occupation}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. When Did It Happen? */}
        <div className="flex flex-col gap-2 mt-2">
          <label className="font-mono text-xs font-bold text-[#e3e2e6] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#f9bd22]"></span>
            2. TIMING // WHEN WAS THE LETHAL ACT CARRIED OUT?
          </label>
          <div className="flex flex-col gap-1.5">
            {timeOptions.map((opt) => (
              <label
                key={opt}
                className={`p-2.5 rounded-lg border flex items-center gap-2.5 cursor-pointer text-xs font-mono transition-colors ${
                  time === opt
                    ? 'bg-[#292a2d] border-[#f9bd22] text-[#e3e2e6]'
                    : 'bg-[#1f1f23] border-[#292a2d] text-[#94a3b8] hover:bg-[#292a2d]'
                }`}
              >
                <input
                  type="radio"
                  name="time"
                  checked={time === opt}
                  onChange={() => setTime(opt)}
                  className="accent-[#dc2626]"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 3. Where Did It Happen? */}
        <div className="flex flex-col gap-2 mt-2">
          <label className="font-mono text-xs font-bold text-[#e3e2e6] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#45dfa4]"></span>
            3. LOCATION // WHERE WAS THE CRIME COMMITTED?
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="p-3 bg-[#0d0e11] text-[#e3e2e6] rounded-lg border border-[#292a2d] font-mono text-xs focus:border-[#dc2626] focus:outline-none"
          >
            <option value="">SELECT CRIME SCENE LOCATION...</option>
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* 4. How Was It Done? (Method) */}
        <div className="flex flex-col gap-2 mt-2">
          <label className="font-mono text-xs font-bold text-[#e3e2e6] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8]"></span>
            4. METHOD // HOW WAS THE DECEASED ELIMINATED?
          </label>
          <div className="flex flex-col gap-1.5">
            {methodOptions.map((m) => (
              <label
                key={m}
                className={`p-2.5 rounded-lg border flex items-start gap-2.5 cursor-pointer text-xs font-sans transition-colors ${
                  method === m
                    ? 'bg-[#292a2d] border-[#38bdf8] text-[#e3e2e6]'
                    : 'bg-[#1f1f23] border-[#292a2d] text-[#94a3b8] hover:bg-[#292a2d]'
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  checked={method === m}
                  onChange={() => setMethod(m)}
                  className="accent-[#dc2626] mt-0.5"
                />
                <span>{m}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 5. Why? (Motive) */}
        <div className="flex flex-col gap-2 mt-2">
          <label className="font-mono text-xs font-bold text-[#e3e2e6] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#c084fc]"></span>
            5. MOTIVE // WHAT WAS THE PRIMARY CATALYST?
          </label>
          <div className="flex flex-col gap-1.5">
            {motiveOptions.map((mot) => (
              <label
                key={mot}
                className={`p-2.5 rounded-lg border flex items-start gap-2.5 cursor-pointer text-xs font-sans transition-colors ${
                  motive === mot
                    ? 'bg-[#292a2d] border-[#c084fc] text-[#e3e2e6]'
                    : 'bg-[#1f1f23] border-[#292a2d] text-[#94a3b8] hover:bg-[#292a2d]'
                }`}
              >
                <input
                  type="radio"
                  name="motive"
                  checked={motive === mot}
                  onChange={() => setMotive(mot)}
                  className="accent-[#dc2626] mt-0.5"
                />
                <span>{mot}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 6. Detective Case Summary (Optional) */}
        <div className="flex flex-col gap-1.5 mt-2">
          <label className="font-mono text-[11px] text-[#94a3b8] uppercase">
            6. CASE REPORT EXPLANATION (OPTIONAL FIELD NOTES)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Enter your deductive synthesis correlating timeline and evidence..."
            className="p-3 bg-[#0d0e11] text-[#e3e2e6] rounded-lg border border-[#292a2d] font-mono text-xs focus:border-[#dc2626] focus:outline-none"
          ></textarea>
        </div>

        {/* Submit Indictment Button */}
        <button
          type="submit"
          className="mt-3 w-full py-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-lg font-mono text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.5)] active:scale-[0.99] transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">crisis_alert</span>
          <span>EXECUTE INDICTMENT WARRANT</span>
        </button>
      </form>
    </div>
  );
};
