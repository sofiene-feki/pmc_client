import React, { useRef } from "react";
import { Helmet } from "react-helmet-async";

import Banner from "../components/home/Banner";
import CategoryGrid from "../components/home/CategoryGrid";
import HomeVideoSection from "../components/home/HomeVideoSection";
import NewArrivals from "../components/home/NewArrivals";
import Story from "../components/home/Story";
import BrandStatement from "../components/home/BrandStatement";
import BestSellers from "../components/home/BestSellers";
import AddressCards from "../components/home/AddressCards";
import SignalisationCategory from "../components/home/SignalisationCategory";
import BannerImg from "../components/home/BannerImg";

export default function Home() {
  const newArrivalsRef = useRef(null);

  return (
    <>
      <Helmet>
        <title>Clin d’Oeil Store – Mode Femme, Vêtements Tendance</title>
        <meta
          name="description"
          content="Découvrez Clin d’Oeil Store : boutique en ligne de vêtements tendance pour femmes, nouvelles collections et styles élégants en Tunisie."
        />
        <link rel="canonical" href="https://www.clindoeilstore.com/" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Clin d’Oeil Store – Mode Femme, Vêtements Tendance"
        />
        <meta
          property="og:description"
          content="Découvrez Clin d’Oeil Store : boutique en ligne de vêtements tendance pour femmes, nouvelles collections et styles élégants en Tunisie."
        />
        <meta property="og:url" content="https://www.clindoeilstore.com/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://www.clindoeilstore.com/og-home.jpg"
        />
      </Helmet>

      <div className="relative">
        <Banner />

        <BrandStatement />

        <div className="relative z-0">
          <div className="sticky top-0 z-10">
            <HomeVideoSection
              title="Clin Doeil Store"
              subtitle="A new vision of elegance"
              triggerRef={newArrivalsRef}
            />
          </div>

          <div ref={newArrivalsRef} className="relative z-20">
            <CategoryGrid />
          </div>
          <div className="relative z-20">
            <BannerImg />
            <SignalisationCategory />
          </div>
          <div className="relative z-20">
            <AddressCards />
          </div>
        </div>
      </div>
    </>
  );
}
