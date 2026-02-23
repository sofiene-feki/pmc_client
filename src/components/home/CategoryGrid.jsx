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
    {
      title: "Voiture",
      Icon: CarIcon,
      link: "/boutique/plaques-dimmatriculation/voiture",
    },
    {
      title: "Remorque",
      Icon: TrailerIcon,
      link: "/boutique/plaques-dimmatriculation/remorque",
    },
    {
      title: "Camion",
      Icon: TruckIcon,
      link: "/boutique/plaques-dimmatriculation/camion",
    },
    {
      title: "Pick Up",
      Icon: PickupIcon,
      link: "/boutique/plaques-dimmatriculation/pick-up",
    },
    {
      title: "Tracteur",
      Icon: TractorIcon,
      link: "/boutique/plaques-dimmatriculation/tracteur",
    },
    {
      title: "Moto",
      Icon: MotorcycleIcon,
      link: "/boutique/plaques-dimmatriculation/moto",
    },
    {
      title: "Scooter",
      Icon: MopedIcon,
      link: "/boutique/plaques-dimmatriculation/scooter",
    },
    {
      title: "Tous",
      Icon: AllIcon,
      link: "/boutique/plaques-dimmatriculation",
    },
  ];

  return (
    <section className="py-20 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight uppercase mb-4"
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
              Découvrez notre gamme complète de plaques et accessoires
              homologués pour tout type de véhicule au Luxembourg.
            </motion.p>
          </div>
          <Link
            to="/boutique"
            className="group flex items-center space-x-2 text-sm font-bold tracking-widest uppercase text-pmc-blue"
          >
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

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      ref={ref}
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={cat.link}
        className="group relative flex flex-col items-center justify-center h-full min-h-[160px] p-5 bg-white rounded-3xl border border-neutral-100 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-neutral-200/50 hover:-translate-y-1.5 overflow-hidden"
      >
        {/* Background Accent */}
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-20 h-20 bg-pmc-yellow/5 rounded-full blur-2xl group-hover:bg-pmc-yellow/10 transition-colors" />

        <div className="relative mb-4 transition-transform duration-500 group-hover:scale-110">
          <cat.Icon w={60} h={36} c={isHovered ? "#f2b823" : "#001233"} />
        </div>

        <h3 className="relative text-center font-bold text-neutral-900 text-base leading-tight">
          {cat.title}
        </h3>

        {/* Bottom Border Accent */}
        <div className="absolute bottom-0 left-0 w-0 h-1 bg-pmc-yellow group-hover:w-full transition-all duration-500" />
      </Link>
    </motion.div>
  );
}
