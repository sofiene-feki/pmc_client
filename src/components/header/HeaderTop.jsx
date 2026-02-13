import React, { useEffect, useState } from "react";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const MESSAGES = [
  "Encore 04h42 pour être livré le 12/02.",
  "info@pmc.lu — +352 26 56 11 97",
];

const DURATION = 4500; // loader duration

export default function TopLuxuryBanner() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (paused) return;

    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const value = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(value);

      if (value === 100) {
        clearInterval(timer);
        setProgress(0);
        setIndex((prev) => (prev + 1) % MESSAGES.length);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [paused, index]);

  return (
    <div className="w-full bg-pmc-yellow border-b border-white/10 text-white py-2 relative z-[0] overflow-hidden hidden md:block select-none">
      <div className="absolute inset-0 " />
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-center relative h-5">
        {/* Centered Content Group: Loader, Messages, Controls */}
        <div className="flex items-center gap-10 md:gap-14 h-full">
          {/* 1. Loader */}
          <div className="w-5 h-5 opacity-80 hover:opacity-100 transition-opacity flex items-center">
            <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeOpacity="0.2"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="100"
                strokeDashoffset={100 - progress}
                strokeLinecap="round"
                className="transition-[stroke-dashoffset] duration-300 ease-linear shadow-[0_0_8px_rgba(255,255,255,0.5)]"
              />
            </svg>
          </div>

          {/* 2. Dynamic Messages */}
          <div className="relative flex items-center justify-center h-full w-full max-w-2xl overflow-hidden min-w-[300px] md:min-w-[450px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                transition={{ duration: 0.6, ease: "circOut" }}
                className="text-[13px] font-black font-heading tracking-[0.4em] uppercase text-center leading-none"
              >
                {MESSAGES[index]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* 3. Controls */}
          <div className="flex items-center">
            <button
              onClick={() => setPaused((p) => !p)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all active:scale-90 flex items-center justify-center"
              aria-label={paused ? "Play banner" : "Pause banner"}
            >
              {paused ? (
                <PlayIcon className="w-4 h-4 text-white" />
              ) : (
                <PauseIcon className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

