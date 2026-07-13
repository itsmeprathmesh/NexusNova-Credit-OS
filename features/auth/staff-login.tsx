import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, ClipboardCheck, ShieldCheck } from "lucide-react";
import type { UserRole } from "@/domain/types";

const config: Record<UserRole, { title: string; description: string; href: string; icon: typeof ClipboardCheck }> = {
  "loan-officer": {
    title: "Loan Officer Login",
    description: "Review customer-submitted MSME applications, documents, credit intelligence, and decision workflow.",
    href: "/command-center?role=loan-officer",
    icon: ClipboardCheck
  },
  manager: {
    title: "Manager Login",
    description: "Monitor MSME portfolio exposure, risk heatmaps, early warnings, and dynamic credit limit movement.",
    href: "/command-center?role=manager",
    icon: BriefcaseBusiness
  }
};

export function StaffLogin({ role }: { role: UserRole }) {
  const item = config[role];
  const Icon = item.icon;

  return (
    <main className="min-h-[100dvh] bg-canvas px-4 py-6 text-ink">
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-5xl items-center gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-trust">
            <ShieldCheck className="h-4 w-4" />
            NexusNova Bank Staff
          </Link>
          <h1 className="mt-6 text-4xl font-semibold leading-tight">{item.title}</h1>
          <p className="mt-4 text-base leading-7 text-muted">{item.description}</p>
        </div>

        <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-trust">
            <Icon className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold">Secure staff sign in</h2>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold">Employee ID</span>
              <input className="mt-2 min-h-12 w-full rounded-lg border border-line px-3 outline-none focus:border-trust" defaultValue={role === "manager" ? "MGR-2041" : "LO-1187"} aria-label="Employee ID" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Password</span>
              <input className="mt-2 min-h-12 w-full rounded-lg border border-line px-3 outline-none focus:border-trust" type="password" defaultValue="password" aria-label="Password" />
            </label>
            <Link href={item.href} className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-trust px-4 text-sm font-semibold text-white">
              Continue to workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
