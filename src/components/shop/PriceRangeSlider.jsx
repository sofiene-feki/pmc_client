// src/components/shop/PriceRangeSlider.jsx
import React from "react";
import { Range } from "react-range";

const STEP = 5;
const MIN = 0;
const MAX = 500;

export default function PriceRangeSlider({ values, setValues }) {
  return (
    <div className="py-6">
      <div className="px-2">
        <Range
          step={STEP}
          min={MIN}
          max={MAX}
          values={values}
          onChange={setValues}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="h-1.5 w-full rounded-full bg-neutral-200 relative"
              style={{ ...props.style }}
            >
              <div
                className="h-1.5 bg-[#f2b823] rounded-full"
                style={{
                  position: "absolute",
                  left: `${((values[0] - MIN) / (MAX - MIN)) * 100}%`,
                  width: `${((values[1] - values[0]) / (MAX - MIN)) * 100}%`,
                }}
              />
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              className="h-5 w-5 rounded-full bg-white border-2 border-[#f2b823] shadow-lg cursor-pointer focus:outline-none ring-4 ring-[#f2b823]/10"
              style={{ ...props.style }}
            />
          )}
        />
      </div>

      <div className="mt-6 flex justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">Min</span>
          <span className="text-sm font-black text-neutral-900">{values[0]} €</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">Max</span>
          <span className="text-sm font-black text-neutral-900">{values[1]} €</span>
        </div>
      </div>
    </div>
  );
}
