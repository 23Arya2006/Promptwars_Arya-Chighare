export type NodeType = 'decision' | 'visible' | 'assumption' | 'blindspot' | 'conflict' | 'evidence' | 'secondorder' | 'question';

export interface DecisionInput {
  decision: string;
  priorities?: string;
  leaning?: string;
  existingEvidence?: string;
  worries?: string;
  userConfidence: number; // 0 to 100
}

export interface AssumptionItem {
  id: string;
  statement: string;
  whyQuestionable: string;
  evidenceNeeded: string;
  stressScenario: string;
  userStressResponse?: 'changes' | 'no_change' | 'need_evidence';
}

export interface BlindSpotItem {
  id: string;
  factor: string;
  whyItMatters: string;
  uncertainty: string;
  severity: 'critical' | 'moderate' | 'exploratory';
}

export interface ReasoningConflict {
  id: string;
  priority: string;
  reason: string;
  conflict: string;
  tensionScore: number; // 1 to 10
}

export interface MissingEvidenceItem {
  id: string;
  item: string;
  category: string;
  impactIfMissing: string;
  verified?: boolean;
}

export interface SecondOrderEffect {
  id: string;
  initialTrigger: string;
  step1: string;
  step2: string;
  downstreamRisk: string;
  probability: 'possible' | 'likely' | 'low';
}

export interface StakeholderLens {
  id: string;
  stakeholder: 'You' | 'Family & Personal' | 'College / Education' | 'Employer / Team' | 'Future 5-Year Self';
  perspective: string;
  potentialBlindspot: string;
  keyConcern: string;
}

export interface QuestionItem {
  id: string;
  question: string;
  impact: 'HIGH IMPACT' | 'MEDIUM IMPACT' | 'LOW IMPACT';
  whyItMatters: string;
  userNotes?: string;
}

export interface ReasoningXRayResult {
  id: string;
  decision: string;
  timestamp: string;
  visibleReasons: string[];
  assumptions: AssumptionItem[];
  blindSpots: BlindSpotItem[];
  conflicts: ReasoningConflict[];
  missingEvidence: MissingEvidenceItem[];
  secondOrderEffects: SecondOrderEffect[];
  stakeholderLenses: StakeholderLens[];
  highImpactQuestions: QuestionItem[];
  reasoningSummary: string;
  userConfidence: number;
  evidenceCoverage: number; // 0 to 100 calculated
  calibrationDelta: number; // userConfidence - evidenceCoverage
  calibrationStatus: 'overconfident' | 'calibrated' | 'cautious';
  calibrationAdvice: string;
  isDemo?: boolean;
}

export interface RadarNode {
  id: string;
  type: NodeType;
  label: string;
  sublabel?: string;
  details?: string;
  extra?: any;
  x: number;
  y: number;
  radius?: number;
  connectedTo: string[];
}
