export interface GuideEntry {
  id: string;
  title: string;
  path: string;
  purpose: string;
  businessValue: string;
  aiFeatures: string[];
  bankingWorkflow: string[];
  judgeObservations: string[];
  estimatedTime: string;
  relatedPages: { label: string; path: string }[];
  recommendedNext: { label: string; path: string };
  tourOrder?: number;
  whyJudgeCares?: string;
  innovationHighlight?: string;
  simpleExplanation?: string;
  highlightSelector?: string;
  icon?: string;
}

export interface TourStep {
  pageId: string;
  title: string;
  description: string;
  simpleExplanation?: string;
  businessValue?: string;
  whyJudgeCares?: string;
  innovationHighlight?: string;
  estimatedTime?: string;
  highlightSelector?: string;
  path: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  path: string;
}

export interface AiTooltipData {
  label: string;
  description: string;
  dataSources: string[];
  confidence: number;
  businessMeaning: string;
}
