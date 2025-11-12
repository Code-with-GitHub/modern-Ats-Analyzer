
export interface PerformanceMetric {
  metricName: string;
  score: number;
  explanation: string;
}

export interface AtsChecklistItem {
  checklistItem: string;
  isCompatible: boolean;
  reasoning: string;
}

export interface AnalysisResult {
  overallScore: number;
  executiveSummary: string;
  topStrengths: string[];
  mainImprovements: string[];
  performanceMetrics: PerformanceMetric[];
  atsCompatibilityChecklist: AtsChecklistItem[];
  recommendedKeywords: string[];
}

export enum AuthState {
  LOGGED_OUT,
  LOGIN,
  SIGNUP,
  LOGGED_IN,
}

export enum AppStatus {
  IDLE,
  ANALYZING,
  SUCCESS,
  ERROR,
}
