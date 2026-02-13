import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { slugify } from "../../functions/ecwid";
import {
  CarIcon,
  TrailerIcon,
  TruckIcon,
  PickupIcon,
  TractorIcon,
  MotorcycleIcon,
  MopedIcon,
  AllIcon,
  PoliceSignsIcon,
  DirectionalSignIcon,
  TemporaryConstructionSignIcon,
  MastIcon,
  SafetyWallIcon,
  BalisageIcon,
  ContouSecurityIcon,
} from "../../assets/icons/IconsPlaque";

const iconComponentMap = {
  voiture: CarIcon,
  remorque: TrailerIcon,
  camion: TruckIcon,
  "pick-up": PickupIcon,
  tracteur: TractorIcon,
  moto: MotorcycleIcon,
  scooter: MopedIcon,
  "plaques-dimmatriculation": AllIcon,
  signalisation: PoliceSignsIcon,
  "panneaux-routiers": PoliceSignsIcon,
  "systemes-de-guidage": DirectionalSignIcon,
  "signes-et-autocollants": TemporaryConstructionSignIcon,
  "systeme-de-barrieres": MastIcon,
  signaletique: SafetyWallIcon,
  "balisage-de-chantier": BalisageIcon,
  "contour-de-securite": ContouSecurityIcon,
};

const EcwidCategoryList = ({
  categories,
  selectedCategory,
  onSelectCategory,
  categorySlug,
}) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Find context parent from slug
  const contextParent = useMemo(() => {
    if (!categorySlug) return null;
    return categories.find((cat) => slugify(cat.name) === categorySlug);
  }, [categories, categorySlug]);

  // Determine which categories to show in the main row
  const displayCategories = useMemo(() => {
    if (contextParent) {
      return categories.filter((cat) => cat.parentId === contextParent.id);
    }
    return categories.filter((cat) => !cat.parentId || cat.parentId === 0);
  }, [categories, contextParent]);

  const subCategories = useMemo(() => {
    if (contextParent) return [];
    return categories.filter((cat) => cat.parentId === selectedCategory);
  }, [categories, selectedCategory, contextParent]);

  const handleAllClick = () => {
    onSelectCategory(contextParent ? contextParent.id : null);
  };

  const isAllSelected = contextParent
    ? selectedCategory === contextParent.id
    : selectedCategory === null;

  const renderIcon = (name, isSelected, size = "large") => {
    const slug = slugify(name);
    const IconComponent = iconComponentMap[slug];
    if (!IconComponent) return null;

    const w = size === "small" ? 32 : 40;
    const h = size === "small" ? 20 : 24;
    const c = isSelected ? "#ffffff" : "#001233";

    return <IconComponent w={w} h={h} c={c} />;
  };

  const updateArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [displayCategories]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="space-y-8 mb-12">
      {/* Main Categories Slider */}
      <div className="relative group max-w-full mx-auto">
        {/* Left Fade + Arrow */}
        <AnimatePresence>
          {showLeftArrow && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hidden md:flex absolute left-0 top-0 bottom-0 z-20 w-24 items-center justify-start bg-gradient-to-r from-gray-50 via-gray-50/90 to-transparent pointer-events-none"
            >
              <button
                onClick={() => scroll("left")}
                className="pointer-events-auto p-2.5 ml-2 rounded-full bg-white shadow-xl border border-gray-100 hover:scale-110 active:scale-95 transition-all text-pmc-blue"
              >
                <FiChevronLeft size={22} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Horizontal Scroll Area */}
        <div
          ref={scrollRef}
          onScroll={updateArrows}
          className="flex flex-nowrap gap-3 overflow-x-auto scrollbar-hide scroll-smooth py-2 px-6 items-center"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAllClick}
            className={`flex-none flex items-center gap-3 px-6 py-3 rounded-md text-sm font-bold transition-all duration-300 border ${
              isAllSelected
                ? "bg-pmc-blue border-pmc-blue text-white shadow-lg shadow-pmc-blue/30"
                : "bg-white border-pmc-blue/10 text-pmc-blue hover:border-pmc-blue hover:shadow-sm"
            }`}
          >
            {contextParent ? (
              <>
                {renderIcon(contextParent.name, isAllSelected)}
                <span>Tous</span>
              </>
            ) : (
              <span>Tous les produits</span>
            )}
          </motion.button>

          {displayCategories.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <motion.button
                key={category.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectCategory(category.id)}
                className={`flex-none flex items-center gap-3 px-6 py-3 rounded-md text-sm font-bold transition-all duration-300 border ${
                  isSelected
                    ? "bg-pmc-blue border-pmc-blue text-white shadow-lg shadow-pmc-blue/30"
                    : "bg-white border-pmc-blue/10 text-pmc-blue hover:border-pmc-blue hover:shadow-sm"
                }`}
              >
                {renderIcon(category.name, isSelected)}
                {category.name}
              </motion.button>
            );
          })}
        </div>

        {/* Right Fade + Arrow */}
        <AnimatePresence>
          {showRightArrow && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hidden md:flex absolute right-0 top-0 bottom-0 z-20 w-24 items-center justify-end bg-gradient-to-l from-gray-50 via-gray-50/90 to-transparent pointer-events-none"
            >
              <button
                onClick={() => scroll("right")}
                className="pointer-events-auto p-2.5 mr-2 rounded-full bg-white shadow-xl border border-gray-100 hover:scale-110 active:scale-95 transition-all text-pmc-blue"
              >
                <FiChevronRight size={22} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sub-Categories Slider */}
      <AnimatePresence mode="wait">
        {!contextParent && subCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-6 p-1 bg-gray-100/50 rounded-2xl border border-gray-100 relative"
          >
            <div className="flex flex-nowrap items-center gap-3 overflow-x-auto scrollbar-hide py-3 px-4">
              <span className="flex-none text-[10px] font-black text-gray-400 uppercase tracking-widest border-r border-gray-200 pr-4 mr-1">
                Sous-catégories
              </span>
              {subCategories.map((sub) => {
                const isSelected = selectedCategory === sub.id;
                return (
                  <motion.button
                    key={sub.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelectCategory(sub.id)}
                    className={`flex-none flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 border ${
                      isSelected
                        ? "bg-pmc-blue border-pmc-blue text-white shadow-md font-extrabold"
                        : "bg-white border-gray-200 text-pmc-blue hover:border-pmc-blue"
                    }`}
                  >
                    {renderIcon(sub.name, isSelected, "small")}
                    {sub.name}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EcwidCategoryList;
