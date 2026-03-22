import React from "react";

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
      {/* ── Solution / Feature Cards ── */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* All Genres */}
            <div className="bg-surface border border-white/10 rounded-2xl p-8 flex flex-col">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 shrink-0">
                <CustomIcon name="musicNote" size={32} />
              </div>
              <h3 className="text-white text-lg font-bold mb-3">All Genres</h3>
              <p className="text-text-secondary text-sm text-left leading-relaxed">
                Original pop, hip-hop, country, rock &amp; R&amp;B — created clean, exclusive to Psalmix.
              </p>
            </div>

            {/* Family Plan */}
            <div className="bg-surface border border-white/10 rounded-2xl p-8 flex flex-col">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 shrink-0">
                <Icons.users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-white text-lg font-bold mb-3">Family Plan</h3>
              <p className="text-text-secondary text-sm text-left leading-relaxed">
                Up to 5 members, 3 simultaneous streams — one subscription for the whole family.
              </p>
            </div>

            {/* Zero Surprises — featured */}
            <div className="bg-surface border border-primary/30 rounded-2xl p-8 flex flex-col shadow-[0_0_30px_rgba(124,59,237,0.15)]">
              <div className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
                ⭐ Key Differentiator
              </div>
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 shrink-0">
                <Icons.shieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-white text-lg font-bold mb-3">Zero Surprises</h3>
              <p className="text-text-secondary text-sm text-left leading-relaxed">
                No filtered mainstream hits. No clean radio edits. Music created safe from the very first note.
              </p>
            </div>

            {/* Simple Pricing */}
            <div className="bg-surface border border-white/10 rounded-2xl p-8 flex flex-col">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l7.41-7.41a1 1 0 0 0 0-1.41z" />
                  <circle cx="7" cy="7" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <h3 className="text-white text-lg font-bold mb-3">Simple Pricing</h3>
              <p className="text-text-secondary text-sm text-left leading-relaxed">
                $7.99/mo or $59.99/year — less than half of Spotify Family
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="py-20 px-4 bg-surface/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              How We Stack Up
            </h2>
            <p className="text-text-secondary text-lg">
              The numbers don&apos;t lie.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-5 px-6 text-left text-slate-400 font-semibold w-1/3">
                    Feature
                  </th>
                  <th className="py-5 px-6 text-center text-slate-400 font-semibold">
                    Spotify Family
                  </th>
                  <th className="py-5 px-6 text-center bg-primary/20 border-l-2 border-primary">
                    <div className="text-xl font-black text-primary">Psalmix</div>
                    <div className="mt-1 inline-flex items-center px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold tracking-wide">
                      🏆 BEST FOR FAMILIES
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {comparisonRows.map((row) => (
                  <tr key={row.label} className={row.highlight ? "bg-white/[0.02]" : ""}>
                    <td className="py-4 px-6 text-slate-300 font-medium">{row.label}</td>
                    <td className="py-4 px-6 text-center text-slate-500">{row.spotify}</td>
                    <td className="py-4 px-6 text-center text-white font-semibold bg-primary/5 border-l-2 border-primary/30">
                      {row.psalmix}
                      {row.highlight && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold">
                          Save $12/mo
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-center text-text-secondary mt-6 text-sm">
            The only platform built from scratch for families who don&apos;t compromise.{" "}
            <a href="#signup" className="text-primary font-semibold hover:underline">
              Reserve your spot →
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
