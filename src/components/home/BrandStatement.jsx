import React from "react";
import { motion } from "framer-motion";

export default function BrandStatement() {
  return (
    <section className="w-full py-4 md:py-12 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-transparent to-neutral-200" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          {/* Accent Label */}
          <span className="inline-block text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-black mb-2">
            L'excellence <span className="text-transparent bg-clip-text bg-gradient-to-r from-pmc-blue via-pmc-yellow to-pmc-blue">au Luxembourg</span>
          </span>

          {/* Brand name — luxury heading */}
          <h2 className="text-4xl md:text-6xl font-black text-neutral-900 tracking-tight leading-none italic font-heading">
            Plaques Moins Chères
          </h2>

          {/* Main statement — editorial */}
          <div className="max-w-3xl mx-auto">
            <p className="text-lg md:text-2xl text-neutral-600 leading-relaxed font-light">
              Commandez vos plaques d’immatriculation <strong className="font-semibold text-neutral-900">AUTO ST-1</strong>,
              moto, scooter et accessoires pour la fixation. Une qualité irréprochable au meilleur prix du marché.
            </p>
          </div>

          {/* Divider & Signature */}
          <div className="pt-6">
            <div className="w-20 h-[2px] mx-auto bg-pmc-yellow" />
            <p className="mt-4 text-xs font-medium text-neutral-400 tracking-widest uppercase">
              Certifié & Homologué
            </p>
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-t from-transparent to-neutral-200" />
      </div>
    </section>
  );
}
