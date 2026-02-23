import React from "react";
import { motion } from "framer-motion";
import hero from "../../assets/hero.png";
import { Link } from "react-router-dom";

export default function LicencePlateBanner({ title, subtitle, triggerRef }) {
  return (
    <section className="relative w-full min-h-auto flex flex-col md:flex-row overflow-hidden bg-pmc-blue/95">
      {/* Visual Side */}
      <div className="relative md:w-3/5 w-full h-auto overflow-hidden">
        <img
          src={hero}
          alt="Plaque immatriculation Luxembourg"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Side */}
      <div className="md:w-2/5 w-full flex items-center justify-center p-8 md:p-16 z-10">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col items-start text-left max-w-md"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pmc-yellow/10 border border-pmc-yellow/20 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pmc-yellow opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pmc-yellow"></span>
            </span>
            <span className="text-[10px] font-bold tracking-widest text-pmc-yellow uppercase">
              Service VIP Luxembourg
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
            Plaques d’immatriculation{" "}
            <span className="text-pmc-yellow">Premium</span>
          </h2>

          <p className="text-lg text-neutral-400 mb-8 leading-relaxed font-light">
            Commandez maintenant vos plaques d’immatriculation.
            <span className="text-white"> La meilleure qualité</span> et les
            prix les plus compétitifs au Luxembourg, livrés chez vous.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link
              to="/boutique/plaques-dimmatriculation"
              className="flex-1 bg-pmc-yellow hover:bg-pmc-blue hover:text-white text-neutral-900 font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-pmc-yellow/20 text-center block"
            >
              Commander
            </Link>

            {/* <button className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold py-4 px-8 rounded-full transition-all duration-300 backdrop-blur-md">
              En savoir plus
            </button> */}
          </div>

          <div className="mt-4 flex items-center space-x-4 ">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={`https://randomuser.me/api/portraits/thumb/men/${i + 20}.jpg`}
                  className="w-8 h-8 rounded-full border-2 border-neutral-300"
                  alt="avatar"
                />
              ))}
            </div>
            <p className="text-xs text-neutral-500 font-medium">
              +20,000 clients satisfaits
            </p>
          </div>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-pmc-yellow/5 rounded-full blur-3xl" />
    </section>
  );
}
