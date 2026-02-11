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
    <div className="w-full bg-pmc-yellow text-white py-1.5 relative z-[60] overflow-hidden hidden md:block select-none">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-center relative h-6">
        {/* Loader - Left */}
        <div className="absolute left-6 w-5 h-5 opacity-40 hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeOpacity="0.2"
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeDasharray="100"
              strokeDashoffset={100 - progress}
              strokeLinecap="round"
              className="transition-[stroke-dashoffset] duration-75"
            />
          </svg>
        </div>

        {/* Dynamic Messages */}
        <div className="relative flex items-center justify-center h-full w-full max-w-lg overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase text-center"
            >
              {MESSAGES[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Controls - Right */}
        <button
          onClick={() => setPaused((p) => !p)}
          className="absolute right-6 p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label={paused ? "Play banner" : "Pause banner"}
        >
          {paused ? (
            <PlayIcon className="w-3.5 h-3.5 text-white" />
          ) : (
            <PauseIcon className="w-3.5 h-3.5 text-white" />
          )}
        </button>
      </div>
    </div>
  );
}

