"use client";

import { useState } from "react";

type ShareButtonsProps = {
  url: string;
  onShare?: (channel: string) => void;
};

const FACEBOOK_MESSAGE =
  "I just signed up for PsalMix — a music streaming app where EVERY song is verified clean for families! 🎵 Use my link: ";
const INSTAGRAM_MESSAGE =
  "I just joined PsalMix — family-safe music without the skip button. Join me: ";

export default function ShareButtons({ url, onShare }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      onShare?.("copy");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard access denied — silently ignore
    }
  };

  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}&quote=${encodeURIComponent(`${FACEBOOK_MESSAGE}${url}`)}`;

  const instagramShareText = `${INSTAGRAM_MESSAGE}${url}`;

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={facebookShare}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        onClick={() => onShare?.("facebook")}
      >
        Share on Facebook
      </a>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(instagramShareText);
            onShare?.("instagram");
            window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
          } catch {
            // clipboard or window.open denied — silently ignore
          }
        }}
        className="rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
      >
        Share on Instagram
      </button>
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-900 shadow-sm transition hover:border-amber-300"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
