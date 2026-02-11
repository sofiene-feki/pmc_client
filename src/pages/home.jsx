import React, { useRef } from "react";
import { motion } from "framer-motion";
import Banner from "../components/home/Banner";
import CategoryGrid from "../components/home/CategoryGrid";
import HomeVideoSection from "../components/home/HomeVideoSection";
import BrandStatement from "../components/home/BrandStatement";
import AddressCards from "../components/home/AddressCards";
import SignalisationCategory from "../components/home/SignalisationCategory";
import BannerImg from "../components/home/BannerImg";

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
      <div className="relative">
        <Banner />

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <BrandStatement />
        </motion.section>

        <div className="relative z-0">
          <motion.div
            className="sticky top-0 z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <HomeVideoSection
              title="PMC Luxembourg"
              subtitle="L'excellence de la signalisation"
              triggerRef={newArrivalsRef}
            />
          </motion.div>

          <div ref={newArrivalsRef} className="relative z-20 space-y-12 md:space-y-20 py-10">
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={sectionVariants}
              className="bg-white"
            >
              <CategoryGrid />
            </motion.section>

            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={sectionVariants}
            >
              <BannerImg />
            </motion.section>

            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={sectionVariants}
              className="bg-gray-50/50"
            >
              <SignalisationCategory />
            </motion.section>

            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={sectionVariants}
            >
              <AddressCards />
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}
