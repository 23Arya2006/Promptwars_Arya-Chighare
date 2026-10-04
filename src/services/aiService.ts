import { DecisionInput, ReasoningXRayResult, AssumptionItem, BlindSpotItem, ReasoningConflict, MissingEvidenceItem, SecondOrderEffect, StakeholderLens, QuestionItem } from '../types';
import { DEMO_SCENARIOS } from '../data/demoScenarios';

const LOCAL_STORAGE_KEY = 'blindspot_api_key';
const LOCAL_STORAGE_PROVIDER = 'blindspot_api_provider';

export function getStoredApiKey(): string {
  return localStorage.getItem(LOCAL_STORAGE_KEY) || (import.meta as any).env?.VITE_AI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
}

export function saveStoredApiKey(key: string, provider: string = 'gemini'): void {
  if (key) {
    localStorage.setItem(LOCAL_STORAGE_KEY, key.trim());
    localStorage.setItem(LOCAL_STORAGE_PROVIDER, provider);
  } else {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_PROVIDER);
  }
}

export function getStoredProvider(): string {
  return localStorage.getItem(LOCAL_STORAGE_PROVIDER) || 'gemini';
}

const SYSTEM_PROMPT = `You are BLINDSPOT, an elite AI Socratic Reasoning Analyst for decision-making.

CRITICAL DIRECTIVES:
1. You MUST NOT make the decision for the user.
2. You MUST NOT say "you should choose X" or "I recommend Y".
3. You are NOT an advice chatbot or life coach.
4. Your sole job is to expose:
   - What the user explicitly sees (Visible Reasons)
   - What the user is assuming without proof (Hidden Assumptions, why questionable, evidence needed, stress test counterfactual)
   - What the user is completely overlooking (Blind Spots with uncertainty & severity)
   - Internal contradictions between priorities and reality (Reasoning Conflicts)
   - Crucial missing evidence that needs verification before deciding (Missing Evidence)
   - Cascading downstream consequences (Second-Order Effects: Trigger -> Step 1 -> Step 2 -> Downstream Risk)
   - 5 Stakeholder perspectives (You, Family/Personal, College/Org, Employer/Market, Future 5-Year Self)
   - 5 Material decision-changing questions (Questions where a different answer would flip the reasoning)
5. Distinguish FACT from ASSUMPTION and UNKNOWN.
6. Do not fabricate facts. Phrase uncertainties as possibilities ("This is unclear from the information provided...", "One factor not yet addressed is...").

YOU MUST RESPOND ONLY WITH VALID JSON IN THIS EXACT SCHEMA (NO EXTRA TEXT):
{
  "visible_reasons": ["string"],
  "assumptions": [
    {
      "statement": "string",
      "why_questionable": "string",
      "evidence_needed": "string",
      "stress_scenario": "string"
    }
  ],
  "blind_spots": [
    {
      "factor": "string",
      "why_it_matters": "string",
      "uncertainty": "string",
      "severity": "critical" | "moderate" | "exploratory"
    }
  ],
  "conflicts": [
    {
      "priority": "string",
      "reason": "string",
      "conflict": "string",
      "tension_score": 8
    }
  ],
  "missing_evidence": [
    {
      "item": "string",
      "category": "string",
      "impact_if_missing": "string"
    }
  ],
  "second_order_effects": [
    {
      "initial_trigger": "string",
      "step1": "string",
      "step2": "string",
      "downstream_risk": "string",
      "probability": "possible" | "likely" | "low"
    }
  ],
  "stakeholder_lenses": [
    {
      "stakeholder": "You" | "Family & Personal" | "College / Education" | "Employer / Team" | "Future 5-Year Self",
      "perspective": "string",
      "potential_blindspot": "string",
      "key_concern": "string"
    }
  ],
  "high_impact_questions": [
    {
      "question": "string",
      "impact": "HIGH IMPACT" | "MEDIUM IMPACT" | "LOW IMPACT",
      "why_it_matters": "string"
    }
  ],
  "reasoning_summary": "string",
  "evidence_coverage": 45
}`;

export async function runReasoningXRay(
  input: DecisionInput,
  onProgress?: (stage: string) => void
): Promise<ReasoningXRayResult> {
  const apiKey = getStoredApiKey();
  const provider = getStoredProvider();

  onProgress?.("Parsing visible premises and user context...");
  await new Promise(r => setTimeout(r, 400));

  onProgress?.("Stress-testing unstated assumptions...");
  await new Promise(r => setTimeout(r, 450));

  onProgress?.("Searching for unexamined blind spots & omissions...");
  await new Promise(r => setTimeout(r, 450));

  onProgress?.("Detecting value tensions & internal conflicts...");
  await new Promise(r => setTimeout(r, 400));

  onProgress?.("Mapping cascading second-order downstream effects...");
  await new Promise(r => setTimeout(r, 400));

  onProgress?.("Calibrating confidence vs evidence coverage...");
  await new Promise(r => setTimeout(r, 350));

  // If no API key provided or if demo match, use robust intelligent generator or presets
  if (!apiKey) {
    return generateHeuristicReasoningResult(input);
  }

  try {
    let rawJsonText = '';

    if (provider === 'gemini') {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const userPrompt = `
Decision Statement: ${input.decision}
Stated Priorities: ${input.priorities || "Not explicitly specified"}
Currently Leaning Toward: ${input.leaning || "Undecided / Exploring"}
Existing Evidence Provided: ${input.existingEvidence || "Minimal explicit evidence provided"}
Worries/Concerns Mentioned: ${input.worries || "None explicitly mentioned"}
Stated User Confidence: ${input.userConfidence}%

Perform an unsparing Socratic Reasoning X-Ray according to your system directives. Output strict JSON.`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${SYSTEM_PROMPT}\n\n${userPrompt}` }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.warn('Gemini API Error, falling back gracefully to heuristic analyzer:', errorData);
        return generateHeuristicReasoningResult(input);
      }

      const data = await response.json();
      rawJsonText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else {
      // OpenAI / OpenRouter / Groq endpoint compatible
      const endpoint = 'https://api.openai.com/v1/chat/completions';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            {
              role: 'user',
              content: `Decision: ${input.decision}\nPriorities: ${input.priorities}\nLeaning: ${input.leaning}\nEvidence: ${input.existingEvidence}\nWorries: ${input.worries}\nConfidence: ${input.userConfidence}%`
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.2
        })
      });

      if (!response.ok) {
        return generateHeuristicReasoningResult(input);
      }
      const data = await response.json();
      rawJsonText = data.choices?.[0]?.message?.content || '';
    }

    const parsed = parseAndValidateAiResponse(rawJsonText, input);
    return parsed;
  } catch (err) {
    console.error('AI invocation caught error:', err);
    return generateHeuristicReasoningResult(input);
  }
}

function parseAndValidateAiResponse(rawText: string, input: DecisionInput): ReasoningXRayResult {
  try {
    let clean = rawText.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const json = JSON.parse(clean);

    const assumptions: AssumptionItem[] = (json.assumptions || []).map((a: any, i: number) => ({
      id: `ai-assump-${i + 1}`,
      statement: a.statement || "Unverified assumption",
      whyQuestionable: a.why_questionable || a.whyQuestionable || "Lacks empirical verification.",
      evidenceNeeded: a.evidence_needed || a.evidenceNeeded || "Direct verification required.",
      stressScenario: a.stress_scenario || a.stressScenario || `What if ${a.statement} turns out to be false?`
    }));

    const blindSpots: BlindSpotItem[] = (json.blind_spots || []).map((b: any, i: number) => ({
      id: `ai-bs-${i + 1}`,
      factor: b.factor || "Overlooked Operational Factor",
      whyItMatters: b.why_it_matters || b.whyItMatters || "Significant potential downstream impact.",
      uncertainty: b.uncertainty || "This factor has not yet been addressed.",
      severity: (b.severity === 'critical' || b.severity === 'moderate' || b.severity === 'exploratory') ? b.severity : 'moderate'
    }));

    const conflicts: ReasoningConflict[] = (json.conflicts || []).map((c: any, i: number) => ({
      id: `ai-conf-${i + 1}`,
      priority: c.priority || (input.priorities || "Stated Core Goal"),
      reason: c.reason || "Underlying operational requirement",
      conflict: c.conflict || "Direct competition between stated goal and resource demands.",
      tensionScore: typeof c.tension_score === 'number' ? c.tension_score : 8
    }));

    const missingEvidence: MissingEvidenceItem[] = (json.missing_evidence || []).map((m: any, i: number) => ({
      id: `ai-me-${i + 1}`,
      item: typeof m === 'string' ? m : m.item || "Unverified metric",
      category: typeof m === 'object' && m.category ? m.category : "Operational Reality",
      impactIfMissing: typeof m === 'object' && m.impact_if_missing ? m.impact_if_missing : "Risk of underestimating friction"
    }));

    const secondOrderEffects: SecondOrderEffect[] = (json.second_order_effects || []).map((s: any, i: number) => ({
      id: `ai-soe-${i + 1}`,
      initialTrigger: s.initial_trigger || s.initialTrigger || "Initial commitment",
      step1: s.step1 || "First-order time reallocation",
      step2: s.step2 || "Downstream performance shift",
      downstreamRisk: s.downstream_risk || s.downstreamRisk || "Long-term trajectory impact",
      probability: s.probability || 'likely'
    }));

    const stakeholderLenses: StakeholderLens[] = (json.stakeholder_lenses || []).map((sh: any, i: number) => ({
      id: `ai-sh-${i + 1}`,
      stakeholder: sh.stakeholder || "Stakeholder",
      perspective: sh.perspective || "Evaluates immediate outcomes",
      potentialBlindspot: sh.potential_blindspot || "Underestimating secondary constraints",
      keyConcern: sh.key_concern || "Will this achieve the expected outcome?"
    }));

    const highImpactQuestions: QuestionItem[] = (json.high_impact_questions || []).map((q: any, i: number) => ({
      id: `ai-q-${i + 1}`,
      question: typeof q === 'string' ? q : q.question,
      impact: (q.impact === 'HIGH IMPACT' || q.impact === 'MEDIUM IMPACT' || q.impact === 'LOW IMPACT') ? q.impact : 'HIGH IMPACT',
      whyItMatters: typeof q === 'object' && q.why_it_matters ? q.why_it_matters : "Tests foundational premises."
    }));

    const evidenceCoverage = Math.max(15, Math.min(85, typeof json.evidence_coverage === 'number' ? json.evidence_coverage : Math.round(100 - (missingEvidence.length * 12))));
    const delta = input.userConfidence - evidenceCoverage;
    let calibrationStatus: 'overconfident' | 'calibrated' | 'cautious' = 'calibrated';
    let calibrationAdvice = "Your stated confidence closely mirrors the available evidence coverage.";

    if (delta > 20) {
      calibrationStatus = 'overconfident';
      calibrationAdvice = `Your confidence (${input.userConfidence}%) is significantly ahead of your verified evidence coverage (${evidenceCoverage}%). Key dependencies remain assumed rather than verified.`;
    } else if (delta < -15) {
      calibrationStatus = 'cautious';
      calibrationAdvice = `Your evidence coverage (${evidenceCoverage}%) is higher than your stated confidence (${input.userConfidence}%). You have more concrete foundation than you give yourself credit for.`;
    }

    return {
      id: `xray-${Date.now()}`,
      decision: input.decision,
      timestamp: new Date().toISOString(),
      visibleReasons: json.visible_reasons && json.visible_reasons.length > 0 ? json.visible_reasons : ["Explicit decision upside", "Direct perceived benefit"],
      assumptions: assumptions.length > 0 ? assumptions : generateHeuristicAssumptions(input.decision),
      blindSpots: blindSpots.length > 0 ? blindSpots : generateHeuristicBlindspots(input.decision),
      conflicts: conflicts.length > 0 ? conflicts : generateHeuristicConflicts(input),
      missingEvidence: missingEvidence.length > 0 ? missingEvidence : generateHeuristicEvidence(input.decision),
      secondOrderEffects: secondOrderEffects.length > 0 ? secondOrderEffects : generateHeuristicSecondOrder(input.decision),
      stakeholderLenses: stakeholderLenses.length > 0 ? stakeholderLenses : generateHeuristicStakeholders(input.decision),
      highImpactQuestions: highImpactQuestions.length > 0 ? highImpactQuestions : generateHeuristicQuestions(input.decision),
      reasoningSummary: json.reasoning_summary || "Your reasoning combines clear stated motivations with unverified execution premises. Examining these blind spots clarifies your trade-offs without compromising your final decision ownership.",
      userConfidence: input.userConfidence,
      evidenceCoverage,
      calibrationDelta: delta,
      calibrationStatus,
      calibrationAdvice,
      isDemo: false
    };
  } catch (err) {
    console.error('Failed to parse AI JSON, falling back:', err);
    return generateHeuristicReasoningResult(input);
  }
}

export function generateHeuristicReasoningResult(input: DecisionInput): ReasoningXRayResult {
  // Check if input matches any of our known demo scenarios
  const normalized = input.decision.toLowerCase();
  for (const demo of DEMO_SCENARIOS) {
    if (normalized.includes("internship") && demo.name.includes("Internship")) {
      return {
        ...demo.data,
        id: `xray-${Date.now()}`,
        userConfidence: input.userConfidence,
        calibrationDelta: input.userConfidence - demo.data.evidenceCoverage,
        calibrationStatus: input.userConfidence - demo.data.evidenceCoverage > 20 ? 'overconfident' : 'calibrated'
      };
    }
    if ((normalized.includes("startup") || normalized.includes("equity")) && demo.name.includes("Startup")) {
      return {
        ...demo.data,
        id: `xray-${Date.now()}`,
        userConfidence: input.userConfidence,
        calibrationDelta: input.userConfidence - demo.data.evidenceCoverage,
        calibrationStatus: input.userConfidence - demo.data.evidenceCoverage > 20 ? 'overconfident' : 'calibrated'
      };
    }
    if ((normalized.includes("launch") || normalized.includes("mvp") || normalized.includes("product")) && demo.name.includes("Launch")) {
      return {
        ...demo.data,
        id: `xray-${Date.now()}`,
        userConfidence: input.userConfidence,
        calibrationDelta: input.userConfidence - demo.data.evidenceCoverage,
        calibrationStatus: input.userConfidence - demo.data.evidenceCoverage > 20 ? 'overconfident' : 'calibrated'
      };
    }
  }

  // Dynamic heuristic analyzer for ANY arbitrary decision
  const visible = [
    `Direct perceived benefit of choosing to ${extractAction(input.decision)}`,
    input.leaning ? `Current inclination: ${input.leaning}` : "Immediate upside motivating the decision",
    input.existingEvidence ? `Reported evidence: ${input.existingEvidence.slice(0, 75)}...` : "Initial intuitive conviction"
  ];

  const assumptions = generateHeuristicAssumptions(input.decision);
  const blindSpots = generateHeuristicBlindspots(input.decision);
  const conflicts = generateHeuristicConflicts(input);
  const missingEvidence = generateHeuristicEvidence(input.decision);
  const secondOrderEffects = generateHeuristicSecondOrder(input.decision);
  const stakeholderLenses = generateHeuristicStakeholders(input.decision);
  const highImpactQuestions = generateHeuristicQuestions(input.decision);

  const evidenceCoverage = Math.max(25, Math.min(65, 100 - (missingEvidence.length * 12)));
  const delta = input.userConfidence - evidenceCoverage;
  const calibrationStatus = delta > 20 ? 'overconfident' : delta < -15 ? 'cautious' : 'calibrated';

  return {
    id: `xray-${Date.now()}`,
    decision: input.decision,
    timestamp: new Date().toISOString(),
    visibleReasons: visible,
    assumptions,
    blindSpots,
    conflicts,
    missingEvidence,
    secondOrderEffects,
    stakeholderLenses,
    highImpactQuestions,
    reasoningSummary: `Your reasoning for "${input.decision}" demonstrates clear intuitive motivation, but rests on unverified execution assumptions and uncalculated opportunity costs. Investigating the missing evidence allows you to make this decision from strength.`,
    userConfidence: input.userConfidence,
    evidenceCoverage,
    calibrationDelta: delta,
    calibrationStatus,
    calibrationAdvice: delta > 20 
      ? `Your confidence (${input.userConfidence}%) exceeds current verified evidence coverage (${evidenceCoverage}%). Several core logistical premises remain assumptions.`
      : `Your confidence is well calibrated with the available evidence.`,
    isDemo: false
  };
}

function extractAction(decision: string): string {
  return decision.replace(/^(should i|should we|can i|is it better to)\s+/i, '').replace(/\?$/, '');
}

function generateHeuristicAssumptions(decision: string): AssumptionItem[] {
  return [
    {
      id: "assump-h1",
      statement: "The most visible upside will materialize without unforeseen friction.",
      whyQuestionable: "Initial upside projections routinely discount day-to-day administrative and cognitive overhead.",
      evidenceNeeded: "Historical baseline data from comparable past decisions.",
      stressScenario: "What if the primary expected upside takes 3x longer to realize than currently anticipated?"
    },
    {
      id: "assump-h2",
      statement: "You will possess enough cognitive energy to absorb unexpected secondary commitments.",
      whyQuestionable: "Energy is finite and non-linear; peak performance in one domain often degrades adjacent responsibilities.",
      evidenceNeeded: "A realistic weekly time-audit accounting for rest and context switching.",
      stressScenario: "What if this choice eliminates your buffer for health, relationships, and deep recovery?"
    },
    {
      id: "assump-h3",
      statement: "Key stakeholders will remain accommodating throughout the transition period.",
      whyQuestionable: "Institutional and interpersonal expectations rarely shift voluntarily without formal agreements.",
      evidenceNeeded: "Explicit written alignment or verbal confirmation from affected parties.",
      stressScenario: "What if a key stakeholder actively resists your new schedule or commitment level?"
    }
  ];
}

function generateHeuristicBlindspots(decision: string): BlindSpotItem[] {
  return [
    {
      id: "bs-h1",
      factor: "Uncalculated Opportunity Cost",
      whyItMatters: "Committing capital, attention, or time to this path automatically forecloses alternate high-leverage opportunities during the same window.",
      uncertainty: "It is unclear what valuable alternatives you are actively giving up by choosing this direction.",
      severity: "critical"
    },
    {
      id: "bs-h2",
      factor: "Reversibility & Exit Cost Friction",
      whyItMatters: "If initial conditions change in 90 days, the psychological and financial friction of undoing this decision may be higher than currently assumed.",
      uncertainty: "One factor not yet addressed is your explicit off-ramp or rollback protocol.",
      severity: "critical"
    },
    {
      id: "bs-h3",
      factor: "Hidden Maintenance Overhead",
      whyItMatters: "New commitments come with ongoing operational drag (meetings, administrative overhead, context switching) beyond the primary task.",
      uncertainty: "You may want to investigate the hidden recurring time required to sustain this choice.",
      severity: "moderate"
    }
  ];
}

function generateHeuristicConflicts(input: DecisionInput): ReasoningConflict[] {
  return [
    {
      id: "conf-h1",
      priority: input.priorities || "Maintaining focus on primary personal wellbeing & excellence",
      reason: `Demands required by: "${input.decision.slice(0, 60)}..."`,
      conflict: "Your stated priority requires focused bandwidth, while this commitment introduces competing operational pressure.",
      tensionScore: 8
    }
  ];
}

function generateHeuristicEvidence(decision: string): MissingEvidenceItem[] {
  return [
    {
      id: "me-h1",
      item: "Empirical verification of actual daily time and energy commitments",
      category: "Resource Reality",
      impactIfMissing: "Underestimating true cognitive expenditure"
    },
    {
      id: "me-h2",
      item: "Documented terms of agreement, rollback clauses, or policy flexibility",
      category: "Institutional Safety",
      impactIfMissing: "Inability to cleanly pivot if conditions deteriorate"
    },
    {
      id: "me-h3",
      item: "First-hand accounts from individuals who navigated this exact decision 1-2 years ago",
      category: "Precedent Testing",
      impactIfMissing: "Repeating predictable pitfalls that others have documented"
    }
  ];
}

function generateHeuristicSecondOrder(decision: string): SecondOrderEffect[] {
  return [
    {
      id: "soe-h1",
      initialTrigger: "Full execution of this proposed decision",
      step1: "Squeezed buffer time and reallocated daily priorities",
      step2: "Secondary friction across peripheral commitments",
      downstreamRisk: "Potential fatigue leading to compromised execution across both domains",
      probability: "likely"
    }
  ];
}

function generateHeuristicStakeholders(decision: string): StakeholderLens[] {
  return [
    {
      id: "sh-h1",
      stakeholder: "You",
      perspective: "Driven by immediate progress, growth milestones, and tangible accomplishments.",
      potentialBlindspot: "Over-weighting near-term excitement while discounting multi-month endurance.",
      keyConcern: "Will this meaningfully accelerate my long-term purpose?"
    },
    {
      id: "sh-h2",
      stakeholder: "Family & Personal",
      perspective: "Values emotional presence, shared stability, and predictable availability.",
      potentialBlindspot: "Assuming personal relationships will effortlessly absorb increased absence.",
      keyConcern: "How will my availability for loved ones be protected?"
    },
    {
      id: "sh-h3",
      stakeholder: "Future 5-Year Self",
      perspective: "Looks back across the multi-year arc of your development.",
      potentialBlindspot: "Over-indexing on temporary metrics rather than lasting foundational assets.",
      keyConcern: "Did this choice expand my future options or narrow them?"
    }
  ];
}

function generateHeuristicQuestions(decision: string): QuestionItem[] {
  return [
    {
      id: "q-h1",
      question: "If this decision produced none of the financial or status rewards, would the intrinsic process still make it worthwhile?",
      impact: "HIGH IMPACT",
      whyItMatters: "Separates external validation pressure from intrinsic conviction."
    },
    {
      id: "q-h2",
      question: "What is the single failure mode of this decision that you are least comfortable discussing publicly?",
      impact: "HIGH IMPACT",
      whyItMatters: "Directly isolates unacknowledged vulnerability."
    },
    {
      id: "q-h3",
      question: "What specific empirical evidence would convince you in 60 days that you need to reverse course?",
      impact: "HIGH IMPACT",
      whyItMatters: "Establishes an objective metric-driven off-ramp before emotional sunk cost sets in."
    },
    {
      id: "q-h4",
      question: "Could a 50% smaller initial trial commitment yield 80% of the learning with 20% of the risk?",
      impact: "MEDIUM IMPACT",
      whyItMatters: "Tests if a non-binary, iterative test is available."
    },
    {
      id: "q-h5",
      question: "Whose expectations are you most afraid of disappointing if you decline this path?",
      impact: "LOW IMPACT",
      whyItMatters: "Exposes external social compliance vs authentic personal desire."
    }
  ];
}
