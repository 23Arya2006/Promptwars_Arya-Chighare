import { ReasoningXRayResult } from '../types';

export const DEMO_SCENARIOS: { name: string; tag: string; description: string; data: ReasoningXRayResult }[] = [
  {
    name: "Internship vs College Schedule",
    tag: "Career & Academics",
    description: "Accepting a lucrative 6-month software internship that conflicts with lecture timetables.",
    data: {
      id: "demo-internship-1",
      decision: "Should I accept a 6-month internship with a good stipend even though it may affect my college schedule?",
      timestamp: new Date().toISOString(),
      isDemo: true,
      visibleReasons: [
        "High financial stipend ($1,200/mo) eases living costs",
        "Company office is only 20 minutes from my apartment",
        "Provides direct industry software engineering experience on my resume",
        "Allows networking with senior engineers"
      ],
      assumptions: [
        {
          id: "assump-1",
          statement: "Proximity automatically means the internship will be easier to balance with studies.",
          whyQuestionable: "Physical commute is only a minor fraction of cognitive fatigue. An intense 9-to-6 schedule consumes daily peak mental energy regardless of travel distance.",
          evidenceNeeded: "Typical daily work hours, on-call expectations, and cognitive load required by project deliverables.",
          stressScenario: "What if the internship is only 20 minutes away, but team deadlines regularly require 10+ hours per day at the desk?"
        },
        {
          id: "assump-2",
          statement: "College professors will easily accommodate missed mandatory lab sessions and attendance quotas.",
          whyQuestionable: "Department policy or individual professors may have zero-tolerance for proxy attendance or missed laboratory credits.",
          evidenceNeeded: "Official departmental attendance flexibility policy and written approval from course advisors.",
          stressScenario: "What if your department refuses exam hall tickets due to falling below the mandatory 75% lecture threshold?"
        },
        {
          id: "assump-3",
          statement: "The title and stipend will translate into an immediate high-value full-time conversion offer.",
          whyQuestionable: "Stipend size does not guarantee headcount availability or high return-offer conversion rates.",
          evidenceNeeded: "Historical intern-to-full-time conversion rate of this company's team over the past 2 cycles.",
          stressScenario: "What if company hiring freezes prevent any return offers regardless of your stellar performance?"
        }
      ],
      blindSpots: [
        {
          id: "bs-1",
          factor: "Mentorship & Code Review Quality",
          whyItMatters: "You may be assigned low-context bug fixes or isolated QA tasks without senior guidance, offering little real technical growth despite the brand name.",
          uncertainty: "This is unclear from the information provided. You may want to investigate the designated mentor's time allocation.",
          severity: "critical"
        },
        {
          id: "bs-2",
          factor: "Academic Opportunity Cost & GPA Impact",
          whyItMatters: "A significant GPA drop during your 3rd year can disqualify you from on-campus placements, competitive scholarships, or master's program requirements.",
          uncertainty: "One factor not yet addressed is whether your college offers credit substitution for accredited industrial internships.",
          severity: "critical"
        },
        {
          id: "bs-3",
          factor: "Burnout & Energy Cannibalization",
          whyItMatters: "Working 40+ hours alongside night studying eliminates restorative downtime, elevating risk of mid-semester cognitive exhaustion.",
          uncertainty: "You may want to verify your historical academic recovery time during high-stress periods.",
          severity: "moderate"
        },
        {
          id: "bs-4",
          factor: "Non-Compete and IP Ownership Clauses",
          whyItMatters: "Internship contracts often claim rights to all software you write during the period, potentially impacting personal side projects or hackathons.",
          uncertainty: "Contractual terms regarding intellectual property have not yet been evaluated.",
          severity: "exploratory"
        }
      ],
      conflicts: [
        {
          id: "conf-1",
          priority: "Maintaining a competitive Academic GPA above 3.7",
          reason: "Internship requires 40 hours/week on-site during standard semester class hours",
          conflict: "Your stated academic standard directly competes with the physical time commitment required on-site.",
          tensionScore: 9
        },
        {
          id: "conf-2",
          priority: "Maximizing long-term career trajectory",
          reason: "Prioritizing immediate monthly cash stipend over deep foundational systems coursework",
          conflict: "Trading foundational algorithmic/systems depth for short-term stipend might limit future tier-1 research or engineering opportunities.",
          tensionScore: 7
        }
      ],
      missingEvidence: [
        {
          id: "me-1",
          item: "Actual weekly working hours logged by former interns on this specific team",
          category: "Workload Reality",
          impactIfMissing: "High risk of underestimating time commitment"
        },
        {
          id: "me-2",
          item: "Official college syllabus exam dates vs company sprint deliverable deadlines",
          category: "Schedule Friction",
          impactIfMissing: "Critical scheduling clashes during mid-term and finals week"
        },
        {
          id: "me-3",
          item: "Historical intern-to-PPO (Pre-Placement Offer) conversion percentage",
          category: "ROI Validation",
          impactIfMissing: "Cannot determine if return offer premise is realistic"
        },
        {
          id: "me-4",
          item: "Written agreement with college HOD regarding attendance concessions",
          category: "Institutional Feasibility",
          impactIfMissing: "Possibility of semester debarment or academic penalty"
        }
      ],
      secondOrderEffects: [
        {
          id: "soe-1",
          initialTrigger: "Commitment to 40h/week on-site internship",
          step1: "Compressed night study hours and skipped recitation sessions",
          step2: "Cumulative exam preparation deficit before mid-terms",
          downstreamRisk: "Semester GPA drop leading to loss of academic standing or scholarship eligibility",
          probability: "likely"
        },
        {
          id: "soe-2",
          initialTrigger: "High early industry exposure on modern stack",
          step1: "Practical portfolio projects and senior engineer references",
          step2: "Stronger candidacy for top-tier off-campus tech roles next recruiting cycle",
          downstreamRisk: "Potential friction with academic advisor over delayed project submission",
          probability: "possible"
        }
      ],
      stakeholderLenses: [
        {
          id: "sh-1",
          stakeholder: "You",
          perspective: "Seeking practical resume validation, financial independence, and escape from purely theoretical lectures.",
          potentialBlindspot: "Underestimating the cumulative physical exhaustion of 50+ total weekly work/study hours.",
          keyConcern: "Will the day-to-day work actually teach me transferable software engineering principles?"
        },
        {
          id: "sh-2",
          stakeholder: "College / Education",
          perspective: "Enforces accreditation benchmarks, lecture attendance minimums, and consistent exam performance.",
          potentialBlindspot: "Viewing external work as an unauthorized distraction rather than legitimate career development.",
          keyConcern: "Is the student violating university attendance and examination regulations?"
        },
        {
          id: "sh-3",
          stakeholder: "Employer / Team",
          perspective: "Needs reliable ticket execution, sprint commitments, and dependable on-site presence.",
          potentialBlindspot: "Assuming student will prioritize company deadlines over unpredictable college assignments.",
          keyConcern: "Will exam periods disrupt project roadmap milestones?"
        },
        {
          id: "sh-4",
          stakeholder: "Future 5-Year Self",
          perspective: "Evaluates the compounding value of foundational knowledge vs early tactical industry experience.",
          potentialBlindspot: "Over-indexing on a temporary $1,200/mo stipend instead of multi-year career ceiling.",
          keyConcern: "Did this move set up high-leverage trajectories, or just provide early cash?"
        }
      ],
      highImpactQuestions: [
        {
          id: "q-1",
          question: "If the internship paid zero stipend but promised the exact same tasks and team, would you still take the risk to your college schedule?",
          impact: "HIGH IMPACT",
          whyItMatters: "Isolates whether your primary motivation is immediate money or genuine long-term learning value."
        },
        {
          id: "q-2",
          question: "What specific written assurances do you have from your department head regarding lab exemptions and attendance waivers?",
          impact: "HIGH IMPACT",
          whyItMatters: "Exposes whether institutional risk is currently managed or merely assumed."
        },
        {
          id: "q-3",
          question: "If this company gives you no full-time return offer at month 6, does the resume line alone justify the potential GPA drop?",
          impact: "HIGH IMPACT",
          whyItMatters: "Tests if the decision relies on an uncommitted downstream payoff."
        },
        {
          id: "q-4",
          question: "What is the team's typical policy when an intern needs 4 consecutive days off for university examinations?",
          impact: "MEDIUM IMPACT",
          whyItMatters: "Reveals organizational flexibility before you are contractually committed."
        },
        {
          id: "q-5",
          question: "Could you negotiate a 20h/week part-time or hybrid arrangement for the first 3 months to test workload compatibility?",
          impact: "LOW IMPACT",
          whyItMatters: "Explores risk-mitigation options rather than binary all-or-nothing acceptance."
        }
      ],
      reasoningSummary: "Your reasoning currently anchors strongly on immediate visible upside (stipend, short commute, resume bullet). However, it relies on unverified assumptions regarding departmental flexibility and mentor investment, while overlooking the compounding cost of academic deficit. The decision is entirely yours to make; resolving the 4 missing evidence points will clarify whether the trade-off aligns with your priorities.",
      userConfidence: 82,
      evidenceCoverage: 44,
      calibrationDelta: 38,
      calibrationStatus: "overconfident",
      calibrationAdvice: "Your confidence (82%) is significantly ahead of your verified evidence coverage (44%). This does not mean your decision is wrong; it indicates that several core operational premises (attendance waivers, team mentorship, conversion rates) are currently being assumed rather than verified."
    }
  },
  {
    name: "AI Startup Founder vs Big Tech",
    tag: "High Stakes Career",
    description: "Joining a seed-stage AI startup as a founding engineer vs accepting an L4 offer at a major tech company.",
    data: {
      id: "demo-startup-2",
      decision: "Should I join an early-stage AI startup as a founding engineer with 1.5% equity instead of accepting a stable Big Tech offer with a high base salary?",
      timestamp: new Date().toISOString(),
      isDemo: true,
      visibleReasons: [
        "Massive equity upside if the startup reaches Series B or acquisition",
        "Full architectural autonomy over the entire AI infra pipeline",
        "Steep learning curve compared to Big Tech corporate bureaucracy",
        "Passionate founders with strong previous technical backgrounds"
      ],
      assumptions: [
        {
          id: "assump-2-1",
          statement: "The startup's 14-month runway provides sufficient buffer to reach product-market fit and raise a Series A.",
          whyQuestionable: "AI startups burn capital rapidly on compute, model inference, and customer acquisition. 14 months can shrink to 7 months under real-world model fine-tuning costs.",
          evidenceNeeded: "Monthly net burn breakdown, compute credit reserves, and concrete pipeline conversion rates.",
          stressScenario: "What if model API and cloud infrastructure bills triple your monthly burn rate, shrinking runway to 5 months before Series A milestones are reached?"
        },
        {
          id: "assump-2-2",
          statement: "1.5% equity with standard 4-year vesting will not be heavily diluted in subsequent down-rounds.",
          whyQuestionable: "Early employee option pools often get compressed through aggressive investor liquidation preferences in challenging macroeconomic climates.",
          evidenceNeeded: "Cap table simulation under 20-30% dilution per future funding round and liquidation preference clauses.",
          stressScenario: "What if the company raises a flat down-round with 2x participating preferred shares, diminishing your 1.5% equity value to negligible returns?"
        }
      ],
      blindSpots: [
        {
          id: "bs-2-1",
          factor: "Distribution vs Technical Superiority",
          whyItMatters: "Building a technically impressive AI pipeline means nothing without enterprise sales distribution channels and customer retention.",
          uncertainty: "It is unclear from the information provided if the founders have enterprise enterprise GTM (Go-to-market) capability.",
          severity: "critical"
        },
        {
          id: "bs-2-2",
          factor: "Personal Liquidity & Emergency Buffer",
          whyItMatters: "Accepting a below-market base salary limits your personal emergency savings rate during unpredictable economic inflation.",
          uncertainty: "Your personal financial resilience under a sudden zero-income scenario has not been factored in.",
          severity: "moderate"
        }
      ],
      conflicts: [
        {
          id: "conf-2-1",
          priority: "Financial security to support family obligations in 2 years",
          reason: "Startup compensation is heavily backweighted to illiquid equity with 14-month cash runway",
          conflict: "Illiquid equity cannot service predictable near-term personal cash commitments.",
          tensionScore: 8
        }
      ],
      missingEvidence: [
        {
          id: "me-2-1",
          item: "Cap table structure, liquidation preference terms, and employee option exercise window length",
          category: "Legal & Equity Terms",
          impactIfMissing: "Risk of signing predatory option vesting clauses"
        },
        {
          id: "me-2-2",
          item: "Actual customer churn rate and organic ARR growth over the past 6 months",
          category: "Business Viability",
          impactIfMissing: "Cannot evaluate if product-market fit claims are accurate"
        }
      ],
      secondOrderEffects: [
        {
          id: "soe-2-1",
          initialTrigger: "Founding engineer role demanding 65+ hours weekly",
          step1: "High velocity execution leading to broad full-stack mastery",
          step2: "Accelerated technical reputation across the founder ecosystem",
          downstreamRisk: "High personal strain and potential relationship fatigue",
          probability: "likely"
        }
      ],
      stakeholderLenses: [
        {
          id: "sh-2-1",
          stakeholder: "You",
          perspective: "Craving impact, speed, and ownership over an entire technology stack.",
          potentialBlindspot: "Underestimating psychological toll of ongoing existential business risk.",
          keyConcern: "Will I look back on this as career acceleration or burnout?"
        },
        {
          id: "sh-2-2",
          stakeholder: "Future 5-Year Self",
          perspective: "Values either significant wealth creation or undisputed tier-1 technical pedigree.",
          potentialBlindspot: "Overvaluing title over actual company longevity.",
          keyConcern: "If the startup folds in 18 months, is the narrative strong enough for my next step?"
        }
      ],
      highImpactQuestions: [
        {
          id: "q-2-1",
          question: "If this startup ceases operations in 12 months with $0 return on equity, will the technical network and learnings have justified the lost Big Tech comp?",
          impact: "HIGH IMPACT",
          whyItMatters: "Tests worst-case downside tolerance without relying on financial optimism."
        },
        {
          id: "q-2-2",
          question: "What is the post-termination exercise window (PTEW) on your stock options if you choose to leave in 2 years?",
          impact: "HIGH IMPACT",
          whyItMatters: "A 90-day window can force you to forfeit all vested shares if you lack the cash to exercise."
        }
      ],
      reasoningSummary: "Your reasoning balances high autonomy and upside against career stability. The primary blindspot is confusing technological novelty with sustainable business distribution, alongside unexamined equity liquidation clauses. You maintain complete agency to decide your risk appetite.",
      userConfidence: 75,
      evidenceCoverage: 48,
      calibrationDelta: 27,
      calibrationStatus: "overconfident",
      calibrationAdvice: "Your confidence (75%) is moderately ahead of hard verified data (48%). Verifying the exact GTM sales traction and legal equity terms will protect you from uncalibrated assumptions."
    }
  },
  {
    name: "Product MVP Launch vs Delaying for Quality",
    tag: "Product & Strategy",
    description: "Deciding whether to launch a software product with known UI/UX flaws to capture early market timing.",
    data: {
      id: "demo-product-3",
      decision: "Should we publicly launch our B2B SaaS MVP next week with known onboarding glitches to beat a competitor, or delay 6 weeks for complete polish?",
      timestamp: new Date().toISOString(),
      isDemo: true,
      visibleReasons: [
        "Competitor is rumored to announce a similar tool at upcoming industry conference",
        "Core value-generating algorithmic feature is working reliably",
        "Early user feedback from a small test cohort of 5 beta testers was positive"
      ],
      assumptions: [
        {
          id: "assump-3-1",
          statement: "First-time public users will overlook messy onboarding if the core AI engine delivers value.",
          whyQuestionable: "B2B buyers have near-zero tolerance for onboarding friction; over 65% of enterprise SaaS trials drop off before reaching first value if signup fails.",
          evidenceNeeded: "Drop-off funnel metrics and session recording observations during unassisted user tests.",
          stressScenario: "What if 80% of your initial launch traffic bounces during step 2 of setup, creating lasting negative brand reputation?"
        }
      ],
      blindSpots: [
        {
          id: "bs-3-1",
          factor: "Customer Support Bandwidth & Burnout",
          whyItMatters: "Launching with known flaws generates a flood of repetitive support tickets that pulls engineering off core bugfixes.",
          uncertainty: "One factor not yet addressed is who handles live user triage during launch week.",
          severity: "critical"
        }
      ],
      conflicts: [
        {
          id: "conf-3-1",
          priority: "Positioning our brand as enterprise-grade and reliable",
          reason: "Rushing public release with acknowledged authentication and onboarding bugs",
          conflict: "Speed to market is conflicting with the brand value of enterprise trust.",
          tensionScore: 8
        }
      ],
      missingEvidence: [
        {
          id: "me-3-1",
          item: "Actual user retention curve from the 5-person beta after Day 7",
          category: "Engagement Data",
          impactIfMissing: "Sample size of 5 is statistically insignificant"
        }
      ],
      secondOrderEffects: [
        {
          id: "soe-3-1",
          initialTrigger: "Premature public launch with known rough edges",
          step1: "Spike in early signups followed by low Day-3 activation",
          step2: "Public criticism on social platforms and review aggregators",
          downstreamRisk: "Substantially harder to convince burnt prospects to retry the app 6 months later",
          probability: "likely"
        }
      ],
      stakeholderLenses: [
        {
          id: "sh-3-1",
          stakeholder: "You",
          perspective: "Urgent desire to validate market interest and prevent feeling scooped.",
          potentialBlindspot: "Fear of missing out overriding methodical execution.",
          keyConcern: "Are we reacting to competitor rumors rather than customer realities?"
        }
      ],
      highImpactQuestions: [
        {
          id: "q-3-1",
          question: "Can we do a private VIP rollout to 25 target customers under an 'Early Access' badge instead of a public splash launch?",
          impact: "HIGH IMPACT",
          whyItMatters: "Offers market speed without exposing the brand to unassisted public drop-off."
        }
      ],
      reasoningSummary: "Your reasoning is driven primarily by competitive urgency. The primary blindspot is underestimating the lasting reputation cost of poor first impressions among enterprise buyers. The strategic choice remains in your hands.",
      userConfidence: 70,
      evidenceCoverage: 52,
      calibrationDelta: 18,
      calibrationStatus: "calibrated",
      calibrationAdvice: "Reasonably calibrated, but testing a private alpha mitigates the binary launch dilemma."
    }
  }
];
