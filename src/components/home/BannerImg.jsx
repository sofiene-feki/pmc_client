import React from "react";
import banner from "../../assets/banner.png"; // adjust path

const BannerImg = ({ imageSrc, altText }) => {
  return (
    <section className="w-full">
      <img src={imageSrc} alt={altText} className="w-full h-auto object-cover" />
    </section>
  );
};

export default BannerImg;
