import React, { useRef } from "react";
import { motion } from "framer-motion";
import Banner from "../components/home/Banner";
import CategoryGrid from "../components/home/CategoryGrid";
import LicencePlateBanner from "../components/home/LicencePlateBanner";
import BrandStatement from "../components/home/BrandStatement";
import AddressCards from "../components/home/AddressCards";
import SignalisationCategory from "../components/home/SignalisationCategory";
import BannerImg from "../components/home/BannerImg";
import FancyPlatesBanner from "../components/home/FancyPlatesBanner";
import FancyPlatesCategory from "../components/home/FancyPlatesCategory";
import SEO from "../components/common/SEO";
import banner from "../assets/banner.png"; // adjust path
import digitalPrinting from "../assets/DigitalPrinting.png"; // adjust path
import DigitalPrintingCategory from "../components/home/DigitalPrintingCategory";
import Testimonials from "../components/home/Testimonials";


const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

export default function Home() {
  const newArrivalsRef = useRef(null);

  return (
    <div className="relative overflow-x-hidden bg-white selection:bg-pmc-yellow/30">
      <SEO
        title="Accueil"
        description="Bienvenue chez PMC Luxembourg, votre expert en plaques d'immatriculation de luxe et signalisation professionnelle."
        keywords="plaques immatriculation, Luxembourg, signalisation, PMC, luxe"
      />
      <div className="relative">
        <Banner />


        <BrandStatement />

        <LicencePlateBanner
          title="PMC Luxembourg"
          subtitle="L'excellence de la signalisation"
          triggerRef={newArrivalsRef}
        />

        {/* <div ref={newArrivalsRef} className="relative z-20 space-y-12 md:space-y-20 py-10">
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="bg-white"
          >
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="bg-gray-50/50"
          >
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
          </motion.section>
        </div> */}

        <CategoryGrid />
        <BannerImg imageSrc={banner} />
        <SignalisationCategory />
        <FancyPlatesBanner />
        <FancyPlatesCategory />
        <BannerImg imageSrc={digitalPrinting} />
        <DigitalPrintingCategory />
        <Testimonials />
        <AddressCards />

      </div>
    </div>
  );
}
