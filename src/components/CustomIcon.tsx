import Image from 'next/image';

// Icon name mapping to file paths (from main PsalMix app)
const ICON_PATHS = {
  // Musical elements
  flame: '/images/icons/2ab21c24-d353-4f5d-b7d7-c28a6b704a5c.png',
  waveform: '/images/icons/ChatGPT Image Oct 12, 2025, 04_47_01 PM.png',
  musicNote: '/images/icons/903adef3-16a4-4efa-91db-93e1ba420430.png',
  heart: '/images/icons/e73acd51-ea08-4685-8438-ad007cd05ba9.png',
  microphone: '/images/icons/49af8cf8-bff5-41cc-8cbc-922d35bc27bd.png',
  headphones: '/images/icons/793c82a0-26f6-4472-9cdd-24386fac05af.png',
  musicSheet: '/images/icons/e9b13cd9-78b4-4356-97b4-c4c4d21dd52f.png',
  search: '/images/icons/ChatGPT Image Oct 12, 2025, 05_02_31 PM.png',
  bell: '/images/icons/ChatGPT Image Oct 12, 2025, 05_03_52 PM.png',
  download: '/images/icons/ChatGPT Image Oct 12, 2025, 05_02_33 PM.png',
  star: '/images/icons/ChatGPT Image Oct 12, 2025, 12_33_31 AM.png',
  lock: '/images/icons/2dce0790-92fc-4595-b884-502ea5cbec6b.png',
  equalizer: '/images/icons/848e5544-b548-4410-8ba3-504a3198eeec.png',
} as const;

export type CustomIconName = keyof typeof ICON_PATHS;

interface CustomIconProps {
  name: CustomIconName;
  size?: number;
  className?: string;
  alt?: string;
}

export function CustomIcon({
  name,
  size = 24,
  className = '',
  alt,
}: CustomIconProps) {
  const iconPath = ICON_PATHS[name];
  const altText = alt || `${name} icon`;

  return (
    <Image
      src={iconPath}
      alt={altText}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      draggable={false}
    />
  );
}

export { ICON_PATHS };
