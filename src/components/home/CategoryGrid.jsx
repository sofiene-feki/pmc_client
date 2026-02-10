import React from "react";
import { Link } from "react-router-dom";
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
} from "../../assets/icons/IconsPlaque"; // adjust path

export default function CategoryGrid() {
  const categories = [
    {
      title: "Voiture",
      icon: <CarIcon />,
      link: "/shop#!/Voiture/c/124205277",
    },
    {
      title: "Remorque",
      icon: <TrailerIcon />,
      link: "/shop#!/Remorque/c/124202278",
    },
    {
      title: "Camion",
      icon: <TruckIcon />,
      link: "/shop#!/Camion/c/124206787",
    },
    {
      title: "Pick Up",
      icon: <PickupIcon />,
      link: "/shop#!/Pick-Up/c/124208287",
    },
    {
      title: "Tracteur",
      icon: <TractorIcon />,
      link: "/shop#!/Tracteur/c/124205279",
    },
    {
      title: "Moto",
      icon: <MotorcycleIcon />,
      link: "/shop#!/Moto/c/124208288",
    },
    {
      title: "Scooter",
      icon: <MopedIcon />,
      link: "/shop#!/Scooter/c/124202279",
    },
    {
      title: "Tous les produits",
      icon: <AllIcon />,
      link: "/shop#!/Plaques-dimmatriculation/c/124206781",
    },
  ];

  return (
    <section className="mx-auto px-4 md:px-30 pt-6 md:pt-10 bg-gray-50 pb-8">
      <div className="text-center mb-8">
        <h2
          className="
            font-heading
            text-lg md:text-3xl
            tracking-[0.22em]
            uppercase
            text-neutral-900
            mb-3
          "
        >
          Nos Catégories
        </h2>

        <p
          className="
            font-editorial
            text-sm md:text-base
            text-neutral-600
            leading-relaxed
            px-4
          "
        >
          Découvrez notre gamme complète de véhicules et accessoires
          soigneusement sélectionnés
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {categories.map((cat, index) => (
          <CategoryCard key={index} cat={cat} />
        ))}
      </div>
    </section>
  );
}

function CategoryCard({ cat }) {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  return (
    <Link
      ref={ref}
      to={cat.link}
      className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-all duration-300 group"
    >
      <div
        className={`text-5xl text-primary mb-3 transition-transform duration-700 ${
          inView ? "scale-100" : "scale-90"
        }`}
      >
        {cat.icon}
      </div>
      <h3
        className={`text-center font-semibold text-gray-900 transition-opacity duration-700 ${
          inView ? "opacity-100" : "opacity-0"
        }`}
      >
        {cat.title}
      </h3>
    </Link>
  );
}
