"use client";

interface CTASectionProps {
  spotsRemaining: number;
  SignupForm: React.ComponentType<{ variant: "hero" | "footer" }>;
}

export function CTASection({ spotsRemaining, SignupForm }: CTASectionProps) {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="relative bg-gradient-to-b from-primary/20 via-primary/10 to-transparent rounded-3xl border border-primary/30 p-12 md:p-20 overflow-hidden text-center">
          {/* Radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,59,237,0.4) 0%, transparent 70%)" }}
          />

          <div className="relative z-10">
            {/* Urgency pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              ⏳ Beta closes when 500 spots fill
            </div>

            {/* Headline */}
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-white">
              Your kids deserve better.<br />
              <span className="bg-gradient-to-r from-primary via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                So give it to them.
              </span>
            </h2>

            <p className="text-white/70 mb-10 max-w-xl mx-auto text-lg">
              Beta opens April 15. Reserve your spot now — it&apos;s completely free.
            </p>

            {/* Form with card anchor */}
            <div className="bg-background/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4 max-w-md mx-auto mb-6">
              <SignupForm variant="footer" />
            </div>

            {/* Spots remaining */}
            {spotsRemaining < 500 && (
              <p className="text-sm text-amber-400 font-medium mb-2">
                🔥 Only {spotsRemaining} founding spots remaining
              </p>
            )}

            <p className="text-xs text-white/40">
              Free during beta · $7.99/mo at launch · No credit card required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
