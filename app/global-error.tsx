"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-canvas px-4" style={{ backgroundColor: "#0a0a0f", color: "#e8edf5" }}>
          <div style={{ maxWidth: "400px", textAlign: "center" }}>
            <div style={{ width: "80px", height: "80px", margin: "0 auto 24px", borderRadius: "24px", border: "1px solid rgba(255,107,107,0.2)", backgroundColor: "rgba(255,107,107,0.05)", display: "grid", placeItems: "center" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>Something went wrong</h1>
            <p style={{ fontSize: "14px", color: "#8892a8", marginBottom: "24px", lineHeight: "1.6" }}>
              A critical error occurred. Please try again or contact support.
            </p>
            <button onClick={reset} style={{ padding: "10px 24px", borderRadius: "12px", border: "none", backgroundColor: "#d8ff3e", color: "#0a0a0f", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
