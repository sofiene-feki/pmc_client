import React from "react";
import { Link } from "react-router-dom";
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
} from "../../assets/icons/IconsPlaque"; // adjust path

export default function SignalisationCategory() {
  const categories = [
    {
      title: "Panneaux routiers",
      icon: <PoliceSignsIcon />,
      link: "/shop#!/Voiture/c/124205277",
    },
    {
      title: "Systèmes de guidage",
      icon: <DirectionalSignIcon />,
      link: "/categories/remorque",
    },
    {
      title: "Signes et Autocollants",
      icon: <TemporaryConstructionSignIcon />,
      link: "/categories/camion",
    },
    {
      title: "Système de barrières",
      icon: <MastIcon />,
      link: "/categories/pickup",
    },
    {
      title: "Signalétique",
      icon: <SafetyWallIcon />,
      link: "/categories/tracteur",
    },
    {
      title: "Balisage de chantier",
      icon: <BalisageIcon />,
      link: "/categories/moto",
    },
    {
      title: "Contour de sécurité",
      icon: <ContouSecurityIcon />,
      link: "/categories/scooter",
    },
    { title: "Tous les produits", icon: <AllIcon />, link: "/categories/tous" },
  ];

  return (
    <section className="mx-auto px-4 md:px-30 pt-6 md:pt-10 bg-gray-50">
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
          Panneaux de signalisation routière
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
          Nous abriquons et proposons aux collectivités, mairies, des panneaux
          de signalisation permanents. ﻿Notre entreprise est leader dans la
          fabrication de cônes de chantier en plastique et dans la vente de
          certains types de panneaux de chantier.
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
