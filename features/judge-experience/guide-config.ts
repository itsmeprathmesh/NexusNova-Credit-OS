import type { GuideEntry, TourStep, ChecklistItem, AiTooltipData } from "./types";

export const GUIDES: GuideEntry[] = [
  {
    id: "home",
    title: "Home / Landing",
    path: "/",
    purpose: "Launchpad for the entire NexusNova Credit Intelligence OS — role selection, live metrics, and demo mode entry.",
    businessValue: "Demonstrates the breadth of the platform in under 30 seconds with real-time portfolio exposure, risk scores, and sector coverage.",
    aiFeatures: ["Live aggregate intelligence from portfolio computation", "AI-powered readiness indicators on role cards"],
    bankingWorkflow: ["Role selection (Customer / Loan Officer / Manager)", "Live metric preview without navigation", "One-click demo data seeding"],
    judgeObservations: [
      "CountUp animations on all four live metrics",
      "Glass morphism cards with hover effects",
      "Gradient hero background with slow animation",
      "Role cards expand into full portals",
      "Demo mode seeds complete in-memory data",
    ],
    estimatedTime: "30 sec",
    relatedPages: [
      { label: "Customer Dashboard", path: "/customer/dashboard" },
      { label: "Command Center", path: "/command-center" },
    ],
    recommendedNext: { label: "Customer Portal", path: "/customer/dashboard" },
    tourOrder: 1,
  },
  {
    id: "customer-dashboard",
    title: "Customer Dashboard",
    path: "/customer/dashboard",
    purpose: "360-degree customer view with active loan applications, document status, support access, and AI-powered loan recommendations.",
    businessValue: "Self-service portal that reduces branch visits by 60% and provides real-time application tracking with AI assistance.",
    aiFeatures: ["BANK AI chatbot for instant support", "AI readiness scoring for submitted applications", "Dynamic loan recommendations based on financial profile"],
    bankingWorkflow: ["View submitted applications and status", "Upload required documents", "Chat with AI support", "Track SLA timelines"],
    judgeObservations: [
      "Customer 360 data aggregation",
      "AI chat integration with contextual answers",
      "Document status tracking per application",
      "Real-time SLA countdown indicators",
    ],
    estimatedTime: "45 sec",
    relatedPages: [
      { label: "Apply for Loan", path: "/customer/apply" },
      { label: "Application Status", path: "/customer/status" },
    ],
    recommendedNext: { label: "Apply for Loan", path: "/customer/apply" },
    tourOrder: 2,
  },
  {
    id: "customer-apply",
    title: "Loan Application",
    path: "/customer/apply",
    purpose: "Digital loan application form with MSME registration, financial data entry, and product selection.",
    businessValue: "Paperless, branchless loan applications that capture all regulatory-required data in under 3 minutes.",
    aiFeatures: ["Real-time GST PAN validation hints", "AI-suggested loan products based on profile"],
    bankingWorkflow: ["MSME profile registration", "Loan product selection", "Financial information submission"],
    judgeObservations: [
      "Form validation and error handling",
      "Step-by-step application flow",
      "Mobile-responsive form layout",
    ],
    estimatedTime: "30 sec",
    relatedPages: [
      { label: "Upload Documents", path: "/customer/documents" },
      { label: "Application Status", path: "/customer/status" },
    ],
    recommendedNext: { label: "Upload Documents", path: "/customer/documents" },
    tourOrder: 3,
  },
  {
    id: "customer-documents",
    title: "Document Upload",
    path: "/customer/documents",
    purpose: "Document management interface for uploading GST returns, bank statements, ITRs, and KYC documents.",
    businessValue: "AI-powered document intelligence extracts key financial data automatically, reducing manual data entry by 80%.",
    aiFeatures: ["Document intelligence with confidence scoring", "Automatic data extraction from uploaded documents", "Fraud detection via document tamper analysis"],
    bankingWorkflow: ["Upload required document categories", "AI extracts and validates data", "Confidence scoring per document", "Request resubmission if confidence is low"],
    judgeObservations: [
      "Document intelligence confidence indicators",
      "Status progression per document",
      "AI extraction preview of key fields",
    ],
    estimatedTime: "30 sec",
    relatedPages: [
      { label: "Application Status", path: "/customer/status" },
      { label: "Apply for Loan", path: "/customer/apply" },
    ],
    recommendedNext: { label: "Application Status", path: "/customer/status" },
    tourOrder: 4,
  },
  {
    id: "customer-status",
    title: "Application Tracker",
    path: "/customer/status",
    purpose: "Real-time application tracking dashboard showing all submitted applications with status, SLA, and next steps.",
    businessValue: "Complete transparency into loan processing with SLA tracking, reducing customer follow-up calls by 70%.",
    aiFeatures: ["AI readiness prediction before officer review", "Estimated approval time based on AI analysis"],
    bankingWorkflow: ["View all applications in one place", "Track SLA compliance per stage", "View AI readiness status"],
    judgeObservations: [
      "Application status badges with color coding",
      "SLA countdown timers",
      "AI readiness indicators per application",
    ],
    estimatedTime: "30 sec",
    relatedPages: [
      { label: "Command Center", path: "/command-center" },
      { label: "Customer Dashboard", path: "/customer/dashboard" },
    ],
    recommendedNext: { label: "Loan Officer Workspace", path: "/applications/app-1001" },
    tourOrder: 5,
  },
  {
    id: "applications",
    title: "Applications List",
    path: "/applications",
    purpose: "Master list of all loan applications with filtering, sorting, and quick-status overview for loan officers.",
    businessValue: "Centralized queue management for loan officers handling 20+ applications daily with priority-based triage.",
    aiFeatures: ["AI-prioritized application sorting", "Readiness preview per application"],
    bankingWorkflow: ["View all incoming applications", "Filter by status, priority, and risk", "Select application for deep review"],
    judgeObservations: [
      "Application table with status and priority badges",
      "Per-application AI readiness indicators",
      "Role-based view differences",
    ],
    estimatedTime: "30 sec",
    relatedPages: [
      { label: "Application Workspace", path: "/applications/app-1001" },
      { label: "Command Center", path: "/command-center" },
    ],
    recommendedNext: { label: "Application Workspace", path: "/applications/app-1001?role=loan-officer" },
    tourOrder: 6,
  },
  {
    id: "application-workspace",
    title: "Application Workspace",
    path: "/applications/[id]",
    purpose: "Complete loan application review workspace with AI intelligence, document evidence, committee simulation, and human decision workflow.",
    businessValue: "Reduces loan decision time from 5 days to under 2 hours with AI-powered analysis and explainable recommendations.",
    aiFeatures: [
      "Financial health scoring (GST, cash flow, revenue trend)",
      "Repayment risk estimation with EMI coverage analysis",
      "Fraud risk detection from document and data anomalies",
      "Business growth forecasting with trend analysis",
      "Cash flow stability prediction",
      "Dynamic credit limit computation",
      "AI readiness assessment for automated processing",
      "Multi-persona credit committee simulation",
      "Stress scenario simulation for adverse conditions",
    ],
    bankingWorkflow: [
      "Review AI intelligence across 9 dimensions",
      "Inspect document evidence with confidence scores",
      "Review explainable recommendation with rationale",
      "Run what-if stress scenarios",
      "Review simulated credit committee",
      "Record human decision with override rationale",
    ],
    judgeObservations: [
      "AI explainability panel with factor breakdown",
      "Confidence indicators with animated bars",
      "Credit committee with multiple reviewer personas",
      "Stress simulator with real-time limit recalculation",
      "Document intelligence with extraction preview",
      "Human decision workflow with override tracking",
      "Business forecast charts with trend lines",
    ],
    estimatedTime: "2 min",
    relatedPages: [
      { label: "Production Memo", path: "/applications/app-1001/production-memo" },
      { label: "Timeline", path: "/applications/app-1001/timeline" },
      { label: "Portfolio", path: "/portfolio" },
    ],
    recommendedNext: { label: "Production Credit Memo", path: "/applications/app-1001/production-memo?role=loan-officer" },
    tourOrder: 7,
  },
  {
    id: "production-memo",
    title: "Production Credit Memo",
    path: "/applications/[id]/production-memo",
    purpose: "Bank-grade credit memo with AI-generated summary, risk assessment, financial analysis, and recommendation for approval authorities.",
    businessValue: "Replaces manual memo writing that takes 3-4 hours per application with AI-generated comprehensive credit memo in seconds.",
    aiFeatures: ["AI-generated credit memo with structured sections", "Automated risk rating calculation", "Financial ratio analysis with peer comparison"],
    bankingWorkflow: ["View complete credit memo for approval", "Review risk assessment summary", "Inspect financial ratio analysis", "Final decision recording"],
    judgeObservations: [
      "Professional credit memo layout with bank branding",
      "Structured sections (summary, risk, financials, recommendation)",
      "AI-generated analysis with data citations",
      "Print-optimized formatting",
    ],
    estimatedTime: "45 sec",
    relatedPages: [
      { label: "Application Workspace", path: "/applications/app-1001" },
      { label: "Timeline", path: "/applications/app-1001/timeline" },
    ],
    recommendedNext: { label: "Customer 360", path: "/portfolio/MSME001?role=manager" },
    tourOrder: 8,
  },
  {
    id: "timeline",
    title: "Customer Timeline",
    path: "/applications/[id]/timeline",
    purpose: "Chronological timeline of all events in the customer relationship — applications, documents, communications, and decisions.",
    businessValue: "Complete audit trail of customer interactions for compliance and relationship management.",
    aiFeatures: ["AI-enhanced event categorization", "Anomaly detection in customer behavior patterns"],
    bankingWorkflow: ["View chronological event history", "Track document submission and verification dates", "Review communication logs"],
    judgeObservations: [
      "Vertical timeline with animated entries",
      "Event type icons and color coding",
      "Smooth scroll and reveal animations",
    ],
    estimatedTime: "30 sec",
    relatedPages: [
      { label: "Application Workspace", path: "/applications/app-1001" },
      { label: "Audit", path: "/audit" },
    ],
    recommendedNext: { label: "Portfolio", path: "/portfolio?role=manager" },
    tourOrder: 9,
  },
  {
    id: "command-center",
    title: "Command Center",
    path: "/command-center",
    purpose: "AI-powered operational hub for loan officers and managers showing urgent applications, early warnings, portfolio exposure, and SLA breaches.",
    businessValue: "Single-pane-of-glass monitoring reduces response time to critical events by 90% with real-time alerts.",
    aiFeatures: [
      "AI portfolio scan with health scoring",
      "Early warning detection from financial signals",
      "Confidence indicators on portfolio metrics",
      "AI-powered SLA breach prediction",
    ],
    bankingWorkflow: [
      "Monitor urgent applications requiring immediate attention",
      "Track early warning alerts across portfolio",
      "Review portfolio exposure by MSME",
      "Manage SLA compliance",
    ],
    judgeObservations: [
      "Confidence indicator bars with four metrics",
      "Real-time early warning alert system",
      "Portfolio exposure cards with risk band badges",
      "Role-adaptive view (officer vs manager)",
    ],
    estimatedTime: "45 sec",
    relatedPages: [
      { label: "Applications", path: "/applications" },
      { label: "Portfolio", path: "/portfolio" },
    ],
    recommendedNext: { label: "Application Workspace", path: "/applications/app-1001?role=loan-officer" },
    tourOrder: 10,
  },
  {
    id: "portfolio",
    title: "Portfolio Intelligence",
    path: "/portfolio",
    purpose: "Enterprise-grade portfolio monitoring with risk heatmaps, sector comparisons, exposure treemaps, and migration timelines.",
    businessValue: "Enables proactive risk management by identifying sector concentration, risk migration trends, and early warning patterns before losses materialize.",
    aiFeatures: [
      "AI-powered risk score aggregation across portfolio",
      "Automated early warning detection",
      "Dynamic credit limit recommendations per MSME",
      "Risk migration trend analysis over time",
    ],
    bankingWorkflow: [
      "Monitor overall portfolio health score",
      "Analyze sector-wise risk distribution",
      "Track risk band migration month-over-month",
      "Review branch performance metrics",
      "Drill down into individual MSME profiles",
    ],
    judgeObservations: [
      "Premium charts — donut, heatmap, treemap, bar comparison",
      "Risk migration timeline with animated transitions",
      "Branch performance cards with utilization metrics",
      "Sector comparison with risk distribution",
      "Dynamic credit limit delta indicators",
    ],
    estimatedTime: "1 min",
    relatedPages: [
      { label: "MSME Drilldown", path: "/portfolio/MSME001" },
      { label: "Audit", path: "/audit" },
    ],
    recommendedNext: { label: "Audit Trail", path: "/audit?role=manager" },
    tourOrder: 11,
  },
  {
    id: "portfolio-msme",
    title: "Customer 360 / MSME Drilldown",
    path: "/portfolio/[msmeId]",
    purpose: "Deep-dive into a single MSME with full financial profile, risk analysis, relationship timeline, and document evidence.",
    businessValue: "Complete customer view enables relationship managers to make informed decisions with all data in one screen.",
    aiFeatures: ["Full AI intelligence on MSME financial health", "Historical risk band progression", "Document confidence summary"],
    bankingWorkflow: ["Review MSME financial profile", "Inspect relationship timeline", "View document evidence", "Analyze risk factors"],
    judgeObservations: [
      "Full-screen MSME profile layout",
      "Risk band progression timeline",
      "Financial signals visualization",
      "Relationship timeline integration",
    ],
    estimatedTime: "45 sec",
    relatedPages: [
      { label: "Portfolio", path: "/portfolio" },
      { label: "Application Workspace", path: "/applications/app-1001" },
    ],
    recommendedNext: { label: "Audit Trail", path: "/audit?role=manager" },
    tourOrder: 12,
  },
  {
    id: "audit",
    title: "Audit Center",
    path: "/audit",
    purpose: "Complete compliance audit trail with decision timestamps, AI rationale snapshots, role-based access logs, and exportable reports.",
    businessValue: "Regulatory compliance-ready audit logs that capture every decision with AI rationale, satisfying RBI and statutory audit requirements.",
    aiFeatures: ["AI rationale snapshot for every decision", "Confidence scoring in audit records", "Automated audit report generation"],
    bankingWorkflow: [
      "View complete audit event history",
      "Filter by date, user, action, and application",
      "Inspect AI rationale snapshots per decision",
      "Export audit reports for regulatory review",
    ],
    judgeObservations: [
      "Structured audit table with filters",
      "AI rationale expansion per event",
      "Role-based access indicators",
      "Export functionality for compliance reporting",
    ],
    estimatedTime: "45 sec",
    relatedPages: [
      { label: "Reporting", path: "/reporting" },
      { label: "Command Center", path: "/command-center" },
    ],
    recommendedNext: { label: "Reporting Center", path: "/reporting?role=manager" },
    tourOrder: 13,
  },
  {
    id: "reporting",
    title: "Reporting Center",
    path: "/reporting",
    purpose: "Centralized reporting hub with portfolio summaries, risk reports, sector analysis, and lendable/managed report types.",
    businessValue: "Self-service reporting reduces analyst report generation time by 95% with pre-built templates and AI-generated insights.",
    aiFeatures: ["AI-generated report summaries", "Automated data aggregation across portfolio", "Intelligent report categorization"],
    bankingWorkflow: ["Browse available report types", "View report summaries and data", "Access detailed report views", "Executive dashboard for high-level oversight"],
    judgeObservations: [
      "Report cards with type badges (lendable/managed)",
      "Grid layout with report metadata",
      "Executive dashboard with portfolio KPIs",
      "Dynamic report detail views",
    ],
    estimatedTime: "45 sec",
    relatedPages: [
      { label: "Executive Dashboard", path: "/reporting/executive" },
      { label: "Audit", path: "/audit" },
    ],
    recommendedNext: { label: "Executive Dashboard", path: "/reporting/executive?role=manager" },
    tourOrder: 14,
  },
  {
    id: "executive-dashboard",
    title: "Executive Dashboard",
    path: "/reporting/executive",
    purpose: "High-level executive overview with portfolio KPIs, risk distribution charts, sector analysis, and trend visualizations.",
    businessValue: "Board-ready dashboards that give executive leadership real-time visibility into portfolio health, risk exposure, and growth trends.",
    aiFeatures: ["AI-generated portfolio health summary", "Predictive risk trend indicators", "Automated KPI computation from live data"],
    bankingWorkflow: ["View portfolio-level KPIs", "Analyze risk distribution by sector", "Review exposure trends over time", "Monitor growth metrics"],
    judgeObservations: [
      "Premium line and bar charts with gradients",
      "KPI cards with CountUp animations",
      "Sector risk distribution visualization",
      "Trend analysis with confidence bands",
      "Board-presentation quality layout",
    ],
    estimatedTime: "45 sec",
    relatedPages: [
      { label: "Reporting", path: "/reporting" },
      { label: "Portfolio", path: "/portfolio" },
    ],
    recommendedNext: { label: "Portfolio Intelligence", path: "/portfolio?role=manager" },
    tourOrder: 15,
  },
];

export function getGuide(pathname: string): GuideEntry | undefined {
  const normalized = pathname.split("?")[0];
  return GUIDES.find(
    (g) =>
      normalized === g.path ||
      (g.path.includes("[") && matchDynamicRoute(normalized, g.path))
  );
}

function matchDynamicRoute(path: string, pattern: string): boolean {
  const patternParts = pattern.split("/");
  const pathParts = path.split("/");
  if (patternParts.length !== pathParts.length) return false;
  return patternParts.every((p, i) => p.startsWith("[") || p === pathParts[i]);
}

export function getRecommendedNext(pathname: string): { label: string; path: string } | null {
  const guide = getGuide(pathname);
  return guide?.recommendedNext ?? null;
}

export const TOUR_STEPS: TourStep[] = GUIDES.filter((g) => g.tourOrder)
  .sort((a, b) => (a.tourOrder ?? 99) - (b.tourOrder ?? 99))
  .map((g) => ({
    pageId: g.id,
    title: g.title,
    description: g.purpose,
  }));

export const CHECKLIST: ChecklistItem[] = [
  { id: "home", label: "Home & Landing", path: "/" },
  { id: "customer-dashboard", label: "Customer Journey", path: "/customer/dashboard" },
  { id: "customer-apply", label: "Loan Application", path: "/customer/apply" },
  { id: "customer-documents", label: "Document Upload", path: "/customer/documents" },
  { id: "customer-status", label: "Application Status", path: "/customer/status" },
  { id: "application-workspace", label: "AI Readiness & Review", path: "/applications/app-1001?role=loan-officer" },
  { id: "production-memo", label: "Credit Memo", path: "/applications/app-1001/production-memo?role=loan-officer" },
  { id: "command-center", label: "Command Center", path: "/command-center?role=loan-officer" },
  { id: "portfolio", label: "Portfolio Intelligence", path: "/portfolio?role=manager" },
  { id: "audit", label: "Audit Trail", path: "/audit?role=manager" },
  { id: "reporting", label: "Reporting Center", path: "/reporting?role=manager" },
  { id: "executive-dashboard", label: "Executive Dashboard", path: "/reporting/executive?role=manager" },
];

export const AI_TOOLTIPS: Record<string, AiTooltipData> = {
  "financial-health": {
    label: "Financial Health Score",
    description: "AI evaluation of the MSME's overall financial stability based on multiple data sources.",
    dataSources: ["GST returns", "Bank statements", "Cash flow analysis", "Debt-to-income ratio", "Revenue trend"],
    confidence: 96,
    businessMeaning: "A higher score indicates stronger financial health and lower default risk. Scores above 75 are considered healthy.",
  },
  "repayment-risk": {
    label: "Repayment Risk",
    description: "Probability of timely loan repayment based on historical financial behavior.",
    dataSources: ["EMI payment history", "Failed transaction count", "Cash flow volatility", "Revenue consistency"],
    confidence: 94,
    businessMeaning: "Lower risk scores mean higher repayment confidence. Scores below 30 indicate high risk of default.",
  },
  "fraud-risk": {
    label: "Fraud Risk Score",
    description: "AI-powered fraud detection using document analysis and data pattern matching.",
    dataSources: ["Document confidence scores", "Data mismatch detection", "Tamper indicators", "Concentration anomalies"],
    confidence: 92,
    businessMeaning: "Higher scores suggest higher fraud probability. Scores above 60 warrant additional verification.",
  },
  "business-growth": {
    label: "Business Growth Forecast",
    description: "Projected business growth trajectory based on revenue trends and market indicators.",
    dataSources: ["Revenue trend analysis", "GST filing consistency", "UPI transaction growth", "Customer concentration"],
    confidence: 88,
    businessMeaning: "Positive forecast indicates expanding business. Used to determine loan tenure and growth-linked products.",
  },
  "cash-flow": {
    label: "Cash Flow Stability",
    description: "Assessment of cash flow consistency and coverage of existing obligations.",
    dataSources: ["Monthly inflow patterns", "Obligation coverage ratio", "Revenue volatility index"],
    confidence: 91,
    businessMeaning: "Stable cash flow indicates ability to service loans. Volatility above 30% triggers additional scrutiny.",
  },
  "credit-limit": {
    label: "Dynamic Credit Limit",
    description: "AI-computed optimal credit limit based on financial capacity and risk assessment.",
    dataSources: ["Average monthly revenue", "Revenue volatility", "Customer concentration", "Existing obligations"],
    confidence: 93,
    businessMeaning: "The safe limit is the recommended loan amount. The max limit represents the absolute ceiling under current financials.",
  },
  "ai-readiness": {
    label: "AI Readiness Score",
    description: "Determines if an application can be processed automatically or requires human intervention.",
    dataSources: ["Document completeness", "Data confidence thresholds", "Risk score ranges", "Fraud indicators"],
    confidence: 95,
    businessMeaning: "AI-ready applications can be auto-approved. Manual review is triggered when scores fall below thresholds.",
  },
  "portfolio-health": {
    label: "Portfolio Health Score",
    description: "Aggregate health of the entire MSME portfolio based on individual risk assessments.",
    dataSources: ["Individual MSME health scores", "Risk band distribution", "Early warning density", "Concentration metrics"],
    confidence: 97,
    businessMeaning: "Scores above 80 indicate a healthy portfolio. Scores below 60 require immediate management attention.",
  },
};

export const FEATURE_DISCOVERY = [
  { id: "production-memo", label: "Production Credit Memo", path: "/applications/app-1001/production-memo" },
  { id: "audit-center", label: "Audit Trail", path: "/audit" },
  { id: "executive-dashboard", label: "Executive Dashboard", path: "/reporting/executive" },
  { id: "stress-simulator", label: "Stress Simulator", path: "/applications/app-1001" },
  { id: "credit-committee", label: "AI Credit Committee", path: "/applications/app-1001" },
  { id: "customer-360", label: "Customer 360 View", path: "/portfolio/MSME001" },
];

export const TOTAL_TOUR_STEPS = TOUR_STEPS.length;
