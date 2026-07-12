"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Upload,
  RefreshCw,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  FileSearch,
  Ban,
  FileX2,
  Image,
  Fingerprint,
  Replace,
  History,
  ChevronDown,
  ChevronUp,
  ArrowUpFromLine,
  Building2,
  Smartphone,
  Building,
  Landmark,
  Users,
  Lightbulb,
  Briefcase,
  IdCard,
  UserCheck,
  FileSpreadsheet,
  Info,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import {
  demoDocuments,
  uploadTimeline,
  type CustomerDocument,
  type DocStatus,
  type CustomerDocType,
  formatDocStatus,
  getStatusBadgeTone,
  simulateUpload,
  simulateReplace,
} from "@/services/demo-documents";

const docIcons: Record<string, typeof FileText> = {
  "GST Returns": FileText,
  "UPI Statement": Smartphone,
  "Account Aggregator Consent": Building,
  "Bank Statement": Landmark,
  "EPFO Records": Users,
  "Utility Bills": Lightbulb,
  "Business Registration": Briefcase,
  "PAN": IdCard,
  "Aadhaar": UserCheck,
  "ITR (Optional)": FileSpreadsheet,
};

const STATUS_ICONS: Record<DocStatus, typeof CheckCircle2> = {
  missing: Clock,
  uploaded: Upload,
  "ai-verified": CheckCircle2,
  "needs-review": AlertTriangle,
  rejected: XCircle,
};

const STATUS_COLORS: Record<DocStatus, string> = {
  missing: "text-muted",
  uploaded: "text-trust",
  "ai-verified": "text-growth",
  "needs-review": "text-caution",
  rejected: "text-danger",
};

const STATUS_BG: Record<DocStatus, string> = {
  missing: "bg-white/[0.02] border-white/[0.06]",
  uploaded: "bg-trust-light/20 border-trust/20",
  "ai-verified": "bg-growth/10 border-growth/20",
  "needs-review": "bg-caution-light/20 border-caution/20",
  rejected: "bg-danger/10 border-danger/20",
};

function VerificationMeter({ value, label }: { value: number; label: string }) {
  const color = value >= 90 ? "bg-growth" : value >= 70 ? "bg-trust" : value >= 50 ? "bg-caution" : "bg-danger";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] text-muted">{label}</span>
          <span className="text-[10px] font-medium text-ink">{value}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            className={`h-full rounded-full ${color}`}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: DocStatus }) {
  const Icon = STATUS_ICONS[status];
  return <Icon className={cn("h-5 w-5", STATUS_COLORS[status])} />;
}

function DocumentActions({
  doc,
  onUpload,
  onReplace,
}: {
  doc: CustomerDocument;
  onUpload: () => void;
  onReplace: () => void;
}) {
  if (doc.status === "missing") {
    return (
      <button
        onClick={onUpload}
        className="inline-flex items-center gap-1.5 rounded-lg bg-trust px-3 py-1.5 text-xs font-semibold text-canvas transition-all hover:bg-trust/90 active:scale-[0.97]"
      >
        <ArrowUpFromLine className="h-3.5 w-3.5" />
        Upload
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <button
        onClick={onReplace}
        className="inline-flex items-center gap-1 rounded-lg border border-white/[0.1] bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-medium text-muted transition-all hover:bg-white/[0.08] hover:text-ink active:scale-[0.97]"
      >
        <Replace className="h-3 w-3" />
        Replace
      </button>
      <button
        className="inline-flex items-center gap-1 rounded-lg border border-white/[0.1] bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-medium text-muted transition-all hover:bg-white/[0.08] hover:text-ink active:scale-[0.97]"
        title="Download file"
      >
        <Download className="h-3 w-3" />
      </button>
      <button
        className="inline-flex items-center gap-1 rounded-lg border border-white/[0.1] bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-medium text-muted transition-all hover:bg-white/[0.08] hover:text-ink active:scale-[0.97]"
        title="Preview file"
      >
        <Eye className="h-3 w-3" />
      </button>
    </div>
  );
}

function AiVerificationPanel({ doc }: { doc: CustomerDocument }) {
  const [expanded, setExpanded] = useState(false);
  const v = doc.verification;
  const hasIssues = v.forgeryDetected || v.missingPages > 0 || v.blurDetected || !v.metadataValid;

  if (doc.status === "missing") {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-3.5 w-3.5 text-trust" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-trust/80">AI Recommendation</span>
        </div>
        <p className="text-xs text-muted leading-relaxed">
          {doc.verification.recommendations.join(" ")}
        </p>
        {doc.type === "ITR (Optional)" && (
          <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-trust/10 bg-trust-light/20 p-2">
            <Info className="h-3 w-3 text-trust" />
            <span className="text-[10px] text-trust">Uploading ITR may improve loan terms.</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border p-3", hasIssues ? "border-caution/20 bg-caution-light/10" : "border-growth/10 bg-growth/[0.03]")}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className={cn("h-3.5 w-3.5", hasIssues ? "text-caution" : "text-growth")} />
          <span className={cn("text-[10px] font-semibold uppercase tracking-wider", hasIssues ? "text-caution/80" : "text-growth/80")}>
            AI Verification
          </span>
        </div>
        {expanded ? <ChevronUp className="h-3.5 w-3.5 text-muted" /> : <ChevronDown className="h-3.5 w-3.5 text-muted" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 space-y-2.5 overflow-hidden"
          >
            <VerificationMeter value={v.ocrConfidence} label="OCR Confidence" />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <Fingerprint className="h-3 w-3 text-muted" />
                <span className="text-muted">Forgery Detection:</span>
                <span className={v.forgeryDetected ? "font-semibold text-danger" : "font-semibold text-growth"}>
                  {v.forgeryDetected ? "Suspicious" : "Clean"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <FileX2 className="h-3 w-3 text-muted" />
                <span className="text-muted">Missing Pages:</span>
                <span className={v.missingPages > 0 ? "font-semibold text-caution" : "font-semibold text-growth"}>
                  {v.missingPages > 0 ? `${v.missingPages} page(s) missing` : "None"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Image className="h-3 w-3 text-muted" />
                <span className="text-muted">Blur Detection:</span>
                <span className={v.blurDetected ? "font-semibold text-caution" : "font-semibold text-growth"}>
                  {v.blurDetected ? "Blur detected" : "Clear"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <FileSearch className="h-3 w-3 text-muted" />
                <span className="text-muted">Metadata Validation:</span>
                <span className={v.metadataValid ? "font-semibold text-growth" : "font-semibold text-caution"}>
                  {v.metadataValid ? "Valid" : "Issues found"}
                </span>
              </div>
            </div>

            {v.recommendations.length > 0 && (
              <div className="mt-2 space-y-1">
                <span className="text-[10px] font-semibold text-muted">AI Recommendations</span>
                {v.recommendations.map((r, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[10px] leading-relaxed text-muted">
                    <span className="mt-0.5 block h-1 w-1 shrink-0 rounded-full bg-trust" />
                    {r}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DocumentCard({
  doc,
  index,
  onUpload,
}: {
  doc: CustomerDocument;
  index: number;
  onUpload: () => void;
}) {
  const Icon = docIcons[doc.type] || FileText;
  const isVerified = doc.status === "ai-verified";
  const isMissing = doc.status === "missing";
  const isRejected = doc.status === "rejected";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={cn("rounded-2xl border p-4 transition-all duration-200", STATUS_BG[doc.status])}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
          isVerified ? "bg-growth/10 text-growth" :
          isRejected ? "bg-danger/10 text-danger" :
          isMissing ? "bg-white/[0.04] text-muted" :
          "bg-trust-light/30 text-trust"
        )}>
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-ink">{doc.type}</h3>
            <Badge tone={getStatusBadgeTone(doc.status)} pill>
              <span className="flex items-center gap-1">
                <StatusIcon status={doc.status} />
                {formatDocStatus(doc.status)}
              </span>
            </Badge>
            {!doc.required && (
              <Badge tone="neutral" pill>Optional</Badge>
            )}
          </div>

          <p className="mt-1 text-xs text-muted leading-relaxed">{doc.description}</p>

          {!isMissing && (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted">
              <span className="truncate max-w-[160px]">{doc.fileName}</span>
              <span>{doc.fileSize}</span>
              {doc.lastUpdated && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTimeAgo(doc.lastUpdated)}
                </span>
              )}
            </div>
          )}

          <div className="mt-3">
            <AiVerificationPanel doc={doc} />
          </div>
        </div>

        <div className="flex shrink-0 items-start">
          <DocumentActions doc={doc} onUpload={onUpload} onReplace={onUpload} />
        </div>
      </div>
    </motion.div>
  );
}

function UploadTimeline() {
  const [expanded, setExpanded] = useState(false);
  const recent = expanded ? uploadTimeline : uploadTimeline.slice(0, 5);

  return (
    <GlassPanel variant="strong" className="p-5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-trust-light/30 text-trust">
            <History className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">Upload Timeline</h3>
            <p className="text-xs text-muted">{uploadTimeline.length} events recorded</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted" /> : <ChevronDown className="h-4 w-4 text-muted" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 space-y-1"
          >
            {recent.map((event) => {
              const Icon = docIcons[event.documentType] || FileText;
              const actionColor = event.action === "verified" ? "text-growth" :
                event.action === "rejected" ? "text-danger" :
                event.action === "review-requested" ? "text-caution" : "text-trust";
              const actionLabel = event.action === "uploaded" ? "Uploaded" :
                event.action === "replaced" ? "Replaced" :
                event.action === "verified" ? "Verified" :
                event.action === "rejected" ? "Rejected" : "Review Needed";

              return (
                <div key={event.id} className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.01] px-3 py-2.5">
                  <div className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-lg", actionColor.replace("text-", "bg-").replace("growth", "growth/10").replace("danger", "danger/10").replace("caution", "caution-light/30").replace("trust", "trust-light/30"))}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-ink">{event.documentType}</span>
                      <span className={cn("text-[10px] font-semibold", actionColor)}>{actionLabel}</span>
                    </div>
                    <p className="text-[10px] text-muted mt-0.5">{event.detail}</p>
                  </div>
                  <span className="shrink-0 text-[10px] text-muted">{formatTimeAgo(event.timestamp)}</span>
                </div>
              );
            })}
            {!expanded && uploadTimeline.length > 5 && (
              <button
                onClick={() => setExpanded(true)}
                className="mt-2 flex items-center gap-1 text-[10px] font-medium text-trust transition-colors hover:text-trust/80"
              >
                View all {uploadTimeline.length} events <ChevronDown className="h-3 w-3" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </GlassPanel>
  );
}

function formatTimeAgo(iso: string): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function DocumentUploadCenter() {
  const [documents, setDocuments] = useState(demoDocuments);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = documents.length;
    const verified = documents.filter((d) => d.status === "ai-verified").length;
    const uploaded = documents.filter((d) => d.status === "uploaded" || d.status === "needs-review").length;
    const missing = documents.filter((d) => d.status === "missing").length;
    const rejected = documents.filter((d) => d.status === "rejected").length;
    const requiredVerified = documents.filter((d) => d.required && d.status === "ai-verified").length;
    const requiredTotal = documents.filter((d) => d.required).length;
    const progress = Math.round((requiredVerified / requiredTotal) * 100);
    return { total, verified, uploaded, missing, rejected, requiredVerified, requiredTotal, progress };
  }, [documents]);

  const handleUpload = (docId: string) => {
    setUploadingDoc(docId);
    setTimeout(() => {
      const updated = documents.map((d) => {
        if (d.id === docId) {
          if (d.status === "missing") return simulateUpload(d.type) ?? d;
          return simulateReplace(d.type) ?? d;
        }
        return d;
      });
      setDocuments([...updated]);
      setUploadingDoc(null);
    }, 1200);
  };

  return (
    <div className="space-y-5">
      <GlassPanel variant="strong" className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-trust-light text-trust">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ink">Document Upload Center</h1>
              <p className="mt-1 text-sm text-muted leading-relaxed">
                Upload traditional and alternate data documents for AI-powered verification.
                Our AI extracts key data automatically — no manual re-entry required.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-trust/20 bg-trust-light/20 px-4 py-3">
            <div className="text-center">
              <p className="text-lg font-bold text-trust">{stats.progress}%</p>
              <p className="text-[10px] text-muted">Complete</p>
            </div>
            <div className="h-8 w-px bg-white/[0.08]" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
              <span className="text-growth">{stats.verified} Verified</span>
              <span className="text-trust">{stats.uploaded} Uploaded</span>
              <span className="text-muted">{stats.missing} Missing</span>
              <span className="text-danger">{stats.rejected} Rejected</span>
            </div>
          </div>
        </div>
      </GlassPanel>

      <div className="flex items-center gap-2 rounded-xl border border-trust/20 bg-trust-light/20 px-4 py-3">
        <Sparkles className="h-4 w-4 shrink-0 text-trust" />
        <span className="text-xs text-muted leading-relaxed">
          AI actively verifies each document. OCR confidence, forgery detection, and metadata validation
          are performed automatically. Documents flagged for review require your attention.
        </span>
      </div>

      <div className="space-y-3">
        {documents.map((doc, i) => (
          <div key={doc.id} className={cn(uploadingDoc === doc.id && "pointer-events-none opacity-70 transition-opacity")}>
            {uploadingDoc === doc.id ? (
              <div className="rounded-2xl border border-trust/20 bg-trust-light/10 p-4">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 animate-spin text-trust" />
                  <div>
                    <p className="text-sm font-semibold text-ink">Uploading {doc.type}...</p>
                    <p className="text-xs text-muted">AI verification will begin automatically</p>
                  </div>
                </div>
              </div>
            ) : (
              <DocumentCard doc={doc} index={i} onUpload={() => handleUpload(doc.id)} />
            )}
          </div>
        ))}
      </div>

      <UploadTimeline />
    </div>
  );
}
