import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Import your icons
import {
  CarIcon,
  TrailerIcon,
  TruckIcon,
  PickupIcon,
  TractorIcon,
  MotorcycleIcon,
  MopedIcon,
  AllIcon,
} from "../../assets/icons/IconsPlaque";

export default function CategoryGrid() {
  const categories = [
    { title: "Voiture", icon: <CarIcon />, link: "/shop#!/Voiture/c/124205277" },
    { title: "Remorque", icon: <TrailerIcon />, link: "/shop#!/Remorque/c/124202278" },
    { title: "Camion", icon: <TruckIcon />, link: "/shop#!/Camion/c/124206787" },
    { title: "Pick Up", icon: <PickupIcon />, link: "/shop#!/Pick-Up/c/124208287" },
    { title: "Tracteur", icon: <TractorIcon />, link: "/shop#!/Tracteur/c/124205279" },
    { title: "Moto", icon: <MotorcycleIcon />, link: "/shop#!/Moto/c/124208288" },
    { title: "Scooter", icon: <MopedIcon />, link: "/shop#!/Scooter/c/124202279" },
    { title: "Tous les produits", icon: <AllIcon />, link: "/shop#!/Plaques-dimmatriculation/c/124206781" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-12 font-black text-neutral-900 tracking-tight uppercase mb-4"
            >
              Nos <span className="text-pmc-yellow">Catégories</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-neutral-500 font-light"
            >
              Découvrez notre gamme complète de plaques et accessoires homologués pour tout type de véhicule au Luxembourg.
            </motion.p>
          </div>
          <Link to="/shop" className="group flex items-center space-x-2 text-sm font-bold tracking-widest uppercase text-pmc-blue">
            <span>Voir tout le catalogue</span>
            <span className="w-8 h-px bg-pmc-blue group-hover:w-12 transition-all duration-300" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <CategoryCard key={index} cat={cat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ cat, index }) {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={cat.link}
        className="group relative flex flex-col items-center justify-center p-8 bg-neutral-50 rounded-3xl border border-neutral-100 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-neutral-200/50 hover:-translate-y-2 overflow-hidden"
      >
        {/* Background Accent */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-pmc-yellow/5 rounded-full blur-2xl group-hover:bg-pmc-yellow/10 transition-colors" />

        <div className="relative text-6xl text-neutral-800 mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:text-pmc-yellow">
          {cat.icon}
        </div>

        <h3 className="relative text-center font-bold text-neutral-900 text-lg">
          {cat.title}
        </h3>

        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[10px] font-black uppercase tracking-widest text-pmc-yellow">Explorer →</span>
        </div>

        {/* Bottom Border Accent */}
        <div className="absolute bottom-0 left-0 w-0 h-1 bg-pmc-yellow group-hover:w-full transition-all duration-500" />
      </Link>
    </motion.div>
  );
}
