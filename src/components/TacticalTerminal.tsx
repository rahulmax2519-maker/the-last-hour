import React, { useState, useRef, useEffect } from 'react';
import { CaseData, InvestigationState, NavTab } from '../types';

interface TacticalTerminalProps {
  caseData: CaseData;
  investigationState: InvestigationState;
  onSolvePuzzle: (puzzleId: string, answer: string) => boolean;
  onRequestHint: (puzzleId: string) => void;
  onNavigateTab: (tab: NavTab) => void;
}

interface LogLine {
  id: string;
  type: 'system' | 'input' | 'output' | 'error' | 'success';
  text: string;
}

export const TacticalTerminal: React.FC<TacticalTerminalProps> = ({
  caseData,
  investigationState,
  onSolvePuzzle,
  onRequestHint,
  onNavigateTab,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [logs, setLogs] = useState<LogLine[]>([
    {
      id: '1',
      type: 'system',
      text: `TLH-OS v4.1.9 [VALETECH-FORENSIC-SUBSYSTEM]\nSESSION ESTABLISHED: ${caseData.title.toUpperCase()}\nType 'help' for available commands or 'puzzles' to inspect active ciphers.`,
    },
  ]);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (text: string, type: LogLine['type'] = 'output') => {
    setLogs((prev) => [...prev, { id: Math.random().toString(36), type, text }]);
  };

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    addLog(`> ${trimmed}`, 'input');
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'help':
        addLog(
          `AVAILABLE COMMANDS:\n` +
            `  help                       - Show this reference manual\n` +
            `  status                     - Display current investigation telemetry\n` +
            `  ls / dir                   - List files in current case directory\n` +
            `  cat <filename>             - Read data file or forensic log\n` +
            `  puzzles                    - List cryptographic puzzles in this case\n` +
            `  solve <num|id> <plaintext> - Submit solution for a puzzle\n` +
            `  hint <num|id>              - Request hint (-50 PTS)\n` +
            `  scan <target>              - Run forensic biometric / network scan\n` +
            `  accuse                     - Open Final Indictment protocol\n` +
            `  clear                      - Wipe console buffer`
        );
        break;

      case 'status':
        addLog(
          `[INVESTIGATION STATUS // CASE-${caseData.number}]\n` +
            `TITLE: ${caseData.title}\n` +
            `SCORE: ${investigationState.score} PTS\n` +
            `SOLVED PUZZLES: ${investigationState.solvedPuzzleIds.length} / ${caseData.puzzles.length}\n` +
            `UNLOCKED EVIDENCE: ${investigationState.unlockedEvidenceIds.length} / ${caseData.evidence.length}\n` +
            `WRONG ATTEMPTS: ${investigationState.wrongAttemptsCount}\n` +
            `WRONG ACCUSATIONS: ${investigationState.wrongAccusationsCount}`
        );
        break;

      case 'ls':
      case 'dir':
        addLog(
          `CASE_FILES:\n` +
            `  - cctv_log.txt             [SURVEILLANCE_TIMESTAMP_STREAM]\n` +
            `  - tox_report.txt           [PATHOLOGY_LAB_ANALYSIS]\n` +
            `  - access_badge_logs.csv    [RFID_GATEWAY_TELEMETRY]\n` +
            `  - executive_memo.enc       [ENCRYPTED_PAYLOAD]\n` +
            `  - witness_depositions.txt  [INITIAL_STATEMENTS]`
        );
        break;

      case 'cat':
        if (!args[0]) {
          addLog('Usage: cat <filename>', 'error');
          break;
        }
        const fn = args[0].toLowerCase();
        if (fn.includes('cctv')) {
          addLog(
            `[CCTV LOG DUMP]\n21:00:00 - Corridor normal\n21:10:00 - [ANOMALY] Feed cuts out. Null signal.\n21:21:00 - Signal restores. Corridor empty.\n21:35:00 - Executive office door locked from inside.`
          );
        } else if (fn.includes('tox')) {
          addLog(
            `[TOXICOLOGY MEMO]\nSubstance: Synthetic alkaloid / Digitalis compound\nEstimated time of administration: 30-45 minutes prior to cardiac failure.\nFound in espresso grounds and thermos residue.`
          );
        } else if (fn.includes('access') || fn.includes('badge')) {
          addLog(
            `[BADGE LOG TELEMETRY]\n20:45 - POI-1 (Elena) Badge In Fl. 44\n21:05 - POI-2 (Marcus) Badge In Fl. 44 Server Room\n21:15 - [REDACTED_BADGE] Master key override recorded\n21:40 - All exits sealed automatically.`
          );
        } else if (fn.includes('memo') || fn.includes('enc')) {
          addLog(`[ENCRYPTED BLOB]\n${caseData.puzzles[0]?.cipherData || 'CIPHER_STREAM_NOT_AVAILABLE'}`);
        } else if (fn.includes('witness')) {
          addLog(
            `[WITNESS DEPOSITIONS]\nElena: "I was reviewing the IPO pitch with legal until 21:30."\nMarcus: "System load was spiking, I was locked in the server room."\nDaniel: "The executive had threatened to pull my contract."`
          );
        } else {
          addLog(`File not found: ${args[0]}`, 'error');
        }
        break;

      case 'puzzles':
        addLog(
          `ACTIVE PUZZLES IN CASE ${caseData.number}:\n` +
            caseData.puzzles
              .map(
                (p, idx) =>
                  `  [${idx + 1}] ${p.id} - ${p.title} (${p.type.toUpperCase()}) [${
                    investigationState.solvedPuzzleIds.includes(p.id) ? 'SOLVED' : 'UNSOLVED'
                  }]`
              )
              .join('\n')
        );
        break;

      case 'solve':
        if (args.length < 2) {
          addLog('Usage: solve <puzzle_num_or_id> <answer_text>', 'error');
          break;
        }
        const pIdentifier = args[0];
        const answer = args.slice(1).join(' ');

        // Find puzzle by index or ID
        let targetP = caseData.puzzles.find((p) => p.id.toLowerCase() === pIdentifier.toLowerCase());
        if (!targetP && !isNaN(Number(pIdentifier))) {
          const idx = Number(pIdentifier) - 1;
          targetP = caseData.puzzles[idx];
        }

        if (!targetP) {
          addLog(`Puzzle '${pIdentifier}' not found. Type 'puzzles' to see valid list.`, 'error');
          break;
        }

        const ok = onSolvePuzzle(targetP.id, answer);
        if (ok) {
          addLog(`✓ SUCCESS: Cipher solved! Unlocked: ${targetP.rewardText}`, 'success');
        } else {
          addLog(`✗ MISMATCH: Solution incorrect. Score penalty -100 PTS.`, 'error');
        }
        break;

      case 'hint':
        if (!args[0]) {
          addLog('Usage: hint <puzzle_num_or_id>', 'error');
          break;
        }
        let hintTarget = caseData.puzzles.find((p) => p.id.toLowerCase() === args[0].toLowerCase());
        if (!hintTarget && !isNaN(Number(args[0]))) {
          hintTarget = caseData.puzzles[Number(args[0]) - 1];
        }

        if (!hintTarget) {
          addLog(`Puzzle '${args[0]}' not found.`, 'error');
          break;
        }

        onRequestHint(hintTarget.id);
        const currentHintCount = (investigationState.usedHintCounts[hintTarget.id] || 0) + 1;
        if (currentHintCount <= hintTarget.hints.length) {
          addLog(
            `[HINT ${currentHintCount} (-50 PTS)]: ${hintTarget.hints[currentHintCount - 1]}`,
            'output'
          );
        } else {
          addLog('All available hints have already been unlocked for this cipher.', 'output');
        }
        break;

      case 'scan':
        const target = args.join(' ') || 'ROOM';
        addLog(`Initiating telemetry frequency scan on [${target.toUpperCase()}]...`);
        setTimeout(() => {
          addLog(`Scan complete. Frequency harmonics reveal latent traces matching synthetic alkaloids.`);
        }, 300);
        break;

      case 'accuse':
        addLog('Redirecting to Final Indictment protocol...');
        onNavigateTab('final-accusation');
        break;

      case 'clear':
        setLogs([]);
        break;

      default:
        addLog(`Command not recognized: '${cmd}'. Type 'help' for manual.`, 'error');
        break;
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    handleCommand(inputVal);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIdx + 1 < history.length ? historyIdx + 1 : historyIdx;
        setHistoryIdx(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || '');
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal('');
      }
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 py-3 pb-28 gap-4">
      {/* Telemetry Header */}
      <div className="flex items-center justify-between p-3 bg-[#0d0e11] rounded-lg border border-[#292a2d]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#45dfa4] text-[18px]">terminal</span>
          <span className="font-mono text-xs text-[#e3e2e6] font-bold tracking-widest uppercase">
            FORENSIC CLI // ROOT ACCESS
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="w-2 h-2 rounded-full bg-[#45dfa4] animate-pulse"></span>
          <span className="text-[#45dfa4]">HOST: VALE-NODE-01</span>
        </div>
      </div>

      {/* Quick Action Command Chips */}
      <div className="flex items-center gap-2 flex-wrap py-1">
        {[
          { label: 'STATUS', cmd: 'status' },
          { label: 'LS', cmd: 'ls' },
          { label: 'HELP', cmd: 'help' },
          { label: 'PUZZLES', cmd: 'puzzles' },
          { label: 'CAT CCTV', cmd: 'cat cctv_log.txt' },
          { label: 'CAT TOX', cmd: 'cat tox_report.txt' },
          { label: 'CLEAR', cmd: 'clear' },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => handleCommand(item.cmd)}
            className="px-2.5 py-1 bg-[#1f1f23] hover:bg-[#292a2d] text-[#45dfa4] rounded font-mono text-[11px] font-semibold border border-[#292a2d] whitespace-nowrap transition-colors"
          >
            ${item.cmd}
          </button>
        ))}
      </div>

      {/* Terminal Screen Console */}
      <div
        className="bg-[#090a0d] border border-[#292a2d] rounded-xl p-4 font-mono text-xs sm:text-sm text-[#45dfa4] min-h-[380px] max-h-[500px] overflow-y-auto flex flex-col shadow-2xl relative"
        onClick={() => inputRef.current?.focus()}
      >
        {/* CRT Scanline visual glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#45dfa4]/5 to-transparent pointer-events-none opacity-40"></div>

        {/* Logs */}
        <div className="flex flex-col gap-1.5 z-10 flex-1">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`whitespace-pre-wrap leading-relaxed ${
                log.type === 'system'
                  ? 'text-[#f9bd22] font-semibold'
                  : log.type === 'input'
                  ? 'text-[#e3e2e6] font-bold'
                  : log.type === 'error'
                  ? 'text-[#ffb4ab] font-bold'
                  : log.type === 'success'
                  ? 'text-[#45dfa4] font-bold bg-[#00452e]/30 px-2 py-1 rounded border border-[#00bd85]/40'
                  : 'text-[#94a3b8]'
              }`}
            >
              {log.text}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Terminal Input Row */}
        <form onSubmit={onSubmit} className="flex items-center gap-2 mt-3 pt-2 border-t border-[#292a2d] z-10">
          <span className="text-[#45dfa4] font-bold">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type command ('help', 'status', 'puzzles', 'solve 1 <ans>')..."
            className="flex-1 bg-transparent text-[#e3e2e6] focus:outline-none font-mono text-xs sm:text-sm caret-[#45dfa4]"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1 bg-[#292a2d] hover:bg-[#343538] text-[#45dfa4] rounded font-mono text-xs font-bold transition-colors"
          >
            EXEC
          </button>
        </form>
      </div>
    </div>
  );
};
