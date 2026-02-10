import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { addItem } from "../../redux/cart/cartSlice";
import { openCart } from "../../redux/ui/cartDrawer";
import InnerImageZoom from "react-inner-image-zoom";

const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA;

export default function Product({ product, loading }) {
  const dispatch = useDispatch();
  const view = useSelector((state) => state.view.view);

  if (loading) {
    return (
      <div className="border rounded-md p-3 animate-pulse">
        <div className="h-64 bg-gray-200 rounded mb-3" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    );
  }

  const mainMedia = product.media?.find((m) => m.type === "image");
  const imageSrc = mainMedia
    ? mainMedia.src
    : "https://via.placeholder.com/300";

  const originalPrice = product.Price;
  const promotion = product.promotion || 0;
  const discountedPrice = (
    originalPrice -
    (originalPrice * promotion) / 100
  ).toFixed(2);

  const sliderSettings = {
    arrows: false,
    infinite: true,
    autoplay: true,
    fade: true,
    speed: 800,
    autoplaySpeed: 3500,
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
      minimumFractionDigits: 3,
    }).format(price);
  };
  return (
    <div className="group relative">
      <Link
        to={`/product/${product.slug}`}
        className="flex flex-col overflow-hidden bg-white
border border-[#f99e9a]/30
shadow-[0_12px_40px_rgba(249,158,154,0.18)]
transition-all duration-500 ease-out
group-hover:shadow-[0_20px_60px_rgba(249,158,154,0.22)]
 transition"
      >
        {/* IMAGE / SLIDER */}
        <div className="overflow-hidden">
          <Slider {...sliderSettings}>
            {/* Main image */}

            <div className="w-full aspect-[4/5] overflow-hidden rounded-b-xl">
              <img
                src={imageSrc}
                alt={product.Title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Color images */}
            {/* {product.colors?.map((color, i) => (
              <div key={i}>
                <img
                  src={`${API_BASE_URL_MEDIA}${color.src}`}
                  alt={color.name}
                  className="w-full h-96 object-cover"
                />
              </div>
            ))} */}
          </Slider>
          {/* Promotion badge */}
          {promotion > 0 && (
            <span
              className="
    absolute top-4 left-4
    px-3 py-1
    font-heading
    text-[10px]
    tracking-[0.18em]
    uppercase
    text-white
    bg-black
    border border-white/60
  "
            >
              −{promotion}%
            </span>
          )}
        </div>

        {/* CONTENT */}
        <div className=" bg-white p-2">
          {/* TITLE + COLORS */}
          <div className="flex items-center justify-between gap-2">
            <h3 className=" font-body text-md md:text-base truncate text-[#0d1b2a] group-hover:text-[#d4af37] pb-1 transition">
              {product.Title}
            </h3>

            {/* Color variations */}
            <div className="flex items-center gap-1">
              {product.colors?.slice(0, 4).map((color, i) => (
                <span
                  key={i}
                  title={color.name}
                  className="w-3.5 h-3.5 rounded-full border border-black/10 hover:scale-110 hover:ring-2 hover:ring-[#d4af37] transition"
                  style={{ backgroundColor: color.value }}
                />
              ))}
              {product.colors?.length > 4 && (
                <span className="text-[10px] text-gray-400">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* PRICE */}
          <div className="flex items-baseline gap-2 mt-1">
            {promotion > 0 ? (
              <>
                <span className="font-body text-xs line-through text-neutral-400">
                  {formatPrice(originalPrice)}
                </span>

                <span
                  className="
        font-heading
        text-sm
        tracking-[0.12em]
        text-gray-800
      "
                >
                  {formatPrice(discountedPrice)}
                </span>
              </>
            ) : (
              <span
                className="
      font-heading
      text-sm
      tracking-[0.12em]
      text-neutral-900
    "
              >
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
