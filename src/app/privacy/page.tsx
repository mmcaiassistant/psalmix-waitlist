import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — PsalMix",
  description: "How PsalMix collects and uses your information.",
};

export default function PrivacyPage() {
  const updated = "March 22, 2026";

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-rose-50 px-6 py-16 text-amber-950">
      <div className="mx-auto max-w-2xl space-y-8">
        <Link href="/" className="text-sm font-medium text-amber-600 hover:underline">
          ← Back to PsalMix
        </Link>

        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="text-sm text-amber-700">Last updated: {updated}</p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">What we collect</h2>
          <p className="text-amber-800 leading-relaxed">
            When you join the PsalMix waitlist we collect your email address and, optionally, your
            first name. We also record whether you were referred by another user, and we generate a
            unique referral code for you.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">How we use it</h2>
          <ul className="list-disc pl-5 space-y-2 text-amber-800 leading-relaxed">
            <li>To send you updates about PsalMix&apos;s launch and your waitlist position.</li>
            <li>To track referrals so we can reward you for spreading the word.</li>
            <li>We do not sell, rent, or share your information with third parties for marketing.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Third-party services</h2>
          <p className="text-amber-800 leading-relaxed">
            We use <strong>Flodesk</strong> to send emails and <strong>Supabase</strong> to store
            waitlist data. Both services process data in accordance with their own privacy policies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Your rights</h2>
          <p className="text-amber-800 leading-relaxed">
            You can request removal from our waitlist at any time by emailing{" "}
            <a href="mailto:hello@psalmix.com" className="text-amber-600 hover:underline">
              hello@psalmix.com
            </a>
            . We will delete your data within 30 days.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Cookies</h2>
          <p className="text-amber-800 leading-relaxed">
            We do not use tracking cookies. We use a single session cookie for admin authentication
            purposes only.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="text-amber-800 leading-relaxed">
            Questions? Email{" "}
            <a href="mailto:hello@psalmix.com" className="text-amber-600 hover:underline">
              hello@psalmix.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
