"use client";

import { useEffect, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";

type PositionDisplayProps = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
};

export default function PositionDisplay({
  label,
  value,
  prefix = "",
  suffix = "",
}: PositionDisplayProps) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 120, damping: 20 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return () => unsubscribe();
  }, [spring]);

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1C2333] p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-[#8B4BCF]">
        {label}
      </p>
      <div className="mt-2 text-4xl font-bold text-white">
        {prefix}
        {displayValue}
        {suffix}
      </div>
    </div>
  );
}
