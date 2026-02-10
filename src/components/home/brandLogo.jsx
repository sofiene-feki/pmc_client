import React from "react";
import logoBlack from "../../assets/bragaouiBlack.png";

// Example data for brands/logos
const brands = [
  { name: "Clin d’Oeil Store", logo: logoBlack },
  { name: "Clin d’Oeil Store", logo: logoBlack },
  { name: "Clin d’Oeil Store", logo: logoBlack },
  { name: "Clin d’Oeil Store", logo: logoBlack },
  { name: "Clin d’Oeil Store", logo: logoBlack },
  { name: "Clin d’Oeil Store", logo: logoBlack },
  { name: "Clin d’Oeil Store", logo: logoBlack },
];

export default function HorizontalBrandScroll() {
  // Duplicate the array so we can loop seamlessly
  const scrollingBrands = [...brands, ...brands];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="overflow-hidden relative w-full bg-white border-b border-gray-200 shadow-md">
        <div className="flex animate-scroll whitespace-nowrap">
          {scrollingBrands.map((brand, index) => (
            <div
              key={index}
              className="flex items-center justify-center mx-6 flex-shrink-0"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-12 w-auto object-contain"
              />
              <span className="ml-2 text-sm font-medium font-heading">
                {brand.name}
              </span>
            </div>
          ))}
        </div>

        {/* Tailwind CSS animation */}
        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-scroll {
            display: inline-flex;
            animation: scroll 20s linear infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
