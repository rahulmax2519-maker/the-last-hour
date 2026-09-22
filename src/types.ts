export type CaseId = 'case-01' | 'case-02' | 'case-03' | 'case-04' | 'case-05';

export type NavTab = 'case-overview' | 'suspect-matrix' | 'evidence-locker' | 'tactical-terminal' | 'timeline' | 'documents' | 'final-accusation';

export type AlibiStatus = 'UNVERIFIED' | 'LOGGED' | 'COMPROMISED' | 'CONFLICTING';

export interface Suspect {
  id: string;
  name: string;
  age: number;
  occupation: string;
  relationship: string;
  statusTag: string;
  statusCategory: 'conflicting' | 'high-suspicion' | 'unlocked' | 'cleared';
  avatar: string;
  clearance: string;
  initialStatement: {
    time: string;
    text: string;
    label?: string;
  };
  alibi: {
    status: AlibiStatus;
    details: string;
  };
  contradiction: {
    title: string;
    text: string;
    icon?: string;
  };
  motive: string;
  suspicionScore: number;
  isMurderer: boolean;
  hiddenIntelKey?: string;
  hiddenAttachmentName?: string;
  interrogationQuotes: string[];
}

export interface DiagnosticField {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface Evidence {
  id: string;
  code: string;
  type: 'PHOTO' | 'DIGITAL' | 'FORENSIC' | 'DOCUMENTS';
  title: string;
  subtitle?: string;
  location?: string;
  timestamp?: string;
  description: string;
  image?: string;
  discoveryNote?: string;
  terminalLog?: string[];
  diagnosticFields?: DiagnosticField[];
  isUnlocked: boolean;
  requiresPuzzleId?: string;
  isRedacted?: boolean;
  redactedData?: {
    before: string;
    redacted1: string;
    mid: string;
    redacted2: string;
    after: string;
    revealed1: string;
    revealed2: string;
  };
}

export type PuzzleType =
  | 'console'
  | 'caesar'
  | 'base64'
  | 'binary'
  | 'hex'
  | 'morse'
  | 'js_console'
  | 'source_code'
  | 'pattern'
  | 'metadata';

export interface Puzzle {
  id: string;
  title: string;
  type: PuzzleType;
  category: string;
  instructions: string;
  cipherData: string;
  cipherMetadata?: {
    key?: string;
    shift?: number;
    format?: string;
    hintRef?: string;
    codeSnippet?: string;
  };
  acceptedAnswers: string[];
  hints: [string, string, string];
  rewardEvidenceId: string;
  rewardIntelKey?: string;
  rewardText: string;
  difficulty: number; // 1 to 5
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  suspectId?: string;
  actor?: string;
  requiresEvidenceId?: string;
  associatedEvidenceId?: string;
  isVerifiedDefault?: boolean;
  verified?: boolean;
}

export interface DocumentFile {
  id: string;
  code: string;
  title: string;
  date: string;
  category: string;
  classification: string;
  summary: string;
  content: string;
  isTampered?: boolean;
}

export interface CaseSolution {
  murdererId: string;
  murdererName: string;
  killerName?: string;
  time: string;
  timeOfMurder?: string;
  location: string;
  method: string;
  motive: string;
  summary: string;
  fullNarrative?: string;
}

export interface CaseData {
  id: CaseId;
  number: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  stars: number;
  initialStatus: 'active' | 'locked' | 'archived';
  headerImage: string;
  victim: {
    name: string;
    age: number;
    title: string;
    company: string;
    location: string;
    timeOfDeath: string;
    pathology: string;
    image: string;
  };
  synopsis: string;
  decryptionVector: string[];
  incidentLogs: {
    time: string;
    title: string;
    tag: string;
    text: string;
    level: 'normal' | 'warn' | 'critical';
  }[];
  suspects: Suspect[];
  evidence: Evidence[];
  puzzles: Puzzle[];
  timeline: TimelineEvent[];
  documents: DocumentFile[];
  solution: CaseSolution;
}

export interface InvestigationState {
  caseId: CaseId;
  startTime: number;
  elapsedSeconds: number;
  timerActive: boolean;
  score: number;
  solvedPuzzleIds: string[];
  unlockedEvidenceIds: string[];
  unlockedIntelKeys: string[];
  usedHintCounts: Record<string, number>; // puzzleId -> hint index used (1, 2, 3)
  wrongAttemptsCount: number;
  wrongAccusationsCount: number;
  timelineVerifiedIds: string[];
  status: 'not_started' | 'in_progress' | 'solved';
  finalAccusation?: {
    suspectId: string;
    time: string;
    location: string;
    method: string;
    motive: string;
    explanation: string;
    timestamp: number;
  };
  rank?: 'S-RANK' | 'A-RANK' | 'B-RANK' | 'C-RANK' | 'D-RANK';
}

export interface AccusationPayload {
  suspectId: string;
  time: string;
  location: string;
  method: string;
  motive: string;
  notes?: string;
}

export interface GameStorage {
  currentCaseId: CaseId | null;
  cases: Record<CaseId, InvestigationState>;
  unlockedCases: CaseId[];
}
