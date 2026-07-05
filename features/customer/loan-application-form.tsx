import Link from "next/link";
import { ArrowRight, IndianRupee } from "lucide-react";
import { applications } from "@/data/mock-data";
import { formatCurrency } from "@/lib/format";
import { Metric, Panel } from "@/components/ui/primitives";

const application = applications[0];

export function LoanApplicationForm() {
  return (
    <div className="space-y-5">
      <Panel>
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-100 text-trust">
            <IndianRupee className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Loan application</h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              Request working capital and explain how funds will support your MSME operations.
            </p>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2">
        <Panel>
          <Metric label="Current Request" value={formatCurrency(application.requestedAmount)} hint={application.product} />
        </Panel>
        <Panel>
          <Metric label="SLA Status" value={`${application.slaHoursRemaining}h`} hint="Officer review remaining" />
        </Panel>
      </div>

      <Panel title="Request Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold">Requested amount</span>
            <input className="mt-2 min-h-12 w-full rounded-lg border border-line px-3 outline-none focus:border-trust" defaultValue="4200000" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Preferred tenure</span>
            <select className="mt-2 min-h-12 w-full rounded-lg border border-line px-3 outline-none focus:border-trust" defaultValue="36">
              <option value="24">24 months</option>
              <option value="36">36 months</option>
              <option value="48">48 months</option>
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-semibold">Loan product</span>
            <input className="mt-2 min-h-12 w-full rounded-lg border border-line px-3 outline-none focus:border-trust" defaultValue={application.product} />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-semibold">Purpose</span>
            <textarea className="mt-2 min-h-28 w-full rounded-lg border border-line p-3 outline-none focus:border-trust" defaultValue={application.purpose} />
          </label>
        </div>
        <Link
          href="/customer/documents"
          className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-lg bg-trust px-4 text-sm font-semibold text-white"
        >
          Continue to documents
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Panel>
    </div>
  );
}
