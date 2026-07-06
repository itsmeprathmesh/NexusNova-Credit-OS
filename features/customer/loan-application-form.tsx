"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, IndianRupee } from "lucide-react";
import { getSession, submitApplication } from "@/services/app-data";
import { loanProducts } from "@/domain/types";
import { formatCurrency } from "@/lib/format";
import { Badge, Button, Metric, Panel } from "@/components/ui/primitives";

export function LoanApplicationForm() {
  const router = useRouter();
  const session = getSession();
  const reg = session.registration;
  const [productId, setProductId] = useState(loanProducts[0].id);
  const [amount, setAmount] = useState(4200000);
  const [tenure, setTenure] = useState(36);
  const [purpose, setPurpose] = useState(reg?.loanPurpose ?? "CNC inventory and receivables bridge");
  const [submitted, setSubmitted] = useState(false);

  const selectedProduct = loanProducts.find((p) => p.id === productId)!;

  const handleSubmit = useCallback(() => {
    const msmeId = session.msmeId ?? `msme-${Date.now()}`;
    submitApplication({
      msmeId,
      product: selectedProduct.name,
      requestedAmount: amount,
      tenureMonths: tenure,
      purpose,
      msmeName: reg?.businessName ?? "Aurora Precision Tools",
      sector: reg?.industry ?? "Manufacturing",
      branch: "IDBI " + (reg?.city ?? "Pune"),
      owner: reg?.ownerName ?? "Rohit Kulkarni",
      city: reg?.city ?? "Pune",
      pan: reg?.pan ?? "AAKPA1842K",
      gstin: reg?.gstin ?? "27AAKPA1842K1Z8",
      udyam: reg?.udyam ?? "UDYAM-MH-26-0048123",
      businessAgeYears: reg?.businessAgeYears ?? 8
    });
    setSubmitted(true);
  }, [session, selectedProduct, amount, tenure, purpose, reg]);

  if (submitted) {
    return (
      <div className="space-y-5">
        <Panel>
          <div className="flex flex-col items-center py-8 text-center">
            <CheckCircle className="h-16 w-16 text-growth" />
            <h1 className="mt-4 text-3xl font-semibold text-ink">Application Submitted</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-muted">
              Your {selectedProduct.name} request for {formatCurrency(amount)} has been received.
              The bank will review your application and documents.
            </p>
            <div className="mt-6 flex gap-3">
              <Button type="button" onClick={() => router.push("/customer/documents")}>
                Upload Documents
              </Button>
              <Button type="button" variant="secondary" onClick={() => router.push("/customer/status")}>
                Track Status
              </Button>
            </div>
          </div>
        </Panel>
      </div>
    );
  }

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
              Select loan type, enter amount, choose tenure, and submit for bank review.
            </p>
          </div>
        </div>
      </Panel>

      {reg && (
        <div className="rounded-lg border border-line bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Registered as</p>
          <p className="mt-1 text-sm font-semibold text-ink">{reg.businessName} · {reg.ownerName} · {reg.city}</p>
        </div>
      )}

      <Panel title="Select Loan Product">
        <div className="grid gap-3 sm:grid-cols-2">
          {loanProducts.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => { setProductId(product.id); setAmount(product.defaultTenureMonths === 12 ? Math.min(amount, product.maxAmount) : amount); }}
              className={`rounded-lg border-2 p-4 text-left transition ${productId === product.id ? "border-trust bg-trust/[0.03]" : "border-line hover:border-trust/50"}`}
            >
              <div className="flex items-start justify-between">
                <p className="font-semibold text-ink">{product.name}</p>
                {productId === product.id && <CheckCircle className="h-5 w-5 text-trust" />}
              </div>
              <p className="mt-1 text-xs text-muted">{product.description}</p>
              <div className="mt-3 flex gap-2 text-xs text-muted">
                <span>{formatCurrency(product.minAmount)} – {formatCurrency(product.maxAmount)}</span>
                <span>·</span>
                <span>{product.interestRate}% p.a.</span>
              </div>
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Request Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold">Requested amount</span>
            <input
              type="number"
              className="mt-2 min-h-12 w-full rounded-lg border border-line px-3 outline-none focus:border-trust"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={selectedProduct.minAmount}
              max={selectedProduct.maxAmount}
            />
            <p className="mt-1 text-xs text-muted">Min {formatCurrency(selectedProduct.minAmount)} · Max {formatCurrency(selectedProduct.maxAmount)}</p>
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Preferred tenure</span>
            <select className="mt-2 min-h-12 w-full rounded-lg border border-line px-3 outline-none focus:border-trust" value={tenure} onChange={(e) => setTenure(Number(e.target.value))}>
              <option value="12">12 months</option>
              <option value="24">24 months</option>
              <option value="36">36 months</option>
              <option value="48">48 months</option>
              <option value="60">60 months</option>
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-semibold">Purpose</span>
            <textarea className="mt-2 min-h-24 w-full rounded-lg border border-line p-3 outline-none focus:border-trust" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
          </label>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-4 rounded-lg border border-line bg-slate-50 p-4">
          <Metric label="Product" value={selectedProduct.name} hint={`${selectedProduct.interestRate}% p.a.`} />
          <Metric label="Amount" value={formatCurrency(amount)} />
          <Metric label="Tenure" value={`${tenure} months`} />
        </div>

        <Button type="button" className="mt-5 w-full" onClick={handleSubmit}>
          Submit Application
        </Button>
      </Panel>
    </div>
  );
}
