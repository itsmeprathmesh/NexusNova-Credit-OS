import Link from "next/link";
import { ArrowRight, Building2, LockKeyhole, Phone, ShieldCheck, UserPlus } from "lucide-react";

export function CustomerLogin() {
  return (
    <main className="min-h-screen bg-canvas px-4 py-6 text-ink">
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-5xl items-center gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-trust">
            <ShieldCheck className="h-4 w-4" />
            NexusNova Bank
          </Link>
          <h1 className="mt-6 text-4xl font-semibold leading-tight">Customer login for MSME lending</h1>
          <p className="mt-4 text-base leading-7 text-muted">
            Track your loan application, complete business details, upload documents, and get BANK AI Business Support.
          </p>
        </div>

        <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-trust">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold">Sign in</h2>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold">Mobile number</span>
              <input className="mt-2 min-h-12 w-full rounded-lg border border-line px-3 outline-none focus:border-trust" defaultValue="+91 98765 43210" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Password</span>
              <input className="mt-2 min-h-12 w-full rounded-lg border border-line px-3 outline-none focus:border-trust" type="password" defaultValue="password" />
            </label>
            <Link
              href="/customer/dashboard"
              className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-trust px-4 text-sm font-semibold text-white"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/customer/register"
              className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-semibold"
            >
              <UserPlus className="h-4 w-4" />
              Register business
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export function CustomerRegister() {
  return (
    <main className="min-h-screen bg-canvas px-4 py-6 text-ink">
      <section className="mx-auto max-w-3xl">
        <Link href="/customer/login" className="inline-flex items-center gap-2 text-sm font-semibold text-trust">
          <Phone className="h-4 w-4" />
          Already registered? Login
        </Link>
        <div className="mt-6 rounded-xl border border-line bg-white p-5 shadow-sm">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-trust">
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-3xl font-semibold">Register your business</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Create a customer profile for your MSME. This prototype pre-fills sample values for a quick demo.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["Business name", "Aurora Precision Tools"],
              ["Owner name", "Rohit Kulkarni"],
              ["Mobile number", "+91 98765 43210"],
              ["City", "Pune"],
              ["PAN", "AAKPA1842K"],
              ["GSTIN", "27AAKPA1842K1Z8"]
            ].map(([label, value]) => (
              <label key={label} className="block">
                <span className="text-sm font-semibold">{label}</span>
                <input className="mt-2 min-h-12 w-full rounded-lg border border-line px-3 outline-none focus:border-trust" defaultValue={value} />
              </label>
            ))}
          </div>
          <Link
            href="/customer/business"
            className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-lg bg-trust px-4 text-sm font-semibold text-white"
          >
            Continue business setup
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
