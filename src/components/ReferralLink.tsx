"use client";

import { useState } from "react";

type ReferralLinkProps = {
  url: string;
};

export default function ReferralLink({ url }: ReferralLinkProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="rounded-2xl border border-amber-100 bg-white/90 p-4">
      <p className="text-sm font-semibold text-amber-800">Your referral link</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          readOnly
          value={url}
          className="w-full rounded-full border border-amber-100 bg-amber-50 px-4 py-2 text-sm text-amber-900"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
