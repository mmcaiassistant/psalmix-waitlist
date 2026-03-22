"use client";

export function GuaranteeSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Our Promise</span>
        </div>

        <div className="relative bg-gradient-to-br from-surface via-surface to-primary/5 rounded-3xl border border-primary/20 overflow-hidden">
          {/* Watermark stamp */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span className="text-[120px] font-black text-primary/5 rotate-[-15deg] tracking-widest uppercase whitespace-nowrap">GUARANTEED</span>
          </div>

          <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row gap-10 items-center">
            {/* Big "30" circle */}
            <div className="flex-shrink-0 text-center">
              <div className="relative inline-flex flex-col items-center justify-center w-36 h-36 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/40 shadow-[0_0_50px_rgba(124,59,237,0.3)]">
                <span className="text-6xl font-black text-white leading-none">30</span>
                <span className="text-xs font-bold uppercase tracking-widest text-primary/80 mt-1">DAYS</span>
              </div>
            </div>

            {/* Guarantee text */}
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Love it or your money back.
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                After beta, if Psalmix isn&apos;t everything we promised in your first 30 days — you get a <strong className="text-primary">full refund</strong>. No forms. No phone call. No hassle. Just email us.
              </p>
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                We&apos;re building this for the long run. If it doesn&apos;t deliver, you shouldn&apos;t pay for it. Simple as that. We&apos;re a small team of parents — we know what&apos;s at stake.
              </p>

              {/* Founder signature */}
              <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
                    <path d="m9 12 2 2 4-4"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">McKinzie Bean</p>
                  <p className="text-white/50 text-xs">Founder, Psalmix · Mom of 3 · Singer/songwriter</p>
                </div>
                <div className="ml-auto hidden md:flex flex-col gap-1.5 items-end">
                  {["No questions asked", "Instant refund", "No cancellation fees"].map(chip => (
                    <span key={chip} className="inline-flex items-center gap-1.5 text-xs text-primary/80 font-medium">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 12 2 2 4-4"/></svg>
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
