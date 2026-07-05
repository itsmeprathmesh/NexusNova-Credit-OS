import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import { msmes } from "@/data/mock-data";
import { Panel } from "@/components/ui/primitives";

const msme = msmes[0];

export function BusinessRegistration() {
  const fields = [
    ["Business name", msme.name],
    ["Owner", msme.owner],
    ["Sector", msme.sector],
    ["Branch", msme.branch],
    ["City", msme.city],
    ["PAN", msme.pan],
    ["GSTIN", msme.gstin],
    ["Udyam", msme.udyam],
    ["Business age", `${msme.businessAgeYears} years`],
    ["Bank relationship", `${msme.relationshipYears} years`]
  ];

  return (
    <div className="space-y-5">
      <Panel>
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-100 text-trust">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Business registration</h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              Keep identity, tax, and Udyam details current so the bank can verify your MSME profile.
            </p>
          </div>
        </div>
      </Panel>

      <Panel title="Business Profile">
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(([label, value]) => (
            <label key={label} className="block">
              <span className="text-sm font-semibold">{label}</span>
              <input className="mt-2 min-h-12 w-full rounded-lg border border-line px-3 outline-none focus:border-trust" defaultValue={value} />
            </label>
          ))}
        </div>
        <Link
          href="/customer/apply"
          className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-lg bg-trust px-4 text-sm font-semibold text-white"
        >
          Continue to loan request
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Panel>
    </div>
  );
}
