import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
});

// Prevent the virtual keyboard from resizing the viewport and hiding the submit button.
// "resizes-content" is the default on iOS; "overlays-content" keeps the layout stable.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-visual",
};

export const metadata: Metadata = {
  title: "PsalMix — Family-Safe Music Streaming | Join the Waitlist",
  description:
    "The first music streaming service where every song is verified safe for families. All genres, half the cost of Spotify. Join the waitlist and get 50% off forever.",
  openGraph: {
    title: "PsalMix — Family-Safe Music Streaming | Join the Waitlist",
    description:
      "The first music streaming service where every song is verified safe for families. Join the waitlist and get 50% off forever.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PsalMix - Family-Safe Music Streaming",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PsalMix — Family-Safe Music Streaming | Join the Waitlist",
    description:
      "Every song verified safe by real humans. Half the price of Spotify. Join the waitlist!",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${beVietnamPro.variable} font-display antialiased`}>
        {children}
      </body>
    </html>
  );
}
