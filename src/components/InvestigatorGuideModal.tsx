import React, { useState } from 'react';

interface InvestigatorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InvestigatorGuideModal: React.FC<InvestigatorGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeGuideTab, setActiveGuideTab] = useState<'walkthrough' | 'tools' | 'terminal' | 'ciphers' | 'cases'>('walkthrough');

  if (!isOpen) return null;

  const handlePrintPdf = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const markdownContent = `# THE LAST HOUR // CYBER-FORENSIC INVESTIGATOR FIELD MANUAL
Document Ref: TLH-MANUAL-REV-4
Classification: RESTRICTED // TIER-4 CLEARANCE
System: The Last Hour — Interactive Murder Mystery

---

## 1. MISSION OVERVIEW & INVESTIGATION OBJECTIVE
As Lead Cyber-Forensic Investigator, your mandate is to investigate complex homicides, analyze real-time crime scene telemetry, decipher encrypted evidence, interrogate persons of interest, reconstruct chronological timelines, and formally indict the true perpetrator before case closure.

### Core Scoring & Rank Metric:
- Starting Score: 1,000 Points
- Cryptographic Puzzle Hint Penalty: -50 Points
- Cryptographic Decryption Failure: -100 Points
- False Murder Indictment / Accusation: -200 Points
- Final Performance Ranks:
  * S-RANK: 900+ PTS (Master Detective / Forensic Genius)
  * A-RANK: 750 - 899 PTS (Senior Inspector)
  * B-RANK: 600 - 749 PTS (Field Investigator)
  * C-RANK: 400 - 599 PTS (Junior Detective)
  * D-RANK: < 400 PTS (Case Closed with Disciplinary Review)

---

## 2. INVESTIGATION WORKFLOW & STEP-BY-STEP WALKTHROUGH

### Step 1: Review Incident Dossier (Case Overview)
- Read the victim's official profile, estimated time of death, and primary pathology report.
- Examine initial incident logs, security breaches, and primary scene conditions.
- Click "CAD Floor Schematics" to inspect physical room layouts, entry corridors, and server room access points.
- Listen to or read audio intercepts from witnesses logged at the crime scene.

### Step 2: Interrogate Persons of Interest (Suspect Matrix)
- Review each suspect's clearance level, relationship to victim, verified alibi, and recorded suspicion rating.
- Click "Cross-Examine" on any suspect to open a high-pressure interrogation window.
- Compare their claims against digital keycard logs and timestamps. Look for timeline contradictions.

### Step 3: Forensic Evidence Locker
- Browse physical artifacts, digital device dumps, CCTV still frames, and toxicology reports.
- Use the **3.2X Optical Magnifier** to inspect fine micro-trace details, blood splatter, and fiber residues.
- Toggle the **365nm UV Light** on documents and photos to reveal fluorescent chemical traces, altered ink, and hidden notes.
- Run a **Spectral Frequency Scan** to analyze signal interference and sensor telemetry.
- Locked evidence exhibits require cipher resolution in the Tactical Terminal or Puzzle Engine.

### Step 4: Cryptographic Puzzle Engine & Tactical Terminal
- Decrypt encrypted logs, audio intercepts, and forensic manifests.
- Supported Cipher Formats:
  1. Caesar Shift: Use the interactive ROT slider (1-25) to cycle letter substitutions.
  2. Morse Code: Listen to acoustic frequency beeps or decode dots and dashes.
  3. Base64 & Hex Streams: Decode encoded strings to retrieve plaintext passwords.
  4. Logic & Numerical Ciphers: Deduce access keys from room numbers, chemical formulas, and dates.
- Solving a cipher instantly unlocks restricted evidence in your locker and verifies timeline events.

### Step 5: Chronology Nexus (Timeline)
- Review sequential events from 20:00 through 23:00.
- Certain timestamps are locked or marked "UNVERIFIED" until corroborated by specific evidence.
- Identify the exact murder window (typically during power blackouts, system reboots, or alibi gaps).

### Step 6: Classified Document Repository
- Inspect formal medical examiner reports, facility power telemetry, and financial audit records.
- Toggle the UV Decensor lamp to expose redacted text blocks and concealed administrative commands.

### Step 7: Final Accusation Protocol
- Once confident, enter the "Final Accusation" console.
- Select:
  1. The True Perpetrator (Suspect)
  2. Estimated Time Window of the Lethal Act
  3. Exact Murder Scene / Physical Location
  4. Lethal Method / Weapon of Execution
  5. Primary Motive (Financial Embezzlement, Espionage, Blackmail, Betrayal)
  6. Detailed Investigative Synthesis Note
- Submitting an accurate indictment confirms the verdict, displays the full chronological case narrative, awards your final Score and Rank, and unlocks the next case file.

---

## 3. TACTICAL TERMINAL COMMAND REFERENCE
You can execute terminal commands directly in the Tactical Terminal CLI:

- help                : Print list of all active terminal commands.
- status              : Display case telemetry, timer, score, and unlocked assets.
- ls / dir            : List directory files on the crime scene network.
- cat <filename>      : View contents of a discovered log file or intercept.
- puzzles             : Display all cryptographic puzzle IDs and decryption states.
- solve <id> <answer> : Submit cryptographic answer (e.g., 'solve P-01 KEYWORD').
- hint <id>           : Decrypt a hint for a puzzle (-50 PTS penalty).
- scan <target>       : Run diagnostic telemetry scan on biometric or gateway sensors.
- accuse <suspect>    : Launch accusation protocol on suspect ID.
- clear / cls         : Clear terminal console buffer.

---

## 4. CASE DOSSIER DIRECTORY
1. CASE 01: The Locked Room (Adrian Vale - Penthouse Executive Homicide)
2. CASE 02: The Poisoned Heir (Julian Vance - Botanical Conservatory Poisoning)
3. CASE 03: The Midnight Train (Viktor Sterling - High-Speed Luxury Rail Murder)
4. CASE 04: The Blackout Gala (Vivienne Monet - Metropolitan Museum Gala Theft & Homicide)
5. CASE 05: The Silent Villa (Silas Ward - Malibu Cliffside Villa Seaside Murder)

---
(C) The Last Hour Forensic Intelligence Division // All Rights Reserved.
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'The_Last_Hour_Investigator_Field_Manual.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn print:static print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-[#17181c] border border-[#343538] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Modal Top Action Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#202127] border-b border-[#2e3037] print:hidden">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#dc2626] text-[22px]">menu_book</span>
            <div>
              <h3 className="font-heading text-base sm:text-lg font-bold text-[#e3e2e6] tracking-wide uppercase">
                INVESTIGATOR FIELD MANUAL & GUIDE
              </h3>
              <span className="font-mono text-[10px] text-[#45dfa4] tracking-wider uppercase font-semibold">
                OPERATIONAL HANDBOOK // TIER-4 CLEARANCE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintPdf}
              className="px-3 py-1.5 rounded-lg bg-[#dc2626] hover:bg-[#b91c1c] text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(220,38,38,0.4)] transition-all"
              title="Print document or Save as PDF using your browser print dialog"
            >
              <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
              <span>PRINT / SAVE PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="px-3 py-1.5 rounded-lg bg-[#292a2d] hover:bg-[#343538] text-[#e3e2e6] font-mono text-xs font-semibold flex items-center gap-1.5 border border-[#3f4148] transition-colors"
              title="Download offline markdown manual"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span className="hidden sm:inline">EXPORT .MD</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#1b1b1f] hover:bg-[#292a2d] text-[#94a3b8] hover:text-[#e3e2e6] flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 bg-[#121316] border-b border-[#292a2d] overflow-x-auto no-scrollbar print:hidden">
          {[
            { id: 'walkthrough', label: '1. STEP-BY-STEP WALKTHROUGH', icon: 'directions_walk' },
            { id: 'tools', label: '2. FORENSIC TOOLS (UV/SCAN)', icon: 'biotech' },
            { id: 'terminal', label: '3. TERMINAL CLI COMMANDS', icon: 'terminal' },
            { id: 'ciphers', label: '4. CIPHER CRACKING GUIDE', icon: 'vpn_key' },
            { id: 'cases', label: '5. CASE FILES & SCORING', icon: 'folder_shared' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveGuideTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-md font-mono text-xs uppercase tracking-wide whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                activeGuideTab === tab.id
                  ? 'bg-[#292a2d] text-[#45dfa4] font-bold border border-[#45dfa4]/40'
                  : 'text-[#94a3b8] hover:text-[#e3e2e6] hover:bg-[#1f1f23]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Printable Content Area */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 text-sm text-[#e3e2e6] print:p-0 print:text-black">
          {/* Print Header Visible Only on PDF / Print */}
          <div className="hidden print:block border-b-2 border-black pb-4 mb-4">
            <h1 className="text-2xl font-bold uppercase tracking-wider">THE LAST HOUR // CYBER-FORENSIC INVESTIGATOR MANUAL</h1>
            <p className="text-sm text-gray-700">Official Field Guide & Procedural Directive • Classification: TIER-4 RESTRICTED</p>
          </div>

          {/* Section 1: Step-by-Step Walkthrough */}
          {(activeGuideTab === 'walkthrough' || typeof window !== 'undefined') && (
            <div className={`flex flex-col gap-4 ${activeGuideTab !== 'walkthrough' ? 'print:flex hidden' : 'flex'}`}>
              <div className="flex items-center gap-2 border-b border-[#292a2d] pb-2 print:border-black">
                <span className="material-symbols-outlined text-[#ffb4ab] text-[20px] print:hidden">flag</span>
                <h4 className="font-heading text-base font-bold text-[#e3e2e6] uppercase print:text-black">
                  Phase 1: How to Investigate a Case from Start to Finish
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans text-xs sm:text-sm">
                <div className="p-3 bg-[#101114] rounded-lg border border-[#292a2d] print:border-gray-400 print:bg-white">
                  <span className="font-mono text-xs font-bold text-[#dc2626] uppercase block mb-1">
                    Step 1: Incident Briefing
                  </span>
                  <p className="text-[#94a3b8] print:text-gray-800 leading-relaxed">
                    Select an active case. Read the <strong>Incident Dossier</strong>, victim details (Adrian Vale, Julian Vance, etc.), estimated time of death, and pathology report. Inspect the <strong>CAD Floor Schematics</strong> and recorded <strong>Witness Audio</strong>.
                  </p>
                </div>

                <div className="p-3 bg-[#101114] rounded-lg border border-[#292a2d] print:border-gray-400 print:bg-white">
                  <span className="font-mono text-xs font-bold text-[#dc2626] uppercase block mb-1">
                    Step 2: Suspect Matrix & Interrogation
                  </span>
                  <p className="text-[#94a3b8] print:text-gray-800 leading-relaxed">
                    Click <strong>Suspect Matrix</strong> to analyze each person of interest. Review clearance badges, motive summaries, and suspicious behavior tags. Click <strong>Cross-Examine</strong> to interrogate them and note alibi contradictions.
                  </p>
                </div>

                <div className="p-3 bg-[#101114] rounded-lg border border-[#292a2d] print:border-gray-400 print:bg-white">
                  <span className="font-mono text-xs font-bold text-[#dc2626] uppercase block mb-1">
                    Step 3: Decrypt Evidence Locker Assets
                  </span>
                  <p className="text-[#94a3b8] print:text-gray-800 leading-relaxed">
                    Switch to <strong>Evidence Locker</strong>. Examine CCTV frames, digital keycard logs, and medical evidence. If an artifact is encrypted, take note of its cipher ID and decrypt it in the <strong>Puzzle Engine</strong> or <strong>Tactical Terminal</strong>.
                  </p>
                </div>

                <div className="p-3 bg-[#101114] rounded-lg border border-[#292a2d] print:border-gray-400 print:bg-white">
                  <span className="font-mono text-xs font-bold text-[#dc2626] uppercase block mb-1">
                    Step 4: Reconstruct Chronology & Documents
                  </span>
                  <p className="text-[#94a3b8] print:text-gray-800 leading-relaxed">
                    Examine the <strong>Chronology Nexus</strong> and <strong>Case Documents</strong>. Decoded artifacts verify chronological nodes. Notice where power went out, cameras looped, or security doors opened.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#1f191b] rounded-lg border border-[#5c2429] print:bg-gray-100 print:border-black">
                <span className="font-mono text-xs font-bold text-[#ffb4ab] uppercase block mb-1 print:text-black">
                  Step 5: File the Final Accusation
                </span>
                <p className="text-xs text-[#e6bdb8] print:text-gray-800 leading-relaxed">
                  Navigate to <strong>Final Accusation</strong>. Select the confirmed killer, timing of the strike, murder chamber, lethal weapon/method, and underlying motive. If correct, you will unlock the case resolution narrative, your final detective rank (S, A, B, C, or D), and the subsequent case!
                </p>
              </div>
            </div>
          )}

          {/* Section 2: Forensic Tools */}
          {(activeGuideTab === 'tools' || typeof window !== 'undefined') && (
            <div className={`flex flex-col gap-4 ${activeGuideTab !== 'tools' ? 'print:flex hidden' : 'flex'}`}>
              <div className="flex items-center gap-2 border-b border-[#292a2d] pb-2 print:border-black">
                <span className="material-symbols-outlined text-[#45dfa4] text-[20px] print:hidden">biotech</span>
                <h4 className="font-heading text-base font-bold text-[#e3e2e6] uppercase print:text-black">
                  Phase 2: Forensic Tools & Artifact Inspection
                </h4>
              </div>

              <div className="flex flex-col gap-3 font-sans text-xs sm:text-sm">
                <div className="p-3 bg-[#101114] rounded-lg border border-[#292a2d] print:border-gray-400 print:bg-white flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#45dfa4] text-[24px] print:hidden">zoom_in</span>
                  <div>
                    <strong className="text-[#e3e2e6] uppercase font-mono text-xs print:text-black">
                      3.2X Optical Magnifier
                    </strong>
                    <p className="text-[#94a3b8] print:text-gray-800 mt-1 leading-relaxed">
                      Available on all evidence cards. Expands the artifact with high-contrast macro zoom and reticle targeting to read serial numbers, microscopic punctures, blood drip patterns, and keycard barcode tags.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-[#101114] rounded-lg border border-[#292a2d] print:border-gray-400 print:bg-white flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#c084fc] text-[24px] print:hidden">lightbulb</span>
                  <div>
                    <strong className="text-[#c084fc] uppercase font-mono text-xs print:text-black">
                      365nm UV De-Censor Light
                    </strong>
                    <p className="text-[#94a3b8] print:text-gray-800 mt-1 leading-relaxed">
                      Click the &quot;UV&quot; toggle on redacted documents and physical evidence items. The ultraviolet lamp reveals fluorescent ink, hidden handwriting, erased signatures, and invisible chemical residues that were intentionally blacked out.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-[#101114] rounded-lg border border-[#292a2d] print:border-gray-400 print:bg-white flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#f9bd22] text-[24px] print:hidden">sensors</span>
                  <div>
                    <strong className="text-[#f9bd22] uppercase font-mono text-xs print:text-black">
                      Spectral Frequency Sensor Scan
                    </strong>
                    <p className="text-[#94a3b8] print:text-gray-800 mt-1 leading-relaxed">
                      Triggers real-time sensor sweep over CCTV feeds and digital transmitters to detect radio-frequency jamming, voltage sags, and wireless transceiver packet anomalies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Terminal CLI Commands */}
          {(activeGuideTab === 'terminal' || typeof window !== 'undefined') && (
            <div className={`flex flex-col gap-4 ${activeGuideTab !== 'terminal' ? 'print:flex hidden' : 'flex'}`}>
              <div className="flex items-center gap-2 border-b border-[#292a2d] pb-2 print:border-black">
                <span className="material-symbols-outlined text-[#f9bd22] text-[20px] print:hidden">terminal</span>
                <h4 className="font-heading text-base font-bold text-[#e3e2e6] uppercase print:text-black">
                  Phase 3: Tactical Terminal Command Reference
                </h4>
              </div>

              <div className="p-3 bg-[#0d0e11] rounded-lg border border-[#292a2d] font-mono text-xs print:bg-gray-100 print:border-black print:text-black">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div><strong className="text-[#45dfa4] print:text-black">help</strong> : Display all available terminal commands</div>
                  <div><strong className="text-[#45dfa4] print:text-black">status</strong> : Show current time, score, and unlocked items</div>
                  <div><strong className="text-[#45dfa4] print:text-black">ls / dir</strong> : List intercepted files on current case server</div>
                  <div><strong className="text-[#45dfa4] print:text-black">cat &lt;file&gt;</strong> : Read raw contents of file (e.g. cat badge_logs.txt)</div>
                  <div><strong className="text-[#45dfa4] print:text-black">puzzles</strong> : List all active ciphers and their status</div>
                  <div><strong className="text-[#45dfa4] print:text-black">solve &lt;id&gt; &lt;ans&gt;</strong> : Submit solution (e.g. solve P-01 CIPHERKEY)</div>
                  <div><strong className="text-[#45dfa4] print:text-black">hint &lt;id&gt;</strong> : Decrypt puzzle hint (-50 score penalty)</div>
                  <div><strong className="text-[#45dfa4] print:text-black">scan &lt;target&gt;</strong> : Run sensor scan on gateway or camera</div>
                  <div><strong className="text-[#45dfa4] print:text-black">accuse &lt;suspect&gt;</strong> : Initiate fast-track indictment query</div>
                  <div><strong className="text-[#45dfa4] print:text-black">clear / cls</strong> : Reset console screen output</div>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Cipher Cracking Guide */}
          {(activeGuideTab === 'ciphers' || typeof window !== 'undefined') && (
            <div className={`flex flex-col gap-4 ${activeGuideTab !== 'ciphers' ? 'print:flex hidden' : 'flex'}`}>
              <div className="flex items-center gap-2 border-b border-[#292a2d] pb-2 print:border-black">
                <span className="material-symbols-outlined text-[#c084fc] text-[20px] print:hidden">vpn_key</span>
                <h4 className="font-heading text-base font-bold text-[#e3e2e6] uppercase print:text-black">
                  Phase 4: Cryptography & Deciphering Handbook
                </h4>
              </div>

              <div className="space-y-3 font-sans text-xs sm:text-sm">
                <div className="p-3 bg-[#101114] rounded-lg border border-[#292a2d] print:border-gray-400 print:bg-white">
                  <strong className="text-[#ffb4ab] uppercase font-mono text-xs block mb-1 print:text-black">
                    1. Caesar Shift Rotation (ROT)
                  </strong>
                  <p className="text-[#94a3b8] print:text-gray-800 leading-relaxed">
                    Each letter in the ciphertext is shifted by a fixed number of positions down the alphabet. In the <strong>Puzzle Workbench</strong>, drag the ROT slider from 1 to 25 to see live decoded previews until coherent English words appear.
                  </p>
                </div>

                <div className="p-3 bg-[#101114] rounded-lg border border-[#292a2d] print:border-gray-400 print:bg-white">
                  <strong className="text-[#ffb4ab] uppercase font-mono text-xs block mb-1 print:text-black">
                    2. Morse Code Telemetry
                  </strong>
                  <p className="text-[#94a3b8] print:text-gray-800 leading-relaxed">
                    Audio intercepts and radio beeps translate short pulses (dots •) and long pulses (dashes —). Click <strong>&quot;PLAY MORSE AUDIO TONES&quot;</strong> in the puzzle engine to listen, or consult the reference table below:
                  </p>
                  <div className="mt-2 font-mono text-[10px] text-[#45dfa4] print:text-black bg-[#0d0e11] p-2 rounded print:bg-gray-100">
                    A: •- | B: -••• | C: -•-• | D: -•• | E: • | F: ••-• | G: --• | H: •••• | I: •• | J: •--- | K: -•- | L: •-•• | M: -- | N: -• | O: --- | P: •--• | Q: --•- | R: •-• | S: ••• | T: - | U: ••- | V: •••- | W: •-- | X: -••- | Y: -•-- | Z: --••
                  </div>
                </div>

                <div className="p-3 bg-[#101114] rounded-lg border border-[#292a2d] print:border-gray-400 print:bg-white">
                  <strong className="text-[#ffb4ab] uppercase font-mono text-xs block mb-1 print:text-black">
                    3. Base64 & Hexadecimal Dumps
                  </strong>
                  <p className="text-[#94a3b8] print:text-gray-800 leading-relaxed">
                    Strings ending with padding characters (= or ==) represent Base64 binary text. Use the built-in <strong>&quot;QUICK BASE64 DECODE&quot;</strong> button to unmask the hidden passphrase.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Case Files & Scoring */}
          {(activeGuideTab === 'cases' || typeof window !== 'undefined') && (
            <div className={`flex flex-col gap-4 ${activeGuideTab !== 'cases' ? 'print:flex hidden' : 'flex'}`}>
              <div className="flex items-center gap-2 border-b border-[#292a2d] pb-2 print:border-black">
                <span className="material-symbols-outlined text-[#dc2626] text-[20px] print:hidden">folder_shared</span>
                <h4 className="font-heading text-base font-bold text-[#e3e2e6] uppercase print:text-black">
                  Phase 5: Case Directory & Detective Performance Scoring
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans text-xs">
                <div className="p-3 bg-[#101114] rounded-lg border border-[#292a2d] print:border-gray-400 print:bg-white">
                  <span className="font-mono text-xs font-bold text-[#45dfa4] uppercase block mb-1 print:text-black">
                    Case 01: The Locked Room
                  </span>
                  <p className="text-[#94a3b8] print:text-gray-800">
                    <strong>Victim:</strong> Adrian Vale, Tech CEO.<br />
                    <strong>Setting:</strong> 44th Floor ValeTech Penthouse.<br />
                    <strong>Focus:</strong> Biometric locks, server blackouts, and cyanide-laced decanters.
                  </p>
                </div>

                <div className="p-3 bg-[#101114] rounded-lg border border-[#292a2d] print:border-gray-400 print:bg-white">
                  <span className="font-mono text-xs font-bold text-[#45dfa4] uppercase block mb-1 print:text-black">
                    Case 02: The Poisoned Heir
                  </span>
                  <p className="text-[#94a3b8] print:text-gray-800">
                    <strong>Victim:</strong> Julian Vance, Estate Heir.<br />
                    <strong>Setting:</strong> Vance Manor Botanical Conservatory.<br />
                    <strong>Focus:</strong> Rare alkaloids (Aconitine), irrigation timers, and will alterations.
                  </p>
                </div>

                <div className="p-3 bg-[#101114] rounded-lg border border-[#292a2d] print:border-gray-400 print:bg-white">
                  <span className="font-mono text-xs font-bold text-[#45dfa4] uppercase block mb-1 print:text-black">
                    Case 03: The Midnight Train
                  </span>
                  <p className="text-[#94a3b8] print:text-gray-800">
                    <strong>Victim:</strong> Viktor Sterling, Diplomat.<br />
                    <strong>Setting:</strong> Kestrel Express Alpine Rail.<br />
                    <strong>Focus:</strong> Tunnel darkness, ticket stubs, and sound-dampened ballistics.
                  </p>
                </div>

                <div className="p-3 bg-[#101114] rounded-lg border border-[#292a2d] print:border-gray-400 print:bg-white">
                  <span className="font-mono text-xs font-bold text-[#45dfa4] uppercase block mb-1 print:text-black">
                    Case 04: The Blackout Gala
                  </span>
                  <p className="text-[#94a3b8] print:text-gray-800">
                    <strong>Victim:</strong> Vivienne Monet, Museum Curator.<br />
                    <strong>Setting:</strong> Metropolitan Museum Grand Gallery.<br />
                    <strong>Focus:</strong> Laser alarms, power breaker overrides, and stolen artifact heists.
                  </p>
                </div>

                <div className="p-3 bg-[#101114] rounded-lg border border-[#292a2d] print:border-gray-400 print:bg-white">
                  <span className="font-mono text-xs font-bold text-[#45dfa4] uppercase block mb-1 print:text-black">
                    Case 05: The Silent Villa
                  </span>
                  <p className="text-[#94a3b8] print:text-gray-800">
                    <strong>Victim:</strong> Silas Ward, Venture Capitalist.<br />
                    <strong>Setting:</strong> Cliffside Malibu Villa.<br />
                    <strong>Focus:</strong> Smart home locks, underwater pool lights, and drone flight logs.
                  </p>
                </div>

                <div className="p-3 bg-[#101114] rounded-lg border border-[#292a2d] print:border-gray-400 print:bg-white">
                  <span className="font-mono text-xs font-bold text-[#f9bd22] uppercase block mb-1 print:text-black">
                    Scoring & Rank Evaluation
                  </span>
                  <ul className="text-[#94a3b8] print:text-gray-800 space-y-1">
                    <li>• <strong>S-RANK (900+ PTS):</strong> Flawless deduction with zero failed accusations and minimal hints.</li>
                    <li>• <strong>A-RANK (750-899 PTS):</strong> Thorough investigative rigor with high accuracy.</li>
                    <li>• <strong>B-RANK (600-749 PTS):</strong> Solid casework completed with some trial and error.</li>
                    <li>• <strong>C-RANK (400-599 PTS):</strong> Substantial penalties incurred during interrogation.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Quick PDF Print / Footer Note */}
          <div className="pt-4 border-t border-[#292a2d] flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
            <span className="font-mono text-xs text-[#94a3b8]">
              TIP: Click <strong>PRINT / SAVE PDF</strong> above to produce a clean physical or PDF booklet without web UI artifacts.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrintPdf}
                className="px-3.5 py-1.5 rounded-lg bg-[#dc2626] hover:bg-[#b91c1c] text-white font-mono text-xs font-bold flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                PRINT / SAVE PDF
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg bg-[#292a2d] hover:bg-[#343538] text-[#e3e2e6] font-mono text-xs font-semibold"
              >
                CLOSE MANUAL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
