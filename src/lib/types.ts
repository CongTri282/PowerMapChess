export interface Metrics {
  gdp: number;
  nationalSecurity: number;
}

export interface Decision {
  id: string;
  text: string;
  outcome: Metrics;
  lesson: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  decisions: Decision[];
}

export interface PolicySuggestion {
  suggestedPolicies: string;
  justifications: string;
}

export interface AiLogEntry {
    id: string;
    timestamp: string;
    toolName: string;
    description: string;
    input: string;
    output: string;
    justification: string;
}

// Firestore types
export interface ScenarioOption {
  text: string;
  effects: {
    gdp: number;
    anNinh: number;
    doiMoi?: number;
    loiIchDanToc?: number; // Support both field names
  };
}

export interface FirestoreScenario {
  id: string;
  title: string;
  description: string;
  options: {
    A: ScenarioOption;
    B: ScenarioOption;
  };
}

export interface FirestorePoll {
  votes_A: number;
  votes_B: number;
}