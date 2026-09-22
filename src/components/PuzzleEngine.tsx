import React, { useState } from 'react';
import { CaseData, InvestigationState, Puzzle } from '../types';

interface PuzzleEngineProps {
  caseData: CaseData;
  investigationState: InvestigationState;
  onSolvePuzzle: (puzzleId: string, answer: string) => boolean;
  onRequestHint: (puzzleId: string) => void;
  selectedPuzzleId?: string | null;
}

export const PuzzleEngine: React.FC<PuzzleEngineProps> = ({
  caseData,
  investigationState,
  onSolvePuzzle,
  onRequestHint,
  selectedPuzzleId,
}) => {
  const [activePuzzleId, setActivePuzzleId] = useState<string>(
    selectedPuzzleId || caseData.puzzles[0]?.id || ''
  );
  const [inputAnswer, setInputAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Caesar rot helper
  const [caesarRot, setCaesarRot] = useState<number>(3);

  // Morse audio player
  const [isPlayingMorse, setIsPlayingMorse] = useState<boolean>(false);

  const currentPuzzle = caseData.puzzles.find((p) => p.id === activePuzzleId) || caseData.puzzles[0];
  const isSolved = currentPuzzle ? investigationState.solvedPuzzleIds.includes(currentPuzzle.id) : false;
  const hintsUsed = currentPuzzle ? investigationState.usedHintCounts[currentPuzzle.id] || 0 : 0;

  const handleCaesarDecode = (str: string, rot: number) => {
    return str.replace(/[a-zA-Z]/g, (c) => {
      const base = c <= 'Z' ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base - rot + 26) % 26) + base);
    });
  };

  const playMorseSound = (morse: string) => {
    if (isPlayingMorse) return;
    setIsPlayingMorse(true);
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const dotDuration = 0.08;
      let time = audioCtx.currentTime + 0.05;

      morse.split('').forEach((symbol) => {
        if (symbol === '.' || symbol === '-') {
          const dur = symbol === '.' ? dotDuration : dotDuration * 3;
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(750, time);
          gain.gain.setValueAtTime(0.1, time);
          gain.gain.setValueAtTime(0.1, time + dur - 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(time);
          osc.stop(time + dur);
          time += dur + dotDuration;
        } else if (symbol === ' ') {
          time += dotDuration * 3;
        } else if (symbol === '/') {
          time += dotDuration * 7;
        }
      });

      setTimeout(() => {
        setIsPlayingMorse(false);
      }, (time - audioCtx.currentTime) * 1000);
    } catch {
      setIsPlayingMorse(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPuzzle || isSolved) return;
    if (!inputAnswer.trim()) return;

    const success = onSolvePuzzle(currentPuzzle.id, inputAnswer);
    if (success) {
      setFeedback({ type: 'success', text: `CRYPTOGRAPHIC INTEGRITY VERIFIED // ${currentPuzzle.rewardText}` });
      setInputAnswer('');
    } else {
      setFeedback({
        type: 'error',
        text: 'INTEGRITY MISMATCH: Solution does not match hash (-100 PTS)',
      });
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 py-3 gap-5">
      {/* Puzzle Tabs Ribbon */}
      <div className="flex items-center gap-2 flex-wrap py-1">
        {caseData.puzzles.map((p, idx) => {
          const solved = investigationState.solvedPuzzleIds.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setActivePuzzleId(p.id);
                setFeedback(null);
                setInputAnswer('');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs uppercase tracking-wider whitespace-nowrap transition-colors border ${
                activePuzzleId === p.id
                  ? 'bg-[#dc2626] text-white border-[#dc2626] font-bold shadow'
                  : 'bg-[#1f1f23] text-[#94a3b8] hover:text-[#e3e2e6] border-[#292a2d]'
              }`}
            >
              <span>PUZZLE 0{idx + 1}</span>
              {solved ? (
                <span className="text-[#45dfa4] font-bold">✓</span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-[#f9bd22] animate-pulse"></span>
              )}
            </button>
          );
        })}
      </div>

      {currentPuzzle && (
        <div className="flex flex-col bg-[#1b1b1f] rounded-xl border border-[#292a2d] overflow-hidden shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-[#292a2d] border-b border-[#343538]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffb4ab] text-[20px]">psychology</span>
              <div>
                <h3 className="font-heading text-base font-bold text-[#e3e2e6] uppercase tracking-wide">
                  {currentPuzzle.title}
                </h3>
                <span className="font-mono text-[10px] text-[#45dfa4] uppercase font-semibold">
                  CIPHER TYPE: {currentPuzzle.type.toUpperCase()} // REWARD: {currentPuzzle.rewardText}
                </span>
              </div>
            </div>

            {isSolved ? (
              <span className="px-3 py-1 bg-[#00452e] text-[#45dfa4] rounded font-mono text-xs font-bold uppercase tracking-wider border border-[#00bd85]/40">
                ✓ DECRYPTED
              </span>
            ) : (
              <span className="px-3 py-1 bg-[#93000a] text-[#ffb4ab] rounded font-mono text-xs font-bold uppercase tracking-wider animate-pulse">
                ACTIVE CIPHER
              </span>
            )}
          </div>

          {/* Cipher Payload Section */}
          <div className="p-4 flex flex-col gap-4">
            <p className="font-sans text-sm text-[#94a3b8] leading-relaxed">
              {currentPuzzle.instructions}
            </p>

            {/* Cipher Text Visualizer Block */}
            <div className="p-4 bg-[#0d0e11] rounded-lg border border-[#292a2d] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#ffb4ab] uppercase tracking-wider font-bold">
                  INTERCEPTED DATA STREAM
                </span>
                <span className="font-mono text-[10px] text-[#94a3b8]">HEX_LENGTH: {currentPuzzle.cipherData.length}</span>
              </div>

              <div className="p-3 bg-[#121316] rounded border border-[#292a2d] font-mono text-sm sm:text-base text-[#45dfa4] tracking-widest break-all select-all font-semibold">
                {currentPuzzle.cipherData}
              </div>

              {/* Special interactive tools depending on cipher type */}
              {currentPuzzle.type === 'caesar' && (
                <div className="mt-2 p-3 bg-[#1b1b1f] rounded border border-[#292a2d] flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#f9bd22] font-semibold">
                      ROTATION SHIFT WHEEL: ROT-{caesarRot}
                    </span>
                    <input
                      type="range"
                      min="1"
                      max="25"
                      value={caesarRot}
                      onChange={(e) => setCaesarRot(Number(e.target.value))}
                      className="w-32 accent-[#dc2626]"
                    />
                  </div>
                  <div className="font-mono text-xs text-[#e3e2e6] bg-[#0d0e11] p-2 rounded border border-[#292a2d]">
                    <span className="text-[#94a3b8]">PREVIEW ROT-{caesarRot}: </span>
                    <span className="text-[#45dfa4]">{handleCaesarDecode(currentPuzzle.cipherData, caesarRot)}</span>
                  </div>
                </div>
              )}

              {currentPuzzle.type === 'morse' && (
                <div className="mt-2 flex items-center justify-between p-3 bg-[#1b1b1f] rounded border border-[#292a2d]">
                  <span className="font-mono text-xs text-[#f9bd22]">ACOUSTIC TELEMETRY STREAM</span>
                  <button
                    type="button"
                    onClick={() => playMorseSound(currentPuzzle.cipherData)}
                    disabled={isPlayingMorse}
                    className="px-3 py-1.5 bg-[#292a2d] hover:bg-[#343538] text-[#e3e2e6] rounded font-mono text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#ffb4ab]">
                      {isPlayingMorse ? 'volume_up' : 'play_arrow'}
                    </span>
                    <span>{isPlayingMorse ? 'TRANSMITTING...' : 'PLAY AUDIO FREQ'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Hint System */}
            <div className="flex flex-col gap-2 p-3 bg-[#1f1f23] rounded-lg border border-[#292a2d]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#f9bd22] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                  DECRYPT HINTS (COST: -50 PTS EACH)
                </span>
                <span className="font-mono text-[10px] text-[#94a3b8]">
                  {hintsUsed} / {currentPuzzle.hints.length} UNLOCKED
                </span>
              </div>

              {hintsUsed > 0 && (
                <div className="flex flex-col gap-1.5 mt-1">
                  {currentPuzzle.hints.slice(0, hintsUsed).map((hint, idx) => (
                    <div key={idx} className="p-2 bg-[#0d0e11] rounded border border-[#292a2d] font-sans text-xs text-[#ffdad6]">
                      <span className="font-mono text-[10px] text-[#f9bd22] font-bold mr-1">HINT 0{idx + 1}:</span>
                      {hint}
                    </div>
                  ))}
                </div>
              )}

              {!isSolved && hintsUsed < currentPuzzle.hints.length && (
                <button
                  type="button"
                  onClick={() => onRequestHint(currentPuzzle.id)}
                  className="mt-1 self-start px-3 py-1 bg-[#292a2d] hover:bg-[#343538] text-[#e3e2e6] rounded font-mono text-[11px] font-semibold flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[13px] text-[#f9bd22]">help</span>
                  REQUEST HINT {hintsUsed + 1} (-50 PTS)
                </button>
              )}
            </div>

            {/* Feedback Alerts */}
            {feedback && (
              <div
                className={`p-3 rounded-lg font-mono text-xs font-bold flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-[#00452e] text-[#45dfa4] border border-[#00bd85]/40'
                    : 'bg-[#93000a] text-[#ffb4ab] border border-[#ff5449]/40 animate-shake'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {feedback.type === 'success' ? 'check_circle' : 'error'}
                </span>
                <span>{feedback.text}</span>
              </div>
            )}

            {/* Answer Input Submission */}
            {!isSolved ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mt-1">
                <input
                  type="text"
                  value={inputAnswer}
                  onChange={(e) => setInputAnswer(e.target.value)}
                  placeholder="ENTER DECRYPTED PLAINTEXT / CODE..."
                  className="flex-1 px-4 py-3 bg-[#0d0e11] text-[#e3e2e6] rounded-lg border border-[#292a2d] focus:border-[#dc2626] focus:outline-none font-mono text-sm tracking-wider uppercase placeholder:text-[#94a3b8]/60"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-lg font-mono text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow active:scale-[0.99] transition-transform"
                >
                  <span className="material-symbols-outlined text-[16px]">lock_open</span>
                  SUBMIT SOLUTION
                </button>
              </form>
            ) : (
              <div className="p-4 bg-[#00452e]/30 rounded-lg border border-[#00bd85]/40 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#45dfa4]">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                  <span className="font-mono text-xs font-bold uppercase tracking-wide">
                    CIPHER RESOLVED & EVIDENCE LINKED TO DOSSIER
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
