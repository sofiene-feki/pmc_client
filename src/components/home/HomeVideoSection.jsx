import React, { useEffect, useRef, useState } from "react";
import {
  PlayIcon,
  PauseIcon,
  SpeakerXMarkIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/solid";
import hero from "../../assets/hero.png";

const SOUND_KEY = "videoSoundUnlocked";

export default function HomeVideoSection({ title, subtitle, triggerRef }) {
  return (
    <section className="sticky top-0 w-full  my-6 overflow-hidden">
      <div className="w-full h-full flex flex-col md:flex-row">
        {/* IMAGE LEFT */}
        <div className="md:w-3/5 w-full h-full">
          <img
            src={hero}
            alt="Plaque immatriculation Luxembourg"
            className="w-full h-full object-cover"
          />
        </div>

        {/* TEXT RIGHT */}
        <div className="md:w-2/5 w-full bg-[#041836] text-white flex items-center justify-center">
          <div className="flex flex-col items-center text-center px-4 md:px-8 ">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Plaques d’immatriculation
            </h2>

            <p className="text-lg md:text-xl mb-8 leading-relaxed">
              Commandez maintenant vos plaques d’immatriculation, meilleure
              qualité et prix les moins chers au Luxembourg.
            </p>

            <button className="bg-[#f2b823] hover:bg-[#d9a21f] text-black font-semibold py-3 px-6 rounded-md text-lg">
              Commandez maintenant
            </button>

            <p className="mt-4 italic text-sm opacity-80">
              Retrait gratuit ou livraison à domicile
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
