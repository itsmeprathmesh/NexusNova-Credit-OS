"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, Sparkles } from "lucide-react";
import { registerBusiness, getSession } from "@/services/app-data";
import { Panel } from "@/components/ui/primitives";
import { GlassPanel } from "@/components/ui/glass-panel";

export function BusinessRegistration() {
  const router = useRouter();
  const session = getSession();
  const [form, setForm] = useState({
    businessName: session.registration?.businessName ?? "Aurora Precision Tools",
    ownerName: session.registration?.ownerName ?? "Rohit Kulkarni",
    mobile: session.registration?.mobile ?? "+91 98765 43210",
    email: session.registration?.email ?? "rohit@auroratools.in",
    city: session.registration?.city ?? "Pune",
    pan: session.registration?.pan ?? "AAKPA1842K",
    gstin: session.registration?.gstin ?? "27AAKPA1842K1Z8",
    udyam: session.registration?.udyam ?? "UDYAM-MH-26-0048123",
    businessType: session.registration?.businessType ?? "Private Limited",
    industry: session.registration?.industry ?? "Manufacturing",
    businessAgeYears: session.registration?.businessAgeYears ?? 8,
    annualTurnover: session.registration?.annualTurnover ?? 42000000,
    loanPurpose: session.registration?.loanPurpose ?? "CNC inventory and receivables bridge"
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = useCallback(() => {
    registerBusiness({
      businessName: form.businessName,
      ownerName: form.ownerName,
      mobile: form.mobile,
      email: form.email,
      city: form.city,
      pan: form.pan,
      gstin: form.gstin,
      udyam: form.udyam,
      businessType: form.businessType,
      industry: form.industry,
      businessAgeYears: Number(form.businessAgeYears),
      annualTurnover: Number(form.annualTurnover),
      loanPurpose: form.loanPurpose
    });
    router.push("/customer/apply");
  }, [form, router]);

  return (
    <div className="space-y-5">
      <GlassPanel className="p-6">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-trust-light text-trust">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Understand Your Business</h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              Tell us about your business so AI can connect the right alternate data sources.
              No financial documents needed — start with basic information.
            </p>
          </div>
        </div>
      </GlassPanel>

      <div className="flex items-center gap-2 rounded-xl border border-trust/20 bg-trust-light/30 px-4 py-3">
        <Sparkles className="h-4 w-4 text-trust" />
        <span className="text-xs text-muted">
          Your PAN and GSTIN help us verify your business identity and connect to alternate data sources automatically.
        </span>
      </div>

      <Panel title="Business Profile">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold">Business name</span>
            <input className="mt-2 min-h-12 w-full rounded-lg border border-line px-3 outline-none focus:border-trust" value={form.businessName} onChange={set("businessName")} />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Owner name</span>
            <input className="mt-2 min-h-12 w-full rounded-lg border border-line px-3 outline-none focus:border-trust" value={form.ownerName} onChange={set("ownerName")} />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Mobile number</span>
            <input className="mt-2 min-h-12 w-full rounded-lg border border-line px-3 outline-none focus:border-trust" value={form.mobile} onChange={set("mobile")} />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Email</span>
            <input className="mt-2 min-h-12 w-full rounded-lg border border-line px-3 outline-none focus:border-trust" value={form.email} onChange={set("email")} />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">City</span>
            <input className="mt-2 min-h-12 w-full rounded-lg border border-line px-3 outline-none focus:border-trust" value={form.city} onChange={set("city")} />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Business type</span>
            <select className="mt-2 min-h-12 w-full rounded-lg border border-line px-3 outline-none focus:border-trust" value={form.businessType} onChange={set("businessType")}>
              <option>Proprietorship</option>
              <option>Partnership</option>
              <option>Private Limited</option>
              <option>Limited Liability Partnership</option>
              <option>Public Limited</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Industry / Sector</span>
            <select className="mt-2 min-h-12 w-full rounded-lg border border-line px-3 outline-none focus:border-trust" value={form.industry} onChange={set("industry")}>
              <option>Manufacturing</option>
              <option>Food Processing</option>
              <option>Textiles</option>
              <option>Pharmaceutical</option>
              <option>Logistics</option>
              <option>Electronics</option>
              <option>IT Services</option>
              <option>Agriculture</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Business vintage (years)</span>
            <input type="number" className="mt-2 min-h-12 w-full rounded-lg border border-line px-3 outline-none focus:border-trust" value={form.businessAgeYears} onChange={set("businessAgeYears")} />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Annual turnover (₹)</span>
            <input type="number" className="mt-2 min-h-12 w-full rounded-lg border border-line px-3 outline-none focus:border-trust" value={form.annualTurnover} onChange={set("annualTurnover")} />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">PAN</span>
            <input className="mt-2 min-h-12 w-full rounded-lg border border-line px-3 outline-none focus:border-trust" value={form.pan} onChange={set("pan")} />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">GSTIN</span>
            <input className="mt-2 min-h-12 w-full rounded-lg border border-line px-3 outline-none focus:border-trust" value={form.gstin} onChange={set("gstin")} />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-semibold">Udyam registration</span>
            <input className="mt-2 min-h-12 w-full rounded-lg border border-line px-3 outline-none focus:border-trust" value={form.udyam} onChange={set("udyam")} />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-semibold">Loan purpose</span>
            <textarea className="mt-2 min-h-24 w-full rounded-lg border border-line p-3 outline-none focus:border-trust" value={form.loanPurpose} onChange={set("loanPurpose")} />
          </label>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-trust px-4 text-sm font-semibold text-white shadow-glow transition-all hover:shadow-[0_0_30px_rgba(216,255,62,0.25)] active:scale-[0.97]"
        >
          Save & continue to loan request
          <ArrowRight className="h-4 w-4" />
        </button>
      </Panel>
    </div>
  );
}
