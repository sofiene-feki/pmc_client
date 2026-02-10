import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getNewArrivals } from "../../functions/product"; // API call
import Product from "../product/Product";
import { LoadingProduct, NextArrow, PrevArrow } from "../ui";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

import { Link } from "react-router-dom";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA;

  const normalizeMediaSrc = (input) => {
    if (!input) return input;

    if (Array.isArray(input)) {
      return input.map((product) => normalizeMediaSrc(product));
    }

    if (!input.media) return input;

    const normalizedMedia = input.media.map((m) => ({
      ...m,
      src: m.src.startsWith("http") ? m.src : API_BASE_URL_MEDIA + m.src,
    }));

    return { ...input, media: normalizedMedia };
  };

  useEffect(() => {
    const fetchNewArrivals = async () => {
      setLoading(true);
      try {
        const { data } = await getNewArrivals("all");
        const normalizedProducts = normalizeMediaSrc(data.products || []);
        setProducts(normalizedProducts);
        console.log(
          "✅ New arrivals fetched and normalized:",
          normalizedProducts
        );
      } catch (err) {
        console.error("❌ Error fetching new arrivals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
       <div className="w-full bg-white">
  <div className="mx-auto md:mx-30 py-6 md:py-16 bg-white">

    {/* ===== SECTION TITLE ===== */}
    <div className="text-center mb-4">
      <h2 className="
        font-heading
        text-lg md:text-3xl
        tracking-[0.22em]
        uppercase
        text-neutral-900
        mb-3
      ">
        New Collection 2026
      </h2>

      <p className="
        font-editorial
        text-sm md:text-base
        text-neutral-600
        leading-relaxed
        px-4
      ">
        Pièces soigneusement sélectionnées pour une élégance intemporelle
      </p>
    </div>

    {/* ===== PRODUCTS GRID ===== */}
    {loading ? (
      <LoadingProduct length={isMobile ? 1 : 4} cols={4} />
    ) : (
      <div className="space-y-10">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 px-6 md:px-8">
          {products.map((product) => (
            <Product
              key={product._id || product.slug}
              product={product}
            />
          ))}
        </div>

        {/* ===== DISCOVER LINK ===== */}
        <div className="flex justify-center">
          <Link
            to="/shop"
            className="
              font-heading
              text-xs md:text-sm
              tracking-[0.18em]
              uppercase
              text-neutral-900
              border-b border-neutral-400
              pb-1
              hover:border-[#d4af37]
              hover:text-[#d4af37]
              transition-colors duration-300
            "
          >
            Discover all
          </Link>
        </div>

      </div>
    )}
  </div>
</div>


  
  );
}
