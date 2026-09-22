import React, { useState } from 'react';
import { Suspect, Evidence } from '../types';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: string;
  children: React.ReactNode;
}

export const BaseModal: React.FC<BaseModalProps> = ({ isOpen, onClose, title, icon, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#1b1b1f] border border-[#292a2d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#292a2d] border-b border-[#343538]">
          <div className="flex items-center gap-2.5">
            {icon && (
              <span className="material-symbols-outlined text-[#ffb4ab] text-[20px]">{icon}</span>
            )}
            <h3 className="font-heading text-base sm:text-lg font-bold text-[#e3e2e6] tracking-wide uppercase">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1f1f23] hover:bg-[#343538] text-[#94a3b8] hover:text-[#e3e2e6] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex flex-col gap-4 text-sm text-[#e3e2e6]">
          {children}
        </div>
      </div>
    </div>
  );
};

// 1. HOW TO PLAY MODAL
export const HowToPlayModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="INVESTIGATIVE OPERATIVE DIRECTIVE" icon="rule">
      <div className="flex flex-col gap-3 font-sans text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
        <div className="p-3 bg-[#0d0e11] rounded-lg border border-[#292a2d] font-mono text-xs text-[#ffb4ab]">
          TACTICAL BRIEFING // OBJECTIVE: IDENTIFY THE KILLER BEFORE TIME EXPIRES
        </div>

        <p>
          Welcome, Detective. You have been granted Tier-4 clearance to investigate a series of high-profile homicides. Every crime scene contains physical evidence, digital footprints, and human testimonies.
        </p>

        <div className="flex flex-col gap-2">
          <strong className="text-[#e3e2e6] uppercase font-mono text-xs">1. GATHER FORENSIC ASSETS</strong>
          <p>
            Explore the <strong>Incident Dossier</strong>, <strong>Suspect Matrix</strong>, and <strong>Evidence Locker</strong>. Inspect physical specimens, CCTV camera logs, and medical examiner toxicology reports.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <strong className="text-[#e3e2e6] uppercase font-mono text-xs">2. DECRYPT CLASSIFIED FILES</strong>
          <p>
            Many evidence pieces are encrypted behind ciphers (Caesar substitution, Base64 dumps, hex streams, and Morse audio). Use the <strong>Terminal</strong> or <strong>Puzzle Interface</strong> to crack them and unlock key evidence.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <strong className="text-[#e3e2e6] uppercase font-mono text-xs">3. CROSS-EXAMINE SUSPECTS</strong>
          <p>
            Alibis are full of contradictions. Cross-examine suspects to expose fabricated timeframes, unverified locations, and hidden motives.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <strong className="text-[#e3e2e6] uppercase font-mono text-xs">4. EXECUTE FINAL INDICTMENT</strong>
          <p>
            Once you have proven who, when, where, how, and why, open the <strong>Final Accusation</strong> screen to issue a formal indictment. Precision is critical—a false arrest penalizes <strong>-200 PTS</strong>.
          </p>
        </div>
      </div>
    </BaseModal>
  );
};

// 2. TERMINAL RULES MODAL
export const TerminalRulesModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="TACTICAL CLI COMMAND REFERENCE" icon="terminal">
      <div className="flex flex-col gap-3 font-mono text-xs text-[#94a3b8]">
        <div className="p-2.5 bg-[#0d0e11] text-[#45dfa4] rounded border border-[#292a2d]">
          TLH-OS INTERACTIVE ENVIRONMENT // SYNTAX & COMMANDS
        </div>

        <div className="grid grid-cols-1 gap-2">
          <div className="p-2 bg-[#1f1f23] rounded border border-[#292a2d]">
            <span className="text-[#ffb4ab] font-bold">help</span>
            <p className="text-[#94a3b8] text-[11px] font-sans mt-0.5">Outputs the full manual of terminal commands.</p>
          </div>
          <div className="p-2 bg-[#1f1f23] rounded border border-[#292a2d]">
            <span className="text-[#ffb4ab] font-bold">ls / dir</span>
            <p className="text-[#94a3b8] text-[11px] font-sans mt-0.5">Lists all files, dumps, and reports in the active case directory.</p>
          </div>
          <div className="p-2 bg-[#1f1f23] rounded border border-[#292a2d]">
            <span className="text-[#ffb4ab] font-bold">cat &lt;filename&gt;</span>
            <p className="text-[#94a3b8] text-[11px] font-sans mt-0.5">Reads and prints the contents of a forensic file (e.g. <code>cat cctv_log.txt</code>).</p>
          </div>
          <div className="p-2 bg-[#1f1f23] rounded border border-[#292a2d]">
            <span className="text-[#ffb4ab] font-bold">puzzles</span>
            <p className="text-[#94a3b8] text-[11px] font-sans mt-0.5">Lists all available cryptographic puzzles in this case.</p>
          </div>
          <div className="p-2 bg-[#1f1f23] rounded border border-[#292a2d]">
            <span className="text-[#ffb4ab] font-bold">solve &lt;puzzle_num&gt; &lt;answer&gt;</span>
            <p className="text-[#94a3b8] text-[11px] font-sans mt-0.5">Submits your solution for a specific cipher (e.g. <code>solve 1 OVERRIDE</code>).</p>
          </div>
          <div className="p-2 bg-[#1f1f23] rounded border border-[#292a2d]">
            <span className="text-[#ffb4ab] font-bold">hint &lt;puzzle_num&gt;</span>
            <p className="text-[#94a3b8] text-[11px] font-sans mt-0.5">Requests progressive cryptographic hints (-50 PTS).</p>
          </div>
          <div className="p-2 bg-[#1f1f23] rounded border border-[#292a2d]">
            <span className="text-[#ffb4ab] font-bold">status</span>
            <p className="text-[#94a3b8] text-[11px] font-sans mt-0.5">Displays elapsed time, score, and unlocked assets.</p>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

// 3. SCORING MATRIX MODAL
export const ScoringMatrixModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="INVESTIGATIVE INTEGRITY MATRIX" icon="analytics">
      <div className="flex flex-col gap-3 font-sans text-xs sm:text-sm text-[#94a3b8]">
        <div className="p-3 bg-[#0d0e11] rounded-lg border border-[#292a2d] flex items-center justify-between">
          <span className="font-mono text-xs text-[#e3e2e6] font-bold">INITIAL INTEGRITY POOL:</span>
          <span className="font-mono text-base text-[#f9bd22] font-bold">1,000 PTS</span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase font-bold text-[#ffb4ab]">SCORE MODIFIERS</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-2.5 bg-[#1f1f23] rounded border border-[#292a2d] flex flex-col">
              <span className="font-mono text-xs font-bold text-[#ffb4ab]">-50 PTS</span>
              <span className="text-[11px] mt-0.5">Per hint unlocked</span>
            </div>
            <div className="p-2.5 bg-[#1f1f23] rounded border border-[#292a2d] flex flex-col">
              <span className="font-mono text-xs font-bold text-[#ffb4ab]">-100 PTS</span>
              <span className="text-[11px] mt-0.5">Per incorrect cipher entry</span>
            </div>
            <div className="p-2.5 bg-[#1f1f23] rounded border border-[#292a2d] flex flex-col">
              <span className="font-mono text-xs font-bold text-[#dc2626]">-200 PTS</span>
              <span className="text-[11px] mt-0.5">Per false indictment</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <span className="font-mono text-xs uppercase font-bold text-[#45dfa4]">CLEARANCE RANKS</span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 font-mono text-xs text-center">
            <div className="p-2 bg-[#00452e] text-[#45dfa4] rounded border border-[#00bd85]/40 font-bold">
              S-RANK<br /><span className="text-[10px] font-normal">&gt;= 900 PTS</span>
            </div>
            <div className="p-2 bg-[#1f1f23] text-[#e3e2e6] rounded border border-[#292a2d] font-bold">
              A-RANK<br /><span className="text-[10px] text-[#94a3b8] font-normal">750-899</span>
            </div>
            <div className="p-2 bg-[#1f1f23] text-[#e3e2e6] rounded border border-[#292a2d] font-bold">
              B-RANK<br /><span className="text-[10px] text-[#94a3b8] font-normal">600-749</span>
            </div>
            <div className="p-2 bg-[#1f1f23] text-[#e3e2e6] rounded border border-[#292a2d] font-bold">
              C-RANK<br /><span className="text-[10px] text-[#94a3b8] font-normal">400-599</span>
            </div>
            <div className="p-2 bg-[#1f1f23] text-[#ffb4ab] rounded border border-[#292a2d] font-bold">
              D-RANK<br /><span className="text-[10px] text-[#94a3b8] font-normal">&lt; 400</span>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

// 4. CRIME SCHEMATICS BLUEPRINT MODAL
export const SchematicsModal: React.FC<{ isOpen: boolean; onClose: () => void; floor?: string }> = ({
  isOpen,
  onClose,
  floor,
}) => {
  const [selectedRoom, setSelectedRoom] = useState<string>('suite');

  const roomDetails: Record<string, { name: string; telemetry: string; note: string }> = {
    suite: {
      name: 'EXECUTIVE SUITE 4401 (CRIME SCENE)',
      telemetry: 'DOOR BOLTS: INTERNALLY ENGAGED // THERMOSTAT: 19.5°C',
      note: 'Victim discovered slumped over desk. Espresso thermos half consumed. Deadbolts locked from inside.',
    },
    server: {
      name: 'SERVER ROOM 44-B',
      telemetry: 'RFID: MARCUS REED BADGE AT 21:05 // POWER ROUTE: SWITCHED',
      note: 'Controls CCTV circuit and main breakers. Access log shows terminal session created during blackout.',
    },
    east: {
      name: 'EAST WING OPEN OFFICES',
      telemetry: 'RFID: ELENA VALE BADGE AT 20:42 // CCTV FEED: ACTIVE',
      note: 'Elena claims she was preparing presentation slides. Corroborated by terminal draft logs.',
    },
    hvac: {
      name: 'CENTRAL HVAC & FREIGHT SHAFT',
      telemetry: 'AIRFLOW SENSORS: BALANCED // FILTER TRACE: CLEAN',
      note: 'Mechanical inspection confirms ventilation shafts are protected with laser motion barriers.',
    },
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="ARCHITECTURAL FORENSIC SCHEMATIC" icon="floor">
      <div className="flex flex-col gap-4 font-mono text-xs">
        {/* Schematic Grid Map */}
        <div className="relative h-60 w-full bg-[#0d0e11] rounded-xl border border-[#292a2d] p-4 flex flex-col justify-between overflow-hidden">
          {/* Blueprint Grid Lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#343538_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

          <div className="flex justify-between items-center text-[10px] text-[#45dfa4] z-10">
            <span>LEVEL 44 // TOWER CAD REV 3.8</span>
            <span>SCALE: 1:200</span>
          </div>

          {/* Clickable Room Zones */}
          <div className="grid grid-cols-2 gap-3 z-10 h-36">
            <button
              type="button"
              onClick={() => setSelectedRoom('suite')}
              className={`p-2 rounded border text-left flex flex-col justify-between transition-colors ${
                selectedRoom === 'suite'
                  ? 'bg-[#dc2626]/20 border-[#dc2626] text-white'
                  : 'bg-[#1b1b1f]/80 border-[#292a2d] text-[#94a3b8] hover:border-[#e3e2e6]'
              }`}
            >
              <span className="font-bold text-[11px] text-[#ffb4ab]">SUITE 4401 (CRIME SCENE)</span>
              <span className="text-[9px] text-[#45dfa4]">DEADBOLT: LOCKED</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRoom('server')}
              className={`p-2 rounded border text-left flex flex-col justify-between transition-colors ${
                selectedRoom === 'server'
                  ? 'bg-[#f9bd22]/20 border-[#f9bd22] text-white'
                  : 'bg-[#1b1b1f]/80 border-[#292a2d] text-[#94a3b8] hover:border-[#e3e2e6]'
              }`}
            >
              <span className="font-bold text-[11px] text-[#f9bd22]">SERVER ROOM 44-B</span>
              <span className="text-[9px] text-[#94a3b8]">RFID LOG: 21:05</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRoom('east')}
              className={`p-2 rounded border text-left flex flex-col justify-between transition-colors ${
                selectedRoom === 'east'
                  ? 'bg-[#45dfa4]/20 border-[#45dfa4] text-white'
                  : 'bg-[#1b1b1f]/80 border-[#292a2d] text-[#94a3b8] hover:border-[#e3e2e6]'
              }`}
            >
              <span className="font-bold text-[11px] text-[#e3e2e6]">EAST WING OFFICES</span>
              <span className="text-[9px] text-[#94a3b8]">ALIBI ZONE</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRoom('hvac')}
              className={`p-2 rounded border text-left flex flex-col justify-between transition-colors ${
                selectedRoom === 'hvac'
                  ? 'bg-[#38bdf8]/20 border-[#38bdf8] text-white'
                  : 'bg-[#1b1b1f]/80 border-[#292a2d] text-[#94a3b8] hover:border-[#e3e2e6]'
              }`}
            >
              <span className="font-bold text-[11px] text-[#38bdf8]">FREIGHT & HVAC SHAFT</span>
              <span className="text-[9px] text-[#94a3b8]">LASER SEALED</span>
            </button>
          </div>

          <span className="text-[9px] text-[#94a3b8] z-10">Click any sector to query spatial telemetry.</span>
        </div>

        {/* Selected Room Details */}
        {selectedRoom && (
          <div className="p-3 bg-[#0d0e11] rounded-lg border border-[#292a2d] flex flex-col gap-1">
            <span className="font-bold text-[#ffb4ab] uppercase">
              {roomDetails[selectedRoom].name}
            </span>
            <span className="text-[10px] text-[#45dfa4]">
              {roomDetails[selectedRoom].telemetry}
            </span>
            <p className="font-sans text-xs text-[#e3e2e6] mt-1 leading-relaxed">
              {roomDetails[selectedRoom].note}
            </p>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

// 5. WITNESS AUDIO MODAL
export const WitnessAudioModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);

  const audioTapes = [
    {
      id: 'tape-1',
      title: 'RECORDING 01: ELENA VALE DEPOSITION',
      time: '22:45 HRS',
      speaker: 'Elena Vale (CFO)',
      quote: '"I was with counsel finalizing our registration statements. Adrian was agitated earlier in the day, but I never set foot inside his private suite after 18:00."',
    },
    {
      id: 'tape-2',
      title: 'RECORDING 02: MARCUS REED POLICE INTERVIEW',
      time: '23:10 HRS',
      speaker: 'Marcus Reed (Lead Architect)',
      quote: '"The power flicker at 21:10 was caused by a tripped circuit breaker on the 44th floor distribution board. I was logged into the maintenance rack restoring our backup power feed."',
    },
    {
      id: 'tape-3',
      title: 'RECORDING 03: NIGHT SECURITY OFFICER DISPATCH',
      time: '22:15 HRS',
      speaker: 'Officer Reynolds (Security)',
      quote: '"We got an automatic panic ping from Suite 4401 at 22:10. The deadbolt was thrown from inside. We had to use an acoustic ram to force the reinforced hinges."',
    },
  ];

  const togglePlay = (idx: number) => {
    if (playingIdx === idx) {
      setPlayingIdx(null);
    } else {
      setPlayingIdx(idx);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="FORENSIC AUDIO INTERCEPTS" icon="record_voice_over">
      <div className="flex flex-col gap-3 font-mono text-xs">
        <span className="text-[#94a3b8]">POLICE DISPATCH & DEPOSITION MICROPHONE LOGS</span>

        {audioTapes.map((tape, idx) => (
          <div
            key={tape.id}
            className="p-3 bg-[#0d0e11] rounded-lg border border-[#292a2d] flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#ffb4ab]">{tape.title}</span>
              <span className="text-[10px] text-[#94a3b8]">{tape.time}</span>
            </div>

            <p className="font-sans text-xs text-[#e3e2e6] italic">
              {tape.quote}
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-[#292a2d]">
              <span className="text-[10px] text-[#45dfa4]">SPEAKER: {tape.speaker}</span>
              <button
                type="button"
                onClick={() => togglePlay(idx)}
                className={`px-3 py-1 rounded font-mono text-xs flex items-center gap-1 transition-colors ${
                  playingIdx === idx
                    ? 'bg-[#dc2626] text-white'
                    : 'bg-[#1f1f23] hover:bg-[#292a2d] text-[#e3e2e6]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {playingIdx === idx ? 'pause' : 'play_arrow'}
                </span>
                <span>{playingIdx === idx ? 'AUDIO ACTIVE' : 'PLAY TAPE'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </BaseModal>
  );
};

// 6. CROSS-EXAMINE DIALOGUE MODAL
export const CrossExamineModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  suspect: Suspect | null;
}> = ({ isOpen, onClose, suspect }) => {
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  if (!suspect) return null;

  const topics = [
    {
      q: 'Explain the 11-minute gap in the CCTV feed at 21:10.',
      a:
        suspect.occupation.includes('Architect') || suspect.occupation.includes('Security')
          ? 'The power surge tripped the relays. As systems administrator, I had to physically inspect the distribution board on Floor 44. I did not enter Adrian\'s suite.'
          : 'I noticed the corridor lights dim from my office, but I never left my desk. If someone cut the power, it was orchestrated by someone with engineering credentials.',
    },
    {
      q: 'Why did forensics find cardiac poison in the victim\'s espresso?',
      a:
        'Adrian had his own private espresso machine. He never let anyone else touch the beans. But whoever knew his evening routine could have slipped something in before he started his brew.',
    },
    {
      q: 'What can you tell me about the missing $14.2M offshore wire?',
      a:
        'Adrian was furious when he discovered the audit discrepancies. He called an emergency meeting and threatened to bring federal prosecutors in first thing in the morning.',
    },
  ];

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={`CROSS-EXAMINATION // ${suspect.name.toUpperCase()}`} icon="gavel">
      <div className="flex flex-col gap-4">
        {/* Suspect Profile Preview */}
        <div className="flex items-center gap-3 p-3 bg-[#0d0e11] rounded-lg border border-[#292a2d]">
          <img
            src={suspect.avatar}
            alt={suspect.name}
            className="w-12 h-14 object-cover rounded border border-[#343538]"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-heading text-base font-bold text-[#e3e2e6]">{suspect.name}</span>
            <span className="font-mono text-xs text-[#ffb4ab]">{suspect.occupation}</span>
            <span className="font-mono text-[10px] text-[#94a3b8] mt-0.5">
              CLEARANCE: {suspect.clearance} // SUSPICION: {suspect.suspicionScore}%
            </span>
          </div>
        </div>

        {/* Question Selector */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs text-[#45dfa4] font-bold uppercase tracking-wider">
            SELECT INQUIRY LINE:
          </span>
          <div className="flex flex-col gap-1.5">
            {topics.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedTopic(idx)}
                className={`p-2.5 rounded-lg border text-left font-mono text-xs transition-colors flex items-start gap-2 ${
                  selectedTopic === idx
                    ? 'bg-[#292a2d] border-[#dc2626] text-white'
                    : 'bg-[#1f1f23] border-[#292a2d] text-[#94a3b8] hover:text-[#e3e2e6] hover:bg-[#292a2d]'
                }`}
              >
                <span className="text-[#ffb4ab] font-bold">Q{idx + 1}:</span>
                <span>{t.q}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Response Box */}
        {selectedTopic !== null && (
          <div className="p-3.5 bg-[#0d0e11] rounded-lg border border-[#292a2d] flex flex-col gap-1 animate-fadeIn">
            <span className="font-mono text-[10px] text-[#ffb4ab] font-bold uppercase">
              DEPOSITION RESPONSE:
            </span>
            <p className="font-sans text-xs sm:text-sm text-[#e3e2e6] italic leading-relaxed">
              {topics[selectedTopic].a}
            </p>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

// 7. EVIDENCE INSPECT MODAL (3.2X Magnifier)
export const EvidenceInspectModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  item: Evidence | null;
}> = ({ isOpen, onClose, item }) => {
  if (!item) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={`FORENSIC MAGNIFIER 3.2X // ${item.code}`} icon="zoom_in">
      <div className="flex flex-col gap-4 font-mono text-xs">
        {/* Magnified Image Container */}
        <div className="relative h-64 w-full bg-[#0d0e11] rounded-xl overflow-hidden border border-[#292a2d] flex items-center justify-center">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover scale-125 filter contrast-125"
            />
          ) : (
            <div className="text-[#45dfa4]">DIGITAL LOG STREAM // {item.title}</div>
          )}
          {/* Circular reticle overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-2 border-[#45dfa4]/80 shadow-[0_0_20px_rgba(69,223,164,0.4)] flex items-center justify-center">
              <div className="w-2 h-2 bg-[#45dfa4] rounded-full"></div>
            </div>
          </div>
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#0d0e11]/85 text-[#45dfa4] text-[10px]">
            MAGNIFICATION: 3.2X OPTICAL
          </div>
        </div>

        <div className="flex flex-col gap-1.5 p-3 bg-[#0d0e11] rounded-lg border border-[#292a2d]">
          <span className="font-bold text-[#e3e2e6] text-sm">{item.title}</span>
          <span className="text-[#94a3b8]">LOCATION: {item.location || 'CRIME SCENE'}</span>
          <span className="text-[#94a3b8]">TIMESTAMP: {item.timestamp || 'LOGGED'}</span>
          <p className="font-sans text-xs text-[#ffdad6] mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    </BaseModal>
  );
};
