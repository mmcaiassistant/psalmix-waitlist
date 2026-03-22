/**
 * ProblemSection — Psalmix Waitlist Landing Page
 *
 * Highlights the real problem with existing music streaming for families:
 * Spotify's "clean" filter is broken, and kids are exposed to harmful content.
 */

const problemCards = [
  {
    title: "Sexual themes and innuendo",
    sub: "Slips through 'clean' filters constantly — labeled versions still contain it.",
  },
  {
    title: "Drug glorification",
    sub: "Presented as normal and aspirational in songs your kids are requesting by name.",
  },
  {
    title: "Violence and dark imagery",
    sub: "Common in rap and pop — including songs explicitly marketed to teens.",
  },
  {
    title: "Explicit album art",
    sub: "Your child sees it the moment they tap on any playlist.",
  },
  {
    title: "Podcasts with adult content",
    sub: "The same app that plays music also surfaces adult podcasts — no separation.",
  },
  {
    title: "Songs in \"Kids\" playlists that aren't for kids",
    sub: "Spotify's algorithm doesn't know your family's values.",
  },
];

export function ProblemSection() {
  return (
    <section className="py-24 bg-background" id="problem">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-bold mb-4">Tired of Hovering Over Skip?</h2>
          <p className="text-lg text-text-secondary">
            Spotify&apos;s clean filter only catches labeled profanity. It doesn&apos;t catch the rest.
          </p>
        </div>

        {/* Problem cards grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {problemCards.map((item) => (
            <div
              key={item.title}
              className="group flex items-start gap-4 bg-surface rounded-2xl p-6 border border-white/10 shadow-sm hover:border-white/20 hover:bg-surface/80 transition-all duration-200"
            >
              {/* X icon — rose palette for visual warmth without clashing with purple */}
              <div className="w-12 h-12 rounded-xl bg-rose-900/30 text-rose-400 flex items-center justify-center flex-shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </div>

              <div>
                <p className="font-semibold text-white">{item.title}</p>
                <p className="text-sm text-slate-300">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom stat — the MOMENT */}
        <div className="mt-12">
          <div className="bg-surface border border-white/10 rounded-3xl p-8 md:p-10 text-center max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-950/30 to-transparent pointer-events-none rounded-3xl" />
            <div className="relative z-10">
              <div className="text-6xl md:text-8xl font-black text-rose-400 mb-2">50%+</div>
              <p className="text-white text-xl font-bold mb-2">
                of Billboard&apos;s top 100 songs contain content not safe for kids
              </p>
              <p className="text-text-secondary text-sm">
                — and most of it slips right through Spotify&apos;s &ldquo;clean&rdquo; filter undetected.
              </p>
              <p className="text-xs text-text-secondary/50 mt-3">
                Source: Parents Television Council analysis
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
