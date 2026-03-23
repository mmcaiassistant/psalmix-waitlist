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
    } catch {
      // clipboard access denied — silently ignore
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-sm font-semibold text-white">Your referral link</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          readOnly
          value={url}
          className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full bg-[#8B4BCF] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#7B3BBF]"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
