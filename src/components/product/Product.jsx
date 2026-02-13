import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { addItem } from "../../redux/cart/cartSlice";
import { openCart } from "../../redux/ui/cartDrawer";

const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA;

export default function Product({ product, loading, index }) {
  const dispatch = useDispatch();
  const view = useSelector((state) => state.view.view);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-4 animate-pulse border border-neutral-100">
        <div className="aspect-[4/5] bg-neutral-100 rounded-2xl mb-6" />
        <div className="h-4 bg-neutral-100 rounded-full w-3/4 mb-3" />
        <div className="h-4 bg-neutral-100 rounded-full w-1/2" />
      </div>
    );
  }

  const mainMedia = product.media?.find((m) => m.type === "image");
  const imageSrc = mainMedia ? mainMedia.src : "https://via.placeholder.com/600x800";

  const originalPrice = product.Price || 0;
  const promotion = product.promotion || 0;
  const discountedPrice = (originalPrice - (originalPrice * promotion) / 100).toFixed(2);

  const sliderSettings = {
    arrows: false,
    infinite: true,
    autoplay: true,
    fade: true,
    speed: 1000,
    autoplaySpeed: 4000,
  };

  const formatPrice = (price) => {
    if (product.defaultDisplayedPriceFormatted) return product.defaultDisplayedPriceFormatted;
    return new Intl.NumberFormat("fr-LU", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link
        to={`/produit/${product.slug}`}
        className="flex flex-col bg-white rounded-[2rem] border border-neutral-100 transition-all duration-700 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] hover:-translate-y-2 overflow-hidden"
      >
        {/* IMAGE CONTAINER */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full h-full"
          >
            <Slider {...sliderSettings}>
              <div className="w-full aspect-[4/5] overflow-hidden">
                <img
                  src={imageSrc}
                  alt={product.Title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </Slider>
          </motion.div>

          {/* Promotion badge */}
          {promotion > 0 && (
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex px-3 py-1 bg-black text-white text-[10px] font-black tracking-widest uppercase rounded-full">
                −{promotion}%
              </span>
            </div>
          )}

          {/* Hover Overlay Action */}
          <div className="absolute inset-0 bg-neutral-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
            <button className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full text-[10px] font-black tracking-widest uppercase text-neutral-900 shadow-xl transition-transform hover:scale-110 active:scale-95">
              Voir Détails
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 md:p-8 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-neutral-900 leading-tight group-hover:text-[#f2b823] transition-colors">
                {product.Title}
              </h3>
              <p className="text-[10px] font-black tracking-widest uppercase text-neutral-400">
                Plaques PMC
              </p>
            </div>

            {/* Price section */}
            <div className="text-right">
              {promotion > 0 ? (
                <div className="flex flex-col items-end">
                  <span className="text-sm font-black text-neutral-900">
                    {formatPrice(discountedPrice)}
                  </span>
                  <span className="text-[11px] line-through text-neutral-400">
                    {formatPrice(originalPrice)}
                  </span>
                </div>
              ) : (
                <span className="text-sm font-black text-neutral-900">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Color variations */}
          {product.colors?.length > 0 && (
            <div className="flex items-center gap-2 pt-2">
              <div className="flex -space-x-1.5">
                {product.colors.slice(0, 4).map((color, i) => (
                  <div
                    key={i}
                    title={color.name}
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm ring-1 ring-neutral-100 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
              {product.colors.length > 4 && (
                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-tighter">
                  +{product.colors.length - 4} Plus
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
