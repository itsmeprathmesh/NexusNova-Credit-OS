import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, ClipboardCheck } from "lucide-react";

const roles = [
  {
    label: "Loan Officer",
    href: "/command-center?role=loan-officer",
    icon: ClipboardCheck,
    description: "Review urgent MSME loan cases, inspect evidence, run stress scenarios, and record decisions."
  },
  {
    label: "Manager",
    href: "/command-center?role=manager",
    icon: BriefcaseBusiness,
    description: "Monitor portfolio risk, early warnings, exposure drift, and dynamic credit limit changes."
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-canvas px-4 py-8 text-ink sm:px-6 lg:px-10">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-trust">IDBI Innovate 2026 PS-3</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">NexusNova Credit Intelligence OS</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            A banking-grade MSME lending workspace for explainable credit intelligence, human decision controls, and
            portfolio early warnings.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {roles.map((role) => {
            const Icon = role.icon;

            return (
              <Link
                key={role.label}
                href={role.href}
                className="group rounded-lg border border-line bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-lg bg-slate-100 text-trust">
                    <Icon className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted transition group-hover:translate-x-1 group-hover:text-trust" />
                </div>
                <h2 className="mt-5 text-2xl font-semibold">{role.label}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">{role.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
