"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bell, Bot, CheckCircle2, Clock, FileWarning, IndianRupee } from "lucide-react";
import { applications, documents, financialSignals, msmes } from "@/data/mock-data";
import { calculateCustomerReadiness } from "@/services/customer-support";
import { calculateAiReadiness } from "@/services/intelligence";
import { getUnreadCount, getSession } from "@/services/app-data";
import { formatCurrency } from "@/lib/format";
import { Badge, Button, Metric, Panel, ProgressBar } from "@/components/ui/primitives";
import { AiReadinessView } from "./ai-readiness-view";
import { NotificationCenter } from "./notification-center";
import { CustomerTimeline } from "./customer-timeline";

const application = applications[0];
const msme = msmes.find((item) => item.id === application.msmeId)!;
const signals = financialSignals.find((item) => item.msmeId === msme.id)!;
const applicationDocuments = documents.filter((document) => document.applicationId === application.id);

export function CustomerDashboard() {
  const [showNotifications, setShowNotifications] = useState(false);
  const session = getSession();
  const readiness = calculateCustomerReadiness(application, applicationDocuments, signals);
  const aiReadiness = calculateAiReadiness(application.id);
  const unreadCount = useMemo(() => getUnreadCount(), []);

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-trust p-5 text-white shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold opacity-80">
              Welcome back{session.registration ? `, ${session.registration.ownerName}` : ""}
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight">{msme.name}</h1>
          </div>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl bg-white/12 p-3 transition hover:bg-white/20"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
        <p className="mt-3 text-sm leading-6 text-white/80">
          Your working capital application is under bank review. Complete remaining items to improve readiness.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link href="/customer/documents" className="rounded-xl bg-white/12 p-4 text-sm font-semibold transition hover:bg-white/20">
            Upload documents
          </Link>
          <Link href="/customer/support" className="rounded-xl bg-white/12 p-4 text-sm font-semibold transition hover:bg-white/20">
            Ask BANK AI
          </Link>
        </div>
      </section>

      {showNotifications && <NotificationCenter />}

      <div className="grid gap-4 md:grid-cols-3">
        <Panel>
          <Metric label="Requested Loan" value={formatCurrency(application.requestedAmount)} />
        </Panel>
        <Panel>
          <Metric label="Estimated Eligible" value={formatCurrency(readiness.estimatedEligibleAmount)} />
        </Panel>
        <Panel>
          <Metric label="Readiness" value={`${readiness.score}%`} />
          <ProgressBar value={readiness.score} className="mt-3" />
        </Panel>
      </div>

      <AiReadinessView customerReadiness={readiness} aiReadiness={aiReadiness} />

      <Panel title="Next Customer Actions">
        <div className="space-y-3">
          {(readiness.nextActions.length > 0 ? readiness.nextActions : ["Keep GST and bank statements updated"]).slice(0, 4).map((action) => (
            <div key={action} className="flex items-start gap-3 rounded-xl border border-line p-4">
              {action.startsWith("Upload") ? <FileWarning className="mt-1 h-5 w-5 shrink-0 text-caution" /> : <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-trust" />}
              <div>
                <p className="font-semibold text-ink">{action}</p>
                <p className="mt-1 text-sm text-muted">This helps the bank complete document and cash-flow review faster.</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <CustomerTimeline applicationId={application.id} status={application.status} />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { href: "/customer/apply", icon: IndianRupee, title: "Loan application", text: "Review or update requested amount." },
          { href: "/customer/status", icon: Clock, title: "Application status", text: "See where the bank review stands." },
          { href: "/customer/support", icon: Bot, title: "BANK AI Business Support", text: "Get guidance in simple language." }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="rounded-xl border border-line bg-white p-5 shadow-sm transition hover:border-trust">
              <div className="flex items-start justify-between gap-3">
                <Icon className="h-6 w-6 text-trust" />
                <ArrowRight className="h-4 w-4 text-muted" />
              </div>
              <p className="mt-4 font-semibold text-ink">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
            </Link>
          );
        })}
      </div>

      <Panel title="Current Application">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-ink">{application.product}</p>
            <p className="mt-1 text-sm text-muted">{application.purpose}</p>
          </div>
          <Badge tone="warning">{application.status}</Badge>
        </div>
      </Panel>
    </div>
  );
}
