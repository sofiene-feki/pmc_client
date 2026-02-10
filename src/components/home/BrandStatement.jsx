import React from "react";

export default function BrandStatement() {
  return (
    <section
      className={`
        w-full py-12 
        transition-colors duration-1000 ease-out bg-white
      `}
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div
          className={`
            transition-colors duration-1000 ease-out
          
          `}
        >
          {/* Brand name — luxury heading */}
          <span
            className="
            block mb-6
            text-5xl
            font-bold
          "
          >
            Plaques Moins Chères
          </span>

          {/* Main statement — editorial */}
          <p
            className="
            leading-[1.9]
            text-xl 
          "
          >
            Commandez vos plaques d’immatriculation AUTO ST-1, moto, scooter et
            accessoires pour la fixation de vos plaques d’immatriculation et
            plus.
          </p>

          {/* Divider */}
          <div
            className={`w-12 h-px mx-auto my-4 transition-colors duration-1000 bg-black/30
           `}
          />
        </div>
      </div>
    </section>
  );
}
