import { CaseId, GameStorage, InvestigationState } from '../types';
import { CASES_DATA } from '../data/cases';

const STORAGE_KEY = 'tlh_murder_mystery_state_v1';

export function getInitialCaseState(caseId: CaseId): InvestigationState {
  const caseData = CASES_DATA[caseId];
  const initialUnlockedEvidence = caseData.evidence
    .filter((e) => e.isUnlocked)
    .map((e) => e.id);

  return {
    caseId,
    startTime: Date.now(),
    elapsedSeconds: 0,
    timerActive: false,
    score: 1000,
    solvedPuzzleIds: [],
    unlockedEvidenceIds: initialUnlockedEvidence,
    unlockedIntelKeys: [],
    usedHintCounts: {},
    wrongAttemptsCount: 0,
    wrongAccusationsCount: 0,
    timelineVerifiedIds: caseData.timeline
      .filter((t) => Boolean((t as any).verified) || Boolean(t.isVerifiedDefault))
      .map((t) => t.id),
    status: 'not_started',
  };
}

export function loadGameStorage(): GameStorage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        currentCaseId: null,
        cases: {
          'case-01': getInitialCaseState('case-01'),
          'case-02': getInitialCaseState('case-02'),
          'case-03': getInitialCaseState('case-03'),
          'case-04': getInitialCaseState('case-04'),
          'case-05': getInitialCaseState('case-05'),
        },
        unlockedCases: ['case-01'],
      };
    }
    const parsed = JSON.parse(raw) as GameStorage;
    // Ensure all 5 cases exist in case structure
    const allIds: CaseId[] = ['case-01', 'case-02', 'case-03', 'case-04', 'case-05'];
    allIds.forEach((id) => {
      if (!parsed.cases[id]) {
        parsed.cases[id] = getInitialCaseState(id);
      }
    });
    if (!parsed.unlockedCases || !parsed.unlockedCases.includes('case-01')) {
      parsed.unlockedCases = ['case-01', ...(parsed.unlockedCases || [])];
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load storage:', err);
    return {
      currentCaseId: null,
      cases: {
        'case-01': getInitialCaseState('case-01'),
        'case-02': getInitialCaseState('case-02'),
        'case-03': getInitialCaseState('case-03'),
        'case-04': getInitialCaseState('case-04'),
        'case-05': getInitialCaseState('case-05'),
      },
      unlockedCases: ['case-01'],
    };
  }
}

export function saveGameStorage(storage: GameStorage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch (err) {
    console.error('Failed to save storage:', err);
  }
}

export function formatTimer(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function calculateRank(score: number): 'S-RANK' | 'A-RANK' | 'B-RANK' | 'C-RANK' | 'D-RANK' {
  if (score >= 900) return 'S-RANK';
  if (score >= 750) return 'A-RANK';
  if (score >= 600) return 'B-RANK';
  if (score >= 400) return 'C-RANK';
  return 'D-RANK';
}
