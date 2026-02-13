import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Import your icons
import {
  PoliceSignsIcon,
  DirectionalSignIcon,
  TemporaryConstructionSignIcon,
  MastIcon,
  SafetyWallIcon,
  BalisageIcon,
  ContouSecurityIcon,
  AllIcon,
} from "../../assets/icons/IconsPlaque";

export default function SignalisationCategory() {
  const categories = [
    { title: "Panneaux routiers", Icon: PoliceSignsIcon, link: "/boutique/signalisation/panneaux-routiers" },
    { title: "Systèmes de guidage", Icon: DirectionalSignIcon, link: "/boutique/signalisation/systemes-de-guidage" },
    { title: "Signes et Autocollants", Icon: TemporaryConstructionSignIcon, link: "/boutique/signalisation/signes-et-autocollants" },
    { title: "Système de barrières", Icon: MastIcon, link: "/boutique/signalisation/systeme-de-barrieres" },
    { title: "Signalétique", Icon: SafetyWallIcon, link: "/boutique/signalisation/signaletique" },
    { title: "Balisage de chantier", Icon: BalisageIcon, link: "/boutique/signalisation/balisage-de-chantier" },
    { title: "Contour de sécurité", Icon: ContouSecurityIcon, link: "/boutique/signalisation/contour-de-securite" },
    { title: "Tous les produits", Icon: AllIcon, link: "/boutique/signalisation" },
  ];

  return (
    <section className="py-20 bg-neutral-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight"
          >
            Signalisation <span className="text-pmc-yellow">Professionnelle</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-neutral-500 font-light max-w-3xl mx-auto"
          >
            Expert en fabrication de panneaux de signalisation permanents et matériels de chantier pour collectivités et mairies au Luxembourg.
          </motion.p>
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={cat.link}
        className="group relative flex flex-col items-center justify-center h-full min-h-[220px] p-8 bg-white rounded-2xl border border-neutral-200 transition-all duration-300 hover:border-pmc-yellow hover:shadow-xl hover:-translate-y-1"
      >
        <div className="mb-6 transition-transform duration-300 group-hover:scale-110">
          <cat.Icon
            w={70}
            h={70}
            c={isHovered ? "#f2b823" : "#001233"}
          />
        </div>
        <h3 className="text-center font-bold text-neutral-900 leading-tight">
          {cat.title}
        </h3>
        <div className="mt-4 w-6 h-1 bg-neutral-100 group-hover:w-10 group-hover:bg-pmc-yellow transition-all duration-300" />
      </Link>
    </motion.div>
  );
}
