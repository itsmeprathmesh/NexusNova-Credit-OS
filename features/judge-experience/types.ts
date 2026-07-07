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
}

export interface TourStep {
  pageId: string;
  title: string;
  description: string;
  highlightSelector?: string;
  position?: "top" | "bottom" | "left" | "right" | "center";
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
