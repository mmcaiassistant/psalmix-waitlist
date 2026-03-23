import React from "react";
import Image from "next/image";

interface ComparisonSectionProps {
  Icons: {
    users: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    shieldCheck: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  };
  CustomIcon: React.ComponentType<{ name: string; size?: number }>;
}

const comparisonRows = [
  { label: "Price", spotify: "$19.99/mo", psalmix: "$7.99/mo", highlight: true },
  { label: "Content Safety", spotify: "Labels only", psalmix: "Human-verified" },
  { label: "Content Library", spotify: "Mainstream (filtered)", psalmix: "Original, exclusive tracks" },
  { label: "Parental Dashboard", spotify: "No", psalmix: "Yes" },
  { label: "Human Review", spotify: "No", psalmix: "Every song & cover image" },
];

export function ComparisonSection({ Icons, CustomIcon }: ComparisonSectionProps) {
  return (
    <>
      {/* ── Bento Feature Grid ── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Built Different. Built Right.
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Everything families need. Nothing they don&apos;t.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Hero card — phone mockup + text (spans 2 cols) */}
            <div className="md:col-span-2 bg-surface border border-white/10 rounded-2xl p-10 relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none rounded-2xl" />

              {/* Text side */}
              <div className="relative z-10 flex flex-col flex-1 min-h-[260px]">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 shrink-0">
                  <Icons.shieldCheck className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">
                  Every song reviewed<br />by a real human.
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Not an algorithm. McKinzie and our team of musicians listen to every track before it reaches your family.
                </p>
                <div className="mt-auto pt-8 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm text-text-secondary font-medium">Zero Surprises — Guaranteed</span>
                </div>
              </div>

              {/* Phone mockup */}
              <div className="relative z-10 shrink-0 flex justify-center">
                <div className="relative w-[150px] md:w-[170px]">
                  {/* Glow behind phone */}
                  <div className="absolute inset-0 rounded-[2.5rem] blur-2xl bg-primary/25 scale-110 -z-10" />
                  {/* Phone frame */}
                  <div className="rounded-[2rem] overflow-hidden border-[3px] border-white/10 shadow-2xl shadow-primary/20">
                    <Image
                      src="/images/app-screenshot.jpg"
                      alt="Psalmix app — music player"
                      width={170}
                      height={340}
                      className="w-full h-auto block"
                      style={{ borderRadius: "1.6rem" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Family Plan card */}
            <div className="bg-surface border border-white/10 rounded-2xl p-8 flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 shrink-0">
                <Icons.users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-white text-lg font-bold mb-3">Family Plan</h3>
              <p className="text-text-secondary text-sm text-left leading-relaxed">
                Up to 5 members, 3 simultaneous streams — one subscription for the whole family.
              </p>
            </div>

            {/* All Genres card */}
            <div className="bg-surface border border-white/10 rounded-2xl p-8 flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 shrink-0">
                <CustomIcon name="musicNote" size={28} />
              </div>
              <h3 className="text-white text-lg font-bold mb-3">All Genres</h3>
              <p className="text-text-secondary text-sm text-left leading-relaxed">
                Original pop, hip-hop, country, rock &amp; R&amp;B — created clean, exclusive to Psalmix.
              </p>
            </div>

            {/* Simple Pricing card */}
            <div className="bg-surface border border-white/10 rounded-2xl p-8 flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 shrink-0">
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l7.41-7.41a1 1 0 0 0 0-1.41z" />
                  <circle cx="7" cy="7" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <h3 className="text-white text-lg font-bold mb-3">Simple Pricing</h3>
              <p className="text-text-secondary text-sm text-left leading-relaxed">
                $7.99/mo or $59.99/year — less than half of Spotify Family.
              </p>
            </div>

            {/* Zero Surprises — featured, spans 1 col */}
            <div className="bg-surface border border-primary/30 rounded-2xl p-8 flex flex-col shadow-[0_0_30px_rgba(124,59,237,0.15)]">
              <div className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
                Key Differentiator
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 shrink-0">
                <Icons.shieldCheck className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-white text-lg font-bold mb-3">Zero Surprises</h3>
              <p className="text-text-secondary text-sm text-left leading-relaxed">
                No filtered mainstream hits. No clean radio edits. Music created safe from the very first note.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="py-20 px-4 bg-surface/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Why Parents Choose Psalmix
            </h2>
            <p className="text-text-secondary text-lg">
              The only streaming service built for families from day one.
            </p>
          </div>

          {/* Stitch-style 3-column grid table */}
          <div className="grid grid-cols-3 gap-4">
            {/* Column headers */}
            <div className="col-span-1" />
            <div className="col-span-1 bg-surface rounded-t-2xl px-6 pt-6 pb-4 text-center border border-white/5 border-b-0">
              <p className="text-text-secondary text-sm font-bold uppercase tracking-widest">Spotify / Apple</p>
            </div>
            <div className="col-span-1 bg-primary/10 rounded-t-2xl px-6 pt-6 pb-4 text-center border border-primary/30 border-b-0 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-primary text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">
                Best for Families
              </div>
              <p className="text-primary text-sm font-black uppercase tracking-widest mt-2">Psalmix</p>
            </div>

            {/* Row: Content Review */}
            <div className="flex items-center px-4 py-5 bg-surface/40 border-t border-white/5 text-sm font-medium text-slate-300">Content Review</div>
            <div className="flex items-center justify-center px-4 py-5 bg-surface border-t border-white/5 text-center">
              <span className="text-text-secondary text-sm">Algorithm only</span>
            </div>
            <div className="flex items-center justify-center px-4 py-5 bg-primary/10 border-t border-primary/20 text-center">
              <span className="text-white text-sm font-semibold">Human + AI</span>
            </div>

            {/* Row: Explicit Content */}
            <div className="flex items-center px-4 py-5 bg-surface/40 border-t border-white/5 text-sm font-medium text-slate-300">Explicit Content</div>
            <div className="flex items-center justify-center px-4 py-5 bg-surface border-t border-white/5">
              <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </div>
            <div className="flex items-center justify-center px-4 py-5 bg-primary/10 border-t border-primary/20">
              <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>

            {/* Row: 100% Ad-Free */}
            <div className="flex items-center px-4 py-5 bg-surface/40 border-t border-white/5 text-sm font-medium text-slate-300">100% Ad-Free</div>
            <div className="flex items-center justify-center px-4 py-5 bg-surface border-t border-white/5">
              <span className="text-text-secondary text-sm">Premium only</span>
            </div>
            <div className="flex items-center justify-center px-4 py-5 bg-primary/10 border-t border-primary/20">
              <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>

            {/* Row: Per-Kid Profiles */}
            <div className="flex items-center px-4 py-5 bg-surface/40 border-t border-white/5 text-sm font-medium text-slate-300">Per-Kid Profiles</div>
            <div className="flex items-center justify-center px-4 py-5 bg-surface border-t border-white/5">
              <span className="text-text-secondary text-sm">Limited</span>
            </div>
            <div className="flex items-center justify-center px-4 py-5 bg-primary/10 border-t border-primary/20">
              <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>

            {/* Row: Built for Families */}
            <div className="flex items-center px-4 py-5 bg-surface/40 border-t border-white/5 text-sm font-medium text-slate-300">Built for Families</div>
            <div className="flex items-center justify-center px-4 py-5 bg-surface border-t border-white/5">
              <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </div>
            <div className="flex items-center justify-center px-4 py-5 bg-primary/10 border-t border-primary/20">
              <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>

            {/* Row: Price — bottom rounded */}
            <div className="flex items-center px-4 py-5 bg-surface/40 border-t border-white/5 rounded-bl-2xl text-sm font-medium text-slate-300">Monthly Price</div>
            <div className="flex items-center justify-center px-4 py-5 bg-surface border-t border-white/5">
              <span className="text-text-secondary text-sm">$15.99 – $19.99/mo</span>
            </div>
            <div className="flex flex-col items-center justify-center px-4 py-5 bg-primary/10 border-t border-primary/20 rounded-br-2xl gap-1">
              <span className="text-white font-black text-lg">$7.99/mo</span>
              <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Save $96/yr</span>
            </div>
          </div>

          <p className="text-center text-text-secondary mt-8 text-sm italic">
            The only service built for families from day one — not retrofitted, not filtered after the fact.{" "}
            <a href="#signup" className="text-primary font-semibold hover:underline not-italic">
              Reserve your spot →
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
