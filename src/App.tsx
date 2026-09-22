/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CaseId, NavTab, Suspect, Evidence, AccusationPayload } from './types';
import { CASES_DATA } from './data/cases';
import {
  loadGameStorage,
  saveGameStorage,
  getInitialCaseState,
  calculateRank,
} from './utils/storage';

// Core UI Components
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { CaseSelection } from './components/CaseSelection';
import { CaseBriefing } from './components/CaseBriefing';
import { SuspectMatrix } from './components/SuspectMatrix';
import { EvidenceLocker } from './components/EvidenceLocker';
import { PuzzleEngine } from './components/PuzzleEngine';
import { TacticalTerminal } from './components/TacticalTerminal';
import { TimelineView } from './components/TimelineView';
import { DocumentsView } from './components/DocumentsView';
import { FinalAccusation } from './components/FinalAccusation';

// Modals
import {
  HowToPlayModal,
  TerminalRulesModal,
  ScoringMatrixModal,
  SchematicsModal,
  WitnessAudioModal,
  CrossExamineModal,
  EvidenceInspectModal,
} from './components/Modals';
import { InvestigatorGuideModal } from './components/InvestigatorGuideModal';

export default function App() {
  const [storage, setStorage] = useState(loadGameStorage);
  const [currentCaseId, setCurrentCaseId] = useState<CaseId | null>(storage.currentCaseId);
  const [activeTab, setActiveTab] = useState<NavTab>('case-overview');
  const [selectedPuzzleId, setSelectedPuzzleId] = useState<string | null>(null);

  // Modals state
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isTerminalRulesOpen, setIsTerminalRulesOpen] = useState(false);
  const [isScoringMatrixOpen, setIsScoringMatrixOpen] = useState(false);
  const [isSchematicsOpen, setIsSchematicsOpen] = useState(false);
  const [isWitnessAudioOpen, setIsWitnessAudioOpen] = useState(false);
  const [crossExamineSuspect, setCrossExamineSuspect] = useState<Suspect | null>(null);
  const [inspectEvidence, setInspectEvidence] = useState<Evidence | null>(null);

  // Temporary system banner
  const [banner, setBanner] = useState<{ text: string; type: 'success' | 'warn' | 'info' } | null>(null);
  const bannerTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showBanner = (text: string, type: 'success' | 'warn' | 'info' = 'info') => {
    if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
    setBanner({ text, type });
    bannerTimerRef.current = setTimeout(() => {
      setBanner(null);
    }, 4500);
  };

  // Sound generator via Web Audio API
  const playTacticalSfx = (type: 'beep' | 'success' | 'error' | 'click') => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'beep') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'success') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
        osc1.frequency.setValueAtTime(783.99, ctx.currentTime + 0.1); // G5
        osc2.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.1); // C6
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.35);
        osc2.stop(ctx.currentTime + 0.35);
      } else if (type === 'error') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.setValueAtTime(120, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {
      // AudioContext might be blocked until user interacts
    }
  };

  // Timer interval for in-progress case
  useEffect(() => {
    if (!currentCaseId) return;
    const currentCaseState = storage.cases[currentCaseId];
    if (!currentCaseState || currentCaseState.status !== 'in_progress' || !currentCaseState.timerActive) {
      return;
    }

    const interval = setInterval(() => {
      setStorage((prev) => {
        const prevCase = prev.cases[currentCaseId];
        if (!prevCase || prevCase.status !== 'in_progress' || !prevCase.timerActive) {
          return prev;
        }
        const updated = {
          ...prev,
          cases: {
            ...prev.cases,
            [currentCaseId]: {
              ...prevCase,
              elapsedSeconds: prevCase.elapsedSeconds + 1,
            },
          },
        };
        saveGameStorage(updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentCaseId, storage.cases]);

  // Current case helpers
  const currentCase = currentCaseId ? CASES_DATA[currentCaseId] : null;
  const currentInvestigation = currentCaseId ? storage.cases[currentCaseId] : null;

  // Handle case selection
  const handleSelectCase = useCallback((caseId: CaseId) => {
    playTacticalSfx('beep');
    setCurrentCaseId(caseId);
    setActiveTab('case-overview');
    setStorage((prev) => {
      const updated = { ...prev, currentCaseId: caseId };
      saveGameStorage(updated);
      return updated;
    });
  }, []);

  // Handle Return to Cases Landing
  const handleReturnToCases = useCallback(() => {
    playTacticalSfx('click');
    setCurrentCaseId(null);
    setStorage((prev) => {
      const updated = { ...prev, currentCaseId: null };
      saveGameStorage(updated);
      return updated;
    });
  }, []);

  // Handle Starting Investigation
  const handleStartInvestigation = useCallback(() => {
    if (!currentCaseId) return;
    playTacticalSfx('beep');
    setStorage((prev) => {
      const caseState = prev.cases[currentCaseId];
      const updatedCase = {
        ...caseState,
        status: 'in_progress' as const,
        timerActive: true,
      };
      const updated = {
        ...prev,
        cases: {
          ...prev.cases,
          [currentCaseId]: updatedCase,
        },
      };
      saveGameStorage(updated);
      return updated;
    });
    setActiveTab('suspect-matrix');
    showBanner('INVESTIGATION LAUNCHED // Timer actively synchronizing.', 'info');
  }, [currentCaseId]);

  // Handle Solving a Cryptographic Puzzle
  const handleSolvePuzzle = useCallback(
    (puzzleId: string, answer: string): boolean => {
      if (!currentCaseId || !currentCase) return false;
      const targetPuzzle = currentCase.puzzles.find((p) => p.id === puzzleId);
      if (!targetPuzzle) return false;

      const normalizedInput = answer.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
      const isMatch = targetPuzzle.acceptedAnswers.some((ans) => {
        const normalizedAccepted = ans.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
        return normalizedInput === normalizedAccepted;
      });

      if (isMatch) {
        playTacticalSfx('success');
        setStorage((prev) => {
          const caseState = prev.cases[currentCaseId];
          const newSolved = caseState.solvedPuzzleIds.includes(puzzleId)
            ? caseState.solvedPuzzleIds
            : [...caseState.solvedPuzzleIds, puzzleId];

          // Unlock reward evidence
          const newUnlockedEvidence = [...caseState.unlockedEvidenceIds];
          if (targetPuzzle.rewardEvidenceId && !newUnlockedEvidence.includes(targetPuzzle.rewardEvidenceId)) {
            newUnlockedEvidence.push(targetPuzzle.rewardEvidenceId);
          }

          // Unlock reward intel key if any
          const newUnlockedIntel = [...caseState.unlockedIntelKeys];
          if (targetPuzzle.rewardIntelKey && !newUnlockedIntel.includes(targetPuzzle.rewardIntelKey)) {
            newUnlockedIntel.push(targetPuzzle.rewardIntelKey);
          }

          const updated = {
            ...prev,
            cases: {
              ...prev.cases,
              [currentCaseId]: {
                ...caseState,
                solvedPuzzleIds: newSolved,
                unlockedEvidenceIds: newUnlockedEvidence,
                unlockedIntelKeys: newUnlockedIntel,
              },
            },
          };
          saveGameStorage(updated);
          return updated;
        });

        showBanner(`CRYPTOGRAPHIC INTEGRITY VERIFIED: ${targetPuzzle.rewardText}`, 'success');
        return true;
      } else {
        playTacticalSfx('error');
        setStorage((prev) => {
          const caseState = prev.cases[currentCaseId];
          const penaltyScore = Math.max(0, caseState.score - 100);
          const updated = {
            ...prev,
            cases: {
              ...prev.cases,
              [currentCaseId]: {
                ...caseState,
                score: penaltyScore,
                wrongAttemptsCount: caseState.wrongAttemptsCount + 1,
              },
            },
          };
          saveGameStorage(updated);
          return updated;
        });

        showBanner('HASH MISMATCH: Solution does not decrypt ciphertext (-100 PTS)', 'warn');
        return false;
      }
    },
    [currentCaseId, currentCase]
  );

  // Handle Requesting Puzzle Hint
  const handleRequestHint = useCallback(
    (puzzleId: string) => {
      if (!currentCaseId) return;
      playTacticalSfx('click');
      setStorage((prev) => {
        const caseState = prev.cases[currentCaseId];
        const currentCount = caseState.usedHintCounts[puzzleId] || 0;
        const newCount = currentCount + 1;
        const newScore = Math.max(0, caseState.score - 50);

        const updated = {
          ...prev,
          cases: {
            ...prev.cases,
            [currentCaseId]: {
              ...caseState,
              score: newScore,
              usedHintCounts: {
                ...caseState.usedHintCounts,
                [puzzleId]: newCount,
              },
            },
          },
        };
        saveGameStorage(updated);
        return updated;
      });
      showBanner('HINT DECRYPTED // Score penalized -50 PTS', 'info');
    },
    [currentCaseId]
  );

  // Handle Accusation Submission
  const handleSubmitAccusation = useCallback(
    (payload: AccusationPayload): { success: boolean; message: string } => {
      if (!currentCaseId || !currentCase) {
        return { success: false, message: 'Invalid case state.' };
      }

      const isSuspectCorrect = payload.suspectId === currentCase.solution.murdererId;

      if (isSuspectCorrect) {
        playTacticalSfx('success');
        const caseState = storage.cases[currentCaseId];
        const rank = calculateRank(caseState.score);

        // Calculate next case to unlock
        const caseIds: CaseId[] = ['case-01', 'case-02', 'case-03', 'case-04', 'case-05'];
        const currentIdx = caseIds.indexOf(currentCaseId);
        const nextCaseId = currentIdx < caseIds.length - 1 ? caseIds[currentIdx + 1] : null;

        const nextUnlockedCases = [...storage.unlockedCases];
        if (nextCaseId && !nextUnlockedCases.includes(nextCaseId)) {
          nextUnlockedCases.push(nextCaseId);
        }

        setStorage((prev) => {
          const updated = {
            ...prev,
            unlockedCases: nextUnlockedCases,
            cases: {
              ...prev.cases,
              [currentCaseId]: {
                ...caseState,
                status: 'solved' as const,
                timerActive: false,
                rank,
                finalAccusation: {
                  ...payload,
                  explanation: payload.notes || 'Forensic telemetry confirmed.',
                  timestamp: Date.now(),
                },
              },
            },
          };
          saveGameStorage(updated);
          return updated;
        });

        showBanner(`CASE SOLVED // Indictment confirmed with ${rank}!`, 'success');
        return {
          success: true,
          message: `VERDICT CONFIRMED: Physical and digital forensics corroborate your indictment of ${currentCase.solution.murdererName}.`,
        };
      } else {
        playTacticalSfx('error');
        setStorage((prev) => {
          const caseState = prev.cases[currentCaseId];
          const penaltyScore = Math.max(0, caseState.score - 200);
          const updated = {
            ...prev,
            cases: {
              ...prev.cases,
              [currentCaseId]: {
                ...caseState,
                score: penaltyScore,
                wrongAccusationsCount: caseState.wrongAccusationsCount + 1,
              },
            },
          };
          saveGameStorage(updated);
          return updated;
        });

        showBanner('INDICTMENT REJECTED // Discrepancies in alibi and ballistic evidence (-200 PTS)', 'warn');
        return {
          success: false,
          message:
            'INDICTMENT REJECTED: The primary suspect’s timeline and access credentials contradict this sequence. Re-examine server logs and witness alibis.',
        };
      }
    },
    [currentCaseId, currentCase, storage]
  );

  // Handle Resetting Case
  const handleResetCase = useCallback((caseId: CaseId) => {
    playTacticalSfx('click');
    setStorage((prev) => {
      const updated = {
        ...prev,
        cases: {
          ...prev.cases,
          [caseId]: getInitialCaseState(caseId),
        },
      };
      saveGameStorage(updated);
      return updated;
    });
    showBanner(`Case ${CASES_DATA[caseId].number} data reset to factory zero.`, 'info');
  }, []);

  // Handle Next Case Selection from Success Screen
  const handleSelectNextCase = useCallback(() => {
    if (!currentCaseId) return;
    const caseIds: CaseId[] = ['case-01', 'case-02', 'case-03', 'case-04', 'case-05'];
    const currentIdx = caseIds.indexOf(currentCaseId);
    if (currentIdx < caseIds.length - 1) {
      const nextId = caseIds[currentIdx + 1];
      handleSelectCase(nextId);
    } else {
      handleReturnToCases();
    }
  }, [currentCaseId, handleSelectCase, handleReturnToCases]);

  // Jump straight to terminal puzzle
  const handleOpenTerminalForPuzzle = useCallback((puzzleId: string) => {
    setSelectedPuzzleId(puzzleId);
    setActiveTab('tactical-terminal');
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#121316] text-[#e3e2e6] selection:bg-[#dc2626] selection:text-white">
      {/* Global Header */}
      <Header
        currentCaseId={currentCaseId}
        activeTab={activeTab}
        onNavigateTab={(tab) => {
          playTacticalSfx('click');
          setActiveTab(tab);
        }}
        onReturnToCases={handleReturnToCases}
        onOpenGuide={() => setIsGuideOpen(true)}
        elapsedSeconds={currentInvestigation?.elapsedSeconds || 0}
        score={currentInvestigation?.score || 1000}
      />

      {/* Navigation Ribbon (When inside a case) */}
      {currentCase && (
        <Navigation
          activeTab={activeTab}
          onNavigateTab={(tab) => {
            playTacticalSfx('click');
            setActiveTab(tab);
          }}
          suspectCount={currentCase.suspects.length}
          unlockedEvidenceCount={currentInvestigation?.unlockedEvidenceIds.length || 0}
          totalEvidenceCount={currentCase.evidence.length}
          unsolvedPuzzlesCount={
            currentCase.puzzles.length - (currentInvestigation?.solvedPuzzleIds.length || 0)
          }
        />
      )}

      {/* Real-time System Banner */}
      {banner && (
        <div
          className={`fixed top-20 right-4 z-50 px-4 py-2.5 rounded-lg border font-mono text-xs shadow-2xl flex items-center gap-2 max-w-md animate-fadeIn ${
            banner.type === 'success'
              ? 'bg-[#00452e] border-[#00bd85] text-[#45dfa4]'
              : banner.type === 'warn'
              ? 'bg-[#93000a] border-[#ffb4ab] text-[#ffdad6]'
              : 'bg-[#1f1f23] border-[#384259] text-[#e3e2e6]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {banner.type === 'success'
              ? 'check_circle'
              : banner.type === 'warn'
              ? 'warning'
              : 'info'}
          </span>
          <span className="flex-1">{banner.text}</span>
          <button
            type="button"
            onClick={() => setBanner(null)}
            className="text-white/60 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 flex flex-col pt-2 sm:pt-4">
        {!currentCaseId || !currentCase || !currentInvestigation ? (
          /* Landing Screen: 5-Case Selector */
          <CaseSelection
            unlockedCases={storage.unlockedCases}
            casesState={storage.cases}
            onSelectCase={handleSelectCase}
            onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
            onOpenTerminalRules={() => setIsTerminalRulesOpen(true)}
            onOpenScoringMatrix={() => setIsScoringMatrixOpen(true)}
            onOpenFieldManual={() => setIsGuideOpen(true)}
            onResetCase={handleResetCase}
          />
        ) : (
          /* Active Case Investigation Screens */
          <>
            {activeTab === 'case-overview' && (
              <CaseBriefing
                caseData={currentCase}
                investigationState={currentInvestigation}
                onStartInvestigation={handleStartInvestigation}
                onOpenSchematics={() => setIsSchematicsOpen(true)}
                onOpenWitnessAudio={() => setIsWitnessAudioOpen(true)}
                onQuickInspectArtifact={() => {
                  setActiveTab('evidence-locker');
                }}
              />
            )}

            {activeTab === 'suspect-matrix' && (
              <SuspectMatrix
                caseData={currentCase}
                investigationState={currentInvestigation}
                onCrossExamine={(suspect) => setCrossExamineSuspect(suspect)}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onUnlockAttachmentClue={() => {
                  showBanner('Forensic cross-examination logged to evidence locker.', 'info');
                }}
              />
            )}

            {activeTab === 'evidence-locker' && (
              <EvidenceLocker
                caseData={currentCase}
                investigationState={currentInvestigation}
                onInspectEvidence={(item) => setInspectEvidence(item)}
                onOpenTerminalForPuzzle={handleOpenTerminalForPuzzle}
              />
            )}

            {activeTab === 'tactical-terminal' && (
              <div className="flex flex-col gap-6 w-full">
                {/* Cryptographic Puzzle Workbench */}
                <PuzzleEngine
                  caseData={currentCase}
                  investigationState={currentInvestigation}
                  onSolvePuzzle={handleSolvePuzzle}
                  onRequestHint={handleRequestHint}
                  selectedPuzzleId={selectedPuzzleId}
                />

                {/* Tactical Command Line Console */}
                <TacticalTerminal
                  caseData={currentCase}
                  investigationState={currentInvestigation}
                  onSolvePuzzle={handleSolvePuzzle}
                  onRequestHint={handleRequestHint}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              </div>
            )}

            {activeTab === 'timeline' && (
              <TimelineView
                caseData={currentCase}
                investigationState={currentInvestigation}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'documents' && (
              <DocumentsView
                caseData={currentCase}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'final-accusation' && (
              <FinalAccusation
                caseData={currentCase}
                investigationState={currentInvestigation}
                onSubmitAccusation={handleSubmitAccusation}
                onSelectNextCase={handleSelectNextCase}
                onReturnToCases={handleReturnToCases}
              />
            )}
          </>
        )}
      </main>

      {/* Global Modals */}
      <InvestigatorGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <HowToPlayModal isOpen={isHowToPlayOpen} onClose={() => setIsHowToPlayOpen(false)} />
      <TerminalRulesModal isOpen={isTerminalRulesOpen} onClose={() => setIsTerminalRulesOpen(false)} />
      <ScoringMatrixModal isOpen={isScoringMatrixOpen} onClose={() => setIsScoringMatrixOpen(false)} />
      <SchematicsModal
        isOpen={isSchematicsOpen}
        onClose={() => setIsSchematicsOpen(false)}
        floor={currentCase ? `44TH FLOOR — ${currentCase.title.toUpperCase()}` : 'EXECUTIVE FLOOR'}
      />
      <WitnessAudioModal isOpen={isWitnessAudioOpen} onClose={() => setIsWitnessAudioOpen(false)} />
      <CrossExamineModal
        isOpen={crossExamineSuspect !== null}
        onClose={() => setCrossExamineSuspect(null)}
        suspect={crossExamineSuspect}
      />
      <EvidenceInspectModal
        isOpen={inspectEvidence !== null}
        onClose={() => setInspectEvidence(null)}
        item={inspectEvidence}
      />
    </div>
  );
}
